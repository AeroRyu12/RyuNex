const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const auth = require('../../middleware/auth.js');
const { getDiscordClient } = require('../../bot');
const { loadConfig } = require('../../lib/config.server.js');
const { getCookieSettings } = require('../../middleware/shared');

const DISCORD_API = 'https://discord.com/api/v10';

class AuthError extends Error {
    constructor(message, statusCode = 400, details = null) {
        super(message);
        this.name = 'AuthError';
        this.statusCode = statusCode;
        this.details = details;
    }
}

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const authService = {
    validateConfig() {
        const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
        const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
        const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;

        if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
            throw new AuthError('Missing critical OAuth2 configuration', 500);
        }

        return { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI };
    },

    async exchangeCode(code, config) {
        try {
            const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: config.CLIENT_ID,
                    client_secret: config.CLIENT_SECRET,
                    code,
                    grant_type: 'authorization_code',
                    redirect_uri: config.REDIRECT_URI
                })
            });

            const tokenData = await tokenRes.json();

            if (!tokenRes.ok || !tokenData.access_token) {
                const errorMsg = tokenData.error_description || tokenData.error || 'Token exchange failed';
                console.error('[AUTH] Token exchange failed:', {
                    status: tokenRes.status,
                    error: tokenData.error,
                    description: tokenData.error_description,
                    tokenData
                });
                throw new AuthError(`Authentication failed: ${errorMsg}`, 400);
            }

            return tokenData;
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            console.error('[AUTH] Exchange code error:', error);
            throw new AuthError('Authentication failed', 400);
        }
    },

    async fetchUserData(accessToken) {
        try {
            const userRes = await fetch(`${DISCORD_API}/users/@me`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            const userData = await userRes.json();

            if (!userRes.ok || !userData.id) {
                console.debug('[AUTH] User data fetch failed:', userData);
                throw new AuthError('Failed to get user data', 400);
            }

            return userData;
        } catch (error) {
            console.debug('[AUTH] User data fetch error:', error);
            throw new AuthError('Failed to get user data', 400);
        }
    },

    async verifyGuildMember(userId, userData) {
        const client = getDiscordClient();
        if (!client) {
            throw new AuthError('Service temporarily unavailable', 503);
        }

        try {
            if (!client.isReady()) {
                console.error('[AUTH] Discord client not ready');
                throw new AuthError('Discord service not ready. Please try again later.', 503);
            }

            const allRoles = [];
            let foundGuildId = null;
            let foundMember = null;

            for (const guild of client.guilds.cache.values()) {
                try {
                    const member = await guild.members.fetch(userId);
                    if (member) {
                        if (!foundGuildId) {
                            foundGuildId = guild.id;
                            foundMember = member;
                        }
                        for (const role of member.roles.cache.values()) {
                            if (!allRoles.find(r => r.id === role.id)) {
                                allRoles.push({
                                    id: role.id,
                                    name: role.name,
                                    color: role.color
                                });
                            }
                        }
                    }
                } catch (memberError) {
                }
            }

            if (!foundMember) {
                throw new AuthError('User is not a member of any server the bot is in.', 401);
            }

            const allowedRoles = process.env.DASHBOARD_LOGIN_ROLES ? 
                process.env.DASHBOARD_LOGIN_ROLES.split(',').filter(role => role.trim()) : [];
            
            const hasAllowedRole = allowedRoles.length === 0 || 
                allRoles.some(role => allowedRoles.includes(role.id));

            if (!hasAllowedRole) {
                throw new AuthError('Insufficient permissions', 403);
            }

            return {
                ...userData,
                roles: allRoles,
                guildId: foundGuildId
            };
        } catch (error) {
            if (error instanceof AuthError) {
                throw error;
            }
            console.error('[AUTH] Verification failed:', error.message);
            throw new AuthError('Unable to verify server membership. Please try again.', 401);
        }
    }
};

router.get('/config', asyncHandler(async (req, res) => {
    const config = loadConfig();
    const { CLIENT_ID, REDIRECT_URI } = authService.validateConfig();
    
    const permissions = {
        Dashboard: {
            Login: (config?.Dashboard?.Permissions?.Dashboard?.Login || []).filter(id => id !== 'ROLE_ID'),
            Settings: (config?.Dashboard?.Permissions?.Dashboard?.Settings || []).filter(id => id !== 'ROLE_ID'),
            Embed: (config?.Dashboard?.Permissions?.Dashboard?.Embed || []).filter(id => id !== 'ROLE_ID'),
            Suggestions: (config?.Dashboard?.Permissions?.Dashboard?.Suggestions || []).filter(id => id !== 'ROLE_ID')
        }
    };

    res.json({ clientId: CLIENT_ID, redirectUri: REDIRECT_URI, permissions });
}));

router.get('/me', auth, asyncHandler(async (req, res) => {
    res.json({ user: req.user });
}));

router.get('/callback', async (req, res) => {
    const baseUrl = process.env.APP_URL || 'http://localhost:3005';
    
    try {
        const { code, error, error_description } = req.query;
        
        if (error) {
            console.error('[CALLBACK DEBUG] OAuth error from Discord:', { error, error_description });
            return res.redirect(`${baseUrl}/auth/signin?error=${error}`);
        }
        
        if (!code) {
            console.error('[CALLBACK DEBUG] No authorization code received');
            return res.redirect(`${baseUrl}/auth/signin?error=no_code`);
        }

        const config = authService.validateConfig();
        
        const tokenData = await authService.exchangeCode(code, config);
        
        const userData = await authService.fetchUserData(tokenData.access_token);
        
        try {
            const enhancedUserData = await authService.verifyGuildMember(userData.id, userData);
            const normalizedUserData = {
                id: enhancedUserData.id || userData.id,
                username: enhancedUserData.username || '',
                discriminator: enhancedUserData.discriminator || '0',
                avatar: enhancedUserData.avatar || null,
                guildId: enhancedUserData.guildId,
                roles: Array.isArray(enhancedUserData.roles)
                    ? enhancedUserData.roles.map((role) => typeof role === 'string' ? role : (role?.id || '')).filter(Boolean)
                    : []
            };
            
            const isProduction = process.env.NODE_ENV === 'production';
            const cookieSettings = getCookieSettings(isProduction, process.env.DOMAIN, req);
            const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');
            
            const authCookieSettings = {
                ...cookieSettings,
                maxAge: 7 * 24 * 60 * 60 * 1000,
                path: '/',
                httpOnly: true,
                sameSite: (isFirefox && cookieSettings.secure) ? 'none' : 'lax'
            };
            
            if (req.session) {
                req.session.userData = normalizedUserData;
                req.session.authToken = tokenData.access_token;
                req.session.authenticated = true;
                req.session.authenticatedAt = new Date();

                if (!req.session.csrfToken) {
                    req.session.csrfToken = require('crypto').randomBytes(32).toString('hex');
                }

                const csrfCookieSettings = {
                    ...cookieSettings,
                    httpOnly: false,
                    sameSite: (isFirefox && cookieSettings.secure) ? 'none' : 'lax'
                };

                try {
                    await new Promise((resolve, reject) => {
                        req.session.save(err => {
                            if (err) {
                                console.error('[AUTH] Session save error:', err);
                                resolve();
                            } else {
                                resolve();
                            }
                        });
                    });
                } catch (sessionError) {
                    console.error('[AUTH] Session save failed:', sessionError);
                }
                
                res.cookie('auth_token', tokenData.access_token, authCookieSettings);
                res.cookie('XSRF-TOKEN', req.session.csrfToken, csrfCookieSettings);
            } else {
                res.cookie('auth_token', tokenData.access_token, authCookieSettings);
            }

            return res.redirect(baseUrl);
        } catch (error) {
            if (error instanceof AuthError && error.statusCode === 403) {
                return res.redirect(`${baseUrl}/auth/access-denied`);
            }
            throw error;
        }
    } catch (error) {
        
        if (error instanceof AuthError) {
            if (error.statusCode === 403) {
                return res.redirect(`${baseUrl}/auth/access-denied`);
            }
            return res.redirect(`${baseUrl}/auth/signin?error=auth_error`);
        }
        
        return res.redirect(`${baseUrl}/auth/signin?error=unknown_error`);
    }
});

router.post('/logout', auth, asyncHandler(async (req, res) => {
    res.clearCookie('auth_token');
    res.json({ success: true });
}));

const statusCache = new Map();
const STATUS_CACHE_TTL = 30000;

router.get('/status', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const cached = statusCache.get(userId);
        if (cached && Date.now() < cached.expires) {
            return res.json({ status: cached.status });
        }

        const client = getDiscordClient();
        if (!client) {
            return res.json({ status: 'offline' });
        }

        let member = null;
        for (const guild of client.guilds.cache.values()) {
            member = guild.members.cache.get(userId);
            if (!member) {
                try {
                    member = await guild.members.fetch({ user: userId, force: false });
                } catch (fetchError) {
                }
            }
            if (member) break;
        }
        
        if (!member) {
            return res.json({ status: 'offline' });
        }

        const status = member?.presence?.status || 'offline';
        statusCache.set(userId, { status, expires: Date.now() + STATUS_CACHE_TTL });

        res.json({ status });
    } catch (error) {
        if (error.name !== 'GatewayRateLimitError') {
            console.error('Error fetching user status:', error);
        }
        res.json({ status: 'offline' });
    }
});

router.use((error, req, res, next) => {
    console.error('[AUTH] Error:', error);
    
    if (res.headersSent) {
        return next(error);
    }
    
    if (error instanceof AuthError) {
        return res.status(error.statusCode).json({
            error: error.message,
            ...(error.details && { details: error.details })
        });
    }

    res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;
const fetch = require('node-fetch');
const { getDiscordClient } = require('../bot');

function getAllowedRoles() {
    try {
        return process.env.ALLOWED_ROLES ? JSON.parse(process.env.ALLOWED_ROLES) : [];
    } catch (error) {
        return [];
    }
}

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.auth_token;

        if (!token) {
            return res.status(401).json({ error: 'Not authenticated', code: 'NO_AUTH_TOKEN' });
        }

        if (req.session && req.session.userData && req.session.authenticated && req.session.authToken === token) {
            if (Array.isArray(req.session.userData.roles)) {
                req.session.userData.roles = req.session.userData.roles.map((role) => typeof role === 'string' ? role : role?.id).filter(Boolean);
            }
            req.user = req.session.userData;
            return next();
        }

        const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');
        
        if (isFirefox && req.session && req.session.authToken === token) {
            try {
                await new Promise((resolve, reject) => {
                    req.session.reload(err => {
                        if (err) {
                            console.error('[AUTH] Session reload failed:', err);
                            req.session.destroy(() => {});
                            res.clearCookie('connect.sid');
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                
                if (req.session.userData && req.session.authenticated) {
                    if (Array.isArray(req.session.userData.roles)) {
                        req.session.userData.roles = req.session.userData.roles.map((role) => typeof role === 'string' ? role : role?.id).filter(Boolean);
                    }
                    req.user = req.session.userData;
                    return next();
                }
            } catch (error) {
                console.error('[AUTH] Firefox session recovery failed:', error);
            }
        }

        const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': 'DiscordBot (https://discord.com, v10)'
            }
        });

        if (!userResponse.ok) {
            res.clearCookie('auth_token');
            if (req.session) {
                req.session.destroy(() => {});
            }
            return res.status(401).json({ error: 'Invalid token' });
        }

        const userData = await userResponse.json();

        const client = getDiscordClient();
        if (!client) {
            return res.status(500).json({ error: 'Server configuration error' });
        }

        try {
            const allRoles = [];
            let foundGuildId = null;

            for (const guild of client.guilds.cache.values()) {
                try {
                    const member = await guild.members.fetch(userData.id);
                    if (member) {
                        if (!foundGuildId) {
                            foundGuildId = guild.id;
                        }
                        for (const role of member.roles.cache.values()) {
                            if (!allRoles.includes(role.id)) {
                                allRoles.push(role.id);
                            }
                        }
                    }
                } catch (memberError) {
                }
            }

            if (!foundGuildId) {
                throw new Error('User not in any guild');
            }

            const normalizedUserData = {
                id: userData.id || '',
                username: userData.username || '',
                discriminator: userData.discriminator || '0',
                avatar: userData.avatar || null,
                guildId: foundGuildId,
                roles: allRoles
            };

            if (req.session) {
                req.session.userData = normalizedUserData;
                req.session.authToken = token;
                req.session.authenticated = true;
                req.session.authenticatedAt = new Date();
                
                req.session.save(err => {
                    if (err) {
                        console.error('[AUTH] Session save error:', err);
                    }
                });
            }

            req.user = normalizedUserData;

            next();
        } catch (error) {
            res.clearCookie('auth_token');
            if (req.session) {
                req.session.destroy(() => {});
            }
            return res.status(401).json({ 
                error: 'Access Denied', 
                message: 'You must be a member of a server the bot is in with appropriate roles to access this dashboard.',
                code: 'NOT_IN_GUILD'
            });
        }
    } catch (error) {
        res.clearCookie('auth_token');
        if (req.session) {
            req.session.destroy(() => {});
        }
        return res.status(401).json({ 
            error: 'Authentication Failed', 
            message: 'Please try signing in again.',
            code: 'AUTH_FAILED'
        });
    }
};

module.exports = auth;
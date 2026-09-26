const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const { MemoryChecker } = require('../../utils/core/memoryChecker.js');
const ticketRoutes = require('./api/tickets/routes.js');
const settingsRoutes = require('./api/settings/routes.js');
const channelsRoutes = require('./api/channels/routes.js');
const { setDiscordClient, setSocketIO } = require('./bot/index.js');
const { getConfig, getLang, getCommands } = require('../../utils/core/configLoader.js');
const fs = require('fs');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const auth = require('./middleware/auth.js');
const originCheck = require('./middleware/origin-check.js');
const { verifyCsrfToken, setCsrfToken } = require('./middleware/csrf.js');
const templatesRoutes = require('./api/templates/routes');
const suggestionsRoutes = require('./api/suggestions/routes');
const customCommandsRoutes = require('./api/custom-commands/routes');
const apiRoutes = require('./api');
const session = require('express-session');
const crypto = require('crypto');
const { 
    STATIC_FILE_PATTERN, 
    PUBLIC_PATHS, 
    getCookieSettings, 
    errorHandler 
} = require('./middleware/shared');
const http = require('http');

process.env.VITE_CJS_IGNORE_WARNING = 'true';

let botMemory = 0;
let viteDevServer = null;

global.updateBotMemory = (memory) => {
    if (memory !== undefined && !isNaN(parseFloat(memory))) {
        botMemory = Math.round(parseFloat(memory) * 100) / 100;
    }
};

async function createViteDevServer(app, port) {
    const { createServer } = await import('vite');
    
    viteDevServer = await createServer({
        root: path.join(__dirname, '..'),
        server: {
            middlewareMode: true,
            hmr: {
                server: null,
                port: port + 1
            }
        },
        appType: 'spa'
    });
    
    app.use(viteDevServer.middlewares);
    global.viteDevServer = viteDevServer;
    
    return viteDevServer;
}

module.exports = async function startDashboardServer() {
    const envPath = path.join(__dirname, '..', '.env');
    require('dotenv').config({ path: envPath });

    const config = getConfig();
    const lang = getLang();

    const dashboardUrl = config.Dashboard?.Url || 'http://localhost:3000';
    const dashboardPort = config.Dashboard?.Port || 3000;
    const vitePort = process.env.VITE_PORT || config.Dashboard?.VitePort || 3001;
    const viteDevUrl = `http://localhost:${vitePort}`;
    
    const dashboardUrlObj = new URL(dashboardUrl);
    const baseUrl = `${dashboardUrlObj.protocol}//${dashboardUrlObj.hostname}`;
    
    const allowedOrigins = [dashboardUrl];
    
    if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push(viteDevUrl);
        if (dashboardUrlObj.hostname === 'localhost') {
            allowedOrigins.push(`http://127.0.0.1:${dashboardPort}`);
        } else if (dashboardUrlObj.hostname === '127.0.0.1') {
            allowedOrigins.push(`http://localhost:${dashboardPort}`);
        }
    }

    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
        const commonPorts = [5000, 3000, vitePort];
        commonPorts.forEach(port => {
            if (port !== dashboardPort) {
                allowedOrigins.push(`${baseUrl}:${port}`);
                if (dashboardUrlObj.hostname === 'localhost') {
                    allowedOrigins.push(`http://127.0.0.1:${port}`);
                } else if (dashboardUrlObj.hostname === '127.0.0.1') {
                    allowedOrigins.push(`http://localhost:${port}`);
                }
            }
        });
    }

    const app = express();
    const httpServer = http.createServer(app);

    app.use(cookieParser());
    app.use(express.json({ limit: '1mb' }));

    app.set('trust proxy', 1);

    const distPath = path.join(__dirname, '..', 'dist');
    const srcPath = path.join(__dirname, '..', 'src');
    const publicPath = path.join(__dirname, '..', 'public');
    const hasSrcFolder = fs.existsSync(srcPath) && (
        fs.existsSync(path.join(srcPath, 'main.tsx')) || 
        fs.existsSync(path.join(srcPath, 'main.js'))
    );
    const useViteDevMode = hasSrcFolder;
    
    
    if (!useViteDevMode) {
    app.use(express.static(distPath, {
        index: false,
        etag: true,
        maxAge: '1d'
    }));
    } else {
        app.use(express.static(publicPath, {
            index: false
        }));
    }

    app.use(cors({
        origin: function(origin, callback) {
            if (!origin || allowedOrigins.includes(origin) || config.Dashboard?.Development === true) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN', 'X-Requested-With', 'Cookie', 'Accept', 'Accept-Language', 'Cache-Control'],
        exposedHeaders: ['Set-Cookie', 'X-XSRF-TOKEN'],
        maxAge: 86400,
        preflightContinue: false,
        optionsSuccessStatus: 200
    }));

    const sessionSecret =
        (process.env.SESSION_SECRET && String(process.env.SESSION_SECRET).trim()) ||
        (config?.Dashboard?.Auth?.JWTSecret && String(config.Dashboard.Auth.JWTSecret).trim()) ||
        'drako-session-secret-fallback-change-me';

    let sessionStore;
    
    if (mongoose?.connection?.readyState === 1) {
        sessionStore = MongoStore.create({
            client: mongoose.connection.getClient(),
            ttl: 7 * 24 * 60 * 60,
            autoRemove: 'native',
            touchAfter: 24 * 3600,
            collectionName: 'sessions',
            stringify: false
        });
        console.log('[SESSION] Using existing mongoose connection');
    } else {
    const mongoUrl =
        (process.env.MONGODB_URI && String(process.env.MONGODB_URI).trim()) ||
            (config?.mongoURI && String(config.mongoURI).trim());

    if (!mongoUrl) {
        console.error('[SESSION] MongoDB URL is not configured');
        process.exit(1);
    }

        sessionStore = MongoStore.create({
        mongoUrl,
        ttl: 7 * 24 * 60 * 60,
        autoRemove: 'native',
        touchAfter: 24 * 3600,
        collectionName: 'sessions',
        stringify: false
    });
    }

    sessionStore.on('error', (error) => {
        if (error?.message?.includes('length') || error?.message?.includes('null')) {
            console.warn('[SESSION STORE] Session data corruption detected, sessions may need to be cleared');
        } else {
            console.error('[SESSION STORE] Error:', error);
        }
    });

    const isProductionHttps = process.env.NODE_ENV === 'production' || dashboardUrl.startsWith('https://');
    
    app.use(session({
        secret: sessionSecret,
        resave: false,
        rolling: true,
        saveUninitialized: false,
        store: sessionStore,
        proxy: true,
        cookie: {
            secure: isProductionHttps ? 'auto' : false,
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            domain: undefined
        },
        name: 'connect.sid'
    }));

    app.use((err, req, res, next) => {
        const isSessionError = err && err.message && (
            err.message.includes('session') ||
            err.message.includes('length') ||
            err.message.includes('null') ||
            err.message.includes('MongoStore')
        );
        
        if (isSessionError) {
            if (res.headersSent) {
                return next(err);
            }
            
            try {
                res.clearCookie('connect.sid');
                res.clearCookie('auth_token');
                res.clearCookie('XSRF-TOKEN');
            } catch (e) {}
            
            if (req.session) {
                req.session.destroy(() => {});
            }
            
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({ 
                    error: 'Session error',
                    message: 'Please sign in again',
                    code: 'SESSION_ERROR'
                });
            }
            return next();
        }
        next(err);
    });

    app.use((req, res, next) => {
        if (req.session) {
            const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
            const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');
            const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
            
            req.session.cookie.secure = isSecure;
            req.session.cookie.domain = undefined;
            
            if (isFirefox) {
                if (!isSecure && isLocalhost) {
                    req.session.cookie.sameSite = 'lax';
                    req.session.cookie.secure = false;
                } else if (isSecure) {
                    req.session.cookie.sameSite = 'none';
                    req.session.cookie.secure = true;
                } else {
                    req.session.cookie.sameSite = 'lax';
                }
                
                req.session.cookie.path = '/';
                req.session.cookie.httpOnly = true;
            } else {
                req.session.cookie.sameSite = 'lax';
            }
        }
        next();
    });

    app.use((req, res, next) => {
        if (!req.session) {
            return next();
        }
        if (!req.session.initialized) {
            req.session.initialized = true;
            req.session.createdAt = new Date();
        }
        next();
    });

    app.use((req, res, next) => {
        if (req.path.startsWith('/api/')) {
            const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');
            
            if (isFirefox) {
                req.setTimeout(60000, () => {
                    console.error(`[FIREFOX TIMEOUT] ${req.method} ${req.path} - Request timed out`);
                    if (!res.headersSent) {
                        res.status(408).json({ error: 'Request timeout' });
                    }
                });
                
                res.setHeader('Access-Control-Allow-Credentials', 'true');
                res.setHeader('Access-Control-Allow-Origin', req.headers.origin || dashboardUrl);
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');
            }
        }
        next();
    });

    app.use(async (req, res, next) => {
        if (!req.path.startsWith('/api/') || STATIC_FILE_PATTERN.test(req.path)) {
            return next();
        }

        if (PUBLIC_PATHS.includes(req.path) || req.path.startsWith('/api/auth/')) {
            return next();
        }

        const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');

        if (!req.session) {
            return res.status(403).json({ error: 'No session found' });
        }

        if (!req.session.csrfToken) {
            req.session.csrfToken = crypto.randomBytes(32).toString('hex');
            
            const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
            const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';
            
            let cookieOptions = {
                secure: isSecure,
                httpOnly: false,
                sameSite: isFirefox && isSecure ? 'none' : 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000
            };
            
            res.cookie('XSRF-TOKEN', req.session.csrfToken, cookieOptions);

            req.session.save((err) => {
                if (err) {
                    console.error('[SESSION] Save error:', err);
                    try {
                        res.clearCookie('connect.sid');
                    } catch (e) {}
                }
                next();
            });
        } else {
            if (isFirefox && !req.cookies['XSRF-TOKEN']) {
                const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
                
                let cookieOptions = {
                    secure: isSecure,
                    httpOnly: false,
                    sameSite: isFirefox && isSecure ? 'none' : 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                };
                
                res.cookie('XSRF-TOKEN', req.session.csrfToken, cookieOptions);
            }
            next();
        }
    });

    const rateLimit = require('express-rate-limit');

    const authLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 20,
        message: { error: 'Too many login attempts, please try again later' },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            return (req.headers['x-forwarded-for'] || 
                   req.ip || 
                   req.connection?.remoteAddress || 
                   '127.0.0.1').split(',')[0].trim();
        }
    });
    app.use('/api/auth/login', authLimiter);
    app.use('/api/auth/callback', authLimiter);

    const apiLimiter = rateLimit({
        windowMs: 1 * 60 * 1000,
        max: 200,
        message: { error: 'Too many requests, please try again later' },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: (req) => {
            const sessionId = req.session?.id;
            const ip = (req.headers['x-forwarded-for'] || 
                   req.ip || 
                   req.connection?.remoteAddress || 
                   '127.0.0.1').split(',')[0].trim();
            return sessionId ? `session:${sessionId}` : `ip:${ip}`;
        },
        skip: (req) => {
            if (PUBLIC_PATHS.includes(req.path)) return true;
            if (req.method === 'GET' && (
                req.path.startsWith('/addons/') ||
                req.path === '/auth/config' ||
                req.path === '/auth/user'
            )) return true;
            return false;
        }
    });
    app.use('/api/', apiLimiter);

    const csrfProtection = (req, res, next) => {
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
            if (!req.path.startsWith('/api/auth/') && !PUBLIC_PATHS.includes(req.path)) {
                return verifyCsrfToken(req, res, next);
            }
        }
        next();
    };

    app.use('/api/', csrfProtection);

    app.options('/api/*', (req, res) => {
        const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');
        
        if (isFirefox) {
            const requestOrigin = req.headers.origin;
            const allowedOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : allowedOrigins[0];
            res.header('Access-Control-Allow-Origin', allowedOrigin);
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-XSRF-TOKEN, X-Requested-With, Cookie, Accept, Accept-Language, Cache-Control');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Max-Age', '86400');
        }
        
        res.sendStatus(200);
    });

    const hasAuthConfig = process.env.DISCORD_CLIENT_ID &&
        process.env.DISCORD_CLIENT_SECRET &&
        process.env.DISCORD_REDIRECT_URI;

    if (hasAuthConfig) {
        const authRoutes = require('./api/auth/routes.js');
        app.use('/api/auth', authRoutes);
    } else {
        console.warn('[WARNING] Auth routes disabled - missing OAuth2 configuration');
    }

    app.use('/api', (req, res, next) => {
        if (req.path.startsWith('/auth/')) {
            return next();
        }
        return originCheck(req, res, next);
    });

    app.use('/api/tickets', ticketRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/channels', channelsRoutes);
    app.use('/api/templates', templatesRoutes);
    
    const addonRoutes = require('./api/addons/routes.js');
    app.use('/api/addons', addonRoutes);

    global.dashboardApp = app;
    global.dashboardAuth = auth;

    if (global.addonLoader) {
        const dashboardManager = global.addonLoader.getDashboardManager();
        dashboardManager.setupExpressRoutes(app, auth);
    }
    app.use('/api/custom-commands', customCommandsRoutes);
    app.use('/api/suggestions', suggestionsRoutes);

    app.get('/api/memory', (req, res) => {
        try {
            const expressMemory = Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100;
            res.json({
                usage: {
                    express: expressMemory,
                    react: 0,
                    bot: botMemory
                },
                total: expressMemory + botMemory
            });
        } catch (error) {
            console.error('[MEMORY] Error getting memory usage:', error);
            res.status(500).json({ error: 'Failed to get memory usage' });
        }
    });

    app.get('/api/health', auth, (req, res) => {
        res.json({ status: 'ok' });
    });

    app.get('/config.js', (req, res) => {
        const publicConfigPath = path.join(__dirname, '..', 'public', 'config.js');
        const distConfigPath = path.join(__dirname, '..', 'dist', 'config.js');
        
        if (fs.existsSync(publicConfigPath)) {
            res.setHeader('Content-Type', 'application/javascript');
            res.sendFile(publicConfigPath);
        } else if (fs.existsSync(distConfigPath)) {
            res.setHeader('Content-Type', 'application/javascript');
            res.sendFile(distConfigPath);
        } else {
            console.warn('[CONFIG] config.js not found, serving empty config');
            res.setHeader('Content-Type', 'application/javascript');
            res.send('window.DASHBOARD_CONFIG = {};');
        }
    });

    app.use('/api', apiRoutes);

    const args = process.argv.slice(2);
    const portIndex = args.indexOf('--port');
    const PORT = portIndex !== -1 ? parseInt(args[portIndex + 1]) : (config.Dashboard?.Port || process.env.PORT || 3000);

    let viteReady = false;
    let viteError = null;
    
    if (useViteDevMode) {
        const serveHtml = async (req, res, next) => {
            if (!viteReady) {
                if (viteError) {
                    const indexFile = path.join(distPath, 'index.html');
                    if (fs.existsSync(indexFile)) {
                        return res.sendFile(indexFile);
                    }
                    return res.status(503).send(`
                        <html>
                            <head><title>Dashboard Loading</title>
                            <style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0f;color:#fff;}
                            .loader{text-align:center}.spinner{width:40px;height:40px;border:3px solid #333;border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
                            @keyframes spin{to{transform:rotate(360deg)}}</style></head>
                            <body><div class="loader"><div class="spinner"></div><p>Dashboard failed to start. Check console.</p></div></body>
                        </html>
                    `);
                }
                return res.status(503).send(`
                    <html>
                        <head><title>Dashboard Loading</title>
                        <meta http-equiv="refresh" content="2">
                        <style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#0a0a0f;color:#fff;}
                        .loader{text-align:center}.spinner{width:40px;height:40px;border:3px solid #333;border-top-color:#3b82f6;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px}
                        @keyframes spin{to{transform:rotate(360deg)}}</style></head>
                        <body><div class="loader"><div class="spinner"></div><p>Dashboard is starting...</p></div></body>
                    </html>
                `);
            }
            
            try {
                const indexPath = path.join(__dirname, '..', 'index.html');
                let html = fs.readFileSync(indexPath, 'utf-8');
                html = await viteDevServer.transformIndexHtml(req.url, html);
                res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
            } catch (e) {
                if (viteDevServer) viteDevServer.ssrFixStacktrace(e);
                next(e);
            }
        };
        
        setImmediate(async () => {
            try {
                await createViteDevServer(app, PORT);
                viteReady = true;
                
                app.use('*', (req, res, next) => {
                    const ext = path.extname(req.originalUrl.split('?')[0]);
                    if (!ext || ext === '.html') {
                        return serveHtml(req, res, next);
                    }
                    next();
                });
            } catch (error) {
                console.error('[DASHBOARD] Failed to start Vite dev server:', error);
                viteError = error;
                
                app.use('*', serveHtml);
            }
        });
        
        app.use('*', (req, res, next) => {
            if (!viteReady && !viteError) {
                const ext = path.extname(req.originalUrl.split('?')[0]);
                if (!ext || ext === '.html') {
                    return serveHtml(req, res, next);
                }
            }
            next();
        });
    } else {
        app.use(express.static(distPath, {
            index: false,
            etag: true,
            maxAge: '1d'
        }));
        app.get('*', (req, res) => {
            const indexFile = path.join(distPath, 'index.html');
            if (fs.existsSync(indexFile)) {
                res.sendFile(indexFile);
            } else {
                res.status(503).send('Dashboard is starting up. Please refresh in a moment.');
            }
        });
    }

    app.use((err, req, res, next) => {
        const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');
        
        if (isFirefox) {
            console.error(`[FIREFOX ERROR] ${req.method} ${req.path}:`, {
                error: err.message,
                sessionExists: !!req.session
            });
        }
        
        next(err);
    });

    app.use((err, req, res, next) => {
        if (res.headersSent) {
            return next(err);
        }
        next(err);
    });

    app.use(errorHandler);

    const memoryChecker = new MemoryChecker('Backend Server');
    memoryChecker.start();

    httpServer.listen(PORT, () => {
        if (!hasAuthConfig) {
            console.warn('[DASHBOARD] Auth routes disabled - missing OAuth2 configuration');
        }
    });

    const io = new Server(httpServer, {
        cors: {
            origin: function(origin, callback) {
                if (!origin || allowedOrigins.includes(origin) || config.Dashboard?.Development === true) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            methods: ['GET', 'POST'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization', 'X-XSRF-TOKEN', 'X-Requested-With', 'Cookie']
        },
        transports: ['polling', 'websocket'],
        allowEIO3: true,
        pingTimeout: 60000,
        pingInterval: 25000,
        upgradeTimeout: 30000,
        maxHttpBufferSize: 1e6,
        allowUpgrades: true,
        perMessageDeflate: false,
        httpCompression: false,
        cookie: {
            name: 'io',
            httpOnly: false,
            path: '/',
            sameSite: 'lax'
        }
    });

    io.engine.on('connection_error', (err) => {
        const userAgent = err.req?.headers['user-agent'] || '';
        const isFirefox = typeof userAgent === 'string' && userAgent.includes('Firefox');
        if (isFirefox && (err?.message === 'Session ID unknown' || err?.code === 1)) {
            return;
        }
    //    console.error('[SOCKET] Connection error:', {
    //        req: err.req?.url,
    //        code: err.code,
    //        message: err.message,
    //        context: err.context,
    //        userAgent
    //    });
    });

    io.on('connection', (socket) => {
        const isFirefox = socket.handshake.headers['user-agent'] && socket.handshake.headers['user-agent'].includes('Firefox');
        
        if (isFirefox) {
            socket.conn.pingTimeout = 120000;
            socket.conn.pingInterval = 50000;
        }
        
        socket.on('disconnect', (reason) => {
            if (isFirefox && reason === 'transport error') {
                return;
            }
        });
        
        socket.on('error', (error) => {
            if (isFirefox && (error?.message === 'Session ID unknown' || error === 'Session ID unknown')) {
                return;
            }
            console.error(`[SOCKET] Socket error for ${socket.id}:`, error);
        });
    });
    
    setSocketIO(io);

    if (global.client) {
        setDiscordClient(global.client);

        if (!global.client.isReady()) {
        }

        if (!global.client.options.intents.has('GuildMembers')) {
            console.warn('[WARNING] Discord client is missing GuildMembers intent. Authentication may fail.');
        }
    } else {
        console.error('[ERROR] Global Discord client not available. Authentication will not work properly.');
        const configClient = {
            user: { id: config.Dashboard.ClientID },
            application: { id: config.Dashboard.ClientID },
            isReady: () => false
        };
        setDiscordClient(configClient);
    }

    const gracefulShutdown = async () => {
        if (viteDevServer) {
            await viteDevServer.close();
        }

        io.close(() => {
        });

        httpServer.close(() => {
        });

        if (memoryChecker) {
            memoryChecker.stop();
        }
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    return httpServer;
};
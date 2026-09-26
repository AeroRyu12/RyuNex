const path = require('path');
const { getConfig, getLang, getCommands } = require('../../../utils/core/configLoader.js');

let config;
try {
    config = getConfig();
} catch (e) {
    console.error('[ERROR] Error loading config:', e);
    process.exit(1);
}

const dashboardUrl = config.Dashboard?.Url || 'http://localhost:3000';
const dashboardPort = config.Dashboard?.Port || 3000;
const vitePort = process.env.VITE_PORT || config.Dashboard?.VitePort || 3001;
const isDevelopment = process.env.NODE_ENV !== 'production';
const isDevMode = config.Dashboard?.Development === true;

const dashboardUrlObj = new URL(dashboardUrl);
const baseUrl = `${dashboardUrlObj.protocol}//${dashboardUrlObj.hostname}`;

const allowedOrigins = [dashboardUrl, `http://localhost:${vitePort}`];

if (dashboardUrlObj.hostname === 'localhost') {
    allowedOrigins.push(`http://127.0.0.1:${dashboardPort}`);
} else if (dashboardUrlObj.hostname === '127.0.0.1') {
    allowedOrigins.push(`http://localhost:${dashboardPort}`);
}

if (isDevelopment || isDevMode) {
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

function originCheck(req, res, next) {
    if (isDevelopment && isDevMode) {
        return next();
    }

    const origin = req.headers.origin;
    const referer = req.headers.referer;
    const isFirefox = req.headers['user-agent'] && req.headers['user-agent'].includes('Firefox');

    if (isFirefox && !origin && !referer) {
        return next();
    }

    if (origin && allowedOrigins.includes(origin)) {
        next();
    } else if (referer && allowedOrigins.some(allowed => referer.startsWith(allowed))) {
        next();
    } else if (isFirefox && origin === null) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
}

module.exports = originCheck;
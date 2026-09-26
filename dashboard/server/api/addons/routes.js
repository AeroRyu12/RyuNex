const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/config', (req, res) => {
    try {
        if (!global.addonLoader) {
            return res.json({ pages: [], navItems: [] });
        }

        const dashboardManager = global.addonLoader.getDashboardManager();
        const config = dashboardManager.getClientConfig();
        
        res.json(config);
    } catch (error) {
        console.error('[ADDON API] Error getting addon config:', error);
        res.status(500).json({ error: 'Failed to get addon config' });
    }
});

router.get('/list', (req, res) => {
    try {
        if (!global.addonLoader) {
            return res.json({ addons: [] });
        }

        const addons = global.addonLoader.getAllAddons();
        const addonsWithDashboard = addons.filter(a => a.hasDashboard);
        
        res.json({
            addons: addonsWithDashboard.map(a => ({
                name: a.name,
                version: a.version,
                description: a.description,
                author: a.author,
                dashboardInfo: a.dashboardInfo
            }))
        });
    } catch (error) {
        console.error('[ADDON API] Error listing addons:', error);
        res.status(500).json({ error: 'Failed to list addons' });
    }
});

router.get('/component/:addonName/*', (req, res) => {
    try {
        const { addonName } = req.params;
        const componentPath = req.params[0];
        
        if (!global.addonLoader) {
            return res.status(404).json({ error: 'Addon loader not available' });
        }

        const dashboardManager = global.addonLoader.getDashboardManager();
        const assetsPath = dashboardManager.getAddonAssets(addonName);
        
        if (!assetsPath) {
            return res.status(404).json({ error: 'Addon assets not found' });
        }

        const fullPath = path.join(assetsPath, componentPath);
        
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ error: 'Component not found' });
        }

        const ext = path.extname(fullPath);
        const contentTypes = {
            '.js': 'application/javascript',
            '.jsx': 'application/javascript',
            '.tsx': 'application/javascript',
            '.ts': 'application/javascript',
            '.css': 'text/css',
            '.json': 'application/json'
        };

        res.setHeader('Content-Type', contentTypes[ext] || 'text/plain');
        res.sendFile(fullPath);
    } catch (error) {
        console.error('[ADDON API] Error serving component:', error);
        res.status(500).json({ error: 'Failed to serve component' });
    }
});

router.get('/resolve/:addonName/*', (req, res) => {
    try {
        const { addonName } = req.params;
        const pagePath = req.params[0] || 'index';
        const addonNameLower = addonName.toLowerCase();
        
        const addonsDir = path.resolve(process.cwd(), 'addons');
        const addonDir = fs.readdirSync(addonsDir).find(dir => {
            // First check if directory name matches
            if (dir.toLowerCase() === addonNameLower) return true;
            
            const addonMainPath = path.join(addonsDir, dir);
            if (!fs.statSync(addonMainPath).isDirectory()) return false;
            
            const mainFiles = fs.readdirSync(addonMainPath).filter(f => 
                f.endsWith('.js') && !f.startsWith('cmd_')
            );
            
            for (const file of mainFiles) {
                try {
                    const mod = require(path.join(addonMainPath, file));
                    // Case-insensitive name match
                    if (mod.name && mod.name.toLowerCase() === addonNameLower) return true;
                } catch (e) {}
            }
            return false;
        });

        if (!addonDir) {
            return res.status(404).json({ error: 'Addon not found' });
        }

        const pagesDir = path.join(addonsDir, addonDir, 'dashboard', 'pages');
        
        if (!fs.existsSync(pagesDir)) {
            return res.status(404).json({ error: 'Addon pages directory not found' });
        }

        const possibleFiles = [
            `${pagePath}.jsx`,
            `${pagePath}.tsx`,
            `${pagePath}.js`,
            `${pagePath}/index.jsx`,
            `${pagePath}/index.tsx`,
            `${pagePath}/index.js`
        ];

        let foundFile = null;
        for (const file of possibleFiles) {
            const fullPath = path.join(pagesDir, file);
            if (fs.existsSync(fullPath)) {
                foundFile = file;
                break;
            }
        }

        if (!foundFile) {
            return res.status(404).json({ error: 'Page not found' });
        }

        // Return absolute path with /@fs/ prefix for Vite to serve
        const absolutePath = path.join(pagesDir, foundFile).replace(/\\/g, '/');
        const modulePath = `/@fs/${absolutePath}`;
        res.json({ modulePath });
    } catch (error) {
        console.error('[ADDON API] Error resolving page:', error);
        res.status(500).json({ error: 'Failed to resolve page' });
    }
});

router.get('/page/:addonName/*', async (req, res) => {
    try {
        const { addonName } = req.params;
        const pagePath = req.params[0] || 'index';
        const addonNameLower = addonName.toLowerCase();
        
        const addonsDir = path.resolve(process.cwd(), 'addons');
        const addonDir = fs.readdirSync(addonsDir).find(dir => {
            // First check if directory name matches
            if (dir.toLowerCase() === addonNameLower) return true;
            
            const addonMainPath = path.join(addonsDir, dir);
            if (!fs.statSync(addonMainPath).isDirectory()) return false;
            
            const mainFiles = fs.readdirSync(addonMainPath).filter(f => 
                f.endsWith('.js') && !f.startsWith('cmd_')
            );
            
            for (const file of mainFiles) {
                try {
                    const mod = require(path.join(addonMainPath, file));
                    // Case-insensitive name match
                    if (mod.name && mod.name.toLowerCase() === addonNameLower) return true;
                } catch (e) {}
            }
            return false;
        });

        if (!addonDir) {
            return res.status(404).json({ error: 'Addon not found' });
        }

        const pagesDir = path.join(addonsDir, addonDir, 'dashboard', 'pages');
        
        if (!fs.existsSync(pagesDir)) {
            return res.status(404).json({ error: 'Addon pages directory not found' });
        }

        const possibleFiles = [
            `${pagePath}.jsx`,
            `${pagePath}.tsx`,
            `${pagePath}.js`,
            `${pagePath}/index.jsx`,
            `${pagePath}/index.tsx`,
            `${pagePath}/index.js`
        ];

        let foundFile = null;
        let foundFileName = null;
        for (const file of possibleFiles) {
            const fullPath = path.join(pagesDir, file);
            if (fs.existsSync(fullPath)) {
                foundFile = fullPath;
                foundFileName = file;
                break;
            }
        }

        if (!foundFile) {
            return res.status(404).json({ error: 'Page not found' });
        }

        // Use Vite to transform JSX/TSX files
        const viteDevServer = global.viteDevServer;
        if (viteDevServer && (foundFile.endsWith('.jsx') || foundFile.endsWith('.tsx'))) {
            try {
                const relativePath = `/addons/${addonDir}/dashboard/pages/${foundFileName}`;
                const result = await viteDevServer.transformRequest(relativePath);
                if (result) {
                    res.setHeader('Content-Type', 'application/javascript');
                    return res.send(result.code);
                }
            } catch (transformError) {
                console.error('[ADDON API] Vite transform error:', transformError);
            }
        }

        // Fallback: serve raw file (for .js files or if Vite not available)
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(foundFile);
    } catch (error) {
        console.error('[ADDON API] Error serving page:', error);
        res.status(500).json({ error: 'Failed to serve page' });
    }
});

// Dynamic addon API route handler - catches /:addonName/* for registered addon routes
router.all('/:addonName/*', async (req, res, next) => {
    const addonName = req.params.addonName.toLowerCase();
    const subPath = '/' + req.params[0];
    const method = req.method.toLowerCase();
    
    if (!global.addonLoader) {
        return next();
    }
    
    const dashboardManager = global.addonLoader.getDashboardManager();
    const routes = dashboardManager.getApiRoutes();
    
    // Find matching route
    const route = routes.find(r => 
        r.addonName.toLowerCase() === addonName && 
        r.path === subPath && 
        r.method.toLowerCase() === method
    );
    
    if (!route) {
        return next();
    }
    
    // Check requiredRoles if specified
    if (route.requiredRoles && route.requiredRoles.length > 0) {
        const user = req.user || req.session?.userData;
        
        if (!user || !user.roles) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        
        const hasRole = route.requiredRoles.some(roleId => 
            user.roles.includes(roleId) || 
            user.roles.some(r => r.id === roleId || r === roleId)
        );
        
        if (!hasRole) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
    }
    
    // Execute handler
    try {
        await route.handler(req, res, next);
    } catch (err) {
        console.error(`[ADDON API] Handler error:`, err);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Addon API error' });
        }
    }
});

module.exports = router;


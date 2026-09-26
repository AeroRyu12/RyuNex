const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    dest: path.join(process.cwd(), 'temp', 'uploads'),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/zip' || path.extname(file.originalname) === '.zip') {
            cb(null, true);
        } else {
            cb(new Error('Only ZIP files are allowed'), false);
        }
    }
});

let addonManager = null;

function getAddonManager() {
    if (!addonManager) {
        try {
            const clientModule = require('../../bot/client');
            if (clientModule && clientModule.addonManager) {
                addonManager = clientModule.addonManager;
            }
        } catch (error) {
            console.error('Failed to get addon manager:', error);
        }
    }
    return addonManager;
}

router.get('/', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const addons = manager.getAllAddons();
        const status = manager.getStatus();
        
        const addonData = addons.map(addon => ({
            name: addon.name,
            manifest: addon.manifest,
            loaded: addon.loaded,
            hasCommands: addon.commands.size > 0,
            hasEvents: addon.events.size > 0,
            config: manager.getAddonConfig(addon.name)
        }));

        res.json({
            addons: addonData,
            status: status
        });
    } catch (error) {
        console.error('Error fetching addons:', error);
        res.status(500).json({ error: 'Failed to fetch addons' });
    }
});

router.get('/:name', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const addon = manager.getAddon(req.params.name);
        if (!addon) {
            return res.status(404).json({ error: 'Addon not found' });
        }

        const validation = await manager.validateAddon(req.params.name);
        const config = manager.getAddonConfig(req.params.name);

        res.json({
            ...addon,
            validation,
            config,
            commands: Array.from(addon.commands.keys()),
            events: Array.from(addon.events.keys())
        });
    } catch (error) {
        console.error('Error fetching addon:', error);
        res.status(500).json({ error: 'Failed to fetch addon details' });
    }
});

router.post('/:name/load', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        await manager.loadAddon(req.params.name);
        res.json({ message: 'Addon loaded successfully' });
    } catch (error) {
        console.error('Error loading addon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:name/unload', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        await manager.unloadAddon(req.params.name);
        res.json({ message: 'Addon unloaded successfully' });
    } catch (error) {
        console.error('Error unloading addon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:name/reload', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        await manager.reloadAddon(req.params.name);
        res.json({ message: 'Addon reloaded successfully' });
    } catch (error) {
        console.error('Error reloading addon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:name/config', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const config = manager.getAddonConfig(req.params.name);
        res.json({ config });
    } catch (error) {
        console.error('Error fetching addon config:', error);
        res.status(500).json({ error: 'Failed to fetch addon configuration' });
    }
});

router.put('/:name/config', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const { config } = req.body;
        if (!config) {
            return res.status(400).json({ error: 'Configuration data is required' });
        }

        manager.updateAddonConfig(req.params.name, config);
        res.json({ message: 'Configuration updated successfully' });
    } catch (error) {
        console.error('Error updating addon config:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:name/validate', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const validation = await manager.validateAddon(req.params.name);
        res.json(validation);
    } catch (error) {
        console.error('Error validating addon:', error);
        res.status(500).json({ error: 'Failed to validate addon' });
    }
});

router.post('/create', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const { name, template = 'basic' } = req.body;
        
        if (!name || typeof name !== 'string') {
            return res.status(400).json({ error: 'Valid addon name is required' });
        }

        if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
            return res.status(400).json({ error: 'Addon name can only contain letters, numbers, hyphens, and underscores' });
        }

        const addonPath = await manager.createAddon(name, template);
        res.json({ 
            message: 'Addon created successfully',
            name,
            path: addonPath
        });
    } catch (error) {
        console.error('Error creating addon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:name', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        await manager.deleteAddon(req.params.name);
        res.json({ message: 'Addon deleted successfully' });
    } catch (error) {
        console.error('Error deleting addon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/:name/export', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const outputPath = path.join(process.cwd(), 'temp', 'exports', `${req.params.name}.zip`);
        
        const exportDir = path.dirname(outputPath);
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        await manager.exportAddon(req.params.name, outputPath);
        
        res.download(outputPath, `${req.params.name}.zip`, (err) => {
            if (err) {
                console.error('Error downloading addon:', err);
            }
            
            try {
                fs.unlinkSync(outputPath);
            } catch (cleanupError) {
                console.error('Failed to cleanup export file:', cleanupError);
            }
        });
    } catch (error) {
        console.error('Error exporting addon:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/import', upload.single('addon'), async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const overwrite = req.body.overwrite === 'true';
        const addonName = await manager.importAddon(req.file.path, overwrite);

        try {
            fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
            console.error('Failed to cleanup uploaded file:', cleanupError);
        }

        res.json({
            message: 'Addon imported successfully',
            name: addonName
        });
    } catch (error) {
        console.error('Error importing addon:', error);
        
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
                console.error('Failed to cleanup uploaded file:', cleanupError);
            }
        }
        
        res.status(500).json({ error: error.message });
    }
});

router.get('/templates/list', (req, res) => {
    const templates = [
        {
            name: 'basic',
            description: 'Basic addon with minimal structure',
            includes: ['manifest', 'config', 'main class']
        },
        {
            name: 'command',
            description: 'Addon with a slash command',
            includes: ['manifest', 'config', 'main class', 'sample command']
        },
        {
            name: 'event',
            description: 'Addon with event handlers',
            includes: ['manifest', 'config', 'main class', 'sample event']
        },
        {
            name: 'full',
            description: 'Complete addon with commands, events, and database schema',
            includes: ['manifest', 'config', 'main class', 'commands', 'events', 'database schema']
        }
    ];

    res.json({ templates });
});

router.get('/status', async (req, res) => {
    try {
        const manager = getAddonManager();
        if (!manager) {
            return res.status(503).json({ error: 'Addon manager not available' });
        }

        const status = manager.getStatus();
        res.json(status);
    } catch (error) {
        console.error('Error fetching addon status:', error);
        res.status(500).json({ error: 'Failed to fetch addon status' });
    }
});

router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large (max 50MB)' });
        }
    }
    
    if (error.message === 'Only ZIP files are allowed') {
        return res.status(400).json({ error: error.message });
    }
    
    console.error('Addon API error:', error);
    res.status(500).json({ error: 'Internal server error' });
});

module.exports = router;

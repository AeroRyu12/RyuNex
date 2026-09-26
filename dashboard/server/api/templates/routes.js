const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { loadConfig } = require('../../lib/config.server.js');
const { EmbedTemplate, ComponentsV2Template } = require('../../../../commands/Utility/embed.js');

const checkEmbedPermissions = async (req, res, next) => {
    try {
        const config = loadConfig();
        const allowedRoles = config?.Dashboard?.Permissions?.Dashboard?.Embed || [];
        const userRoles = req.user?.roles || [];

        if (!userRoles.some(role => allowedRoles.includes(role))) {
            return res.status(403).json({ error: 'You do not have permission to use the embed builder' });
        }

        next();
    } catch (error) {
        console.error('Error checking embed permissions:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.get('/', auth, checkEmbedPermissions, async (req, res) => {
    try {
        const templates = await EmbedTemplate.find();
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch templates' });
    }
});

router.post('/', auth, checkEmbedPermissions, async (req, res) => {
    try {
        const { name, embedData, linkButtons } = req.body;
        
        if (!embedData || (!embedData.title?.trim() && !embedData.description?.trim())) {
            return res.status(400).json({ 
                message: 'Template must have at least a title or description' 
            });
        }

        const existingTemplate = await EmbedTemplate.findOne({ name });
        if (existingTemplate) {
            await EmbedTemplate.findOneAndUpdate({ name }, {
                embedData,
                linkButtons
            });
            res.json({ message: 'Template updated successfully' });
        } else {
            const template = new EmbedTemplate({
                name,
                embedData,
                linkButtons
            });
            await template.save();
            res.json({ message: 'Template created successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to create/update template' });
    }
});

router.delete('/:id', auth, checkEmbedPermissions, async (req, res) => {
    try {
        await EmbedTemplate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete template' });
    }
});

router.get('/v2', auth, checkEmbedPermissions, async (req, res) => {
    try {
        const templates = await ComponentsV2Template.find().sort({ updatedAt: -1 });
        res.json(templates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch V2 templates' });
    }
});

router.post('/v2', auth, checkEmbedPermissions, async (req, res) => {
    try {
        const { name, components } = req.body;
        
        if (!name?.trim()) {
            return res.status(400).json({ message: 'Template name is required' });
        }
        
        if (!components || components.length === 0) {
            return res.status(400).json({ message: 'Template must have at least one component' });
        }

        const existingTemplate = await ComponentsV2Template.findOne({ name });
        if (existingTemplate) {
            existingTemplate.components = components;
            existingTemplate.updatedAt = new Date();
            await existingTemplate.save();
            res.json({ message: 'Template updated successfully' });
        } else {
            const template = new ComponentsV2Template({ name, components });
            await template.save();
            res.json({ message: 'Template created successfully' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to save template' });
    }
});

router.delete('/v2/:id', auth, checkEmbedPermissions, async (req, res) => {
    try {
        await ComponentsV2Template.findByIdAndDelete(req.params.id);
        res.json({ message: 'Template deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete template' });
    }
});

module.exports = router;
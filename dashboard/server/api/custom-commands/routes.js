const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const requireRoles = require('../../middleware/roles');
const CustomCommand = require('../../../../models/CustomCommand');
const { getDiscordClient } = require('../../bot');

function getSettingsRoles() {
    if (process.env.DASHBOARD_SETTINGS_ROLES) {
        const roles = process.env.DASHBOARD_SETTINGS_ROLES.split(',').filter(role => role.trim());
        return roles;
    }
    
    try {
        const configPath = require('path').join(__dirname, '../../../dist/config.js');
        const configContent = require('fs').readFileSync(configPath, 'utf8')
            .replace(/\/\/ Generated from config\.yml - DO NOT EDIT DIRECTLY\s*/, '')
            .replace('window.DASHBOARD_CONFIG = ', '')
            .replace(/;$/, '');
        
        const config = JSON.parse(configContent);
        
        if (config?.PERMISSIONS?.Dashboard?.Settings) {
            return config.PERMISSIONS.Dashboard.Settings.filter(role => role && role !== 'ROLE_ID');
        }
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Error loading config:', error);
    }
    
    return [];
}

const requireSettingsRoles = requireRoles(getSettingsRoles);

router.get('/', [auth, requireSettingsRoles], async (req, res) => {
    try {
        const guildId = req.user.guildId;
        if (!guildId) {
            return res.status(400).json({ error: 'No guild ID available' });
        }

        const commands = await CustomCommand.find({ guildId }).sort({ name: 1 });
        res.json(commands);
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Failed to fetch commands:', error);
        res.status(500).json({ error: 'Failed to fetch custom commands' });
    }
});

router.get('/:id', [auth, requireSettingsRoles], async (req, res) => {
    try {
        const guildId = req.user.guildId;
        const command = await CustomCommand.findOne({ _id: req.params.id, guildId });
        
        if (!command) {
            return res.status(404).json({ error: 'Command not found' });
        }

        res.json(command);
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Failed to fetch command:', error);
        res.status(500).json({ error: 'Failed to fetch custom command' });
    }
});

router.post('/', [auth, requireSettingsRoles], async (req, res) => {
    try {
        const guildId = req.user.guildId;
        const { name, type, text, embed, roles, options, buttons, enabled } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Command name is required' });
        }

        const commandName = name.toLowerCase().trim().replace(/\s+/g, '-');

        if (!/^[a-z0-9-]+$/.test(commandName)) {
            return res.status(400).json({ error: 'Command name can only contain letters, numbers, and hyphens' });
        }

        const existing = await CustomCommand.findOne({ guildId, name: commandName });
        if (existing) {
            return res.status(400).json({ error: 'A command with this name already exists' });
        }

        if (!type || !['EMBED', 'TEXT', 'BOTH'].includes(type)) {
            return res.status(400).json({ error: 'Invalid command type' });
        }

        if (type === 'TEXT' && (!text || !text.trim())) {
            return res.status(400).json({ error: 'Text content is required for TEXT type commands' });
        }

        if (type === 'EMBED' && (!embed?.title?.trim() && (!embed?.description || embed.description.length === 0))) {
            return res.status(400).json({ error: 'Embed must have at least a title or description' });
        }

        const command = new CustomCommand({
            guildId,
            name: commandName,
            type,
            text: text?.trim() || '',
            embed: embed || {
                title: '',
                description: [],
                color: '#5865F2',
                footer: { text: '', icon: '' },
                author: { text: '', icon: '' },
                thumbnail: '',
                image: '',
                fields: []
            },
            roles: {
                whitelist: roles?.whitelist?.filter(r => r && r !== 'ROLE_ID') || []
            },
            options: {
                deleteTriggerMessage: options?.deleteTriggerMessage || false,
                replyToUser: options?.replyToUser || false
            },
            buttons: buttons || [],
            enabled: enabled !== false
        });

        await command.save();

        if (global.client) {
            global.client.emit('customCommandUpdated', guildId);
        }

        res.status(201).json(command);
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Failed to create command:', error);
        res.status(500).json({ error: 'Failed to create custom command' });
    }
});

router.put('/:id', [auth, requireSettingsRoles], async (req, res) => {
    try {
        const guildId = req.user.guildId;
        const { name, type, text, embed, roles, options, buttons, enabled } = req.body;

        const existingCommand = await CustomCommand.findOne({ _id: req.params.id, guildId });
        if (!existingCommand) {
            return res.status(404).json({ error: 'Command not found' });
        }

        if (name) {
            const commandName = name.toLowerCase().trim().replace(/\s+/g, '-');
            
            if (!/^[a-z0-9-]+$/.test(commandName)) {
                return res.status(400).json({ error: 'Command name can only contain letters, numbers, and hyphens' });
            }

            const duplicate = await CustomCommand.findOne({ 
                guildId, 
                name: commandName,
                _id: { $ne: req.params.id }
            });
            if (duplicate) {
                return res.status(400).json({ error: 'A command with this name already exists' });
            }

            existingCommand.name = commandName;
        }

        if (type) {
            if (!['EMBED', 'TEXT', 'BOTH'].includes(type)) {
                return res.status(400).json({ error: 'Invalid command type' });
            }
            existingCommand.type = type;
        }

        if (text !== undefined) existingCommand.text = text.trim();
        if (embed) existingCommand.embed = embed;
        if (roles) {
            existingCommand.roles = {
                whitelist: roles.whitelist?.filter(r => r && r !== 'ROLE_ID') || []
            };
        }
        if (options) {
            existingCommand.options = {
                deleteTriggerMessage: options.deleteTriggerMessage || false,
                replyToUser: options.replyToUser || false
            };
        }
        if (buttons) existingCommand.buttons = buttons;
        if (enabled !== undefined) existingCommand.enabled = enabled;

        await existingCommand.save();

        if (global.client) {
            global.client.emit('customCommandUpdated', guildId);
        }

        res.json(existingCommand);
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Failed to update command:', error);
        res.status(500).json({ error: 'Failed to update custom command' });
    }
});

router.delete('/:id', [auth, requireSettingsRoles], async (req, res) => {
    try {
        const guildId = req.user.guildId;
        
        const command = await CustomCommand.findOneAndDelete({ _id: req.params.id, guildId });
        if (!command) {
            return res.status(404).json({ error: 'Command not found' });
        }

        if (global.client) {
            global.client.emit('customCommandUpdated', guildId);
        }

        res.json({ success: true, message: 'Command deleted successfully' });
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Failed to delete command:', error);
        res.status(500).json({ error: 'Failed to delete custom command' });
    }
});

router.patch('/:id/toggle', [auth, requireSettingsRoles], async (req, res) => {
    try {
        const guildId = req.user.guildId;
        
        const command = await CustomCommand.findOne({ _id: req.params.id, guildId });
        if (!command) {
            return res.status(404).json({ error: 'Command not found' });
        }

        command.enabled = !command.enabled;
        await command.save();

        if (global.client) {
            global.client.emit('customCommandUpdated', guildId);
        }

        res.json(command);
    } catch (error) {
        console.error('[CUSTOM-COMMANDS] Failed to toggle command:', error);
        res.status(500).json({ error: 'Failed to toggle custom command' });
    }
});

module.exports = router;
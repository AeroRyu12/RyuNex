const path = require('path');
const { getConfig, getLang, getCommands } = require('../../../utils/core/configLoader.js');

function loadConfig() {
    try {
        return getConfig();
    } catch (error) {
        console.error('Error loading config:', error);
        return null;
    }
}

module.exports = { loadConfig };
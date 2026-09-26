
process.env.SUPPRESS_EMOJI_URL_DEPRECATION = 'true';

global.io = global.io || null;

let isHandlerSetup = false;

function setDiscordClient(client) {
    if (!client) return;

    if (!isHandlerSetup) {
        client.on('presenceUpdate', (oldPresence, newPresence) => {
            if (global.io) {
                global.io.emit('presenceUpdate', {
                    userId: newPresence.userId,
                    status: newPresence.status || 'offline'
                });
            }
        });
        
        isHandlerSetup = true;
    }

    global.discordClient = client;
}

function getDiscordClient() {
    return global.discordClient;
}

function setSocketIO(io) {
    global.io = io;
}

module.exports = {
    setDiscordClient,
    getDiscordClient,
    setSocketIO
};
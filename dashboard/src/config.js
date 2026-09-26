const apiUrl = window.ENV?.API_URL || window.location.origin;
const defaultConfig = {
  API_URL: `/api`,
  DISCORD: {
    CLIENT_ID: "",
    REDIRECT_URI: `${apiUrl}/api/auth/callback`,
    GUILD_ID: ""
  },
  PERMISSIONS: {
    Dashboard: {
      Login: [],
      Settings: []
    }
  }
};
const config = {
  API_URL: window.DASHBOARD_CONFIG?.API_URL || defaultConfig.API_URL,
  DISCORD: {
    CLIENT_ID: window.DASHBOARD_CONFIG?.DISCORD?.CLIENT_ID || defaultConfig.DISCORD.CLIENT_ID,
    REDIRECT_URI: window.DASHBOARD_CONFIG?.DISCORD?.REDIRECT_URI || defaultConfig.DISCORD.REDIRECT_URI,
    GUILD_ID: window.DASHBOARD_CONFIG?.DISCORD?.GUILD_ID || defaultConfig.DISCORD.GUILD_ID
  },
  PERMISSIONS: {
    Dashboard: {
      Login: window.DASHBOARD_CONFIG?.PERMISSIONS?.Dashboard?.Login || defaultConfig.PERMISSIONS.Dashboard.Login,
      Settings: window.DASHBOARD_CONFIG?.PERMISSIONS?.Dashboard?.Settings || defaultConfig.PERMISSIONS.Dashboard.Settings
    }
  }
};
var stdin_default = config;
export {
  config,
  stdin_default as default
};

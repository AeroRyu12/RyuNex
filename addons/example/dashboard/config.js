module.exports = {
    pages: [
        {
            path: '/addon/example',
            component: 'index',
            title: 'Example Addon',
            // No permission required - anyone logged in can access
            requiredRoles: null
        },
        {
            path: '/addon/example/settings',
            component: 'settings',
            title: 'Example Settings',
            // Example: Require specific role IDs to access this page
            // requiredRoles: ['123456789012345678', '987654321098765432']
            requiredRoles: null
        }
    ],
    
    navItems: [
        {
            name: 'Example',
            path: '/addon/example',
            emoji: '🧪',
            // Show to all logged in users
            requiredRoles: null,
            order: 50
        }
    ],
    
    apiRoutes: [
        {
            method: 'get',
            path: '/stats',
            // Public endpoint - no role restriction
            requiredRoles: null,
            handler: async (req, res) => {
                res.json({
                    message: 'Hello from Example Addon API!',
                    timestamp: new Date().toISOString(),
                    version: '1.0.0'
                });
            }
        },
        {
            method: 'get',
            path: '/settings',
            // Example: Restrict to specific roles
            // requiredRoles: ['123456789012345678'],
            requiredRoles: null,
            handler: async (req, res) => {
                res.json({
                    enabled: true,
                    welcomeMessage: 'Welcome to the server!'
                });
            }
        },
        {
            method: 'post',
            path: '/settings',
            // Example: Only admins can change settings
            // requiredRoles: ['ADMIN_ROLE_ID'],
            requiredRoles: null,
            handler: async (req, res) => {
                const { enabled, welcomeMessage } = req.body;
                res.json({
                    success: true,
                    settings: { enabled, welcomeMessage }
                });
            }
        }
    ]
};


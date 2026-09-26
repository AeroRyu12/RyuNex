const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        path.join(__dirname, "index.html"),
        path.join(__dirname, "src/**/*.{js,ts,jsx,tsx}"),
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    glow: "hsl(var(--primary-glow))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                discord: {
                    'blue': '#5865F2',
                    'gray': '#2C2F33',
                    'dark': '#23272A',
                }
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                xl: "calc(var(--radius) + 4px)",
                '2xl': "calc(var(--radius) + 8px)",
            },
            backdropBlur: {
                xs: '2px',
                glass: 'var(--glass-blur)',
                'glass-lg': 'var(--glass-blur-lg)',
                'glass-xl': 'var(--glass-blur-xl)',
            },
            boxShadow: {
                'glass': '0 4px 24px -1px hsl(var(--background) / 0.4), 0 0 0 1px hsl(var(--border) / 0.1)',
                'glass-lg': '0 8px 32px -4px hsl(var(--background) / 0.5), 0 0 0 1px hsl(var(--border) / 0.15)',
                'glow': '0 0 20px -5px hsl(var(--primary) / 0.5)',
                'glow-sm': '0 0 10px -3px hsl(var(--primary) / 0.4)',
                'glow-lg': '0 0 40px -10px hsl(var(--primary) / 0.6)',
                'glow-primary': '0 0 30px -5px hsl(var(--primary) / 0.5)',
                'inner-glow': 'inset 0 1px 0 hsl(var(--foreground) / 0.05)',
            },
            animation: {
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient': 'gradientShift 8s ease infinite',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'fade-in-up': 'fadeInUp 0.4s ease-out forwards',
                'fade-in-down': 'fadeInDown 0.4s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.3s ease-out forwards',
                'slide-in-right': 'slideInRight 0.3s ease-out forwards',
                'scale-in': 'scaleIn 0.2s ease-out forwards',
                'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 20px -5px hsl(var(--primary) / 0.4)' },
                    '50%': { boxShadow: '0 0 30px -5px hsl(var(--primary) / 0.6)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                fadeIn: {
                    from: { opacity: '0', transform: 'translateY(10px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInUp: {
                    from: { opacity: '0', transform: 'translateY(20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    from: { opacity: '0', transform: 'translateY(-20px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                slideInLeft: {
                    from: { opacity: '0', transform: 'translateX(-20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    from: { opacity: '0', transform: 'translateX(20px)' },
                    to: { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    from: { opacity: '0', transform: 'scale(0.95)' },
                    to: { opacity: '1', transform: 'scale(1)' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
            },
            transitionDuration: {
                '400': '400ms',
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'glass-gradient': 'linear-gradient(135deg, hsl(var(--card) / 0.7) 0%, hsl(var(--card) / 0.4) 100%)',
                'glow-gradient': 'linear-gradient(135deg, hsl(var(--primary) / 0.2) 0%, hsl(var(--primary) / 0) 100%)',
            },
        },
    },
    plugins: [],
}

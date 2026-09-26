import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function loadDashboardConfig() {
    try {
        const dashboardConfigPath = path.join(__dirname, '..', 'config', 'modules', 'dashboard.yml')
        if (fs.existsSync(dashboardConfigPath)) {
            const content = fs.readFileSync(dashboardConfigPath, 'utf8')
            const config = yaml.load(content)
            
            const url = config?.Dashboard?.Url || 'http://localhost:5000'
            
            let hostname = 'localhost'
            try {
                hostname = new URL(url).hostname
            } catch (e) {}
            
            return { url, hostname }
        }
    } catch (e) {}
    return { url: 'http://localhost:5000', hostname: 'localhost' }
}

export default defineConfig(({ command }) => {
    const { url, hostname } = loadDashboardConfig()

    return {
        root: '.',
        plugins: [
            react()
        ],
        server: {
            host: true,
            allowedHosts: [hostname],
            proxy: {
                '/api': {
                    target: url,
                    changeOrigin: true,
                    secure: false,
                    ws: true
                }
            },
            fs: {
                allow: [
                    path.resolve(__dirname, '..'),
                    path.resolve(__dirname, '..', 'addons')
                ]
            }
        },
        build: {
            outDir: 'dist',
            emptyOutDir: true,
            rollupOptions: {
                input: {
                    main: path.resolve(__dirname, 'index.html')
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@addons': path.resolve(__dirname, '..', 'addons')
            }
        }
    }
})
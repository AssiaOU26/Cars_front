import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    base: '/',
    server: {
        port: 3001,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3002',
                changeOrigin: true,
                secure: false
            }
        }
    },
    publicDir: 'public',
    resolve: {
        alias: {
            '@': '/src'
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    utils: ['react-i18next', 'i18next']
                }
            }
        }
    }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    },
    // Add these for better static asset handling
    fs: {
      strict: false
    },
    // Disable HMR if not needed
    hmr: {
      overlay: false
    },
    // Ignore certain files to prevent unnecessary restarts
    watch: {
      ignored: [
        '**/node_modules/**',
        '**/package-lock.json',
        '**/.git/**',
        '**/dist/**'
      ]
    }
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
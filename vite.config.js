import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      // Requests to /api/... are forwarded to the PHP backend
      // Start PHP from the backend folder: php -S localhost:8000 -t backend
      // /api/admin/login.php  → backend/admin/login.php
      // /api/auth/google_login.php → backend/auth/google_login.php
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

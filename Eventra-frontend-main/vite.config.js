import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,        // allow access via IP (e.g., 192.168.x.x)
    port: 5173,        // your dev port
    https: false       // 🔥 force HTTP (disable HTTPS completely)
  }
})
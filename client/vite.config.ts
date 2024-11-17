import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VAPID_PUBLIC_KEY__: JSON.stringify(process.env.VITE_VAPID_PUBLIC_KEY),
    __VAPID_PRIVATE_KEY__: JSON.stringify(process.env.VAPID_PRIVATE_KEY),
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api/timeMachine': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
      '/api': {
        target: 'http://localhost:4000/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

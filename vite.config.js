import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/KYT-CN-Beyonders-v1/' : '/',
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'docs',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})

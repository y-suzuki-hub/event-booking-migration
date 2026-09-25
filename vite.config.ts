import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// サブディレクトリに置く場合は DEMO_BASE=/demo/event-booking/ npm run build
export default defineConfig({
  base: process.env.DEMO_BASE ?? '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        legacy: resolve(import.meta.dirname, 'legacy.html'),
      },
    },
  },
})

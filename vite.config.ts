import { defineConfig } from 'vite'
import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/portfolio/',
  define: {
    'import.meta.env.VITE_VERCEL_ANALYTICS_ENABLED': JSON.stringify(process.env.VERCEL === '1'),
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
      '@config': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/config'),
      '@components': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/components'),
      '@features': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/features'),
      '@shared': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/shared'),
      '@core': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/core'),

    },
  },
})
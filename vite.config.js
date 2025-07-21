import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// No need to import tailwindcss here (Tailwind is handled via postcss.config.js)
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    outDir: 'dist', // AWS Amplify expects this folder
  },

  base: '/', // Useful if deployed to root domain (e.g., mysite.com/). For subfolders, use '/subfolder/'

  server: {
    proxy: {
      '/api': {
        target: 'https://farmers-market-backend-f1u8.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep /api prefix
      }
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react()],
  assetsInclude: ['public', 'src/assets'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'zustand'],
          ui: ['@emotion/react', '@emotion/styled', '@mui/material/Icon', '@mui/material/MenuItem', '@mui/material/Select'],
          chart: ['react-simple-maps'],
          map: ['./src/assets/map/features.json'],
          lang: ['./src/assets/lang/dialogue.json', './src/assets/lang/ui.json']
        }
      }
    }
  }
})

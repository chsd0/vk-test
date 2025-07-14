import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'node:path';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    svgr({ 
      svgrOptions: {
        icon: true,
      },
    }),],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@store': path.resolve(__dirname, './src/store'),
    },
  },
})

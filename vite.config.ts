import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; 
import path from 'path'; 

export default defineConfig({
  base: '/Addition-and-Subtraction/',
  plugins: [react()], 
  define: {
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
})
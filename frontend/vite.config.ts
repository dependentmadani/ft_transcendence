import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      'auth': {
        target: 'http://localhost:8000',
        changeOrigin:true
      },
    }
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // base: mode === 'production' ? '/absproxy/8081/' : '/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8081,
    strictPort: true
    },
    base: mode === 'development' ? '/absproxy/8081/' : '/',
  }))



//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 8081,
//     strictPort: true
//   },
//   base: '/absproxy/8081/',
//   test: {
//     environment: "jsdom",
//   },
// })

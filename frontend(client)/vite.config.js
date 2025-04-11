import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    fs: {
      allow: [
        // Allow access to the project root and node_modules
        path.resolve(__dirname, ".."),
      ],
    },
    port: 5174,
  },
  define: {
    'process.env': {}, // Define process.env to avoid the error
  },
})
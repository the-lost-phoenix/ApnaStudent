import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // Note: You chose SWC, so keep this
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
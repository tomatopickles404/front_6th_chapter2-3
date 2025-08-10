import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import viteTsconfigPaths from "vite-tsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  server: {
    proxy: {
      "/api": {
        // target: 'https://jsonplaceholder.typicode.com',
        target: "https://dummyjson.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})

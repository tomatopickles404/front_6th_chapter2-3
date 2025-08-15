import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import viteTsconfigPaths from "vite-tsconfig-paths"
import path, { resolve } from "path"

// https://vite.dev/config/
export default defineConfig({
  base: "/front_6th_chapter2-3/",
  plugins: [react(), viteTsconfigPaths()],
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        404: resolve(__dirname, "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "/*": path.resolve(__dirname, "src/*"),
    },
  },
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

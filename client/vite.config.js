import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Deploy to: https://aldyjrz.github.io
// Since this is deployed to the root of the custom domain (username.github.io),
// base should be "/" (not a subdirectory).
export default defineConfig({
  plugins: [vue()],
  base: "/aldyjrz/",
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html",
      },
    },
  },
});

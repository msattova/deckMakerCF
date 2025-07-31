import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';
import env from "vite-plugin-env-compatible";

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/deckMakerCF/" : "./",
  plugins: [react(), visualizer(), env({ prefix: "VITE", mountedPath: "process.env" })],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom/client"],
        },
      },
    },
  },
  resolve: {},
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin",
      "Cross-Origin-Embedder-Policy": "require-corp",
    },
  },
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
});

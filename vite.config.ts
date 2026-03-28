// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false, // allow serving files outside root if needed
    },
    watch: {
      usePolling: true,
    },
    // SPA fallback for React Router
    historyApiFallback: true,
  },
  plugins: [
    react(), // Fast React refresh using SWC
    tsconfigPaths(), // Auto-resolve paths from tsconfig.json
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});

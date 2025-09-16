import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:8081",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    exclude: [...configDefaults.exclude, "e2e/**"],
    testTimeout: 30000,
    coverage: {
      reporter: ["text", "html"],
      exclude: [
        "src/Services/AxiosConfig.ts",
        "./vite.config.ts",
        "mock/server.js",
        "src/main.tsx",
        "src/serviceWorker.ts",
        "src/Shared/HeaderMenu/HeaderMenu.tsx",
      ],
    },
  },
});

import { resolve } from "path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import ui5RegisterAppPlugin from "./plugin/ui5-register-app";

// https://vitejs.dev/config/
export default defineConfig({
  root: resolve(__dirname, "src"),
  publicDir: resolve(__dirname, "public"),
  build: {
    outDir: resolve(__dirname, "dist"),
  },
  envDir: __dirname,
  plugins: [react(), ui5RegisterAppPlugin()],
});

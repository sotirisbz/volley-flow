import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  resolve: {
    alias: {},
    moduleDirectories: ["node_modules"],
  },
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
  root: __dirname,
  cacheDir: path.resolve(__dirname, "node_modules/.vite"),
});

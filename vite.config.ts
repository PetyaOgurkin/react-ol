import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/lib/index.ts"),
      formats: ['es']
    },
    rollupOptions: {
      external: [/^react*/, /^ol*/],
      output: {
        entryFileNames: '[name].js',
      },
    }
  },
  plugins: [react(), dts({ include: ['src/lib'] })],
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
});
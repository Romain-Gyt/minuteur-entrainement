import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// ⬇️ on force PostCSS ici (plus fiable sous Windows)
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
});

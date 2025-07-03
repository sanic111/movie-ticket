import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr()],
  resolve: {
    alias: {
      "@styles": path.resolve(__dirname, "./src/assets/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // nếu muốn tự động thêm biến/mixin vào tất cả SCSS
        // additionalData: `@import "@styles/utils/variables"; @import "@styles/utils/mixins";`
      },
    },
  },
});

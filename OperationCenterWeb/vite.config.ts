import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import styleImport from 'vite-plugin-style-import';
import JSX from "@vitejs/plugin-vue-jsx";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue(), JSX()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@/plugins": resolve(__dirname, "src/plugins/"),
      "@/views": resolve(__dirname, "src/views/"),
      "@/config": resolve(__dirname, "src/config/"),
      "@/untils": resolve(__dirname, "src/untils/"),
    },
  },
  server: {
    proxy: {
      // 自定义代理规则
      "/api": {
        // target: "http://192.168.0.230:8050", //中台服务器开发环境
        // target: "http://192.168.0.201:8050", //中台服务器测试环境
        // target: "http://192.168.1.152:8050", //中台服务器测试环境
        target: "http://192.168.2.237:8050", //浩宇本地
        // target: "http://127.0.0.1:8050", //本地
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/opcloudapi": {
        // target: "http://192.168.0.230:8808", //中台服务器开发环境
        // target: "http://192.168.0.201:8808", //中台服务器开发环境
        target: "http://192.168.2.237:8808", //浩宇本地
        // target: "http://127.0.0.1:8808", //本地
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/opcloudapi/, ""),
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 预编译SCSS变量文件
        additionalData: `@import "src/styles/variables.scss";`,
      },
    },
  },
});

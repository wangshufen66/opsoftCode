import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
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
      "/flowable": {
        // target: 'http://192.168.32.118:8088/opcloud/',
        // target: "http://192.168.0.73:8808",
        target: "http://192.168.0.145:8808",
        // target: 'http://192.168.32.88:8808', //高队本地
        // target: 'http://192.168.0.222:8808', //demo服务器开发环境
        // target: 'http://192.168.32.226:8808',   //光哲本地
        // target: 'http://192.168.32.207:8808', //梦琦本地
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flowable/, "/opcloud/flowable"),
      },
      "/api": {
        // target: "http://192.168.0.73:8808", //73服务器测试环境
        target: "http://192.168.0.145:8808", //145服务器开发环境
        // target: "http://124.70.27.63:7860/api", //穿透
        // target: 'http://demo.opsoft.com.cn', //demo服务器开发环境
        // target: 'http://192.168.32.152:8808',   //浩宇本地
        // target: 'http://192.168.32.88:8808', //高队本地
        // target: 'http://192.168.32.226:8808',   //光哲本地
        // target: 'http://192.168.33.127:8888', //梦琦本地
        // target: 'http://192.168.0.29:8808', //文星本地
        // target: 'http://192.168.32.167:8808', //李琪本地
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      "/middleware": {
        target: "http://localhost:5088/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/middleware/, "/node"),
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
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         'element-plus': ['element-plus'],
  //         echarts: ['echarts'],
  //       },
  //     },
  //   },
  //   chunkSizeWarningLimit: 400, // 超过400KB显示警告
  // },
});

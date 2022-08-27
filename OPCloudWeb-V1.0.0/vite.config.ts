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
        // target: "http://192.168.0.202:8808",
        // target: "http://192.168.0.202:8808",
        // target: "http://192.168.43.28:8808", //浩宇本地
        // target: 'http://192.168.32.88:8808', //高队本地
        // target: 'http://192.168.0.222:8808', //demo服务器开发环境
        // target: 'http://192.168.32.226:8808',   //光哲本地
        // target: 'http://192.168.32.207:8808', //梦琦本地
        target: "http://192.168.42.18:8808", //王孟贵本地
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flowable/, "/opcloud/flowable"),
      },
      "/api": {
        // target: "http://192.168.0.202:8808", //201服务器测试环境
        target: "http://192.168.0.212:8808", // Feature-322环境
        // target: "http://192.168.0.96:8808",//鲁鹏飞本地
        // target: "http://192.168.0.202:8808", //202服务器开发环境
        // target: "http://124.70.27.63:7860/api", //穿透
        // target: 'http://demo.opsoft.com.cn', //demo服务器开发环境
        // target: "http://192.168.43.28:8808", //浩宇本地
        // target: 'http://192.168.42.117:8808', //高队本地
        // target: 'http://192.168.32.226:8808',   //光哲本地
        // target: 'http://192.168.42.20:8808', //梦琦本地
        // target: 'http://192.168.42.20:8808', //梦琦本地
        // target: "http://192.168.0.29:8808", //文星本地
        // target: 'http://192.168.43.35:8808', //李琪本地
        // target: 'http://192.168.0.96:8808', //鹏飞本地
        // target: 'http://192.168.42.156:8808/', //鹏飞本地
        // target: "http://192.168.42.18:8808", //王孟贵本地
        // target: "http://192.168.0.204:8808", //亚飞本地
        // target: "http://192.168.42.154:8808",
        //  target:' http://192.168.42.63:8808', //任思艳本地
        // target: "http://192.168.0.247:8808", //吴宇璠本地

        // target: "http://localhost:8808", //通用本地
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

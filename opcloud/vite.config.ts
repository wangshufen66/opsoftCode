import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/flowable": {
        // target: "http://192.168.0.201:8808",
        target: "http://192.168.0.202:8838",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flowable/, "/opcloud/flowable"),
      },
      "/api": {
        // target: "http://192.168.0.201:8808", //201服务器测试环境
        target: "http://192.168.0.202:8838", //202服务器开发环境
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
        charset: false,
        // 预编译SCSS变量文件
        // additionalData: `@use "@/styles/theme.scss" as *;`,
      },
    },
  },
  build: {
    ssr: false,
    minify: false, //生产环境调试使用
    // commonjs模块配置
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("d3")) {
              return "d3";
            } else if (id.includes("/element-plus/")) {
              return "el";
            } else if (id.includes("/@element-plus/icons/")) {
              return "el-icon";
            } else if (id.includes("dingtalk-jsapi")) {
              return "ding";
            }
            return "vendor";
          } else {
            if (id.includes("shared")) {
              return "shared";
            } else if (id.includes("components/designComponent")) {
              return "design";
            } 
            // else if (id.includes("components/core")) {
            //   return "core-cm";
            // }
          }
        },
      },
    },
  },
});

import { RouteRecordRaw } from "vue-router";
/*
 ****************************
 * 系统管理路由列表
 ****************************
 */
const systemRoutes: Array<RouteRecordRaw> = [
  //消息通知详情列表
  {
    path: "/systemset/news/newDetail",
    name: "newDetail",
    component: () => import("@/views/news/newDetail.vue"),
  },
  //角色管理
  {
    path: "/systemset/mange/role",
    name: "role",
    component: () => import("@/views/system/role/index.vue"),
  },
  //部门管理
  {
    path: "/systemset/mange/department",
    name: "department",
    component: () => import("@/views/system/department.vue"),
  },
  //用户管理
  {
    path: "/systemset/mange/user",
    name: "user",
    component: () => import("@/views/system/user.vue"),
  },
  //字典表
  {
    path: "/systemset/mange/dictionaries",
    name: "dictionaries",
    component: () => import("@/views/system/dictionaries.vue"),
  },
  //菜单管理
  {
    path: "/systemset/mange/menu",
    name: "menu",
    component: () => import("@/views/system/menu.vue"),
  },
  // 水印设置
  {
    path: "/systemset/mange/watermark",
    name: "watermark",
    component: () => import("@/views/system/watermark.vue"),
  },
  // 首页配置
  {
    path: "/systemset/mange/homeconfig",
    name: "homeconfig",
    component: () => import("@/views/system/homeconfig.vue"),
  },
  //计算模型管理
  {
    path: "/systemset/mange/calculation",
    name: "calculation",
    component: () => import("@/views/system/calculmodel/index.vue"),
  },
  //创建模型
  {
    path: "/systemset/mange/createmodel",
    name: "createmodel",
    component: () => import("@/views/system/createmodel/index.vue"),
  },
  // 通过应用设计进到应用设置列表
  {
    path: "/systemset/mange/appsset",
    name: "systemset-appsset",
    component: () => import("@/views/apps/appsset.vue"),
  },
  // 新闻内容管理
  {
    path: "/systemset/news",
    name: "news",
    component: () => import("@/views/news/index.vue"),
  },
  // 日志列表
  {
    path: "/systemset/log",
    name: "log",
    component: () => import("@/views/system/log/index.vue"),
  },
];

export default systemRoutes;

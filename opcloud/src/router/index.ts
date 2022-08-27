﻿import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
import { routerGuard } from "./guard";

import systemRoutes from "./system";

// 所有页面路由
export const routeMap: Array<RouteRecordRaw> = [
  // 应用列表
  {
    path: "/application/:appid/:modelid/:pageid?",
    name: "application",
    component: () => import("@/views/apps/application/index.vue"),
  },
  ...systemRoutes,
];

// 系统路由配置表
export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    redirect: "/home",
    component: () => import("@/views/index.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
      },
      // 个人中心
      {
        path: "/personal",
        name: "personal",
        redirect: "/personal/personalMange",
        component: () => import("@/views/personal/index.vue"),
        children: [
          {
            path: "/personal/personalMange",
            name: "personal-personalMange",
            component: () => import("@/views/personal/personalMange.vue"),
            redirect: "/personal/infoMange",
            children: [
              //个人信息管理
              {
                path: "/personal/infoMange",
                name: "personal-infoMange",
                component: () => import("@/views/personal/infoMange.vue"),
              },
              //修改密码
              {
                path: "/personal/changePwd",
                name: "personal-changePwd",
                component: () => import("@/views/personal/changePwd.vue"),
              },
            ],
          },
        ],
      },
      // 表单设计
      {
        path: "/design",
        name: "design",
        component: () => import("@/views/design/index.vue"),
      },
      {
        path: "/systemset/appsupdate",
        name: "appsupdate",
        component: () => import("@/views/apps/appsupdate/index.vue"),
        redirect: "/systemset/appsupdate/appdetail",
        children: [
          //应用管理
          {
            path: "/systemset/appsupdate/appdetail",
            name: "appdetail",
            component: () => import("@/views/apps/appsupdate/appdetail.vue"),
          },
          //模块管理
          {
            path: "/systemset/appsupdate/modellist",
            name: "modellist",
            component: () => import("@/views/apps/appsupdate/modellist.vue"),
          },
          // 模块下的页面详情
          {
            path: "/systemset/appsupdate/pagelist",
            name: "pagelist",
            component: () => import("@/views/apps/appsupdate/pagelist.vue"),
          },
        ],
      },
    ],
  },
  // 登录
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  // 注册
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: "/",
  },
];

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 路由守卫
routerGuard(router);

export default router;

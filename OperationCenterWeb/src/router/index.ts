﻿import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from "vue-router";
import { getToken, messageAlert } from "@/utils/utils";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    redirect: "/systemset",
    component: () => import("@/views/index.vue"),
    children: [
      {
        path: "/systemset",
        name: "systemset",
        redirect: "/home",
        component: () => import("@/views/system/index.vue"),
        children: [
          {
            path: "/home",
            name: "home",
            component: () => import("@/views/home/index.vue"),
          },
          // 注册用户
          {
            path: "/systemset/mange/user",
            name: "user",
            component: () => import("@/views/system/user.vue"),
          },
          //合同管理
          {
            path: "/systemset/mange/contractManage",
            name: "contractManage",
            component: () => import("@/views/system/contractManage.vue"),
          },
          //线索管理
          {
            path: "/systemset/mange/clueManagement",
            name: "clueManagement",
            component: () => import("@/views/system/clueManagement.vue"),
          },
          //成交列表
          {
            path: "/systemset/mange/dealList",
            name: "dealList",
            component: () => import("@/views/system/dealList.vue"),
          },
          //新增客户数量
          {
            path: "/systemset/mange/newCustomers",
            name: "newCustomers",
            component: () => import("@/views/system/newCustomers.vue"),
          },
          //客户活跃度
          {
            path: "/systemset/mange/customerActivity",
            name: "customerActivity",
            component: () => import("@/views/system/customerActivity.vue"),
          },
          //合同金额
          {
            path: "/systemset/mange/contractAmount",
            name: "contractAmount",
            component: () => import("@/views/system/contractAmount.vue"),
          },

          //启动页配置
          {
            path: "/systemset/mange/startupPageConfig",
            name: "startupPageConfig",
            component: () => import("@/views/system/startupPageConfig.vue"),
          },
          //消息中心
          {
            path: "/systemset/mange/newslist",
            name: "newslist",
            component: () => import("@/views/system/newslist.vue"),
          },

          //角色管理
          {
            path: "/systemset/mange/roleManage",
            name: "roleManage",
            component: () => import("@/views/system/roleManage.vue"),
          },
          //员工管理
          {
            path: "/systemset/mange/staffManage",
            name: "staffManage",
            component: () => import("@/views/system/staffManage.vue"),
          },
          //账套管理
          {
            path: "/systemset/mange/tenant",
            name: "tenant",
            component: () => import("@/views/system/tenant.vue"),
          },
          //字典管理
          {
            path: "/systemset/mange/dictionary",
            name: "dictionary",
            component: () => import("@/views/system/dictionary.vue"),
          },
          //运营日志
          {
            path: "/systemset/mange/log",
            name: "log",
            component: () => import("@/views/log/index.vue"),
          },
          //修改密码
          {
            path: "/systemset/mange/changePwd",
            name: "changePwd",
            component: () => import("@/views/system/changePwd.vue"),
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

const unCheckPaths: string[] = ["/login", "/register"];

router.beforeEach((to, from) => {
  if (!unCheckPaths.includes(to.path)) {
    const hasToken = checkToken();
    if (!hasToken) {
      // hasToken===undefined缓存没有TOKEN；hasToken===null token过期
      hasToken === null && messageAlert("error", "登录失效，请重新登录");
      // 不执行当前跳转操作
      const redirect: string | undefined =
        to.fullPath === "/login" ? undefined : to.fullPath;
      return router.replace({
        path: `/login`,
        query: { redirect: redirect && encodeURIComponent(redirect) },
      });
    }
  }
  return true;
});

function checkToken(): boolean {
  return getToken("accessToken");
}

export default router;

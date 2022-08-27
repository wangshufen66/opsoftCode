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
    redirect: "/home",
    component: () => import("@/views/index.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
      },
      //消息通知详情列表
      {
        path: "/systemset/news/newDetail",
        name: "newDetail",
        component: () => import("@/views/news/newDetail.vue"),
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
      //租户中心
      {
        path: "/systemset/mange/tenant",
        name: "tenant",
        component: () => import("@/views/system/tenant.vue"),
      },
      //角色管理
      {
        path: "/systemset/mange/role",
        name: "role",
        component: () => import("@/views/system/role.vue"),
      },
      //部门管理
      {
        path: "/systemset/mange/department",
        name: "department",
        component: () => import("@/views/system/department.vue"),
      },
      {
        path: "/systemset/mange/departmentRole",
        name: "departmentRole",
        component: () => import("@/views/system/departmentRole.vue"),
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
      //功能管理
      {
        path: "/systemset/mange/func",
        name: "func",
        component: () => import("@/views/system/func.vue"),
      },
      // 水印设置
      {
        path: "/systemset/mange/watermark",
        name: "watermark",
        component: () => import("@/views/system/watermark.vue"),
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
      // 表单数据设置
      {
        path: "/systemset/mange/datacopy",
        name: "datacopy",
        component: () => import("@/views/system/datacopy.vue"),
      },
      // 通过应用设计进到应用设置列表
      {
        path: "/systemset/mange/appsset",
        name: "systemset-appsset",
        component: () => import("@/views/apps/appsset.vue"),
      },
      // 打印模板
      {
        path: "/systemset/mange/printtemplate",
        name: "printTemplate",
        component: () =>
          import("@/views/system/printTemplate/templateSetting.vue"),
      },
      {
        path: "/systemset/mange/cpconfig",
        name: "componentCfg",
        component: () => import("@/views/system/componentcfg/index.vue"),
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
      // 工作流管理
      {
        path: "/systemset/workflowset/model",
        name: "model",
        component: () => import("@/views/workflowset/model.vue"),
      },
      // 流程定义管理
      {
        path: "/systemset/workflowset/validlist",
        name: "validlist",
        component: () => import("@/views/workflowset/validlist.vue"),
      },
      // 工作流模型设计
      {
        path: "/systemset/workflowset/design",
        name: "flowdesign",
        component: () => import("@/views/workflowset/design.vue"),
      },
      // 运行中工作流
      {
        path: "/systemset/workflowset/runlist",
        name: "runlist",
        component: () => import("@/views/workflowset/runlist.vue"),
      },
      // 发起流程
      {
        path: "/systemset/workflowset/startProcess",
        name: "startProcess",
        component: () => import("@/views/workflowset/startProcess.vue"),
      },
      // 我的待办
      {
        path: "/systemset/workflowset/taskToDo",
        name: "taskToDo",
        component: () => import("@/views/workflowset/taskToDo.vue"),
      },
      // 我的已办
      {
        path: "/systemset/workflowset/taskDone",
        name: "taskDone",
        component: () => import("@/views/workflowset/taskDone.vue"),
      },
      // 大屏看板设置
      // {
      //   path: "/systemset/dashboard",
      //   name: "dashboard",
      //   redirect: "/systemset/dashboard/dashboardList",
      //   component: () => import("@/views/dashboard/index.vue"),
      //   children: [
      //     // 大屏看板列表
      //     {
      //       path: "/systemset/dashboard/dashboardList",
      //       name: "dashboardList",
      //       component: () => import("@/views/dashboard/dashboardList.vue"),
      //     },
      //     // 大屏看板设计
      //     {
      //       path: "/systemset/dashboard/dashboardDesign",
      //       name: "dashboardDesign",
      //       component: () => import("@/views/dashboard/dashboardDesign.vue"),
      //     },
      //   ],
      // },
      // 新闻内容管理
      {
        path: "/systemset/news",
        name: "news",
        component: () => import("@/views/news/index.vue"),
      },
      // 通过应用--模块列表--模块详情
      {
        path: "/application/:appid/:modelid/:pageid?",
        name: "application",
        component: () => import("@/views/apps/application/index.vue"),
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

  // 表单设计
  {
    path: "/design",
    name: "design",
    component: () => import("@/views/design/index.vue"),
  },
  // 图表设计
  {
    path: "/designchart",
    name: "designchart",
    component: () => import("@/views/designchart/index.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/tests/index.vue"),
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

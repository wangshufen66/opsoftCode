import {
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
      //============ e工单模块 ===========

      //  生产计划--生产订单
      {
        path: "/workerorder/prdorder/list",
        name: "prdorderlist",
        component: () =>
          import("@/views/v3/workerorder/prdplan/prdorder/list.vue"),
      },
      {
        path: "/workerorder/prdorder/edit",
        name: "prdorderedit",
        component: () =>
          import("@/views/v3/workerorder/prdplan/prdorder/edit.vue"),
      },
      // =============================================================
      {
        path: "/demo/treeTwo",
        name: "demo_tree_two",
        component: () => import("@/views/v3/demo/treeTwo.vue"),
      },
      {
        path: "/demo/tree",
        name: "demo_tree",
        component: () => import("@/views/v3/demo/tree.vue"),
      },
      {
        path: "/demo/list",
        name: "demo_list",
        component: () => import("@/views/v3/demo/list.vue"),
      },
      {
        path: "/demo/edit",
        name: "demo_edit",
        component: () => import("@/views/v3/demo/edit.vue"),
      },

      {
        path: "/out/plan/list",
        name: "plan_list",
        component: () => import("@/views/v3/out/plan_new/list.vue"),
      },
      {
        path: "/out/check/list",
        name: "check_list",
        component: () => import("@/views/v3/out/check/list.vue"),
      },
      {
        path: "/out/sendout",
        name: "sendout",
        component: () => import("@/views/v3/out/sendout/index.vue"),
      },
      {
        path: "/out/receive",
        name: "receive",
        component: () => import("@/views/v3/out/receive/index.vue"),
      },
      {
        path: "/quantityadjust",
        name: "quantityadjust",
        redirect: "/quantityadjust/adjustquantity",
        component: () => import("@/views/v3/out/quantityadjust/index.vue"),
        children: [
          {
            path: "/quantityadjust/adjustquantity",
            name: "quantityadjust/adjustquantity",
            component: () =>
              import("@/views/v3/out/quantityadjust/adjustquantity.vue"),
            redirect: "/quantityadjust/productionstart",
            children: [
              // 开工数量调整
              {
                path: "/quantityadjust/productionstart",
                name: "productionstart",
                component: () =>
                  import("@/views/v3/out/quantityadjust/productionstart.vue"),
              },
              //  汇报数量调整
              {
                path: "/quantityadjust/productionreport",
                name: "productionreport",
                component: () =>
                  import("@/views/v3/out/quantityadjust/productionreport.vue"),
              },
              //委外计划调整
              {
                path: "/quantityadjust/outpaln",
                name: "outplan",
                component: () =>
                  import("@/views/v3/out/quantityadjust/outplan.vue"),
              },
              //委外发出调整
              {
                path: "/quantityadjust/outsend",
                name: "outsend",
                component: () =>
                  import("@/views/v3/out/quantityadjust/outsend.vue"),
              },
              //委外接收调整
              {
                path: "/quantityadjust/outrecive",
                name: "outrecive",
                component: () =>
                  import("@/views/v3/out/quantityadjust/outrecive.vue"),
              },
            ],
          },
        ],
      },
      {
        path: "/factoryModel/group/list",
        name: "list",
        component: () => import("@/views/v3/factoryModel/group/list.vue"),
      },
      //调整记录
      {
        path: "/quantityadjust/adjustrecord",
        name: "adjustrecord",
        component: () =>
          import("@/views/v3/out/quantityadjust/adjustrecord.vue"),
      },
      // 生产执行-工序任务
      {
        path: "/productionaction/prdprocess",
        name: "prdprocess",
        component: () =>
          import("@/views/v3/productionaction/prdprocess/index.vue"),
      },
      // 开工记录
      {
        path: "/productionaction/prdstart",
        name: "prdstart",
        component: () =>
          import("@/views/v3/productionaction/prdstart/index.vue"),
      },
      // 汇报记录
      {
        path: "/productionaction/reportrecord",
        name: "reportrecord",
        component: () =>
          import("@/views/v3/productionaction/reportRecord/index.vue"),
      },
      //生产检验
      {
        path: "/productioncheck/list",
        name: "list",
        component: () => import("@/views/v3/productioncheck/list.vue"),
      },

      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
      },
      //===========工厂建模

      
      {
        path: "/factoryModel/factory/index",
        name: "factory_index",
        component: () => import("@/views/v3/factoryModel/basicData/factory/index.vue"),
      },

      //班组
      {
        path: "/factoryModel/group/list",
        name: "group_list",
        component: () => import("@/views/v3/factoryModel/group/list.vue"),
      },
      //物料
      {
        path: "/factoryModel/material/list",
        name: "material_list",
        component: () =>
          import("@/views/v3/factoryModel/basicData/material/index.vue"),
      },
      //物料类别
      {
        path: "/factoryModel/materialCategory/list",
        name: "materialCategory_list",
        component: () =>
          import("@/views/v3/factoryModel/materialCategory/list.vue"),
      },
      //班次
      {
        path: "/factoryModel/class/list",
        name: "class_list",
        component: () => import("@/views/v3/factoryModel/class/list.vue"),
      },

      //部门
      {
        path: "/factoryModel/basicData/department/index",
        name: "department_index",
        component: () =>
          import("@/views/v3/factoryModel/basicData/department/index.vue"),
      },

      //客户
      {
        path: "/factoryModel/customer/list",
        name: "customer_list",
        component: () => import("@/views/v3/factoryModel/customer/list.vue"),
      },
      //人员
      {
        path: "/factoryModel/employee/list",
        name: "employee_list",
        component: () => import("@/views/v3/factoryModel/employee/list.vue"),
      },
      //供应商
      {
        path: "/factoryModel/supplier/list",
        name: "supplier_list",
        component: () => import("@/views/v3/factoryModel/supplier/list.vue"),
      },
      //产品工艺
      {
        path: "/factoryModel/productprocess/list",
        name: "productprocess_list",
        component: () =>
          import("@/views/v3/factoryModel/productprocess/list.vue"),
      },

      //设备
      {
        path: "/factoryModel/device/list",
        name: "device_list",
        component: () => import("@/views/v3/factoryModel/device/list.vue"),
      },
      //设备类别
      {
        path: "/factoryModel/devicecategory/list",
        name: "devicecategory_list",
        component: () =>
          import("@/views/v3/factoryModel/devicecategory/list.vue"),
      },

      //计量单位
      {
        path: "/factoryModel/basicData/unitMeasure/index",
        name: "unitMeasure_index",
        component: () =>
          import("@/views/v3/factoryModel/basicData/unitMeasure/index.vue"),
      },

      //不良原因
      {
        path: "/factoryModel/basicData/badReason/index",
        name: "badReason_index",
        component: () => import("@/views/v3/factoryModel/basicData/badReason/index.vue")
      },

      //弹窗
      {
        path: "/windowSelect/index",
        name: "opensleect_list",
        component: () => import("@/views/v3/windowSelect/index.vue"),
      },
      //工资配置
      {
        path: "/factoryModel/salary/list",
        name: "salary_list",
        component: () => import("@/views/v3/factoryModel/salary/list.vue"),
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
        component: () => import("@/views/system/printTemplate/index.vue"),
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
      // 应用列表
      {
        path: "/application/:appid/:modelid/:pageid?",
        name: "application",
        component: () => import("@/views/apps/application/index.vue"),
      },
      // 应用页面新增
      {
        path: "/appadd/:appid/:modelid/:pageid?",
        name: "application-add",
        component: () => import("@/views/apps/application/add.vue"),
      },
      // 应用页面编辑
      {
        path: "/appedit/:appid/:modelid/:pageid?",
        name: "application-edit",
        component: () => import("@/views/apps/application/edit.vue"),
      },
      // 应用详情
      {
        path: "/appdetail/:appid/:modelid/:pageid?",
        name: "application-detail",
        component: () => import("@/views/apps/application/detail.vue"),
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
  // 打印模板设计
  {
    path: "/design-print-template",
    name: "printTemplate-design",
    component: () => import("@/views/system/printTemplate/design.vue"),
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

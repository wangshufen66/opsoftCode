const menus = [
  {
    key: "/systemset/mange/tenant",
    title: "租户中心",
    path: "/systemset/mange/tenant",
    icon: "opfont opicon-ren",
    pathName: "租户中心",
  },
  {
    key: "/systemset/mange/role",
    title: "角色管理",
    path: "/systemset/mange/role",
    icon: "opfont opicon-user-role",
    pathName: "角色管理",
  },
  {
    key: "/systemset/mange/user",
    title: "用户管理",
    path: "/systemset/mange/user",
    icon: "opfont opicon-use-manage",
    pathName: "用户管理",
  },
  {
    key: "/systemset/mange/dictionaries",
    title: "字典表",
    path: "/systemset/mange/dictionaries",
    icon: "opfont opicon-dictionary",
    pathName: "字典表",
  },
  {
    key: "/systemset/mange/menu",
    title: "菜单管理",
    path: "/systemset/mange/menu",
    icon: "opfont opicon-menus",
    pathName: "菜单管理",
  },
  {
    key: "/systemset/mange/func",
    title: "功能管理",
    path: "/systemset/mange/func",
    icon: "opfont opicon-feature",
    pathName: "功能管理",
  },
  {
    key: "/systemset/mange/watermark",
    title: "水印设置",
    path: "/systemset/mange/watermark",
    icon: "opfont opicon-watermark",
    pathName: "水印设置",
  },
  {
    key: "/systemset/mange/homeconfig",
    title: "首页配置",
    icon: "opfont opicon-feature",

    path: "/systemset/mange/homeconfig",
    pathName: "首页配置",
  },
  {
    key: "model",
    title: "模型管理",
    icon: "opfont opicon-model",
    children: [
      {
        key: "/systemset/mange/createmodel",
        title: "创建模型",
        path: "/systemset/mange/createmodel",
        pathName: "模型管理_创建模型",
      },
      {
        key: "/systemset/mange/calculation",
        title: "计算模型管理",
        path: "/systemset/mange/calculation",
        pathName: "模型管理_计算模型管理",
      },
    ],
  },
 

  {
    key: "/systemset/mange/datacopy",
    title: "表单数据复制",
    path: "/systemset/mange/datacopy",
    icon: "opfont opicon-form-copy",
    pathName: "表单数据复制",
  },

  // {
  //   key: "department",
  //   title: "部门管理",
  //   icon: "opfont opicon-department",
  //   children: [
  //     {
  //       key: "/systemset/mange/department",
  //       title: "部门列表",
  //       path: "/systemset/mange/department",
  //       pathName: "部门管理_部门列表",
  //     },
  //     {
  //       key: "/systemset/mange/departmentRole",
  //       title: "部门人员管理",
  //       path: "/systemset/mange/departmentRole",
  //       pathName: "部门管理_部门人员管理",
  //     },
  //   ],
  // },
  {
    key: "/systemset/mange/appsset",
    title: "应用开发",
    path: "/systemset/mange/appsset",
    icon: "opfont opicon-apps",
    pathName: "应用开发",
  },
  {
    key: "workflowset",
    title: "工作流设置",
    icon: "opfont opicon-layout",
    children: [
      {
        key: "/systemset/workflowset/model",
        title: "模型管理",
        path: "/systemset/workflowset/model",
        pathName: "工作流设置_模型管理",
      },
      {
        key: "/systemset/workflowset/validlist",
        title: "定义管理",
        path: "/systemset/workflowset/validlist",
        pathName: "工作流设置_定义管理",
      },
      {
        key: "/systemset/workflowset/runlist",
        title: "运行中的流程",
        path: "/systemset/workflowset/runlist",
        pathName: "工作流设置_运行中的流程",
      },
      {
        key: "/systemset/workflowset/startProcess",
        title: "发起流程",
        path: "/systemset/workflowset/startProcess",
        pathName: "工作流设置_发起流程",
      },
      {
        key: "/systemset/workflowset/taskToDo",
        title: "我的待办",
        path: "/systemset/workflowset/taskToDo",
        pathName: "工作流设置_我的待办",
      },
      {
        key: "/systemset/workflowset/taskDone",
        title: "我的已办",
        path: "/systemset/workflowset/taskDone",
        pathName: "工作流设置_我的已办",
      },
    ],
  },

  {
    key: "/systemset/news",
    title: "内容管理",
    path: "/systemset/news",
    icon: "opfont opicon-schedule",
    pathName: "内容管理",
  },
  // {
  //   key: 14,
  //   title: "大屏设计",
  //   children: [
  //     {
  //       key: 1401,
  //       title: "看板列表",
  //       path: "/systemset/dashboard/dashboardList",
  //     },
  //     {
  //       key: 1402,
  //       title: "看板设计",
  //       path: "/systemset/dashboard/dashboardDesign",
  //     },
  //   ],
  // },
  {
    key: "/systemset/mange/printtemplate",
    title: "打印模板",
    path: "/systemset/mange/printtemplate",
    icon: "el-icon-printer",
    pathName: "打印模板",
  },
  {
    key: "/systemset/mange/cpconfig",
    title: "组件配置",
    path: "/systemset/mange/cpconfig",
    icon: "opfont opicon-componentcfg",
    pathName: "组件配置",
  },
];

export default menus;

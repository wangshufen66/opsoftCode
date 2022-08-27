
const tableList = [
  {
    key: 0,
    title: "首页",
    icon: "opfont opicon-home",
    path: "/home",
  },
  {
    key: 1,
    title: "客户列表",
    icon: "opfont opicon-userlist",
    children: [
      {
        key: 11,
        title: "注册用户",
        icon: "opfont opicon-user",
        path: "/systemset/mange/user",
      },
      {
        key: 12,
        title: "成交列表",
        icon: "opfont opicon-deal",
        path: "/systemset/mange/dealList",
      },
      {
        key: 13,
        title: "线索管理",
        icon: "opfont opicon-clue",
        path: "/systemset/mange/clueManagement",
      },
      // {
      //   key: 14,
      //   title: '合同管理',
      //   icon: "opfont opicon-contract",
      //   path: '/systemset/mange/contractManage',
      // }
    ],
  },
  {
    key: 2,
    title: "云搭运营",
    icon: "opfont opicon-operation",
    children: [
      {
        key: 21,
        title: "账套管理",
        icon: "opfont opicon-tenant",
        path: "/systemset/mange/tenant",
      },
      // {
      //   key: 22,
      //   title: '新增客户数量',
      //   path: '/systemset/mange/newCustomers'
      // },
      // {
      //   key: 22,
      //   title: '客户活跃度',
      //   path: '/systemset/mange/customerActivity'
      // },
      // {
      //   key: 23,
      //   title: '合同金额',
      //   icon: 'opfont opicon-contract',
      //   path: '/systemset/mange/contractAmount'
      // }
    ],
  },
  {
    key: 3,
    title: "综合功能",
    icon: "opfont opicon-comprehensive",
    children: [
      {
        key: 31,
        title: "启动页配置",
        icon: "opfont opicon-startup ",
        path: "/systemset/mange/startupPageConfig",
      },
      {
        key: 32,
        title: "消息中心",
        icon: "opfont opicon-message ",
        path: "/systemset/mange/newslist",
      },
    ],
  },
  {
    key: 4,
    title: "系统管理",
    icon: "opfont opicon-system-manage",
    children: [
      {
        key: 41,
        title: "账户中心",
        icon: "opfont opicon-account",
        children: [
          {
            key: 411,
            title: "角色管理",
            icon: "opfont opicon-role-manage",
            path: "/systemset/mange/roleManage",
          },
          {
            key: 412,
            title: "员工管理",
            icon: "opfont opicon-staff-manage",
            path: "/systemset/mange/staffManage",
          },

          {
            key: 414,
            title: "修改密码",
            icon: "opfont opicon-changepwd",
            path: "/systemset/mange/changePwd",
          },
        ],
      },
      {
        key: 42,
        title: "字典管理",
        icon: "opfont opicon-dictionary",
        path: "/systemset/mange/dictionary",
      },
      {
        key: 43,
        title: "运营日志",
        icon: "opfont opicon-log",
        path: "/systemset/mange/log",
      },
    ],
  },
];
export default tableList;

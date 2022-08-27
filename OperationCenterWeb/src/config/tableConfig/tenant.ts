//账套管理
export default [
  {
    prop: "orgId",
    label: "企业代码",
  },
  {
    prop: "orgName",
    label: "企业名称",
  },
  {
    prop: "expireTime",
    label: "到期时间",
    // showOverflowTooltip: true,
    width: 100,
  },
  {
    prop: "adminUser",
    width: 150,
    label: "超级管理员账号",
  },
  {
    prop: "disableStatus",
    label: "账套状态",
  },
  {
    prop: "applicationsList",
    label: "已授权应用",
    width: 150,
  },
  {
    prop: "accNum",
    width: 150,
    label: "已授权子账户数",
  },
  {
    prop: "createTime",
    width: 100,
    label: "账套创建时间",
    // showOverflowTooltip: true,
  },
  {
    prop: "updateTime",
    label: "授权更新时间",
    width: 100,
    // showOverflowTooltip: true,
  },
  {
    prop: "createBy",
    label: "创建人",
  },
  {
    prop: "remark",
    label: "账套信息",
  },
];

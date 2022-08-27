const pagecolumnConfig = [
  {
    prop: "pageName",
    label: "页面名称",
    minWidth: 120,
    "show-overflow-tooltip": true,
  },
  {
    prop: "pageType",
    label: "页面类型",
    width: "auto",
  },
  {
    prop: `pcIsUsing`,
    label: "PC可用状态",
    minWidth: 110,
  },
  {
    prop: "appIsUsing",
    label: "APP可用状态",
    minWidth: 110,
  },
  {
    prop: "useScope",
    label: "使用范围",
    minWidth: 120,
    "show-overflow-tooltip": true,
  },
  {
    prop: "pcOrd",
    label: "PC排序",
    width: "auto",
  },
  {
    prop: "appOrd",
    label: "APP排序",
    width: "auto",
  },
  {
    prop: "createTime",
    label: "创建时间",
    minWidth: 150,
    "show-overflow-tooltip": true,
  },
  {
    prop: "creator",
    label: "创建人",
    width: "auto",
  },
];

export default pagecolumnConfig;

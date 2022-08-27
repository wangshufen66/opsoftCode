export default [
  {
    tag: "el-table-column",
    label: "基站ID",
    prop: "number",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String"
  },
  {
    tag: "el-table-column",
    label: "基站型号",
    prop: "name",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String"
  },
  {
    tag: "el-table-column",
    label: "当前最大流水号",
    prop: "maxNum",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String"
  },
  {
    tag: "el-table-column",
    label: "DI通道数",
    prop: "di",
    minWidth: 120,
    showOverflowTooltip: true,
    comp: "Number"
  },
  {
    tag: "el-table-column",
    label: "DO通道数",
    prop: "dio",
    minWidth: 120,
    showOverflowTooltip: true,
    comp: "Number"
  },
  {
    tag: "el-table-column",
    label: "基站IP",
    prop: "ip",
    minWidth: 120,
    resizable: false,
    showOverflowTooltip: true,
    comp: "String"
  }
];

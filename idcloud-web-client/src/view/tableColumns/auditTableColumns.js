export default [
  {
    tag: "el-table-column",
    label: "审核状态",
    prop: "auditStatus",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "Checkbox",
  },
  {
    tag: "el-table-column",
    label: "审核人代码",
    prop: "auditPersonNumber",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "审核人姓名",
    prop: "auditPersonName",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "审核时间",
    prop: "auditTime",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "Datetime",
  },
];

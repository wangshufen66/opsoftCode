import auditTableColumns from './auditTableColumns';
import disableTableColumns from './disableTableColumns';

const unitInputPopupColumns=[
  {
    tag: "el-table-column",
    label: "计量单位代码",
    prop: "number",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "计量单位名称",
    prop: "name",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "转换率",
    prop: "conversionRate",
    minWidth: 120,
    showOverflowTooltip: true,
    comp: "Number",
  },
  {
    tag: "el-table-column",
    label: "基准计量单位",
    prop: "isBaseUnit",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "Checkbox",
  },
  {
    tag: "el-table-column",
    label: "备注",
    prop: "note",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "制单人代码",
    prop: "docMakerNumber",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "制单人姓名",
    prop: "docMakerName",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "创建时间",
    prop: "createTime",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "Datetime",
  },
  {
    tag: "el-table-column",
    label: "更新时间",
    prop: "updateTime",
    minWidth: 180,
    showOverflowTooltip: true,
    resizable: false,
    comp: "Datetime",
  },
];
const unitTableColumns=[unitInputPopupColumns,auditTableColumns,disableTableColumns].flat(1);
export {unitTableColumns as default,unitInputPopupColumns};

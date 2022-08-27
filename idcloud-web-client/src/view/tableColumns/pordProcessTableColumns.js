import auditTableColumns from './auditTableColumns';
import disableTableColumns from './disableTableColumns';

const processInputPopupColumns=[
  {
    tag: "el-table-column",
    label: "工序代码",
    prop: "number",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "工序名称",
    prop: "name",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "关键工序",
    prop: "isKey",
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
const processTableColumns=[processInputPopupColumns,auditTableColumns,disableTableColumns].flat(1);
export {processTableColumns as default,processInputPopupColumns};

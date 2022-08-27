import auditTableColumns from './auditTableColumns';
import disableTableColumns from './disableTableColumns';

const departmentInputPopupColumns=[
  {
    tag: "el-table-column",
    label: "部门代码",
    prop: "number",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "部门名称",
    prop: "name",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "部门属性",
    prop: "type",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "Select",
    options: [
      {
        label: "生产类",
        value: "0",
        authority: {
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        },
      },
      {
        label: "管理类",
        value: "1",
        authority: {
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        },
      },
      {
        label: "辅助类",
        value: "2",
        authority: {
          idLoad: false,
          idIf: true,
          idDisable: false,
          idShow: true,
        },
      },
    ],
  },
  {
    tag: "el-table-column",
    label: "负责人代码",
    prop: "managerNumber",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
  },
  {
    tag: "el-table-column",
    label: "负责人名称",
    prop: "managerName",
    minWidth: 180,
    showOverflowTooltip: true,
    comp: "String",
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
const departmentTableColumns=[departmentInputPopupColumns,auditTableColumns,disableTableColumns].flat(1);
export {departmentTableColumns as default,departmentInputPopupColumns};

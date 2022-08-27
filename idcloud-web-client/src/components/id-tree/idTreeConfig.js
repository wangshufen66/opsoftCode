import IdButtonConfig from "../id-button/IdButtonConfig";

export const configAll = [
  new IdButtonConfig("tree-open", "", "treeOpen", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-caret-bottom",
    title: "全部展开",
  }),
  new IdButtonConfig("tree-close", "", "treeClose", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-caret-top",
    title: "全部收起",
  }),
  new IdButtonConfig("tree-add", "", "treeAdd", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    title: "新增",
    afterClass: "el-icon-plus",
  }),
  new IdButtonConfig("tree-delete", "", "treeDelete", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-minus",
    title: "删除",
  }),
  new IdButtonConfig("tree-edit", "", "treeEdit", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-edit",
    title: "编辑",
  }),
  new IdButtonConfig("tree-search", "", "treeSearch", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-search",
    title: "搜索",
  }),
];
export const configBase = [
  new IdButtonConfig("tree-open", "", "treeOpen", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-caret-bottom",
    title: "全部展开",
  }),
  new IdButtonConfig("tree-close", "", "treeClose", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-caret-top",
    title: "全部收起",
  }),
  new IdButtonConfig("tree-search", "", "treeSearch", {
    tag: "id-button",
    styleTwo: true,
    afterIf: true,
    afterClass: "el-icon-search",
    title: "搜索",
  }),
];

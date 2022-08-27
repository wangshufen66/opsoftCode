import { IComponent } from "../../commonCfg";
import { TreeComponent } from "./IConfig";

export class Tree implements IComponent {
  constructor(config?: TreeComponent) {
    config && (this.config = config);
  }

  config: TreeComponent = {
    name: "Tree",
    componentTag: "designTree",
    __form__: {
      label: "树形组件",
      labelWidth: 0,
      span: 24,
    },
    __mConfig__: {
      inMobile: false,
      isTitle: false,
      isSecondTitle: false,
      isTime: false,
      isStatus: false,
      isProgress: false,
      isCard: false,
      isSearch: false,
      isTableSort: false,
    },
    __config__: {
      icon: "cascader",
      inTable: true,
    },
    __attr__: {
      props: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf",
      },
      accordion: false,
      "highlight-current": true,
      data: [],
    },
    options: [
      {
        id: +new Date(),
        name: "层级1",
        levelType: 1,
        pageTableName: "",
        fieldCode: "",
        fieldForeignCode: "",
        tableId: null,
      },
    ],

    // selectTableList: [],
  };

  verifyConfig(): string {
    return "";
  }
}

export const defaultConfig = new Tree();

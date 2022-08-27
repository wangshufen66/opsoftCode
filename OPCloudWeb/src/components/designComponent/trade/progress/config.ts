import { IComponent } from "../../commonCfg";
import { ProgressComponent } from "./IConfig";

export class Tree implements IComponent {
  constructor(config?: ProgressComponent) {
    config && (this.config = config);
  }

  config: ProgressComponent = {
    name: "progress",
    componentTag: "designProgress",
    __form__: {
      label: "工序进度",
      labelWidth: 0,
      required: false,
      span: 24,
    },
    __config__: {
      icon: "slider",
      sqlType: "VARCHAR2",
      inTable: true,
      inForm: false,
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
    __attr__: {
      childSpan: 8,
      data: [
        {
          progressName: "工序1",
          current: 50,
          total: 100,
          percentage: 50,
        },
      ],
    },
    options: {
      type: "line",
      "stroke-width": 5,
      "text-inside": false,
      color: [{ color: "#409eff", percentage: 11, begin: 0, end: 10 }],
      count: 1,
    },
  };

  verifyConfig(): string {
    return "";
  }
}

export const defaultConfig = new Tree();

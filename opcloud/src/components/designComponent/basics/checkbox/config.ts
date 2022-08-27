import { IComponent } from "../../commonCfg";
import { CheckComponent } from "./IConfig";

export class CheckBox implements IComponent {
  constructor(config?: CheckComponent) {
    config && (this.config = config);
  }

  config: CheckComponent = {
    name: "CheckBox",
    componentTag: "designCheckBox",
    __form__: {
      label: "多选框组",
      showLabel: true,
      required: false,
      span: 24,
      regList: [],
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
      icon: "check-box-outline",
      defaultValue: [],
      optionType: "default",
      sqlType: "VARCHAR2",
      inSearch: false,
      inTable: true,
      inForm: true,
      penetrate: {
        page: undefined,
        type: 1,
        portId: false,
        relIdField: undefined,
        relCfg: [],
      },
    },
    __attr__: {
      disabled: false,
      min: undefined,
      max: undefined,
      "text-color": "#fff",
      fill: "#409EFF",
    },
    __relTable__: {
      tableType: 1,
      dictType: undefined,
      tableId: undefined,
      tableName: undefined,
      key: undefined,
      relName: undefined,
      filterConfig: [],
    },
    // 数据属性值设置
    __props__: {
      label: "label",
      value: "value",
    },
    // 外观属性
    __option__: {
      disabled: false,
      border: false,
      indeterminate: false,
    },
    options: [
      {
        label: "选项1",
        value: "1",
      },
      {
        label: "选项2",
        value: "2",
      },
      {
        label: "选项3",
        value: "3",
      },
    ],
  };

  verifyConfig(): string {
    const config = this.config;
    const options = config.options;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = "";
    for (let i = 0; i < options.length; i++) {
      if (!options[i].label || !options[i].value) {
        message += `自定义选项的选项名、选项值不能为空<br/>`;
        break;
      }
    }
    if (
      config.__attr__.min &&
      config.__attr__.max &&
      config.__attr__.min >= config.__attr__.max
    ) {
      message += `最小选项只能小于最大选项<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new CheckBox();

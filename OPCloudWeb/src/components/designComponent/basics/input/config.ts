import { IComponent } from "../../commonCfg";
import { InputComponent } from "./IConfig";

export class Input implements IComponent {
  constructor(config?: InputComponent) {
    config && (this.config = config);
  }

  config: InputComponent = {
    name: "Input",
    componentTag: "designInput",
    __form__: {
      label: "单行输入框",
      showLabel: true,
      required: false,
      span: 24,
      regList: [],
    },
    __config__: {
      icon: "input1",
      defaultValue: undefined,
      sqlType: "VARCHAR2",
      inSearch: false,
      inTable: true,
      unique: false,
      relComponent: {
        componentId: undefined,
        field: undefined,
        isAbsolute: true,
      },
      inForm: true,
      dataModel: [],
      verifyComponent: {
        tag: undefined,
        type: undefined,
      },
      penetrate: {
        page: undefined,
        type: 1,
        portId: false,
        relIdField: undefined,
        relCfg: [],
      },
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
      placeholder: "请输入",
      clearable: true,
      "prefix-icon": "",
      "suffix-icon": "",
      maxlength: 100,
      "show-word-limit": false,
      readonly: false,
      disabled: false,
    },
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = "";
    // 最大长度
    const maxLength = config.__attr__.maxlength;
    if (maxLength && maxLength > 100) {
      message += `最大长度范围为1-${maxLength}<br/>`;
    }
    if (config.__config__.dataModel && config.__config__.dataModel.length > 0) {
      for (let i = 0; i < config.__config__.dataModel.length; i++) {
        const model = config.__config__.dataModel[i];
        if (!model.field) {
          message += `计算模型必须要设置对应字段<br/>`;
          break;
        }
        for (let j = i + 1; j < config.__config__.dataModel.length; j++) {
          if (model.type === config.__config__.dataModel[j].type) {
            message += `计算模型不能设置多个相同的模型<br/>`;
            break;
          }
        }
      }
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new Input();

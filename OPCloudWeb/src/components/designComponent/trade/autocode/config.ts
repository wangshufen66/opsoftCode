import { IComponent } from "../../commonCfg";
import { AutoCodeComponent, AutoCodeRuleType } from "./IConfig";

/**
 * 自编码组件
 */
export class AutoCode implements IComponent {
  constructor(config?: AutoCodeComponent) {
    config && (this.config = config);
  }

  config: AutoCodeComponent = {
    name: "AutoCode",
    componentTag: "designAutoCode",
    __form__: {
      label: "自编码",
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
      icon: "input1",
      sqlType: "VARCHAR2",
      inSearch: false,
      inTable: true,
      unique: false,
      inForm: true,
      isSeries: true,
    },
    __attr__: {
      placeholder: "",
      // 生成地址
      action: "",
      "reset-create": false,
      clearable: true,
      "prefix-icon": "",
      maxlength: 50,
      readonly: true,
      disabled: false,
    },
    autorule: {
      tableId: undefined,
      type: AutoCodeRuleType.AUTO_NUMBER,
      letter: undefined,
      numLen: 8,
      dataformat: undefined,
    },
  };

  verifyConfig(): string {
    const config = this.config;
    const { letter, numLen, type, dataformat } = config.autorule;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = "";
    // if (letter && (letter.length > 8 || letter.length < 4)) {
    //   message += `字母长度应为4-8<br/>`;
    // }

    if (type !== 4) {
      if (!numLen || numLen < 4 || numLen > 8) {
        message += `数字、自增长数字长度不能为空且长度应为4-8<br/>`;
      }
    }
    if ((type === 4 || type === 5 || type === 6) && !dataformat) {
      message += `请填写日期格式<br/>`;
    }

    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new AutoCode();

import { IComponent } from "../../commonCfg";
import { TextAreaComponent } from "./IConfig";

export class TextArea implements IComponent {
  constructor(config?: TextAreaComponent) {
    config && (this.config = config);

  }

  config: TextAreaComponent = {
    name: 'TextArea',
    componentTag: 'designTextArea',
    __form__: {
      label: '多行输入框',
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
      icon: 'textarea',
      defaultValue: undefined,
      sqlType: 'VARCHAR2',
      inSearch: false,
      inTable: true,
      inForm: true,
    },

    __attr__: {
      placeholder: '请输入',
      maxlength: 100,
      'show-word-limit': true,
      readonly: false,
      disabled: false,
      autosize: {
        minRows: 4,
        maxRows: 4,
      },
    },
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__}：</strong><br/>`;
    let message = '';
    // 最大长度
    const maxLength = config.__attr__.maxlength;
    if (maxLength && maxLength > 1000) {
      message += `最大长度范围为1-${maxLength}<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new TextArea();

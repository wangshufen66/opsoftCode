import { IComponent } from '../../commonCfg';
import { PasswordComponent } from './IConfig';

export class InputPassword implements IComponent {
  constructor(config?: PasswordComponent) {
    config && (this.config = config);

  }

  config: PasswordComponent = {
    name: 'InputPassword',
    componentTag: 'designPassword',
    __form__: {
      label: '密码',
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
      icon: 'password',
      defaultValue: undefined,
      sqlType: 'VARCHAR2',
      inSearch: false,
      inTable: true,
      inForm: true,
      dataModel: [],
      verifyComponent: {
        tag: undefined,
        type: undefined,
      },
    },
    __attr__: {
      placeholder: '请输入',
      clearable: true,
      'prefix-icon': '',
      'suffix-icon': '',
      maxlength: 20,
      readonly: false,
      disabled: false,
    },
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__}：</strong><br/>`;
    let message = ''
    // 最大长度
    const maxLength = config.__attr__.maxlength;
    if (maxLength && maxLength > 50) {
      message += `最大长度范围为1-${maxLength}<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new InputPassword();

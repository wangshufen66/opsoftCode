import { IComponent } from '../../commonCfg';
import { NumberComponent } from './IConfig';

export class InputNumber implements IComponent {
  constructor(config?: NumberComponent) {
    config && (this.config = config);
  }

  config: NumberComponent = {
    name: 'InputNumber',
    componentTag: 'designNumber',
    __form__: {
      label: '计数器',
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
      icon: 'shuzi',
      defaultValue: 0,
      sqlType: 'DOUBLE',
      inSearch: false,
      inTable: true,
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
    __attr__: {
      placeholder: '',
      min: undefined,
      max: undefined,
      step: 1,
      'step-strictly': false,
      precision: undefined,
      'controls-position': '',
      disabled: false,
    },
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = '';
    const { max, step } = config.__attr__;
    if (max && step && max < step) {
      message += `计数器步长不能大于最大值<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new InputNumber();

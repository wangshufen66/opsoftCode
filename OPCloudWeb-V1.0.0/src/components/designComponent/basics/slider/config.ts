import { IComponent } from '../../commonCfg';
import { SliderComponent } from './IConfig';

export class Slider implements IComponent {
  constructor(config?: SliderComponent) {
    config && (this.config = config);

  }

  config: SliderComponent = {
    name: 'Slider',
    componentTag: 'designSlider',
    __form__: {
      label: '滑块',
      showLabel: true,
      required: false,
      span: 24,
      regList: [],
    },
    __config__: {
      icon: 'slider',
      defaultValue: undefined,
      sqlType: 'INTEGER',
      inSearch: false,
      inTable: true,
      unique: false,
      inForm: true,
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
      min: 0,
      max: 100,
      disabled: false,
      step: 1,
      'show-stops': false,
      'show-tooltip': true,
      range: false,
      vertical: false,
      height: undefined,
    },
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__}：</strong><br/>`;
    let message = '';
    const { max, step } = config.__attr__;
    if (max && step && max < step) {
      message += `步长不能大于最大值<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

// 标准组件初始配置
export const defaultConfig = new Slider();

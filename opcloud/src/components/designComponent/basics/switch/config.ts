import { IComponent } from '../../commonCfg';
import { SwitchComponent } from './IConfig';

export class Switch implements IComponent {
  constructor(config?: SwitchComponent) {
    config && (this.config = config);

  }

  config: SwitchComponent = {
    name: 'Switch',
    componentTag: 'designSwitch',
    __form__: {
      label: '开关',
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
      icon: 'switch',
      defaultValue: 0,
      sqlType: 'INTEGER',
      inSearch: false,
      inTable: true,
      activeText: '开',
      inactiveText: '关',
      inForm: true,
    },
    __attr__: {
      disabled: false,
      // 'active-text': undefined,
      // 'inactive-text': undefined,
      'active-color': '#409EFF',
      'inactive-color': '#C0CCDA',
      // 开启的值
      'active-value': 1,
      // 关闭的值
      'inactive-value': 0,
    },
  };

  verifyConfig(): string {
    return '';
  }
}

// 标准组件初始配置
export const defaultConfig = new Switch();

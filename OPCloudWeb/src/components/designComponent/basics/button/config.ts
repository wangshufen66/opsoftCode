import { IComponent } from '../../commonCfg';
import { ButtonComponent } from './IConfig';

/**
 * 颜色选择器组件
 */
export class Button implements IComponent {
  constructor(config?: ButtonComponent) {
    config && (this.config = config);
  }

  config: ButtonComponent = {
    name: 'Button',
    componentTag: 'designButton',
    __form__: {
      label: '按钮组件',
      labelWidth: 0,
    },
    __config__: {
      icon: 'cascader',
      inSearch: false,
      inTable: false,
      unique: false,
      inForm: true,
      title: '按钮',
      eventCode: '',
    },
    __attr__: {
      disabled: false,
      type: 'primary',
      size: 'medium'
    },
  };

  verifyConfig(): string {
    return '';
  }
}

export const defaultConfig = new Button();

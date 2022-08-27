import { IComponent } from '../../commonCfg';
import { ColorPickerComponent } from './IConfig';

/**
 * 颜色选择器组件
 */
export class ColorPicker implements IComponent {
  constructor(config?: ColorPickerComponent) {
    config && (this.config = config);
  }

  config: ColorPickerComponent = {
    name: 'ColorPicker',
    componentTag: 'designColorPicker',
    __form__: {
      label: '颜色选择',
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
      icon: 'colorpicker',
      defaultValue: 'rgba(64, 158, 255, 1)',
      sqlType: 'VARCHAR2',
      inSearch: false,
      inTable: true,
      unique: false,
      inForm: true,
    },
    __attr__: {
      disabled: false,
      'show-alpha': true,
      'color-format': 'rgb',
    },
  };

  verifyConfig(): string {
    return '';
  }
}

export const defaultConfig = new ColorPicker();

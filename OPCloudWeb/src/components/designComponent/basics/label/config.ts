import { IComponent } from '../../commonCfg';
import { LabelComponent } from './IConfig';

export class Label implements IComponent {
  constructor(config?: LabelComponent) {
    config && (this.config = config);

  }

  config: LabelComponent = {
    name: 'Label',
    componentTag: 'designLabel',
    __form__: {
      label: '标题',
      labelWidth: 0,
    },
    __config__: {
      icon: 'label',
      label: '标题名称',
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
      'prefix-icon': undefined,
      prefixLine: true,
      prefixLineColor: '#539af8',
      prefixLineWidth: 4,
      fontSize: 14,
      fontColor: '#333',
      italic: false,
      bold: false,
      bgcolor: 'rgba(255,255,255,0)',
    },
  };

  verifyConfig(): string {
    return '';
  }
}

export const defaultConfig = new Label();

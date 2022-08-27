import { IComponent } from '../../commonCfg';
import { TimePickerComponent } from './IConfig';

export class TimePicker implements IComponent {
  constructor(config?: TimePickerComponent) {
    config && (this.config = config);

  }

  config: TimePickerComponent = {
    name: 'TimePicker',
    componentTag: 'designTimePicker',
    __form__: {
      label: '时间选择',
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
      icon: 'time',
      defaultValue: undefined,
      sqlType: 'DATE',
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
      placeholder: '请选择时间',
      readonly: false,
      editable: false,
      disabled: false,
      clearable: true,
      'arrow-control': false,
      format: 'HH:mm:ss',
      'default-value': undefined,
    },
  };

  verifyConfig(): string {
    return '';
  }
}
// 标准组件初始配置
export const defaultConfig = new TimePicker();

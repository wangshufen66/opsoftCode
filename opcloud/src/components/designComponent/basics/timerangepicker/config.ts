import { IComponent } from '../../commonCfg';
import { TimeRangePickerComponent } from './IConfig';

/**
 * 时间范围组件
 */
export class TimeRangePicker implements IComponent {
  constructor(config?: TimeRangePickerComponent) {
    config && (this.config = config);

  }

  config: TimeRangePickerComponent = {
    name: 'TimeRangePicker',
    componentTag: 'designTimeRangePicker',
    __form__: {
      label: '时间范围',
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
      icon: 'time-range',
      defaultValue: undefined,
      sqlType: 'DATE',
      inSearch: false,
      inTable: true,
      inForm: true,
    },
    __attr__: {
      placeholder: '请选择时间范围',
      readonly: false,
      editable: false,
      disabled: false,
      clearable: true,
      'arrow-control': false,
      format: 'HH:mm:ss',
      'default-value': undefined,
      'is-range': true,
      'start-placeholder': '开始时间',
      'end-placeholder': '结束时间',
    },
  };

  verifyConfig(): string {
    return '';
  }
}

// 标准组件初始配置
export const defaultConfig = new TimeRangePicker();

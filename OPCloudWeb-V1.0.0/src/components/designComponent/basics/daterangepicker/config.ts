import { IComponent } from '../../commonCfg';
import { DateRangePickerComponent } from './IConfig';

/**
 * 日期范围组件
 */
export class DateRangePicker implements IComponent {
  constructor(config?: DateRangePickerComponent) {
    config && (this.config = config);
  }

  config: DateRangePickerComponent = {
    name: 'DateRangePicker',
    componentTag: 'designDateRangePicker',
    __form__: {
      label: '日期范围',
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
      type: 'daterange',
      icon: 'date-range',
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
    },
    __attr__: {
      placeholder: '请选择日期范围',
      readonly: false,
      editable: false,
      disabled: false,
      clearable: true,
      format: 'YYYY-MM-DD',
      'default-value': undefined,
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      'range-separator': '-',
    },
  };

  verifyConfig(): string {
    return '';
  }
}
// 标准组件初始配置
export const defaultConfig = new DateRangePicker();

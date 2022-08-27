import { IComponent } from "../../commonCfg";
import { DatePickerComponent } from "./IConfig";

/**
 * DatePicker 组件
 */
export class DatePicker implements IComponent {

  constructor(config?: DatePickerComponent) {
    config && (this.config = config);

  }

  config: DatePickerComponent = {
    name: 'DatePicker',
    componentTag: 'designDatePicker',
    __form__: {
      label: '日期选择',
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
      type: 'date',
      icon: 'date',
      // defaultValue: undefined,
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
      placeholder: '请选择日期',
      readonly: false,
      editable: false,
      disabled: false,
      clearable: true,
      format: 'YYYY-MM-DD',
      // 'default-value': undefined,
    },
  };

  verifyConfig(): string {
    return ''
  }
}

export const defaultConfig = new DatePicker();
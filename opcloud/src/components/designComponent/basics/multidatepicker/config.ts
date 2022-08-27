import { IComponent } from "../../commonCfg";
import { MultiDatePickerComponent } from "./IConfig";

/**
 * MultiDatePicker 组件
 */
export class MultiDatePicker implements IComponent {
  constructor(config?: MultiDatePickerComponent) {
    config && (this.config = config);
  }

  config: MultiDatePickerComponent = {
    name: "MultiDatePicker",
    componentTag: "designMultiDatePicker",
    __form__: {
      label: "日期多选",
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
      type: "dates",
      icon: "date",
      defaultValue: undefined,
      sqlType: "VARCHAR2",
      inSearch: false,
      inTable: true,
      inForm: true,
      penetrate: {
        page: undefined,
        type: 1,
        portId: false,
        relIdField: undefined,
        relCfg: [],
      },
    },
    __attr__: {
      placeholder: "请选择日期",
      readonly: false,
      editable: false,
      disabled: false,
      clearable: true,
      format: "YYYY-MM-DD",
      "default-value": undefined,
    },
  };

  verifyConfig(): string {
    return "";
  }
}

export const defaultConfig = new MultiDatePicker();

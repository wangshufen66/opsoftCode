import { IComponent } from "../../commonCfg";
import { TabTableComponent } from "./IConfig";

export class TabTable implements IComponent {
  constructor(config?: TabTableComponent) {
    config && (this.config = config);
  }

  config: TabTableComponent = {
    name: "TabTable",
    componentTag: "designTabTable",
    __form__: {
      label: "主从表组件",
      labelWidth: 0,
      required: false,
      span: 24,
    },
    __config__: {
      icon: "table-list",
      inForm: true,
      loading: false,
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
    tabOptions: [],
    selectModelList: [],
    columnModelList: [],
    relFields: [],
    // copyData: [],
    dataSourceList: [],
  };

  verifyConfig(): string {
    const { tabOptions, selectModelList, columnModelList, relFields } =
      this.config;
    const config = this.config;
    let verify = `<strong>${
      config.__form__?.label || config.__vModel__
    }：</strong><br/>`;
    let message = "";
    if (tabOptions.length === 0) {
      message += `请设置标签页<br/>`;
    }
    if (tabOptions && tabOptions.some((f) => !f.label)) {
      message += `标签页名称不能为空<br/>`;
    }
    if (selectModelList && selectModelList.some((f) => f.config.length === 0)) {
      message += `标签页的数据源未设置<br/>`;
    }
    if (
      columnModelList &&
      columnModelList.some((f) => f.columnConfig.length === 0)
    ) {
      message += `标签页的表格列未设置<br/>`;
    }
    if (relFields && relFields.some((f) => !f.field)) {
      message += `标签页表格主表字段、表格字段未设置<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new TabTable();

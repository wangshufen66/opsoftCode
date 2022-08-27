import { IComponent } from "../../commonCfg";
import { DialogSelectComponent } from "./IConfig";

export class DialogSelect implements IComponent {
  constructor(config?: DialogSelectComponent) {
    config && (this.config = config);
  }

  config: DialogSelectComponent = {
    name: "DialogSelect",
    componentTag: "designDialogSelect",
    __form__: {
      label: "开窗组件",
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
      icon: "table-search",
      sqlType: "VARCHAR2",
      inSearch: false,
      inTable: true,
      unique: false,
      valueBindField: undefined,
      textBindField: undefined,
      inForm: true,
      relComponent: {
        componentId: undefined,
        isAbsolute: false,
        relField: undefined,
      },
    },
    __attr__: {
      clearable: true,
      placeholder: "请选择",
      "suffix-icon": "el-icon-search",
      readonly: true,
      disabled: false,
    },
    props: {
      label: undefined,
      value: undefined,
    },
    selectModel: [],
    columnModel: [],
    copyData: {
      /** 绑定复制功能*/
      bindCopy: "",
      /**关联条件*/
      relation: "",
      /**关联的组件Id*/
      componentId: undefined,
    },
  };

  verifyConfig(): string {
    const { selectModel, columnModel } = this.config;
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = "";
    if (selectModel.length === 0) {
      message += `请设置数据源<br/>`;
    }
    if (columnModel && columnModel.length === 0) {
      message += `请设置表格列<br/>`;
    }
    if (columnModel && !columnModel.some((f) => f.check)) {
      message += `请设置表格显示的列<br/>`;
    }
    if (!config.__config__.valueBindField) {
      message += `请设置绑定的值<br/>`;
    }
    if (!config.__config__.textBindField) {
      message += `请设置显示文本<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new DialogSelect();

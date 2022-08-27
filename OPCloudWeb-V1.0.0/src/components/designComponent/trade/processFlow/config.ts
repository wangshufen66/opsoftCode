import { IComponent } from "../../commonCfg";
import { ProcessFlowComponent } from "./IConfig";

/**
 * 工序流程组件
 */
export class ProcessFlow implements IComponent {
  constructor(config?: ProcessFlowComponent) {
    config && (this.config = config);
  }

  config: ProcessFlowComponent = {
    name: "ProcessFlow",
    componentTag: "designProcessFlow",
    __form__: {
      label: "工序流程",
      labelWidth: 0,
      required: false,
      span: 24,
    },
    __config__: {
      icon: "cascader",
      target: undefined,
      height: 250,
    },
    __nodeStatus__: [],
    nodeList: [],
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
  };

  verifyConfig(): string {
    const config = this.config;
    const statusList = config.__nodeStatus__;
    let verify = `<strong>${
      config.__form__?.label || config.__vModel__
    }：</strong><br/>`;
    let message = "";
    statusList.length > 0 &&
      statusList.findIndex((f) => !f.color || !f.value) > -1 &&
      (message += `状态值对应颜色都必须有值<br/>`);

    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new ProcessFlow();

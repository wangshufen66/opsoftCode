import { IComponent } from "../../commonCfg";
import { PanelLayoutComponent } from "./IConfig";

export class PanelLayout implements IComponent {
  constructor(config?: PanelLayoutComponent) {
    config && (this.config = config);
    
  }

  config: PanelLayoutComponent = {
    name: 'PanelLayout',
    componentTag: 'designPanelLayout',
    __form__: {
      label: '容器',
      span: 24,
      labelWidth: 0,
    },
    __config__: {
      icon: 'panel',
      isLayout: true,
    },
    __attr__: {},
  };

  verifyConfig(): string {
    return '';
  }
}

// 标准组件初始配置
export const defaultConfig = new PanelLayout();

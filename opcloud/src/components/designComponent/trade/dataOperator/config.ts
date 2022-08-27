import { IComponent } from '../../commonCfg';
import { ComponentFunType } from '../../enum';
import { DataOperatorComponent } from './IConfig';

/**
 * 操作人组件
 */
export class DataOperator implements IComponent {
  constructor(config?: DataOperatorComponent) {
    config && (this.config = config);
  }

  config: DataOperatorComponent = {
    name: 'DataOperator',
    componentTag: 'designDataOperator',
    funType: ComponentFunType.CONTAINER,
    __form__: {
      label: '操作人',
      labelWidth: 0,
      span: 24,
    },
    __config__: {
      icon: 'operateor',
      inForm: true,
    },
    __attr__: {
      childSpan: 24,
      creator: true,
      createTime: true,
      updater: true,
      updateTime: true,
    },
  };

  verifyConfig(): string {
    let message = '';
    return message;
  }
}

export const defaultConfig = new DataOperator();

import { IComponent } from '../../commonCfg';
import { CalculateComponent, ResultType } from './IConfig';

/**
 * 换算组件
 */
export class Calculate implements IComponent {
  constructor(config?: CalculateComponent) {
    config && (this.config = config);
  }

  config: CalculateComponent = {
    name: 'Calculate',
    componentTag: 'designCalculate',
    __form__: {
      label: '换算组件',
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
      icon: 'input1',
      defaultValue: undefined,
      decimalSize: '0',
      formula: '',
      resultType: ResultType.VALUE,
      sqlType: 'VARCHAR2',
      inTable: true,
      unique: false,
      inForm: true,
    },
    // __relTable__: {
    //   tableType: 1,
    //   dictType: undefined,
    //   tableId: undefined,
    //   tableName: undefined,
    //   key: undefined,
    //   relName: undefined,
    //   filterConfig: [],
    // },
    __attr__: {
      placeholder: '请输入',
      readonly: true,
      disabled: false,
    },
  };

  verifyConfig(): string {
    return '';
  }
}

export const defaultConfig = new Calculate();

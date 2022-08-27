import { IComponent } from '../../commonCfg';
import { CascaderComponent } from './IConfig';
/**
 * 级联组件
 */
export class Cascader implements IComponent {
  constructor(config?: CascaderComponent) {
    config && (this.config = config);

  }

  config: CascaderComponent = {
    name: 'Cascader',
    componentTag: 'designCascader',
    __form__: {
      label: '级联选择',
      showLabel: true,
      required: false,
      span: 24,
      regList: [],
    },
    __config__: {
      icon: 'cascader',
      sqlType: 'VARCHAR2',
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
    __attr__: {
      placeholder: '请选择',
      props: {
        emitPath: false,
        multiple: false,
        label: 'label',
        value: 'value',
        children: 'children',
      },
      'show-all-levels': true,
      disabled: false,
      clearable: true,
      filterable: false,
      separator: '/',
      options: [],
    },
    __relTable__: {
      tableType: 1,
      dictType: undefined,
      tableId: undefined,
      tableName: undefined,
      key: undefined,
      relName: undefined,
      filterConfig: [],
    },
    __customExpression__: undefined,
  };

  verifyConfig(): string {
    return '';
  }

  transformConfig() {
    // this.config
  }
}

export const defaultConfig = new Cascader();

import { IComponent } from '../../commonCfg';
import { MoreSelectComponent } from './IConfig';

/**
 * Select 组件
 * @export
 * @class Select
 */
export class MoreSelect implements IComponent {
  constructor(config?: MoreSelectComponent) {
    config && (this.config = config);
  }

  config: MoreSelectComponent = {
    name: 'MoreSelect',
    componentTag: 'designMoreSelect',
    __form__: {
      label: '下拉多选',
      showLabel: true,
      required: true,
      span: 24,
      regList: [],
    },
    __config__: {
      defaultValue: undefined,
      icon: 'select',
      sqlType: 'VARCHAR2',
      inSearch: false,
      inTable: true,
      unique: false,
      inForm: true,
      relComponent: {
        componentId: undefined,
        field: undefined,
        isAbsolute: true,
      },
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
      clearable: true,
      disabled: false,
      filterable: false,
      multiple: true,
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
    // 数据属性值设置
    __props__: {
      label: 'label',
      value: 'value',
    },
    // 外观属性
    __option__: {
      disabled: false,
    },
    options: [
      { label: '选项一', value: 1 },
      { label: '选项二', value: 2 },
    ],
  };

  verifyConfig(): string {
    const config = this.config;
    const options = config.options;
    let verify = `<strong>${config.__form__?.label || config.__vModel__
      }：</strong><br/>`;
    let message = '';
    for (let i = 0; i < options.length; i++) {
      if (!options[i].label || !options[i].value) {
        message += `自定义选项的选项名、选项值不能为空`;
        break;
      }
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new MoreSelect();

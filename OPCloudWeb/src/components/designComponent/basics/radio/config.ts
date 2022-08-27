import { IComponent } from '../../commonCfg';
import { RadioComponent } from './IConfig';
/**
 * 单选组件
 */
export class RadioBox implements IComponent {
  constructor(config?: RadioComponent) {
    config && (this.config = config);

  }

  config: RadioComponent = {
    name: 'RadioBox',
    componentTag: 'designRadio',
    __form__: {
      label: '单选框组',
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
      icon: 'radioactive',
      defaultValue: undefined,
      optionType: 'default',
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
    __attr__: {
      disabled: false,
      'text-color': '#fff',
      fill: '#409EFF',
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
    __option__: {
      disabled: false,
      border: false,
    },
    // 数据属性值设置
    __props__: {
      label: 'label',
      value: 'value',
    },
    options: [
      {
        label: '选项一',
        value: '1',
      },
      {
        label: '选项二',
        value: '2',
      },
    ],
  };

  verifyConfig(): string {
    const config = this.config;
    const options = config.options;
    let verify = `<strong>${config.__form__?.label || config.__vModel__}：</strong><br/>`;
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

// 标准组件初始配置
export const defaultConfig = new RadioBox();

import { IComponent } from '../../commonCfg';
import { TableComponent } from './IConfig';
/**
 * 表格组件
 */
export class Table implements IComponent {
  constructor(config?: TableComponent) {
    config && (this.config = config);

  }

  config: TableComponent = {
    name: 'Table',
    componentTag: 'designTable',
    __form__: {
      label: '数据表格',
      labelWidth: 0,
      span: 24,
    },
    __config__: {
      icon: 'table',
      inForm: true,
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
      selectionCol: true,
      batchDelete: false,
      indexCol: true,
      paging: false,
    },
    selectModel: [],
    columnModel: [],
  };

  verifyConfig(): string {
    const { selectModel, columnModel } = this.config;
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__}：</strong><br/>`;
    let message = '';
    if (selectModel.length === 0) {
      message += `请设置数据源<br/>`;
    }
    if (columnModel.length === 0) {
      message += `请设置表格列<br/>`;
    }
    if (columnModel && !columnModel.some((f) => f.check)) {
      message += `请设置表格显示的列<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new Table();

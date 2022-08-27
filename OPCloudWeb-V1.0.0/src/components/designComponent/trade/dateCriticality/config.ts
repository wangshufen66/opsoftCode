import { ResultUnit } from '@/use/useConst';
import { IComponent } from '../../commonCfg';
import { DateCriticalityComponent } from './IConfig';

/**
 * 日期计算组件
 */
export class DateCriticality implements IComponent {
  constructor(config?: DateCriticalityComponent) {
    config && (this.config = config);

  }

  config: DateCriticalityComponent = {
    name: 'DateCriticality',
    componentTag: 'designDateCriticality',
    __form__: {
      label: '日期计算',
      showLabel: true,
      required: false,
      span: 24,
    },
    __config__: {
      icon: 'schedule',
      sqlType: 'VARCHAR2',
      inSearch: false,
      inTable: true,
      resultUnit: ResultUnit.DAY,
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
      'prefix-icon': '',
      readonly: true,
    },
    datum: {
      tableName: undefined,
      relField: undefined,
      dateFileName: undefined,
    },
    contrast: {
      tableName: undefined,
      relField: undefined,
      dateFileName: undefined,
    },
    result: [
      {
        type: '正常',
        criticalityValue: 3,
        criticalityLabel: undefined,
        criticalityColor: '#333',
      },
      {
        type: '预警值',
        criticalityValue: 2,
        criticalityLabel: '超期',
        criticalityColor: '#E6A23C',
      },
      {
        type: '异常',
        criticalityValue: 0,
        criticalityLabel: '已超期',
        criticalityColor: '#F56C6C',
      },
    ],
  };

  verifyConfig(): string {
    const config = this.config;
    let verify = `<strong>${config.__form__?.label || config.__vModel__}：</strong><br/>`;
    let message = '';
    const { datum, contrast } = config;
    if (datum.tableName && (!datum.relField || !datum.dateFileName)) {
      message += `基准时间关联表设置后，表字段、关联字段、日期字段必须设置<br/>`;
    }
    if (!datum.tableName && (datum.relField || datum.dateFileName)) {
      message += `基准时间表字段、关联字段、日期字段设置后，关联表必须设置<br/>`;
    }
    if (contrast.tableName && (!contrast.relField || !contrast.dateFileName)) {
      message += `目标时间关联表设置后，表字段、关联字段、日期字段必须设置<br/>`;
    }
    if (!contrast.tableName && (contrast.relField || contrast.dateFileName)) {
      message += `目标时间表字段、关联字段、日期字段设置后，关联表必须设置<br/>`;
    }
    message && (message = verify + message);
    return message;
  }
}

export const defaultConfig = new DateCriticality();

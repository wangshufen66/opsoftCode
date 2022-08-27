import { ResultUnit } from '@/use/useConst';
import { ComponentBaseCfg, BaseCustomCfg, IComponent } from '../../commonCfg';

/**
 * DateCriticality组件结构
 * 时间临界点组件
 */
export interface DateCriticalityComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designDateCriticality';
  /**
   * 自定义配置
   */
  __config__: DateCriticalityCfg;
  /**
   * 组件属性配置
   */
  __attr__: DateCriticalityAttribute;
  /**
   * 基准配置
   */
  datum: RelTable;
  /**
   * 对比目标配置
   */
  contrast: RelTable;
  /**
   * 结果配置
   */
  result: Result[];

}

/**
 * 自定义配置
 * @export
 */
export interface DateCriticalityCfg extends BaseCustomCfg {
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
  /**
   * 计算结果单位
   */
  resultUnit?: ResultUnit;
}
/**
 * 组件属性
 * @export
 */
export interface DateCriticalityAttribute {
  'prefix-icon'?: string;
  disabled?: boolean;
  readonly?: boolean;
}
/**
 * 关联配置
 */
type RelTable = {
  /**
   * 关联表
   */
  tableName?: string;
  /**
   * 表单字段
   */
  field?: string;
  /**
   * 关联字段
   */
  relField?: string;
  /**
   * 用于计算的日期字段
   */
  dateFileName?: string;
};

/**
 * 结果
 */
export type Result = {
  /**
   * 类型
   */
  type?: string;
  /**
   * 临界值
   */
  criticalityValue?: number;
  /**
   * 临界描述
   */
  criticalityLabel?: string;
  /**
   * 显示颜色
   */
  criticalityColor?: string;
};
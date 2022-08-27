import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * CheckBox组件结构
 */
export interface CheckComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designCheckBox';
  /**
   * 自定义配置
   */
  __config__: CheckCfg;
  /**
   * 组件属性配置
   */
  __attr__: CheckAttribute;
  /**
   * 单项配置
   *
   */
  __option__: CheckOptions;
  /**
   * 属性配置
   */
  __props__: CheckProps;
  /**
   * 数据源
   */
  options: any[];


}

/**
 * 自定义配置
 * @export
 * @interface CheckCfg
 */
export interface CheckCfg extends BaseCustomCfg {
  icon?: string;
  defaultValue?: any[];
  optionType?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性(group属性)
 * @export
 * @interface CheckAttribute
 */
export interface CheckAttribute {
  disabled?: boolean;
  min?: number;
  max?: number;
  'text-color'?: string;
  fill?: string;
}

/**
 * check属性
 */
export interface CheckOptions {
  disabled?: boolean;
  border?: boolean;
  // 是否支持全选
  indeterminate?: boolean;
}
/**
 * 数据绑定字段属性设置
 */
export interface CheckProps {
  // 用于显示标签文本的属性
  label: string;
  // 用于显示标签值的属性
  value: string;
}
import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Input组件结构
 */
export interface RadioComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designRadio';
  /**
   * 自定义配置
   */
  __config__: RadioCfg;
  /**
   * 组件属性配置
   */
  __attr__: RadioAttribute;
  /**
   * 选项配置
   */
  __option__: RadioOption;
  /**
   * 属性配置
   */
  __props__: RadioProps;
  // 数据源
  options: any[];

}

/**
 * 自定义配置
 * @export
 * @interface RadioCfg
 */
export interface RadioCfg extends BaseCustomCfg {
  icon?: string;
  defaultValue?: number | string | boolean;
  optionType?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface RadioAttribute
 */
export interface RadioAttribute {
  disabled?: boolean;
  'text-color'?: string;
  fill?: string;
}

/**
 * radio属性
 */
export interface RadioOption {
  disabled?: boolean;
  border?: boolean;
}

/**
 * 数据绑定字段属性设置
 */
export interface RadioProps {
  // 用于显示标签文本的属性
  label: string;
  // 用于显示标签值的属性
  value: string;
}
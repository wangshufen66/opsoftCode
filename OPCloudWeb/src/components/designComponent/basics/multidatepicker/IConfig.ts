import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Switch组件结构
 */
export interface MultiDatePickerComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designMultiDatePicker';
  /**
   * 自定义配置
   */
  __config__: MultiDatePickerCfg;
  /**
   * 组件属性配置
   */
  __attr__: MultiDatePickerAttribute;

}
/**
 * 自定义配置
 * @export
 * @interface MultiDatePickerCfg
 */
export interface MultiDatePickerCfg extends BaseCustomCfg {
  type: 'dates';
  icon?: string;
  defaultValue?: Date;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface MultiDatePickerAttribute
 */
export interface MultiDatePickerAttribute {
  placeholder?: string;
  readonly?: boolean;
  editable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  format?: string;
  'default-value'?: Date;
}
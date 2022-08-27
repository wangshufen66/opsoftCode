import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Switch组件结构
 */
export interface DatePickerComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designDatePicker';
  /**
   * 自定义配置
   */
  __config__: DatePickerCfg;
  /**
   * 组件属性配置
   */
  __attr__: DatePickerAttribute;

}
/**
 * 自定义配置
 * @export
 * @interface DatePickerCfg
 */
export interface DatePickerCfg extends BaseCustomCfg {
  type: 'date' | 'datetime' | 'week' | 'month' | 'year' | 'dates';
  icon?: string;
  // defaultValue?: Date;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface DatePickerAttribute
 */
export interface DatePickerAttribute {
  placeholder?: string;
  readonly?: boolean;
  editable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  format?: string;
  // 'default-value'?: Date;
}
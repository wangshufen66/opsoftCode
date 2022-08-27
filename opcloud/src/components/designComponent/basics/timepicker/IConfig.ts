import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Switch组件结构
 */
export interface TimePickerComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designTimePicker';
  /**
   * 自定义配置
   */
  __config__: TimePickerCfg;
  /**
   * 组件属性配置
   */
  __attr__: TimePickerAttribute;

}

/**
 * 自定义配置
 * @export
 * @interface TimePickerCfg
 */
export interface TimePickerCfg extends BaseCustomCfg {
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
 * @interface TimePickerAttribute
 */
export interface TimePickerAttribute {
  placeholder?: string;
  readonly?: boolean;
  editable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  'arrow-control'?: boolean;
  'is-range'?: false;
  format?: string;
  'default-value'?: Date;
}
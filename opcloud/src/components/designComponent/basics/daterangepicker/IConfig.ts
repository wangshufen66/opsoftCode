import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Switch组件结构
 */
export interface DateRangePickerComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designDateRangePicker';
  /**
   * 自定义配置
   */
  __config__: DateRangePickerCfg;
  /**
   * 组件属性配置
   */
  __attr__: DateRangePickerAttribute;

}

/**
 * 自定义配置
 * @export
 * @interface DateRangePickerCfg
 */
export interface DateRangePickerCfg extends BaseCustomCfg {
  type: 'daterange' | 'monthrange' | 'datetimerange';
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
 * @interface DateRangePickerAttribute
 */
export interface DateRangePickerAttribute {
  placeholder?: string;
  readonly?: boolean;
  editable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  'arrow-control'?: boolean;
  format?: string;
  'default-value'?: Date;
  'start-placeholder'?: string;
  'end-placeholder'?: string;
  'range-separator'?: string;
}
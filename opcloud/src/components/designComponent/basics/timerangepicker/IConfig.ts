import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * 时间范围组件结构
 */
export interface TimeRangePickerComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designTimeRangePicker';
  /**
   * 自定义配置
   */
  __config__: TimeRangePickerCfg;
  /**
   * 组件属性配置
   */
  __attr__: TimeRangePickerAttribute;

}

/**
 * 自定义配置
 * @export
 * @interface TimeRangePickerCfg
 */
export interface TimeRangePickerCfg extends BaseCustomCfg {
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
 * @interface TimeRangePickerAttribute
 */
export interface TimeRangePickerAttribute {
  placeholder?: string;
  readonly?: boolean;
  editable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  'arrow-control'?: boolean;
  'is-range': true;
  format?: string;
  'default-value'?: Date;
  'start-placeholder'?: string;
  'end-placeholder'?: string;
}
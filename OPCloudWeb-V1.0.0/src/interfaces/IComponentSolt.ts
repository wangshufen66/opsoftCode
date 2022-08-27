/**
 * 组件solt option配置
 */
export interface IComponentSoltOption {
  label?: string | number | boolean;
  value?: any;
}
/**
 * 组件solt配置
 */
export interface IComponentSolt {
  prepend?: string;
  append?: string;
  options?: Array<IComponentSoltOption>;
  'list-type'?: boolean;
  default?: string;
  tag?: string;
  labelKey?: string;
  valueKey?: string;
}

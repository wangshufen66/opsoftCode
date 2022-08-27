import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * colorpicker组件结构
 */
export interface ColorPickerComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designColorPicker';
  /**
   * 自定义配置
   */
  __config__: ColorPickerCfg;
  /**
   * 组件属性配置
   */
  __attr__: ColorPickerAttribute;


}

/**
 * 自定义配置
 * @export
 * @interface ColorPickerCfg
 */
export interface ColorPickerCfg extends BaseCustomCfg {
  defaultValue?: string;
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface ColorPickerAttribute
 */
export interface ColorPickerAttribute {
  disabled?: boolean;
  'show-alpha'?: boolean;
  'color-format'?: string;
  predefine?: Array<string>;
}
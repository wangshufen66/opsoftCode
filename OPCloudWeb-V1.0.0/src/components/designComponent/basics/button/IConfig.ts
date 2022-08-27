import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * colorpicker组件结构
 */
export interface ButtonComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designButton';
  /**
   * 自定义配置
   */
  __config__: ButtonCfg;
  /**
   * 组件属性配置
   */
  __attr__: ButtonAttribute;

}
/**
 * 自定义配置
 * @export
 * @interface ButtonCfg
 */
export interface ButtonCfg extends BaseCustomCfg {
  icon?: string;
  inSearch?: boolean;
  inTable?: boolean;
  title?: string;
  eventCode?: string;
}

/**
 * 组件属性
 * @export
 * @interface ButtonAttribute
 */
export interface ButtonAttribute {
  disabled?: boolean;
  type?: string;
  size?: string
}
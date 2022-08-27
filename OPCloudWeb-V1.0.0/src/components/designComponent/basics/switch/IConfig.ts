import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Switch组件结构
 */
export interface SwitchComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designSwitch';
  /**
   * 自定义配置
   */
  __config__: SwitchCfg;
  /**
   * 组件属性配置
   */
  __attr__: SwitchAttribute;

}

/**
 * 自定义配置
 * @export
 * @interface SwitchCfg
 */
export interface SwitchCfg extends BaseCustomCfg {
  icon?: string;
  defaultValue?: boolean | string | number;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
  activeText?: string;
  inactiveText?: string;
}

/**
 * 组件属性
 * @export
 * @interface SwitchAttribute
 */
export interface SwitchAttribute {
  disabled?: boolean;
  'active-color'?: string;
  'inactive-color'?: string;
  // 开启的值
  'active-value'?: 1;
  // 关闭的值
  'inactive-value'?: 0;
}
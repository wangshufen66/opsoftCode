import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * Password组件结构
 */
export interface PasswordComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designPassword';
  /**
   * 自定义配置
   */
  __config__: PasswordCfg;
  /**
   * 组件属性配置
   */
  __attr__: PasswordAttribute;
}

/**
 * 自定义配置
 * @export
 * @interface PasswordCfg
 */
export interface PasswordCfg extends BaseCustomCfg {
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
 * @interface PasswordAttribute
 */
export interface PasswordAttribute {
  placeholder?: string;
  clearable?: boolean;
  'prefix-icon'?: string;
  'suffix-icon'?: string;
  maxlength?: number;
  readonly?: boolean;
  disabled?: boolean;
}
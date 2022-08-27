import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * Input组件结构
 */
export interface InputComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   * @type {'design-input'}
   */
  componentTag: 'designInput';
  /**
   * 自定义配置
   */
  __config__: InputCfg;
  /**
   * 组件属性配置
   */
  __attr__: InputAttribute;

}

/**
 * 自定义配置
 * @export
 * @interface InputCfg
 */
export interface InputCfg extends BaseCustomCfg {
  defaultValue?: string | number;
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface InputAttribute
 */
export interface InputAttribute {
  placeholder?: string;
  clearable?: boolean;
  'prefix-icon'?: string;
  'suffix-icon'?: string;
  maxlength?: number;
  'show-word-limit'?: boolean;
  readonly?: boolean;
  disabled?: boolean;
}

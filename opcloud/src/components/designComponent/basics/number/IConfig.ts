import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * Password组件结构
 */
export interface NumberComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designNumber';
  /**
   * 自定义配置
   */
  __config__: NumberCfg;
  /**
   * 组件属性配置
   */
  __attr__: NumberAttribute;

}

/**
 * 自定义配置
 * @export
 * @interface NumberCfg
 */
export interface NumberCfg extends BaseCustomCfg {
  icon?: string;
  defaultValue?: number;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface NumberAttribute
 */
export interface NumberAttribute {
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  'step-strictly'?: boolean;
  precision?: number;
  'controls-position'?: string;
  disabled?: boolean;
}
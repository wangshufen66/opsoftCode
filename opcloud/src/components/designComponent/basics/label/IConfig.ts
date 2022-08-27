import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * Label组件结构
 */
export interface LabelComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   * @type {'design-label'}
   */
  componentTag: 'designLabel';
  /**
   * 自定义配置
   */
  __config__: LabelCfg;
  /**
   * 组件属性配置
   */
  __attr__: LabelAttribute;
}
/**
 * 自定义配置
 * @export
 * @interface LabelCfg
 */
export interface LabelCfg extends BaseCustomCfg {
  icon?: string;
  label?: string;
}

/**
 * 组件属性
 * @export
 * @interface LabelAttribute
 */
export interface LabelAttribute {
  'prefix-icon'?: string;
  prefixLine?: boolean;
  prefixLineColor?: string;
  prefixLineWidth?: number;
  fontSize?: number;
  fontColor?: string;
  italic?: boolean;
  bold?: boolean;
  bgcolor?: string;
}
import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * Input组件结构
 */
export interface SliderComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designSlider';
  /**
   * 自定义配置
   */
  __config__: SliderCfg;
  /**
   * 组件属性配置
   */
  __attr__: SliderAttribute;

}

/**
 * 自定义配置
 * @export
 */
export interface SliderCfg extends BaseCustomCfg {
  defaultValue?: number;
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 */
export interface SliderAttribute {
  min?: number;
  max?: number;
  disabled?: boolean;
  step?: number;
  'show-stops'?: boolean;
  'show-tooltip'?: boolean;
  range?: boolean;
  vertical?: boolean;
  height?: string;
}

import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * 容器组件结构
 */
export interface PanelLayoutComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designPanelLayout';
  /**
   * 自定义配置
   */
  __config__: PanelLayoutCfg;
  /**
   * 组件属性配置
   */
  __attr__: PanelLayoutAttribute;
}
/**
 * 自定义配置
 * @export
 */
export interface PanelLayoutCfg extends BaseCustomCfg {
  icon?: string;
  /**
   * 是否表单模型组件
   */
  isLayout?: boolean;
}

/**
 * 组件属性
 * @export
 */
 export interface PanelLayoutAttribute {}
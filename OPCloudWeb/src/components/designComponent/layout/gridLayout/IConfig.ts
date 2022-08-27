import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * AutoCode组件结构
 */
export interface GridLayoutComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designGridLayout';
  /**
   * 自定义配置
   */
  __config__: GridLayoutCfg;
  /**
   * 组件属性配置
   */
  __attr__: GridLayoutAttribute;
}
/**
 * 自定义配置
 * @export
 */
export interface GridLayoutCfg extends BaseCustomCfg {
  icon?: string;
  /**
   * 是否表单模型组件
   */
  isModel?: boolean;
}

/**
 * 组件属性
 * @export
 */
export interface GridLayoutAttribute {
  // 行数
  rowCount: number;
  // 列数
  columnCount: number;
  // 高度(px)、百分比
  height?: number | string;
  // 宽度(px)、百分比
  width?: number | string;
}
import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * 操作人组件结构
 */
export interface DataOperatorComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designDataOperator';
  /**
   * 自定义配置
   */
  __config__: DataOperatorCfg;
  /**
   * 组件属性配置
   */
  __attr__: DataOperatorAttribute;
}
/**
 * 自定义配置
 * @export
 */
export interface DataOperatorCfg extends BaseCustomCfg {
  icon?: string;
}

/**
 * 组件属性
 * @export
 */
export interface DataOperatorAttribute {
  /**子组件栅格 */
  childSpan?: number;
  /**是否包含创建人 */
  creator?: boolean;
  /**是否包含创建时间 */
  createTime?: boolean;
  /**是否包含更新人 */
  updater?: boolean;
  /**是否包含更新时间 */
  updateTime?: boolean;
}

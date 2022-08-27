import { ComponentBaseCfg, BaseCustomCfg } from "../../commonCfg";

/**
 * ProcessFlow组件结构
 */
export interface ProcessFlowComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: "designProcessFlow";
  /**
   * 自定义配置
   */
  __config__: ProcessFlowCfg;
  /**
   * 节点状态配置
   */
  __nodeStatus__: ProcessNodeStatus[];
  /**节点信息 */
  nodeList: any[];
}

/**
 * 自定义配置
 * @export
 */
export interface ProcessFlowCfg extends BaseCustomCfg {
  icon?: string;
  /**流程绘制DOM ID */
  target?: string;
  /**流程图容器高度 */
  height?: number;
}

/**
 *节点状态配置
 */
export interface ProcessNodeStatus {
  value?: string | number;
  color?: string;
}

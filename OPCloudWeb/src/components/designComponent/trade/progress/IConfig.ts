import { ComponentBaseCfg, BaseCustomCfg } from "../../commonCfg";

/**
 * 工序进度组件结构
 * 树形组件
 */
export interface ProgressComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: "designProgress";
  /**
   * 自定义配置
   */
  __config__: progressCfg;
  /**
   * 组件属性配置(UI组件的属性)
   */
  __attr__: progressAttribute;
  /**
   * 进度配置列表
   */
  options: progressPanel;
}
/**
 * 自定义配置
 * @export
 * @interface progressCfg
 */
export interface progressCfg extends BaseCustomCfg {
  icon?: string;
  sqlType?: string;
  inTable?: boolean;
}

/**
 * UI组件属性
 * @export
 * @interface progressAttribute
 */
export interface progressAttribute {
  childSpan: number;
  data: dataType[];
}
/**进度条配置*/
export type progressPanel = {
  /**配置id*/
  // id: string | number;
  /**进度条类型*/
  type?: string;
  /**线条粗细*/
  "stroke-width"?: number;
  /**进度条显示文字*/
  "text-inside"?: boolean;
  /**进度条颜色*/
  color?: colorArr[];
  /**数据条数*/
  count?: number;
};
/**进度条数据*/
export type dataType = {
  /**工序名字*/
  progressName?: string;
  /**当前数量*/
  current?: number;
  /**总数量*/
  total?: number;
  /**当前进度*/
  percentage?: number;
};

type colorArr = {
  /**起始值*/
  begin?: number;
  /**结束值 */
  end?: number;
  /**颜色*/
  color: string;
  /**进度*/
  percentage: number;
};

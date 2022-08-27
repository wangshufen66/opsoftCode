import { ComponentBaseCfg, BaseCustomCfg } from "../../commonCfg";

/**
 * Tree组件结构
 * 树形组件
 */
export interface TreeComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: "designTree";
  /**
   * 自定义配置
   */
  __config__: TreeCfg;
  /**
   * 组件属性配置(UI组件的属性)
   */
  __attr__: TreeAttribute;
  /**
   * tree配置列表
   */
  options: treePanel[];

}

/**
 * 自定义配置
 * @export
 * @interface TreeCfg
 */
export interface TreeCfg extends BaseCustomCfg {
  icon?: string;
  sqlType?: string;
  inTable?: boolean;
}

/**
 * UI组件属性
 * @export
 * @interface TreeAttribute
 */
export interface TreeAttribute {
  /**传给组件的参数*/
  props: TreeProps;
  /**是否选中高亮 */
  "highlight-current"?: boolean;
  /**数据源*/
  data: any[];
  /**手风琴*/
  accordion?: boolean;
}

export type TreeProps = {
  /**值对应的属性值*/
  value?: string;
  /**label对应的属性值*/
  label?: string;
  /**children对应的属性值*/
  children?: string;
  /**是否为叶子结点的字段*/
  isLeaf: string;
};

/** tree配置列表*/
interface treePanel {
  id: string | number;
  name: string;
  /**层级*/
  levelType: number;
  /**绑定的表名*/
  pageTableName: string;
  /**绑定的字段id*/
  fieldCode: string;
  /**关联的外键字段*/
  fieldForeignCode: string;
  /**表单id*/
  tableId: number | null;
}

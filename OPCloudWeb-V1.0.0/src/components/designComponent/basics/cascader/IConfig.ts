import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Cascader组件结构
 */
export interface CascaderComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designCascader';
  /**
   * 自定义配置
   */
  __config__: CascaderCfg;
  /**
   * 组件属性配置(UI组件的属性)
   */
  __attr__: CascaderAttribute;
  /**
   * 自定义节点呈现内容表达式，表达式依据数据源结构
   * 如：姓名(人数)
   */
  __customExpression__?: string;

}

/**
 * 自定义配置
 * @export
 * @interface cascaderCfg
 */
export interface CascaderCfg extends BaseCustomCfg {
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * UI组件属性
 * @export
 * @interface CascaderAttribute
 */
export interface CascaderAttribute {
  placeholder?: string;
  props: CascaderProps;
  'show-all-levels'?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  // 输入框显示值的分隔符
  separator?: string;
  // 数据源
  options?: any[];
}

export type CascaderProps = {
  expandTrigger?: 'click' | 'hover';
  multiple?: boolean;
  // 选择后是否返回所有节点值的数组
  emitPath?: boolean;
  lazy?: boolean;
  lazyLoad?: (node, resolve) => Promise<any>;
  // 值对应的属性值
  value?: string;
  // label对应的属性值
  label?: string;
  // children对应的属性值
  children?: string;
  // 禁用
  disabled?: boolean;
};
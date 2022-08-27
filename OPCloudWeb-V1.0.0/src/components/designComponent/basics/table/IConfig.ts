import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';
/**
 * Table组件结构
 */
export interface TableComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   * @type {'designTable'}
   */
  componentTag: 'designTable';
  /**
   * 自定义配置
   */
  __config__: TableCfg;

  __attr__: TableAttribute;
  /**
   * 数据源表配置模型
   */
  selectModel: any;
  /**
   * 列设置
   */
  columnModel: any[];
}
/**
 * 自定义配置
 * @export
 * @interface TableCfg
 */
export interface TableCfg extends BaseCustomCfg {
  icon?: string;
}

export interface TableAttribute {
  selectionCol?: boolean;
  batchDelete?: boolean;
  indexCol?: boolean;
  paging?: boolean;
}
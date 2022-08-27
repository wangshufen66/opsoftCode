import { ComponentBaseCfg, BaseCustomCfg, IComponent } from "../../commonCfg";

/**
 * TabTable组件结构
 * 时间临界点组件
 */
export interface TabTableComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: "designTabTable";
  /**
   * 自定义配置
   */
  __config__: TabTableCfg;
  /**
   * tab选项配置
   */
  tabOptions: TabPanel[];

  /**
   * 选择的Model
   */
  selectModelList?: selectModel[];
  /**
   * 表格列配置
   */
  columnModelList?: columnModel[];

  relFields?: RelField[];

  dataSourceList?: DataSource[];
}
/**
 * 自定义配置
 * @export
 */
interface TabTableCfg extends BaseCustomCfg {
  icon?: string;
  loading?: boolean;
}
/**
 * tab选项配置
 */
interface TabPanel {
  id: string | number;
  label: string;
}
/**
 * 表格数据源配置
 */
type selectModel = {
  pid: string | number;
  config: any;
};
/**
 * 列配置
 */
type columnModel = {
  pid: string | number;
  columnConfig: any[];
};

export type RelField = {
  pid?: string | number;
  masterField?: string | undefined;
  field?: string | undefined;
  isDeleteSlave?: string | undefined;
};

type DataSource = {
  pid: string | number;
  dataSource: any[];
};

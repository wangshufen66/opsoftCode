import { PenetratePageType } from "./enum";
/**
   * 移动端显示配置
   */
export type Mconfig = {
  inMobile?: boolean;       //是否显示字段
  isTitle?: boolean;        //是否标题字段
  isSecondTitle?: boolean;  //是否二级标题
  isTime?: boolean;         //移动端时间字段
  isStatus?: boolean;       //移动端状态字段
  isProgress?: boolean;     //移动端进度字段
  isCard?: boolean;         //移动端卡片字段
  isSearch?: boolean;       //移动端搜索字段
  isTableSort?: boolean;    //移动端表格排序字段
}

/**
 * 组件外键关联设置
 */
export type RelTable = {
  /**表类型*/
  tableType: string | number;
  /**字典类型*/
  dictType?: string;
  /**关联表名称*/
  tableName?: string;
  /**表ID*/
  tableId?: string | number;
  /**[应用ID，模块ID，页面ID] */
  pageIds?: number[];
  /**关联外键*/
  key?: string;
  /**关联外键的显示名称*/
  relName?: string;
  /**
   * 过滤条件
   */
  filterConfig?: FilterCfg[];
};

/**
 * 正则表达式配置
 */
export type RegexType = {
  /**正则表达式*/
  pattern: string;
  /**
   * 正则提示信息
   */
  message: string;
  /**
   * 是否为内置表达式,否则为自定义正则（内置为后端提供的验证规则）
   */
  internally?: boolean;
};

/**
 * 运行时配置
 */
export type RunTime = {
  fieldDisabled?: boolean;
};

/**
 * 过滤配置
 */
export type FilterCfg = {
  /**
   * 字段名
   */
  field: string;
  /**
   * 过滤方式
   */
  type: "=" | "<=" | ">=" | "<" | ">";
  /**
   * 过滤值
   */
  value: string;
};

/**
 * 数据模型
 */
export type DataModel = {
  /**ID */
  id: number | string;
  /** 类型 */
  type: string | number;
  /** 字段 */
  field: string;
  /**针对下拉组件关联的字段 */
  relField?: string;
};
/**
 * 组件联动结构
 */
export type RelComponent = {
  /**关联组件ID */
  componentId?: string | number;
  /**关联组件的属性名 */
  field?: string;
  /**是否绝对联动 */
  isAbsolute: boolean;
  /**当前组件联动的字段 */
  relField?: string;
};

/**
 * 组件校验结构
 */
export type VerifyComponent = {
  /**
   * 对比组件
   */
  tag?: string | number;
  /**
   * 对比方式
   */
  type?: "=" | "<=" | ">=" | "<" | ">";
};

/**
 * 数据穿透配置
 */
export type PenetrateCfg = {
  /**跳转页面配置[app,model,page] */
  page?: Array<string | number>;
  /**穿透类型:页面、表单 */
  type?: PenetratePageType;
  /**是否携带ID */
  portId?: boolean;
  /**ID关联字段 */
  relIdField?: string;
  /**关联设置 */
  relCfg?: PenetrateRelCfg[];
};

type PenetrateRelCfg = {
  id: string;
  /**关联字段 */
  relField: string;
  /**值字段（当前表单字段），默认当前组件的值 */
  valueField: string;
};

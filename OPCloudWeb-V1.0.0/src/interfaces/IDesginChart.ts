/**
 *  图表结构
 */
export type TypeDesignChart = {
  /**组件类型 */
  type: string;
  /**是否坐标系图表 */
  isAxis?: boolean;
  /**
   * 图表ID
   */
  chartId?: string | number;
  /**
   * 自定义配置
   */
  __config__: ChartConfig;
  /**
   * 标题
   */
  title?: string;
  /**
   * 提示框
   */
  tooltip?: ToolTip;
  /**
   * 图例
   */
  legend?: Legend;
  /**
   * X轴配置
   */
  xAxis?: Aris;
  /**
   * y轴配置
   */
  yAxis?: Aris;
  /**
   * 数据
   */
  series: Serie[];

  radar?: object;
  /**
   * 网格大小
   */
  grid?: Grid;

  //批量选中
  batchDelete?: boolean;
  // 是否分页
  paging?: boolean;
  // 数据源(多图表同源)
  tableData?: any;
  // 列配置
  tableColums?: any;
};

export type ChartConfig = {
  /**
   * 图表名称
   */
  label: string;
  /**
   * 默认图表类型
   */
  type: string;
  /**
   * 图标名称
   */
  icon: string;
  /**
   * 数据类型
   */
  dataType: DataSourceType[];

  /**
   * X轴数据类型
   */
  xAxisDataType?: string;
  /**
   * X轴数据绑定字段
   */
  xAxisDataAttr?: string;
  /**
   * Y轴数据类型
   */
  yAxisDataType?: string;
  /**
   * Y轴数据绑定字段
   */
  yAxisDataAttr?: string;
  /**
   * 数据源绑定字段
   */
  dataSourceAttr: string[];
  /**
   * 深色模式，rgba(16,12,42,1)
   */
  isDark: boolean;
  /**
   * 跨行
   */
  colSpan?: number;
  /**
   * 跨列
   */
  rowSpan?: number;
  /**是否具有详情跳转 */
  isDetail: false;
  /**
   * 数据源配置
   */
  dataSource?: any;
  dataOrg: string[];
  tableName?: string;
  fkey?: string;
  fTableName?: string;
  fTableId?: string;
  fKeyValue?: string;
};

export type ToolTip = {
  /**
   * 是否显示
   */
  show?: boolean;
  /**
   * 触发类型
   */
  trigger?: string;
  /**
   * 触发条件
   */
  triggerOn?: string;
};

export type Aris = {
  axisLine?: any;
  axisLabel?: any;
  /**
   * 是否显示
   */
  show?: boolean;
  /**
   * 坐标轴类型
   */
  type?: AxisType;
  /**
   * 坐标轴名字旋转角度
   */
  nameRotate?: number;
  /**
   * 坐标轴刻度最小值
   */
  min?: number;
  /**
   * 坐标轴刻度最大值
   */
  max?: number;

  data?: any[];
};

export type Serie = {
  id?: string;
  name?: string;
  type: string;
  radius?: number;
  stack?: string;
  cursor?: string;
  data: Data[];
  annular?: boolean;
  /**显示占比(饼状图) */
  ratio?: boolean;
};

export type Data = string | number | boolean | any;

export type Grid = {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  containLabel: boolean;
};

export type ChartPanel = {
  /**
   * 行数
   */
  rows?: number;
  /**
   * 列数
   */
  columns?: number;
  /**
   * 单元格宽
   */
  cellWidth?: number;
  /**
   * 单元格高
   */
  cellHeight?: number;
  /**
   * 单元格间距
   */
  gap?: number;

  searchConfig?: SearchConfig[];
};

export type Legend = {
  show: boolean;
  position?: string;
  data?: string[];
};

/**查询配置 */
type SearchConfig = {
  /**KEY */
  key: string;
  /**字段列表名称 */
  fieldText: string;
  /**字段列表  应用-模块-表-字段 */
  fieldList: Array<string | number>;
  /**字段属性 */
  field?: string;
  /**字段描述 */
  fieldDes?: string;
  /**搜索组件类型 */
  fieldType?: SearchFieldType;
  /**搜索组件查询类型 */
  filterType?: FilterType;
};
/**
 * 搜索组件类型
 */
enum SearchFieldType {
  /**文本框 */
  TEXT = 1,
  /**下拉框 */
  SELECT = 2,
  /**日期 */
  DATE = 3,
  /**日期时间 */
  DATETIME = 4,
  /**时间 */
  TIME = 5,
}

/**值判断类型 */
enum FilterType {
  /**等于 */
  Equal = 1,
  /**区间 */
  Extent = 2,
}
/**
 * 坐标轴类型
 */
export enum AxisType {
  /**值坐标轴 */
  VALUE = "value",
  /**类目轴 */
  CATEGORY = "category",
  /**时间轴 */
  TIME = "time",
  /**对数轴 */
  LOG = "log",
}
/**
 * 数据源类型，SQL/API
 */
export enum DataSourceType {
  /**SQL语句 */
  SQL = "0",
  /**API接口 */
  API = "1",
}

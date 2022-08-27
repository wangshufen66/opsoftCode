import { ITableColunmSetting } from "@/interfaces/ITableConfig";

// 定义可设置table属性的结构
export type TableAttr = {
  /**rowKey */
  rowKey?: string;
  /**loading显示文本 */
  "element-loading-text"?: string;
  /**loading 图标 */
  "element-loading-spinner"?: string;
  /**loading 遮罩背景色 */
  "element-loading-background"?: string;
  /** 选中行高亮*/
  highlightCurrentRow?: boolean;
  /**斑马样式 */
  stripe?: boolean;
  /**边框 */
  border?: boolean;
  /**空数据显示文本 */
  emptyText?: string;
  /**列合并方法 */
  spanMethod?: Function;
  /**合计列计算方法 */
  summaryMethod?: Function;
  /**大小 */
  size: "medium" | "small" | "mini";
};

/**分页 */
export type Pagination = {
  /**页码 */
  pageIndex: number | unknown;
  /**每页显示数量 */
  pageSize: number | unknown;
};

/**列配置 */
export type ColumnConfig = {
  /**显示列 */
  showColumn: ITableColunmSetting[];
  /**隐藏列 */
  hiddenColumn: ITableColunmSetting[];
};

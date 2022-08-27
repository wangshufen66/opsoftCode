export interface ITableColunmSetting {
  /**
   * 表头文本对齐方式
   */
  headerAlign?: string;
  /**
   * 表格内容对齐方式
   */
  align?: string;
  /**
   * 列绑定数据字段
   */
  prop?: string;
  /**
   * 表头名称
   */
  label?: string;
  /**
   * 是否显示
   */
  init?: boolean;
  /**
   * 表格宽度
   */
  width?: number;
  /**
   * 最小宽度
   */
  minWidth?: number;
  /**
   * 是否显示单元格内容tooltip
   */
  showoverflowtooltip?: boolean;
  /**
   * 是否能排序
   */
  sortable?: boolean;
  /** 是否固定 */
  fixed?: boolean;
  /** 是否为文件 */
  isFile?: boolean;
  /**
   * 图片类型
   */
  fileType?: FileType;
  /**
   * 数据是否为HTML
   */
  isHtml?: boolean;
  /**
   * 是否为进度条
   */
  isProgress?: boolean;
  /**
   * 是否为工序进度
   */
  isProcess?: boolean;
  /**
   * 组件配置列表
   */
  componentOption?: any;
  /**页面Id*/
  // pageId?: number;
}

export enum FileType {
  /** 图片 */
  PICTURE = 1,
  /** PDF */
  PDF = 2,
  /** 其他 */
  OTHER = 3,
}

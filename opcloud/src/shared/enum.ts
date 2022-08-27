/**菜单类型 */
export enum MenuLayoutType {
  /**应用菜单 */
  APPS_MENUS = 1,
  /**系统管理菜单 */
  SYSTEM_MENUS = 0,
}

/**
 * 应用菜单类型
 */
export enum AppMenuType {
  /**自定义应用 */
  CUSTOM = 1,
  /**设计应用 */
  DESGIN = 2,
}

/**应用页面类型 */
export enum AppPageType {
  /**列表 */
  LIST = 1,
  /**新增 */
  ADD = 2,
  /**编辑 */
  EDIT = 3,
  /**详情 */
  DETAIL = 4,
}

/**打印组件类型 */
export enum PrintComponentType {
  /**文本 */
  TEXT = 1,
  /**图片 */
  PICTURE = 2,
  /**长文本 */
  LONG_TEXT = 3,
  /**表格 */
  TABLE = 4,
  /**二维码 */
  QRCODE = 5,
  /**条形码 */
  BARCODE = 6,
  /**横线 */
  HORIZONTAL_LINE = 7,
  /**竖线 */
  VERTICAL_LINE = 8,
  /**矩形 */
  RECTANGLE = 9,
  /**椭圆 */
  ELLIPSE = 10,
}

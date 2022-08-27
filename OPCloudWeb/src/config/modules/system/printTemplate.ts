/**组件结构 */
export type PrintComponent = {
  tid: string;
  /**类型 */
  type: PrintComponentType;
  /**标题 */
  label: string;
  /**标题 */
  icon: string;
};

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
/**打印组件 */
export const components: PrintComponent[] = [
  {
    tid: "defaultModule.text",
    type: PrintComponentType.TEXT,
    label: "文本",
    icon: "text",
  },
  {
    tid: "defaultModule.image",
    type: PrintComponentType.PICTURE,
    label: "图片",
    icon: "image",
  },
  {
    tid: "defaultModule.longText",
    type: PrintComponentType.LONG_TEXT,
    label: "长文本",
    icon: "longtext",
  },
  {
    tid: "defaultModule.tableCustom",
    type: PrintComponentType.TABLE,
    label: "表格",
    icon: "table",
  },
  {
    tid: "defaultModule.hline",
    type: PrintComponentType.HORIZONTAL_LINE,
    label: "横线",
    icon: "horize_line",
  },
  {
    tid: "defaultModule.vline",
    type: PrintComponentType.VERTICAL_LINE,
    label: "竖线",
    icon: "vertical_line",
  },
  {
    tid: "defaultModule.rect",
    type: PrintComponentType.RECTANGLE,
    label: "矩形",
    icon: "rect",
  },
  {
    tid: "defaultModule.oval",
    type: PrintComponentType.ELLIPSE,
    label: "椭圆",
    icon: "ellipse",
  },
];

import { PrintComponentType } from "@/interfaces/enum";
import type { PrintComponent } from "@/interfaces/type";

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

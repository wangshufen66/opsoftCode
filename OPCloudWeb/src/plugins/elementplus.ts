/**
 * element-plus注册
 * 默认支持ES build摇树,无需按需引入
 */

import elementPlus from "element-plus";
// import "@/styles/components/element-plus.css";
import "@/styles/theme-chalk/src/index.scss";
import "dayjs/locale/zh-cn";
import locale from "element-plus/lib/locale/lang/zh-cn";

export default function (app) {
  // 组件注册
  app.use(elementPlus, { size: "medium", locale });
  // 图标注册
}

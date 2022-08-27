/**
 * 图标引入
 */
import * as icons from "@element-plus/icons";

export default function (app) {
  //   注册图标
  const keys = Object.keys(icons);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    app.component(icons[key].name, icons[key]);
  }
}

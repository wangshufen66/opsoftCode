/**
 * 自定义组件全局注册
 */
import commonTable from "@/components/core/tableExtend/index.vue";
import dialogTitle from "@/components/dialogTitle/index.vue";
import TextButton from "@/components/core/textbutton/index.vue";

export default function (app) {
  app.component("tableExtend", commonTable);
  app.component(dialogTitle.name, dialogTitle);
  app.component("TextButton", TextButton);
}

/**
 * 自定义组件全局注册
 */
import commonTable from "@/components/commontable/index.vue";
import dialogTitle from "@/components/dialogTitle/index.vue";
import TextButton from "@/components/textbutton/index.vue";
// import ElIcon from "@/components/elementIcon/index.vue";

export default function (app) {
  app.component("tableExtend", commonTable);
  app.component(dialogTitle.name, dialogTitle);
  app.component("TextButton", TextButton);
  //   app.component(ElIcon.name, ElIcon);
}

import { createApp } from "vue";
import App from "./App.vue";
// 插件引入
import elementplus from "./plugins/elementplus";
import customComponent from "./plugins/customComponent";
import elementIcon from "./plugins/elementIcon";
import designComponet from "./plugins/designComponent";
import installRouter from "./plugins/router";

import store from "./store";
import "./styles/index.scss";

import mitt, { Emitter } from "mitt";
const emitter: Emitter = mitt();

// 创建实列
const app = createApp(App);

app.use(elementplus);
app.use(customComponent);
app.use(elementIcon);
app.use(designComponet);

app.config.globalProperties.$emitter = emitter;

app.use(store);
installRouter(app).then((router) => {
  app.use(router);
  app.mount("#app");
});

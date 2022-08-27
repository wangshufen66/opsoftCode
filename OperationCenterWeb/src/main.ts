import { createApp } from "vue";
import App from "./App.vue";

import elementplus from "./plugins/elementplus";
import designComponet from "./plugins/designComponent";
import router from "./router";
// import store from "./store";
import "./styles/index.scss";
// import './mock/index';


import mitt, { Emitter } from "mitt";
const emitter: Emitter = mitt();

// 创建实列
const app = createApp(App);

app.use(elementplus);
app.use(designComponet);

app.config.globalProperties.$emitter = emitter;

app.use(router);
// app.use(store);

router.isReady().then(() => app.mount("#app"));

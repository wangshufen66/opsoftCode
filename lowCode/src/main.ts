import { createApp } from 'vue';
import App from './App.vue';

import elementplus from '@/plugins/elementplus';

import router from './router';
import store from './store';

import './styles/index.scss';

const app = createApp(App);

app.use(router);
app.use(store);

app.use(elementplus);

app.mount('#app');

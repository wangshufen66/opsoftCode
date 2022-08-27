import elementPlus from 'element-plus';
// import 'element-plus/lib/theme-chalk/index.css';
import '@/styles/element-variables.scss'
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale/lang/zh-cn';

export default function (app) {
  app.use(elementPlus, { size: 'medium', locale });
}

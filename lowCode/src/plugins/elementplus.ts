/*
 *****************************************************************
 * element-plus注册
 ******************************************************************
 */
import '@/styles/theme.scss';
import elementPlus from 'element-plus';
import 'dayjs/locale/zh-cn';
import locale from 'element-plus/lib/locale/lang/zh-cn';

export default function (app: any) {
  // 组件注册
  app.use(elementPlus, { size: 'medium', locale });
}

import { Router } from 'vue-router';
import { getToken, messageAlert } from '@/shared/utils/utils';
import mitt from 'mitt';

/*
 ****************************
 * 路由守卫
 ****************************
 */

// 白名单
const unCheckPaths: string[] = ['/login', '/register'];

/**
 * 路由守卫配置
 * @param router 路由对象
 */
export default function (router: Router) {
  const emitter = mitt();
  // 前置守卫
  router.beforeEach((to, from) => {
    if (unCheckPaths.includes(to.path)) return true;
    const hasToken = getToken('accessToken');
    if (!hasToken) {
      hasToken == null && messageAlert('error', '登录失效，请重新登录');
      emitter.emit('login-out');
    }
    return true;
  });

  emitter.on('login-out', () => {
    const currentPath = router.currentRoute.value.fullPath;
    const redirect = currentPath === '/login' ? undefined : currentPath;
    router.replace({
      path: `/login`,
      query: { redirect: redirect && encodeURIComponent(redirect) },
    });
  });
}

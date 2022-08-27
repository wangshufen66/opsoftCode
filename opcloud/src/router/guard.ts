import type { Router } from "vue-router";
import useDing from "@/hooks/use-ding";
import {
  getToken,
  messageAlert,
  removeStorage,
  removeToken,
  setStorage,
  setToken,
} from "@/shared/utils/utils";
import { signdding } from "@/api/userApi";

export function routerGuard(router: Router) {
  // 钉钉登录
  const { dingLogin, dingdingCheck } = useDing();

  let isDingDing = false;

  const unCheckPaths: string[] = ["/login", "/register"];

  router.beforeEach(async (to, from) => {
    if (!unCheckPaths.includes(to.path)) {
      const hasToken = checkToken();
      if (!hasToken) {
        isDingDing = dingdingCheck(to);
        // 如果是钉钉环境
        if (isDingDing) {
          const authRes: any = await dingLogin(String(to.query.corpid));
          // 用户登录获取token
          await signding({ code: authRes.code, corpId: to.query.corpid });
          return false;
        }
        // hasToken===undefined缓存没有TOKEN；hasToken===null token过期
        hasToken === null && messageAlert("error", "登录失效，请重新登录");
        // 不执行当前跳转操作
        const redirect: string | undefined =
          to.fullPath === "/login" ? undefined : to.fullPath;
        removeToken();
        removeStorage("user");
        return router.replace({
          path: `/login`,
          query: { redirect: redirect && encodeURIComponent(redirect) },
        });
      }
    }
    return true;
  });

  function checkToken(): boolean {
    return getToken("accessToken");
  }

  /**
   * 根据dingdingCode和corpId获取用户TOKEN
   * @param params
   */
  async function signding(params) {
    const res = await signdding(params);
    if (res.code == 200) {
      const { expiresIn, access_token, nickName } = res.data;
      setToken("accessToken", access_token, expiresIn);
      setToken("user", res.data, expiresIn);
      setStorage("nickName", nickName);
    }
  }
}

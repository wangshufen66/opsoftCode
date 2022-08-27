import useRouter from "@/hooks/use-router";
import { getAppMenuList } from "@/api/homeApi";
import { getToken } from "@/shared/utils/utils";

// 初始化系统资源
export default async function (app) {
  const token = getToken("accessToken");
  // token 不存在，不获取用户菜单
  if (!token) {
    const { initRoute } = useRouter();
    return initRoute();
  }
  // 判断token失效
  const store = app.config.globalProperties.$store;
  // 加载用户菜单
  let router;
  const res = await getAppMenuList();
  if (res.code == 200) {
    const resData = res.data;
    // 缓存用户菜单
    store.commit("comm/setUserMenus", resData);
    // 根据用户菜单设置路由
    const { initRoute } = useRouter(resData);
    router = initRoute();
  } else if (res.code == 401) {
    const { initRoute } = useRouter();
    return initRoute();
  }
  store.commit("comm/setAppInitComplete", true);
  return router;
}

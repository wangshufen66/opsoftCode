import type { RouteRecordRaw } from "vue-router";
import router, { routeMap } from "@/router/index";

type Menu = {
  id: string;
  name: string;
  url: string;
};

/**
 * Router操作
 */
export default function useRouter(resource?: Record<number, any>) {
  /**
   * 初始化菜单路由
   */
  function initRoute() {
    if (!resource) return router;
    const ident: string[] = [];
    Object.keys(resource).forEach((key: string) => {
      const menuList: Menu[] = resource[key];
      initRouterByMenus(menuList, ident);
    });
    return router;
  }

  /**
   * 根据菜单初始化路由
   * @param menus
   */
  function initRouterByMenus(menus: any[], ident: string[]) {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.children && menu.children.length > 0) {
        initRouterByMenus(menu.children, ident);
      } else {
        const route = routeMap.find((f) => {
          if (f.path === menu.url && ident.indexOf(f.path) === -1) {
            return f;
          } else {
            if (
              menu.url?.indexOf(`/${String(f.name)}/`) > -1 &&
              ident.indexOf(f.path) === -1
            ) {
              return f;
            }
          }
        });
        if (route) {
          addMenuRoutes(route);
          ident.push(route.path);
        }
      }
    }
  }

  /**
   * 添加路由
   * @param routeCfg 路由配置
   */
  function addMenuRoutes(routeCfg: RouteRecordRaw) {
    router.addRoute("index", routeCfg);
  }

  return {
    initRoute,
  };
}

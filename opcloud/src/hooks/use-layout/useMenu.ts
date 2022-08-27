import type { ComputedRef } from "vue";
import { MenuLayout } from "@/shared/type";

export default function useMenu(menuLayout: ComputedRef<MenuLayout>) {
  const homeKey = "/home";

  // 首页菜单
  const homeMenu = {
    key: homeKey,
    title: "首页",
    path: homeKey,
    icon: "HomeFilled",
    pathName: "首页",
  };

  /**
   * 应用菜单点击操作
   * @param menu
   * @returns
   */
  function appsMenuClick(menu): [boolean, string] {
    if (menu.key === homeKey) {
      setMenuLayoutPaths([
        { icon: menu.icon, name: menu.title, path: homeKey },
      ]);
    } else {
      if (!menu.path) {
        return [false, "菜单配置错误！"];
      }
      const pathNames: string[] = menu.pathName.split("_");
      const paths: any[] = pathNames.map((m) => ({ name: m }));
      setMenuLayoutPaths(paths);
    }
    return [true, ""];
  }

  /**
   * 系统菜单点击操作
   * @param menu
   */
  function sysMenuClick(menu: any) {
    // 设置面包屑菜单
    const pathNames: string[] = menu.pathName.split("_");
    const paths: any[] = pathNames.map((item: string) => ({ name: item }));
    setMenuLayoutPaths(paths);
  }

  /**
   * 设置面包屑菜单
   * @param paths 路径
   */
  function setMenuLayoutPaths(paths: any[]) {
    menuLayout.value.paths = paths;
  }

  /**
   * 根据key设置面包屑菜单
   * @param key
   */
  function setMenuLayout(path: string) {
    const currentMenus = menuLayout.value.menus;
    const findPath = (menus: any) => {
      for (let i = 0; i < menus.length; i++) {
        const { path: menuPath, children, pathName } = menus[i];
        if (path === menuPath) {
          menuLayout.value.paths = pathName
            .split("_")
            .map((m) => ({ name: m }));
          return;
        }
        if (children && children.length > 0) {
          findPath(children);
        }
      }
    };
    findPath(currentMenus);
  }

  /**
   *设置激活菜单
   * @param key 菜单key
   */
  function setActiveMenu(key: string) {
    menuLayout.value.activeMenu = key;
  }

  /**
   * 获取第一个有效页面地址
   */
  function getValidMenu(menus: any[]) {
    let menu;
    const find = (menuList) => {
      for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].path) {
          menu = menuList[i];
          return;
        }
        if (menuList[i].children && menuList[i].children.length > 0 && !menu) {
          find(menuList[i].children);
        }
      }
    };
    find(menus);
    return menu;
  }

  return {
    homeKey,
    homeMenu,
    appsMenuClick,
    sysMenuClick,
    setMenuLayoutPaths,
    setActiveMenu,
    setMenuLayout,
    getValidMenu,
  };
}

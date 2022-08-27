import type { ComputedRef } from "vue";
import { MenuLayout } from "@/interfaces/type";

export default function useMenu(menuLayout: ComputedRef<MenuLayout>) {
  /**
   * 应用菜单点击操作
   * @param menu
   * @returns
   */
  function appsMenuClick(menu): [boolean, string] {
    if (menu.key === "home") {
      setMenuLayoutPaths([
        { icon: menu.icon, name: menu.title, path: "/home" },
      ]);
    } else {
      const keys: string[] = `${menu.key}`.split("/");
      const pathNames: string[] = menu.pathName.split("_");
      if (keys.length === 1) {
        return [false, "该应用下未包含任何模块页面！"];
      } else if (keys.length === 2) {
        return [false, "该模块下未包含任何页面！"];
      }
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
  function setMenuLayoutPathsByKey(key: string, menusType: number) {
    const currentMenus = menuLayout.value.menus;
    if (menusType === 1) {
      const paths: any[] = [];
      let keyIndex: number = 0;
      const keys = (key && key.split("/")) || [];
      const findPath = (menus: any, currentKey: string) => {
        for (let i = 0; i < menus.length; i++) {
          const { key: menuKey, title, children } = menus[i];
          if (currentKey === menuKey) {
            paths.push({ name: title });
            if (children && children.length > 0) {
              keyIndex++;
              findPath(children, `${menuKey}/${keys[keyIndex]}`);
            }
          }
        }
      };
      if (keys && keys.length > 0) {
        findPath(currentMenus, keys[keyIndex]);
        menuLayout.value.paths = paths;
      }
    } else {
      const findPath = (menus: any) => {
        for (let i = 0; i < menus.length; i++) {
          const { key: menuKey, children, pathName } = menus[i];
          if (key === menuKey) {
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
  }

  /**
   *设置激活菜单
   * @param key 菜单key
   */
  function setActiveMenu(key: string) {
    menuLayout.value.activeMenu = key;
  }

  return {
    appsMenuClick,
    sysMenuClick,
    setMenuLayoutPaths,
    setActiveMenu,
    setMenuLayoutPathsByKey,
  };
}

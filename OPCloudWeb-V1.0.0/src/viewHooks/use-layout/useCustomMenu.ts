import customMenus from "@/config/modules/system/customMenu";
import type { ComputedRef } from "vue";

export default function useCustomMenu(menuLayout: ComputedRef) {
  /**
   * 添加自定义应用菜单
   * 自定义应用页面层级不确定，选择判定当菜单选项有PATH时，则执行跳转
   */
  function addCustmoMenu() {
    menuLayout.value.menus.push(...customMenus);
  }

  function menuClick(menu): [boolean, string] {
    const pathNames: string[] = menu.pathName.split("_");
    if (!menu.path) {
      return [false, "菜单配置有误"];
    }
    const paths: any[] = pathNames.map((m) => ({ name: m }));
    setMenuLayoutPaths(paths);
    return [true, ""];
  }

  /**
   * 根据path查找菜单
   * @param path
   */
  function findMenuByPath(path: string) {
    let _menu;
    function find(menus: any[]): any {
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        if (menu.path === path) {
          _menu = menu;
          return;
        }
        if (menu.children && menu.children['length'] > 0 && !_menu) {
          find(menu.children);
        }
      }
    }
    find(customMenus);
    return _menu;
  }

  /**
   * 设置面包屑菜单
   * @param paths 路径
   */
  function setMenuLayoutPaths(paths: any[]) {
    menuLayout.value.paths = paths;
  }

  return {
    addCustmoMenu,
    menuClick,
    findMenuByPath,
  };
}

import type { Ref } from "vue";
import { AppMenuType, AppPageType, MenuLayoutType } from "@/interfaces/enum";

export default function usePageTab(tabList: Ref<any[]>, menuType: Ref<number>) {
  /**
   * 设置菜单Tab选项卡
   * @param menu 菜单对象
   */
  function activeMenuTab(appsRootRoute: string, menu: any): string {
    const tab = tabList.value.find((item) => item.name == menu.key);
    let path: string = "";
    // 已存在
    if (!tab) {
      // 获取菜单参数
      const params = menu.key.split("/");
      path =
        menuType.value === MenuLayoutType.APPS_MENUS &&
        menu.type === AppMenuType.DESGIN
          ? `${appsRootRoute}/${params[0]}/${params[1]}/${params[2]}`
          : menu.path;
      tabList.value.push({
        label: menu.title,
        name: (menu.type === AppMenuType.DESGIN && menu.key) || menu.path,
        path,
      });
    } else {
      // 已存在tab,激活选项卡
      tab.path && (path = tab.path);
    }
    return path;
  }

  /**
   * 关闭tab
   * @param name
   */
  function closeTabByName(name: string): string {
    const index = tabList.value.findIndex((f) => f.name === name);
    index && index > -1 && tabList.value.splice(index, 1);
    const tab = tabList.value[tabList.value.length - 1];
    return tab.path;
  }

  /**
   * 获取应用页面的title
   * @param title
   * @param pageType
   */
  function getAppTab(defaultRoute: any, pageType: AppPageType) {
    if (pageType === AppPageType.LIST) {
      return {
        label: defaultRoute.title,
        name: defaultRoute.key,
        path: defaultRoute.path,
      };
    } else if (pageType === AppPageType.ADD) {
      return {
        label: `${defaultRoute.title} 新增`,
        name: `${defaultRoute.key}_add`,
        path: defaultRoute.addPath,
      };
    } else if (pageType === AppPageType.EDIT) {
      return {
        label: `${defaultRoute.title} 编辑`,
        name: `${defaultRoute.key}_edit`,
        path: defaultRoute.editPath,
      };
    } else if (pageType === AppPageType.DETAIL) {
      return {
        label: `${defaultRoute.title} 详情`,
        name: `${defaultRoute.key}_detail`,
        path: defaultRoute.detailPath,
      };
    } else {
      return {
        label: defaultRoute.title,
        name: defaultRoute.path,
        path: defaultRoute.path,
      };
    }
  }

  return {
    activeMenuTab,
    closeTabByName,
    getAppTab,
  };
}

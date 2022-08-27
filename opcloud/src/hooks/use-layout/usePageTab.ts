import type { Ref } from "vue";

export default function usePageTab(tabList: Ref<any[]>, menuType: Ref<number>) {
  // 默认首页tab
  const homeTab = { label: "首页", name: "/home", path: "/home" };

  /**
   * 设置菜单Tab选项卡
   * @param menu 菜单对象
   */
  function activeMenuTab(menu: any): string {
    const tab = tabList.value.find((item) => item.name == menu.path);
    let path: string = "";
    // 不存在,添加选项卡
    if (!tab) {
      // 获取菜单参数
      tabList.value.push({
        label: menu.title,
        name: menu.path,
        path: menu.path,
      });
      path = menu.path;
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
   */
  function getAppTab(menu: any) {
    return {
      label: menu?.title,
      name: menu?.path,
      path: menu?.path,
    };
  }

  return {
    homeTab,
    activeMenuTab,
    closeTabByName,
    getAppTab,
  };
}

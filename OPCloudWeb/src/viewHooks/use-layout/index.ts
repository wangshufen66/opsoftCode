import { computed, inject, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { messageAlert } from "@/utils/utils";
import type { MenuLayout, LayoutState } from "@/interfaces/type";
import type { Tab } from "@/components/pageTab/type";
import { MenuLayoutType } from "@/interfaces/enum";
import { getAppMenuList } from "@/api/homeApi";
import systemMenus from "@/config/modules/system/menus";

/**
 * useLayout
 */
export default function useLayout(): Record<string, any> {
  const store = useStore();
  const router = useRouter();

  /**布局结构数据 */
  const layoutState = inject<LayoutState>("layout");

  /**菜单结构数据 */
  const menuLayout = computed<MenuLayout>(() => {
    return store.state.comm.menuLayout;
  });

  /**激活的Tab */
  const activePageTab = computed<string>({
    get() {
      return store.state.comm.activePageTab || "home";
    },
    set(tabName) {
      store.commit("comm/setActivePageTab", tabName);
    },
  });

  /**路由显示状态,用于应用页面刷新 */
  const routeViewDisplay = computed<boolean>({
    get() {
      return store.state.comm.routeViewDisplay;
    },
    set(value) {
      store.commit("comm/setRouteViewDisplay", value);
    },
  });

  // 应用页面根路由/moduledetaillist
  const appsRootRoute = "/application";
  // 默认路由地址
  let defaultRoute: any;

  /**
   * 应用菜单点击
   * @param menu
   * @returns
   */
  function menuClick(menu: any): void {
    if (layoutState?.menuType.value === MenuLayoutType.SYSTEM_MENUS) {
      sysMenuClick(menu);
    } else {
      const hasPage = appsMenuClick(menu);
      if (!hasPage) return;
    }
    // 设置激活菜单
    menuLayout.value.activeMenu = `${menu.key}`;
    // 页面跳转
    const tab = layoutState?.pageTabList.value.find(
      (item) => item.name == menu.key
    );
    let path: string = "";
    if (!tab) {
      const params = menu.key.split("_");
      path =
        layoutState?.menuType.value === MenuLayoutType.APPS_MENUS
          ? `${appsRootRoute}/${params[0]}/${params[1]}/${params[2]}`
          : menu.path;
      layoutState?.pageTabList.value.push({
        label: menu.title,
        name: menu.key,
        path,
      });
      activePageTab.value = menu.key;
    } else {
      // 已存在tab,激活选项卡
      activePageTab.value = tab.name;
      tab.path && (path = tab.path);
    }
    // 记录跳转前的路由地址
    const currentRoute = router.currentRoute.value.path;
    path &&
      router.push(path).then(() => {
        // 判断是否要刷新当前页面
        const isReloadRoute =
          path.indexOf(appsRootRoute) > -1 &&
          currentRoute.indexOf(appsRootRoute) > -1;
        if (isReloadRoute) {
          reloadCurrentRoute();
        }
      });
  }

  /**
   * 加载tab页面
   * @param tab
   */
  function loadTabRoute(tab: any): void {
    const current: Tab | undefined = layoutState?.pageTabList.value.find(
      (f) => f.name === tab.name
    );
    if (current) {
      // 记录跳转前的路由地址
      const currentRoute = router.currentRoute.value.path;
      activePageTab.value = current.name;
      // 设置激活菜单
      menuLayout.value.activeMenu = current.name;
      current.path &&
        router.push(current.path).then(() => {
          // 判断是否要刷新当前页面
          const isReloadRoute =
            current.path &&
            current.path.indexOf(appsRootRoute) > -1 &&
            currentRoute.indexOf(appsRootRoute) > -1;
          if (isReloadRoute) {
            reloadCurrentRoute();
          }
        });
    }
  }

  /**
   * 关闭Tab
   * @param name
   */
  function closeTab(name: string): void {
    const index = layoutState?.pageTabList.value.findIndex(
      (f) => f.name === name
    );
    index && index > -1 && layoutState?.pageTabList.value.splice(index, 1);
    const tab =
      layoutState?.pageTabList.value[layoutState?.pageTabList.value.length - 1];
    activePageTab.value = tab.name;
    tab.path && router.push(tab.path);
  }

  /**
   * 应用菜单与应用菜单切换
   */
  async function systemMenuChange(): Promise<void> {
    if (!menuLayout.value) return;
    menuLayout.value.menus = [];
    menuLayout.value.paths = [];
    layoutState && (layoutState.pageTabList.value = []);
    if (layoutState?.menuType.value === MenuLayoutType.APPS_MENUS) {
      menuLayout.value.menus.push({
        key: "home",
        title: "首页",
        path: "/home",
        icon: "opfont opicon-home",
      });
      layoutState.pageTabList.value = [
        { label: "首页", name: "home", path: "/home" },
      ];
      menuLayout.value.paths.push({ name: "首页", path: "/home" });
      const res = await getAppMenuList({ isActive: 1 });
      if (res.code == 200) {
        const resData = res.data;
        // 应用菜单数据处理
        menuLayout.value.menus.push(...initAppsMenuData(resData));
      }
      menuLayout.value.activeMenu = "home";
      activePageTab.value = "home";
      router.replace(menuLayout.value.paths[0].path);
    } else {
      menuLayout.value.menus.push(...systemMenus);
      const defaultMenu = menuLayout.value.menus[0];
      nextTick(() => {
        menuLayout.value.activeMenu = defaultMenu.key;
      });
      layoutState &&
        (layoutState.pageTabList.value = [
          {
            label: defaultMenu.title,
            name: defaultMenu.key,
            path: defaultMenu.path,
          },
        ]);
      menuLayout.value.paths = [
        { name: defaultMenu.title, path: defaultMenu.path },
      ];
      activePageTab.value = defaultMenu.key;
      router.replace(defaultMenu.path);
    }
  }

  /**
   * 初始化应用菜单
   * @param data
   * @param key
   * @param name
   * @returns
   */
  function initAppsMenuData(
    data: any[],
    key?: string | number,
    name?: string,
    defaultPath?: string
  ): any[] {
    const menus: any[] = [];
    // 层级深度
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const menu: any = {};
      menu.key = key ? `${key}_${item.id}` : `${item.id}`;
      menu.icon = item.menuIcon;
      menu.title = item.name;
      menu.pathName = name ? `${name}_${item.name}` : item.name;
      menu.path = "";
      if (item.children && item.children.length > 0) {
        menu.children = initAppsMenuData(
          item.children,
          menu.key,
          menu.pathName,
          defaultPath
        );
      } else {
        menu.children = [];
      }
      const path = `${appsRootRoute}/${menu.key.replace(/_/g, "/")}`;
      if (defaultPath === `${appsRootRoute}/${menu.key.replace(/_/g, "/")}`) {
        defaultRoute = {
          key: menu.key,
          title: menu.title,
          path,
          pathName: menu.pathName,
        };
      }
      menus.push(menu);
    }
    return menus;
  }

  /**
   * 应用菜单点击操作
   * @param menu
   * @returns
   */
  function appsMenuClick(menu): boolean {
    if (menu.key === "home") {
      menuLayout.value.paths = [
        { icon: menu.icon, name: menu.title, path: "/home" },
      ];
    } else {
      const keys: string[] = `${menu.key}`.split("_");
      const pathNames: string[] = menu.pathName.split("_");
      if (keys.length === 1) {
        messageAlert("error", "该应用下未包含任何模块页面！");
        return false;
      } else if (keys.length === 2) {
        messageAlert("error", "该模块下未包含任何页面！");
        return false;
      }
      const paths: any[] = pathNames.map((m) => ({ name: m }));
      // 面包屑菜单
      menuLayout.value.paths = paths;
    }
    return true;
  }

  /**
   * 系统菜单点击操作
   * @param menu
   */
  function sysMenuClick(menu: any): void {
    // 设置面包屑菜单
    const pathNames: string[] = menu.pathName.split("_");
    const paths: any[] = pathNames.map((item: string) => ({ name: item }));
    menuLayout.value.paths = paths;
  }

  /**
   * 初始化系统
   */
  async function init(): Promise<void> {
    if (menuLayout.value) {
      menuLayout.value.menus = [];
      menuLayout.value.paths = [];
    }
    layoutState && (layoutState.pageTabList.value = []);
    // 解析路由地址
    const current = router.currentRoute;
    if (
      current.value.path === "/" ||
      current.value.path === "/home" ||
      current.value.path.indexOf(appsRootRoute) > -1
    ) {
      if (layoutState) {
        layoutState.menuType.value = MenuLayoutType.APPS_MENUS;
        menuLayout.value.menus.push({
          key: "home",
          title: "首页",
          path: "/home",
          icon: "opfont opicon-home",
        });
        layoutState.pageTabList.value = [
          { label: "首页", name: "home", path: "/home" },
        ];
        menuLayout.value.paths.push({ name: "首页", path: "/home" });
      }
      const res = await getAppMenuList({ isActive: 1 });
      if (res.code == 200) {
        const resData = res.data;
        // 应用菜单数据处理
        menuLayout.value.menus.push(
          ...initAppsMenuData(resData, undefined, undefined, current.value.path)
        );
      }
      if (current.value.path.indexOf(appsRootRoute) > -1) {
        // 应用页面
        if (layoutState) {
          layoutState.pageTabList.value.push({
            label: defaultRoute.title,
            name: defaultRoute.key,
            path: defaultRoute.path,
          });
          const pathNames = defaultRoute.pathName.split("_");
          menuLayout.value.paths = pathNames.map((m) => ({ name: m }));
          nextTick(() => {
            activePageTab.value = defaultRoute.key;
            menuLayout.value.activeMenu = defaultRoute.key;
          });
        }
      } else {
        menuLayout.value.activeMenu = "home";
        menuLayout.value.paths = [
          {
            name: "首页",
            path: "/home",
          },
        ];
        activePageTab.value = "home";
      }
    } else if (current.value.path.indexOf("/systemset") > -1) {
      // 系统管理页面
      layoutState && (layoutState.menuType.value = MenuLayoutType.SYSTEM_MENUS);
      menuLayout.value.menus.push(...systemMenus);
      // 设置激活菜单
      const activeMenu = findSystemMenu(systemMenus, current.value.path);
      if (activeMenu) {
        nextTick(() => {
          activePageTab.value = activeMenu.key;
          menuLayout.value.activeMenu = activeMenu.key;
        });
      }
      layoutState &&
        (layoutState.pageTabList.value = [
          {
            label: activeMenu?.title,
            name: activeMenu?.key,
            path: activeMenu?.path,
          },
        ]);
      menuLayout.value.paths.push({
        name: activeMenu?.title,
        path: activeMenu?.path,
      });
    }
  }

  /**
   * 查找系统菜单
   * @param path
   */
  function findSystemMenu(menus: any, path: string): any {
    for (let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      if (menu.path === path) {
        return menu;
      }
      if (menu.children && menu.children.length > 0) {
        const childMenu = findSystemMenu(menu.children, path);
        if (childMenu) return childMenu;
      }
    }
  }

  function reloadCurrentRoute() {
    routeViewDisplay.value = false;
    nextTick(() => {
      routeViewDisplay.value = true;
    });
  }

  return {
    layoutState,
    menuLayout,
    activePageTab,
    routeViewDisplay,
    menuClick,
    loadTabRoute,
    closeTab,
    systemMenuChange,
    init,
  };
}

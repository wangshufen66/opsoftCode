import { computed, inject, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { messageAlert } from "@/utils/utils";
import type { MenuLayout, LayoutState } from "@/interfaces/type";
import type { Tab } from "@/components/pageTab/type";
import { MenuLayoutType, AppPageType, AppMenuType } from "@/interfaces/enum";
import { getAppMenuList } from "@/api/homeApi";
import systemMenus from "@/config/modules/system/menus";
import useMenu from "./useMenu";
import usePageTab from "./usePageTab";
import useCustomMenu from "./useCustomMenu";

/**
 * useLayout
 */
export default function useLayout(): Record<string, any> {
  const store = useStore();
  const router = useRouter();

  // 应用页面根路由
  const appsRootRoute = "/application";
  const appAddRootRoute = "/appadd";
  const appEditRootRoute = "/appedit";
  const appDetailRootRoute = "/appdetail";
  // 默认路由地址
  let defaultRoute: any;
  // 首页菜单
  const homeMenu = {
    key: "home",
    title: "首页",
    path: "/home",
    icon: "opfont opicon-home",
  };

  /**布局结构数据 */
  const layoutState = inject<LayoutState>("layout");

  /**菜单结构数据 */
  const menuLayout = computed<MenuLayout>(() => {
    return store.state.comm.menuLayout;
  });

  const activePageTab = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    const { path } = currentRoute;
    let key = "";
    if (path === "/" || path === "/home") {
      key = "home";
    } else if (path.indexOf(appsRootRoute) > -1) {
      // 应用列表页面
      key = path.replace(`${appsRootRoute}/`, "");
    } else if (path.indexOf(appAddRootRoute) > -1) {
      key = path.replace(`${appAddRootRoute}/`, "") + "_add";
    } else if (path.indexOf(appEditRootRoute) > -1) {
      key = path.replace(`${appEditRootRoute}/`, "") + "_edit";
    } else if (path.indexOf(appDetailRootRoute) > -1) {
      key = path.replace(`${appDetailRootRoute}/`, "") + "_detail";
    } else {
      key = path;
    }
    return key;
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

  const {
    appsMenuClick,
    sysMenuClick,
    setActiveMenu,
    setMenuLayoutPathsByKey,
  } = useMenu(menuLayout);
  const { activeMenuTab, closeTabByName, getAppTab } = usePageTab(
    layoutState.pageTabList,
    layoutState.menuType
  );

  const {
    addCustmoMenu,
    menuClick: customMenuClick,
    findMenuByPath,
  } = useCustomMenu(menuLayout);

  /**
   * 应用菜单点击
   * @param menu
   * @returns
   */
  function menuClick(menu: any): void {
    if (layoutState?.menuType.value === MenuLayoutType.SYSTEM_MENUS) {
      sysMenuClick(menu);
    } else {
      // 设计应用菜单
      if (menu.type === AppMenuType.DESGIN) {
        const hasPage = appsMenuClick(menu);
        if (!hasPage[0]) {
          messageAlert("error", hasPage[1]);
          return;
        }
      } else if (menu.type === AppMenuType.CUSTOM) {
        // 自定义菜单
        const hasPage = customMenuClick(menu);
        if (!hasPage[0]) {
          messageAlert("error", hasPage[1]);
          return;
        }
      }
    }
    // 设置激活菜单
    setActiveMenu(menu.key);
    // 设置激活选项卡
    const path: string = activeMenuTab(appsRootRoute, menu);
    path && loadRoute(path);
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
      // 设置激活菜单
      setActiveMenu(current.name);
      setMenuLayoutPathsByKey(tab.name, layoutState?.menuType.value);
      current.path && loadRoute(current.path);
    }
  }

  /**
   * 加载路由页面
   * @param path 路由地址
   */
  function loadRoute(path: string) {
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
   * 关闭Tab
   * @param name
   */
  function closeTab(name: string): void {
    const beforeTabPath = closeTabByName(name);
    beforeTabPath && router.push(beforeTabPath);
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
      menuLayout.value.menus.push(homeMenu);
      layoutState.pageTabList.value = [
        { label: "首页", name: "home", path: "/home" },
      ];
      menuLayout.value.paths.push({ name: "首页", path: "/home" });
      const res = await getAppMenuList({ isActive: 1 });
      if (res.code == 200) {
        // 应用菜单初始化完成
        const resData = res.data;
        // 应用菜单数据处理
        menuLayout.value.menus.push(...initAppsMenuData(resData));
        // 添加自定义菜单
        addCustmoMenu();
        store.commit("comm/setAppMenuInit", true);
      }
      menuLayout.value.activeMenu = "home";
      router.replace(menuLayout.value.paths[0].path);
    } else {
      store.commit("comm/setAppMenuInit", false);
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
      menu.key = key ? `${key}/${item.id}` : `${item.id}`;
      menu.icon = item.menuIcon;
      menu.title = item.name;
      menu.pathName = name ? `${name}_${item.name}` : item.name;
      menu.path = "";
      menu.type = AppMenuType.DESGIN;
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
      if (
        defaultPath &&
        [
          `${appsRootRoute}/${menu.key}`,
          `${appAddRootRoute}/${menu.key}`,
          `${appEditRootRoute}/${menu.key}`,
          `${appDetailRootRoute}/${menu.key}`,
        ].includes(defaultPath)
      ) {
        defaultRoute = {
          key: menu.key,
          title: menu.title,
          path: `${appsRootRoute}/${menu.key}`,
          addPath: `${appAddRootRoute}/${menu.key}`,
          editPath: `${appEditRootRoute}/${menu.key}`,
          detailPath: `${appDetailRootRoute}/${menu.key}`,
          pathName: menu.pathName,
        };
      }
      menus.push(menu);
    }
    return menus;
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
    const menuType = getCurrentMenuLayoutType();
    if (menuType === MenuLayoutType.APPS_MENUS) {
      if (layoutState) {
        layoutState.menuType.value = MenuLayoutType.APPS_MENUS;
        menuLayout.value.menus.push(homeMenu);
        layoutState.pageTabList.value = [
          { label: "首页", name: "home", path: "/home" },
        ];
        menuLayout.value.paths.push({ name: "首页", path: "/home" });
      }
      const res = await getAppMenuList({ isActive: 1 });
      if (res.code == 200) {
        // 应用菜单初始化完成
        const resData = res.data;
        // 应用菜单数据处理
        menuLayout.value.menus.push(
          ...initAppsMenuData(resData, undefined, undefined, current.value.path)
        );
        // 添加自定义菜单
        addCustmoMenu();
        store.commit("comm/setAppMenuInit", true);
      }
      const appPageType = getAppPageType();
      if (appPageType && [-1, 1, 2, 3, 4].includes(appPageType)) {
        // 应用页面
        if (layoutState) {
          let menu = defaultRoute || findMenuByPath(current.value.path);
          const appTab = getAppTab(menu, appPageType);
          layoutState.pageTabList.value.push(appTab);
          const pathNames = menu.pathName.split("_");
          menuLayout.value.paths = pathNames.map((m) => ({ name: m }));
          nextTick(() => {
            menuLayout.value.activeMenu = menu.key;
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
      }
    } else if (menuType === MenuLayoutType.SYSTEM_MENUS) {
      // 系统管理页面
      layoutState && (layoutState.menuType.value = MenuLayoutType.SYSTEM_MENUS);
      menuLayout.value.menus.push(...systemMenus);
      // 设置激活菜单
      const activeMenu = findSystemMenu(systemMenus, current.value.path);
      if (activeMenu) {
        nextTick(() => {
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
      activeMenu &&
        (menuLayout.value.paths = activeMenu.pathName
          .split("_")
          .map((m) => ({ name: m })));
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

  /**
   * 根据路由判断菜单类型
   * @return {*}
   */
  function getCurrentMenuLayoutType() {
    // 解析路由地址
    const current = router.currentRoute;
    if (
      current.value.path === "/" ||
      current.value.path === "/home" ||
      current.value.path.indexOf(appsRootRoute) > -1 ||
      current.value.path.indexOf(appAddRootRoute) > -1 ||
      current.value.path.indexOf(appEditRootRoute) > -1 ||
      current.value.path.indexOf(appDetailRootRoute) > -1
    ) {
      return MenuLayoutType.APPS_MENUS;
    } else if (current.value.path.indexOf("/systemset") > -1) {
      return MenuLayoutType.SYSTEM_MENUS;
    } else {
      return MenuLayoutType.APPS_MENUS;
    }
  }

  /**
   * 获取当前应用页面的类型(列表/新增/编辑/详情)
   */
  function getAppPageType() {
    // 解析路由地址
    const current = router.currentRoute;
    if (current.value.path.indexOf(appsRootRoute) > -1) {
      return AppPageType.LIST;
    } else if (current.value.path.indexOf(appAddRootRoute) > -1) {
      return AppPageType.ADD;
    } else if (current.value.path.indexOf(appEditRootRoute) > -1) {
      return AppPageType.EDIT;
    } else if (current.value.path.indexOf(appDetailRootRoute) > -1) {
      return AppPageType.DETAIL;
    } else {
      return -1;
    }
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

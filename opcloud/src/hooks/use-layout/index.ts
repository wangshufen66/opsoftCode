import { computed, inject, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { messageAlert } from "@/shared/utils/utils";
import type { MenuLayout, LayoutState } from "@/shared/type";
import type { Tab } from "@/components/pageTab/type";
import { MenuLayoutType } from "@/shared/enum";
import useMenu from "./useMenu";
import usePageTab from "./usePageTab";

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

  /**用户菜单 */
  const userMenus = computed<MenuLayout>(() => {
    return store.state.comm.userMenus;
  });

  const activePageTab = computed<string>(() => {
    const currentRoute = router.currentRoute.value;
    const { path } = currentRoute;
    let key = "";
    if (path === "/" || path === homeKey) {
      key = homeKey;
    } else {
      path && (key = path);
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
    homeKey,
    homeMenu,
    appsMenuClick,
    sysMenuClick,
    setActiveMenu,
    setMenuLayout,
    getValidMenu,
  } = useMenu(menuLayout);

  const { homeTab, activeMenuTab, closeTabByName, getAppTab } = usePageTab(
    layoutState.pageTabList,
    layoutState.menuType
  );

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
      if (!hasPage[0]) {
        messageAlert("error", hasPage[1]);
        return;
      }
    }
    // 设置激活菜单
    setActiveMenu(menu.key);
    // 设置激活选项卡
    const path: string = activeMenuTab(menu);
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
      setMenuLayout(tab.name);
      current.path && loadRoute(current.path);
    }
  }

  /**
   * 加载路由页面
   * @param path 路由地址
   */
  function loadRoute(path: string) {
    const currentRoute = router.currentRoute.value;
    path &&
      router.push(path).then(() => {
        // 判断是否要刷新当前页面
        const appRouteName = `/${String(currentRoute.name)}/`;
        if (path.indexOf(appRouteName) > -1) {
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
    clearMenuLayout();
    if (layoutState) {
      initMenus(layoutState.menuType.value, {
        name: undefined,
        path: undefined,
      });

      let activekey;
      if (layoutState.menuType.value === MenuLayoutType.APPS_MENUS) {
        activekey = homeKey;
        menuLayout.value.paths = [
          {
            name: "首页",
            path: homeKey,
          },
        ];
        router.replace(homeKey);
      } else {
        const menu = getValidMenu(menuLayout.value.menus);
        const pathNames = menu.pathName.split("_");
        menuLayout.value.paths = pathNames.map((m) => ({ name: m }));
        layoutState?.pageTabList.value.push(getAppTab(menu));
        menu && router.replace(menu.path), (activekey = menu.key);
      }
      nextTick(() => {
        setActiveMenu(activekey);
      });
    }
  }

  /**
   * 初始化系统,默认呈现应用菜单
   */
  async function init(): Promise<void> {
    clearMenuLayout();
    // 根据当前路由地址，按类型加载菜单
    const menuType = getCurrentRouteType(
      userMenus.value,
      router.currentRoute.value
    );
    layoutState && (layoutState.menuType.value = menuType);
    initMenus(menuType, router.currentRoute.value);
  }

  /**
   * 初始化菜单
   * @param type 初始化类型
   */
  function initMenus(menuType: MenuLayoutType, current: any) {
    const menuTypeList: any = userMenus.value;
    // 记录当前菜单类型
    if (menuType === MenuLayoutType.APPS_MENUS) {
      if (layoutState) {
        // 默认添加home菜单选项
        layoutState.menuType.value = MenuLayoutType.APPS_MENUS;
        menuLayout.value.menus = [homeMenu];
        layoutState.pageTabList.value = [homeTab];
      }
    }

    const menuList = menuTypeList[`${menuType}`];
    const { activeMenu, menus } = initAppsMenuData(menuList, current.path);
    menuLayout.value.menus.push(...menus);
    // 设置菜单已经初始化完成
    store.commit("comm/setAppMenuInit", true);
    // 首页
    if (current.name === "home") {
      menuLayout.value.paths = [
        {
          name: "首页",
          path: homeKey,
        },
      ];
      nextTick(() => {
        setActiveMenu(homeKey);
      });
    } else {
      if (activeMenu) {
        const appTab = getAppTab(activeMenu);
        layoutState?.pageTabList.value.push(appTab);
        const pathNames = activeMenu.pathName.split("_");
        menuLayout.value.paths = pathNames.map((m) => ({ name: m }));
        nextTick(() => {
          setActiveMenu(activeMenu.key);
        });
      }
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
    defaultPath?: string,
    key?: string | number,
    name?: string
  ) {
    let activeMenu: any | undefined;
    const loopInit = (data, defaultPath, key, name) => {
      const menus: any[] = [];
      // 层级深度
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        // 菜单结构
        const menu: any = {
          key: key ? `${key}/${item.id}` : `${item.id}`,
          icon: item.menuIcon,
          title: item.name,
          pathName: name ? `${name}_${item.name}` : item.name,
          path: item.url,
        };
        if (item.children && item.children.length > 0) {
          menu.children = loopInit(
            item.children,
            defaultPath,
            menu.key,
            menu.pathName
          );
        } else {
          menu.children = [];
        }
        menus.push(menu);
        // 设置激活菜单
        if (defaultPath === menu.path) {
          activeMenu = menu;
        }
      }
      return menus;
    };
    const menus = loopInit(data, defaultPath, key, name);
    return { activeMenu, menus };
  }

  /**
   * 重置menuLayout
   */
  function clearMenuLayout() {
    if (menuLayout.value) {
      menuLayout.value.menus = [];
      menuLayout.value.paths = [];
      layoutState && (layoutState.pageTabList.value = []);
    }
  }

  /**
   * 根据当前路由地址判断要加载的菜单类型
   */
  function getCurrentRouteType(
    menuTypeList: any,
    current: any
  ): MenuLayoutType {
    if (current.name === "home") {
      return MenuLayoutType.APPS_MENUS;
    }
    // 在系统菜单中查找
    const menuList = menuTypeList["0"];
    let type = MenuLayoutType.APPS_MENUS;
    const findMenu = (menus: any[]) => {
      for (let i = 0; i < menus.length; i++) {
        const menu = menus[i];
        if (menu.url === current.path) {
          type = MenuLayoutType.SYSTEM_MENUS;
          return;
        }
        if (
          menu.children &&
          menu.children.length > 0 &&
          type !== MenuLayoutType.APPS_MENUS
        ) {
          findMenu(menu.children);
        }
      }
    };
    findMenu(menuList);
    return type;
  }

  function reloadCurrentRoute() {
    routeViewDisplay.value = false;
    nextTick(() => {
      routeViewDisplay.value = true;
    });
  }

  return {
    layoutState,
    userMenus,
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

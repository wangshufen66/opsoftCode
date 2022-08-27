import { MenuLayout } from "@/shared/type";

type State = {
  /**  水印配置 */
  waterMark: any;
  /**菜单展开状态 */
  menuExpand: boolean;
  /**应用菜单 */
  menuLayout?: MenuLayout;
  userMenus?: any;
  /**激活页面tab */
  activePageTab?: string;
  /**路由页面是否显示 */
  routeViewDisplay: boolean;
  /**应用初始化完成 */
  appInitComplete: boolean;
  /**页面菜单获取完成 */
  appMenuInit: boolean;
};

const state = (): State => {
  return {
    waterMark: {},
    menuExpand: true,
    menuLayout: {
      menus: [],
      paths: [],
      activeMenu: "",
    },
    userMenus: undefined,
    activePageTab: undefined,
    routeViewDisplay: true,
    appInitComplete: false,
    appMenuInit: false,
  };
};

const mutations: any = {
  /**设置菜单展开状态 */
  setMenuExpand: (state: State, status: boolean): void => {
    state.menuExpand = status;
  },
  /**设置水印状态*/
  setWaterMark: (state: State, setting: any): void => {
    state.waterMark = setting;
  },
  /**设置菜单*/
  setMenuLayout: (state: State, menuList: any): void => {
    state.menuLayout = menuList;
  },
  setUserMenus: (state: State, menuTypeList: any): void => {
    state.userMenus = menuTypeList;
  },
  /**设置菜单*/
  setActivePageTab: (state: State, tabName: any): void => {
    state.activePageTab = tabName;
  },
  /**设置路由页面是否显示 */
  setRouteViewDisplay: (state: State, display: any): void => {
    state.routeViewDisplay = display;
  },
  setAppInitComplete: (state: State, finish: boolean): void => {
    state.appInitComplete = finish;
  },
  setAppMenuInit: (state: State, finish: boolean): void => {
    state.appMenuInit = finish;
  },
};

const actions: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

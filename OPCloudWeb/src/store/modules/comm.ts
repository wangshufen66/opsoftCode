import { MenuLayout } from "@/interfaces/type";

type State = {
  /**  水印配置 */
  waterMark: any;
  /**菜单展开状态 */
  menuExpand: boolean;
  /**应用菜单 */
  menuLayout?: MenuLayout;
  /**激活页面tab */
  activePageTab?: string;
  /**路由页面是否显示 */
  routeViewDisplay: boolean;
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
    activePageTab: undefined,
    routeViewDisplay: true,
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
  /**设置菜单*/
  setActivePageTab: (state: State, tabName: any): void => {
    state.activePageTab = tabName;
  },
  /**设置路由页面是否显示 */
  setRouteViewDisplay: (state: State, display: any): void => {
    state.routeViewDisplay = display;
  },
};

const actions: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

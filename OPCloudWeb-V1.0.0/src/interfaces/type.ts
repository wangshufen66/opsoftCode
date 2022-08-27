import { Ref, WritableComputedRef } from "vue";
import { MenuLayoutType, PrintComponentType } from "./enum";

export type MenuLayout = {
  /**菜单列表 */
  menus: any[];
  /**当前页面路径 */
  paths: any[];
  /**选择的菜单key */
  activeMenu: string;
};

/**Layout State */
export type LayoutState = {
  /**菜单类型 */
  menuType: Ref<MenuLayoutType>;
  /**菜单展开状态 */
  menuExpand: WritableComputedRef<boolean>;
  /**页面选项卡 */
  pageTabList: Ref<any[]>;
};

/**
 * 页面类型
 */
export enum PageType {
  /**表单页面 */
  FORM_PAGE = 0,
  /**流程表单页面 */
  FLOW_PAGE = 1,
  /**报表页面 */
  REPORT_PAGE = 2,
  /**嵌入页面 */
  EMBEDDED_PAGE = 9,
}

/**组件结构 */
export type PrintComponent = {
  tid: string;
  /**类型 */
  type: PrintComponentType;
  /**标题 */
  label: string;
  /**标题 */
  icon: string;
};

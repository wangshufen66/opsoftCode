/**
 * 菜单结构
 */
export type Menus = {
  /**KEY */
  key: string | number;
  /**图标 */
  icon: string;
  /**名称 */
  title: string;
  /**路径 */
  path?: string;
  /**子集 */
  children?: Menus[];
};

/**
 * Menu Provide
 */
export type BaseMenuProvide = {
  onMenuClickHandler: (menu: Menus) => void;
};
/**
 * 面包屑结构
 */
export type Breadcrumb = {
  icon: string;
  /**名称 */
  name: string;
  /**路径 */
  path?: string;
};

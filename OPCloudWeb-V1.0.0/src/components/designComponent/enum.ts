/**
 * 穿透类型
 */
export enum PenetratePageType {
  /**页面 */
  PAGE = 1,
  /**表单 */
  FORM = 2,
}
/**
 * 组件功能分类
 */
export enum ComponentFunType {
  /**
   * 容器类型组件
   */
  CONTAINER = 1,
  /**
   * 常规组件(默认)
   */
  ROUTINE = 2,
}

/**
 * 字段颜色显示方式
 * @export
 * @enum {number}
 */
export enum FieldDisplayType {
  /**默认 */
  DEFAULT = 1,
  /**按条件 */
  FILTER = 2,
}

/**
 * 字段显示外观
 * @export
 * @enum {number}
 */
export enum FieldShape {
  /**默认显示 */
  DEFAULT = 1,
  /**圆点 */
  DOT = 2,
  /**标签 */
  TAG = 3,
}

import { DirectiveBinding, ObjectDirective } from "vue";

export const permission: ObjectDirective = {
  /**el:绑定的元素；binding：指令绑定的参数对象 */
  created: (el: HTMLElement, binding: DirectiveBinding) => {},
  beforeMount: (el: HTMLElement, binding: DirectiveBinding) => {},
  mounted: (el: HTMLElement, binding: DirectiveBinding) => {},
  unmounted: (el: HTMLElement, binding: DirectiveBinding) => {},
};

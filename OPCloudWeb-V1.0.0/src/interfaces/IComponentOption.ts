/**
 * 组件option配置
 */
export interface IComponentOption {
  id?: number | string;
  value?: any;
  label?: string;
  children?: Array<IComponentOption>;
}

import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * calculateInput组件结构
 */
export interface CalculateComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   * @type {'calculate-input'}
   */
  componentTag: 'designCalculate';
  /**
   * 自定义配置
   */
  __config__: CalculateCfg;
  /**
   * 组件属性配置
   */
  __attr__: CalculateComponentAttr;

}

/**
 * 自定义配置
 * @export
 * @interface CalculateCfg
 */
export interface CalculateCfg extends BaseCustomCfg {
  defaultValue?: string | number;
  /**小数点位数 */
  decimalSize?: string;
  /**公式 */
  formula?: string;
  /**
   * 结算结果类型
   */
  resultType: ResultType;
  icon?: string;
  sqlType?: string;
  inTable?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface CalculateComponentAttr
 */
export interface CalculateComponentAttr {
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
}
/**
 * 计算结果
 * @export
 * @enum {number}
 */
export enum ResultType {
  /**值类型 */
  VALUE = 1,
  /**百分比 */
  PERCENT = 2,
}

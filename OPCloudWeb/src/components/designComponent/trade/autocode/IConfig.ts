import { ComponentBaseCfg, BaseCustomCfg } from "../../commonCfg";

/**
 * AutoCode组件结构
 */
export interface AutoCodeComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: "designAutoCode";
  /**
   * 自定义配置
   */
  __config__: AutoCodeCfg;
  /**
   * 组件属性配置
   */
  __attr__: AutoCodeAttribute;
  /**
   * 编码规则
   */
  autorule: AutoCodeRule;
}

/**
 * 自定义配置
 * @export
 */
export interface AutoCodeCfg extends BaseCustomCfg {
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
  /**是否连续编码 */
  isSeries?: boolean;
}

/**
 * 组件属性
 * @export
 */
export interface AutoCodeAttribute {
  clearable?: boolean;
  "prefix-icon"?: string;
  /**占位文本 */
  placeholder?: string;
  maxlength?: number;
  readonly?: boolean;
  disabled?: boolean;
  // 生成地址
  action?: string;
  "reset-create"?: boolean;
}

/**
 * 自动生成规则
 */
export interface AutoCodeRule {
  tableId: string | undefined;
  type: number | string;
  letter?: string;
  numLen?: number;
  dataformat?: string;
}
/**
 * 编码类型
 */
export enum AutoCodeRuleType {
  /**
   * 自增数字
   */
  AUTO_NUMBER = 1,
  /**
   * 字母+数字
   */
  LETTER_NUMBER = 2,
  /**
   * 数字+字母
   */
  NUMBER_LETTER = 3,
  /**
   * 数字+日期
   */
  NUMBER_DATE = 4,
  /**
   * 日期+自增长数字
   */
  DATE_AUTONUMBER = 5,
  /**
   * 字母+日期+自增长数字
   */
  LETTER_DATE_AUTONUMBER = 6,
}

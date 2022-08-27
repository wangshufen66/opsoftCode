import { ComponentFunType } from "./enum";
import {
  DataModel,
  PenetrateCfg,
  RegexType,
  RunTime,
  VerifyComponent,
  RelTable,
  RelComponent,
  Mconfig
} from "./type";

/**
 * 组件定义接口
 * @export
 * @interface IComponent
 */
export interface IComponent {
  /**
   * 组件配置
   */
  config: ComponentBaseCfg;
  /**
   * 配置检测
   */
  verifyConfig?: () => string;
  /**
   * PC组件配置转换成移动端组件配置
   */
  transformConfig?: () => any;
}

/**
 * 公共配置
 * @export
 * @interface ComponentBaseCfg
 */
export interface ComponentBaseCfg {
  /**
   * name
   */
  name?: string;
  // 组件ID
  componentId?: string | number;
  // 组件model
  __vModel__?: string;
  /**
   * 功能分类，默认为常规组件
   */
  funType?: ComponentFunType;
  /**
   * 组件表单配置
   */
  __form__?: IFormComponentCfg;
  /**
   * 关联表设置
   */
  __relTable__?: RelTable;
  /**
   * 运行时属性配置
   */
  __runtime__?: RunTime;
  /**
     * 移动端显示配置
     */
  __mConfig__?: Mconfig
}

/**
 * 自定义配置
 */
export interface BaseCustomCfg {
  // 字段唯一性
  unique?: boolean;
  /**组件联动配置 */
  relComponent?: RelComponent;
  /**
   * 是否在表单显示
   */
  inForm?: boolean;
  /**
   * 数据模型
   */
  dataModel?: DataModel[];
  /**
   * 组件校验
   */
  verifyComponent?: VerifyComponent;
  /**
   * 数据穿透配置
   */
  penetrate?: PenetrateCfg;
}

/**
 * 表单配置
 * 组件差异性配置放在具体组件中
 * @export
 * @interface IFormComponentCfg
 */
export interface IFormComponentCfg {
  /**
   * 文本
   */
  label?: string;
  /**
   * 文本标签宽度
   */
  labelWidth?: number;
  /**
   * 是否显示文本
   */
  showLabel?: boolean;
  /**
   * 是否必填
   */
  required?: boolean;
  /**
   * 栅格大小
   */
  span?: number;
  /**
   * 正则
   */
  regList?: RegexType[];
}

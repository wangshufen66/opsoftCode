import { ComponentBaseCfg, BaseCustomCfg, IComponent } from "../../commonCfg";

/**
 * DialogSelect组件结构
 */
export interface DialogSelectComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: "designDialogSelect";
  /**
   * 自定义配置
   */
  __config__: DialogSelectCfg;
  /**
   * 组件属性配置
   */
  __attr__: DialogSelectAttribute;
  /**
   * 配置校验
   */
  // verifyConfig: () => void;
  /**
   * 绑定值
   */
  props: Props;
  /**
   * 选择的Model
   */
  selectModel?: any;
  /**
   * 表格列配置
   */
  columnModel?: any[];
  /**数据复制设置 */
  copyData?: copyData;
}

type Props = {
  label?: string;
  value?: string | number | boolean;
};

/**
 * 自定义配置
 * @export
 */
export interface DialogSelectCfg extends BaseCustomCfg {
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
  valueBindField?: string;
  textBindField?: string;
}

/**
 * 组件属性
 * @export
 */
export interface DialogSelectAttribute {
  clearable?: boolean;
  /**占位文本 */
  placeholder?: string;
  "suffix-icon"?: string;
  readonly?: boolean;
  disabled?: boolean;
}

export type copyData = {
  /** 绑定复制功能*/
  bindCopy?: string | undefined;
  /**关联条件*/
  relation?: string | undefined;
  /**关联的组件Id*/
  componentId?: number | undefined;
};

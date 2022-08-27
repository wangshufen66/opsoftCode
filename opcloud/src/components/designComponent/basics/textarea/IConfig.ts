import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * TextArea组件结构
 */
export interface TextAreaComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designTextArea';
  /**
   * 自定义配置
   */
  __config__: TextAreaCfg;
  /**
   * 组件属性配置
   */
  __attr__: TextAreaAttribute;

}
/**
 * 自定义配置
 * @export
 * @interface TextAreaCfg
 */

export interface TextAreaCfg extends BaseCustomCfg {

  defaultValue?: string | number;
  icon?: string;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface TextAreaAttribute
 */
export interface TextAreaAttribute {
  placeholder?: string;
  maxlength?: number;
  'show-word-limit'?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  /**
   * 自适应内容高度
   */
  autosize: TextAreaAutosize;
}

export type TextAreaAutosize = {
  minRows?: number;
  maxRows?: number;
};
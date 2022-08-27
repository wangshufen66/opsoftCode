import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Select组件结构
 */
export interface SelectComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designSelect';
  /**
   * 自定义配置
   */
  __config__: SelectCfg;
  /**
   * 组件属性配置
   */
  __attr__: SelectAttribute;
  /**
   * 分组配置
   * @type {SelectOptionGroup[]}
   */
  __group__?: SelectOptionGroup[];
  /**
   * 自定义节点表达式
   */
  __customExpression__?: string;
  /**
   * 选项配置
   * @type {SelectOption}
   */
  __option__: SelectOption;
  /**
   * 数据属性字段配置
   * @type {SelectProps}
   */
  __props__: SelectProps;
  /**
   * 数据源
   */
  options: any[];

}

/**
 * 自定义配置
 * @export
 * @interface SelectCfg
 */
export interface SelectCfg extends BaseCustomCfg {
  icon?: string;
  defaultValue?: string | number | boolean | any[];
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface SelectAttribute
 */
export interface SelectAttribute {
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  'value-key'?: string;
  'multiple-limit'?: boolean;
  'allow-create'?: boolean;
}

export interface SelectOptionGroup {
  label?: string;
  disabled?: boolean;
}

export interface SelectOption {
  label?: string | number;
  value?: string | number | boolean;
  disabled?: boolean;
}

/**
 * 数据绑定字段属性设置
 */
export interface SelectProps {
  // 用于显示标签文本的属性
  label: string;
  // 用于显示标签值的属性
  value: string;
}
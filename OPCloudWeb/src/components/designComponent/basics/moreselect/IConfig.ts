import { BaseCustomCfg, ComponentBaseCfg } from '../../commonCfg';

/**
 * Select组件结构
 */
export interface MoreSelectComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designMoreSelect';
  /**
   * 自定义配置
   */
  __config__: MoreSelectCfg;
  /**
   * 组件属性配置
   */
  __attr__: MoreSelectAttribute;
  /**
   * 分组配置
   * @type {MoreSelectOptionGroup[]}
   */
  __group__?: MoreSelectOptionGroup[];
  /**
   * 自定义节点表达式
   */
  __customExpression__?: string;
  /**
   * 选项配置
   * @type {MoreSelectOption}
   */
  __option__: MoreSelectOption;
  /**
   * 数据属性字段配置
   * @type {MoreSelectProps}
   */
  __props__: MoreSelectProps;
  /**
   * 数据源
   */
  options: any[];

}

/**
 * 自定义配置
 * @export
 * @interface MoreSelectCfg
 */
export interface MoreSelectCfg extends BaseCustomCfg {
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
 * @interface MoreSelectAttribute
 */
export interface MoreSelectAttribute {
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  'value-key'?: string;
  'multiple-limit'?: boolean;
  'allow-create'?: boolean;
}

export interface MoreSelectOptionGroup {
  label?: string;
  disabled?: boolean;
}

export interface MoreSelectOption {
  label?: string | number;
  value?: string | number | boolean;
  disabled?: boolean;
}

/**
 * 数据绑定字段属性设置
 */
export interface MoreSelectProps {
  // 用于显示标签文本的属性
  label: string;
  // 用于显示标签值的属性
  value: string;
}
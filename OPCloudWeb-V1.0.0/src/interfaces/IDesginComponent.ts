import { IComponentConfig } from './IComponentConfig';
import { IComponentSolt } from './IComponentSolt';
import { IComponentOption } from './IComponentOption';
import { IComponentProps } from './IComponentProps';

/**
 * 组件配置
 */
export type IDesginComponent = {
  /**
   * 组件ID
   * @type {(string | number)}
   */
  componentId?: string | number;
  // 自定义配置
  __config__: IComponentConfig;
  __slot__?: IComponentSolt;
  __vModel__?: string;
  options?: Array<IComponentOption>;
  placeholder?: string;
  style?: any;
  props?: IComponentProps;
  clearable?: boolean;
  'prefix-icon'?: string;
  'suffix-icon'?: string;
  maxlength?: number | undefined | null;
  'show-word-limit'?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  type?: string;
  autosize?: IAutosize;
  'show-password'?: boolean;
  min?: number | null;
  max?: number | null;
  minum?: number | null;
  step?: number;
  'step-strictly'?: boolean;
  precision?: number;
  'controls-position'?: string;
  height?: number;
  branding?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  'show-all-levels'?: boolean;
  separator?: string;
  size?: string;
  'active-text'?: string | null;
  'inactive-text'?: string | null;
  'active-color'?: string | null;
  'inactive-color'?: string | null;
  'active-value'?: boolean;
  'inactive-value'?: boolean;
  'show-stops'?: boolean;
  range?: boolean;
  'picker-options'?: {
    selectableRange?: string;
  };
  format?: string;
  'value-format'?: string;
  'is-range'?: boolean;
  'range-separator'?: string;
  'start-placeholder'?: string;
  'end-placeholder'?: string;
  'allow-half'?: boolean;
  'show-text'?: boolean;
  'show-score'?: boolean;
  'show-alpha'?: boolean;
  'color-format'?: string;
  action?: string;
  accept?: string;
  name?: string;
  'auto-upload'?: boolean;
  'list-type'?: string;
  justify?: string;
  align?: string;
  icon?: string;
  round?: boolean;
  plain?: boolean;
  circle?: boolean;
  'show-file-list'?: boolean;

  batchDelete?: boolean;
  paging?: boolean;
  dataSource?: any[];
  tableColumn?: any[];
};

/**
 * 多行文本输入框大小配置
 */
interface IAutosize {
  minRows?: number;
  maxRows?: number;
}

/**
 * 组件__config__配置
 * @export
 */
export interface IComponentConfig {
  componentName?: string;
  label?: string;
  labelWidth?: number | null;
  showLabel?: boolean;
  changeTag?: boolean;
  tag?: string;
  icon?: string;
  defaultValue?: any;
  unDefaultValue?: boolean;
  required?: boolean;
  layout?: string;
  span?: number;
  regList?: Array<{ pattern: string; message: string; trigger?: string }>;
  url?: string;
  method?: string;
  dataKey?: string;
  dataType?: string;
  optionType?: string;
  border?: boolean;
  showTip?: boolean;
  buttonText?: string;
  fileSize?: number;
  sizeUnit?: string;
  renderKey?: string;
  children?: Array<any>;
  layoutTree?: boolean;
  type?: string;
  tableName?: string;
  fkey?: string;
  fTableName?: string;
  fTableId?: string;
  fKeyValue?: string;
  inSearch?: boolean;
  inTable?: boolean;
  isCascadeItem: number,
  isUnique: number


}

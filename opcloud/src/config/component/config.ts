import { IFormConfig } from "@/shared/formConfig";

// 表单属性【右面板】
export const formConfig: IFormConfig = {
  size: "medium",
  labelPosition: "right",
  labelWidth: 120,
  disabled: false,
  width: 70,
  dialogType: "dialog",
  direction: "rtl",
  processDefinitionId: "", //所属流程、
  userGroup: "", //所属用户组
  startFlowLabel: "启动流程",
  showButton: false, //表单设置按钮
  buttonList: [], //按钮列表
  equipMaint: false,
  equipMaintForm: {},
  isIot: null,
  dataSource: "",
};
/**
 * 组件类型
 * @enum {number}
 */
export enum ComponentType {
  /** 默认组件 */
  DEFAULT = 0,
  /** 单行文本 */
  INPUT = 1,
  /** 多行文本 */
  TEXTAREA = 2,
  /** 时间范围组件 */
  DATETIMERANGE = 3,
  /** 级联组件 */
  CASCADER = 4,
  /** 一般多值组件 */
  COMMON_MULTIPLE_CHECK = 5,
  /** 多选组件 */
  MULTIPLE_CHECK = 6,
  /** 日期组件 */
  DATE = 7,
  /** 时间组件 */
  TIME = 8,
  /**
   * 日期计算组件
   */
  DATE_CRITICALTY = 9,
  /*** 自编码组件 */
  AUTO_CODE = 11,
  /** 树形组件 */
  TREE = 12,
  /** 日期多选 */
  MultiDate = 13,
  /** 开窗组件 */
  DIALOG_SELECT = 14,
  /** 开窗组件 */
  TAB_TABLE = 15,
  /** 非数据组件 */
  UNDATA = 99,
}

export const defaultComponentList = [
  { tag: "designInput", type: ComponentType.INPUT },
  { tag: "designTextArea", type: ComponentType.TEXTAREA },
  { tag: "designPassword", type: ComponentType.DEFAULT },
  { tag: "designNumber", type: ComponentType.DEFAULT },
  { tag: "designSelect", type: ComponentType.MULTIPLE_CHECK },
  { tag: "designMoreSelect", type: ComponentType.MULTIPLE_CHECK },
  { tag: "designCascader", type: ComponentType.CASCADER },
  { tag: "designRadio", type: ComponentType.DEFAULT },
  { tag: "designSwitch", type: ComponentType.DEFAULT },
  { tag: "designTimePicker", type: ComponentType.TIME },
  { tag: "designDatePicker", type: ComponentType.DATE },
  { tag: "designMultiDatePicker", type: ComponentType.MultiDate },
  { tag: "designCheckBox", type: ComponentType.MULTIPLE_CHECK },
  { tag: "designSlider", type: ComponentType.COMMON_MULTIPLE_CHECK },
  { tag: "designColorPicker", type: ComponentType.DEFAULT },
  { tag: "designTimeRangePicker", type: ComponentType.DATETIMERANGE },
  { tag: "designDateRangePicker", type: ComponentType.DATETIMERANGE },
  { tag: "designUpload", type: ComponentType.DEFAULT },
  { tag: "designTable", type: ComponentType.UNDATA },
  { tag: "designLabel", type: ComponentType.UNDATA },
  { tag: "designButton", type: ComponentType.UNDATA },
];

export const tradeComponentList = [
  { tag: "designAutoCode", type: ComponentType.AUTO_CODE },
  { tag: "designDateCriticality", type: ComponentType.DATE_CRITICALTY },
  { tag: "designTabTable", type: ComponentType.TAB_TABLE },
  { tag: "designDataOperator", type: ComponentType.UNDATA },
  { tag: "designDialogSelect", type: ComponentType.DIALOG_SELECT },
  { tag: "designTree", type: ComponentType.TREE },
  { tag: "designProgress", type: ComponentType.UNDATA },
  { tag: "designProcessFlow", type: ComponentType.UNDATA },
];

export const layoutComponentList = [
  { tag: "designPabelLayout", type: ComponentType.UNDATA },
];

import { dialogType, directionType } from "./pageConfig";

export interface IFormConfig {
  size?: string;
  labelPosition?: string;
  labelWidth?: number;
  disabled?: boolean;
  width?: number;
  dialogType?: dialogType;
  direction?: directionType;
  processDefinitionId?: string; //所属流程、
  userGroup?: string; //所属用户组
  /**
   * 启动按钮名称
   */
  startFlowLabel?: string;
  // 是否设置按钮
  showButton?: boolean;
  buttonList?: any[];
  equipMaint?: boolean;
  equipMaintForm?: any;
  /**自定义表名 */
  pageTableName?: string;
  /**IoT */
  isIot: number | string | null;
  /**数据库表名*/
  dataSource: string;
}

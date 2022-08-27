export type SubmitParams = {
  /**表单数据 */
  jsonDATA: any;
  /**模块ID */
  modelId: number | string;
  /**页面ID */
  pageId: number | string;
  /**更新数据的ID */
  updateId?: number;
  /**删除数据ID列表 */
  deleteIds?: number[];
  /**从表数据 */
  tableDataEntities?: TabTableData[];
};

/**提交表单从表数据结构 */
export type TabTableData = {
  /**从表绑定主表字段 */
  masterFieldName: string;
  /**从表数据 */
  tableData: any[];
  /**从表ID */
  tableId: string | number;
  /**从表名称 */
  tableName: string;
  /**从表关联字段 */
  slaveFieldName: string;
};

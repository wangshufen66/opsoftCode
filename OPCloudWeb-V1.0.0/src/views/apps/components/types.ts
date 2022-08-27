export type SubmitParams = {
  jsonDATA: any;
  modelId: number;
  pageId: number;
  updateId?: number;
  deleteIds?: number[];
};
/**
 * 页面类型
 */
export enum PageType {
  /**表单页面 */
  FORM_PAGE = 0,
  /**流程表单页面 */
  FLOW_PAGE = 1,
  /**报表页面 */
  REPORT_PAGE = 2,
  /**嵌入页面 */
  EMBEDDED_PAGE = 9,
}

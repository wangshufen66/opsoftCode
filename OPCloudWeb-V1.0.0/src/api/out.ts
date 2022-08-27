import request, { ResponseType } from "@/utils/request";
/**委外发出 获取列表 */
export const getSend = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subOut/list",params);

/**委外发出 批量接收和单个接收 */
  export const rcvSave = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subReceive/save",params);

  /**委外发出 单个删除 */
export const sendDel = (params: any): Promise<ResponseType> =>
request().post("/api/opcloud/lcdp/subOut/delete",params);

/**委外发出 批量删除 */ 
export const sendBatchDel = (params: any): Promise<ResponseType> =>
request().post("/api/opcloud/lcdp/subOut/d       eleteBatch",params);



/**委外接收 获取列表 */
export const getRcv = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subReceive/list",params);
  
/**委外接收 单个删除 */
export const rcvDel = (params: any): Promise<ResponseType> =>
request().post("/api/opcloud/lcdp/subReceive/delete",params);

/**委外接收 批量删除 */ 
export const rcvBatchDel = (params: any): Promise<ResponseType> =>
request().post("/api/opcloud/lcdp/subReceive/deleteBatch",params);
// 生产订单相关的操作接口
import request, { ResponseType } from "@/utils/request";
/**修改生产订单状态*/
export const changeStatus = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/gongdan/prdOrder/changeStatus", params);
// 获取前道工序列表
export const getPreProcess = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/tBdProcess/getPageList", params);

// 获取工艺路线下的工序列表
export const getRouteByArtRoute = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/tBdRoute/getOne", { params });
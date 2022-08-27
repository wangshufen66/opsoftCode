import request, { ResponseType } from "@/utils/request";

//Link
export const LinkageData = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/linkage/data", params);

//委外检验列表
export const SubReceiveInspectionList = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subReceiveInspection/list", params);

//委外检验详情
export const SubReceiveInspectionDetail = (
  params?: any
): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/subReceiveInspection/get", {
    params,
  });

//委外检验保存
export const ChangeStatus = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subReceiveInspection/changeStatus", params);

//更新委外检验状态
export const SubReceiveInspectionSave = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subReceiveInspection/update", params);

// 委外计划列表
export const SubPlanList = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subPlan/selectPage", params);

// 委外计划新增
export const AddPlanAndProcess = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subPlan/addPlanAndProcess", params);

export const UpdatePlanAndProcess = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subPlan/updatePlanAndProcess", params);

// 委外计划更新 id:  status: 0 10 20
export const UpdateSubPlan = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subPlan/updatePlanState", params);

// 委外计划更新 id:  status: 0 10 20
export const GetPlanDetail = (id?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/subPlan/getPlanDetail?id=" + id);

// 委外计划更新 id:  status: 0 10 20
export const DelById = (id?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/subPlan/delById?id=" + id);


//委外发出
export const SaveBatch = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/subOut/save", params);


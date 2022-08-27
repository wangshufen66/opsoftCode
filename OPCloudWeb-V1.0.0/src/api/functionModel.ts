/**
 * 计算模型API
 */

import request, { ResponseType } from "@/utils/request";

/**
 * 获取计算模型(表单设计器使用)
 */
export const getfunctionModel = (): Promise<ResponseType> =>
  request().get("/api/opcloud/application/appdata/functionModel");

/**
 * 获取计算模型(模型管理，分页)
 */
export const getModelList = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getList", { params });

/**
 * 添加模型
 */
export const addModel = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModel/add", params);

/**
 * 删除模型
 */
export const deleteModel = (params: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/functionModel/delete?id=${params.id}`);

/**
 * 获取模型详情
 */
export const getModelDetail = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getDetail", { params });

/**
 * 获取公式类型
 */
export const getModelType = (): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getType");

/**
 * 设置模型状态
 */
export const setModelStatus = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModel/setStatus", params);

/**
 * 设置模型状态
 */
export const updateModel = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModel/update", params);

/**
 * 获取模型key字段
 */
export const getModelKeys = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getModelKey", { params });

/**
 * 保存字段设置
 */
export const saveModelKeys = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModel/save", params);

// 获取计算模型列表
export const getFunctionModelTypeList = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModelType/getList", { params });

/**
 * 添加模型类型
 */
export const addModelType = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModelType/add", params);

/**
 * 更新模型类型
 */
export const updateModelType = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModelType/update", params);

/**
 * 获取模型详情
 */
export const functionModelType = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModelType/getDetail", { params });

/**
 * 删除模型
 */
export const deleteModelType = (params: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/functionModelType/delete?id=${params.id}`);

/**
 * 停用模型状态
 */
export const setModelDisableStatus = (params: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/functionModelType/disable?id=${params.id}`);

/**
 * 启用模型状态
 */
export const setModelUsingStatus = (params: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/functionModelType/using?id=${params.id}`);

/*
 *编辑公式设置
 */
export const getDesignModelType = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModelType/getDesign", { params });

/*
 *保存公式设置
 */
export const DesignModelType = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/functionModelType/designSave", params);

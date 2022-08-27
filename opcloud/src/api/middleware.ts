import request, { ResponseType } from "@/shared/utils/request";

// 获取组件配置列表
export const getComponentcfg = (params: any): Promise<ResponseType> =>
  request().post("/middleware/componentcfg/query", params);

// 修改组件配置列表
export const updateComponentCfg = (params: any): Promise<ResponseType> =>
  request().post("/middleware/componentcfg/update", params);

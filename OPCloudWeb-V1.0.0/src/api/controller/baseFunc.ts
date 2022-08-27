import request, { ResponseType } from "@/utils/request";

const baseFunc = (prePath) => {
  return {
    GetPageList: (params?: any): Promise<ResponseType> => {
      return request().post(prePath + `/getPageList`, params);
    },
    //不分页
    GetList: (params?: any): Promise<ResponseType> => {
      return request().post(prePath + `/getList`, params);
    },
    GetOne: (params?: any): Promise<ResponseType> => {
      return request().get(prePath + `/getOne`, { params });
    },
    SaveOrUpdate: (params?: any): Promise<ResponseType> => {
      return request().post(prePath + `/saveOrUpdate`, params);
    },
    Save: (params?: any): Promise<ResponseType> => {
      return request().post(prePath + `/save`, params);
    },
    Delete: (params: Array<String | Number>): Promise<ResponseType> => {
      return request().post(prePath + `/del`, params);
    },
    AntiDisable: (params: Array<String | Number>): Promise<ResponseType> => {
      return request().post(prePath + `/antiDisable`, params);
    },

    Disable: (params: Array<String | Number>): Promise<ResponseType> => {
      return request().post(prePath + `/disable`, params);
    },

    BacthCheck: (params: Array<String | Number>): Promise<ResponseType> => {
      return request().post(prePath + `/checkBatch`, params);
    },
  };
};

export default baseFunc;

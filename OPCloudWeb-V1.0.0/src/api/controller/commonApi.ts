import request, { ResponseType } from "@/utils/request";

export default {
  //枚举
  GetEnumList: (params?: any): Promise<ResponseType> => {
    return request().get(`api/opcloud/sys/codeInfo/list`, {params});
  },
};

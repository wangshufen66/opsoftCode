import baseFunc from "./baseFunc";
// 工序任务接口
var baseApiUrl = "/api/opcloud/gongdan/prdProcess";

export default {
  ...baseFunc(baseApiUrl),
};
import request, { ResponseType } from "@/utils/request";


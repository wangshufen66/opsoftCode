import baseFunc from "./baseFunc";

//工厂建模-加工单元
var baseApiUrl = "/api/opcloud/lcdp/tBdFactoryModel";

export default {
  ...baseFunc(baseApiUrl),
};

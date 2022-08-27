//引入mockjs
import { rangeArr } from "element-plus/lib/el-time-picker";
import Mock from "mockjs";

Mock.setup({
  timeout: 1000,
});
Mock.mock("/exec/sql", "get", {
  code: 200,
  "data|6-10": [
    {
      name: "@cname",
      "value|21-34": 10,
    },
  ],
});

//模拟数据获取图表列表
Mock.mock("/echarts/customerList", "get", {
  code: 200,
  data: {
    records: {
      "id|1-100": 1,
      xAxisData: "@range(1, 13)",
      yAxisData: "@range(1, 13)",
      newCustomer: "@range(1, 50, 3)",
      newOrder: "@range(0, 50, 2)",
      Date: '@DATETIME("yyyy-MM-dd HH:mm:ss")',
    },
    total: 10,
    customerName: "@cName",
  },
});

Mock.mock("/department/departmentList", "get", {
  status: 200,
  total: 100,
  "data|10": [
    {
      "number|+1": 100,
      name: "@name()",
      phoneNumber: "@cword('1234567890',11)",
      email: "@email",
      number: "@cword('1234567890',8)",
      remark: "@remark(20)",
      address: "@city(true)",
    },
  ],
});

//表单数据复制
Mock.mock("/sys/data", "get", {
  code: 200,
  data: {
    "records|10": [
      {
        "id|1-100": 1,
        sourceTableName: "@cword(5,10)",
        targetTableName: "@cword(5,10)",
        "type|1-2": 1,
        // type: "@cword(5,80)",
      },
    ],
    total: 100,
  },
});

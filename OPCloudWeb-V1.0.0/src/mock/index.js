//引入mockjs
import Mock from 'mockjs'

Mock.setup({
  timeout: 1000,
})
Mock.mock('/exec/sql', 'get', {
  code: 200,
  'data|6-10': [{
    name: '@cname',
    'value|21-34': 10,
  }, ],
})
Mock.mock('/chart/pageData', 'get', {
  code: 200,
  data: {
    currentChartList: [{
        chartId: 1,
        __config__: {
          label: '折线图',
          type: 'line',
          icon: 'linechart',
          isDark: false,
          dataType: ['sql'],
          dataOrg: [''],
          colSpan: 1,
          rowSpan: 1,
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: false,
          position: 'top',
        },
        xAxis: {
          type: 'category',
          show: true,
          axisLine: {
            show: true,
          },
          axisLabel: {
            formatter: '{value}',
          },
          data: [
            '3月20日',
            '3月21日',
            '3月22日',
            '3月23日',
            '3月24日',
            '3月25日',
            '3月26日',
          ],
        },
        yAxis: {
          type: 'value',
          show: true,
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
          },
        },
        series: [{
          name: 'line_1617675415680',
          type: 'line',
          data: [18, 20, 21, 22, 23, 19, 16],
        }, ],
        grid: {
          top: 10,
          left: 5,
          right: 5,
          bottom: 5,
          containLabel: true,
        },
      },
      {
        __config__: {
          label: '柱状图',
          type: 'bar',
          icon: 'barchart',
          isDark: false,
          dataType: ['sql'],
          dataOrg: ['s'],
          dataSource: [{
              name: '蒋磊',
              value: 29,
            },
            {
              name: '宋静',
              value: 25,
            },
            {
              name: '贾超',
              value: 21,
            },
            {
              name: '袁涛',
              value: 24,
            },
            {
              name: '赵刚',
              value: 27,
            },
            {
              name: '顾磊',
              value: 25,
            },
            {
              name: '姜军',
              value: 31,
            },
            {
              name: '乔超',
              value: 29,
            },
            {
              name: '苏勇',
              value: 27,
            },
          ],
          dataSourceAttr: 'value',
          xAxisDataType: 'datasource',
          xAxisDataAttr: 'name',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          show: false,
          position: 'top',
        },
        xAxis: {
          type: 'category',
          show: true,
          axisLine: {
            show: true,
          },
          data: [
            '蒋磊',
            '宋静',
            '贾超',
            '袁涛',
            '赵刚',
            '顾磊',
            '姜军',
            '乔超',
            '苏勇',
          ],
          name: 'X轴',
        },
        yAxis: {
          type: 'value',
          show: true,
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: '{value}',
          },
          name: 'Y',
        },
        series: [{
          name: 'bar_1617675415680',
          type: 'bar',
          data: [29, 25, 21, 24, 27, 25, 31, 29, 27],
        }, ],
        grid: {
          top: 10,
          left: 5,
          right: 5,
          bottom: 5,
          containLabel: true,
        },
        chartId: 101,
      },
      {
        __config__: {
          label: '饼图',
          type: 'pie',
          icon: 'pie',
          isDark: false,
          dataType: ['sql'],
          dataOrg: ['lb'],
          dataSource: [{
              name: '雷杰',
              value: 34,
            },
            {
              name: '蒋超',
              value: 26,
            },
            {
              name: '田桂英',
              value: 27,
            },
            {
              name: '宋霞',
              value: 34,
            },
            {
              name: '郑刚',
              value: 27,
            },
            {
              name: '尹静',
              value: 31,
            },
            {
              name: '潘军',
              value: 32,
            },
          ],
        },
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: false,
          position: 'top',
        },
        series: [{
          name: 'pie_1617675415680',
          type: 'pie',
          radius: 50,
          annular: false,
          data: [{
              name: '雷杰',
              value: 34,
            },
            {
              name: '蒋超',
              value: 26,
            },
            {
              name: '田桂英',
              value: 27,
            },
            {
              name: '宋霞',
              value: 34,
            },
            {
              name: '郑刚',
              value: 27,
            },
            {
              name: '尹静',
              value: 31,
            },
            {
              name: '潘军',
              value: 32,
            },
          ],
        }, ],
        grid: {
          top: 10,
          left: 5,
          right: 5,
          bottom: 5,
          containLabel: true,
        },
        chartId: 102,
      },
    ],
    panelConf: {
      rows: 1,
      columns: 2,
      cellHeight: 280,
      gap: 15,
    },
  },
})

Mock.mock('/department/departmentList', 'get', {
  status: 200,
  total: 100,
  'data|10': [{
    'number|+1': 100,
    name: '@name()',
    phoneNumber: "@cword('1234567890',11)",
    email: '@email',
    number: "@cword('1234567890',8)",
    remark: '@remark(20)',
    address: '@city(true)',
  }, ],
})

//计算模型
Mock.mock('/sys/model', 'get', {
  code: 200,
  'data': {
    'records|10': [{
      "id|1-100": 1,
      modelName: '@cword(10,20)',
      "modelType|1": [
        "summary",
        "bad",
      ],
      status: "@cword('01')",
      remark: "@cword(5,80)",
      "appName|1": [
        "coordination",
        "equipment",
      ]
    }],
    total: 100,
  },
})

//表单数据复制
Mock.mock('/sys/data', 'get', {
  code: 200,
  'data': {
    'records|10': [{
      "id|1-100": 1,
      sourceTableName: '@cword(5,10)',
      targetTableName: "@cword(5,10)",
      "type|1-2": 1,
      // type: "@cword(5,80)",
    }],
    total: 100,
  },
})

// 委外发出
Mock.mock('/api/opcloud/lcdp/sub-out/page','get',{
  code:200,
  data:{
    'records|15-40':[{
      "billNo|1-100": 1,
      outPlanNo:'@string(5,10)',
      supplierNumber:'@string(5,10)',
      supplier:'@cword(5,10)',
      icomNbr:'@string(5,10)',
      processCode:'@string(5,10)',
      processName:'@cword(5,10)',
      planOutQty:'@string(5,10)',
      "outQty|10-20":15,
      "sumRcvGoodQty|1-10":5,
      "isDeleted|0-1":0

    }],
    total:100,
  }
})
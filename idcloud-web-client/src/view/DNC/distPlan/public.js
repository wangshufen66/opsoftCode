import {
  getTableList
} from '@/api/DNC/distPlan'

export async function fetchTable(param) {
  try {
    let res = await Promise.resolve(getTableList(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export const editColumnRules = {
  programName: [{
    required: true,
    message: "此项不能为空",
    trigger: "blur"
  }],
  version: [{
    required: true,
    message: "此项不能为空",
    trigger: "blur"
  }]
}

export const addColumnSelected = [{
    title: "机床",
    key: "cncNumber",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "程序文档",
    key: "programName",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "版本号",
    key: "version",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "备注信息",
    key: "mark",
    width: "250",
    type: "textarea"
  }
]

export const addColumn = [{
    title: "机床",
    key: "cncNumber",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "程序文档",
    key: "programName",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "备注信息",
    key: "mark",
    width: "250",
    type: "textarea"
  }
]
export const addColumnRules = {
  cncNumber: [{
    required: true,
    message: "此项不能为空",
    trigger: "blur"
  }],
  programName: [{
    required: true,
    message: "此项不能为空",
    trigger: "blur"
  }],
  version: [{
    required: true,
    message: "此项不能为空",
    trigger: "blur"
  }]
}

export const editColumn = [{
    title: "机床代码",
    key: "cncNumber",
    width: "250",
    type: "disabled"
  },
  {
    title: "机床型号",
    key: "cncModel",
    width: "250",
    type: "disabled"
  },
  {
    title: "程序文档",
    key: "programName",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "版本号",
    key: "version",
    width: "250",
    type: "dialogTable"
  },
  {
    title: "备注信息",
    key: "mark",
    width: "250",
    type: "textarea"
  }
]

export const tableColumn = [{
    title: "机床代码",
    desc: {
      key: "cncNumber",
      type: "text"
    },
    width: '250',
  }, {
    title: "机床型号",
    desc: {
      key: "cncModel",
      type: "text"
    },
    width: '250',
  }, {
    title: "程序文档名称",
    desc: {
      key: "programName",
      type: "text"
    },
    width: '250',
  }, {
    title: "版本名称",
    desc: {
      key: "version",
      type: "text"
    },
    width: '250',
  },
  {
    title: "分发状态",
    desc: {
      key: "distributionStatus",
      type: "select"
    },
    options: [{
        key: 0,
        value: '未分发'
      },
      {
        key: 1,
        value: '分发'
      }
    ],
    width: '250',
  },
  {
    title: "分发时间",
    desc: {
      key: "distributionTime",
      type: "dateTime"
    },
    width: '250',
  },
  {
    title: "分发人",
    desc: {
      key: "distributionName",
      type: "text"
    },
    width: '250',
  },
  {
    title: "备注",
    desc: {
      key: "mark",
      type: "text"
    },
    width: '250',
  },
]

export const tableColumnTraditional = [{
    title: "机床代码",
    key: "cncNumber",
    type: "text",
    width: '250',
  }, {
    title: "机床型号",
    key: "cncModel",
    type: "text",
    width: '250',
  }, {
    title: "程序文档名称",
    key: "programName",
    type: "text",
    width: '250',
  }, {
    title: "版本名称",
    key: "version",
    type: "text",
    width: '250',
  },
  {
    title: "分发状态",
    key: "distributionStatus",
    type: "select",
    options: [{
        key: 0,
        value: '未分发'
      },
      {
        key: 1,
        value: '分发'
      }
    ],
    width: '250',
  },
  {
    title: "分发时间",
    key: "distributionTime",
    type: "dateTime",
    width: '250',
  },
  {
    title: "分发人",
    key: "distributionName",
    type: "text",
    width: '250',
  },
  {
    title: "备注",
    key: "mark",
    type: "text",
    width: '250',
  },
]

export const cncColumn = [{
    title: '机床代码',
    key: 'number',
    type: 'text'


  },
  {
    title: '机床型号',
    key: 'machineModel',
    type: 'text'

  },
  {
    title: '数控系统品牌',
    type: 'text',
    key: 'cncBrandName'

  },
  {
    title: '数控系统型号',
    key: 'cncModel',
    type: 'text'

  },
  {
    title: 'IP地址',
    width: '150',
    key: 'ip',
    type: 'text'

  },
  {
    title: '端口号',
    width: '100',
    key: 'port',
    type: 'text'

  }
]

export const programColumn = [{
    title: "文档名称",
    key: "name",
    type: "text",
    width: '250',
  }, {
    title: "ID",
    key: "number",
    type: "text",
    width: '250',
  }, {
    title: "程序文件",

    key: "fafsName",
    type: "text",
    width: '250',
  }, {
    title: "文件大小",
    key: "fafsSize",
    type: "text",
    width: '250',
  },
  {
    title: "当前版本",
    key: "version",
    type: "text",
    width: '250',
  },
  {
    title: "上传人",
    key: "docMakerName",
    type: "text",
    width: '250',
  },
  {
    title: "备注",
    key: "mark",
    type: "text",
    width: '250',
  },
  {
    title: "审核人",
    key: "auditPersonName",
    type: "text",
    width: '250',
  },
  {
    title: "审核时间",
    key: "auditTime",
    type: "dateTime",
    width: '250',
  },
  {
    title: "创建时间",
    key: "createTime",
    type: "dateTime",
    width: '250',
  },
]

export const versionColumn = [{
    title: "版本名称",
    key: "version",
    type: "text",
    width: '250',
  }, {
    title: "程序文件",
    key: "fafsName",
    type: "text",
    width: '250',
  },
  {
    title: "创建人",
    key: "docMakerName",
    type: "text",
    width: '250',
  },
  {
    title: "修改时间",
    key: "updateTime",
    type: "dateTime",
    width: '250',
  },
  {
    title: "备注信息",
    key: "mark",
    type: "text",
    width: '250',
  }
]
export const pickerOptions = {
  disabledDate(date) {
    return date && date.valueOf() > Date.now();
  },
  shortcuts: [{
      text: "今天",
      value() {
        return new Date();
      },
      onClick: picker => {}
    },
    {
      text: "昨天",
      value() {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return date;
      },
      onClick: picker => {}
    },
    {
      text: "一周前",
      value() {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return date;
      },
      onClick: picker => {}
    }
  ]
}

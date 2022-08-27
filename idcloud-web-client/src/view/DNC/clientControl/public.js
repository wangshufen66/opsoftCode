import {
  getTableList
} from '@/api/DNC/clientControl'

export async function fetchTable(param) {
  try {
    let res = await Promise.resolve(getTableList(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export const cncColumn = [{
    title: '机床代码',
    desc: {
      key: 'number',
      type: 'text'
    }

  },
  {
    title: '机床型号',
    desc: {
      key: 'machineModel',
      type: 'text'
    }
  },
  {
    title: '数控系统品牌',
    desc: {
      type: 'text',
      key: 'cncBrandName'
    }
  },
  {
    title: '数控系统型号',
    desc: {
      key: 'cncModel',
      type: 'text'
    }
  },
  {
    title: 'IP地址',
    width: '150',
    desc: {
      key: 'ip',
      type: 'text'
    }
  },
  {
    title: '端口号',
    width: '100',
    desc: {
      key: 'port',
      type: 'text'
    }
  }
]

export const tableColumn = [{
    title: "文档名称",
    desc: {
      key: "name",
      type: "text"
    },
    width: '250',
  }, {
    title: "ID",
    desc: {
      key: "number",
      type: "text"
    },
    width: '250',
  }, {
    title: "程序文件",
    desc: {
      key: "fafsName",
      type: "text"
    },
    width: '250',
  }, {
    title: "文件大小",
    desc: {
      key: "fafsSize",
      type: "text"
    },
    width: '250',
  },
  {
    title: "状态",
    desc: {
      key: "auditStatus",
      type: "select"
    },
    options: [{
        key: 0,
        value: '未审核'
      },
      {
        key: 1,
        value: '审核'
      }
    ],
    width: '250',
  },
  {
    title: "当前版本",
    desc: {
      key: "version",
      type: "text"
    },
    width: '250',
  },
  {
    title: "上传人",
    desc: {
      key: "docMakerName",
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
  {
    title: "审核人",
    desc: {
      key: "auditPersonName",
      type: "text"
    },
    width: '250',
  },
  {
    title: "审核时间",
    desc: {
      key: "auditTime",
      type: "dateTime"
    },
    width: '250',
  },
  {
    title: "创建时间",
    desc: {
      key: "createTime",
      type: "dateTime"
    },
    width: '250',
  },
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

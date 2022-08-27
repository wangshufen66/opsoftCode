import {
  getTableList,
  getFormData,
  getInfoPointData,
  addOne,
  updateOne,
  batchDel,
  updateInfoPoint,
  startHandleIssue,
  finishIssue
} from "@/api/Andon/andonAlarm";

export async function fetchTable(param) {
  try {
    let res = await Promise.resolve(getTableList(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchForm(param) {
  try {
    let res = await Promise.resolve(getFormData(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchInfoPointData(param) {
  try {
    let res = await Promise.resolve(getInfoPointData(param));
    if (res.data.code == 200) {
      res.data.data.forEach(i => {
        switch (i.warningColor) {
          case 1:
            i.warningColorText = '黄色'
            break;
          case 2:
            i.warningColorText = '红色'
            break;
          case 3:
            i.warningColorText = '蓝色'
            break;
          case 4:
            i.warningColorText = '绿色'
            break;
          case 5:
            i.warningColorText = '白色'
            break;
          default:
            break;
        }
      })
    }
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function addAndonInfo(param) {
  try {
    let res = await Promise.resolve(addOne(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function updateAndonInfo(param) {
  try {
    let res = await Promise.resolve(updateOne(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function batchDelAndonInfo(param) {
  try {
    let res = await Promise.resolve(batchDel(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function updateCloudboxInfoPoint(param) {
  try {
    let res = await Promise.resolve(updateInfoPoint(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function startHandle(param) {
  try {
    let res = await Promise.resolve(startHandleIssue(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function endHandle(param) {
  try {
    let res = await Promise.resolve(finishIssue(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export const formTableColumn = [{
    title: '信息点代码',
    key: 'number',
  }, {
    title: '信息点名称',
    key: 'name',
  },
  {
    title: '预警点描述',
    key: 'warningDescribe',
  },
  {
    title: '预警点颜色',
    key: 'warningColorText',
  },
  {
    title: '负责人',
    key: 'personName',
  },
]

export const tableColumn = [{
    title: "工位代码",
    desc: {
      key: "number",
      type: "text"
    },
    width: '250',
  }, {
    title: "工位名称",
    desc: {
      key: "name",
      type: "text"
    },
    width: '250',
  }, {
    title: "预警点",
    desc: {
      key: "warningPoint",
      type: "text"
    },
    width: '250',
  },
  {
    title: "预警时间",
    desc: {
      key: "warningTime",
      type: "dateTime"
    },
    width: '170',
  },
  {
    title: "状态",
    desc: {
      key: "status",
      type: "select"
    },
    options: [{
        value: 0,
        label: '未处理'
      },
      {
        value: 1,
        label: '处理中'
      },
      {
        value: 2,
        label: '已处理'
      },
      {
        value: 3,
        label: '取消'
      }
    ],
    width: '250',
  },
  {
    title: "处理人",
    desc: {
      key: "disposeName",
      type: "text"
    },
    width: '140',
  },
  {
    title: "处理结果",
    desc: {
      key: "disposeResult",
      type: "text"
    },
    width: '250',
  },
  {
    title: "开始处理时间",
    desc: {
      key: "disposeStartTime",
      type: "dateTime"
    },
    width: '170',
  },
  {
    title: "处理完成时间",
    desc: {
      key: "disposeEndTime",
      type: "dateTime"
    },
    width: '170',
  },
  {
    title: "备注信息",
    desc: {
      key: "mark",
      type: "textarea"
    },
    width: '280',
  }
]
export const formColumn = [{
    title: '工位代码',
    key: 'number',
    type: 'readonly'
  },
  {
    title: '工位名称',
    key: 'name',
    type: 'readonly'
  },
  {
    title: '预警点',
    key: 'warningPoint',
    type: 'readonly'
  },
  {
    title: '预警时间',
    key: 'warningTime',
    type: 'readonly'
  },
  {
    title: '状态',
    key: 'status',
    type: 'select-readonly',
    options: [{
        value: 0,
        label: '未处理'
      },
      {
        value: 1,
        label: '处理中'
      },
      {
        value: 2,
        label: '已处理'
      },
      {
        value: 3,
        label: '取消'
      }
    ]
  },
  {
    title: '处理结果',
    key: 'disposeResult',
    type: 'textarea',
    islong: true
  },
  {
    title: '处理人',
    key: 'disposeName',
    type: 'readonly'
  },
  {
    title: '开始处理时间',
    key: 'disposeStartTime',
    type: 'readonly'
  },
  {
    title: '处理完成时间',
    key: 'disposeEndTime',
    type: 'readonly'
  },
  {
    title: '备注信息',
    key: 'mark',
    type: 'textarea',
    islong: true
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

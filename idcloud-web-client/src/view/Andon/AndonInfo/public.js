import {
  getTableList,
  getFormData,
  getInfoPointData,
  addOne,
  updateOne,
  batchDel,
  batchAudit,
  batchAntiAudit,
  batchDisable,
  batchAntiDisable,
  updateInfoPoint
} from "@/api/Andon/andonInfo";

export async function fetchTable(param) {
  try {
    let res = await Promise.resolve(getTableList(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchForm(id) {
  try {
    let res = await Promise.resolve(getFormData(id));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function fetchInfoPointData(id) {
  try {
    let res = await Promise.resolve(getInfoPointData(id));
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

export async function batchAuditAndonInfo(param) {
  try {
    let res = await Promise.resolve(batchAudit(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function batchAntiAuditAndonInfo(param) {
  try {
    let res = await Promise.resolve(batchAntiAudit(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function batchDisableAndonInfo(param) {
  try {
    let res = await Promise.resolve(batchDisable(param));
    return res;
  } catch (e) {
    console.log(e);
  }
}

export async function batchAntiDisableAndonInfo(param) {
  try {
    let res = await Promise.resolve(batchAntiDisable(param));
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
    title: "工位描述",
    desc: {
      key: "mark",
      type: "text"
    },
    width: '250',
  },
  {
    title: "云盒代码",
    desc: {
      key: "box8302Number",
      type: "text"
    },
    width: '250',
  },
  {
    title: "云盒型号",
    desc: {
      key: "box8302BrandNumber",
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
    title: "操作员",
    desc: {
      key: "operationName",
      type: "text"
    },
    width: '140',
  },
  {
    title: "制单人",
    desc: {
      key: "docMakerName",
      type: "text"
    },
    width: '140',
  },
  {
    title: "创建时间",
    desc: {
      key: "createTime",
      type: "dateTime"
    },
    width: '170',
  },
  {
    title: "审核人",
    desc: {
      key: "auditPersonName",
      type: "text"
    },
    width: '140',
  },
  {
    title: "审核时间",
    desc: {
      key: "auditTime",
      type: "dateTime"
    },
    width: '170',
  },
  {
    title: "备注信息",
    desc: {
      key: "note",
      type: "textarea"
    },
    width: '280',
  }
]
export const formColumn = [{
    title: '工位代码',
    key: 'number',
    type: 'text'
  },
  {
    title: '工位名称',
    key: 'name',
    type: 'text'
  },
  {
    title: '工位描述',
    key: 'mark',
    type: 'text'
  },
  {
    title: '云盒代码',
    key: 'box8302Number',
    type: 'dialogTable'
  },
  {
    title: '云盒型号',
    key: 'box8302BrandNumber',
    type: 'readonly'
  },
  {
    title: '操作员',
    key: 'operationName',
    type: 'dialogTable'
  },
  {
    title: '备注信息',
    key: 'note',
    type: 'textarea',
    islong: true
  },
  {
    title: '制单人',
    key: 'docMakerName',
    type: 'disabled'
  },
  {
    title: '审核人',
    key: 'auditPersonName',
    type: 'disabled'
  },
  {
    title: '创建时间',
    key: 'createTime',
    type: 'disabled'
  },
  {
    title: '审核时间',
    key: 'auditTime',
    type: 'disabled'
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

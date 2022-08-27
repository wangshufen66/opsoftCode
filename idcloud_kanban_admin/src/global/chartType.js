// 组件类型
export function chartType() {
  return {
    // === 空组件，仅用于占位（透明组件） ===
    emptyComponent: {
      id: '00',
      label: '占位组件',
      name: 'block-module', // 对应VUE工程中可以使用的组件后缀名称
      previewImage: 'static/images/dragReport/col-8-0.png'
    },
    // === 一些基础图形组件（可以通过第三方库二次封装的组件） ===
    tableData: {
      id: '11',
      label: '数据表格',
      name: 'table-module', // 对应VUE工程中可以使用的组件后缀名称
      previewImage: 'static/images/dragReport/datatable.png'
    }, // 数据表格图
    barline: {
      id: '12',
      label: '柱形折线图',
      name: 'bar-module', // 对应VUE工程中可以使用的组件后缀名称 TODO:先用一个可用的组件名称试试
      previewImage: 'static/images/dragReport/barlinechart.png'
    }, // 柱形折线图
    pieLoop: {
      id: '13',
      label: '饼状环形图',
      name: 'pie-module', // 对应VUE工程中可以使用的组件后缀名称
      previewImage: 'static/images/dragReport/pieloopchart.png'
    }, // 饼状环形图
    // gauge: {
    //   id: '14',
    //   label: '仪表盘图',
    //   name: '', // 对应VUE工程中可以使用的组件后缀名称
    //   previewImage: 'static/images/dragReport/gauge.png'
    // }, // 仪表盘图

    // === 一些特殊设计的图形组件（需要纯手工打造的组件） ===
    tableCards: {
      id: '21',
      label: '卡片表格',
      name: 'table-cards-module',
      previewImage: 'static/images/dragReport/tablecards.png'
    }, // 卡片表格图
    // 配置文件图型（其他名称：横向切片图，时间排程图）
    profile: {
      id: '22',
      label: '剖面图',
      name: 'profile-module',
      previewImage: 'static/images/dragReport/profilechart.png'
    }
  }
}

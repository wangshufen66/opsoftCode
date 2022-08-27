/*
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @LastEditors: jsjzh
 * @Date: 2019-02-27 11:18:09
 * @LastEditTime: 2019-04-29 10:16:56
 * @Description: 该文件只是为了方便管理 default-chart-option，在 variable 中会将这些变量曝露出去
 */

// 色差最明显的 彩虹7色
// 绿：0,255,0    #00FF00
// 蓝：0,0,255    #0000FF
// 红：255,0,0    #FF0000
// 橙: 255,125,0     #FF7D00
// 灰: 178, 190, 195 #b2bec3
// 黄：255,255,0   #FFFF00
// 靛: 0,255,255    #00FFFF
// 紫: 255,0,255    #FF00FF
export const defaultColor = [
  'rgba(0,255,0,0.8)',
  'rgba(0,0,255,0.8)',
  'rgba(255,0,0,0.8)',
  'rgba(255,125,0,0.8)',
  'rgba(178, 190, 195,0.8)',
  'rgba(255,255,0,0.8)',
  'rgba(0,255,255,0.8)',
  'rgba(255,0,255,0.8)']
// TV Android的客户端默认浏览器引擎无法识别16进制颜色代码的8位带后2位透明度值的字符串，只能识别rgba
// export const defaultColor = ['rgba(96,172,252,0.6)', 'rgba(50,211,235,0.6)', 'rgba(255,238,81,0.5)', 'rgba(91,196,159,0.5)', 'rgba(254,182,77,0.5)', 'rgba(255,124,124,0.5)', 'rgba(146,135,231,0.5)', 'rgba(255,255,255,0.5)']
// export const defaultColor = ['#0098d9', '#e6b600', '#c12e34',  '#2b821d', '#005eaa', '#339ca8', '#cda819', '#32a487']
export const darkColor = ['#dd6b66', '#759aa0', '#e69d87', '#8dc1a9', '#ea7e53', '#eedd78', '#73a373', '#73b9bc', '#7289ab', '#91ca8c', '#f49f42']
export const shineColor = ['#ee7738', '#f59d2a', '#fcc419', '#ffe066', '#9bca63', '#b5c334', '#5e85a8', '#476480', '#34495d', '#2c3d4f']
export const infographicColor = ['#C1232B', '#27727B', '#FCCE10', '#E87C25', '#B5C334', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0']

export const defaultChartColors = defaultColor

// 限制报表一页 A4 纸大小
// 在预览页面选择查询条件
// 想办法动态切换图表颜色
// 编辑页面保存问题
// 点击新建直接打开新建的编辑页面

/**
 * color 颜色系
 * title chart 标题
 * legend 图例组件
 * tooltip 提示框组件
 * series 系列列表
 * toolbox 工具栏
 * grid 网格
 * xAxis X 轴相关
 * yAxis Y 轴相关
 */

// const pieDefaultData = []

const barDefaultXData = []
// const barDefaultData = []

const lineDefaultXData = []
// const lineDefaultData = []

// const pieDefaultData = [
//   { value: 335, name: 'no-data-1' },
//   { value: 310, name: 'no-data-2' },
//   { value: 234, name: 'no-data-3' },
//   { value: 135, name: 'no-data-4' },
//   { value: 465, name: 'no-data-5' },
//   { value: 379, name: 'no-data-6' },
//   { value: 664, name: 'no-data-7' }
// ]
// const barDefaultXData = ['no-data-1xxxxxxxxxxxx', 'no-data-2xxxxxxxxxxxxx', 'no-data-3xxxxxxxxxxxxxxx', 'no-data-4xxxxxxxxxxxxxxx', 'no-data-5', 'no-data-6', 'no-data-7']
// const barDefaultData = [120, 200, 150, 80, 70, 110, 130]
//
// const lineDefaultXData = ['no-data-1', 'no-data-2', 'no-data-3', 'no-data-4', 'no-data-5', 'no-data-6', 'no-data-7']
// const lineDefaultData = [820, 932, 901, 934, 1290, 1330, 1320]

export const defaultPieOption = {
  color: defaultChartColors,
  title: { show: false },
  legend: { orient: 'vertical', left: '5%', top: '15%', icon: 'circle', textStyle: { color: '#fff' }},
  tooltip: { confine: true, trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
  series: [
    // {
    //   name: '未命名饼图',
    //   type: 'pie',
    //   radius: [0, '35%'],
    //   minAngle: 5,
    //   center: ['65%', '60%'],
    //   itemStyle: { normal: { borderWidth: 1, borderColor: '#e5e5e5' } },
    //   label: { show: true,
    //     normal: {
    //       formatter: '{c}【{d}%】  ',
    //       }
    //     },
    //   labelLine: { show: true,length:20,length2:25 },
    //   data: pieDefaultData
    // },
    // {
    //   name: '未命名饼图',
    //   type: 'pie',
    //   radius: ['45%', '65%'],
    //   minAngle: 5,
    //   center: ['65%', '60%'],
    //   itemStyle: { normal: { borderWidth: 1, borderColor: '#e5e5e5' } },
    //   label: { show: true,
    //     normal: {
    //       formatter: '{c}【{d}%】  ',
    //     }
    //     },
    //   labelLine: { show: true,length:15,length2:15 },
    //   data: pieDefaultData
    // }
  ]
}

export const defaultBarOption = {
  color: defaultChartColors,
  tooltip: { confine: true, trigger: 'axis', axisPointer: { type: 'cross' }, formatter: '{a} <br/>{b} {c}' },
  legend: { left: 0, bottom: 0, textStyle: { color: '#fff' }},
  toolbox: { show: true, feature: { magicType: { show: true, type: ['line', 'bar'] }, restore: { show: true }}},
  grid: { left: '5%', right: '5%', top: '16%', bottom: '10%', containLabel: true },
  xAxis: { type: 'category', data: barDefaultXData, axisPointer: { type: 'shadow' }, splitNumber: 1,
    axisLabel: { show: true,
      textStyle: { color: '#fff' },
      interval: 0 // 设置成 0 强制显示所有标签
    },
    nameLocation: 'start',
    nameTextStyle: {
      padding: [30, 4, 5, 6],
      color: '#fff'
    }
  },
  yAxis: { type: 'value', axisLabel: { show: true, textStyle: { color: '#fff' }},
    nameTextStyle: {
      color: '#fff'
    }},
  series: [
    // { name: '未命名柱状图', type: 'bar', data: barDefaultData }
  ] // barWidth: '50%',
}

export const defaultLineOption = {
  color: defaultChartColors,
  legend: { left: 0, top: 0, textStyle: { color: '#fff' }},
  tooltip: { confine: true, trigger: 'axis', axisPointer: { type: 'cross' }},
  grid: { left: '5%', right: '5%', top: '10%', bottom: 0, containLabel: true },
  xAxis: { type: 'category', boundaryGap: false, data: lineDefaultXData, axisLabel: { show: true, textStyle: { color: '#fff' }}},
  yAxis: { type: 'value', axisLabel: { show: true, textStyle: { color: '#fff' }}},
  series: [
    // { name: '未命名曲线图图', type: 'line', data: lineDefaultData, smooth: false }
  ]
}

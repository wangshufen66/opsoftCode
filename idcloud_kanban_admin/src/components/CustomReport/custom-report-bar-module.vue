<!--
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @Date: 2019-02-18 10:43:52
 * @LastEditors: jsjzh
 * @LastEditTime: 2019-03-11 15:04:34
 * @Description: custom-report-bar-pie-module
 -->
<template>
  <div
    v-loading="loading"
    style="display: flex;flex-direction: column;"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)">
    <default-bar-chart ref="bar-chart" style="flex: 1"/>
  </div>
</template>

<script>
import request from '@/utils/requestCustom'
import { defaultBarOption } from './js/chart-variable'
import defaultBarChart from './default-bar-chart'

import { barFirstOption } from './js/variable'

export default {
  name: 'CustomReportBarModule',
  // watch: {
  //     reportData: {
  //         handler(newVal, oldVal) {
  //             // 父组件数据更新触发 echart 更新
  //             // this.renderChart(newVal);
  //             console.log(JSON.stringify(this.reportData))
  //             console.log(JSON.stringify(barFirstOption))
  //         }
  //     }
  // },
  components: { defaultBarChart },
  props: {
    api: {
      type: String,
      default() {
        return ''
      }
    }, // 后台请求接口的路由地址
    apiMethod: { // 后台请求接口的访问方式
      type: String,
      default() {
        return 'get'
      }
    },
    callIntervalSec: { // 请求后台数据的定时器执行间隔时间(单位：秒)
      type: Number,
      default() {
        return 5
      }
    }
  },
  data() {
    return { loading: false,
      timer: null, // 定时器
      totalPage: 1, // 总页数
      curPage: 1, // 记录数据的当前页码（此变量只用于查看）
      nextPage: 1, // 记录下一次请求后台数据的页码（此变量用于提交请求参数，控制请求的数据）
      chartOption: {}
    }
  },
  mounted() {
    // this.reloadChart();
    this.callData()

    // 初始化定时器
    this.timer = setInterval(this.callData, (this.callIntervalSec * 1000))
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {

    // 开发模式下，热加载组件触发 echart 更新
    reloadChart() {
      Object.keys(this.$refs).forEach(chart => {
        switch (chart) {
          case 'bar-chart':
            this.$refs[chart].setOption(barFirstOption)
            break
        }
      })
    },

    // 为每个系列添加气泡标签
    createMarkPoint() {
      this.chartOption.series.forEach((serItem, serIndex) => {
        serItem['markPoint'] = {
          symbol: 'pin',
          data: []
        }
        // 添加气泡（每个气泡对应的是 X轴系列的 坐标标签 + 数值 的组合，所以通过遍历其中一个集合，进行赋值）
        this.chartOption.xAxis.data.forEach((xdItem, xdIndex) => {
          const dataPoint = {
            coord: [xdItem, serItem.data[xdIndex]], // 这是气泡显示的坐标位置[X,Y]，其中的 X= X轴某个系列的坐标标签，Y=X轴某个系列的数值
            value: serItem.data[xdIndex] // 气泡中显示的数值
          }
          // 加入集合
          serItem.markPoint.data.push(dataPoint)
        })
      })
    },

    // 为每个系列创建显示数值的label标签
    creatSeriesLabel() {
      const labelOption = {
        normal: {
          show: true,
          position: 'insideBottom',
          distance: 15,
          align: 'left',
          verticalAlign: 'middle',
          rotate: 90,
          formatter: '{c}', // '{c}  {name|{a}}',
          fontSize: 16,
          rich: {
            name: {
              textBorderColor: '#fff'
            }
          }
        }
      }
      this.chartOption.series.forEach((serItem, serIndex) => {
        serItem['label'] = labelOption
      })
    },

    // 异步请求后台数据
    callData() {
      this.loading = true
      // 网络请求
      request({
        url: this.api,
        method: this.apiMethod,
        params: {
          'pageNum': this.nextPage
        }
      }).then(response => {
        response = response.data
        if (response.errno !== 0) { // 请求失败
          // this.openNotificationError(res.errmsg)
        } else { // 请求成功
          // 设置 x、y 轴的 坐标轴名称
          let xName = ''
          let yName = ''
          // 当 x轴 或 y轴 为数值轴时的 最小值 和 最大值
          // let xMin = null
          // let xMax = null
          let yMin = null
          let yMax = null
          if (response.data.configParam.hasOwnProperty('xAxis')) {
            if (response.data.configParam.xAxis.hasOwnProperty('name')) {
              xName = response.data.configParam.xAxis.name
            }
            // if (response.data.configParam.xAxis.hasOwnProperty('min')) {
            //   xMin = response.data.configParam.xAxis.min
            // }
            // if (response.data.configParam.xAxis.hasOwnProperty('max')) {
            //   xMax = response.data.configParam.xAxis.max
            // }
          }
          if (response.data.configParam.hasOwnProperty('yAxis')) {
            if (response.data.configParam.yAxis.hasOwnProperty('name')) {
              yName = response.data.configParam.yAxis.name
            }
            if (response.data.configParam.yAxis.hasOwnProperty('min')) {
              yMin = response.data.configParam.yAxis.min
            }
            if (response.data.configParam.yAxis.hasOwnProperty('max')) {
              yMax = response.data.configParam.yAxis.max
            }
          }
          // 实现横向柱形图，xy 轴单位互换
          if (response.data.configParam.hasOwnProperty('xyinterconvert') && response.data.configParam.xyinterconvert) {
            const xType = 'value'
            const yType = 'category'
            // 横向柱形图需要把data放到y轴的配置参数中
            this.chartOption = {
              toolbox: { show: false },
              xAxis: { name: xName, type: xType, axisLabel: { textStyle: { color: '#fff' }},
                nameLocation: 'start',
                nameTextStyle: {
                  padding: [30, 4, 5, 6],
                  color: '#fff'
                }},
              yAxis: { name: yName, type: yType, axisLabel: { textStyle: { color: '#fff' }}, data: response.data.configParam.barLineXLabelList,
                nameLocation: 'end',
                nameTextStyle: {
                  color: '#fff'
                }},
              series: null
            }
          } else { // 竖向图中，支持双Y轴设置
            const xType = 'category'
            const yType = 'value'

            const yRightType = 'value'
            let yRightName = ''
            let yRightMin = null
            let yRightMax = null

            const yAxisArray = []
            // 设置默认的左侧Y轴配置
            yAxisArray.push({ name: yName, min: yMin, max: yMax, type: yType, axisLabel: { textStyle: { color: '#fff' }},
              nameLocation: 'end',
              nameTextStyle: {
                color: '#fff'
              }})
            if (response.data.configParam.hasOwnProperty('yAxisRight')) {
              // 若存在右侧Y轴的配置信息
              if (response.data.configParam.yAxisRight.hasOwnProperty('name')) {
                yRightName = response.data.configParam.yAxisRight.name
              }
              if (response.data.configParam.yAxisRight.hasOwnProperty('min')) {
                yRightMin = response.data.configParam.yAxisRight.min
              }
              if (response.data.configParam.yAxisRight.hasOwnProperty('max')) {
                yRightMax = response.data.configParam.yAxisRight.max
              }
              // 添加设置右侧Y轴配置
              yAxisArray.push({ name: yRightName, min: yRightMin, max: yRightMax, type: yRightType, axisLabel: { textStyle: { color: '#fff' }},
                nameLocation: 'end',
                nameTextStyle: {
                  color: '#fff'
                }})
            }

            this.chartOption = {
              toolbox: { show: false },
              xAxis: { name: xName, type: xType, data: response.data.configParam.barLineXLabelList, axisLabel: { textStyle: { color: '#fff' }},
                nameLocation: 'start',
                nameTextStyle: {
                  padding: [30, 4, 5, 6],
                  color: '#fff'
                }},
              yAxis: yAxisArray,
              series: null
            }
          }
          // 设置每个系列的柱子的最大宽度值（柱子的最粗的值）
          response.data.configParam.seriesList.forEach((seriesItem, serIndex) => {
            seriesItem['barMaxWidth'] = '50px'
          })
          this.chartOption.series = response.data.configParam.seriesList
          // 根据后台的参数，决定是否绘制 系列的数值label
          // 若没有此属性，则默认显示系列数值label
          // 若没有属性值为false，则显示系列数值label
          if (!response.data.configParam.hasOwnProperty('hideSeriesNumberLabel') || !response.data.configParam.hideSeriesNumberLabel) {
            // this.createMarkPoint(); //为系列创建气泡数值标签
            this.creatSeriesLabel() // 为每个系列创建显示数值的label标签
          }

          // 将默认的chartOption 和 这里设置的chartOption 两个JSON对象进行合并
          const chartOptionTotal = Object.assign({}, defaultBarOption, this.chartOption)

          this.totalPage = response.data.totalPage
          this.curPage = response.data.curPage
          this.nextPage = response.data.nextPage

          // this.reloadChart();
          this.$refs['bar-chart'].setOption(chartOptionTotal)
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    @import "./css/index.scss";
</style>


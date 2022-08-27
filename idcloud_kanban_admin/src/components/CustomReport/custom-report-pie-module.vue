<!--
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @Date: 2019-02-18 10:43:52
 * @LastEditors: jsjzh
 * @LastEditTime: 2019-03-11 15:17:52
 * @Description: custom-report-pie-module
 -->
<template>
  <div
    v-loading="loading"
    style="display: flex;flex-direction: column;"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)">
    <default-pie-chart ref="chart" style="flex: 1" />
  </div>
</template>

<script>
import request from '@/utils/requestCustom'
import { defaultPieOption } from './js/chart-variable'
import defaultPieChart from './default-pie-chart'
import { pieOption } from './js/variable'

export default {
  name: 'CustomReportPieModule',
  // watch: {
  //     reportData: {
  //         handler(newVal, oldVal) {
  //             // 父组件数据更新触发 echart 更新
  //             this.renderChart(newVal);
  //         }
  //     }
  // },
  components: { defaultPieChart },
  props: {
    api: { // 后台请求接口的路由地址
      type: String,
      default() {
        return ''
      }
    },
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
      const { chart } = this.$refs
      chart.setOption(pieOption)
      this.reportData.length && this.renderChart(this.reportData)
    },
    renderChart(option) {
      const { chart } = this.$refs
      chart.setOption({ series: [{ data: option }] })
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
        // console.log(JSON.stringify(res))
        // console.log(res.data.configParam.ringSeriesDataList.length)
        if (response.errno !== 0) { // 请求失败
          // this.openNotificationError(res.errmsg)
        } else { // 请求成功
          this.chartOption = {
            series: []
          }
          if (response.data.configParam.pieSeriesDataList && response.data.configParam.pieSeriesDataList.length > 0) {
            // console.log("饼图")
            const radius = (!response.data.configParam.ringSeriesDataList || response.data.configParam.ringSeriesDataList === 0) ? [0, '65%'] : [0, '35%']
            // let data = {
            //     radius: radius,
            //     data: res.data.configParam.pieSeriesDataList
            // };
            this.chartOption.series.push({
              name: '未命名饼图',
              type: 'pie',
              radius: radius,
              minAngle: 5,
              center: ['65%', '60%'],
              itemStyle: { normal: { borderWidth: 1, borderColor: '#e5e5e5' }},
              label: { show: true,
                normal: {
                  formatter: '{c}【{d}%】  '
                }
              },
              labelLine: { show: true, length: 20, length2: 25 },
              data: response.data.configParam.pieSeriesDataList
            })
          }
          // else {
          //     this.chartOption.series.push({data:[]});
          // }
          // console.log(JSON.stringify(res.data.configParam.ringSeriesDataList))
          if (response.data.configParam.ringSeriesDataList && response.data.configParam.ringSeriesDataList.length > 0) {
            // console.log("环形图")
            // let data = {
            //     data: res.data.configParam.ringSeriesDataList
            // };
            this.chartOption.series.push({
              name: '',
              type: 'pie',
              radius: ['45%', '65%'],
              minAngle: 5,
              center: ['65%', '60%'],
              itemStyle: { normal: { borderWidth: 1, borderColor: '#e5e5e5' }},
              label: { show: true,
                normal: {
                  formatter: '{c}【{d}%】  '
                }
              },
              labelLine: { show: true, length: 15, length2: 15 },
              data: response.data.configParam.ringSeriesDataList
            })
          }
          // else {
          //     this.chartOption.series.push({data:[]});
          // }

          // 将默认的chartOption 和 这里设置的chartOption 两个JSON对象进行合并
          const chartOptionTotal = Object.assign({}, defaultPieOption, this.chartOption)

          this.totalPage = response.data.totalPage
          this.curPage = response.data.curPage
          this.nextPage = response.data.nextPage

          // this.reloadChart();
          const { chart } = this.$refs
          chart.setOption(chartOptionTotal)
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


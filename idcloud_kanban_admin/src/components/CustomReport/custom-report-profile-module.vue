<template>
  <div
    v-loading="loading"
    class="m-container"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)">
    <default-profile-chart ref="chart" class="chart" />
    <!--色块说明-->
    <div style="z-index: 999;" class="chart-legend-list">
      <div v-for="(colorItem,colorIndex) in colorTypes" :key="colorIndex" class="chart-legend">
        <div :style="{'background-color':colorItem.color}" class="chart-legend-color"/>
        <span class="chart-legend-span">{{ colorItem.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/requestCustom'
import echarts from 'echarts'
import { defaultColor } from './js/chart-variable'
import DefaultProfileChart from './default-profile-chart'
import { msToHourFixed } from '@/utils/dateUtils'

export default {
  name: 'CustomReportProfileModule',
  components: { DefaultProfileChart },
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
    return {
      loading: false,
      colorTypes: [],
      timer: null, // 定时器
      totalPage: 1, // 总页数
      curPage: 1, // 记录数据的当前页码（此变量只用于查看）
      nextPage: 1, // 记录下一次请求后台数据的页码（此变量用于提交请求参数，控制请求的数据）
      chartOption: {}
    }
  },
  mounted() {
    this.callData()

    // 初始化定时器
    this.timer = setInterval(this.callData, (this.callIntervalSec * 1000))
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {

    // 绘制EChart
    drawChart(configParam) {
      // console.log(JSON.stringify(configParam))
      // // 毫秒 转 小时的计算测试
      // let tmpMs = 88380000;   //应该等于 24.55h
      // console.log('88380000 毫秒 = ' + msToHourFixed(tmpMs,2) + ' 小时')

      const { chart } = this.$refs

      const data = []
      // let dataCount = 200;    //控制时间色块数量
      // let startTime = +new Date();
      // let xStartTime = dateToMs(dateTimeFormatToDate('2019-05-01 00:00:00'))
      // let xEndTime = dateToMs(dateTimeFormatToDate('2019-05-02 00:00:00'))
      // let xInterval = 3600000 * 2
      // let categories = ['OP10', 'OP11', 'OP12'];

      let yAxisName = ''
      let xAxisName = ''
      let xAxisUnit = ''
      let xStartTime = null
      let xEndTime = null
      let xInterval = null
      let categories = null

      yAxisName = configParam.yAxis.name
      xAxisName = configParam.xAxis.name
      xAxisUnit = ' ' + configParam.xAxis.unit
      xStartTime = Number(configParam.xAxis.min)
      xEndTime = Number(configParam.xAxis.max)
      xInterval = Number(configParam.xAxis.interval)
      categories = configParam.yLabelList

      // let types = [
      //     {name: 'JS Heap', color: '#7b9ce1'},
      //     {name: 'Documents', color: '#bd6d6c'},
      //     {name: 'Nodes', color: '#75d874'},
      //     {name: 'Listeners', color: '#e0bc78'},
      //     {name: 'GPU Memory', color: '#dc77dc'},
      //     {name: 'GPU', color: '#72b362'}
      // ];
      // 坐标系中的色块颜色
      // 先从统一的默认颜色中按序收集
      this.colorTypes = []
      // 根据实际需求，从统一的默认颜色集合中取色，并为颜色分配相应的名称，多余的颜色则则不管，若超出，则继续从第一个颜色开始取
      // const needNameArray = ['运行 68%','空闲 25.13%','报警 6.44%','手动调试 1.75%','关机 0%']    //假设这是需求的色块名称
      const needNameArray = configParam.legendNameList
      let colorIndex = 0 // 因为此索引要进行手动控制，所以不用forEach中的，而自定义一个
      const defaultColorCount = defaultColor.length
      needNameArray.forEach(item => {
        if (colorIndex >= defaultColorCount) {
          // 若取色索引超出，则继续归0后，再取色，即继续从第一个开始取色
          colorIndex = 0
        }
        // 取色
        const itemTmp = {
          name: item,
          color: defaultColor[colorIndex] }
        this.colorTypes.push(itemTmp)
        colorIndex++
      })

      // todo: Generate mock data 生成时间色块
      echarts.util.each(categories, (category, index) => {
        configParam.timeSquareSeriesList[index].timeSquareList.forEach(timeSquare => {
          // 色块对象匹配
          let typeItem = null
          this.colorTypes.forEach(colorItem => {
            if (String(colorItem.name) === String(timeSquare.legendNameTo)) {
              typeItem = colorItem
            }
          })
          // 色块配置
          data.push({
            name: typeItem.name,
            value: [
              index, // 索引控制对应 Y 轴的坐标归属位置
              timeSquare.startTime, // 时间色块的起始时间
              timeSquare.endTime, // 时间色块的结束时间
              0 // timeSquare.duration ，暂时不解此值的含义，没找到资料，官方API中也没有对应的解释；原案例代码中使用的是 该时间块的开始时间 到 结束时间 的时间跨度值，但是设置成0也没发现问题
            ],
            itemStyle: {
              normal: {
                color: typeItem.color
              }
            }
          })
        })
        // // 原来的逻辑代码
        // let baseTime = xStartTime;
        // for (let i = 0; i < dataCount; i++) {
        //     let typeItem = this.colorTypes[Math.round(Math.random() * (this.colorTypes.length - 1))];
        //     let duration = Math.round(Math.random() * 1000000);
        //     //时间色块属性配置：样式 和 数值
        //     data.push({
        //         name: typeItem.name,
        //         value: [
        //             index,  // 索引控制对应 Y 轴的坐标归属位置
        //             baseTime,   // 时间色块的起始时间
        //             baseTime += duration,   // 时间色块的结束时间
        //             duration
        //         ],
        //         itemStyle: {
        //             normal: {
        //                 color: typeItem.color
        //             }
        //         }
        //     });
        //     //控制方块之间的间隔距离
        //     baseTime += Math.round(Math.random() * 0);
        // }
      })

      function renderItem(params, api) {
        const categoryIndex = api.value(0)
        const start = api.coord([api.value(1), categoryIndex])
        const end = api.coord([api.value(2), categoryIndex])
        const height = api.size([0, 1])[1] * 0.6

        const rectShape = echarts.graphic.clipRectByRect({
          x: start[0],
          y: start[1] - height / 2,
          width: end[0] - start[0],
          height: height
        }, {
          x: params.coordSys.x,
          y: params.coordSys.y,
          width: params.coordSys.width,
          height: params.coordSys.height
        })

        return rectShape && {
          type: 'rect',
          shape: rectShape,
          style: api.style()
        }
      }
      const chartOption = {
        tooltip: { // 鼠标悬浮显示样式
          formatter: function(params) {
            // 毫秒
            const mss = params.value[3]
            // 显示值
            return params.marker + params.name + ': ' + mss + ' ms'
          }
        },
        dataZoom: [{
          type: 'slider',
          filterMode: 'weakFilter',
          showDataShadow: false,
          top: 400,
          height: 10,
          borderColor: 'transparent',
          backgroundColor: '#e2e2e2',
          handleIcon: 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
          handleSize: 20,
          handleStyle: {
            shadowBlur: 6,
            shadowOffsetX: 1,
            shadowOffsetY: 2,
            shadowColor: '#aaa'
          },
          labelFormatter: ''
        }, {
          type: 'inside',
          filterMode: 'weakFilter'
        }],
        grid: { left: '5%', right: '5%', top: '10%', bottom: '0%', containLabel: true },
        xAxis: {
          name: xAxisName,
          nameLocation: 'start',
          nameTextStyle: {
            padding: [30, 4, 5, 6],
            color: '#fff'
          },
          min: xStartTime,
          max: xEndTime,
          interval: xInterval,
          scale: true,
          axisLabel: {
            show: true,
            formatter: function(val) {
              // 毫秒 换算成 小时
              // let mss = val - startTime
              const mss = val - xStartTime
              const hours = msToHourFixed(mss, 2)
              // 显示换算后的值
              return Math.max(0, hours) + xAxisUnit // + ' ms';
            },
            textStyle: { color: '#fff' },
            interval: 0 // 设置成 0 强制显示所有标签
          },
          splitLine: { // 刻度线
            show: false
          }
        },
        yAxis: {
          name: yAxisName,
          nameLocation: 'end',
          nameTextStyle: {
            padding: [0, 0, -10, 0],
            color: '#fff'
          },
          data: categories,
          axisLabel: { show: true,
            textStyle: { color: '#fff' },
            interval: 0 // 设置成 0 强制显示所有标签
          }
        },
        series: [{
          type: 'custom',
          renderItem: renderItem,
          itemStyle: {
            normal: {
              opacity: 0.8
            }
          },
          encode: {
            x: [1, 2],
            y: 0
          },
          data: data
        }]
      }

      chart.setOption(chartOption)
    },

    // 访问后台请求配置参数
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
          if (response.data.hasOwnProperty('configParam')) {
            this.drawChart(response.data.configParam)
          }

          this.totalPage = response.data.totalPage
          this.curPage = response.data.curPage
          this.nextPage = response.data.nextPage
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang='scss' scoped>
    @import "./css/index.scss";

    $color-hsla:rgba(96,172,252,0.6);

    .m-container{
        display: flex;
        flex-direction: column;
        .chart-legend-list{
            display: flex;
            flex-direction: row;
            justify-content: start;
            .chart-legend{
                display: flex;
                flex-direction: row;
                justify-content: start;
                margin-top: 0.5rem;
                width: auto;
                .chart-legend-color{
                    width: 1.9rem;
                    height: 1.1rem;
                    background-color: adjust_hue(saturate($color-hsla,100%),10%);
                    border-radius: 0.2rem;
                }
                .chart-legend-span{
                    font-size: 0.85rem;
                    color: white;
                    margin-left: 0.5rem;
                    margin-right: 0.5rem;
                }
            }

        }
        .chart{
        }
    }

</style>

<template>
  <div class="container" v-title data-title="设备运行统计">
    <!-- 8vh -->
    <div class="title-wrapper">
      <div class="btn-wrapper">
        <img class="btn-style" src="./assets/logo.png" />
      </div>
      <div class="t-wrapper">
        <p>设备运行统计</p>
      </div>
      <div class="time-wrapper">
        <!-- <current-time class="time-style"></current-time> -->
        <div class="time-container time-style">{{ actualDate }}</div>
      </div>
    </div>
    <!-- 0.2vh -->
    <div class="line-wrapper">
      <img src="./assets/left.png" />
      <img src="./assets/right.png" />
    </div>
    <!-- 90vh -->
    <div class="card-wrapper">
      <div class="upgrid" style="height: 43vh">
        <div class="chart-wrapper">
          <div class="chart-title">
            <div>
              <img src="./assets/titleicon.png" />
              <!-- 五轴加工中心 -->
              <span>设备使用率</span>
              <span style="margin-left: 20px;">{{ containerName1 }}</span>
            </div>
          </div>
          <div class="chart-item" id="pie-container"></div>
        </div>
        <div class="chart-wrapper">
          <div class="chart-title">
            <div>
              <img src="./assets/titleicon.png" />
              <!-- 数字车床 -->
              <span>设备使用率</span>
              <span style="margin-left: 20px;">{{ containerName2 }}</span>
            </div>
          </div>
          <div class="chart-item" id="pie-container-num"></div>
        </div>
        <div class="chart-wrapper">
          <div class="chart-title">
            <img src="./assets/titleicon.png" />
            <span>设备运行分析</span>
          </div>
          <div class="chart-item" id="slice-container"></div>
        </div>
      </div>
      <div class="downgrid" style="height: 43vh">
        <div class="chart-wrapper">
          <div class="chart-title">
            <img src="./assets/titleicon.png" />
            <!-- 五轴加工中心 -->
            <span>设备运行统计</span>
            <span style="margin-left: 20px;">{{ containerName3 }}</span>
          </div>
          <div class="chart-item" id="stack-container"></div>
        </div>
        <div class="chart-wrapper">
          <div class="chart-title">
            <img src="./assets/titleicon.png" />
            <!-- 数字机车床-->
            <span>设备运行统计</span>
            <span style="margin-left: 20px;">{{ containerName4 }}</span>
          </div>
          <div class="chart-item" id="stack-container-num"></div>
        </div>
        <div
          class="chart-wrapper"
          style="padding-top: 1px; padding-left: 1px; padding-right: 1px; overflow: hidden"
        >
          <a-table
            size="middle"
            :columns="table.column"
            :data-source="table.data"
            rowKey="containerNumber"
            :pagination="false"
          ></a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import currentTime from '@/components/time/index.vue'
import moment from 'moment'
const echarts = require('echarts')
export default defineComponent({
  components: {
    currentTime,
  },
  data() {
    return {
      host: '',
      containerName1: '',
      containerName2: '',
      containerName3: '',
      containerName4: '',
      actualDate: '',
      orgId: '',
      sliceChart: {
        currentPage: 1,
        pageSize: 5,
        total: 0,
        maxPage: 0,
        requestFinished: false,
        refreshTime: 10000,
      },
      pieChart: {
        interval: 1000 * 30,
      },
      //数字车床饼状图
      pieChartNum: {
        interVal: 1000 * 30,
      },
      stackChart: {
        interval: 1000 * 30,
      },
      //数字车床柱状图
      stackChartNum: {
        interval: 1000 * 30,
      },
      table: {
        column: [
          {
            title: '设备',
            dataIndex: 'containerName',
            align: 'center',
            ellipsis: true,
            width: 200,
          },
          {
            title: '当日利用率',
            dataIndex: 'today',
            align: 'center',
            ellipsis: true,
            width: 100,
          },
          {
            title: '本周利用率',
            dataIndex: 'week',
            align: 'center',
            ellipsis: true,
            width: 100,
          },
          {
            title: '本月利用率',
            dataIndex: 'month',
            align: 'center',
            ellipsis: true,
            width: 100,
          },
        ],
        data: [],
        currentPage: 1,
        pageSize: 8,
        total: 0,
        maxPage: 0,
        requestFinished: false,
        refreshTime: 10000,
      },
    }
  },
  async mounted() {
    const query: any = this.$route.query
    // 默认请求地址和orgId
    this.orgId = query.orgId ?? 54
    this.host = query.url ?? 'https://apitest.idcloud.group'

    this.fetchPieData() //设备使用率(上一)
    this.fetchPieDataNum() //设备使用率(上二)
    this.fetchStacknBarData() //设备运行统计(下一,二)
    this.fetchSliceData() //设备运行分析(上三)
    this.fetchTableData() //表格  (下三)
  },
  watch: {
    'sliceChart.requestFinished'(n) {
      if (n) {
        this.timeoutRequestSliceData()
      }
    },
    'table.requestFinished'(n) {
      if (n) {
        this.timeoutRequestTableData()
      }
    },
  },
  methods: {
    //设备运行统计(下一,二)
    async fetchStacknBarData() {
      //设备运行统计(下一)
      const url = `${this.host}/idcloud/dashboard/deviceRunning/getWorkShopDeviceRunningByTime?orgId=${this.orgId}&id=1185`
      //设备运行统计(下二)
      const url2 = `${this.host}/idcloud/dashboard/deviceRunning/getWorkShopDeviceRunningByTime?orgId=${this.orgId}&id=1186`
      const res = await this.fetchFunc(url)
      const res2 = await this.fetchFunc(url2)
      this.containerName3 = res.data.containerName
      this.containerName4 = res2.data.containerName
      this.drawStackChart(res.data.list, res2.data.list)
      setInterval(async () => {
        const res = await this.fetchFunc(url)
        const res2 = await this.fetchFunc(url2)
        this.drawStackChart(res.data.list, res2.data.list)
      }, 1000 * 30)
    },
    //设备使用率(上一)
    async fetchPieData() {
      const url = `${this.host}/idcloud/dashboard/deviceRunning/getWorkShopDeviceStatusRatio?orgId=${this.orgId}&type=shop&id=1185`
      const res = await this.fetchFunc(url)
      this.drawPieChart(res.data)
      this.containerName1 = res.data.containerName
      this.actualDate = res.data.time.substring(0, 10) || '2021-08-03'
      setInterval(async () => {
        const res = await this.fetchFunc(url)
        this.drawPieChart(res.data)
      }, 1000 * 30)
    },
    //设备使用率(上二)
    async fetchPieDataNum() {
      const url = `${this.host}/idcloud/dashboard/deviceRunning/getWorkShopDeviceStatusRatio?orgId=${this.orgId}&type=shop&id=1186`
      const res = await this.fetchFunc(url)
      this.drawPieCharNum(res.data)
      this.containerName2 = res.data.containerName
      setInterval(async () => {
        const res = await this.fetchFunc(url)
        this.drawPieCharNum(res.data)
      }, 1000 * 30)
    },
    //表格  (下三)
    async fetchTableData() {
      const url = `${this.host}/idcloud/dashboard/standard/getEquipmentUtilization?orgId=${this.orgId}&current_page=${this.table.currentPage}&page_size=${this.table.pageSize}`

      this.table.requestFinished = false
      const res = await this.fetchFunc(url)
      this.table.requestFinished = true
      this.table.total = res.data.total
      this.table.maxPage = res.data.pages
      res.data.records.forEach((i: { today: any; week: any; month: any }) => {
        i.today = i.today.toFixed(0) + '%'
        i.week = i.week.toFixed(0) + '%'
        i.month = i.month.toFixed(0) + '%'
      })
      this.table.data = res.data.records
    },

    //设备运行分析(上三)
    // 0：离线 1：运行 2：待料 3：空转 4：故障
    async fetchSliceData() {
      const types = [
        { val: 0, name: '离线', color: '#B0B0B0' },
        { val: 1, name: '运行', color: '#6BC855' },
        { val: 2, name: '空闲', color: '#2F7FE3' },
        { val: 3, name: '空转', color: '#FAA819' },
        { val: 4, name: '故障', color: '#F9605A' },
      ]
      const url = `${this.host}/idcloud/dashboard/standard/getEquipmentRateSlice?orgId=${this.orgId}&current_page=${this.sliceChart.currentPage}&page_size=${this.sliceChart.pageSize}`
      this.sliceChart.requestFinished = false
      const res = await this.fetchFunc(url)
      this.sliceChart.requestFinished = true
      this.sliceChart.total = res.data.total
      this.sliceChart.maxPage = res.data.pages
      let startTime = 0
      let categories: any[] = []
      let data: {
        name: any
        value: any
        itemStyle: { color: any }
      }[] = []
      res.data.records.forEach(
        (
          i: {
            deviceName: any
            list: { status: string | number; duration: any }[]
          },
          index: any
        ) => {
          let baseTime = startTime
          i ? categories.push(i.deviceName) : ''
          i
            ? i.list.forEach(
                (k: { status: string | number; duration: any }) => {
                  let duration = k.duration
                  data.push({
                    name: types[k.status].name,
                    value: [index, baseTime, (baseTime += duration), duration],
                    itemStyle: {
                      color: types[k.status].color,
                    },
                  })
                }
              )
            : null
        }
      )

      this.drawSliceChart(categories, data)
    },
    //设备运行分析(上三)
    async drawSliceChart(
      categories: any[],
      data: { name: any; value: any; itemStyle: { color: any } }[]
    ) {
      const sliceChart = echarts.init(
        document.getElementById('slice-container')!
      )
      let dataCount = 12
      let startTime = 0
      const types = [
        { name: '离线', color: '#B0B0B0' },
        { name: '运行', color: '#6BC855' },
        { name: '空闲', color: '#2F7FE3' },
        { name: '空转', color: '#FAA819' },
        { name: '故障', color: '#F9605A' },
      ]

      function renderItem(
        params: { coordSys: { x: any; y: any; width: any; height: any } },
        api: {
          value: (arg0: number) => any
          coord: (arg0: any[]) => any
          size: (arg0: number[]) => number[]
          style: () => any
        }
      ) {
        let categoryIndex = api.value(0)
        let start = api.coord([api.value(1), categoryIndex])
        let end = api.coord([api.value(2), categoryIndex])
        let height = api.size([0, 1])[1] * 0.6

        let rectShape = echarts.graphic.clipRectByRect(
          {
            x: start[0],
            y: start[1] - height / 2,
            width: end[0] - start[0],
            height: height,
          },
          {
            x: params.coordSys.x,
            y: params.coordSys.y,
            width: params.coordSys.width,
            height: params.coordSys.height,
          }
        )

        return (
          rectShape && {
            type: 'rect',
            transition: ['shape'],
            shape: rectShape,
            style: api.style(),
          }
        )
      }

      sliceChart.setOption({
        tooltip: {
          formatter: function(params: any) {
            return (
              params.marker + params.name + ': ' + params.value[3] + ' 分钟'
            )
          },
        },
        grid: {
          left: 100,
          right: 30,
          bottom: 35,
          height: 330,
        },
        xAxis: {
          show: true,
          min: 0,
          max: 1440,
          scale: false,
          axisLabel: {
            formatter: function(val: any) {
              return Math.max(0, val / 60) + ':00'
            },
          },
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
        },
        yAxis: {
          show: true,
          data: categories,
          // align: 'left',
          // verticalAlign: 'left',

          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },

          axisLabel: {
            align: 'right',
            // verticalAlign: 'left',
            lineHeight: 16,
            formatter: function(value: any) {
              const len = value.length
              const itemLen = 8
              if (len <= itemLen) return value
              const cnt = Math.ceil(len / itemLen)
              const strArr = []

              for (let i = 0; i < cnt; i++) {
                strArr.push(value.substring(i * itemLen, (i + 1) * itemLen))
              }
              return strArr.join('\n')
            },
            // formatter: function(val: any) {
            //   if (val.length > 9) {
            //     return val.substring(0, 9) + '...';
            //   }
            //   return val;
            // },
          },
        },
        series: [
          {
            type: 'custom',
            renderItem: renderItem,
            itemStyle: {
              opacity: 0.8,
            },
            encode: {
              x: [1, 2],
              y: 0,
            },
            data: data,
          },
        ],
      })
    },

    //设备使用率(上一)
    drawPieChart(data: any) {
      const pieChart = echarts.init(document.getElementById('pie-container')!)

      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%',
        },
        legend: {
          left: 'center',
          bottom: '10%',
          itemGap: 36,
          textStyle: {
            color: '#fff',
            fontSize: 14,
          },
        },
        series: [
          {
            name: '设备使用率',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              color: '#fff',
              formatter: '{b}: {c}%',
              fontSize: 14,
            },
            bottom: '20%',
            emphasis: {
              label: {
                show: true,
                fontSize: '24',
                color: '#fff',
              },
            },
            labelLine: {
              show: true,
              showAbove: true,
            },
            color: ['#B0B0B0', '#6BC855', '#2F7FE3', '#FAA819', '#F9605A'],
            data: [],
          },
        ],
      }
      option.series[0].data = data.statistics.map((item: any) => {
        return {
          value: item.percentage * 100,
          name: item.label,
        }
      })
      pieChart.setOption(option)
    },
    //设备使用率(上二)
    drawPieCharNum(data: any) {
      const pieChartNum = echarts.init(
        document.getElementById('pie-container-num')!
      )
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c}%',
        },
        legend: {
          left: 'center',
          bottom: '10%',
          itemGap: 36,
          textStyle: {
            color: '#fff',
            fontSize: 14,
          },
        },
        series: [
          {
            name: '设备使用率',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: true,
            label: {
              show: true,
              position: 'outside',
              color: '#fff',
              formatter: '{b}: {c}%',
              fontSize: 14,
            },
            bottom: '20%',
            emphasis: {
              label: {
                show: true,
                fontSize: '24',
                color: '#fff',
              },
            },
            labelLine: {
              show: true,
              showAbove: true,
            },
            color: ['#B0B0B0', '#6BC855', '#2F7FE3', '#FAA819', '#F9605A'],
            data: [],
          },
        ],
      }
      option.series[0].data = data.statistics.map((item: any) => {
        return {
          value: item.percentage * 100,
          name: item.label,
        }
      })
      pieChartNum.setOption(option)
    },

    //设备运行统计(下一,二)
    drawStackChart(data: any, data2: any) {
      const categories = ['离线', '运行', '空闲', '空转', '故障']
      let xD: string[] = []
      let dD: any[][] = []
      let xD2: string[] = []
      let dD2: any[][] = []
      categories.forEach((i) => {
        dD.push([])
      })
      categories.forEach((i) => {
        dD2.push([])
      })
      // debugger
      data.forEach((i: any) => {
        xD.push(moment(i.day).format('MM-DD'))
        dD[0].push(i.runningProportion.toFixed(0))
        dD[1].push(i.errorProportion.toFixed(0))
        dD[2].push(i.waitingProportion.toFixed(0))
        dD[3].push(i.adjustProportion.toFixed(0))
        dD[4].push(i.offlineProportion.toFixed(0))
      })

      data2.forEach((i: any) => {
        xD2.push(moment(i.day).format('MM-DD'))
        dD2[0].push(i.runningProportion.toFixed(0))
        dD2[1].push(i.errorProportion.toFixed(0))
        dD2[2].push(i.waitingProportion.toFixed(0))
        dD2[3].push(i.adjustProportion.toFixed(0))
        dD2[4].push(i.offlineProportion.toFixed(0))
      })

      const stackChart = echarts.init(
        document.getElementById('stack-container')!
      )
      const stackChartNum = echarts.init(
        document.getElementById('stack-container-num')!
      )
      //五轴加工中心柱状图设置
      stackChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          textStyle: {
            color: '#fff',
            fontSize: 14,
          },
          data: categories,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          max: 100,
          min: 0,
          // axisLabel: {
          //   formatter: "{value}%",
          // },
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
        },
        xAxis: {
          type: 'category',
          data: xD,
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
        },
        series: [
          {
            name: '运行',
            type: 'bar',
            stack: 'total',
            color: '#6BC855',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD[0],
          },
          {
            name: '故障',
            type: 'bar',
            stack: 'total',
            color: '#F9605A',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD[1],
          },

          {
            name: '空闲',
            type: 'bar',
            stack: 'total',
            color: '#2F7FE3',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD[2],
          },
          {
            name: '空转',
            type: 'bar',
            stack: 'total',
            color: '#FAA819',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD[3],
          },
          {
            name: '离线',
            type: 'bar',
            stack: 'total',
            color: '#B0B0B0',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD[4],
          },
        ],
      })
      //数字机车床柱状图配置
      stackChartNum.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          textStyle: {
            color: '#fff',
            fontSize: 14,
          },
          data: categories,
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'value',
          max: 100,
          min: 0,
          // axisLabel: {
          //   formatter: "{value}%",
          // },
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
        },
        xAxis: {
          type: 'category',
          data: xD2,
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
        },
        series: [
          {
            name: '运行',
            type: 'bar',
            stack: 'total',
            color: '#6BC855',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD2[0],
          },
          {
            name: '故障',
            type: 'bar',
            stack: 'total',
            color: '#F9605A',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD2[1],
          },

          {
            name: '空闲',
            type: 'bar',
            stack: 'total',
            color: '#2F7FE3',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD2[2],
          },
          {
            name: '空转',
            type: 'bar',
            stack: 'total',
            color: '#FAA819',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD2[3],
          },
          {
            name: '离线',
            type: 'bar',
            stack: 'total',
            color: '#B0B0B0',
            label: {
              show: true,
              formatter: '{c}%',
            },
            emphasis: {
              focus: 'series',
            },
            data: dD2[4],
          },
        ],
      })
    },

    timeoutRequestSliceData() {
      setTimeout(async () => {
        this.sliceChart.currentPage =
          this.sliceChart.currentPage >= this.sliceChart.maxPage
            ? 1
            : this.sliceChart.currentPage + 1
        this.fetchSliceData()
      }, this.sliceChart.refreshTime)
    },
    timeoutRequestTableData() {
      setTimeout(async () => {
        this.table.currentPage =
          this.table.currentPage >= this.table.maxPage
            ? 1
            : this.table.currentPage + 1
        this.fetchTableData()
      }, this.table.refreshTime)
    },

    async fetchFunc(url: RequestInfo) {
      try {
        const resp = await fetch(url)
        const res = await resp.json()
        return res
      } catch (e) {
        // console.log(e)
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.time-container {
  color: #b0d5ff;
  font-size: 24px;
  font-family: MicrosoftYaHei;
}
::v-deep(.ant-table) {
  background: transparent;
  color: #6a9fd0;
  // color: '#ffffff';
}

::v-deep(.ant-table-thead > tr > th) {
  background: transparent;
  color: #6a9fd0;
  border-bottom: 1px solid #4f98e9;
  border-top: 1px solid #4f98e9;
  color: #ffffff;
}

::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
  border-left: 1px solid #4f98e9;
}

::v-deep(.ant-table-thead > tr > th:last-child) {
  border-right: 1px solid #4f98e9;
}

::v-deep(.ant-table-thead) {
  background: #1a2562;
}

::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
  background: #172455;
}
::v-deep(.ant-table-tbody > tr:nth-of-type(odd)) {
  background: #1c2958;
}

::v-deep(.ant-table-tbody > tr > td) {
  border: 0;
}

::v-deep(.ant-table-tbody
    > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
  > td {
  background: #27327c;
}

::v-deep(.ant-table-placeholder) {
  background: transparent;
  border: 0;
}

::v-deep(.ant-empty-description) {
  color: #ffffff;
}
::-webkit-scrollbar {
  background-color: lightgray;
  width: 0;
  height: 0;
  background-clip: padding-box;
}
.container {
  overflow-y: hidden;
  width: 100vw;
  height: 100vh;
  background-color: #b0d5ff;
  background-image: url('./assets/background.png');
  background-size: 100% 100%;
  //   background-repeat: repeat;
  .title-wrapper {
    display: flex;
    height: 8vh;
    .time-wrapper {
      width: 33%;
      text-align: right;
      .time-style {
        margin-top: 2vh;
        margin-right: 2.25vw;
      }
    }

    .t-wrapper {
      width: 34%;
      height: 8vh;
      background-image: url('./assets/title.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
      color: #fff;

      span {
        margin-top: 1vh;
        margin-left: 1vw;
        font-size: 32px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
      }
      p {
        font-size: 32px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        line-height: 70px;
        letter-spacing: 1px;
      }
    }

    .btn-wrapper {
      img {
        width: 6vh;
        height: 5vh;
        margin-top: 1vh;
      }
      height: 8vh;
      color: #b0d5ff;
      font-size: 24px;
      font-family: MicrosoftYaHei;
      text-align: left;
      width: 33%;
      .btn-style {
        margin-top: 1vh;
        margin-left: 1.75vw;
      }
    }
  }

  .line-wrapper {
    height: 0.1vh;
    display: flex;
    justify-content: space-between;
    img {
      height: 0.2vh;
    }
    margin-bottom: 3.8vh;
  }

  .card-wrapper {
    display: grid;
    grid-template-rows: 1fr 1fr;
    .chart-wrapper {
      width: 100%;
      height: 100%;
      padding-top: 3%;
      background-image: url('./assets/bgi.png');
      background-size: 100% 100%;
    }
    .chart-title {
      padding: 0 20px;
      width: 100%;
      height: 10%;
      line-height: 43px;
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #c4f9ff;
      img {
        height: 23px;
        width: 12px;
        margin-right: 8px;
      }
    }
    .chart-item {
      width: 100%;
      height: 90%;
    }
    .upgrid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 30px;
      padding: 0 30px 15px 30px;
    }
    .downgrid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      column-gap: 30px;
      margin-top: 10px;
      padding: 0px 30px 15px 30px;
    }
  }
}
</style>

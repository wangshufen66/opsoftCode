<template>
  <div class="container" v-title data-title="设备运行统计">
    <!-- 8vh -->
    <div class="title-wrapper">
      <div class="btn-wrapper">
        <img class="btn-style" src="./assets/logo.png" />
      </div>
      <div class="t-wrapper">
        <p>设备实时监控</p>
      </div>
      <div class="time-wrapper">
        <current-time class="time-style"></current-time>
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
        <div class="chart-wrapper first-wrapper" style="display:flex;justify-content: space-evenly;">
          <div style="width:450px;">
            <!-- <img :src="devicepara.imgUrl" /> -->
            <img src="https://fs.idcloud.group/group1/M00/00/17/rBBadWDUT_mAZ9QTAAJUESUkxJM864.png" width="450" height="250" />
          </div>
          <div class="device-equip">
            <div>设备:{{devicepara.deviceName}}</div>
            <div>运行状态: <span id="statusDisplay">{{devicepara.status}}</span> </div>
            <div>产量:{{devicepara.Counter}}</div>
            <div>用电量:{{devicepara.EPC}}kW·h</div>
          </div>
        </div>

        <div class="chart-wrapper">
          <div class="chart-title">
            <div>
              <img src="./assets/titleicon.png" />
              <span>设备使用率</span>
            </div>
          </div>
          <div class="chart-item" id="pie-container"></div>
        </div>

      </div>
      <div class="downgrid" style="height: 43vh">

        <div class="chart-wrapper">
          <div class="chart-title">
            <img src="./assets/titleicon.png" />
            <span>设备产量统计</span>
          </div>
          <div class="chart-item" id="slice-container"></div>
        </div>
        <div class="chart-wrapper">
          <div class="chart-title">
            <img src="./assets/titleicon.png" />
            <span>设备运行统计</span>
          </div>
          <div class="chart-item" id="stack-container"></div>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import currentTime from '@/components/time/index.vue';
import moment from 'moment';
const echarts = require('echarts');
export default defineComponent({
  components: {
    currentTime,
  },
  data() {
    return {
      host: '',
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
      stackChart: {
        interval: 1000 * 30,
      },
      table: {
        column: [
          {
            title: '设备',
            dataIndex: 'containerName',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '当日利用率',
            dataIndex: 'today',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '本周利用率',
            dataIndex: 'week',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '本月利用率',
            dataIndex: 'month',
            align: 'center',
            ellipsis: true,
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
      devicepara: {
        deviceName: '',
        status: '',
        Counter: '', //产量
        EPC: '', //用电量
        imgUrl: '',
      },
      //设备状态饼状图
      deviceLeftOptions: {
        title: {
          text: '',
          left: '5%',
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : ({d}%)',
        },
        xAxis: { show: false },
        yAxis: { show: false },
        legend: {
          orient: 'vertical',
          right: '5%',
          bottom: '5%',
          data: ['故障状态', '运行状态', '离线状态', '调机状态', '待机状态'],
          textStyle: { color: '#fff' },
        },
        color: [
          '#e27e60',
          '#80dcaf',
          '#aaaaaa',
          '#f3c709',
          '#759dfd',
          '#E6FCE0',
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '65%',
            center: ['40%', '50%'],
            label: {
              show: true,
              formatter: '{b}{d}%',
              color: '#fff',
            },
            labelLine: {
              lineStyle: {
                color: '#fff',
              },
            },
            data: [
              { value: 0, name: '故障状态' },
              { value: 0, name: '运行状态' },
              { value: 0, name: '离线状态' },
              { value: 0, name: '调机状态' },
              { value: 0, name: '待机状态' },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      },
      status: {
        0: { name: '离线状态', color: '#B0B0B0' },
        1: { name: '运行状态', color: '#6BC855' },
        2: { name: '待机状态', color: '#2F7FE3' },
        3: { name: '调机状态', color: '#FAA819' },
        4: { name: '故障状态', color: '#F9605A' },
      },
    };
  },
  async mounted() {
    const query: any = this.$route.query;
    // 默认请求地址和orgId
    this.orgId = query.orgId ?? 54;
    this.host = query.url ?? 'https://apitest.idcloud.group';

    this.fetchPieData();
    this.fetchSliceData();
    this.fetchStacknBarData();
    this.fetchMachine();
  },
  watch: {
    'sliceChart.requestFinished'(n) {
      if (n) {
        this.timeoutRequestSliceData();
      }
    },
  },
  methods: {
    // 查看设备信息
    async fetchMachine() {
      // const url = `http://192.168.0.167:7060/idcloud/dashboard/DeviceInfo/getById?containerId=2412`;
      const url = `https://api.idcloud.group/idcloud/dashboard/DeviceInfo/getById?containerId=2412`;
      const res = await this.fetchFunc(url);
      this.handleMachineInfo(res);
      setInterval(async () => {
        const res = await this.fetchFunc(url);
        this.handleMachineInfo(res);
      }, 2 * 1000);
    },
    handleMachineInfo(res: any) {
      this.devicepara.deviceName = res.data.deviceName || '注塑机';
      let ele = document.getElementById('statusDisplay');
      switch (res.data.pointList[3].pointValue) {
        case 0:
          this.devicepara.status = '离线';

          if (ele) {
            ele.style.background = '#B0B0B0';
          }
          break;
        case 1:
          this.devicepara.status = '运行';
          if (ele) {
            ele.style.background = '#6BC855';
          }
          break;

        case 2:
          this.devicepara.status = '待机';
          if (ele) {
            ele.style.background = '#2F7FE3';
          }
          break;
        case 3:
          this.devicepara.status = '调机';
          if (ele) {
            ele.style.background = '#2F7FE3';
          }
          break;
        case 4:
          this.devicepara.status = '故障';
          if (ele) {
            ele.style.background = '#F9605A';
          }
          break;
        default:
          this.devicepara.status = '运行';
          if (ele) {
            ele.style.background = '#6bc855';
          }
          break;
      }
      this.devicepara.EPC = res.data.pointList[5].pointValue;
      this.devicepara.Counter = res.data.pointList[6].pointValue;
    },

    //设备运行统计
    async fetchStacknBarData() {
      const url = `${this.host}/idcloud/dashboard/standard/getEquipmentRunningDay?orgId=${this.orgId}`;
      const res = await this.fetchFunc(url);
      this.drawStackChart(res.data);
      setInterval(async () => {
        const res = await this.fetchFunc(url);
        this.drawStackChart(res.data);
      }, this.stackChart.interval);
    },
    //设备运行统计
    drawStackChart(data: Array<any>) {
      data.reverse();
      const categories = ['离线', '运行', '待机', '调机', '故障'];
      let xD: string[] = [];
      let dD: any[][] = [];
      categories.forEach((i) => {
        dD.push([]);
      });
      data.forEach((i) => {
        xD.push(moment(i.processDate).format('MM-DD'));
        dD[0].push(i.runningProportion.toFixed(0));
        dD[1].push(i.errorProportion.toFixed(0));
        dD[2].push(i.waitingProportion.toFixed(0));
        dD[3].push(i.adjustProportion.toFixed(0));
        dD[4].push(i.offlineProportion.toFixed(0));
      });

      const stackChart = echarts.init(
        document.getElementById('stack-container')!
      );

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
            name: '待机',
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
            name: '调机',
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
      });
    },
    //设备使用率
    async fetchPieData() {
      // debugger;
      const tomorrowNow = new Date(Date.now());
      const tomorrow = tomorrowNow.setDate(tomorrowNow.getDate() + 1);
      const now = new Date(Date.now());
      let startTime = moment(now).format('YYYY-MM-DD 00:00:00');
      let endTime = moment(tomorrow).format('YYYY-MM-DD 00:00:00');
      // const url = `${this.host}/idcloud/dashboard/standard/getEquipmentRunning?orgId=${this.orgId}`;
      const url = `https://api.idcloud.group/idcloud/dashboard/DeviceInfo/useRate?orgId=63&id=2412&startTime=${startTime}&endTime=${endTime}`;
      // const url = `https://api.idcloud.group/idcloud/dashboard/DeviceInfo/useRate?orgId=63&id=2412&startTime=2021-06-24+00:00:00&endTime=2021-06-25+00:00:00`;

      const res = await this.fetchFunc(url);
      this.drawPieChart(res.data);
      setInterval(async () => {
        const res = await this.fetchFunc(url);
        this.drawPieChart(res.data);
      }, this.pieChart.interval);
    },
    //设备使用率
    drawPieChart(data: any) {
      const pieChart = echarts.init(document.getElementById('pie-container')!);
      this.deviceLeftOptions.legend.data = [
        '故障状态',
        '运行状态',
        '离线状态',
        '调机状态',
        '待机状态',
      ];
      this.deviceLeftOptions.series[0].data = [
        { value: 0, name: '故障状态' },
        { value: 0, name: '运行状态' },
        { value: 0, name: '离线状态' },
        { value: 0, name: '调机状态' },
        { value: 0, name: '待机状态' },
      ];

      //  status: {
      //   0: { name: '离线状态', color: '#B0B0B0' },
      //   1: { name: '运行状态', color: '#6BC855' },
      //   2: { name: '待机状态', color: '#2F7FE3' },
      //   3: { name: '调机状态', color: '#FAA819' },
      //   4: { name: '故障状态', color: '#F9605A' },
      // },
      data.forEach((rItem: any) => {
        const dIndex = this.deviceLeftOptions.series[0].data.findIndex(
          (dItem) => dItem.name.startsWith(this.status[rItem.name].name)
        );
        if (dIndex >= 0)
          this.deviceLeftOptions.series[0].data[dIndex].value = rItem.percent;
      });
      pieChart.setOption(this.deviceLeftOptions);
      // data.forEach(element => {
      //   switch (element.name) {
      //     case 0:
      //       element.name='故障'
      //       break;
      //     case 0:
      //       element.name='运行'
      //       break;
      //     case 0:
      //       element.name='离线'
      //       break;
      //     case 0:
      //       element.name='调试'
      //       break;
      //     case 0:
      //       element.name='待机'
      //       break;

      //     default:
      //       break;
      //   }

      // });
    },
    //设备产量统计
    // 0：离线 1：运行 2：待料 3：调机 4：故障
    async fetchSliceData() {
      // const url = `${this.host}/idcloud/dashboard/standard/getEquipmentRateSlice?orgId=${this.orgId}&current_page=${this.sliceChart.currentPage}&page_size=${this.sliceChart.pageSize}`;
      const url = `https://api.idcloud.group/idcloud/dashboard/DeviceInfo/produceNumStatics?id=2412`;
      this.sliceChart.requestFinished = false;
      const res = await this.fetchFunc(url);

      this.drawSliceChart(res);
      setInterval(async () => {
        const res = await this.fetchFunc(url);
        this.drawSliceChart(res);
      }, 10 * 1000);
    },
    //设备产量统计
    drawSliceChart(data: any) {
      let option1 = {
        xAxis: {
          type: 'category',
          data: [] as any,
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
          axisLabel: {
            interval: 0, //代表显示所有x轴标签显示
            // rotate: 45, //代表逆时针旋转45度
            textStyle: {
              color: '#fff',
              fontSize: '10',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff',
              width: 1,
            },
          },
        },
        series: [
          {
            data: [] as any,
            type: 'bar',
            itemStyle: {
              normal: {
                label: {
                  show: true, //开启显示
                  position: 'top', //在上方显示
                  textStyle: {
                    //数值样式
                    color: '#fff',
                    fontSize: 16,
                  },
                },
              },
            },
          },
        ],
      };
      const sliceChart = echarts.init(
        document.getElementById('slice-container')!
      );
      data.data.produceNumWithTimeInterval.forEach((item: any) => {
        option1.xAxis.data.push(item.timeLabel);
        option1.series[0].data.push(item.produceNum);
      });

      sliceChart.setOption(option1);
    },

    timeoutRequestSliceData() {
      setTimeout(async () => {
        this.sliceChart.currentPage =
          this.sliceChart.currentPage >= this.sliceChart.maxPage
            ? 1
            : this.sliceChart.currentPage + 1;
        this.fetchSliceData();
      }, this.sliceChart.refreshTime);
    },

    async fetchFunc(url: RequestInfo) {
      try {
        const resp = await fetch(url);
        const res = await resp.json();
        return res;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.first-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.device-equip {
  color: rgb(255, 255, 255);
  // width: 300px;
  box-shadow: 0px 2px 15px 0px rgb(154 172 198);
  height: 250px;
  display: flex;
  flex-direction: column;
  /* align-items: self-start; */
  justify-content: center;
  font-size: 20px;
  padding: 60px;
  border-radius: 10px;
  div {
    line-height: 50px;
    letter-spacing: 2px;
  }
  span {
    color: #fff;
    background-color: #6bc855;
    padding: 3px 20px;
    border-radius: 5px;
    font-size: 17px;
  }
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
      grid-template-columns: repeat(2, 1fr);
      column-gap: 30px;
      padding: 0 30px 15px 30px;
    }
    .downgrid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      column-gap: 30px;
      padding: 15px 30px 0 30px;
    }
  }
}
</style>

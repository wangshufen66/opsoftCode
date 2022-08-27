<template>
  <div class="device-container">
    <div class="infopoint-up-wrapper">
      <div class="up-title-wrapper">
        <span>{{ treeData.ctrName }}</span>
        <div class="head-date-select">
          <div
            @click="handleClickRefresh"
            style="
              height: 34px;
              line-height: 34px;
              margin-right: 1rem;
              cursor: pointer;
              font-size: 14px;
            "
          >
            <i class="el-icon-refresh-right">刷新</i>
          </div>
          <div
            v-show="treeData.ctrName !== '运行状态'"
            ref="today"
            @click="handleClickToday"
            style="color: #266deb"
            class="date-select-ele"
          >
            今日
          </div>
          <div
            v-show="treeData.ctrName !== '运行状态'"
            ref="week"
            @click="handleClickWeek"
            class="date-select-ele"
          >
            本周
          </div>
          <div
            v-show="treeData.ctrName !== '运行状态'"
            ref="month"
            @click="handleClickMonth"
            class="date-select-ele"
          >
            本月
          </div>
          <el-date-picker
            v-show="treeData.ctrName !== '运行状态'"
            size="small"
            :picker-options="search.pickerOptions"
            style="width: 400px; margin: 0 0.5rem 0 0.2rem"
            v-model="search.input"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
          <!--<el-date-picker-->
          <!--v-show="treeData.ctrName==='运行状态'"-->
          <!--size="small"-->
          <!--:picker-options="search.pickerOptions"-->
          <!--style="width: 400px; margin: 0 0.5rem 0 0.2rem"-->
          <!--v-model="search.dateInput"-->
          <!--type="datetimerange"-->
          <!--value-format="yyyy-MM-dd HH:mm:ss"-->
          <!--&gt;</el-date-picker>-->
          <el-date-picker
            popper-class="special-el-date-picker"
            v-show="treeData.ctrName === '运行状态'"
            size="small"
            :picker-options="search.pickerOptions"
            style="width: 400px; margin: 0 0.5rem 0 0.2rem"
            v-model="search.dateInput"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </div>
      </div>
      <div
        v-if="treeData.ctrName === '运行状态'"
        class="chart-style-status"
        ref="statusChart"
      ></div>
      <div v-else class="chart-style" ref="chart"></div>
      <div
        v-show="treeData.ctrName === '运行状态'"
        style="
          height: 20px;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
        "
      >
        <div
          class="percent-card"
          v-for="(item, index) in statusChartLegend"
          :key="index"
        >
          <span
            style="
              height: 15px;
              width: 15px;
              display: inline-block;
              margin-right: 6px;
            "
            :style="{ backgroundColor: item.color }"
          >
          </span>
          <span
            style="
              height: 19px;
              display: inline-block;
              color: gray;
              font-size: 13px;
              vertical-align: 3px;
            "
          >
            {{ item.name }} {{ item.percent }}
          </span>
        </div>
      </div>
    </div>
    <div class="title-wrapper">
      <span>数据列表</span>
    </div>
    <div style="margin-top: 22px" class="infopoint-down-wrapper">
      <el-table
        v-loading="downCard.loading"
        height="40vh"
        :data="downCard.tableDataForShow"
        :header-cell-style="setTableRowStyle"
        border
      >
        <!--<el-table-column align="center" type="index" width="45"></el-table-column>-->

        <el-table-column
          v-for="item in downCard.tableColumn"
          :key="item.id"
          :prop="item.key"
          :label="item.title"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import apiMixin from "../apiMixins";
import topCard from "../components/topCard";
import downCard from "../components/downCard";
import deviceCard from "../components/deviceCard";
import moment from "moment";
import echarts from "echarts";
import { getEquipmentRateSlice } from "@/api/device-watch/device";
import deviceStatusMixins from "@/mixins/deviceStatusMixins";

export default {
  name: "deviceComp",
  mixins: [apiMixin, deviceStatusMixins],
  components: { topCard, downCard, deviceCard },
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
      }
    },
    treeNode: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      orgId: this.$store.state.user.userInfo.orgId,
      page: {
        current: 1,
        total: 0,
        size: 8
      },
      downCard: {
        loading: false,
        data: {},
        dataForShow: [],
        tableData: [],
        tableDataForShow: [],
        tableColumn: []
      },
      chart: {
        highRaw: [],
        lowRaw: [],
        setRaw: [],
        raw: [],
        data: [],
        x: [],
        // today week month
        timeScale: "today",
        hasData: false
      },
      search: {
        pickerOptions: {
          //方法创建在created中
          shortcuts: [
            {
              text: "+24小时",
              onClick(picker) {}
            },
            {
              text: "+12小时",
              onClick(picker) {}
            },
            {
              text: "+6小时",
              onClick(picker) {}
            },
            {
              text: "+3小时",
              onClick(picker) {}
            },
            {
              text: "+1小时",
              onClick(picker) {}
            },
            {
              text: "-1小时",
              onClick(picker) {}
            },
            {
              text: "-3小时",
              onClick(picker) {}
            },
            {
              text: "-6小时",
              onClick(picker) {}
            },
            {
              text: "-12小时",
              onClick(picker) {}
            },
            {
              text: "-24小时",
              onClick(picker) {}
            }
          ],
          disabledDate: function(date) {
            return date && date.valueOf() > Date.now();
          }
        },
        input: [],
        dateInput: ""
        // rangeStartTime: null,//用于限制pickerOptions——disabledDate中的参数 限制开始时间
        // rangeSelectTime: null,//用于限制pickerOptions——disabledDate中的参数 选中时间
        // rangeEndTime: null,//用于限制pickerOptions——disabledDate中的参数 限制结束时间
      },
      statusChartLegend: []
    };
  },
  created() {
    // let that = this;
    // this.search.pickerOptions.onPick = function (value) {
    //   if (!value.maxDate) {
    //     that.rangeSelectTime = value.minDate;
    //     that.rangeStartTime = new Date(that.rangeSelectTime.valueOf());
    //     that.rangeEndTime = new Date(that.rangeSelectTime.valueOf());
    //     that.rangeStartTime.setDate(that.rangeStartTime.getDate() - 1);
    //     that.rangeEndTime.setDate(that.rangeEndTime.getDate() + 1);
    //   }
    // };
    // this.search.pickerOptions.disabledDate = function (date) {
    //   if (that.rangeStartTime && that.rangeEndTime) {
    //     return that.rangeStartTime > date.valueOf() || date.valueOf() > that.rangeEndTime;
    //   } else {
    //     return date && date.valueOf() > Date.now();
    //   }
    // };
    let that = this;
    this.search.pickerOptions.shortcuts.forEach(item => {
      item.onClick = function(picker) {
        that.pickerOptionsOnClick(item.text);
        picker.$emit("pick", that.search.dateInput);
      };
    });
  },
  watch: {
    treeData: {
      handler(n) {
        try {
          if (this.treeData.ctrName === "运行状态") {
            if (!this.search.dateInput) {
              const now = new Date(Date.now());
              this.search.dateInput = moment(now).format("YYYY-MM-DD HH:mm:ss");
            }
            this.getRunStatusData(this.search.dateInput);
          } else {
            this.getPointData();
            this.drawChart();
          }
        } catch (e) {}
      },
      immediate: true
    },
    "search.input": {
      handler(n) {
        if (n !== null && n.length > 0) {
          if (n[1].valueOf() - n[0].valueOf() <= 86400000) {
            this.chart.timeScale = "today";
          } else if (
            n[1].valueOf() - n[0].valueOf() < 86400000 * 2 &&
            n[1].valueOf() - n[0].valueOf() > 86400000
          ) {
            this.chart.timeScale = "twoDays";
          } else {
            this.chart.timeScale = "week";
          }
        }
        this.getPointData();
      }
    }
    // "search.dateInput": {
    //   handler(n) {
    //     this.getRunStatusData();
    //   },
    // },
  },
  mounted() {
    this.search.input[0] = moment().format("YYYY-MM-DD 00:00:00");
    this.search.input[1] = moment().format("YYYY-MM-DD HH:mm:ss");
  },
  methods: {
    pickerOptionsOnClick(value) {
      value = value.split("小时")[0];
      const time = parseInt(value);
      const dateInput = new Date(this.search.dateInput.valueOf());
      const dateTime = moment(
        dateInput.setHours(dateInput.getHours() + time)
      ).format("YYYY-MM-DD HH:mm:ss");
      if (dateTime > this.search.dateInput) {
        this.getRunStatusData(this.search.dateInput, dateTime, time);
      } else {
        this.getRunStatusData(dateTime, this.search.dateInput, -time);
      }
    },
    handleClickRefresh() {
      this.getPointData();
    },
    async getPointData() {
      const momentUtil = moment;
      this.chart.data = [];
      this.chart.hasData = false;
      this.downCard.tableDataForShow = [];
      this.chart.x = [];
      this.downCard.loading = true;
      const param = {
        orgId: this.orgId,
        id: this.treeData.id
      };
      this.downCard.tableColumn = [
        { title: "序号", key: "index" },
        { title: "采集值", key: "num" },
        { title: "采集时间", key: "time" }
      ];
      let res = await this.getInfoPoint(param);

      if (res.data.code === 200) {
        this.downCard.data = res.data.data;
        let p = {
          tableName: this.downCard.data.hisTableName,
          number: this.downCard.data.hisNumber,
          hisValueType: this.downCard.data.hisValueType,
          containerId: this.treeData.id
        };
        if (this.search.input !== null && this.search.input.length !== 0) {
          p.startTime = momentUtil(this.search.input[0]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
          p.endTime = momentUtil(this.search.input[1]).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        let r = await this.getChartData(p);
        if (r !== undefined) {
          if (r.data.code === 200) {
            this.chart.hasData = true;
            let dataList = r.data.data.pointHisList;
            this.chart.raw = dataList;
            this.chart.highRaw = [];
            this.chart.lowRaw = [];
            this.chart.setRaw = r.data.data.pointHisListSv;

            if (r.data.data.deviation && r.data.data.pointHisListSv) {
              this.downCard.tableColumn = [
                { title: "序号", key: "index" },
                { title: "采集值", key: "num" },
                { title: "设定值", key: "setNum" },
                { title: "偏差值", key: "deviation" },
                { title: "采集时间", key: "time" }
              ];
              const deviationArr = r.data.data.deviation.split("%");
              let nn = parseInt(deviationArr[0]);
              if (deviationArr.length > 1) {
                nn = nn / 100;
                this.chart.setRaw.forEach(i => {
                  i.value = i.num;
                  this.chart.highRaw.push({
                    ...i,
                    value: i.value + i.value * nn
                  });
                  this.chart.lowRaw.push({
                    ...i,
                    value: i.value - i.value * nn
                  });
                });
              } else {
                this.chart.setRaw.forEach(i => {
                  i.value = i.num;
                  this.chart.highRaw.push({
                    ...i,
                    value: i.value + nn
                  });
                  this.chart.lowRaw.push({
                    ...i,
                    value: i.value - nn
                  });
                });
              }
            }

            if (
              this.downCard.data.unit !== null &&
              this.downCard.data.unit !== ""
            ) {
              this.downCard.tableColumn[1].title = `采集值(${this.downCard.data.unit})`;
            } else {
              this.downCard.tableColumn[1].title = `采集值`;
            }
            // else {
            //   this.chart.setRaw.forEach((i) => {
            //     i.value = i.num;
            //   });
            // }

            dataList.forEach((item, index) => {
              if (item.num === null) {
                dataList.splice(index, 1);
              }
            });
            dataList.forEach((item, index) => {
              item.index = index + 1;
              if (this.chart.setRaw.length>0) {
                item.setNum = this.chart.setRaw[index].num;
                item.deviation = r.data.data.deviation;
              }

              this.downCard.tableDataForShow.push(item);
            });
            this.downCard.tableDataForShow = this.downCard.tableDataForShow.reverse();

            this.handleChartData();
          }
        }
      }
      this.downCard.loading = false;
    },
    handleChartData() {
      this.chart.x = [];
      this.chart.data = [];
      let data = this.chart.raw;
      let arr = [];
      const momentUtil = moment;
      momentUtil.locale("zh-cn");
      data.forEach(i => {
        if (this.chart.timeScale === "today") {
          const time = moment(i.time).format("H:mm");
          this.chart.x.push(time);
        } else if (this.chart.timeScale === "twoDays") {
          // const time = momentUtil(new Date(Date.parse(i.time))).format(
          //   "D日H时"
          // );
          this.chart.x.push(i.time);
        } else {
          // const date = momentUtil(new Date(Date.parse(i.time))).format(
          //   "M月D日"
          // );
          this.chart.x.push(i.time);
        }

        // this.chart.x.push(i.time);

        i.value = i.num;
        // delete i.num;
      });

      this.chart.data = data;
      this.drawChart();
    },
    drawChart() {
      let chartDom = this.$refs["chart"];
      this.$echarts.dispose(chartDom);
      let charts = this.$echarts.init(chartDom);
      let option = {
        color: ["#266DEB"],
        xAxis: {
          type: "category",
          data: this.chart.x
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false
          }
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            restore: {},
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} : {c} <br/> {b}"
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100
          }
        ],
        grid: {
          top: "10%",
          left: "2.2%",
          right: "3%",
          bottom: "10%",
          containLabel: true
        },
        series: [
          {
            name: this.treeData.ctrName,
            data: this.chart.data,
            type: "line",
            smooth: true
          },
          {
            name: "设定值",
            data: this.chart.setRaw,
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "#00FF00"
            }
          },
          {
            name: "上限值",
            data: this.chart.highRaw,
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "red"
            }
          },
          {
            name: "下限值",
            data: this.chart.lowRaw,
            type: "line",
            smooth: true,
            symbol: "none",
            lineStyle: {
              color: "red"
            }
          }
        ]
      };
      // this.treeData.ctrName === "运行状态" ? delete option.toolbox : "";
      charts.setOption(option);
    },
    handleClickToday() {
      this.$refs.today.style.color = "#266DEB";
      this.$refs.week.style.color = "#515A6E";
      this.$refs.month.style.color = "#515A6E";
      this.chart.timeScale = "today";
      let now = new Date(Date.now());
      this.search.input = [
        new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        new Date(Date.now())
      ];
    },
    handleClickWeek() {
      this.$refs.today.style.color = "#515A6E";
      this.$refs.week.style.color = "#266DEB";
      this.$refs.month.style.color = "#515A6E";

      let now = new Date(Date.now());
      this.chart.timeScale = "week";
      let weekday = now.getDay() || 7;
      let d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      d.setDate(now.getDate() - weekday + 1);
      this.search.input = [d, new Date(Date.now())];
    },
    handleClickMonth() {
      this.$refs.today.style.color = "#515A6E";
      this.$refs.week.style.color = "#515A6E";
      this.$refs.month.style.color = "#266DEB";

      let now = new Date(Date.now());
      this.chart.timeScale = "month";
      this.search.input = [
        new Date(now.getFullYear(), now.getMonth(), 1),
        new Date(Date.now())
      ];
    },
    setTableRowStyle() {
      return "background: #F8F8F9; color:#606266";
    },
    async getRunStatusData(startTime, endTime, splitTime) {
      const that = this;

      this.chart.data = [];
      this.chart.hasData = false;
      this.downCard.tableDataForShow = [];
      this.chart.x = [];
      this.downCard.loading = true;
      let param = {};
      if (endTime) {
        param = {
          orgId: this.orgId,
          id: this.treeData.ctrParent,
          startTime: startTime,
          endTime: endTime,
          pointId: this.treeData.id,
          client: "pc"
        };
      } else {
        const yesterdayNow = new Date(this.search.dateInput.valueOf());
        const yesterday = moment(
          yesterdayNow.setDate(yesterdayNow.getDate() - 1)
        ).format("YYYY-MM-DD HH:mm:ss");
        param = {
          orgId: this.orgId,
          id: this.treeData.ctrParent,
          startTime: yesterday,
          endTime: startTime,
          pointId: this.treeData.id,
          client: "pc"
        };
      }
      let res = await getEquipmentRateSlice(param);
      this.downCard.tableColumn = [
        { title: "序号", key: "index" },
        { title: "采集值", key: "num" },
        { title: "采集时间", key: "time" }
      ];
      if (res.data.code === 200 && res.status === 200) {
        echarts.dispose(this.$refs["statusChart"]);
        const statusChart = echarts.init(this.$refs["statusChart"]);
        let statusOption = {
          tooltip: {
            formatter: function(params) {
              return (
                params.name + ": " + (params.value[2] - params.value[1]) + "min"
              );
            }
          },
          grid: {
            top: "5%",
            left: "3%",
            right: "3%",
            bottom: "5%",
            containLabel: true
          },
          xAxis: {
            type: "value",
            scale: false,
            splitNumber: 12,
            axisLabel: {
              formatter: function(val) {
                const startTime2 = new Date(startTime.valueOf());
                let strstartTime2 = moment(
                  startTime2.setMinutes(startTime2.getMinutes()-1440 + val)
                )
                  .format("YYYY-MM-DD HH:mm:ss")
                  .split(" ");
                return strstartTime2[0] + "\n" + strstartTime2[1];
              }
            },
            max: 1440,
            maxInterval: 120,
            minInterval: 120
          },
          yAxis: {
            type: "category",
            data: [""]
          },
          series: [
            {
              type: "custom",
              renderItem: function(params, api) {
                const categoryIndex = api.value(0);
                const start = api.coord([api.value(1), categoryIndex]);
                const end = api.coord([api.value(2), categoryIndex]);
                const height = api.size([0, 1])[1] * 1;
                const rectShape = echarts.graphic.clipRectByRect(
                  {
                    x: start[0],
                    y: start[1] - height / 2,
                    width: end[0] - start[0],
                    height: height
                  },
                  {
                    x: params.coordSys.x,
                    y: params.coordSys.y,
                    width: params.coordSys.width,
                    height: params.coordSys.height
                  }
                );
                return (
                  rectShape && {
                    type: "rect",
                    shape: rectShape,
                    style: api.style()
                  }
                );
              },
              itemStyle: {
                opacity: 0.6
              },
              data: [
                //数据格式
                //为了维持 x轴24小时显示
                //需要用当天剩余时间（格式：name:"当天剩余时间",color:"white"）来补足时间
                // {
                //   name: "运行",
                //   value: [0, 0, 0.1],
                //   itemStyle: {
                //     normal: {
                //       color: "red"
                //     }
                //   }
                // },
              ]
            }
          ]
        };
        if (splitTime) {
          if (splitTime === 1) {
            statusOption.xAxis.max = 60;
            statusOption.xAxis.maxInterval = 5;
            statusOption.xAxis.minInterval = 5;
          } else if (splitTime === 3) {
            statusOption.xAxis.max = 120;
            statusOption.xAxis.maxInterval = 10;
            statusOption.xAxis.minInterval = 10;
          } else if (splitTime === 6) {
            statusOption.xAxis.max = 360;
            statusOption.xAxis.maxInterval = 30;
            statusOption.xAxis.minInterval = 30;
          } else if (splitTime === 12) {
            statusOption.xAxis.max = 720;
            statusOption.xAxis.maxInterval = 60;
            statusOption.xAxis.minInterval = 60;
          } else if (splitTime === 24) {
            statusOption.xAxis.max = 1440;
            statusOption.xAxis.maxInterval = 120;
            statusOption.xAxis.minInterval = 120;
          } else {
            statusOption.xAxis.max = 1440;
            statusOption.xAxis.maxInterval = 120;
            statusOption.xAxis.minInterval = 120;
          }
        }
        res.data.data.list.forEach((item, index) => {
          statusOption.series[0].data.push({
            name: this.status[item.status].name,
            value: [
              0,
              index === 0
                ? 0
                : statusOption.series[0].data[
                    statusOption.series[0].data.length - 1
                  ].value[2],
              index === 0
                ? item.duration
                : statusOption.series[0].data[
                    statusOption.series[0].data.length - 1
                  ].value[2] + item.duration
            ],
            itemStyle: {
              normal: {
                color: this.status[item.status].color
              }
            }
          });
        });
        if (
          this.search.dateInput ===
            moment(new Date()).format("YYYY-MM-DD 00:00:00") ||
          statusOption.series[0].data.length === 0
        )
          statusOption.series[0].data.push({
            name: "当天剩余时间",
            value: [
              statusOption.xAxis.max,
              statusOption.series[0].data.length === 0
                ? 0
                : statusOption.series[0].data[
                    statusOption.series[0].data.length - 1
                  ].value[2],
              24 * 60
            ],
            itemStyle: {
              normal: {
                color: "white"
              }
            }
          });
        else
          statusOption.series[0].data[
            statusOption.series[0].data.length - 1
          ].value[0] = 24 * 60;
        statusChart.setOption(statusOption);
        //eChart的图标
        this.statusChartLegend = [];
        for (const item in this.status) {
          const perIndex = res.data.data.percentList.findIndex(
            per => per.name === String(item)
          );
          if (perIndex >= 0) {
            this.statusChartLegend.push({
              color: this.status[item].color,
              name: this.status[item].name,
              percent: res.data.data.percentList[perIndex].percent + "%"
            });
          } else {
            this.statusChartLegend.push({
              color: this.status[item].color,
              name: this.status[item].name,
              percent: "0%"
            });
          }
        }
        //下层table的显示
        this.downCard.data = [];
        this.downCard.tableDataForShow = [];
        this.downCard.tableColumn[1].title = `状态`;
        this.downCard.data = res.data.data.listTable.forEach((item, index) => {
          item.index = index + 1;
          item.num = this.status[item.status].name;
        });
        this.downCard.tableDataForShow = res.data.data.listTable;
      } else {
        this.$notifyError("获取运行状态数据失败", res.data.msg);
      }
      this.downCard.loading = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";

.infopoint-up-wrapper {
  height: 360px;
}

.up-title-wrapper {
  height: 2rem;
  display: flex;
  justify-content: space-between;

  span {
    margin: auto 0;
    font-size: 18px;
    font-weight: 500;
    color: black;
  }
}

.title-wrapper {
  margin-top: 1rem;
  height: 1rem;

  span {
    font-size: 18px;
    font-weight: 500;
    color: black;
  }
}

.infopoint-down-wrapper {
  padding-left: 1.6rem;
  height: 40vh;
}

.chart-style {
  width: 100%;
  height: 350px;
}

.chart-style-status {
  width: 100%;
  height: 320px;
}

.head-date-select {
  display: flex;

  .date-select-ele {
    color: #515a6e;
    cursor: pointer;
    margin: auto 1rem auto 0;
  }
}
</style>
<style lang="less">
// element 时间选择框，如果在屏幕边缘时，选择时间会导致溢出，所以全局调整弹出框
.el-time-panel {
  left: -25px;
}

//样式的特别处理
.special-el-date-picker {
  .el-picker-panel__footer {
    display: none !important;
  }
}
</style>

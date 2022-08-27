<template>
  <id-bar-time-chart-table
    ref="chartTable"
    isPage
    :leftChartOptions="leftChartOptions"
    :rightChartOptions="rightChartOptions"
    :tableColumns="tableColumns"
    :tableName="'物料产量统计信息'"
    :idRadioComp="{ exist: false }"
    :datePickerComp="{ exist: false }"
    @beforeGetCascaderOpitions="beforeGetCascaderOpitions"
    :getTable="getTable"
    @afterGetTableNoPage="afterGetTableNoPage"
    @beforeGetTable="beforeGetTable"
    :span-method="objectSpanMethod"
    @alterTableData="alterTableData"
  >
  </id-bar-time-chart-table>
</template>

<script>
import IdBarTimeChartTable from "@/components/id-pages/IdBarTimeChartTable";
import {
  materialProduce,
  materialProduceNumCompareChart,
  materialProduceDataTable
} from "@/api/device-watch/dataAnalysis";
import moment from "moment"; // 日期格式化工具
import day from "@/assets/dataAnalysis/day.png";
import week from "@/assets/dataAnalysis/week.png";
import month from "@/assets/dataAnalysis/month.png";

export default {
  name: "dataAnalysisMaterialProduce",
  components: {
    IdBarTimeChartTable
  },
  computed: {
    getTable() {
      return materialProduceDataTable;
    }
  },
  data() {
    return {
      tableColumns: [
        {
          tag: "el-table-column",
          label: "物料代码",
          prop: "materialNumber",
          width: 180,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "物料名称",
          prop: "materialName",
          width: 180,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "设备代码",
          prop: "deviceNumber",
          width: 215,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "设备名称",
          prop: "deviceName",
          width: 220,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "今日产量",
          prop: "todayProduceNum",
          width: 140,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "昨日产量",
          prop: "yesterdayProduceNum",
          width: 140,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "本周产量",
          prop: "thisWeekProduceNum",
          width: 140,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "上周产量",
          prop: "lastWeekProduceNum",
          width: 140,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "本月产量",
          prop: "thisMonthProduceNum",
          width: 140,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "上月产量",
          prop: "lastMonthProduceNum",
          width: 140,
          showOverflowTooltip: true
        }
      ], //表格列配置

      leftChartOptions: {
        title: {
          text: "物料产量分析",
          left: "left"
        },
        tooltip: {},
        toolbox: {
          showTitle: true,
          top: "5%",
          right: "8%",
          emphasis: {
            iconStyle: {
              textPosition: "top"
            }
          },
          feature: {
            myTool1: {
              show: true,
              title: "今日",
              icon: "image://" + day,
              onclick: function() {}
            },
            myTool2: {
              show: true,
              title: "近7天",
              icon: "image://" + week,
              onclick: function() {}
            },
            myTool3: {
              show: true,
              title: "近30天",
              icon: "image://" + month,
              onclick: function() {}
            }
          }
        },
        dataZoom: [
          {
            type: "slider",
            minValueSpan: 4,
            maxValueSpan: 4,
            height: 20,
            bottom: "0%"
          }
        ],
        dataset: {
          source: [
            ["物料1", 372],
            ["物料2", 412],
            ["物料3", 385],
            ["物料4", 352],
            ["物料5", 352],
            ["物料6", 520],
            ["物料7", 180]
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        color: ["#719df7", "#73ddb2"],
        series: [{ type: "bar", label: { show: true, position: "top" } }]
      },
      rightChartOptions: {
        title: {
          text: "产量同比分析",
          left: "left"
        },
        legend: {
          bottom: "0%"
        },
        tooltip: {},
        dataZoom: [
          {
            type: "slider",
            minValueSpan: 4,
            maxValueSpan: 4,
            height: 20,
            bottom: "0%"
          }
        ],
        dataset: {
          source: [
            ["product", "昨日", "今日"],
            ["物料1", 77, 17],
            ["物料2", 66, 47],
            ["物料3", 33, 34],
            ["物料4", 10, 88],
            ["物料5", 50, 93]
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        color: ["#719df7", "#73ddb2"],
        series: [
          { type: "bar", label: { show: true, position: "top" } },
          { type: "bar", label: { show: true, position: "top" } }
        ]
      },

      day: null,
      tomorrow: null,
      week: null,
      month: null
    };
  },
  created() {
    this.day = moment(new Date()).format("YYYY-MM-DD");
    this.tomorrow = moment(new Date().setDate(new Date().getDate() + 1)).format(
      "YYYY-MM-DD"
    );
    const weekNow = new Date(Date.now());
    this.week = moment(weekNow.setDate(weekNow.getDate() - 7)).format(
      "YYYY-MM-DD"
    );
    const monthNow = new Date(Date.now());
    this.month = moment(monthNow.setDate(monthNow.getDate() - 30)).format(
      "YYYY-MM-DD"
    );
    let that = this;
    this.leftChartOptions.toolbox.feature.myTool1.onclick = function() {
      that.getLeftChart(that.day, that.tomorrow);
    };
    this.leftChartOptions.toolbox.feature.myTool2.onclick = function() {
      that.getLeftChart(that.week, that.tomorrow);
    };
    this.leftChartOptions.toolbox.feature.myTool3.onclick = function() {
      that.getLeftChart(that.month, that.tomorrow);
    };
    // this.rightChartOptions.toolbox.feature.myTool1.onclick = function () {
    //   that.getRightChart(that.day, that.tomorrow);
    // };
    // this.rightChartOptions.toolbox.feature.myTool2.onclick = function () {
    //   that.getRightChart(that.week, that.tomorrow);
    // };
    // this.rightChartOptions.toolbox.feature.myTool3.onclick = function () {
    //   that.getRightChart(that.month, that.tomorrow);
    // };
  },
  methods: {
    beforeGetCascaderOpitions(param) {
      param.noDevice = true;
    },
    beforeGetTable(filterData) {
      filterData.ctrType = undefined;
      this.leftChartOptions.dataset.source = [];
      this.rightChartOptions.dataset.source = [["product", "昨日", "今日"]];
      Promise.all([
        materialProduce({
          ...filterData,
          startTime: this.day,
          endTime: this.tomorrow
        }),
        materialProduceNumCompareChart({
          ...filterData,
          startTime: this.day,
          endTime: this.tomorrow
        })
      ])
        .then(res => {
          res.forEach((item, index) => {
            if (item.status === 200 && item.data.code === 200) {
              if (index === 0)
                item.data.data.forEach(dItem => {
                  this.leftChartOptions.dataset.source.push([
                    dItem.materialName,
                    dItem.num
                  ]);
                });
              else {
                if (item.data.data.hasOwnProperty("昨日")) {
                  item.data.data["昨日"].forEach(dItem => {
                    this.rightChartOptions.dataset.source.push([
                      dItem.materialName,
                      dItem.num
                    ]);
                  });
                }
                if (item.data.data.hasOwnProperty("今日")) {
                  item.data.data["今日"].forEach(dItem => {
                    const sIndex = this.rightChartOptions.dataset.source.findIndex(
                      sItem => sItem[0] === dItem.materialName
                    );
                    if (sIndex >= 0) {
                      this.rightChartOptions.dataset.source[sIndex].push(
                        dItem.num
                      );
                    } else {
                      this.rightChartOptions.dataset.source.push([
                        dItem.materialName,
                        0,
                        dItem.num
                      ]);
                    }
                  });
                }
              }
              this.leftChartOptions.dataZoom[0].show =
                this.leftChartOptions.dataset.source.length > 5;
              this.rightChartOptions.dataZoom[0].show =
                this.rightChartOptions.dataset.source.length > 5;
            } else {
              this.$notifyError(`获取柱状图失败`, res.data.msg);
            }
          });
          this.$nextTick(() => {
            this.$refs.chartTable.initLeftChart();
            this.$refs.chartTable.initRightChart();
          });
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    getLeftChart(startTime, endTime) {
      Promise.resolve(
        materialProduce({
          orgId: this.$store.state.user.userInfo.orgId,
          deviceId: this.$refs.chartTable.actionBarConfig[0].options[0].value,
          startTime: startTime,
          endTime: endTime
        })
      )
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.leftChartOptions.dataset.source = [];
            res.data.data.forEach(dItem => {
              this.leftChartOptions.dataset.source.push([
                dItem.materialName,
                dItem.num
              ]);
            });
            this.$nextTick(() => {
              this.$refs.chartTable.initLeftChart();
            });
          } else {
            this.$notifyError(`获取详情失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    // getRightChart(startTime, endTime) {
    //   Promise.resolve(materialProduceNumCompareChart({
    //     orgId: this.$store.state.user.userInfo.orgId,
    //     deviceId: this.$refs.chartTable.actionBarConfig[0].options[0].value,
    //     startTime: startTime,
    //     endTime: endTime
    //   })).then((res) => {
    //     if (res.status === 200 && res.data.code === 200) {
    //       this.rightChartOptions.dataset.source = [['product', '昨日', '今日']];
    //       if (res.data.data.hasOwnProperty('昨日')) {
    //         res.data.data['昨日'].forEach((dItem) => {
    //           this.rightChartOptions.dataset.source.push([
    //             dItem.materialName,
    //             dItem.num
    //           ]);
    //         });
    //       }
    //       if (res.data.data.hasOwnProperty('今日')) {
    //         res.data.data['今日'].forEach((dItem) => {
    //           const sIndex = this.rightChartOptions.dataset.source.findIndex((sItem) => sItem[0] === dItem.materialName);
    //           if (sIndex >= 0) {
    //             this.rightChartOptions.dataset.source[sIndex].push(dItem.num);
    //           }
    //         });
    //       }
    //       this.$nextTick(() => {
    //         this.$refs.chartTable.initRightChart();
    //       });
    //     } else {
    //       this.$notifyError(`获取详情失败`, res.data.msg);
    //     }
    //   }).catch(() => {
    //     this.$notifyError("网络请求失败!", "");
    //   })
    // },
    afterGetTableNoPage(res) {
      res.listTable = [];
      res.forEach((rItem, rIndex) => {
        rItem.deviceMaterialProduceNumDetails.forEach((dItem, dIndex) => {
          res.listTable.push({
            rIndex: rIndex,
            // dIndex: rItem.deviceMaterialProduceNumDetails.length - 1===0?-1:(dIndex === 0 ? rItem.deviceMaterialProduceNumDetails.length - 1 : 0),
            dIndex: -1,
            materialNumber: rItem.materialNumber,
            materialName: rItem.materialName,
            ...dItem
          });
        });
      });
    },
    //修复前台分页导致的表格缺列的情况（dIndex在前台分页情况下是不准确的）
    //主要问题在 行合并的数据 切换分页时某些列属于上个分页的 因为分页的关系 展示在下个分页中 就会少【物料】列
    //行计算就统一在这个方法中
    alterTableData(tableData) {
      tableData.forEach((tItem, tIndex) => {
        const index = tableData.findIndex(
          item => item.materialNumber === tItem.materialNumber
        );
        const count = tableData.reduce((sum, curr) => {
          return sum + (curr.materialNumber === tItem.materialNumber ? 1 : 0);
        }, 0);
        if (count === 1) {
          tItem.dIndex = -1;
        } else {
          if (index === tIndex) {
            tItem.dIndex = count - 1;
          } else {
            tItem.dIndex = 0;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1 || columnIndex === 2) {
        if (row["dIndex"] === 0) {
          return {
            rowspan: 0,
            colspan: 0
          };
        } else if (row["dIndex"] === -1) {
          return {
            rowspan: 1,
            colspan: 1
          };
        } else {
          return {
            rowspan: row["dIndex"] + 1,
            colspan: 1
          };
        }
      }
    }
  }
};
</script>

<template>
  <id-bar-time-chart-table
    ref="chartTable"
    isPage
    :leftChartOptions="leftChartOptions"
    :rightChartOptions="rightChartOptions"
    :tableColumns="tableColumns"
    :tableName="'利用率统计'"
    :datePickerComp="datePickerComp"
    @beforeGetCascaderOpitions="beforeGetCascaderOpitions"
    :getTable="getTable"
    @beforeGetTable="beforeGetTable"
    @afterGetTableNoPage="afterGetTableNoPage"
  >
  </id-bar-time-chart-table>
</template>

<script>
import IdBarTimeChartTable from "@/components/id-pages/IdBarTimeChartTable";
import { usage, table } from "@/api/device-watch/dataAnalysis";

export default {
  name: "dataAnalysisDeviceUsage",
  components: {
    IdBarTimeChartTable
  },
  computed: {
    getTable() {
      return table;
    }
  },
  data() {
    return {
      tableColumns: [
        {
          tag: "el-table-column",
          label: "容器代码",
          prop: "containerNumber",
          width: 272.5,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "容器名称",
          prop: "containerName",
          width: 272.5,
          showOverflowTooltip: true
        },

        {
          tag: "el-table-column",
          label: "今日利用率",
          prop: "today",
          width: 273,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "昨日利用率",
          prop: "yesterday",
          width: 273,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "最近7天",
          prop: "week",
          width: 273,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "最近30天",
          prop: "month",
          width: 273,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ], //表格列配置

      leftChartOptions: {
        title: {
          text: "总利用率",
          left: "left"
        },
        // legend: {
        //   selectedMode: false,
        //   icon:'none',
        //   left: "0%",
        //   top: "30%",
        //   data: ['利用'],
        //   align:'left',
        //   textStyle:{
        //     rich: {
        //       a: {
        //         color: '#48a778',
        //         height: 40,
        //         fontSize:40,
        //       },
        //       b: {
        //         fontSize:16,
        //         height: 40,
        //       },
        //     }
        //   },
        //   formatter: ['{a|75%}', '{b|name}'].join('\n'),
        // },
        tooltip: {
          formatter: "{b}:{c}%"
        },
        color: ["#73ddb2", "#e6e6e6"],
        series: [
          // {
          //   name: '访问来源',
          //   type: 'pie',
          //   clockwise: false,
          //   radius: ['70%', '90%'],
          //   avoidLabelOverlap: false,
          //   label: {
          //     show: false,
          //     position: 'center'
          //   },
          //   data: [
          //     {value: 85, name: '利用'},
          //     {value: 15, name: '其他'},
          //   ]
          // }
          {
            name: "业务指标",
            type: "gauge",
            radius: "100%",
            axisLine: {
              lineStyle: {
                width: 20,
                color: [
                  [0, "#73ddb2"],
                  [1, "#e6e6e6"]
                ]
              }
            },
            axisLabel: {
              show: true,
              color: "#000000",
              distance: -5
            },
            pointer: {
              show: true,
              length: "60%"
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: "#ffffff"
              }
            },
            axisTick: {
              show: true,
              splitNumber: 10,
              lineStyle: {
                color: "#ffffff"
              }
            },
            title: {
              show: true,
              offsetCenter: [0, "60%"]
            },
            detail: {
              formatter: "{value}%",
              // offsetCenter: ["0", "50%"],
              fontSize: 25
            },
            data: [{ value: 0, name: "利用率" }]
          }
        ]
      },
      rightChartOptions: {
        title: {
          text: "利用率分析",
          left: "left"
        },
        tooltip: {
          formatter: "{b}:{c}%"
        },
        xAxis: {
          type: "category",
          data: [
            "设备001",
            "设备002",
            "设备003",
            "设备004",
            "设备005",
            "设备006",
            "设备007"
          ]
        },
        yAxis: {
          max: 100,
          min: 0,
          axisLabel: {
            formatter: "{value} %"
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
        color: ["#719df7", "#73ddb2"],
        series: [
          {
            type: "bar",
            label: {
              show: true,
              position: "inside",
              formatter: "{c}%"
            },
            data: [58.7, 54.9, 50.8, 55.7, 48.3, 46.9, 59.0]
          }
        ]
      },

      datePickerComp: {}
    };
  },
  methods: {
    beforeGetCascaderOpitions(param) {
      param.noDevice = true;
    },
    beforeGetTable(filterData) {
      const params = {
        ...filterData
      };
      this.datePickerComp.vModel = [filterData.startTime, filterData.endTime];
      this.$nextTick(() => {
        this.$refs.chartTable.initDatePicker();
      });
      filterData.startTime = undefined;
      filterData.endTime = undefined;
      Promise.resolve(usage(params))
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.leftChartOptions.series[0].data = [
              { value: 0, name: "利用率" }
            ];
            // this.leftChartOptions.legend.formatter = '';
            // this.leftChartOptions.legend.formatter=
            //   '{a|'+res.data.data.percent.toFixed(2)+'%}'+
            //   '\n'+
            //   '{b|'+res.data.data.name+'}';
            if (res.data.data.percent) {
              this.leftChartOptions.series[0].data[0].value = res.data.data.percent.toFixed(
                2
              );
              this.leftChartOptions.series[0].data[0].name = res.data.data.name;
              this.leftChartOptions.series[0].axisLine.lineStyle.color[0][0] =
                res.data.data.percent.toFixed(2) / 100;
              // this.leftChartOptions.series[0].data[1].value = 100 - res.data.data.percent;
            }

            this.rightChartOptions.series[0].data = [];
            this.rightChartOptions.xAxis.data = [];
            if (res.data.data.list)
              res.data.data.list.forEach(item => {
                this.rightChartOptions.series[0].data.push(
                  item.percent.toFixed(2)
                );
                this.rightChartOptions.xAxis.data.push(item.name);
              });
            this.rightChartOptions.dataZoom[0].show =
              this.rightChartOptions.series[0].data.length > 5;
            this.$nextTick(() => {
              this.$refs.chartTable.initLeftChart();
              this.$refs.chartTable.initRightChart();
            });
          } else {
            this.$notifyError(`获取饼图失败`, res.data.msg);
          }
        })
        .catch(err => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    afterGetTableNoPage(res, ctrType) {
      res.listTable = res;
      if (ctrType === 1) this.rightChartOptions.title.text = "车间利用率分析";
      else if (ctrType === 2)
        this.rightChartOptions.title.text = "设备利用率分析";
      else this.rightChartOptions.title.text = "利用率分析";
    }
  }
};
</script>

<style scoped></style>

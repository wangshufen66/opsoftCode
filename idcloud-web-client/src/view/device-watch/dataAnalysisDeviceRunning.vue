<template>
  <id-bar-time-chart-table
    ref="chartTable"
    isPage
    :tableColumns="tableColumns"
    :leftChartOptions="leftChartOptions"
    :rightChartOptions="rightChartOptions"
    :getTable="getTable"
    :tableName="'设备运行统计'"
    :idRadioComp="idRadioComp"
    :datePickerComp="datePickerComp"
    @beforeGetTable="beforeGetTable"
    @afterGetTableNoPage="afterGetTableNoPage"
  >
  </id-bar-time-chart-table>
</template>

<script>
import IdBarTimeChartTable from "@/components/id-pages/IdBarTimeChartTable";
import {
  running,
  getEquipmentRateSlice
} from "@/api/device-watch/dataAnalysis";
import echarts from "echarts";
import authority from "@/components/authority";
import deviceStatusMixins from "@/mixins/deviceStatusMixins";
import moment from "moment";

export default {
  name: "dataAnalysisDeviceRunning",
  mixins: [deviceStatusMixins],
  components: {
    IdBarTimeChartTable
  },
  computed: {
    getTable() {
      if (this.ctrType === 1 || this.ctrType === 2) {
        return running;
      } else if (this.ctrType === 3) {
        return getEquipmentRateSlice;
      }
    }
  },
  data() {
    return {
      tableColumns: [
        {
          tag: "el-table-column",
          label: "容器代码",
          prop: "containerNumber",
          width: 180,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "容器名称",
          prop: "containerName",
          width: 180,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "运行比例(%)",
          prop: "runningProportion",
          width: 180,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "待机比例(%)",
          prop: "waitingProportion",
          width: 180,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "调机比例(%)",
          prop: "adjustProportion",
          width: 180,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "故障比例(%)",
          prop: "errorProportion",
          width: 180,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "离线比例(%)",
          prop: "offlineProportion",
          width: 180,
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ], //表格列配置

      ctrType: 1,

      leftChartOptions: {}, //表格设置
      rightChartOptions: {}, //表格设置
      factoryLeftOptions: {
        title: {
          text: "总运行分析",
          left: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : ({d}%)"
        },
        xAxis: { show: false },
        yAxis: { show: false },
        legend: {
          orient: "vertical",
          right: "5%",
          bottom: "5%",
          data: ["故障", "运行", "离线", "调机", "待机"]
        },
        color: [
          "#e27e60",
          "#80dcaf",
          "#aaaaaa",
          "#f3c709",
          "#759dfd",
          "#E6FCE0"
        ],
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "65%",
            center: ["40%", "50%"],
            label: {
              show: true,
              formatter: "{b}{d}%",
              color: "#6D6D6D"
            },
            labelLine: {
              lineStyle: {
                color: "#6D6D6D"
              }
            },
            data: [
              { value: 0, name: "故障" },
              { value: 0, name: "运行" },
              { value: 0, name: "离线" },
              { value: 0, name: "调机" },
              { value: 0, name: "待机" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }, //工厂/车间 =》设备状态
      factoryRightOptions: {
        title: {
          text: "运行分析",
          left: "left"
        },
        legend: {
          top: "5%",
          left: "center",
          itemGap: 5,
          data: ["运行", "离线", "故障", "待机", "调机"]
        },
        tooltip: {
          formatter: "{a}<br />{b}:{c}%"
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
        grid: {
          top: "20%",
          left: "10%",
          right: "10%",
          bottom: "10%",
          containLabel: true
        },
        xAxis: {
          type: "category",
          // data: ['车间1', '车间2', '车间3', '车间4', '车间5', '车间6', '车间7']
          axisLabel: {
            formatter: function(value, index) {
              const showText = value.split("(");
              if (showText.length > 1) {
                return showText[0] + "\n" + showText[1].split(")")[0];
              } else {
                return showText;
              }
            },
            interval: 0
          },
          data: []
        },
        yAxis: {
          type: "value",
          max: 100,
          min: 0,
          axisLabel: {
            formatter: "{value} %"
          }
        },
        color: [
          "#80dcaf",
          "#aaaaaa",
          "#e27e60",
          "#759dfd",
          "#f3c709",
          "#E6FCE0"
        ],
        series: [
          {
            name: "运行状态",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['0%', '50%'],
              formatter: "{c}%"
            },
            // data: [58.7, 54.9, 50.8, 55.7, 48.3, 46.9, 59.0]
            data: []
          },
          {
            name: "离线状态",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['20%', '50%'],
              formatter: "{c}%"
            },
            // data: [7.8, 9.6, 16.2, 13.2, 19.2, 7.7, 8.1]
            data: []
          },
          {
            name: "故障状态",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['40%', '50%'],
              formatter: "{c}%"
            },
            // data: [11.3, 20.3, 8.0, 6.4, 16.4, 5.6, 11.8]
            data: []
          },
          {
            name: "待机状态",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['60%', '50%'],
              formatter: "{c}%"
            },
            // data: [7.5, 12.9, 12.6, 15.5, 10.5, 17.1, 9.6]
            data: []
          },
          {
            name: "调机状态",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['80%', '50%'],
              formatter: "{c}%"
            },
            // data: [14.7, 2.4, 12.4, 9.2, 5.7, 22.6, 11.5]
            data: []
          }
        ]
      }, //工厂/车间 =》设备占有率

      deviceLeftChartOptions: {
        tooltip: {
          formatter: function(params) {
            return (
              params.name + ": " + (params.value[2] - params.value[1]) + "min"
            );
          }
        },
        grid: {
          top: "15%",
          left: "8%",
          right: "8%",
          bottom: "13%",
          containLabel: true
        },
        xAxis: {
          show: true,
          type: "value",
          scale: false,
          splitNumber: 6,
          axisLabel: {
            formatter: function(val) {
              return val / 60 + ":00";
            }
          },
          max: 1440,
          maxInterval: 240,
          minInterval: 240
        },
        yAxis: {
          show: true,
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
                  y: start[1] - height / 2 + 15,
                  width: end[0] - start[0],
                  height: height - 30
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
              //   value: [0, 0, 300],
              //   itemStyle: {
              //     normal: {
              //       color: "red"
              //     }
              //   }
              // },
              // {
              //   name: "运行",
              //   value: [24, 300, 1440],
              //   itemStyle: {
              //     normal: {
              //       color: "blue"
              //     }
              //   }
              // },
            ]
          }
        ]
      }, //设备=》设备状态
      deviceRightChartOptions: {
        title: {
          text: "设备运行分析",
          left: "left"
        },
        legend: {
          show: false,
          data: ["运行状态", "离线状态", "故障状态", "待机状态", "调机状态"]
        },
        tooltip: {
          // formatter: '{a}:{c}%'
          formatter: function(params) {
            return params.seriesName + ": " + params.value + "%";
          }
        },
        dataZoom: {
          show: false
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "4%",
          bottom: "23%"
        },
        xAxis: {
          type: "value",
          axisLabel: {
            formatter: "{value} %"
          }
        },
        yAxis: {
          type: "category",
          data: [""]
        },
        color: [
          "#80dcaf",
          "#aaaaaa",
          "#e27e60",
          "#759dfd",
          "#f3c709",
          "#E6FCE0"
        ],
        series: [
          {
            name: "运行状态",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "inside"
            },
            data: [0]
          },
          {
            name: "离线状态",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "inside"
            },
            data: [0]
          },
          {
            name: "故障状态",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "inside"
            },
            data: [0]
          },
          {
            name: "待机状态",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "inside"
            },
            data: [0]
          },
          {
            name: "调机状态",
            type: "bar",
            stack: "总量",
            label: {
              show: true,
              position: "inside"
            },
            data: [0]
          }
        ]
      }, //设备=》设备占有率

      idRadioComp: {},
      datePickerComp: {},

      deviceRightChartSplit: 24
    };
  },
  created() {},
  methods: {
    beforeGetTable(filterData) {
      this.ctrType = filterData.ctrType ? filterData.ctrType : 3;
      //此处需要优化 监测ctrType的值即可
      if (this.ctrType === 3) {
        filterData.current_page = undefined;
        filterData.page_size = undefined;
        filterData.client = "pc";

        //初始化idRadio 和 datePicker组件
        this.idRadioComp.options = [
          {
            label: "今日",
            authority: new authority()
          }
        ];
        this.datePickerComp.type = "datetime";
        this.datePickerComp.vModel = filterData.startTime;
        this.datePickerComp.pickerOptions.shortcuts = [
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
        ];
        let that = this;
        this.datePickerComp.pickerOptions.shortcuts.forEach(item => {
          item.onClick = function(picker) {
            that.pickerOptionsOnClick(
              item.text,
              that.$refs.chartTable.datePicker.vModel
            );
            picker.$emit("pick", that.$refs.chartTable.datePicker.vModel);
          };
        });
      } else {
        this.idRadioComp.options = [
          {
            label: "今日",
            authority: new authority()
          },
          {
            label: "近7天",
            authority: new authority()
          },
          {
            label: "近30天",
            authority: new authority()
          }
        ];
        this.datePickerComp.type = "daterange";
        this.datePickerComp.vModel = [filterData.startTime, filterData.endTime];
        this.datePickerComp.pickerOptions = {
          disabledDate(date) {
            const now = new Date(Date.now());
            const tomorrow = now.setDate(now.getDate() + 1);
            return date && date.valueOf() > tomorrow;
          }
        };
      }
      this.datePickerComp.popperClass = "special-el-date-picker";
      this.$nextTick(() => {
        this.$refs.chartTable.initRadio();
        this.$refs.chartTable.initDatePicker();
      });
    },
    pickerOptionsOnClick(value, selectTime) {
      value = value.split("小时")[0];
      const time = parseInt(value);
      const dateInput = new Date(selectTime.valueOf());
      const dateTime = moment(
        dateInput.setHours(dateInput.getHours() + time)
      ).format("YYYY-MM-DD HH:mm:ss");
      const dateTime2 = moment(selectTime).format("YYYY-MM-DD HH:mm:ss");
      if (dateTime > dateTime2) {
        this.deviceRightChartSplit = time;
        this.$refs.chartTable.queryChange([dateTime2, dateTime]);
      } else {
        this.deviceRightChartSplit = -time;
        this.$refs.chartTable.queryChange([dateTime, dateTime2]);
      }
    },
    afterGetTableNoPage(data, ctrType) {
      // console.log('percent', data.percent);
      // console.log('shopPercent', data.shopPercent);
      // console.log('listTable', data.listTable);
      // console.log('ctrType', ctrType);
      if (ctrType === 1 || ctrType === 2) {
        //特殊处理 =》根据选择的类型 确定 运行分析的标题
        if (ctrType === 1) this.factoryRightOptions.title.text = "车间运行分析";
        else if (ctrType === 2)
          this.factoryRightOptions.title.text = "设备运行分析";
        else this.factoryRightOptions.title.text = "运行分析";

        this.initColumnsOther();
        // 空载状态 =》 总运行分析
        // this.factoryLeftOptions.legend.data = ['故障', '运行', '离线', '调机', '待机', '空载'];
        // this.factoryLeftOptions.series[0].data = [
        //   {value: 0, name: '故障'},
        //   {value: 0, name: '运行'},
        //   {value: 0, name: '离线'},
        //   {value: 0, name: '调机'},
        //   {value: 0, name: '待机'},
        //   {value: 0, name: '空载'}
        // ];
        // 工厂/车间左侧chart
        this.factoryLeftOptions.legend.data = [
          "故障",
          "运行",
          "离线",
          "调机",
          "待机"
        ];
        this.factoryLeftOptions.series[0].data = [
          { value: 0, name: "故障" },
          { value: 0, name: "运行" },
          { value: 0, name: "离线" },
          { value: 0, name: "调机" },
          { value: 0, name: "待机" }
        ];
        if (data.percent)
          data.percent.forEach(item => {
            // const lIndex = this.factoryLeftOptions.legend.data.findIndex((lItem) => lItem.startsWith(this.status[item.name].name));
            // this.factoryLeftOptions.legend.data[lIndex] += "(" + item.percent + "%)";
            const sIndex = this.factoryLeftOptions.series[0].data.findIndex(
              sItem => sItem.name.startsWith(this.status[item.name].name)
            );
            // this.factoryLeftOptions.series[0].data[sIndex].name += "(" + item.percent + "%)";
            this.factoryLeftOptions.series[0].data[sIndex].value = item.percent;
          });
        //工厂/车间右侧chart

        // 空载状态 =》 运行分析
        // this.factoryRightOptions.legend.data = ['运行', '离线', '故障', '待机', '调机', '空载'];
        // this.factoryRightOptions.xAxis.data = [];
        // this.factoryRightOptions.series = [
        //   {
        //     name: '运行',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //       show: false,
        //       position: 'inside',
        //       // position: ['0%', '50%'],
        //       formatter: '{c}%'
        //     },
        //     // data: [58.7, 54.9, 50.8, 55.7, 48.3, 46.9, 59.0]
        //     data: []
        //   },
        //   {
        //     name: '离线',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //       show: false,
        //       position: 'inside',
        //       // position: ['20%', '50%'],
        //       formatter: '{c}%'
        //     },
        //     // data: [7.8, 9.6, 16.2, 13.2, 19.2, 7.7, 8.1]
        //     data: []
        //   },
        //   {
        //     name: '故障',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //       show: false,
        //       position: 'inside',
        //       // position: ['40%', '50%'],
        //       formatter: '{c}%'
        //     },
        //     // data: [11.3, 20.3, 8.0, 6.4, 16.4, 5.6, 11.8]
        //     data: []
        //   },
        //   {
        //     name: '待机',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //       show: false,
        //       position: 'inside',
        //       // position: ['60%', '50%'],
        //       formatter: '{c}%'
        //     },
        //     // data: [7.5, 12.9, 12.6, 15.5, 10.5, 17.1, 9.6]
        //     data: []
        //   },
        //   {
        //     name: '调机',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //       show: false,
        //       position: 'inside',
        //       // position: ['80%', '50%'],
        //       formatter: '{c}%'
        //     },
        //     // data: [14.7, 2.4, 12.4, 9.2, 5.7, 22.6, 11.5]
        //     data: []
        //   },
        //   {
        //     name: '空载',
        //     type: 'bar',
        //     stack: '总量',
        //     label: {
        //       show: false,
        //       position: 'inside',
        //       // position: ['80%', '50%'],
        //       formatter: '{c}%'
        //     },
        //     // data: [14.7, 2.4, 12.4, 9.2, 5.7, 22.6, 11.5]
        //     data: []
        //   }
        // ];

        this.factoryRightOptions.legend.data = [
          "运行",
          "离线",
          "故障",
          "待机",
          "调机"
        ];
        this.factoryRightOptions.xAxis.data = [];
        this.factoryRightOptions.series = [
          {
            name: "运行",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['0%', '50%'],
              formatter: "{c}%"
            },
            // data: [58.7, 54.9, 50.8, 55.7, 48.3, 46.9, 59.0]
            data: []
          },
          {
            name: "离线",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['20%', '50%'],
              formatter: "{c}%"
            },
            // data: [7.8, 9.6, 16.2, 13.2, 19.2, 7.7, 8.1]
            data: []
          },
          {
            name: "故障",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['40%', '50%'],
              formatter: "{c}%"
            },
            // data: [11.3, 20.3, 8.0, 6.4, 16.4, 5.6, 11.8]
            data: []
          },
          {
            name: "待机",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['60%', '50%'],
              formatter: "{c}%"
            },
            // data: [7.5, 12.9, 12.6, 15.5, 10.5, 17.1, 9.6]
            data: []
          },
          {
            name: "调机",
            type: "bar",
            stack: "总量",
            label: {
              show: false,
              position: "inside",
              // position: ['80%', '50%'],
              formatter: "{c}%"
            },
            // data: [14.7, 2.4, 12.4, 9.2, 5.7, 22.6, 11.5]
            data: []
          }
        ];
        if (data.shopPercent) {
          data.shopPercent.forEach(item => {
            this.factoryRightOptions.xAxis.data.push(item.name);
            item.percentList.forEach(child => {
              const sIndex = this.factoryRightOptions.series.findIndex(sItem =>
                sItem.name.startsWith(this.status[child.name].name)
              );
              this.factoryRightOptions.series[sIndex].data.push(child.percent);
            });
          });
        } else {
          data.listTable.forEach((item, index) => {
            this.factoryRightOptions.xAxis.data.push(item.containerName);
            this.factoryRightOptions.series[0].data.push(
              item.runningProportion
            );
            this.factoryRightOptions.series[1].data.push(
              item.offlineProportion
            );
            this.factoryRightOptions.series[2].data.push(item.errorProportion);
            this.factoryRightOptions.series[3].data.push(
              item.waitingProportion
            );
            this.factoryRightOptions.series[4].data.push(item.adjustProportion);
            //空载状态 =》运行分析
            // this.factoryRightOptions.series[5].data.push(0);
          });
        }
        this.factoryRightOptions.dataZoom[0].show =
          this.factoryRightOptions.series[0].data.length > 5;
        this.leftChartOptions = this.factoryLeftOptions;
        this.rightChartOptions = this.factoryRightOptions;
      } else {
        this.initColumnsDevice();
        //修改列表table的数据
        data.listTable.forEach(item => {
          item.statusName = this.status[item.status].name;
        });
        //设备左侧chart
        if (this.deviceRightChartSplit) {
          if (this.deviceRightChartSplit === 1) {
            this.deviceLeftChartOptions.xAxis.max = 60;
            this.deviceLeftChartOptions.xAxis.maxInterval = 10;
            this.deviceLeftChartOptions.xAxis.minInterval = 10;
          } else if (this.deviceRightChartSplit === 3) {
            this.deviceLeftChartOptions.xAxis.max = 120;
            this.deviceLeftChartOptions.xAxis.maxInterval = 20;
            this.deviceLeftChartOptions.xAxis.minInterval = 20;
          } else if (this.deviceRightChartSplit === 6) {
            this.deviceLeftChartOptions.xAxis.max = 360;
            this.deviceLeftChartOptions.xAxis.maxInterval = 60;
            this.deviceLeftChartOptions.xAxis.minInterval = 60;
          } else if (this.deviceRightChartSplit === 12) {
            this.deviceLeftChartOptions.xAxis.max = 720;
            this.deviceLeftChartOptions.xAxis.maxInterval = 120;
            this.deviceLeftChartOptions.xAxis.minInterval = 120;
          } else if (this.deviceRightChartSplit === 24) {
            this.deviceLeftChartOptions.xAxis.max = 1440;
            this.deviceLeftChartOptions.xAxis.maxInterval = 240;
            this.deviceLeftChartOptions.xAxis.minInterval = 240;
          } else {
            this.deviceLeftChartOptions.xAxis.max = 1440;
            this.deviceLeftChartOptions.xAxis.maxInterval = 240;
            this.deviceLeftChartOptions.xAxis.minInterval = 240;
          }
        }
        let that = this;
        this.deviceLeftChartOptions.xAxis.axisLabel.formatter = function(val) {
          const startTime2 = new Date(that.datePickerComp.vModel.valueOf());
          let strStartTime2 = moment(
            startTime2.setMinutes(startTime2.getMinutes() + val)
          )
            .format("YYYY-MM-DD HH:mm:ss")
            .split(" ");
          return strStartTime2[0] + "\n" + strStartTime2[1];
        };
        this.deviceLeftChartOptions.series[0].data = [];
        data.list.forEach((item, index) => {
          this.deviceLeftChartOptions.series[0].data.push({
            name: this.status[item.status].name,
            value: [
              index === data.list - 1 ? 24 : 0,
              index === 0
                ? 0
                : this.deviceLeftChartOptions.series[0].data[
                    this.deviceLeftChartOptions.series[0].data.length - 1
                  ].value[2],
              index === 0
                ? item.duration
                : this.deviceLeftChartOptions.series[0].data[
                    this.deviceLeftChartOptions.series[0].data.length - 1
                  ].value[2] + item.duration
            ],
            itemStyle: {
              normal: {
                color: this.status[item.status].color
              }
            }
          });
        });
        this.leftChartOptions = this.deviceLeftChartOptions;
        //设备右侧chart
        this.deviceRightChartOptions.series.forEach(item => (item.data = [0]));
        let totalTime = [];
        data.percentList.forEach(item => {
          const sIndex = this.deviceRightChartOptions.series.findIndex(sItem =>
            sItem.name.startsWith(this.status[item.name].name)
          );
          if (sIndex >= 0) {
            this.deviceRightChartOptions.series[sIndex].data[0] += item.percent;
            totalTime[sIndex] = item.percentTime;
          }
        });
        this.deviceRightChartOptions.tooltip.formatter = function(params) {
          return (
            params.seriesName +
            "：" +
            totalTime[params.seriesIndex] +
            "(" +
            params.value +
            ")%"
          );
        };
        this.rightChartOptions = this.deviceRightChartOptions;
      }
      this.$nextTick(() => {
        this.$refs.chartTable.initLeftChart();
        this.$refs.chartTable.initRightChart();
      });
    },
    initColumnsOther() {
      this.tableColumns = [
        {
          tag: "el-table-column",
          label: "容器代码",
          prop: "containerNumber",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "容器名称",
          prop: "containerName",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "运行比例(%)",
          prop: "runningProportion",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "待机比例(%)",
          prop: "waitingProportion",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "调机比例(%)",
          prop: "adjustProportion",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "故障比例(%)",
          prop: "errorProportion",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "离线比例(%)",
          prop: "offlineProportion",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ]; //表格列配置
    },
    initColumnsDevice() {
      this.tableColumns = [
        {
          tag: "el-table-column",
          label: "容器代码",
          prop: "number",
          width: 300,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "容器名称",
          prop: "name",
          width: 300,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "运行状态",
          prop: "statusName",
          width: 250,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "持续时间",
          prop: "time",
          width: 400,
          showOverflowTooltip: true,
          sortable: true
        }
      ]; //表格列配置
    }
  }
};
</script>
<style lang="less">
//样式的特别处理
.special-el-date-picker {
  .el-picker-panel__footer {
    display: none !important;
  }

  right: 0 !important;
  left: auto !important;
  top: 130px !important;
}
</style>

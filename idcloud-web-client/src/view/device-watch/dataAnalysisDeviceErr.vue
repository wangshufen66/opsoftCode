<template>
  <div>
    <id-bar-time-chart-table
      ref="chartTable"
      isPage
      :leftChartOptions="leftChartOptions"
      :rightChartOptions="rightChartOptions"
      :tableColumns="tableColumns"
      :tableName="'故障数据统计'"
      :getTable="getTable"
      :idRadioComp="{ exist: false }"
      :datePickerComp="{ exist: false }"
      @beforeGetCascaderOpitions="beforeGetCascaderOpitions"
      @beforeGetTable="beforeGetTable"
      @afterGetTableNoPage="afterGetTableNoPage"
      @idCellButtonClick="idCellButtonClick"
    >
    </id-bar-time-chart-table>
    <el-dialog
      :visible.sync="detail.show"
      width="90%"
      title="故障详情"
      @closed="detail.show = false"
    >
      <id-table :height="(tableHeight / 4) * 3" v-bind="detail.table">
      </id-table>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">故障详情</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="detail.show = false">取消</el-button>
        <el-button type="primary" @click="detail.show = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
@import "../../styles/diaForm.less";
</style>
<script>
import IdBarTimeChartTable from "@/components/id-pages/IdBarTimeChartTable";
import {
  err,
  deviceErrStatusProportionStatics,
  detail
} from "@/api/device-watch/dataAnalysis";
import IdTable from "@/components/id-table/IdTable";
import resizeTableHeightMixins from "@/mixins/resizeTableHeightMixins";

export default {
  name: "dataAnalysisDeviceErr",
  components: {
    IdBarTimeChartTable,
    IdTable
  },
  mixins: [resizeTableHeightMixins],
  computed: {
    getTable() {
      return err;
    }
  },
  data() {
    return {
      tableColumns: [
        {
          tag: "el-table-column",
          label: "设备代码",
          prop: "deviceNumber",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "设备名称",
          prop: "deviceName",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column-button",
          label: "最近24小时",
          prop: "day",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column-button",
          label: "最近7天",
          prop: "week",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column-button",
          label: "近30天",
          prop: "month",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true
        }
      ], //表格列配置

      leftChartOptions: {
        title: {
          text: "故障分析",
          left: "left"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        grid: {
          left: "7%",
          right: "3%",
          bottom: "15%",
          top: "5%"
        },
        legend: {
          orient: "vertical",
          right: "5%",
          bottom: "5%",
          data: ["故障", "其他"]
        },
        color: ["#e97d64", "#7ca5f8"],
        series: [
          {
            name: "总设备",
            type: "pie",
            radius: "87%",
            center: ["50%", "50%"],
            data: [
              { value: 9, name: "故障" },
              { value: 91, name: "其他" }
            ],
            label: {
              normal: {
                formatter: "{b}({d}%)",
                position: "inside"
              }
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      rightChartOptions: {
        title: {
          text: "故障次数分析",
          left: "left"
        },
        legend: {
          bottom: "5%",
          itemGap: 100
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
        color: ["#f6c639", "#ea7e65", "#7ca5f8"],
        dataset: {
          source: [
            ["product", "最近24小时", "最近7天", "最近一个月"]
            // ['Z01', 10, 17, 93],
            // ['Z02', 20, 30, 40],
            // ['Z03', 10, 34, 60],
            // ['Z04', 5, 8, 10],
            // ['Z05', 6, 8, 10],
            // ['Z06', 10, 18, 30],
          ]
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [
          { type: "bar", label: { show: true, position: "top" } },
          { type: "bar", label: { show: true, position: "top" } },
          { type: "bar", label: { show: true, position: "top" } }
        ]
      },

      detail: {
        show: false,
        table: {
          selection: false,
          border: true,
          tableData: [],
          columns: [
            {
              tag: "el-table-column",
              label: "设备代码",
              prop: "deviceNumber",
              width: 180,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "设备名称",
              prop: "deviceName",
              width: 250,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "故障代码",
              prop: "code",
              width: 120,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "故障详情",
              prop: "content",
              width: 250,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "故障持续时间",
              prop: "duration",
              width: 120,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "故障开始时间",
              prop: "startTime",
              width: 180,
              showOverflowTooltip: true
            },
            {
              tag: "el-table-column",
              label: "故障结束时间",
              prop: "endTime",
              width: 180,
              showOverflowTooltip: true
            }
          ]
        }
      }
      //弹窗是否显示
    };
  },
  methods: {
    idCellButtonClick(row, column, index) {
      // console.log(row, column, index);
      Promise.resolve(
        detail({
          orgId: this.$store.state.user.userInfo.orgId,
          deviceId: row.deviceId,
          type: column.property
        })
      )
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data);
            this.detail.table.tableData = res.data.data.list;
            this.$nextTick(() => {
              this.detail.show = true;
            });
          } else {
            this.$notifyError(`获取详情失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    beforeGetCascaderOpitions(param) {
      param.noDevice = true;
    },
    beforeGetTable(filterData) {
      Promise.resolve(deviceErrStatusProportionStatics(filterData))
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            //name 5 是其他   name 4 是故障
            res.data.data.forEach(item => {
              if (item.name === "4") {
                const percent = item.percent.toFixed(2);
                this.leftChartOptions.legend.data[0] = "故障 " + percent + "%";
                this.leftChartOptions.series[0].data[0].name =
                  "故障 " + percent + "%";
                this.leftChartOptions.series[0].data[0].value = percent;
                this.leftChartOptions.legend.data[1] =
                  "其他 " + (100 - percent) + "%";
                this.leftChartOptions.series[0].data[1].name =
                  "其他 " + (100 - percent) + "%";
                this.leftChartOptions.series[0].data[1].value = 100 - percent;
              }
            });
            this.$nextTick(() => {
              this.$refs.chartTable.initLeftChart();
            });
          } else {
            this.$notifyError(`获取饼图失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    afterGetTableNoPage(res) {
      res.listTable = res;
      this.rightChartOptions.dataset.source = [
        ["product", "最近24小时", "最近7天", "最近一个月"]
      ];
      res.forEach(item => {
        this.rightChartOptions.dataset.source.push([
          item.deviceNumber,
          item.day,
          item.week,
          item.month
        ]);
      });
      this.rightChartOptions.dataZoom[0].show =
        this.rightChartOptions.dataset.source.length > 5;
      this.$nextTick(() => {
        this.$refs.chartTable.initRightChart();
      });
    }
  }
};
</script>

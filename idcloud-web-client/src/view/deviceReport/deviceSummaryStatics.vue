<template>
  <id-bar-time-table
    tableErrTip="设备综合统计"
    excelName="设备综合统计"
    isPage
    :tableColumns="tableColumns"
    :getTable="getTable"
    :getExcelTemplate="getExcelTemplate"
  >
  </id-bar-time-table>
</template>

<script>
import IdBarTimeTable from "@/components/id-pages/IdBarTimeTable";
import {
  deviceSummaryStatics,
  exportDeviceSummaryStatics
} from "@/api/deviceReport";

export default {
  name: "deviceSummaryStatics",
  components: { IdBarTimeTable },
  computed: {
    getTable() {
      return deviceSummaryStatics;
    },
    getExcelTemplate() {
      return exportDeviceSummaryStatics;
    }
  },
  data() {
    return {
      tableColumns: [
        {
          tag: "el-table-column",
          label: "#",
          type: "index",
          align: "center",
          width: 40
        },
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
          tag: "el-table-column",
          label: "产量",
          prop: "produceNum",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "故障次数",
          prop: "faultCount",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "运行比例(%)",
          prop: "runningProportion",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "待机比例(%)",
          prop: "waitingProportion",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "调机比例(%)",
          prop: "adjustProportion",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "故障比例(%)",
          prop: "errorProportion",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        },
        {
          tag: "el-table-column",
          label: "离线比例(%)",
          prop: "offlineProportion",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ]
    };
  }
};
</script>

<template>
  <id-bar-time-table
    isPage
    tableErrTip="设备运行统计"
    excelName="设备运行统计"
    :tableColumns="tableColumns"
    :getTable="getTable"
    :getExcelTemplate="getExcelTemplate"
  >
  </id-bar-time-table>
</template>

<script>
import IdBarTimeTable from "@/components/id-pages/IdBarTimeTable";
import { runningStatics, exportRunningStatics } from "@/api/deviceReport";

export default {
  name: "runningStatics",
  components: { IdBarTimeTable },
  computed: {
    getTable() {
      return runningStatics;
    },
    getExcelTemplate() {
      return exportRunningStatics;
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

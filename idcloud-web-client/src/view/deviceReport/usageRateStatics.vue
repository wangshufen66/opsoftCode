<template>
  <id-bar-time-table
    isPage
    tableErrTip="设备利用率统计"
    excelName="设备利用率统计"
    :tableColumns="tableColumns"
    :getTable="getTable"
    :getExcelTemplate="getExcelTemplate"
    @afterGetTableNoPage="afterGetTableNoPage"
  >
  </id-bar-time-table>
</template>

<script>
import IdBarTimeTable from "@/components/id-pages/IdBarTimeTable";
import { usageRateStatics, exportUsageRateStatics } from "@/api/deviceReport";

export default {
  name: "usageRateStatics",
  components: { IdBarTimeTable },
  computed: {
    getTable() {
      return usageRateStatics;
    },
    getExcelTemplate() {
      return exportUsageRateStatics;
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
          label: "平均利用率",
          prop: "averageUsage",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ]
    };
  },
  methods: {
    afterGetTableNoPage(data) {
      this.tableColumns = [
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
          label: "平均利用率",
          prop: "averageUsage",
          width: "auto",
          showOverflowTooltip: true,
          sortable: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ];
      if (data.length > 0) {
        data.forEach((dItem, dIndex) => {
          if (dIndex === 0) {
            if (data[dIndex].hasOwnProperty("usageDetailList")) {
              data[dIndex].usageDetailList.forEach(item => {
                this.tableColumns.push({
                  tag: "el-table-column",
                  label: item.date,
                  prop: item.date,
                  width: 180,
                  sortable: true,
                  showOverflowTooltip: true
                });
                data[dIndex][item.date] = item.usage;
              });
            }
          } else {
            data[dIndex].usageDetailList.forEach(item => {
              data[dIndex][item.date] = item.usage;
            });
          }
        });
      }
    }
  }
};
</script>

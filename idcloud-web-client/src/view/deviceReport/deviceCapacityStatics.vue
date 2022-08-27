<template>
  <id-bar-time-table
    isPage
    tableErrTip="产量产能统计"
    excelName="产量产能统计"
    :tableColumns="tableColumns"
    :getTable="getTable"
    :getExcelTemplate="getExcelTemplate"
    @afterGetTableNoPage="afterGetTableNoPage"
  >
  </id-bar-time-table>
</template>

<script>
import IdBarTimeTable from "@/components/id-pages/IdBarTimeTable";
import {
  deviceProduceCapacityStatics,
  exportProduceCapacityStatics
} from "@/api/deviceReport";

export default {
  name: "deviceCapacityStatics",
  components: { IdBarTimeTable },
  computed: {
    getTable() {
      return deviceProduceCapacityStatics;
    },
    getExcelTemplate() {
      return exportProduceCapacityStatics;
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
          label: "物料代码",
          prop: "materialNumber",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "物料名称",
          prop: "materialName",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "总产量",
          prop: "sum",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
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
          label: "物料代码",
          prop: "materialNumber",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "物料名称",
          prop: "materialName",
          width: "auto",
          showOverflowTooltip: true
        },
        {
          tag: "el-table-column",
          label: "总产量",
          prop: "sum",
          width: "auto",
          sortable: true,
          showOverflowTooltip: true,
          formatter: function(row, column, cellValue, index) {
            return cellValue ? cellValue.toFixed(2) : 0;
          }
        }
      ];
      if (data.length > 0) {
        data.forEach((dItem, dIndex) => {
          if (dIndex === 0) {
            if (data[dIndex].hasOwnProperty("materialProduceDateNumList")) {
              data[dIndex].materialProduceDateNumList.forEach(item => {
                this.tableColumns.push({
                  tag: "el-table-column",
                  label: item.date,
                  prop: item.date,
                  width: 180,
                  sortable: true,
                  showOverflowTooltip: true
                });
                data[dIndex][item.date] = item.num;
              });
            }
          } else {
            data[dIndex].materialProduceDateNumList.forEach(item => {
              data[dIndex][item.date] = item.num;
            });
          }
        });
      }
    }
  }
};
</script>

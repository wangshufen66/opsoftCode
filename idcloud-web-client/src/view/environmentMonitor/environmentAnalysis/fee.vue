<template>
  <id-bar-query-table
    id-query-form-label-width="90px"
    :getTable="getList"
    :tableColumns="tableColumns"
    @afterGetTablePage="afterGetTablePage"
  >
  </id-bar-query-table>
</template>

<script>
  import IdBarQueryTable from "@/components/id-pages/IdBarQueryTable";
  import {fee} from "@/api/environmentMonitor/environmentAnalysis"

  export default {
    name: "fee",
    components: {IdBarQueryTable},
    data() {
      return {
        tableColumns: [
          {
            tag: "el-table-column",
            label: "监测点代码",
            prop: "collectNumber",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "监测点名称",
            prop: "pointName",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "能耗费用",
            prop: "feeInMonth",
            minWidth: 250,
            showOverflowTooltip: true,
            comp: "String",
          },
          {
            tag: "el-table-column",
            label: "备注信息",
            prop: "marks",
            minWidth: 400,
            showOverflowTooltip: true,
            resizable: false,
            comp: "String",
          },
        ], //表格列配置
      }
    },
    computed: {
      getList() {
        return fee;
      },
    },
    methods:{
      afterGetTablePage(data) {
        data.list = data.records;
      }
    }
  }
</script>


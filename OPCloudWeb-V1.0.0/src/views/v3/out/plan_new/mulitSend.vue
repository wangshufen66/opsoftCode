<template>
  <div class="m-page-list" style="height:400px">
    <table-extend v-bind="tableOption">
      <template #col_planOutTime="{ data }" width="300px">
        <el-date-picker
          style="width: 99%;"
          v-model="data.planOutTime"
          type="date"
          placeholder="发出时间"
        ></el-date-picker>
      </template>

      <template #col_actualOutQtyNew="{ data }" min-width="90%">
        <el-input-number
          :min="1"
          :max="data.planOutQty - data.actualOutQty"
          v-model="data.actualOutQtyNew"
        />
      </template>
    </table-extend>
  </div>
</template>
<script lang="ts">
import { reactive, ref, onMounted, getCurrentInstance } from "vue";

export default {
  components: {},
  props: ['_param'],
  setup(props, context) {
    const emitter =
      getCurrentInstance()?.appContext.config.globalProperties.$emitter;

    var rows = props._param.rows
    rows.forEach(row => {
      row['actualOutQtyNew'] = row.planOutQty - row.actualOutQty
    });

    const tableOption = reactive({
      tableData: rows,
      tableColums: [
        {
          label: "生产订单号",
          prop: "icmoNbr",
          minWidth: 90,
          comp: "String",
        },
        {
          label: "工序标识",
          prop: "fprocessCode",
          minWidth: 90,
          comp: "String",
        },
        {
          label: "工序名称",
          prop: "fprocessName",
          minWidth: 60,
          comp: "String",
        },
        {
          label: "产品编号",
          prop: "fproductCode",
          minWidth: 100,
          comp: "String",
        },
        {
          label: "产品名称",
          prop: "fproductName",
          minWidth: 100,
          comp: "String",
        },

        {
          label: "委外计划数量",
          prop: "planOutQty",
          minWidth: 60,
          comp: "String",
        },
        {
          label: "本次发出数量",
          prop: "actualOutQtyNew",
          minWidth: 150,
          comp: "String",
        },
        {
          label: "发出时间",
          prop: "planOutTime",
          minWidth: 300
        }
      ],
      selectionCol: false,
      paging: false,
      total: 0,
      tableLoading: false,
      noTableRight: false,
    });

    const getResult = () => {
      return tableOption.tableData;
    };

    return {
      tableOption,
      getResult,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
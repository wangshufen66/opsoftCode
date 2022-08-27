<template>
  <div class="m-page-list" style="height:400px">
    <div>订单</div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
      @rowClick="rowClick"
    >
      <!-- <template #operatColumn>
        <el-table-column label="操作" fixed="right">
          <template #default="scope">
            <el-button
              :type="isSelect(scope.row) ? 'success' : 'info'"
              @click="rowClick(scope.row)"
            >{{ isSelect(scope.row) ? '已选择' : '未选择' }}</el-button>
          </template>
        </el-table-column>
      </template> -->
    </table-extend>
  </div>
</template>
<script lang="ts">
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { LinkageData } from "@/api/outApi/index";
import useHook from "../useHook";
import edit from "./edit.vue";

export default {
  components: {},
  setup(props, context) {
    const emitter =
      getCurrentInstance()?.appContext.config.globalProperties.$emitter;

    // 分页器
    const pageRequest = reactive({
      pageIndex: 1,
      pageSize: 15,
    });
    const tableOption = reactive({
      tableData: [],
      tableColums: [{
        label: "供应商代码",
        prop: "FSUPPLIERNUMBER",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
      },
      {
        label: "供应商名称",
        prop: "FSUPPLIER",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
      },
      {
        label: "联系人",
        prop: "FPhoneNumber",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
      }],
      selectionCol: false,
      paging: true,
      total: 0,
      tableLoading: false,
      noTableRight: false,
    });



    const getPageList = async () => {
      const { data } = await LinkageData({
        chartFilterFields: [],
        masterRelatedTableName: 't_ajichuziliao_mjichuziliao_pSupplier',
        pageRequest: pageRequest,
        tableEntityList: [{
          relatedFieldsConfig: [],
          tableName: "t_ajichuziliao_mjichuziliao_pSupplier",
          displayedFields: [{ "fieldName": "FSupplierNumber" },
          { "fieldName": "FSupplier" },
          { "fieldName": "FPhoneNumber" },
          { "fieldName": "ID" }]
        }]
      })
      console.log(data)

      var records_new = data.records.map(row => {
        var key_arr = Object.keys(row);
        var obj = {};
        key_arr.forEach(k => {
          var endKey = k.split("__")[1]
          obj[endKey] = row[k]
        })
        return obj
      });

      tableOption.tableData = records_new
      tableOption.total = data.total
    }


    //分页
    function handleSizeChange(val) {
      pageRequest.pageSize = val;
      getPageList();
    }
    function currentpage(val) {
      pageRequest.pageIndex = val;
      getPageList();
    }



    const selectRows = ref([]);

    const rowClick = (row) => {
      //是否存在
      selectRows.value = [{
        ...row
      }]
    };

    const getResult = () => {
      return selectRows.value;
    };

    onMounted(() => {
      getPageList();
    });

    const isSelect = (row) => {
      return (
        selectRows.value.filter((x) => x.FSUPPLIERNUMBER == row.FSUPPLIERNUMBER).length >
        0
      );
    };

    return {
      tableOption,
      handleSizeChange,
      currentpage,
      rowClick,
      selectRows,
      getResult,
      isSelect,
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/styles/modules/quantityadjust/productionstart.scss";
</style>
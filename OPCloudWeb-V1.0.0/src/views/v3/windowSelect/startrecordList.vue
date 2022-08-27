<template>
  <!--汇报记录-加工单开窗 -->
  <div class="m-page-list">
    <div class="m-page-list-search">
      <el-form mode="topForm" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="开工单号" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.startNbr"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工单元" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.machiningUnitName"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="加工人员" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.employeeName"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <table-extend
      v-bind="tableOption"
      @pageSizeChange="tableGatherFunc.pageSizeChange"
      @currentChange="tableGatherFunc.currentChange"
      @rowClick="rowClick"
    ></table-extend>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";

const emit = defineEmits(["row-click"]);

const props = defineProps(["param", "_getTableList", "processUniqueNbr"]);

const { tableOption, tableGatherFunc, searchForm } = useHook({
  _getTableList: props._getTableList,
  _tableColums: [
    {
      label: "开工单号",
      prop: "startNbr",
      minWidth: 100,
    },
    {
      label: "加工单元",
      prop: "machiningUnitName",
      minWidth: 100,
    },
    {
      label: "加工人员",
      prop: "employeeName",
      minWidth: 120,
    },
    {
      label: "班组",
      prop: "shiftGroupName",
      minWidth: 120,
    },
    {
      label: "班次",
      prop: "shiftSliceName",
      minWidth: 120,
    },

  ],
  _searchForm: {
    machiningUnitName: "",
    startNbr: "",
    employeeName: "",
  },
  _masterForm: {
    processUniqueNbr: props.processUniqueNbr
  }
});

let selectRows = reactive([]);
const rowClick = (row) => {
  //是否存在
  selectRows = [
    {
      ...row,
    },
  ];
  emit("row-click", [row]);
};

//对外暴露方法
const getResult = () => {
  return {
    rows: selectRows,
  };
};

onMounted(() => {
  tableGatherFunc.loadTableData();
});

defineExpose({
  getResult,
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
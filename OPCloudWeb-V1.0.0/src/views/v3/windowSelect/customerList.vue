<template>
  <!-- 客户 -->
  <div class="m-page-list">
    <div class="m-page-list-search">
      <el-form mode="topForm" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="客户名称" @submit.prevent>
              <el-input type="text" v-model="searchForm.customerName" @keyup.enter="tableGatherFunc.reLoadTableData" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户代码" @submit.prevent>
              <el-input type="text" v-model="searchForm.customerNbr" @keyup.enter="tableGatherFunc.reLoadTableData" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <table-extend v-bind="tableOption" @pageSizeChange="tableGatherFunc.pageSizeChange" @currentChange="tableGatherFunc.currentChange" @rowClick="rowClick"></table-extend>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/customerApi";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";
const emit = defineEmits(["row-click"]);

const props = defineProps(["param"]);

const { tableOption, tableGatherFunc, searchForm } = useHook({
  _getTableList: BuzApi.GetPageList,
  _tableColums: [
    {
      label: "客户代码",
      prop: "customerNbr",
      minWidth: 100,
    },
    {
      label: "客户名称",
      prop: "customerName",
      minWidth: 100,
    },
    {
      label: "简称",
      prop: "shortName",
      minWidth: 100,
    },
    {
      label: "英文简称",
      prop: "englishShortName",
      minWidth: 100,
    },
    {
      label: "地址（省市区)",
      prop: "provinces",
      minWidth: 100,
    },
    {
      label: "地址（省市区)",
      prop: "address",
      minWidth: 100,
    },
    {
      label: "详细地址",
      prop: "detailAddress",
      minWidth: 100,
    },
    {
      label: "联系人",
      prop: "contactName",
      minWidth: 100,
    },
    {
      label: "联系电话",
      prop: "contactPhone",
      minWidth: 100,
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 100,
    },
  ],
  // _masterForm: {
  //     ...props.param.masterSearchForm
  // },
  _searchForm: {
    customerName: "",
    customerNbr: "",
  },
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
  console.log(selectRows);
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
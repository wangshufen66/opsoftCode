<template>
  <div class="m-page-list">
    <div class="m-page-list-search">
      <el-form mode="topForm" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="委外接收单号" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.billNo"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.billNo"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工序名称" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.billNo"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="检验状态" @submit.prevent>
              <el-select v-model="searchForm.status" placeholder="状态" clearable style="width: 100%">
                <el-option label="待检验" :value="10"></el-option>
                <el-option label="已检验" :value="20"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="m-page-list-tool-bar">
      <el-col :span="24">
        <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">查询</el-button>
        <!-- <el-button type="primary" @click="tableGatherFunc.reLoadTableData" plain size="small">批量删除</el-button> -->
      </el-col>
    </div>

    <table-extend
      v-bind="tableOption"
      @pageSizeChange="tableGatherFunc.pageSizeChange"
      @currentChange="tableGatherFunc.currentChange"
      @rowDblClick="toSee"
    >
      <template #col_status="{ data }">
        <span v-if="data.status == 0">未知</span>
        <span v-if="data.status == 10">待检验</span>
        <span v-if="data.status == 20">已检验</span>
      </template>

      <template #operatColumn>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="scope">
            <text-button v-if="scope.row.status == 10" @click="toEdit(scope.row)">检验</text-button>
            <!-- <text-button v-if="scope.row.status == 10" @click="changeStatus(scope.row)">检验</text-button> -->
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <div class="fixedDialog">
      <el-dialog v-model="editVisible" title="生产检验" :destroy-on-close="true" width="1400px">
        <edit ref="editRef" :param="toParam" />

        <template #footer>
          <el-button @click="editVisible = false">取消</el-button>

          <!-- <el-button
            v-if="toParam.entity && toParam.entity.status == 10"
            @click="changeStatus(toParam.entity)"
          >检验</el-button>-->

          <el-button v-if="toParam.showType == 1" type="primary" @click="onSave">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { SubReceiveInspectionList, ChangeStatus } from "@/api/outApi/index";
import useHook from "../useHook";
import edit from "./edit.vue";
import { routerViewLocationKey } from "vue-router";
import { messageAlert } from "@/utils/utils";

const emitter =
  getCurrentInstance()?.appContext.config.globalProperties.$emitter;

const { tableOption, tableGatherFunc, searchForm } = useHook({
  _getTableList: SubReceiveInspectionList,
  _tableColums: [
    {
      label: "委外检验号",
      prop: "billNo",
      minWidth: 150,
      comp: "String",
    },
    {
      label: "委外接收单号",
      prop: "receiveBillNo",
      minWidth: 150,
      comp: "String",
    },

    {
      label: "创建时间",
      prop: "createTime",
      minWidth: 170,
      comp: "String",
    },
    {
      label: "生产订单号",
      prop: "icmoNbr",
      minWidth: 150,
      comp: "String",
    },


    {
      label: "产品代码",
      prop: "processCode",
      minWidth: 150,
      comp: "String",
    },
    {
      label: "产品名称",
      prop: "processName",
      minWidth: 150,
      comp: "String",
    },

    {
      label: "汇报数量",
      prop: "rcvQty",
      minWidth: 80,
      showOverflowTooltip: true,
      comp: "String",
    },

    {
      label: "合格数",
      prop: "checkGoodQty",
      minWidth: 80,
      showOverflowTooltip: true,
      comp: "String",
    },

    {
      label: "不良数量",
      prop: "checkUnGoodQty",
      minWidth: 80,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "检验人",
      prop: "checker",
      minWidth: 80,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "状态", // 10未 20 已
      prop: "status",
      minWidth: 150,
      showOverflowTooltip: true,
      comp: "String",
    },
  ],
  _searchForm: {
    billNo: "",
    status: "",
    // mock_num: 1,
  },
});

const editRef = ref(null);
var editVisible = ref<boolean>(false);

let toParam = reactive({
  showType: 1, //1编辑 0查看
  entity: null
});

const toEdit = (row) => {
  toParam.showType = 1
  toParam.entity = row;
  editVisible.value = true;
};

const toSee = (row) => {
  toParam.showType = 0;
  toParam.entity = row;
  editVisible.value = true;
};


const changeStatus = async (row) => {
  var res = await ChangeStatus([row.id]);
  if (res.code == 200) {
    messageAlert('success', '保存成功')
    tableGatherFunc.reLoadTableData();
  } else {
    messageAlert('error', res.msg)
  }
  console.log(res, '====changeStatus=======')
};


const onSave = () => {
  editRef?.value.submit().then((res) => {
    editVisible.value = false;
    tableGatherFunc.reLoadTableData();
  });
};

onMounted(() => {
  tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
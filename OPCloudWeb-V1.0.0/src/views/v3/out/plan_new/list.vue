<template>
  <div class="m-page-list">
    <div class="m-page-list-search">
      <el-form mode="topForm" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="委外计划单号" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.billNo"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.supplyName"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请部门名称" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.deptName"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="m-page-list-tool-bar">
      <el-col :span="24">
        <el-button @click="toEdit()" type="primary" plain size="small">新增</el-button>
        <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">查询</el-button>
      </el-col>
    </div>

    <table-extend
      v-bind="tableOption"
      @pageSizeChange="tableGatherFunc.pageSizeChange"
      @currentChange="tableGatherFunc.currentChange"
      @rowDblClick="toSee"
    >
      <template #col_status="{ data }">
        <span v-if="data.status == 0">计划</span>
        <span v-if="data.status == 1">确认</span>
      </template>

      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="120">
          <template #default="scope">
            <text-button
              v-if="
                scope.row.status == 0
              "
              @click="toEdit(scope.row)"
            >编辑</text-button>

            <text-button
              v-if="
                scope.row.status == 0 &&
                (scope.row.isAudit == 0)
              "
              @click="approve(scope.row, 1)"
            >审核</text-button>

            <text-button
              v-if="
                scope.row.status == 1 &&
                (scope.row.isAudit == 0)
              "
              @click="approve(scope.row, 0)"
            >反审核</text-button>

            <text-button v-if="scope.row.status == 0" @click="del(scope.row)">删除</text-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <div class="fixedDialog">
      <el-dialog v-model="editDialog.visible" title="委外计划单号" :destroy-on-close="true" width="90%">
        <edit ref="editRef" :_param="editDialog.param" />

        <template #footer>
          <el-button @click="editDialog.hide()">取消</el-button>
          <el-button
            v-if="editDialog.param.showType == 1 || (editDialog.param.showType == 2 && editDialog.param.entity.status == 0)"
            type="primary"
            @click="onSave"
          >保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import { SubPlanList, UpdateSubPlan, DelById } from "@/api/outApi/index";
import useHook from "../useHook";
import edit from "./edit.vue";
import { routerViewLocationKey } from "vue-router";
import { messageAlert } from "@/utils/utils";

const emitter =
  getCurrentInstance()?.appContext.config.globalProperties.$emitter;

const { tableOption, tableGatherFunc, searchForm } = useHook({
  _getTableList: SubPlanList,
  _tableColums: [
    {
      label: "委外计划单",
      prop: "billNo",
      minWidth: 180,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "供应商代码",
      prop: "supplyId",
      minWidth: 180,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "供应商名称",
      prop: "supplyName",
      minWidth: 180,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "申请部门代码",
      prop: "deptCode",
      minWidth: 180,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "申请部门名称",
      prop: "deptName",
      minWidth: 180,
      showOverflowTooltip: true,
      comp: "String",
    },
    {
      label: "审核状态",
      prop: "status",
      minWidth: 180,
      showOverflowTooltip: true,
      comp: "String",
    },
  ],
  _searchForm: {
    title: "",
    status: "",
    mock_num: 1,
  },
});


const editRef = ref(null)
const editDialog = reactive({
  visible: false,
  show: (row) => {
    editDialog.visible = true
  },
  hide: () => {
    editDialog.visible = false
    tableGatherFunc.loadTableData();
  },
  onConfirm: () => {
    var row = editRef.value?.getResult() || {};
    pageData.formData.supplyName = row.FSUPPLIER;
    pageData.formData.supplyCode = row.FSUPPLIERNUMBER;
    pageData.formData.supplyId = row.ID;
    editDialog.visible = false;
  },
  param: {
    showType: 0, //1新增 0查看  2编辑
    id: '',
    entity: null
  }
})


const toEdit = (row) => {
  editDialog.param.showType = row ? 2 : 1
  editDialog.param.id = row ? row['id'] : ''
  editDialog.param.entity = row;
  editDialog.visible = true;
};

const toSee = (row) => {
  editDialog.param.showType = 0;
  editDialog.param.id = row.id;
  editDialog.param.entity = row;
  editDialog.visible = true;
};

//编辑回调
const onSave = () => {
  editRef?.value.submit().then((res) => {
    editDialog.visible = false;
    tableGatherFunc.reLoadTableData();
  });
};

//通用回调处理
const commonResultDeal = async (res) => {
  if (res.code == 200) {
    messageAlert('success', "操作成功")
    tableGatherFunc.reLoadTableData();
  } else {
    messageAlert('error', res.msg)
  }
}

//审核反审核
const approve = async (row, toStatus) => {
  var res = await UpdateSubPlan({
    id: row.id,
    status: toStatus
  })
  commonResultDeal(res)
}

//删除
const del = async (row) => {
  var res = await DelById(row.id)
  commonResultDeal(res)
}

onMounted(() => {
  tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
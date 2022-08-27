<template>
  <div class="m-page-list">
    <div class="m-page-list-search">
      <el-form mode="topForm" :inline="true">
        <el-row>
          <el-col :span="6">
            <el-form-item label="产品代码" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.productNbr"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.productName"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工序名称" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.processName"
                @keyup.enter="tableGatherFunc.reLoadTableData"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工序识别码" @submit.prevent>
              <el-input
                type="text"
                v-model="searchForm.processUniqueNbr"
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
        <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">搜索</el-button>

        <el-button
          size="small"
          type="primary"
          plain
          @click="onBatchCheck"
          icon="el-icon-printer"
        >批量检验</el-button>
      </el-col>
    </div>

    <table-extend
      v-bind="tableOption"
      ref="listRef"
      @handleSelectionChange="handleSelectionChange"
      @pageSizeChange="tableGatherFunc.pageSizeChange"
      @currentChange="tableGatherFunc.currentChange"
    >
      <template #col_status="{ data }">
        <span v-if="data.status == 0">未知</span>
        <span v-if="data.status == 10">待检验</span>
        <span v-if="data.status == 20">已检验</span>
      </template>

      <template #operatColumn>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="scope">
            <text-button
              v-if="scope.row.status == 10"
              @click="editDialog.show({ row: scope.row, showType: 4 })"
            >质检汇报</text-button>
            <text-button @click="onCheck(scope)">检验</text-button>
            <text-button @click="editDialog.show({ row: scope.row, showType: 1})">详情</text-button>

          </template>
        </el-table-column>
      </template>
    </table-extend>
    <div class="fixedDialog">
      <el-dialog v-model="editDialog.reactiveData.visible" :destroy-on-close="true" width="1400px">
        <template #title>
          <dialog-title title="新增生产检验"></dialog-title>
        </template>
        <edit ref="editRef" :param="editDialog.reactiveData.param" />
        <template #footer>
          <el-button @click="editDialog.hide()">取消</el-button>
          <el-button
            v-if="editDialog.reactiveData.param.showType == 2 || editDialog.reactiveData.param.showType == 4"
            type="primary"
            @click="editDialog.onConfirm(null)"
          >保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";

import useHook from "@/views/v3/out/useHook";
import edit from "./edit.vue";
import BuzApi from "@/api/controller/prdInspectionApi"
import { routerViewLocationKey } from "vue-router";
import { messageAlert, confirmBox } from "@/utils/utils";
import useDialog from "@/views/v3/out/useDialog";

const emitter =
  getCurrentInstance()?.appContext.config.globalProperties.$emitter;

const { tableOption, tableGatherFunc, searchForm } = useHook({
  _getTableList: BuzApi.GetPageList,
  _tableColums: [
    {
      "label": "状态",
      "prop": "status",
      "minWidth": 100
    },
    {
      "label": "工序识别码",
      "prop": "processUniqueNbr",
      "minWidth": 100
    },
    
    {
      "label": "工序名称",
      "prop": "processName",
      "minWidth": 100
    },
    {
      "label": "产品代码",
      "prop": "productNbr",
      "minWidth": 100
    },
    {
      "label": "产品名称",
      "prop": "productName",
      "minWidth": 100
    },
    {
      "label": "加工单元",
      "prop": "machiningUnitCode",
      "minWidth": 100
    },
    {
      "label": "加工人员",
      "prop": "employeeName",
      "minWidth": 100
    },
    {
      "label": "汇报时间",
      "prop": "reportTime",
      "minWidth": 160
    },
    {
      "label": "汇报数量",
      "prop": "reportQty",
      "width": 180
    },
    {
      "label": "合格数量",
      "prop": "checkQualifiedQty",
      "minWidth": 100
    },
    {
      "label": "不合格数量",
      "prop": "checkUnqualifiedQty",
      "minWidth": 100
    },
    {
      "label": "质检人",
      "prop": "updateBy",
      "minWidth": 100
    },
    {
      "label": "质检时间",
      "prop": "updateTime",
      "minWidth": 180
    },
  ],
  _searchForm: {
    processUniqueNbr: "",
    processName: "",
    productName: "",
    productNbr: ""
  },
});

const listRef = ref(null)
const editRef = ref(null)
const editDialog = useDialog({
  _param: {
    showType: 4, //1查看 2新增  4编辑
    id: '',
    entity: null
  },
  _hide: () => {
    tableGatherFunc.loadTableData();
  },
  _show: ({ row, showType = 0 }) => {
    editDialog.reactiveData.param.showType = showType
    editDialog.reactiveData.param.id = row ? row["id"] : '';
    //如果编辑页单独请求的话,这个不要传
    editDialog.reactiveData.param.entity = { ...row };
    editDialog.reactiveData.visible = true
  },
  _onConfirm: (_rows) => {
    editRef.value.submit().then((res) => {
      tableGatherFunc.reLoadTableData();
      editDialog.reactiveData.visible = false;
    });
  }
})
var editVisible = ref<boolean>(false);

var ids_arr = reactive([])

const handleSelectionChange = (vals) => {
  ids_arr = vals.map(i => i.id)
}
//检验
const onCheck = async(scope) => {
  confirmBox("检验数据", async () => {
    const { row } = scope
    console.log(row)
    const  params  = row.id

    console.log(params)
    var res = await BuzApi.BacthCheck([params]);
    if (res.code == 200) {
      messageAlert('success', '检验成功')
      listRef.value && listRef.value.tableRef.clearSelection()
      tableGatherFunc.reLoadTableData();

    }
  })
}
//批量检验
const onBatchCheck = () => {
  if (ids_arr?.length == 0) {
    messageAlert("error", "请选择要检验的数据");
    return;
  }
  confirmBox("检验数据数据", async () => {
    var res = await BuzApi.BacthCheck(ids_arr);
    if (res.code == 200) {
      messageAlert('success', '检验成功')
      listRef.value && listRef.value.tableRef.clearSelection()
      tableGatherFunc.reLoadTableData();
    }
  })
}

const changeStatus = async (row) => {
  var res = await ChangeStatus([row.id]);
  if (res.code == 200) {
    messageAlert('success', '保存成功')
    tableGatherFunc.reLoadTableData();
  } 
};



onMounted(() => {
  tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
<template>
  <div class="m-page-list">
    <!-- 头部搜索表单 -->
    <div class="m-page-list-search">
      <el-form mode="topForm" :inline="true" label-width="100px" @submit.prevent>
        <el-row>
          <el-col :span="6">
            <el-form-item label="生产订单号">
              <el-input type="text" v-model="searchForm.orderNbr" @keyup.enter="tableGatherFunc.reLoadTableData" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="审核状态">
              <el-select v-model="searchForm.approveStatus" placeholder="请选择" clearable style="width: 100%">
                <el-option label="计划" value="10"></el-option>
                <el-option label="已确认" value="20"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="完成情况">
              <el-select v-model="searchForm.completionStatus" placeholder="请选择" clearable style="width: 100%">
                <el-option label="初始" value="10"></el-option>
                <el-option label="执行中" value="20"></el-option>
                <el-option label="已关闭" value="30"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户名称">
              <el-input type="text" v-model="searchForm.customerName" @keyup.enter="tableGatherFunc.reLoadTableData" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产品名称">
              <el-input type="text" v-model="searchForm.productName" @keyup.enter="tableGatherFunc.reLoadTableData" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 头部工具栏 -->
    <div class="m-page-list-tool-bar">
      <div class="m-page-list-tool-bar-left">
        <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">搜索</el-button>
        <el-button @click="toEdit" type="primary" plain size="small">创建生产订单</el-button>
        <el-button @click="doprintMoreHtml" type="primary" plain size="small">批量打印工单</el-button>

      </div>
      <!-- <div class="m-page-list-tool-bar-right">
        <el-button @click="tableGatherFunc.reLoadTableData" type="primary" plain size="small">导入工单</el-button>
      </div> -->
    </div>
    <!-- 表格数据 -->
    <div class="m-page-list-table" style="height:100%">
      <table-extend v-bind="tableOption" @pageSizeChange="tableGatherFunc.pageSizeChange" @currentChange="tableGatherFunc.currentChange" @handleSelectionChange="handleSelectionChange" ref="listRef">
        <template #col_processSummaryList="{ data }">
          <span class="progress" style="min-width:150px;width:auto;margin:0 3px" v-for="(item,index) in data.processSummaryList" :key="index">

            <el-progress type="circle" :percentage="(Number(item.currentQty)/Number(item.totalQty).toFixed(2))*100" width="50" :color="initColor(item)"></el-progress>
          </span>
        </template>

        <template #operatColumn>
          <el-table-column label="操作" fixed="right" width="120">
            <template #default="scope">
              <text-button @click="editDialogFunc.show(scope.row, 0)">详情</text-button>

              <text-button @click="editDialogFunc.show(scope.row, 2)">编辑</text-button>
              <text-button @click="del([scope.row])">删除</text-button>
              <text-button v-show="scope.row.isHangUp=='1'" @click="hangUp(scope.row,'hangUp')">反挂起</text-button>
              <text-button v-show="scope.row.isHangUp=='0'" @click="hangUp(scope.row,'hangUp')">挂起</text-button>
              <!-- <text-button v-show="scope.row.isHangUp=='0'" @click="hangUp(scope.row,"hangUp")">审核</text-button> -->

              <text-button v-show="scope.row.approveStatus=='30'" @click="hangUp(scope.row,'close')">关闭</text-button>
              <text-button @click="doprintOneHtml(scope.row)">打印工单</text-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>
    </div>
  </div>
  <!-- 新增编辑弹框 -->
  <div class="fixedDialog">
    <el-dialog v-model="editDialog.visible" :destroy-on-close="true" width="1400px" custom-class="dialog_body_padding_5">
      <template #title>
        <dialog-title :title="editDialog.param.showType == 1?'新增生产订单':'编辑生产订单'"></dialog-title>
      </template>
      <edit ref="editRef" :param="editDialog.param" />
      <template #footer>
        <el-button @click="editDialogFunc.hide()">取消</el-button>
        <el-button v-if="editDialog.param.showType == 1 || editDialog.param.showType == 2" type="primary" @click="editDialogFunc.onConfirm">保存</el-button>
      </template>
    </el-dialog>
  </div>
  <!-- 打印表单页面（打印使用） -->
  <print-order-form v-show="false" :form-data-list="printOrderData"></print-order-form>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import printOrderForm from "@/views/v3/windowSelect/printOrderForm.vue";
import edit from "./edit.vue";
import useHook from "@/views/v3/out/useHook";
import usePrint from "@/use/usePrint";
import { messageAlert, confirmBox, renderDictionTag } from "@/utils/utils";
import BuzApi from "@/api/controller/prdOrderApi";
import { changeStatus } from "@/api/workerOrder";
import _Row from "element-plus/lib/components/row";
// 打印数据列表
// 打印相关
const { printHtml } = usePrint();
//编辑表单
const editRef = ref<any>(null);
// 编辑弹框控制
const editDialog = reactive({
  visible: false,
  param: {
    showType: 0, //1新增 0查看  2编辑
    id: "",
    entity: null,
  },
});

const { tableOption, tableGatherFunc, searchForm } = useHook({
  _getTableList: BuzApi.GetPageList,
  _tableColums: [
    {
      label: "生产订单号",
      prop: "orderNbr",
      width: 150,
    },

    {
      label: "销售订单号",
      prop: "saleNbr",
      width: 150,
    },

    // {
    //   label: "审批状态",
    //   prop: "approveStatus",
    //   width: 100,
    // },
    {
      label: "审批状态",
      prop: "approveStatusDesc",
      width: 100,
    },

    // {
    //   label: "完成状态",
    //   prop: "completionStatus",
    //   width: 150,
    // },
    {
      label: "完成状态",
      prop: "completionStatusDesc",
      width: 150,
    },
    {
      label: "工序进度",
      prop: "processSummaryList",
      width: 150,
    },

    {
      label: "客户代码",
      prop: "customerNbr",
      width: 150,
    },
    {
      label: "客户名称",
      prop: "customerName",
      width: 150,
    },

    {
      label: "产品代码",
      prop: "productNbr",
      width: 150,
    },
    {
      label: "产品名称",
      prop: "productName",
      width: 150,
    },
    {
      label: "计划数量",
      prop: "planQty",
      width: 100,
    },
    {
      label: "超产比例%",
      prop: "overRatio",
      width: 100,
    },
    {
      label: "产品工艺代码",
      prop: "routeNbr",
      width: 200,
    },
    {
      label: "产品工艺名称",
      prop: "routeName",
      width: 200,
    },
    {
      label: "计划开始时间",
      prop: "planStartTime",
      width: 160,
    },
    {
      label: "计划结束时间",
      prop: "planEndTime",
      width: 160,
    },
    {
      label: "实际开始时间",
      prop: "actualStartTime",
      width: 160,
    },
    {
      label: "实际完成时间",
      prop: "actualEndTime",
      width: 160,
    },
    {
      label: "创建人",
      prop: "createBy",
      width: 200,
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 160,
    },
    {
      label: "更新人",
      prop: "updateBy",
      width: 200,
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: 160,
    },
  ],
  _searchForm: {
    productName: "",
    customerName: "",
    completionStatus: "",
    approveStatus: "",
    orderNbrL: "",
  },
});

// 控制环形颜色
function initColor(item) {
  const value = (item.currentQty / item.totalQty) * 100;
  if (value == 0) {
    return "orange";
  } else if (value < 80) {
    return "green";
  } else {
    return "blue";
  }
}

const EditDialogFunc = function (dialog, innerRef) {
  return {
    show: (row, _showType) => {
      dialog.param.showType = _showType;
      dialog.param.id = row["id"] || "";
      //如果编辑页单独请求的话,这个不要传
      dialog.param.entity = { ...row };
      dialog.visible = true;
    },
    hide: () => {
      dialog.visible = false;
      tableGatherFunc.loadTableData();
    },
    onConfirm: () => {
      innerRef.value.submit().then((res) => {
        editDialog.visible = false;
        tableGatherFunc.reLoadTableData();
      });
    },
  };
};
// 编辑函数
const editDialogFunc = EditDialogFunc(editDialog, editRef);

//删除
const del = async (rows) => {
  var ids_arr = rows.map((x) => x.id);
  if (ids_arr.length == 0) {
    messageAlert("error", "请至少勾选一行");
    return false;
  }

  confirmBox("删除数据", async () => {
    var res = await BuzApi.Delete(ids_arr);
    if (res.code == 200) {
      messageAlert("success", "删除数据");
      tableGatherFunc.reLoadTableData();
    }
  });
};
// 打印时的打印数据
const printOrderData = ref<any>([]);
// 单个执行打印
function doprintOneHtml(element) {
  printOrderData.value = [{ ...element }];
  // printOrderData.value.push(element);

  printHtml("#print-order-list");
}
// 批量选择
function handleSelectionChange(vals) {
  printOrderData.value = [];
  if (vals.length > 0) {
    for (let index = 0; index < vals.length; index++) {
      const element = vals[index];
      printOrderData.value.push(element);
    }
  } else {
    printOrderData.value = [];
  }
}
const listRef = ref<any>(null);

// 批量打印
function doprintMoreHtml() {
  if (printOrderData.value.length > 0) {
    printHtml("#print-order-list");
    listRef.value && listRef.value.tableRef.clearSelection();
  } else {
    messageAlert("error", "请先选择要打印的工单");
  }
}

//编辑
const toEdit = () => {
  editDialog.param.showType = 1;
  editDialog.param.entity = {};
  editDialog.visible = true;
};
// 挂起--反挂起
function hangUp(row, str) {
  let params = {
    id: row.id,
    actionType: "",
  };
  if (str == "hangUp") {
    params.actionType = row.isHangUp == "0" ? "hangUp" : "reHangUp";
  } else if (str == "close") {
    params.actionType = row.approveStatus == "30" ? "close" : "reClose";
  }
  changeStatus(params).then((res) => {
    if (res.code == 200) {
      messageAlert("success", "操作成功");
      tableGatherFunc.loadTableData();
    }
  });
}

onMounted(() => {
  tableGatherFunc.loadTableData();
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>

<style lang="scss" >
.dialog_body_padding_5 {
  .el-dialog__body {
    padding-top: 0px;
  }
}
</style>

<template>
  <div class="m-page-edit">
    <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
      <rotate-row title="汇报信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工序识别码" prop="processUniqueNbr">
              <el-input v-model="pageData.formData.processUniqueNbr" disabled></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="工序名称">
              <el-input disabled v-model="pageData.formData.processName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品代码">
              <el-input disabled v-model="pageData.formData.productNbr"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品名称">
              <el-input disabled v-model="pageData.formData.productName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工单元">
              <el-input disabled v-model="pageData.formData.machiningUnitName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="加工人员">
              <el-input disabled v-model="pageData.formData.employeeName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汇报数量">
              <el-input disabled v-model="pageData.formData.reportQty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合格数量">
              <el-input disabled v-model="pageData.formData.checkQualifiedQty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不良数量">
              <el-input disabled v-model="pageData.formData.badReasonQty"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="汇报时间">
              <el-input disabled v-model="pageData.formData.reportTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </rotate-row>
      <!-- 不良原因子表添加 -->
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="不良原因" name="badList">
          <div class="table-tool-wrap">
            <el-button
              :disabled="showType == 0"
              @click="subOpenDialogFunc.show()"
              type="primary"
              plain
              size="small"
            >添加</el-button>
          </div>
          <div style="height: 300px">
            <table-extend v-bind="tableOption" >
              <template #operatColumn>
                <el-table-column label="操作" fixed="right">
                  <template #default="scope">
                    <text-button @click="subOpenDialogFunc.show(scope.row, scope.$index)">编辑</text-button>
                    <text-button @click="delSub(scope)">删除</text-button>
                  </template>
                </el-table-column>
              </template>
            </table-extend>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 不良原因弹窗 -->
    <div class="fixedDialog">
      <el-dialog
        v-model="subOpenDialog.visible"
        title="不良原因"
        :param="subOpenDialog.param"
        :destroy-on-close="true"
        width="1400px"
      >
        <sub-one ref="subOpenRef" :param="subOpenDialog.param" />

        <template #footer>
          <el-button @click="subOpenDialogFunc.hide()">取消</el-button>
          <el-button type="primary" @click="subOpenDialogFunc.onConfirm">确定</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import subOne from "./subOne.vue";
import BuzApi from "@/api/controller/prdInspectionApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert, confirmBox } from '@/utils/utils';
import RotateRow from "@/views/v3/components/rotateRow.vue";

import dayjs from 'dayjs'
const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
  status: [{ required: true, message: "该字段必填", trigger: "blur" }],
});

let pageData = reactive({
  formData: {
    ...props.param.entity
  }
});

//获取表单数据
const getFormData = async () => {
  if (props.param.id.length > 0) {
    var res = await BuzApi.GetOne({
      id: props.param.entity.id,
    });

    pageData.formData = res.data

    pageData.formData.checker = pageData.formData.checker || getStorage("nickName")

    tableOption.tableData = res.data.prdReportBadReasonList
  }
};
//获取子表ref
const subOpenRef = ref(null);

// 控制子表的弹框显示
const subOpenDialog = reactive({
  visible: false,
  param: {
    entity: null,
    rowIndex: -1,
  },
});

//子表部分
const tableOption = reactive({
  tableData: [],
  tableColums: [
    {
      "label": "不良原因代码",
      "prop": "badReasonNbr",
      "minWidth": 100
    },
    {
      "label": "不良原因名称",
      "prop": "badReasonName",
      "minWidth": 100
    },
    {
      "label": "不良数量",
      "prop": "badReasonQty",
      "minWidth": 100
    }
  ],
  selectionCol: false,
  paging: false,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});

const SubOpenDialogFunc = function (dialog, dialogRef) {
  return {
    show: (row, index = 0) => {
      if (row) {
        dialog.param.entity = { ...row };
      }
      dialog.param.rowIndex = row ? index : -1;
      dialog.visible = true;
    },
    hide: () => {
      dialog.visible = false;
    },
    onConfirm: () => {
      //接收子表传回来的数据
      var { row, rowIndex } = dialogRef.value.getResult();
      //子表数据
      var _defaultEntity = {
        userId: pageData.formData.id,
        id: null,
        name: "",
        phone: "",
        ...row,
      };
      //
      console.log("43434343",_defaultEntity)
      if (rowIndex == -1) {
        tableOption.tableData.push(_defaultEntity);
        let sum = 0;
        for (let index = 0; index < tableOption.tableData.length; index++) {
          const ele = tableOption.tableData[index];
          sum = sum + Number(ele.badReasonQty);
        }
        pageData.formData.badReasonQty = sum;

      } else {
        tableOption.tableData[rowIndex] = _defaultEntity;
        let sum = 0;
        for (let index = 0; index < tableOption.tableData.length; index++) {
          const ele = tableOption.tableData[index];
          sum = sum + Number(ele.badReasonQty);
        }
        pageData.formData.badReasonQty = sum;
      }
      dialog.visible = false;

    },
  };
};
// watch(pageData.formData.badReasonQty,(value)=>{
//   debugger
//   pageData.formData.checkQualifiedQty=Number(pageData.formData.reportQty)-Number(value)
// })


const subOpenDialogFunc = SubOpenDialogFunc(subOpenDialog, subOpenRef);

//子表删除
const delSub = (scope) => {
  //先直接加一条数据
  // confirmBox("删除数据", async () => {
  var index = scope.$index;
  var arr = [...tableOption.tableData];
  arr.splice(index, 1);
  tableOption.tableData = arr;
  let sum = 0;
  for (let index = 0; index < tableOption.tableData.length; index++) {
    const ele = tableOption.tableData[index];
    sum = sum + Number(ele.badReasonQty);
  }
  pageData.formData.badReasonQty = sum;
  // });
};

watch(
  () => pageData.formData.badReasonQty,

  (value) => {

    pageData.formData.checkQualifiedQty =
      pageData.formData.reportQty - pageData.formData.badReasonQty;

  }
);
const addPageRef = ref<any>(null)
const submit = async () => {
  return new Promise(async (resolve, reject) => {
    addPageRef.value.validate(async (valid: boolean) => {

      var postParam = { ...pageData.formData };
      postParam.reportId = pageData.formData.reportId

      var res = await BuzApi.SaveOrUpdate(postParam);
      if (res.code == 200) {
        messageAlert("success", "保存成功");
        resolve(true);
      }
    });
  });
};
const tabActiveName = ref("badList");

defineExpose({
  submit
})

onMounted(() => {
  getFormData();
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

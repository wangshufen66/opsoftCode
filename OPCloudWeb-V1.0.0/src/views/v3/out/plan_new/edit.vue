<template>
  <div class="m-page-edit">
    <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
      <el-col :span="8">
        <el-form-item label="委外计划单号" prop="title">
          <el-input v-model="pageData.formData.billNo" placeholder="自动生成" clearable disabled></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="供应商代码" prop="supplyId">
          <el-input
            v-model="pageData.formData.supplyCode"
            placeholder="供应商代码"
            @click="openDialog.show()"
            :disabled="showType == 0 || pageData.formData.status == 1"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="供应商名称" prop="title">
          <el-input
            v-model="pageData.formData.supplyName"
            placeholder="供应商代码"
            disabled
            @click="showSupplierDialog"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="申请部门代码" prop="deptId">
          <el-input
            v-model="pageData.formData.deptCode"
            placeholder="申请部门代码"
            @click="openDialog2.show()"
            :disabled="showType == 0 || pageData.formData.status == 1"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="申请部门名称" prop="title">
          <el-input v-model="pageData.formData.deptName" placeholder="申请部门名称" disabled></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="8">
        <el-form-item label="状态" prop="title">
          <el-select
            v-model="pageData.formData.status"
            placeholder="状态"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option label="计划" :value="0"></el-option>
            <el-option label="确认" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-tabs v-model="tabActiveName" style="width: 100%;">
        <el-tab-pane label="委外工序" name="outProcessList">
          <div class="table-tool-wrap">
            <el-button
              :disabled="showType == 0"
              @click="openDialog4.show()"
              type="primary"
              plain
              size="small"
              v-if="pageData.formData.status == 0"
            >添加</el-button>

            <el-button
              :disabled="pageData.formData.status != 1"
              @click="openDialog3.show()"
              type="primary"
              plain
              size="small"
            >批量委外发出</el-button>
          </div>
          <div style="height: 300px">
            <table-extend v-bind="tableOption">
              <template #operatColumn>
                <el-table-column label="操作" fixed="right" width="130">
                  <template #default="scope">
                    <text-button
                      v-if="pageData.formData.status == 0"
                      @click="openDialog4.show(scope.row, scope.$index)"
                    >编辑</text-button>
                    <text-button v-if="pageData.formData.status == 0" @click="delSub(scope)">删除</text-button>
                    <text-button
                      v-if="pageData.formData.status == 1 && scope.row.actualOutQty < scope.row.planOutQty"
                      @click="openDialog3.show(scope.row)"
                    >发出</text-button>
                  </template>
                </el-table-column>
              </template>
            </table-extend>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <div class="fixedDialog">
      <el-dialog v-model="openDialog.visible" destroy-on-close>
        <supplier ref="openDialogRef" :_param="openDialog.param" />
        <template #footer>
          <el-button @click="openDialog.hide">取消</el-button>
          <el-button type="primary" @click.stop="openDialog.onConfirm">保存</el-button>
        </template>
      </el-dialog>
    </div>

    <div class="fixedDialog">
      <el-dialog v-model="openDialog2.visible" destroy-on-close>
        <dept ref="openDialog2Ref" :_param="openDialog2.param" />

        <template #footer>
          <el-button @click="openDialog2.hide">取消</el-button>
          <el-button type="primary" @click.stop="openDialog2.onConfirm">保存</el-button>
        </template>
      </el-dialog>
    </div>

    <div class="fixedDialog">
      <el-dialog width="1400px" v-model="openDialog3.visible" destroy-on-close>
        <mulit-send ref="openDialog3Ref" :_param="openDialog3.param" />
        <template #footer>
          <el-button @click="openDialog3.hide">取消</el-button>
          <el-button type="primary" @click.stop="openDialog3.onConfirm">保存</el-button>
        </template>
      </el-dialog>
    </div>

    <div class="fixedDialog">
      <el-dialog width="1200px" v-model="openDialog4.visible" destroy-on-close title="委外工序">
        <add-process ref="openDialog4Ref" :_param="openDialog4.param" />
        <template #footer>
          <el-button @click="openDialog4.hide">取消</el-button>
          <el-button type="primary" @click.stop="openDialog4.onConfirm">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" >
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// import gx from "./gx.vue";
import supplier from "../ForSelectList/supplier.vue";
import dept from "../ForSelectList/dept.vue";
import mulitSend from "./mulitSend.vue";
import addProcess from "./addProcess.vue";
import dayjs from 'dayjs'
import { messageAlert } from "@/utils/utils";

import { UpdatePlanAndProcess, AddPlanAndProcess, GetPlanDetail, SaveBatch } from "@/api/outApi/index";

var defaultEntity = {
  "id": "",
  "billNo": "",
  "deptId": "",
  "supplyId": "",
  "status": 0,
  "deptName": "",
  "deptCode": "",
  "supplyName": "",
  "supplyCode": "",
  "isAudit": 0,
  "subProcessList": []
};

import {
  SubReceiveInspectionDetail,
  SubReceiveInspectionSave,
} from "@/api/outApi/index";
import { nextTick } from 'process';
import { json } from 'd3-fetch';

export default {
  components: {
    dept,
    supplier,
    mulitSend,
    addProcess
  },
  props: ['_param'],
  setup(props) {

    const { showType, id = '' } = props._param

    const addPageRef = ref<any>(null)

    //验证规则
    const formRules = reactive({
      supplyId: [{ required: true, message: '该字段必填', trigger: 'blur' }],
      deptId: [{ required: true, message: '该字段必填', trigger: 'blur' }],
    });

    //声明响应数据对象
    let pageData = reactive({
      formData: {
        ...defaultEntity,
      }
    })

    //获取数据
    const getFormData = async () => {
      if (id.length > 0) {
        var res = await GetPlanDetail(id)
        pageData.formData = res.data
        tableOption.tableData = res.data.subProcessList
      }
    };

    //提交
    function submit() {
      addPageRef.value.validate(async (valid: boolean) => {
        if (!valid) return;
        else{
      pageData.formData.subProcessList = tableOption.tableData;

        var saveOrUpdate = pageData.formData.id.length > 0 ? UpdatePlanAndProcess : AddPlanAndProcess
        var res = await saveOrUpdate(pageData.formData);
        pageData.formData.subProcessList = []
        }
   

      })
      // return new Promise(async (resolve, reject) => {
      //   pageData.formData.subProcessList = tableOption.tableData;

      //   // addPageRef.value.validate((valid) => {
      //   //   if (valid) {
      //   //     alert('submit!')
      //   //   } else {
      //   //     console.log('error submit!!')
      //   //     return false
      //   //   }
      //   // })
      //   // return false;

      //   var saveOrUpdate = pageData.formData.id.length > 0 ? UpdatePlanAndProcess : AddPlanAndProcess
      //   var res = await saveOrUpdate(pageData.formData);
      //   pageData.formData.subProcessList = []

      //   resolve(res);
      // });
    };

    //统一回调处理
    const commonResultDeal = async (res) => {
      if (res.code == 200) {
        messageAlert('success', "操作成功")
        getFormData()
      } else {
        messageAlert('error', res.msg)
      }
    }

    //供应商
    const openDialogRef = ref(null)
    const openDialog = reactive({
      visible: false,
      show: () => {
        openDialog.visible = true
      },
      hide: () => {
        openDialog.visible = false
      },
      onConfirm: () => {
        var rows = openDialogRef.value?.getResult() || [];
        var row = rows[0]
        pageData.formData.supplyName = row.FSUPPLIER;
        pageData.formData.supplyCode = row.FSUPPLIERNUMBER;
        pageData.formData.supplyId = row.ID;
        openDialog.visible = false;
      },
      param: {
      }
    })

    //部门
    const openDialog2Ref = ref(null)
    const openDialog2 = reactive({
      visible: false,
      show: () => {
        openDialog2.visible = true
      },
      hide: () => {
        openDialog2.visible = false
      },
      onConfirm: () => {
        var rows = openDialog2Ref.value?.getResult() || [];
        var row = openDialog2Ref.value?.getResult()[0];
        pageData.formData.deptName = row.FNAME;
        pageData.formData.deptCode = row.FNUMBER;
        pageData.formData.deptId = row.ID;
        openDialog2.visible = false;
      },
      param: {
        master: [{ id: 1001 }],
        selectedRowKeys: [],
      }
    })


    //委外发出
    const openDialog3Ref = ref(null)
    const openDialog3 = reactive({
      visible: false,
      show: (row) => {
        openDialog3.param.rows = row ? [row] : pageData.formData.subProcessList.filter(x => x.actualOutQty < x.planOutQty)
        openDialog3.visible = true
      },
      hide: () => {
        openDialog3.visible = false
      },
      onConfirm: async () => {
        var rows = openDialog3Ref.value?.getResult() || [];

        var hasZeroRows = rows.filter(x => x.actualOutQtyNew == 0).length > 0
        if (hasZeroRows) {
          messageAlert('error',)
          return false
        }

        var arr = [];
        rows.forEach(row => {
          arr.push({
            outQty: row.actualOutQtyNew,
            processId: row.id,
            outTime: new Date()
          })
        });
        var res = await SaveBatch(arr)
        commonResultDeal(res)
        openDialog3.visible = false;
      },
      param: {
        rows: [],
      }
    })

    //工序添加
    const openDialog4Ref = ref(null)
    const openDialog4 = reactive({
      visible: false,
      show: (row, index) => {
        // 计划数量  已发出数量
        openDialog4.param.entity = row ? row : null
        openDialog4.param.rowIndex = row ? index : -1

        openDialog4.visible = true
      },
      hide: () => {
        openDialog4.visible = false
      },
      onConfirm: async () => {

        var { row, rowIndex } = openDialog4Ref.value?.getResult();

        var defaultEntity = {
          id: "",
          planId: pageData.formData.id || "",
          planOutQty: 0,
          actualOutQty: 0,
          amount: 0,
          rcvQty: null,
          rcvGoodQty: null,
          rcvUnGoodQty: null,
          ...row
        };

        if (rowIndex == -1) {
          tableOption.tableData.push(defaultEntity)

        } else {
          tableOption.tableData[rowIndex] = defaultEntity

        }
        openDialog4.visible = false;
      },
      param: {
        entity: null,
        rowIndex: -1
      }
    })

    //table
    const tabActiveName = ref("outProcessList");

    //委外工序列表
    const tableOption = reactive({
      tableData: pageData.formData.subProcessList,
      tableColums: [
        {
          label: "生产订单号",
          prop: "icmoNbr",
          minWidth: 100,
          comp: "String",
        },
        {
          label: "工序编码",
          prop: "fprocessCode",
          minWidth: 100,
          comp: "String",
        },
        {
          label: "工序名称",
          prop: "fprocessName",
          minWidth: 100,
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
          minWidth: 180,
          comp: "String",
        },

        {
          label: "委外计划数量",
          prop: "planOutQty",
          minWidth: 80,
          comp: "String",
        },
        {
          label: "价格",
          prop: "price",
          minWidth: 80,
          comp: "String",
        },
        {
          label: "金额",
          prop: "amount",
          minWidth: 180,
          comp: "String",
        },
        {
          label: "已发出数量",
          prop: "actualOutQty",
          minWidth: 200,
          comp: "String",
        },
      ],
      selectionCol: false,
      paging: false,
      total: 0,
      tableLoading: false,
      noTableRight: false,
    });

    // 委外工序移除
    const delSub = (scope) => {
      var index = scope.$index;
      var arr = [...tableOption.tableData];
      arr.splice(index, 1);
      tableOption.tableData = arr;
    };

    //批量委外发出
    const multiSend = () => {
      openDialog3.visible.show()
    }

    //数据加载
    onMounted(() => {
      getFormData()
    })

    return {
      pageData,
      formRules,
      submit,
addPageRef,
      openDialog,
      openDialogRef,
      openDialog2,
      openDialog2Ref,
      openDialog3,
      openDialog3Ref,
      openDialog4,
      openDialog4Ref,

      tableOption,
      tabActiveName,
      delSub,
      showType,
      multiSend,

    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

<template>
  <div class="m-page-edit">
    <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="委外检验号" prop="title">
            <el-input v-model="pageData.formData.billNo" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="委外接收单号" prop="title">
            <el-input v-model="pageData.formData.receiveBillNo" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <div class="area-title">
          <div class="area-title-left">
            <div class="area-title-left-icon"></div>
          </div>
          <div class="area-title-content">委外工单信息</div>
          <div class="area-title-right"></div>
        </div>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="生产订单号" prop="title">
            <el-input v-model="pageData.formData.icmoNbr" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品代码" prop="title">
            <el-input v-model="pageData.formData.productCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称" prop="title">
            <el-input v-model="pageData.formData.processName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序编码" prop="title">
            <el-input v-model="pageData.formData.processCode" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序名称" prop="title">
            <el-input v-model="pageData.formData.processName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <div class="area-title">
          <div class="area-title-left">
            <div class="area-title-left-icon"></div>
          </div>
          <div class="area-title-content">委外接收信息</div>
          <div class="area-title-right"></div>
        </div>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="接收数量" prop="title">
            <el-input v-model="pageData.formData.rcvQty" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="合格数" prop="title">
            <el-input v-model="pageData.formData.checkGoodQty" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="不合格数" prop="title">
            <el-input disabled v-model="pageData.formData.checkUnGoodQty" placeholder="不合格数"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="不良原因" name="badList">
          <div class="table-tool-wrap">
            <!-- <el-button @click="refreshCheckUnGoodQty()" type="primary" plain size="small">刷新</el-button> -->
            <el-button
              :disabled="showType == 0"
              @click="openDialog2.show()"
              type="primary"
              plain
              size="small"
            >添加</el-button>
          </div>
          <div style="height: 300px">
            <table-extend v-bind="tableOption">
              <template #operatColumn v-if="showType == 1">
                <el-table-column label="操作" fixed="right">
                  <template #default="scope">
                    <text-button @click="openDialog2.show(scope.row)">编辑</text-button>
                    <text-button @click="delBad(scope)">删除</text-button>
                  </template>
                </el-table-column>
              </template>
            </table-extend>
          </div>
        </el-tab-pane>
      </el-tabs>

      <el-row>
        <div class="area-title">
          <div class="area-title-left">
            <div class="area-title-left-icon"></div>
          </div>
          <div class="area-title-content">检验详情</div>
          <div class="area-title-right"></div>
        </div>
      </el-row>

      <el-row style="margin-top:25px">
        <el-col :span="8">
          <el-form-item label="检验时间" prop="title">
            <el-input v-model="pageData.formData.checkTime" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="检验人" prop="title">
            <el-input v-model="pageData.formData.checker" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="检验状态" prop="title">
            <el-select
              v-model="pageData.formData.status"
              placeholder="状态"
              clearable
              style="width: 100%"
              disabled
            >
              <el-option label="未知" :value="0"></el-option>
              <el-option label="待检验" :value="10"></el-option>
              <el-option label="已检验" :value="20"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="fixedDialog">
      <el-dialog v-model="openDialog2.visible" destroy-on-close>
        <bad ref="supplierRef" :_param="openDialog2.toEntity" />
        <template #footer>
          <el-button @click="openDialog2.visible = false">取消</el-button>
          <el-button type="primary" @click.stop="openDialog2.onConfirm">保存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" >
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
// import gx from "./gx.vue";
// import supplier from "../ForSelectList/supplier.vue";
import bad from "./bad.vue";
import {
  SubReceiveInspectionDetail,
  SubReceiveInspectionSave,
} from "@/api/outApi/index";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'

export default {
  components: {
    // gx,
    bad,
    // supplier,
  },
  props: ['param'],
  setup(props) {
    console.log(props.param);

    const { showType, entity } = props.param

    const formRules = reactive({
      status: [{ required: true, message: "该字段必填", trigger: "blur" }],
    });

    let pageData = reactive({
      formData: {
        ...props.param.entity
      }
    });

    const getFormData = async () => {
      var res = await SubReceiveInspectionDetail({
        id: props.param.entity.id,
      });

      pageData.formData = res.data
      pageData.formData.checkTime = pageData.formData.checkTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
      pageData.formData.checker = pageData.formData.checker || getStorage("nickName")


      tableOption.tableData = res.data.receiveBadReasonList;
    };

    const tableOption = reactive({
      tableData: [],
      tableColums: [
        {
          label: "不良原因代码",
          prop: "reasonCode",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
        {
          label: "不良原因名称",
          prop: "reasonName",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
        {
          label: "不良数量",
          prop: "qty",
          minWidth: 180,
          showOverflowTooltip: true,
          comp: "String",
        },
      ],
      selectionCol: false,
      paging: false,
      total: 0,
      tableLoading: false,
      noTableRight: false,
    });

    const getSumOfCheckUnGoodQty = () => {
      var sum = 0;
      tableOption.tableData.forEach((x) => {
        sum = sum + parseInt('' + x.qty);
      });
      return sum
    };

    const refreshCheckUnGoodQty = () => {
      var sum = getSumOfCheckUnGoodQty()
      pageData.formData.checkUnGoodQty = sum;
      pageData.formData.checkGoodQty = pageData.formData.rcvQty - sum;

    };

    const supplierRef = ref(null);
    const openDialog2 = reactive({
      visible: false,

      show: (row) => {
        openDialog2.toEntity = row ? { ...row } : {
          reasonCode: "",
          reasonName: "",
          qty: 0,
          id: ''
        }
        openDialog2.visible = true
      },
      hidden: () => {

      },
      onConfirm: () => {
        var row = supplierRef.value?.getResult()
        console.log(row, '=====row=====')
        // pageData.formData.supplyName = row.supplyName;
        // pageData.formData.supplyCode = row.supplyCode;
        if (addOrUpdateSub(row)) {
          openDialog2.visible = false;
        }

      },
      toEntity: {

      }
    })

    const addOrUpdateSub = (_to) => {
      //先直接加一条数据
      //tableOption.tableData = res.data.receiveBadReasonList;
      var defaultEntity = {
        inspectId: pageData.formData.id,
        receiveId: pageData.formData.receiveId,
        reasonCode: "BLYY202109080001",
        reasonName: "尺寸不良",
        qty: 2,
        ..._to
      };

      if (_to.id.length > 0) {
        var i = tableOption.tableData.findIndex(x => x.id == _to.id);


        if (i > -1) {
          var findObj = tableOption.tableData[i]
          var hasBadNum = getSumOfCheckUnGoodQty()
          if (pageData.formData.rcvQty < (hasBadNum - findObj.qty + parseInt(defaultEntity.qty))) {
            messageAlert('error', "不合数不得大于接收数量")
            return false;
          }
          tableOption.tableData[i] = _to;
          refreshCheckUnGoodQty();
          return true
        }
      } else {
        var hasBadNum = getSumOfCheckUnGoodQty()
        if (pageData.formData.rcvQty < hasBadNum + parseInt(defaultEntity.qty)) {
          messageAlert('error', "不合数不得大于接收数量")
          return false;
        }
        tableOption.tableData.push(defaultEntity);
        refreshCheckUnGoodQty();
        return true;
      }
    };

    const delBad = (scope) => {
      //先直接加一条数据
      //   tableOption.tableData = res.data.receiveBadReasonList;
      var index = scope.$index;
      var arr = [...tableOption.tableData];
      arr.splice(index, 1);
      tableOption.tableData = arr;
      refreshCheckUnGoodQty();
    };

    const submit = () => {
      return new Promise(async (resolve, reject) => {
        var postParam = { ...pageData.formData }
        postParam.receiveBadReasonList = tableOption.tableData
        var res = await SubReceiveInspectionSave(postParam);

        if (res.code == 200) {
          messageAlert('success', '保存成功')
          resolve(true);
        } else {
          messageAlert('error', res.msg)
        }

      });
    };
    const tabActiveName = ref("badList");

    onMounted(() => {
      getFormData();
    })

    return {
      pageData,
      formRules,
      submit,
      tableOption,
      addOrUpdateSub,
      delBad,
      tabActiveName,
      openDialog2,
      supplierRef,
      refreshCheckUnGoodQty,
      showType
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

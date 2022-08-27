<template>
  <div class="m-page-edit">
    <!-- 新增编辑时表单 -->
    <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px" :disabled="pageData.formData.showType==0">

      <rotate-row title="基本信息">

        <el-col :span="8">
          <el-form-item label="生产订单" prop="orderNbr">
            <el-input v-model="pageData.formData.orderNbr"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="销售单号" prop="saleNbr">
            <el-input v-model="pageData.formData.saleNbr"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="客户ID" prop="title">
            <el-input v-model="pageData.formData.customerId"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="客户编码" prop="customerNbr">
            <el-input v-model="pageData.formData.customerNbr" suffix-icon="el-icon-search" placeholder="请选择" @click.stop="onSelectCustomer"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="pageData.formData.customerName" disabled></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item label="产品Id" prop="title">
            <el-input v-model="pageData.formData.productId"></el-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="产品编码" prop="productNbr">
            <el-input v-model="pageData.formData.productNbr" suffix-icon="el-icon-search" placeholder="请选择" @click.stop="onSelectProduct"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品名称" prop="productName">
            <el-input v-model="pageData.formData.productName" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划数量" prop="planQty">
            <el-input v-model="pageData.formData.planQty" type="Number" :min="0"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="超收比例" prop="overRatio">
            <el-input v-model="pageData.formData.overRatio" type="Number" :min="0"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工艺路线" prop="routeNbr">
            <div class="flex_row_router">
              <el-input v-model="pageData.formData.routeNbr" suffix-icon="el-icon-search" placeholder="请选择" @click.stop="onSelectRoute"></el-input>
              <el-button @click="insertRoute" type="primary">导入工艺路线</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划开始时间" prop="planStartTime">
            <!-- <el-input v-model="pageData.formData.planStartTime"></el-input> -->
            <el-date-picker style="width:100%" v-model="pageData.formData.planStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="计划开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划结束时间" prop="planEndTime">
            <el-date-picker style="width:100%" v-model="pageData.formData.planEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="计划结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="控制工序流转" prop="isControlOrder">
            <el-switch v-model="pageData.formData.isControlOrder" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际开始时间">
            <el-date-picker style="width:100%" v-model="pageData.formData.actualStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="实际开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际结束时间">
            <el-date-picker style="width:100%" v-model="pageData.formData.actualEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="实际结束时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="完成数量">
            <el-input style="width:100%" v-model="pageData.formData.qualifiedQty" type="number"></el-input>
          </el-form-item>
        </el-col>
      </rotate-row>
      <!-- 字表数据 -->
      <rotate-row title="工艺路线">
        <!-- 子表工艺路线新增 -->

        <el-tabs v-model="tabActiveName">
          <el-tab-pane label="工艺路线" name="processList">
            <div class="table-tool-wrap">
              <el-button @click="subOpenDialogFunc.show()" type="primary" plain size="small">添加</el-button>
            </div>
            <div style="height: 300px;width:1300px">
              <table-extend v-bind="subOneTableOption">
                <template #col_isInspect="{ data }">
                  <span v-if="data.isInspect=='0'">否</span>
                  <span v-if="data.isInspect=='1'">是</span>

                </template>
                <template #col_isStart="{ data }">
                  <span v-if="data.isStart=='0'">否</span>
                  <span v-if="data.isStart=='1'">是</span>

                </template>
                <template #col_isAutoReport="{ data }">
                  <span v-if="data.isAutoReport=='0'">否</span>
                  <span v-if="data.isAutoReport=='1'">是</span>

                </template>
                <template #col_isSubout="{ data }">
                  <span v-if="data.isSubout=='0'">否</span>
                  <span v-if="data.isSubout=='1'">是</span>

                </template>
                <template #col_salaryType="{ data }">
                  <span v-if="data.salaryType=='10'">计时工资</span>
                  <span v-if="data.salaryType=='20'">计件工资</span>

                </template>

                <template #operatColumn v-if="pageData.formData.showType!=0">
                  <el-table-column label="操作" fixed="right" width="100">
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

      </rotate-row>

    </el-form>
  </div>
  <!-- 子表弹框 -->
  <div class="fixedDialog">
    <el-dialog v-model="subOpenDialog.visible" :title="subOpenDialog.param.rowIndex==-1?'新增工序':'编辑工序'" :destroy-on-close="true" width="1400px">
      <sub-one ref="subOpenRef" :param="subOpenDialog.param" />
      <template #footer>
        <el-button @click="subOpenDialogFunc.hide()">取消</el-button>
        <el-button type="primary" @click="subOpenDialogFunc.onConfirm(subOpenRef)">确定</el-button>
      </template>
    </el-dialog>
  </div>
  <!-- 开窗选择部分 -->
  <div class="fixedDialog">
    <!-- 客户 -->
    <el-dialog v-model="dialogSelect.customer.visible" title="客户选择" :destroy-on-close="true" width="1400px">
      <customer-list @row-click="customerConfirm" style="height:400px" />
    </el-dialog>
    <!-- 产品--物料 -->
    <el-dialog v-model="dialogSelect.product.visible" title="产品选择" :destroy-on-close="true" width="1400px">
      <material-list @row-click="productConfirm" />
    </el-dialog>

    <!-- 工艺路线 -->
    <el-dialog v-model="dialogSelect.route.visible" title="工艺路线选择" :destroy-on-close="true" width="1400px">
      <route-list @row-click="routeConfirm" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import BuzApi from "@/api/controller/prdOrderApi";
import customerList from "@/views/v3/windowSelect/customerList.vue";
import materialList from "@/views/v3/windowSelect/materialList.vue";
import routeList from "@/views/v3/windowSelect/artRouteList.vue";
import RotateRow from "@/views/v3/components/rotateRow.vue";
import subOne from "./subOne.vue";
import openWindow from "@/views/v3/components/openWindow.vue";
import useHook from "@/views/v3/out/useHook";
import { getStorage, messageAlert, confirmBox } from "@/utils/utils";
import dayjs from "dayjs";
import { getRouteByArtRoute } from "@/api/workerOrder";
const props = defineProps(["param"]);

const { showType, entity } = props.param;

const formRules = reactive({
  orderNbr: [{ required: true, message: "生产订单必填", trigger: "change" }],
  saleNbr: [{ required: true, message: "销售单号必填", trigger: "change" }],
  customerNbr: [{ required: true, message: "客户编码必填", trigger: "change" }],
  customerName: [
    { required: true, message: "客户名称必填", trigger: "change" },
  ],
  productNbr: [{ required: true, message: "产品编码必填", trigger: "change" }],
  productName: [{ required: true, message: "产品名称必填", trigger: "change" }],
  planQty: [{ required: true, message: "计划数量必填", trigger: "change" }],
  overRatio: [{ required: true, message: "超收比例必填", trigger: "change" }],
  routeNbr: [{ required: true, message: "工艺路线必填", trigger: "change" }],
  planStartTime: [
    { required: true, message: "计划开始时间必填", trigger: "change" },
  ],
  planEndTime: [
    { required: true, message: "计划结束时间必填", trigger: "change" },
  ],
  isControlOrder: [
    { required: true, message: "控制工序流转必填", trigger: "change" },
  ],
});
const tabActiveName = ref<string>("processList");
// 页面表单使用的数据
let pageData = reactive({
  formData: {
    ...props.param.entity,
    showType: props.param.showType,
  },
});
//表单对象
const editRef = ref<any>(null);
// 表单弹框显示控制
const editDialog = reactive({
  visible: false,
  param: {
    showType: 0, //1新增 0查看  2编辑
    id: "",
    entity: null,
  },
});

// 控制开窗显示隐藏

const dialogSelect = reactive({
  // 客户
  customer: {
    visible: false,
    customerId: "",
    customerNbr: "",
    customerName: "",
  },
  // 产品物料
  product: {
    visible: false,
    productId: "",
    productNbr: "",
    productName: "",
  },
  // 工艺路线
  route: {
    visible: false,
    routeId: "",
    routeNbr: "",
    routeName: "",
  },
});

// ---客户开窗部分---
function onSelectCustomer() {
  dialogSelect.customer.visible = true;
}
// 客户确认
function customerConfirm(value) {
  pageData.formData.customerId = value[0].id;
  pageData.formData.customerNbr = value[0].customerNbr;
  pageData.formData.customerName = value[0].customerName;
  dialogSelect.customer.visible = false;
}

// ---产品--物料开窗部分---
function onSelectProduct() {
  dialogSelect.product.visible = true;
}
//  产品--物料确认
function productConfirm(value) {
  pageData.formData.productId = value[0].id;
  pageData.formData.productNbr = value[0].materialNbr;
  pageData.formData.productName = value[0].materialName;
  dialogSelect.product.visible = false;
}

// ---工艺路线开窗部分---
function onSelectRoute() {
  dialogSelect.route.visible = true;
}
//  工艺路线确认
function routeConfirm(value) {
  pageData.formData.routeId = value[0].id;
  pageData.formData.routeNbr = value[0].processRouteNbr;
  pageData.formData.routeName = value[0].processRouteName;
  dialogSelect.route.visible = false;
}

// 获取表单数据
const getFormData = async () => {
  if (showType != 1) {
    var res = await BuzApi.GetOne({
      id: props.param.entity.id,
    });

    pageData.formData = res.data;
    pageData.formData.checkTime =
      pageData.formData.checkTime || dayjs().format("YYYY-MM-DD HH:mm:ss");
    pageData.formData.checker =
      pageData.formData.checker || getStorage("nickName");

    // 字表数据赋值
    subOneTableOption.tableData = res.data.processList;
  }
};

// ====子表部分====

const subOneTableOption = reactive({
  tableData: [],
  tableColums: [
    // {
    //   label: "前道工序",
    //   prop: "preProcess",
    //   width: 150,
    // },
    {
      label: "前道工序",
      prop: "preProcessDesc",
      width: 150,
    },
    {
      label: "工序代码",
      prop: "processNbr",
      width: 150,
    },
    {
      label: "工序名称",
      prop: "processName",
      width: 150,
    },
    {
      label: "报工系数",
      prop: "reportCoefficient",
      width: 150,
    },
    {
      label: "计划数量",
      prop: "planQty",
      width: 150,
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
      label: "加工时间/分钟",
      prop: "machiningTime",
      width: 150,
    },
    {
      label: "实际开始时间",
      prop: "actualStartTime",
      width: 160,
    },
    {
      label: "实际结束时间",
      prop: "actualEndTime",
      width: 160,
    },
    {
      label: "实际加工时间/分钟",
      prop: "actualMachiningTime",
      width: 160,
    },

    {
      label: "汇报数量",
      prop: "reportQty",
      width: 150,
    },
    {
      label: "合格数量",
      prop: "qualifiedQty",
      width: 150,
    },
    {
      label: "不合格数量",
      prop: "unqualifiedQty",
      width: 150,
    },
    {
      label: "已派工数量",
      prop: "dispatchedQty",
      width: 150,
    },
    {
      label: "可派工数量",
      prop: "couldDispatchQty",
      width: 150,
    },
    {
      label: "已开工数量",
      prop: "startedQty",
      width: 150,
    },
    {
      label: "可开工数量",
      prop: "couldStartQty",
      width: 150,
    },
    {
      label: "已委外数量",
      prop: "subedQty",
      width: 150,
    },
    {
      label: "标准转换时间/分钟",
      prop: "standardTransformTime",
      width: 200,
    },
    {
      label: "单位标准工时/分钟",
      prop: "standardTime",
      width: 200,
    },
    {
      label: "是否必须开工",
      prop: "isStart",
      width: 200,
    },

    {
      label: "是否自动汇报",
      prop: "isAutoReport",
      width: 200,
    },
    {
      label: "是否可以委外",
      prop: "isSubout",
      width: 200,
    },

    {
      label: "是否必须质检",
      prop: "isInspect",
      width: 200,
    },
    {
      label: "薪资类型",
      prop: "salaryType",
      width: 150,
    },

    {
      label: "单位工资",
      prop: "unitPrice",
      width: 120,
    },
    {
      label: "创建人",
      prop: "createBy",
      width: 150,
    },
    {
      label: "创建时间",
      prop: "createTime",
      width: 160,
    },
    {
      label: "更新人",
      prop: "updateBy",
      width: 150,
    },
    {
      label: "更新时间",
      prop: "updateTime",
      width: 160,
    },
  ],
  paging: false,
  total: 0,
  tableLoading: false,
  border: false,
});
// 开窗对象
const openSelectRef = ref<any>(null);
// 字表表单对象
const subOpenRef = ref<any>(null);
// 控制子表的弹框显示
let subOpenDialog = reactive({
  visible: false,
  param: {
    entity: {},
    rowIndex: -1,
  },
});

const SubOpenDialogFunc = function (dialog, dialogRef) {
  return {
    show: (row, index) => {
      if (row) {
        dialog.param.entity = { ...row };
        dialog.param.entity.preProcess =
          dialog.param.entity.preProcess.split(",");
        dialog.param.entity.preProcessDesc =
          dialog.param.entity.preProcessDesc.split(",");
      } else {
        dialog.param.entity = {};
        dialog.param.entity.preProcess = [];
        dialog.param.entity.preProcessDesc = [];
      }
      // 关联字段值
      dialog.param.entity.linkData = pageData.formData.planQty;

      dialog.param.rowIndex = row ? index : -1;

      dialog.visible = true;
    },
    hide: () => {
      dialog.visible = false;
    },
    onConfirm: async (subOpen) => {
      const { row, rowIndex } = await subOpen.getResult();
      row.preProcess = row.preProcess.join(",");
      row.preProcessDesc = row.preProcessDesc.join(",");

      var _defaultEntity = {
        userId: pageData.formData.id,
        id: null,
        name: "",
        phone: "",
        ...row,
      };
      if (rowIndex == -1) {
        subOneTableOption.tableData.push(_defaultEntity);
      } else {
        subOneTableOption.tableData[rowIndex] = _defaultEntity;
      }
      dialog.visible = false;
    },
  };
};
const subOpenDialogFunc = SubOpenDialogFunc(subOpenDialog, subOpenRef);
// 字表删除
const delSub = (scope) => {
  //先直接加一条数据
  confirmBox("删除数据", async () => {
    var index = scope.$index;
    var arr = [...subOneTableOption.tableData];
    arr.splice(index, 1);
    subOneTableOption.tableData = arr;
  });
};
const addPageRef = ref<any>(null);
const submit = () => {
  return new Promise(async (resolve, reject) => {
    addPageRef.value.validate(async (valid: boolean) => {
      // 走验证
      if (!valid) return;
      pageData.formData.processList = subOneTableOption.tableData;
      var postParam = { ...pageData.formData };
      var res = await BuzApi.SaveOrUpdate(postParam);
      if (res.code == 200) {
        messageAlert("success", "保存成功");
        resolve(true);
      }
    });
  });
};
// 导入工艺路线下的工序
function insertRoute() {
  if (pageData.formData.routeNbr) {
    let params = {
      id: pageData.formData.routeId,
    };

    if (subOneTableOption.tableData.length > 0) {
      confirmBox("您已选择新的工艺路线，是否覆盖原有的工艺路线？", async () => {
        subOneTableOption.tableData = [];
        getRouteByArtRoute(params).then((res) => {
          subOneTableOption.tableData = res.data.routeProcessList;
        });
      });
    } else {
      getRouteByArtRoute(params).then((res) => {
        subOneTableOption.tableData = res.data.routeProcessList;
      });
    }
  }
}

onMounted(() => {
  getFormData();
});

defineExpose({
  submit,
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";

.flex_row_router {
  display: flex;
  flex: 1;

  & > *:last-child {
    margin-left: 10px;
  }
}
</style>

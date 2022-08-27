<template>
  <div class="m-page-edit">
    <el-form :model="pageData.formData" ref="subPageRef" :rules="formRules" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="前道工序" prop="preProcess">
            <el-select v-model="pageData.formData.preProcess" placeholder="请选择" multiple clearable style="width: 100%" @change="preProcessChange()">
              <el-option :label="item.processName" :value="item.id" v-for="(item,index) in preProcess.preProcessList" :key="index"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序编码" prop="processNbr">
            <!-- <el-input v-model="pageData.formData.processNbr" /> -->
            <el-input v-model="pageData.formData.processNbr" suffix-icon="el-icon-search" placeholder="请选择" @click.stop="onSelectProcess"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序名称" prop="processName">
            <el-input v-model="pageData.formData.processName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="报工系数" prop="reportCoefficient">
            <el-input v-model="pageData.formData.reportCoefficient" :min="0" type="number" @input="getPlanQty(pageData.formData.reportCoefficient)" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划数量" prop="planQty">
            <el-input v-model="pageData.formData.planQty" disabled @change="getMatchTime" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="计划开工时间" prop="planStartTime">
            <el-date-picker style="width:100%" v-model="pageData.formData.planStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="计划开工时间" @change="getPlanEnd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划完工时间" prop="planEndTime">
            <el-input style="width:100%" v-model="pageData.formData.planEndTime" disabled />

            <!-- <el-date-picker v-model="pageData.formData.planEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="计划完工时间" >
            </el-date-picker> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="加工时间(分钟)" prop="machiningTime">
            <el-input v-model="pageData.formData.machiningTime" type="number" :min="0" disabled @change="getPlanEnd" />
          </el-form-item>
        </el-col>
      </el-row>
      <template v-if="pageData.formData.rowIndex!=-1">
        <el-row>
          <el-col :span="8">
            <el-form-item label="实际开工时间" prop="actualStartTime">
              <el-date-picker style="width:100%" v-model="pageData.formData.actualStartTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="实际开工时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实际完工时间" prop="actualEndTime">
              <el-date-picker style="width:100%" v-model="pageData.formData.actualEndTime" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" placeholder="实际完工时间">
              </el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="实际加工时间" prop="actualMachiningTime">
              <el-input v-model="pageData.formData.actualMachiningTime" type="number" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="汇报数量" prop="reportQty">
              <el-input v-model="pageData.formData.reportQty" type="number" :min="0" />
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="合格数量" prop="qualifiedQty">
              <el-input v-model="pageData.formData.qualifiedQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不合格数量" prop="unqualifiedQty">
              <el-input v-model="pageData.formData.unqualifiedQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="已派工数量" prop="dispatchedQty">
              <el-input v-model="pageData.formData.dispatchedQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可派工数量" prop="couldDispatchQty">
              <el-input v-model="pageData.formData.couldDispatchQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已开工数量" prop="startedQty">
              <el-input v-model="pageData.formData.startedQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可开工数量" prop="couldStartQty">
              <el-input v-model="pageData.formData.couldStartQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="已委外数量" prop="subedQty">
              <el-input v-model="pageData.formData.subedQty" type="number" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <rotate-row title="生产参数">

        <el-col :span="8">
          <el-form-item label="是否必须开工" prop="isStart">
            <el-switch v-model="pageData.formData.isStart" active-color="#13ce66" inactive-color="#666666" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否可以委外" prop="isSubout">
            <el-switch v-model="pageData.formData.isSubout" active-color="#13ce66" inactive-color="#666666" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否自动汇报" prop="isAutoReport">
            <el-switch v-model="pageData.formData.isAutoReport" active-color="#13ce66" inactive-color="#666666" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否必须质检" prop="isInspect">
            <el-switch v-model="pageData.formData.isInspect" active-color="#13ce66" inactive-color="#666666" active-value="1" inactive-value="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准转换时间（分钟）" prop="standardTransformTime">
            <el-input v-model="pageData.formData.standardTransformTime" @input="getMatchTime" type="number" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位标准工时(分钟)" prop="standardTime">
            <el-input v-model="pageData.formData.standardTime" @input="getMatchTime" type="number" :min="0" />
          </el-form-item>
        </el-col>

      </rotate-row>

      <rotate-row title="工资参数">

        <el-col :span="8">
          <el-form-item label="工资类型" prop="salaryType">

            <el-select v-model="pageData.formData.salaryType" placeholder="请选择" clearable style="width: 100%">
              <el-option label="计时工资" value="10"></el-option>
              <el-option label="计件工资" value="20"></el-option>

            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位工资" prop="unitPrice">
            <el-input v-model="pageData.formData.unitPrice" type="number" :min="0" />
          </el-form-item>
        </el-col>
      </rotate-row>

      <!-- <el-row>
        <el-col :span="8">
          <el-form-item label="模具名称" prop="title">
            <el-input v-model="pageData.formData.mouldName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="模具ID" prop="title">
            <el-input v-model="pageData.formData.mouldId" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="模穴数" prop="title">
            <el-input v-model="pageData.formData.mouldAcupoint" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="描述(备注)" prop="title">
            <el-input v-model="pageData.formData.description" />
          </el-form-item>
        </el-col>
      </el-row> -->
    </el-form>

  </div>
  <!-- 开窗选择部分 -->
  <div class="fixedDialog">
    <!-- 工序 -->
    <el-dialog v-model="dialogSelect.process.visible" title="工序选择" :destroy-on-close="true" width="1400px">
      <process-list @row-click="processConfirm" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed, watch } from "vue";
import processList from "@/views/v3/windowSelect/processList.vue";
import RotateRow from "@/views/v3/components/rotateRow.vue";
import { getPreProcess } from "@/api/workerOrder";
import dayjs from "dayjs";
import { resolve } from "dns";

const props = defineProps(["param"]);

const formRules = reactive({
  preProcess: [{ required: true, message: "前道工序必填", trigger: "change" }],
  processNbr: [{ required: true, message: "工序编码必填", trigger: "change" }],
  processName: [{ required: true, message: "工序名称必填", trigger: "change" }],
  reportCoefficient: [
    { required: true, message: "报工系数必填", trigger: "change" },
  ],
  planQty: [{ required: true, message: "计划数量必填", trigger: "change" }],
  planStartTime: [
    { required: true, message: "计划开工时间必填", trigger: "change" },
  ],
  planEndTime: [
    { required: true, message: "计划完工时间必填", trigger: "change" },
  ],
  machiningTime: [
    { required: true, message: "加工时间必填", trigger: "change" },
  ],
  actualStartTime: [
    { required: true, message: "实际开工时间必填", trigger: "change" },
  ],
  actualEndTime: [
    { required: true, message: "实际完工时间必填", trigger: "change" },
  ],
  actualMachiningTime: [
    { required: true, message: "实际加工时间必填", trigger: "change" },
  ],
  reportQty: [{ required: true, message: "汇报数量必填", trigger: "change" }],
  qualifiedQty: [
    { required: true, message: "合格数量必填", trigger: "change" },
  ],

  unqualifiedQty: [
    { required: true, message: "不合格数量必填", trigger: "change" },
  ],
  dispatchedQty: [
    { required: true, message: "已派工数量必填", trigger: "change" },
  ],
  couldDispatchQty: [
    { required: true, message: "可派工数量必填", trigger: "change" },
  ],
  startedQty: [
    { required: true, message: "已开工数量必填", trigger: "change" },
  ],
  couldStartQty: [
    { required: true, message: "可开工数量必填", trigger: "change" },
  ],
  subedQty: [{ required: true, message: "已委外数量必填", trigger: "change" }],

  isStart: [{ required: true, message: "是否必须开工必填", trigger: "change" }],
  isSubout: [
    { required: true, message: "是否可以委外必填", trigger: "change" },
  ],
  isAutoReport: [
    { required: true, message: "是否自动汇报必填", trigger: "change" },
  ],
  isInspect: [
    { required: true, message: "是否必须质检必填", trigger: "change" },
  ],
  standardTransformTime: [
    { required: true, message: "标准转换时间必填", trigger: "change" },
  ],
  standardTime: [
    { required: true, message: "单位标准工时必填", trigger: "change" },
  ],
  salaryType: [{ required: true, message: "工资类型必填", trigger: "change" }],
  unitPrice: [{ required: true, message: "单位工资必填", trigger: "change" }],
});

let pageData = reactive({
  formData: {
    id: "",
    name: "",
    phone: "",
    ...props.param.entity,
    rowIndex: props.param.rowIndex,
  },
});

const subPageRef = ref<any>(null);
const getResult = () => {
  // 走验证
  return new Promise((resolve, reject) => {
    subPageRef.value.validate(async (valid: boolean) => {
      if (!valid) {
        reject();
        return;
      }
      resolve({
        row: { ...pageData.formData },
        rowIndex: props.param.rowIndex,
      });
    });
  });
  // 不走验证
  // return {
  //   row: { ...pageData.formData },
  //   rowIndex: props.param.rowIndex,
  // };
};
// 控制开窗显示隐藏

const dialogSelect = reactive({
  // 工艺路线
  process: {
    visible: false,
    // processId: "",
    processNbr: "",
    processName: "",
  },
});
// ---工艺路线开窗部分---
function onSelectProcess() {
  dialogSelect.process.visible = true;
}
//  工艺路线确认
function processConfirm(value) {
  // pageData.formData.processId = value[0].id;
  pageData.formData.processNbr = value[0].processNbr;
  pageData.formData.processName = value[0].processName;
  dialogSelect.process.visible = false;
}
// 前道工序
const preProcess = reactive<any>({ preProcessList: [] });
// 获取前道工序列表
function getPreProcessList() {
  let params = {};
  getPreProcess(params).then((res) => {
    preProcess.preProcessList = res.data.records;
  });
}
// 加工系数变动修改计划数量
function getPlanQty(e) {
  pageData.formData.planQty = Number(e) * Number(pageData.formData.linkData);
}
// 监听变化，实时计算数值
watch(
  [() => pageData.formData.planQty, () => pageData.formData.machiningTime],
  (value) => {
    if (value[0]) {
      getMatchTime();
    }
    if (value[1]) {
      getPlanEnd();
    }
  }
);

// 加工时间计算
function getMatchTime() {
  if (
    pageData.formData.planQty &&
    pageData.formData.standardTime &&
    pageData.formData.standardTransformTime
  ) {
    pageData.formData.machiningTime =
      Number(pageData.formData.planQty) *
      (Number(pageData.formData.standardTime) +
        Number(pageData.formData.standardTransformTime));
  }
}
// 计划完工时间
function getPlanEnd() {
  if (pageData.formData.planStartTime && pageData.formData.machiningTime) {
    let planSeconds = new Date(pageData.formData.planStartTime).getTime();
    let machSeconds = Number(pageData.formData.machiningTime) * 60 * 1000;
    let planEndSeconds = planSeconds + machSeconds;
    pageData.formData.planEndTime = dayjs(new Date(planEndSeconds)).format(
      "YYYY-MM-DD hh:mm:ss"
    );
  }
}
function preProcessChange() {
  let preProcessList = preProcess.preProcessList;
  let idList = pageData.formData.preProcess;
  let descList = [];
  for (let index = 0; index < idList.length; index++) {
    const element = idList[index];
    for (let index = 0; index < preProcessList.length; index++) {
      const ele = preProcessList[index];
      if (element == ele.id) {
        descList.push(ele.processName);
      }
    }
  }

  pageData.formData.preProcessDesc = descList;
}

onMounted(() => {
  getPreProcessList();
});
defineExpose({
  getResult,
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

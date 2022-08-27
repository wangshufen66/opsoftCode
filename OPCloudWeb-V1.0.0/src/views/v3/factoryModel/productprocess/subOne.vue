rotate-row<template>
  <div class="m-page-edit">
    <el-form :model="pageData.formData" ref="subPageRef" :rules="formRules" label-width="120px">
      <rotate-row title="控制参数">
        <el-col :span="8">
          <el-form-item label="前道工序" prop="preProcess">
            <!-- <el-input v-model="pageData.formData.preProcess"></el-input> -->
            <el-select
              v-model="pageData.formData.preProcess"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                :label="item.processName"
                :value="item.processNbr"
                v-for="(item,index) in preProcess.preProcessList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序编码" prop="processNbr">
            <!-- <el-input v-model="pageData.formData.processNbr" /> -->
            <el-input
              v-model="pageData.formData.processNbr"
              suffix-icon="el-icon-search"
              placeholder="请选择"
              @click.stop="onSelectProcess"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工序名称" >
            <el-input v-model="pageData.formData.processName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报工系数" prop="machiningCoefficient">
            <el-input v-model="pageData.formData.machiningCoefficient" />
          </el-form-item>
        </el-col>
      </rotate-row>
      <rotate-row title="控制参数">
        <el-col :span="8">
          <el-form-item label="是否必须开工" prop="isStart">
            <el-switch
              v-model="pageData.formData.isStart"
              active-color="#13ce66"
              inactive-color="#666666"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否可以委外" prop="isSubout">
            <el-switch
              v-model="pageData.formData.isSubout"
              active-color="#13ce66"
              inactive-color="#666666"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否自动汇报" prop="isAutoReport">
            <el-switch
              v-model="pageData.formData.isAutoReport"
              active-color="#13ce66"
              inactive-color="#666666"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否必须质检" prop="isInspect">
            <el-switch
              v-model="pageData.formData.isInspect"
              active-color="#13ce66"
              inactive-color="#666666"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准转换时间" prop="standardTransformTime">
            <el-input v-model="pageData.formData.standardTransformTime" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单位标准工时" prop="standardTime">
            <el-input v-model="pageData.formData.standardTime" />
          </el-form-item>
        </el-col>
      </rotate-row>
      <rotate-row title="工资参数">
        <el-row>
          <el-col :span="8">
            <el-form-item label="工资类型" prop="salaryType">
              <el-select v-model="pageData.formData.salaryType">
                <el-option label="计时" value="0"></el-option>
                <el-option label="计件" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位工资" prop="unitPrice">
              <el-input-number
                v-model="pageData.formData.unitPrice"
                :precision="2"
                :step="0.1"
                :max="10"
                :min="1"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </rotate-row>

      <rotate-row title="控制参数">
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
      </rotate-row>
    </el-form>
  </div>
  <!-- 开窗选择部分 -->
  <div class="fixedDialog">
    <!-- 工序 -->
    <el-dialog
      v-model="dialogSelect.process.visible"
      title="开窗选择"
      :destroy-on-close="true"
      width="1400px"
    >
      <process-list @row-click="processConfirm" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import RotateRow from "@/views/v3/components/rotateRow.vue";
import { reactive, ref, onMounted } from "vue";
import processList from "@/views/v3/windowSelect/processList.vue";
import { getPreProcess } from "@/api/workerOrder";

const props = defineProps(["param"]);

const formRules = reactive({
  preProcess: [{ required: true, message: "请选择前道工序", trigger: "blur" }],
  processNbr: [{ required: true, message: "该字段必填", trigger: "blur" }],

  isStart: [{ required: true, message: "该字段必填", trigger: "blur" }],
  isSubout: [{ required: true, message: "该字段必填", trigger: "blur" }],
  isAutoReport: [{ required: true, message: "该字段必填", trigger: "blur" }],
  isInspect: [{ required: true, message: "请输入标准转换时间", trigger: "blur" }],
  standardTransformTime: [
    { required: true, message: "请输入标准转换时间", trigger: "blur" },
  ],
  standardTime: [{ required: true, message: "请输入标准转换工时", trigger: "blur" }],
  salaryType: [{ required: true, message: "选择工资类型", trigger: "blur" }],
  unitPrice: [{ required: true, message: "请输入单位工资", trigger: "blur" }],
});

let pageData = reactive({
  formData: {
    id: "",
    name: "",
    phone: "",
    ...props.param.entity,
  },
});
const subPageRef = ref<any>(null);
const getResult = () => {
  // 走验证
  // subPageRef.value.validate(async (valid: boolean) => {
  //   if (!valid) return;
  //   console.log(pageData.formData);
  //   debugger
  //   return {
  //     row: { ...pageData.formData },
  //     rowIndex: props.param.rowIndex,
  //   };

  // });
  // 不走验证
  console.log(pageData.formData);

  return {
    row: { ...pageData.formData },
    rowIndex: props.param.rowIndex,
  };
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

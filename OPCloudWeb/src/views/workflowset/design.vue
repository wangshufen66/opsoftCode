<template>
  <div class="flow-design">
    <div class="header">
      <!-- 把操作按钮写在这里面 -->
      <el-button icon="el-icon-arrow-left" size="mini" type="info" @click="back">返回</el-button>
      <el-upload action :before-upload="openBpmn">
        <el-button icon="el-icon-folder-opened" size="mini" type="primary">打开模型</el-button>
      </el-upload>
      <el-button icon="el-icon-download" type="primary" @click="download" size="mini">下载</el-button>
      <el-button
        icon="el-icon-folder-checked"
        type="primary"
        @click="save"
        :loading="saveLoading"
        size="mini"
      >保存</el-button>
      <a hidden ref="downloadLink"></a>
    </div>
    <div class="bpmn-container">
      <!-- 画布 -->
      <div class="bpmn-canvas" ref="bpmnCanvas"></div>
      <!-- 工具栏显示的地方 -->
      <tool ref="bpmnPanel"></tool>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  provide,
  reactive,
  ref,
  onUnmounted,
} from "vue";
import usebpmn from "@/use/useBpmn";
import bpmnTemplate from "@/components/bpmn/bpmnTemplate";
import transform from "@/components/bpmn/transform";
import { saveModelEditor, getModelById, getProcessType } from "@/api/flowable";
import tool from "./components/tool.vue";
import { closeRemind, confirmBox } from "@/utils/utils";
import { ElMessage } from "element-plus/lib";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();

const route = useRoute();

const router = useRouter();

const bpmnCanvas = ref<Element | null>(null);
const downloadLink = ref<Element | null>(null);

const saveLoading = ref<boolean>(false);

const isSave = ref<boolean>(false);

//工具栏
const bpmnPanel = ref<any>(null);

//如果没有设置请求头的默认数据
const baseModel = reactive({
  id: "",
  key: "",
  name: "",
  category: "",
  description: "",
});

//创建bpmn模板
const templateStr = computed(() =>
  bpmnTemplate(
    baseModel.key,
    baseModel.name,
    baseModel.category,
    baseModel.description
  )
);
const { init, downloadBpmn, openBpmn, getBpmnData, getProcess, bpmn } = usebpmn(bpmnCanvas, transform);

provide("flow-modeler", bpmn);

function download() {
  downloadBpmn(downloadLink.value as Element);
}

function acceptModelData(params) {
  console.log(params);
  let para = { params: params };
}

//初始化流程图xml
async function getSingleModel() {
  const param = {
    id: route.query.id,
  };
  const res = await getModelById(param);
  const { code, data } = res;
  if (code === 200) {
    baseModel.id = data.id;
    baseModel.key = data.key;
    baseModel.name = data.name;
    baseModel.category = data.category ?? "";
    baseModel.description = data.description;
    init(data.editor ? data.editor : templateStr.value);
    document.querySelector(".bjs-powered-by")?.remove();
  }
}

//保存流程图
function save() {
  saveLoading.value = true;
  store.commit("flowable/setEditStatus", false);
  bpmnPanel.value.formRef.validate(async (val) => {
    if (!val) {
      ElMessage({
        type: "error",
        showClose: true,
        message: "请确认输入的值符合规范",
        duration: 1500,
      });
      saveLoading.value = false;
      return;
    }
    const bpmnRes = await getBpmnData();
    const { xml } = bpmnRes;
    const process = getProcess();
    const { id, name, category, description } = process;
    const params = {
      editor: xml,
      key: id,
      name,
      category,
      description,
      id: baseModel.id,
    };
    const res = await saveModelEditor(params);
    saveLoading.value = false;
    if (res.code === 200) {
      ElMessage({
        type: "success",
        message: "保存成功",
      });
    }
  });
}

//返回模型管理
function back() {
  router.push("/systemset/workflowset/model");
}

onBeforeRouteLeave((to, form, next) => {
  let flag = store.state.flowable.editStatus;
  if (flag) {
    confirmBox("不会保存当前修改", () => {
      next();
    });
  } else {
    next();
  }
});

onMounted(() => {
  getSingleModel();
  closeRemind();
});
onUnmounted(() => {
  window.onbeforeunload = null;
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/design.scss";
</style>

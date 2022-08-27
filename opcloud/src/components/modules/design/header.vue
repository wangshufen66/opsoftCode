<template>
  <div class="desgin-header">
    <div class="left-wrap">{{ title }}</div>
    <div class="right-wrap">
      <el-button-group>
        <!-- 返回 -->
        <el-button icon="el-icon-back" size="small" @click="onBack"
          >返回</el-button
        >
        <!-- 清空 -->
        <el-button icon="el-icon-brush" size="small" @click="onClearHandler"
          >清空</el-button
        >
        <!-- 预览 -->
        <el-button icon="el-icon-view" size="small" @click="onPreview"
          >预览</el-button
        >
        <!-- 暂存 -->
        <el-button
          icon="el-icon-folder-checked"
          size="small"
          :loading="tempSaveLoading"
          @click="onSave(0)"
          >暂存</el-button
        >
        <!-- 保存 -->
        <el-button
          icon="el-icon-folder-checked"
          size="small"
          :loading="saveLoading"
          @click="onSave(1)"
          >保存</el-button
        >
      </el-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { unref, ref, onMounted } from "vue";
import { useDesign } from "@/hooks/use-design";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import useEitter from "@/hooks/use-core/useMitt";
import { confirmBox, getStorage, messageAlert } from "@/shared/utils/utils";

const mitter = useEitter();
const router = useRouter();

const tempSaveLoading = ref<boolean>(false);
const saveLoading = ref<boolean>(false);
const { designType, formConf, currentComponentList, checkComponentCfg } =
  useDesign();

const store = useStore();
const title = ref<string>("");

store.commit("apps/setDesignStatus", true);

function onBack() {
  confirmBox("返回上一页", () => {
    router.go(-1);
  });
}

const onPreview = (): void => {
  // 区分移动端和PC端======================================
  // if(){

  // }else{

  // }
  mitter.emitter.emit("on-formtype-dialog", true);
};

function onClearHandler() {
  confirmBox("清除所有组件", () => {
    store.commit("design/setCurrentComponents", []);
  });
}

const onSave = (type: number): void => {
  type === 1 ? (saveLoading.value = true) : (tempSaveLoading.value = true);
  const components = unref(currentComponentList);
  const result = checkComponentCfg();
  if (!result.status) {
    messageAlert("error", result.message || "", true);
    type === 1 ? (saveLoading.value = false) : (tempSaveLoading.value = false);
    return;
  }
  const params = {
    type: designType.value,
    formConf: unref(formConf),
    components: components,
  };
  mitter.emitter.emit('on-components-save', {
    saveType: type,
    config: params,
    callback: () => {
      type === 1 ? (saveLoading.value = false) : (tempSaveLoading.value = false);
    },
  });
};

onMounted(() => {
  const appName = getStorage('appName');
  const moduleName = getStorage('currentModelName');
  const curPageDesign = getStorage('curPageDesign');

  const pageName = curPageDesign.pageName;
  const subname =
    ((appName && ` - ${appName}`) || "") +
    ((moduleName && ` - ${moduleName}`) || "") +
    ((pageName && ` - ${pageName}`) || "");
  title.value =
    // designType.value === 'baseInfo'
    //   ? `基础信息设计${subname}`
    //   : designType.value === 'H5'
    //   ? `移动端页面设计${subname}`
    //   : `表单设计${subname}`;
    curPageDesign.pageType === 0
      ? `基础信息设计${subname}`
      : `流程表单设计${subname}`;
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/header.scss";
</style>

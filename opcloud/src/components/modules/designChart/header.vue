<template>
  <div class="desgin-header">
    <div class="left-wrap">{{ title }}</div>
    <div class="right-wrap">
      <el-button-group>
        <el-button icon="el-icon-back" size="small" @click="goBack">返回</el-button>
        <el-button icon="el-icon-brush" size="small" @click="onClearHandler">清空</el-button>
        <!-- <el-button icon="el-icon-view" size="small" @click="onPreview">预览</el-button> -->
        <!-- <el-button
          icon="el-icon-folder-checked"
          size="small"
          :loading="tempSaveLoading"
          @click="onSave(0)"
        >暂存</el-button> -->
        <el-button
          icon="el-icon-folder-checked"
          size="small"
          :loading="saveLoading"
          @click="onSave(1)"
        >保存</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { unref, ref, onMounted } from 'vue';

import { useDesignChart } from '@/hooks/use-designChart';
import { getStorage, confirmBox } from '@/shared/utils/utils';
import { useRouter } from "vue-router";
import useEitter from "@/hooks/use-core/useMitt";

const mitter = useEitter();
const router = useRouter();

const { panelConf, currentChartList } = useDesignChart();
/**暂存Loading */
const tempSaveLoading = ref<boolean>(false);
/**保存loading */
const saveLoading = ref<boolean>(false);
/**设计器标题 */
const title = ref<string>('');
/**
 * 预览
 */
function onPreview(): void {
  mitter.emitter.emit('on-report-design-preview', true);
}
/**
 * 保存
 * @param type 保存类型
 */
function onSave(type: number = 0): void {
  type === 0 && (saveLoading.value = true)
    || (tempSaveLoading.value = true);
  const currentChart = unref(currentChartList);
  const panelCfg = unref(panelConf);
  mitter.emitter.emit('on-report-design-save', {
    saveType: type,
    currentChartList: currentChart,
    panelCfg: panelCfg,
    callback: () => {
      type === 1 ? (saveLoading.value = false) : (tempSaveLoading.value = false);
    },
  });
};
/**
 * 返回
 */
function goBack() {
  confirmBox('返回', () => {
    router.go(-1);
  });
}
/**
 * 清空
 */
function onClearHandler() {
  confirmBox("清除所有组件", () => {
    currentChartList.value = []
  });
}

onMounted(() => {
  const appName = getStorage('appName');
  const moduleName = getStorage('currentModelName');
  const curPageDesign = getStorage('curPageDesign');

  const pageName = curPageDesign.pageName;
  const subname =
    ((appName && ` - ${appName}`) || '') +
    ((moduleName && ` - ${moduleName}`) || '') +
    ((pageName && ` - ${pageName}`) || '');
  title.value = `报表页面设计器${subname}`;
});
</script>

<style lang="scss" scoped>
@import "@/styles/modules/designchart/header.scss";
</style>

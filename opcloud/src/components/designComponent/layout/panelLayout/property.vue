<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { reactive } from 'vue';
export default {
  name: 'PanelLayoutProperty',
  props: {
    componentCfg: Object,
  },
  setup(props) {
    const formModel = reactive({});

    const formRules = reactive({});

    return {
      formModel,
      formRules,
    };
  },
};
</script>

<style>
</style>
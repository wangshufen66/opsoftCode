<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="网格行数">
      <el-input v-model:number="componentCfg.__attr__.rowCount" placeholder="设置行数">
      </el-input>
    </el-form-item>
    <el-form-item label="网格列数">
      <el-input v-model:number="componentCfg.__attr__.columnCount" placeholder="设置列数"></el-input>
    </el-form-item>
    <el-form-item>
      <template #label>容器高度
        <el-tooltip placement="bottom">
          <template #content>
            1、默认单位为px，如：200；<br />
            2、可选设置：百分比，如:100%
          </template>
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </template>
      <el-input v-model="componentCfg.__attr__.height" placeholder="设置容器高度" clearable></el-input>
    </el-form-item>
    <!-- <el-form-item label="容器宽度">
      <el-input v-model="componentCfg.__attr__.width" placeholder="设置容器宽度" clearable></el-input>
    </el-form-item> -->
  </el-form>
</template>

<script lang="ts">
import { reactive } from 'vue';
export default {
  name: 'GridLayoutProperty',
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
<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg.__runtime__?.fieldDisabled"></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <el-switch v-model="componentCfg.__config__.defaultValue" :active-value="1" :inactive-value="0" />
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="开启内容">
      <el-input v-model="componentCfg.__config__.activeText" placeholder="设置开启状态下的内容" clearable></el-input>
    </el-form-item>
    <el-form-item label="关闭内容">
      <el-input v-model="componentCfg.__config__.inactiveText" placeholder="设置关闭状态下的内容" clearable></el-input>
    </el-form-item>
    <div class="switch-wrap">
      <el-form-item label="开启颜色">
        <el-color-picker v-model="componentCfg.__attr__['active-color']"></el-color-picker>
      </el-form-item>
      <el-form-item label="关闭颜色">
        <el-color-picker v-model="componentCfg.__attr__['inactive-color']"></el-color-picker>
      </el-form-item>
    </div>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="显示标题">
          <el-switch v-model="componentCfg.__form__.showLabel" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否必填">
          <el-switch v-model="componentCfg.__form__.required" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否禁用">
          <el-switch v-model="componentCfg.__attr__.disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="搜索条件">
          <el-switch v-model="componentCfg.__config__.inSearch" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格展示">
          <el-switch v-model="componentCfg.__config__.inTable" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格排序">
          <el-switch v-model="componentCfg.__config__.tableSort" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表单展示">
          <el-switch v-model="componentCfg.__config__.inForm" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="唯一性">
          <el-switch v-model="componentCfg.__config__.unique" />
        </el-form-item>
      </el-col>
    </div>
    <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
    <property-regex :componentCfg="componentCfg"></property-regex>
  </el-form>
</template>

<script lang="ts">
import { reactive, ref } from "vue";

export default {
  name: "SwitchProperty",
  props: {
    componentCfg: Object,
  },
  setup(props, { emit }) {
    const activeName = ref<string>("0");

    const formModel = reactive({});

    const formRules = reactive({});

    return {
      activeName,
      formModel,
      formRules,
    };
  },
};
</script>

<style>
</style>
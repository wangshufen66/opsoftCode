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
      <el-time-picker v-model="componentCfg.__config__.defaultValue" :type="componentCfg.__config__.type" v-bind="componentCfg.__attr__" style="width:100%;"></el-time-picker>
    </el-form-item>
    <el-form-item label="开始占位文本">
      <el-input v-model="componentCfg.__attr__['start-placeholder']" placeholder="设置开始占位文本" clearable></el-input>
    </el-form-item>
    <el-form-item label="结束占位文本">
      <el-input v-model="componentCfg.__attr__['end-placeholder']" placeholder="设置开始占位文本" clearable></el-input>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <!-- <el-form-item>
      <template #label>时间格式
        <el-tooltip placement="bottom">
          <template #content>
            HH：小时<br />mm：分钟<br />ss：秒<br />ww：周
          </template>
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </template>
      <el-input v-model="componentCfg.__attr__.format" placeholder="设置日期格式" clearable></el-input>
    </el-form-item>-->
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
        <el-form-item label="是否可清空">
          <el-switch v-model="componentCfg.__attr__.clearable" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否可输入">
          <el-switch v-model="componentCfg.__attr__.editable" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否只读">
          <el-switch v-model="componentCfg.__attr__.readonly" />
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
  name: "TimeRangePickerProperty",
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
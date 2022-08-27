<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input
        v-model="componentCfg.__vModel__"
        placeholder="请输入字段名"
        clearable
        :disabled="componentCfg.__runtime__?.fieldDisabled"
      ></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="默认值">
      <span style="display:flex;">
        <el-color-picker
          v-bind="componentCfg.__attr__"
          v-model="componentCfg.__config__.defaultValue"
        ></el-color-picker>
      </span>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider
        v-model="componentCfg.__form__.span"
        :max="24"
        :min="1"
        :marks="{ 6: '', 12: '', 18: '' }"
      />
    </el-form-item>
    <el-form-item label="颜色格式">
      <el-select
        v-model="componentCfg.__attr__['color-format']"
        placeholder="请选择颜色格式"
        @change="colorFormatChange"
      >
        <el-option
          v-for="(item, index) in colorFormatOptions"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
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
import { PropType, reactive, ref } from "vue";
import { colorFormatOptions } from "@/shared/const";
import { ColorPickerComponent } from "./IConfig";

export default {
  name: "ColorPickerProperty",
  props: {
    componentCfg: Object as PropType<ColorPickerComponent>,
  },
  setup(props, { emit }) {
    const activeName = ref<string>("0");

    const formModel = reactive({});

    const formRules = reactive({});

    function colorFormatChange(val: string) {
      if (props.componentCfg) {
        // props.componentCfg.__config__.defaultValue = null;
        val === "hex"
          ? (props.componentCfg.__attr__["show-alpha"] = false)
          : val === "rgb"
            ? (props.componentCfg.__attr__["show-alpha"] = true)
            : false;

        // props.componentCfg.__attr__['show-alpha'] = val.indexOf('a') > -1;
      }
    }

    return {
      activeName,
      formModel,
      formRules,
      colorFormatOptions,
      colorFormatChange,
    };
  },
};
</script>

<style>
</style>
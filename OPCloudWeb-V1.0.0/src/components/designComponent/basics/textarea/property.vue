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
      <el-input v-model="componentCfg.__config__.defaultValue" placeholder="设置默认值" clearable></el-input>
    </el-form-item>
    <el-form-item label="占位文本">
      <el-input v-model="componentCfg.__attr__.placeholder" placeholder="设置占位文本" clearable></el-input>
    </el-form-item>
    <el-form-item label="最大长度">
      <el-input-number v-model="componentCfg.__attr__.maxlength" :min="1" :max="1000" placeholder="设置最大长度" controls-position="right" style="width:100%;"></el-input-number>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item>
      <template #label>
        最小行数
        <el-tooltip content="默认显示最小行数" placement="bottom">
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </template>
      <el-input-number v-model="componentCfg.__attr__.autosize.minRows" :min="1" :max="5" placeholder="设置最小行数" controls-position="right" style="width:100%;"></el-input-number>
    </el-form-item>
    <el-form-item>
      <template #label>
        最大行数
        <el-tooltip content="内容自适应的最大行数，超出显示滚动条" placement="bottom">
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </template>
      <el-input-number v-model="componentCfg.__attr__.autosize.maxRows" :min="1" :max="10" placeholder="设置最大行数" controls-position="right" style="width:100%;"></el-input-number>
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
        <el-form-item>
          <template #label>
            字数统计
            <el-tooltip content="需先设置最大长度" placement="bottom" effect="light">
              <i class="header-icon el-icon-info"></i>
            </el-tooltip>
          </template>
          <el-switch v-model="componentCfg.__attr__['show-word-limit']" />
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
import useEmitter from "@/use/useEitter";
export default {
  name: "TextAreaProperty",
  props: {
    componentCfg: Object,
  },
  setup(props, { emit }) {
    const activeName = ref<string>("0");
    const formModel = reactive({});

    const formRules = reactive({});

    const mitter = useEmitter();

    function openIconsDialog(type: string) {
      mitter.emitter.emit("on-property-setIcon", {
        parent: "__attr__",
        node: type,
      });
    }

    return {
      activeName,
      formModel,
      formRules,
      openIconsDialog,
    };
  },
};
</script>

<style>
</style>
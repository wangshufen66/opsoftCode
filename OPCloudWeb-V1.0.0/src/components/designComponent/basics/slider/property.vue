<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg.__runtime__?.fieldDisabled"></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <!-- <el-form-item label="默认值">
      <el-input v-model="componentCfg.__config__.defaultValue" placeholder="设置默认值" type="number"></el-input>
    </el-form-item>-->
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="最小值">
      <el-input-number v-model="componentCfg.__attr__.min" placeholder="设置最小值" controls-position="right" style="width:100%;"></el-input-number>
    </el-form-item>
    <el-form-item label="最大值">
      <el-input-number v-model="componentCfg.__attr__.max" placeholder="设置最大值" controls-position="right" style="width:100%;"></el-input-number>
    </el-form-item>
    <el-form-item label="步长">
      <el-input-number v-model="componentCfg.__attr__.step" placeholder="设置计步长" controls-position="right" style="width:100%;"></el-input-number>
    </el-form-item>
    <!-- <el-form-item label="竖向模式高度" v-if="componentCfg.__attr__.vertical">
      <el-input v-model="componentCfg.__attr__.height" placeholder="设置竖向模式高度" type="number">
        <template #suffix>px</template>
      </el-input>
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
        <el-form-item label="显示间断点">
          <el-switch v-model="componentCfg.__attr__['show-stops']" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="滑动提示">
          <el-switch v-model="componentCfg.__attr__['show-tooltip']" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="范围选择">
          <el-switch v-model="componentCfg.__attr__.range" />
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="竖向模式">
          <el-switch v-model="componentCfg.__attr__.vertical" />
        </el-form-item>
      </el-col>-->
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
  name: "SliderProperty",
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
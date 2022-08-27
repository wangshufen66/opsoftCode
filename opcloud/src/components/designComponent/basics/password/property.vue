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
      <el-input-number v-model="componentCfg.__attr__.maxlength" :min="1" :max="50" placeholder="设置最大长度" controls-position="right" style="width: 100%"></el-input-number>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="头部图标">
      <el-input v-model="componentCfg.__attr__['prefix-icon']" placeholder="设置最大长度" clearable>
        <template #append>
          <el-button @click="openIconsDialog('prefix-icon')">选择</el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="尾部图标">
      <el-input v-model="componentCfg.__attr__['suffix-icon']" placeholder="设置最大长度" clearable>
        <template #append>
          <el-button @click="openIconsDialog('suffix-icon')">选择</el-button>
        </template>
      </el-input>
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
        <el-form-item label="是否可清空">
          <el-switch v-model="componentCfg.__attr__.clearable" />
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
    <property-compare-component :componentCfg="componentCfg"></property-compare-component>
  </el-form>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import useEmitter from "@/hooks/use-core/useMitt";
export default {
  name: "PasswordProperty",
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

<style></style>

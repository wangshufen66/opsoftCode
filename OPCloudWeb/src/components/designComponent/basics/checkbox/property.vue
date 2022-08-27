<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg.__runtime__?.fieldDisabled">
        <template #append>
          <el-button title="设置外键" icon="el-icon-s-unfold" @click.stop="onSetFielClick"></el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="选项外观">
      <el-radio-group v-model="componentCfg.__config__.optionType">
        <el-radio-button label="default">默认</el-radio-button>
        <el-radio-button label="button">按钮</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="最小选项">
      <el-input-number v-model="componentCfg.__attr__.min" :max="100" :min="1" placeholder="设置最小选项" controls-position="right" style="width: 100%"></el-input-number>
    </el-form-item>
    <el-form-item label="最大选项">
      <el-input-number v-model="componentCfg.__attr__.max" :max="100" :min="1" placeholder="设置最大选项" controls-position="right" style="width: 100%"></el-input-number>
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
        <el-form-item label="显示边框">
          <el-switch v-model="componentCfg.__option__.border" />
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
    <div class="divider-wrap">
      自定义选项
      <el-tooltip placement="bottom">
        <template #content>
          1、自定义选项会被外键配置数据所覆盖;
          <br />
          <br />2、静态数据请使用自定义选项;
        </template>
        <i class="header-icon el-icon-info"></i>
      </el-tooltip>
    </div>
    <draggable :list="componentCfg.options" :animation="340" item-key="value" group="selectItem" draggable=".select-item">
      <template #item="{ element, index }">
        <div class="select-item">
          <div class="close-btn select-line-icon" @click.stop="componentCfg.options.splice(index, 1)">
            <i class="el-icon-remove-outline" />
          </div>
          <div class="select-line-icon option-drag">
            <i class="el-icon-s-operation" />
          </div>
          <el-input placeholder="选项名" size="small" v-model="element.label" />
          <el-input placeholder="选项值" size="small" v-model="element.value" />
        </div>
      </template>
    </draggable>
    <div class="property-additem">
      <el-button class="btn-operate" icon="el-icon-circle-plus-outline" type="text" @click="addSelectItem">添加选项</el-button>
    </div>

    <property-regex :componentCfg="componentCfg"></property-regex>
    <property-penetrate :componentCfg="componentCfg"></property-penetrate>
  </el-form>
</template>

<script lang="ts">
import { PropType, reactive, ref } from "vue";
import draggable from "vuedraggable";
import { CheckComponent } from "./IConfig";
import useEitter from "@/use/useEitter";

export default {
  name: "CheckBoxProperty",
  components: { draggable },
  props: {
    componentCfg: Object as PropType<CheckComponent>,
  },
  setup(props, { emit }) {
    const activeName = ref<string>("0");

    const formModel = reactive({});

    const formRules = reactive({});

    const { emitter } = useEitter();

    function onSetFielClick() {
      emitter.emit("on-property-reltable");
    }

    function addSelectItem() {
      props.componentCfg?.options.push({ label: "", value: "" });
    }

    return {
      activeName,
      formModel,
      formRules,
      onSetFielClick,
      addSelectItem,
    };
  },
};
</script>

<style></style>

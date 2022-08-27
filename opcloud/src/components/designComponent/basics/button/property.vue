<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">

    <el-form-item label="按钮类型">
      <el-select v-model="componentCfg.__attr__.type" placeholder="请选择按钮类型" @change="typeChange">
        <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="按钮大小">
      <el-select v-model="componentCfg.__attr__.size" placeholder="请选择按钮大小" @change="sizeChange">
        <el-option v-for="item in sizeList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

    <el-form-item label="标题设置">
      <el-input v-model="componentCfg.__config__.title" placeholder="设置标题" clearable></el-input>
      <!-- <el-select v-model="componentCfg.__config__.title" placeholder="请选择按钮名称" @change="titleChange">
        <el-option v-for="(item, index) in titleList" :key="index" :label="item.label" :value="item.value" />
      </el-select> -->
    </el-form-item>

    <el-form-item label="事件设置">
      <el-select v-model="componentCfg.__config__.eventCode" placeholder="请选择按钮名称" @change="eventNameChange">
        <el-option v-for="item in eventNameList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </el-form-item>

  </el-form>
</template>

<script lang="ts">
import { PropType, reactive, ref } from 'vue';

import { ButtonComponent } from './IConfig';
import { getBtnEventList } from '@/api/homeApi';
export default {
  name: 'ButtonProperty',
  props: {
    componentCfg: Object as PropType<ButtonComponent>,
  },
  setup(props, { emit }) {
    const formModel = reactive({});

    const formRules = reactive({});

    const formRef = ref<any>(null);

    // 按钮类型列表
    const typeList = ref<any>([
      {
        label: '主要按钮',
        value: 'primary',
      },
      {
        label: '成功按钮',
        value: 'success',
      },
      {
        label: '警告按钮',
        value: 'warning',
      },
      {
        label: '危险按钮',
        value: 'danger',
      },
      {
        label: '信息按钮',
        value: 'info',
      },
      {
        label: '文字按钮',
        value: 'text',
      },
    ]);
    // 按钮大小列表
    const sizeList = ref<any>([
      {
        label: '普通',
        value: 'medium',
      },
      {
        label: '较小',
        value: 'small',
      },
      {
        label: '迷你',
        value: 'mini',
      },
    ]);
    // 按钮名称列表
    const titleList = ref<any>([
      {
        label: '名称',
        value: 'title1',
      },
    ]);
    // 按钮事件列表
    const eventNameList = ref<any>([
      {
        label: '事件1',
        value: 'event1',
      },
    ]);
    // 类型切换
    function typeChange(val: string) {
      if (props.componentCfg) {
        props.componentCfg.__attr__.type = val;
      }
    }
    // 大小切换
    function sizeChange(val: string) {
      if (props.componentCfg) {
        props.componentCfg.__attr__.size = val;
      }
    }
    // 名称切换
    function titleChange(val: string) {
      if (props.componentCfg) {
        props.componentCfg.__config__.title = val;
      }
    }
    // 事件切换
    function eventNameChange(val: string) {
      if (props.componentCfg) {
        props.componentCfg.__config__.eventCode = val;
      }
    }
    // 获取事件列表
    function getEventList() {
      getBtnEventList().then((res) => {
        if (res.code == 200) {
          eventNameList.value = res.data;
        }
      });
    }
    getEventList();
    return {
      formModel,
      formRules,
      formRef,
      titleList,
      titleChange,
      eventNameList,
      eventNameChange,
      typeList,
      typeChange,
      sizeList,
      sizeChange,
      getEventList,
    };
  },
};
</script>

<style>
</style>
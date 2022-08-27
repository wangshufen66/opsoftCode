<template>
  <el-checkbox-group v-model="model[component.__vModel__]" v-bind="component.__attr__" @change="onChange">
    <template v-if="component.__config__.optionType==='default'">
      <el-checkbox v-for="data in component.options" :key="data[component.__props__.value]" v-bind="component.__option__" :label="data[component.__props__.value]">
        {{data[component.__props__.label]}}
      </el-checkbox>
    </template>
    <template v-else>
      <el-checkbox-button v-for="data in component.options" :key="data[component.__props__.value]" v-bind="component.__option__" :label="data[component.__props__.value]">
        {{data[component.__props__.label]}}
      </el-checkbox-button>
    </template>
  </el-checkbox-group>
</template>

<script lang="ts">
import { onBeforeUpdate, PropType } from 'vue';
import { CheckComponent } from './IConfig';

export default {
  name: 'designCheckBox',
  props: {
    component: Object as PropType<CheckComponent>,
    model: Object,
    reloadData: Boolean,
  },
  setup(props) {
    // 更新数据前，检测数据
    onBeforeUpdate(() => {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.model[props.component.__vModel__] || [];
      }
    });
    // change事件
    function onChange(e: string | number | boolean) {
    }

    function init() {
      setModelData(props.component?.__config__.defaultValue);
    }

    function setModelData(value: any[] | undefined | null) {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = value || [];
      }
    }

    init();

    return {
      onChange,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
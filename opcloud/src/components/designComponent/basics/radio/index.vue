<template>
  <el-radio-group v-model="model[component.__vModel__]" v-bind="component.__attr__" @change="onChange">
    <!-- radio 默认样式 -->
    <template v-if="component.__config__.optionType === 'default'">
      <el-radio
        v-for="data in component.options"
        :key="data[component.__props__.value]"
        v-bind="component.__option__"
        :label="data[component.__props__.value]"
      >
        {{ data[component.__props__.label] }}
      </el-radio>
    </template>
    <!-- button样式 -->
    <template v-else>
      <el-radio-button
        v-for="data in component.options"
        :key="data[component.__props__.value]"
        v-bind="component.__option__"
        :label="data[component.__props__.value]"
      >
        {{ data[component.__props__.label] }}
      </el-radio-button>
    </template>
  </el-radio-group>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';
import { RadioComponent } from './IConfig';

export default {
  name: 'designRadio',
  props: {
    component: Object as PropType<RadioComponent>,
    model: Object,
  },
  setup(props) {
    // change事件
    function onChange(e: string | number | boolean) {}

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = props.component?.__config__.defaultValue || undefined;
      }
    }

    onMounted(() => {
      init();
    });
    return {
      onChange,
    };
  },
};
</script>

<style lang="scss" scoped></style>

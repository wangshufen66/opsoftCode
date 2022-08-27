<template>
  <el-color-picker v-bind="component.__attr__" v-model="model[component.__vModel__]"></el-color-picker>
</template>

<script lang="ts">
import { onMounted, PropType } from 'vue';
import { ColorPickerComponent } from './IConfig';

export default {
  name: 'designColorPicker',
  props: {
    component: Object as PropType<ColorPickerComponent>,
    model: Object,
  },
  setup(props) {
    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component?.__config__.defaultValue || undefined;
      }
    }

    onMounted(() => {
      init();
    });
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>
<template>
  <el-slider v-bind="component.__attr__" v-model="model[component.__vModel__]"></el-slider>
</template>

<script lang="ts">
import { onMounted, PropType } from 'vue';
import { SliderComponent } from './IConfig';

export default {
  name: 'designSlider',
  props: {
    component: Object as PropType<SliderComponent>,
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
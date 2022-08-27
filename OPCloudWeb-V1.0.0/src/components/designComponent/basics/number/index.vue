<template>
  <el-input-number v-bind="component.__attr__" v-model="modelValue"></el-input-number>
</template>

<script lang="ts">
import { PropType, onMounted, computed } from 'vue';
import { NumberComponent } from './IConfig';

export default {
  name: 'designNumber',
  props: {
    component: Object as PropType<NumberComponent>,
    model: Object,
  },
  setup(props) {

    const modelValue = computed({
      get() {
        return props.model[props.component.__vModel__] || 0;
      },
      set(value) {
        props.model[props.component.__vModel__] = value;
      }
    })

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component?.__config__.defaultValue || 0;
      }
    }

    onMounted(() => {
      init();
    });

    return {
      modelValue
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
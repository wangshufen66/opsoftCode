<template>
  <el-time-picker v-model="model[component.__vModel__]" v-bind="component.__attr__">
  </el-time-picker>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';
import { TimePickerComponent } from './IConfig';

export default {
  name: 'designTimePicker',
  props: {
    component: Object as PropType<TimePickerComponent>,
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
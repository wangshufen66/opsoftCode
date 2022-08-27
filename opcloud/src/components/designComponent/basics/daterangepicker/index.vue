<template>
  <el-date-picker v-model="model[component.__vModel__]" :type="component.__config__.type" v-bind="component.__attr__">
  </el-date-picker>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';
import { DateRangePickerComponent } from './IConfig';

export default {
  name: 'designDateRangePicker',
  props: {
    component: Object as PropType<DateRangePickerComponent>,
    model: Object,
  },
  setup(props) {
    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component.__config__.defaultValue || undefined;
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
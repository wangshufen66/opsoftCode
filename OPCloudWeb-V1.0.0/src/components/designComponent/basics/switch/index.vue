<template>
  <el-switch v-model="model[component.__vModel__]" v-bind="component.__attr__">
  </el-switch>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';
import { SwitchComponent } from './IConfig';

export default {
  name: 'designSwitch',
  props: {
    component: Object as PropType<SwitchComponent>,
    model: Object,
  },
  setup(props) {
    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        const defaultValue = props.component?.__config__.defaultValue;
        props.model[props.component.__vModel__] = defaultValue;
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
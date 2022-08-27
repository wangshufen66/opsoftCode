<template>
  <el-input show-password v-bind="component.__attr__" v-model="model[component.__vModel__]"></el-input>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';
import { PasswordComponent } from './IConfig';

export default {
  name: 'designPassword',
  props: {
    component: Object as PropType<PasswordComponent>,
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
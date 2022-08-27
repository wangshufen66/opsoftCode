<template>
  <el-input v-bind="component.__attr__" v-model="model[component.__vModel__]">
  </el-input>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { InputComponent } from "./IConfig";

export default {
  name: "designInput",
  props: {
    component: Object as PropType<InputComponent>,
    model: Object,
  },
  setup(props) {
    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component?.__config__.defaultValue || undefined;
      }
    }

    init();
    return {};
  },
};
</script>

<style lang="scss" scoped></style>

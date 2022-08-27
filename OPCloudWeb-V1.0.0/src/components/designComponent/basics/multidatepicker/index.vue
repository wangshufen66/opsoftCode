<template>
  <el-date-picker
    v-model="model[component.__vModel__]"
    :type="component.__config__.type"
    v-bind="component.__attr__"
  >
  </el-date-picker>
</template>

<script lang="ts">
import { PropType, onMounted, ref } from "vue";
import { MultiDatePickerComponent } from "./IConfig";
import dayjs from "dayjs";

export default {
  name: "designMultiDatePicker",
  props: {
    component: Object as PropType<MultiDatePickerComponent>,
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

<style lang="scss" scoped></style>

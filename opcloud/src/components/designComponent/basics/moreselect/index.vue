<template>
  <el-select ref="select" v-bind="component.__attr__" v-model="model[component.__vModel__]">
    <el-option v-for="item in component.options" :key="item.value" :value="item[component.__props__.value]" :label="item[component.__props__.label]">
      <template v-if="component.__customExpression__">
        <span>{{ getNode(item) }}</span>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { nextTick, PropType, watch } from "vue";
import { MoreSelectComponent } from "./IConfig";

export default {
  name: "designMoreSelect",
  props: {
    component: Object as PropType<MoreSelectComponent>,
    model: Object,
  },
  setup(props) {
    watch(
      () => props.component.__attr__.multiple,
      (value) => {
        nextTick(() => {
          props.model[props.component.__vModel__] = value ? [] : undefined;
        });
      }
    );

    // 自定义节点
    function getNode(item: any): string {
      const custom = <string>props.component?.__customExpression__;
      return custom.replace(/(\{(\w+)\})/g, (w: string) => {
        return item[w.replace("{", "").replace("}", "")];
      });
    }

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component?.__config__.defaultValue || undefined;
      }
    }

    init();

    return { getNode };
  },
};
</script>

<style lang="scss" scoped></style>

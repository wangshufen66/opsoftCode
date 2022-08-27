<template>
  <el-cascader v-model="model[component.__vModel__]" v-bind="component.__attr__">
    <template #default="{ node, data }" v-if="component.__customExpression__">
      <span>{{ getNode(node, data) }}</span>
    </template>
  </el-cascader>
</template>

<script lang="ts">
import { PropType, onMounted } from 'vue';
import { CascaderComponent } from './IConfig';

export default {
  name: 'designCascader',
  props: {
    component: Object as PropType<CascaderComponent>,
    model: Object,
  },
  setup(props) {
    // 自定义节点
    function getNode(node: any, data: any): string {
      const custom = <string>props.component?.__customExpression__;
      return custom.replace(/(\{(\w+)\})/g, (w: string) => {
        return data[w.replace('{', '').replace('}', '')];
      });
    }

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = undefined;
      }
    }

    onMounted(() => {
      init();
    });

    return { getNode };
  },
};
</script>

<style lang="scss" scoped>
</style>
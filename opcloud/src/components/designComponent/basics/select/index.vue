<template>
  <el-select
    ref="select"
    v-bind="component.__attr__"
    v-model="model[component.__vModel__]"
    @change="onChange"
  >
    <el-option
      v-for="item in component.options"
      :key="item.value"
      :value="item[component.__props__.value]"
      :label="item[component.__props__.label]"
    >
      <template v-if="component.__customExpression__">
        <span>{{ getNode(item) }}</span>
      </template>
    </el-option>
  </el-select>
</template>

<script lang="ts">
import { nextTick, PropType, watch, inject } from 'vue';
import { SelectComponent } from './IConfig';
import useEitter from '@/hooks/use-core/useMitt';
import { ModuleFormProvide } from '@/hooks/use-form';

export default {
  name: 'designSelect',
  props: {
    component: Object as PropType<SelectComponent>,
    model: Object,
  },
  setup(props) {

    const moduleForm = inject<ModuleFormProvide>('moduleForm', {} as ModuleFormProvide);

    const mitter = useEitter();

    watch(
      () => props.component.__attr__.multiple,
      (value) => {
        nextTick(() => {
          props.model[props.component.__vModel__] = value ? [] : undefined;
        })
      }
    );

    // 自定义节点
    function getNode(item: any): string {
      const custom = <string>props.component?.__customExpression__;
      return custom.replace(/(\{(\w+)\})/g, (w: string) => {
        return item[w.replace('{', '').replace('}', '')];
      });
    }

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component?.__config__.defaultValue || undefined;
      }
    }

    function onChange(e) {
      // 检测组件是否有联动设置
      const relConfig = props.component.__config__.relComponent
      if (relConfig) {
        mitter.emitter.emit('on-select-change', {
          value: e,
          /**所属表单的组件列表 */
          components: moduleForm?.formComponents || [],
          componentCfg: props.component,
        })
      }
    }

    init();

    return {
      getNode,
      onChange
    };
  },
};
</script>

<style lang="scss" scoped></style>

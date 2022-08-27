<template>
  <template v-if="component.__attr__['reset-create'] === true">
    <el-input v-bind="component.__attr__" v-model="model[component.__vModel__]">
      <template #suffix>
        <i class="el-icon-refresh" @click.stop="onRefresh"></i>
      </template>
    </el-input>
  </template>
  <template v-else>
    <el-input v-bind="component.__attr__" v-model="model[component.__vModel__]"></el-input>
  </template>
</template>

<script lang="ts">
import { onMounted, PropType } from 'vue';
import { AutoCodeComponent } from './IConfig';
import useEitter from '@/hooks/use-core/useMitt';

export default {
  name: 'designAutoCode',
  props: {
    component: Object as PropType<AutoCodeComponent>,
    model: Object,
  },
  setup(props) {
    const mitter = useEitter();

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = null;
      }
    }

    /**
     * 重新生成编码，外部需要提供事件定义
     */
    function onRefresh() {
      mitter.emitter.emit('on-create-autocode', {
        component: props.component,
        formModel: props.model,
        tableId: props.component.autorule.tableId
      });
    }

    onMounted(() => {
      init();
    });

    return {
      onRefresh,
    };
  },
};
</script>

<style lang="scss" scoped>
.el-icon-refresh {
  cursor: pointer;
}
</style>
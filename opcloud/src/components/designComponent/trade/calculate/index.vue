<template>
  <template v-if="component?.__config__.resultType === 2">
    <el-input v-bind="component?.__attr__" v-model="modelValue">
      <template #append>%</template>
    </el-input>
  </template>
  <el-input v-else v-bind="component?.__attr__" v-model="modelValue"></el-input>
</template>

<script lang="ts">
import { messageAlert } from '@/shared/utils/utils';
import { onMounted, PropType, computed } from 'vue';
import { CalculateComponent } from './IConfig';

export default {
  name: 'designCalculate',
  props: {
    component: Object as PropType<CalculateComponent>,
    model: Object,
  },
  setup(props) {

    const modelValue = computed(() => {
      const { decimalSize, formula, resultType } = props.component.__config__;

      const params: string[] = []

      const _formula = formula && formula.replace(/#\{(.*?)\}/g, (...args: Array<any>) => {
        params.push(args[1]);
        return args[1] = props.model[args[1]] || 0
      });
      if (params.find(f => props.model[f] == undefined)) {
        props.model[props.component.__vModel__] = undefined;
        return undefined
      }
      if (params.find(f => !/^\d+(.\d+)?$/.test(props.model[f] || 0))) {
        messageAlert('error', '运算错误，请输入合法的数值');
        props.model[props.component.__vModel__] = undefined;
        return undefined;
      }
      let value = eval(_formula);
      if (isNaN(value)) {
        messageAlert('error', '运算错误，请输入合法的数值');
        props.model[props.component.__vModel__] = undefined;
        return undefined;
      }
      // 百分比
      if (resultType === 2) {
        value = value * 100
      }
      value = Number(value.toFixed(decimalSize));
      props.model[props.component.__vModel__] = value;
      return value;
    })

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] =
          props.component?.__config__.defaultValue || undefined;
      }
    }

    onMounted(() => {
      init();
    });

    return {
      modelValue
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
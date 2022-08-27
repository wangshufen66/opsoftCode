<template>
  <el-input v-bind="component?.__attr__" v-model="model[component.__vModel__]"></el-input>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { DateCriticalityComponent } from './IConfig';

export default {
  name: 'designDateCriticality',
  props: {
    component: Object as PropType<DateCriticalityComponent>,
    model: Object,
  },
  setup(props) {
      
    return {};
  },
};
</script>

<style>
</style>
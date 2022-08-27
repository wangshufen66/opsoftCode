<template>
  <el-button v-bind="component.__attr__">{{component.__config__.title}}</el-button>
</template>

<script lang="ts">
import { onMounted, PropType, ref } from 'vue';
import { ButtonComponent } from './IConfig';

export default {
  name: 'designButton',
  props: {
    component: Object as PropType<ButtonComponent>,
  },
  setup(props) {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>
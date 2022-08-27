<template>
  <template>
    这是自增加组件的区域
  </template>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { CustomAddComponent } from './IConfig';
export default {
  name: 'designCustomAdd',
  props: {
    component: Object as PropType<CustomAddComponent>,
    model: Object,
  },
  setup(props) {
    console.log('这是自增加组件的区域');

    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>

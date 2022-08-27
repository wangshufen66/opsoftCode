<template>
  <div class="template_container">
    <component-list></component-list>
    <template-main></template-main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import componentList from './components.vue';
import templateMain from './main.vue';

const props = defineProps({})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/printTemplate/index.scss";
</style>
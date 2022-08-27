<template>
  <div class="print-template-container">
    <design-header></design-header>
    <main>
      <component-list></component-list>
      <template-main></template-main>
      <div class="params_wrap" id="params_content"></div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, provide } from 'vue';
import designHeader from "@/components/modules/printTemplate/header.vue";
import componentList from '@/components/modules/printTemplate/components.vue';
import templateMain from '@/components/modules/printTemplate/main.vue';
import { PaperType } from '@/components/modules/printTemplate/type';

const currentPaperType = ref<PaperType>(PaperType.A4);

provide('print-template', {
  currentPaperType
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/printTemplate/index.scss";
</style>
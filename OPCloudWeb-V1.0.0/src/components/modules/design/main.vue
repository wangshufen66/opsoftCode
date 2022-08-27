<template>
  <el-scrollbar class="desgin-main-wrap scrollbar">
    <!-- 基础信息表单设计器 -->
    <template v-if="designType==='baseInfo'">
      <form-design></form-design>
    </template>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import { useDesign } from '@/use/useDesign';
import formDesign from '@/components/draggable/formDesign/index.vue';

const { designType } = useDesign();
</script>

<style lang="scss">
@import '@/styles/modules/design/main.scss';
</style>
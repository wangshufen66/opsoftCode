<template>
  <div class="custom-header">
    <img src="../../assets/images/_logo.png" class="dialog-title-img" />
    <span class="dialog-title-span">{{ title }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'dialogTitle',
  components: {},
  props: {
    title: String,
  },
  setup() {
    return {};
  },
});
</script>

<style>
@import "@/styles/components/dialogTitle.scss";
</style>
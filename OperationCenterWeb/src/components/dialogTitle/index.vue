<template>
  <span class="dialog-title-span">{{ dialogTitle }}</span>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';


export default defineComponent({
  name: 'dialogTitle',
  components: {},
  props: {
    dialogTitle: String,
  },
  setup() {
    return {

    };
  },
});
</script>

<style>
@import "@/styles/modules/dialogTitle/dialogTitle.scss";
</style>
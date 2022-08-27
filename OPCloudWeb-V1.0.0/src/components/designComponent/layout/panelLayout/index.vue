<template>
  <div class="panel-layout-wrap"></div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { PanelLayoutComponent } from './IConfig';

export default {
  name: 'designPanelLayout',
  props: {
    component: Object as PropType<PanelLayoutComponent>,
    model: Object,
  },
  setup(props) {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.panel-layout-wrap {
  height: 150px;
}
</style>

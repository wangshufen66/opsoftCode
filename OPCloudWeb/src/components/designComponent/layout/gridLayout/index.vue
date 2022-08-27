<template>
  <div class="grid-layout-wrap" :style="style"></div>
</template>

<script lang="ts">
import { computed, PropType } from 'vue';
import { GridLayoutComponent } from './IConfig';

export default {
  name: 'designGridLayout',
  props: {
    component: Object as PropType<GridLayoutComponent>,
  },
  setup(props) {
    const style = computed(() => {
      const height = props.component?.__attr__.height;
      const width = props.component?.__attr__.width;
      const _style = {
        'grid-template-columns': `repeat(auto-fill, ${
          props.component?.__attr__.columnCount || 1
        }fr)`,
        'grid-template-rows': `repeat(auto-fill, ${
          props.component?.__attr__.rowCount || 1
        }fr)`,
        height: (<string>height).indexOf('%') > -1 ? height : `${height}px`,
        width: (<string>width).indexOf('%') > -1 ? width : `${width}px`,
      };
      return _style;
    });

    return { style };
  },
};
</script>

<style lang="scss" scoped>
.grid-layout-wrap {
  display: grid;
  gap: 10px;
}
</style>
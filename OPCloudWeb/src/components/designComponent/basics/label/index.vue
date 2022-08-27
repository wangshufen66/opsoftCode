<template>
  <div class="title-item" :style="style">
    <div
      class="highlight"
      v-if="component.__attr__.prefixLine"
      :style="highlightStyle"
    ></div>
    <i v-else :class="component.__attr__['prefix-icon']"></i>
    {{ component.__config__.label }}
  </div>
</template>

<script lang="ts">
import { computed, PropType } from 'vue';
import { LabelComponent } from './IConfig';

export default {
  name: 'designLabel',
  props: {
    component: Object as PropType<LabelComponent>,
    model: Object,
  },
  setup(props) {
    const style = computed(() => {
      const { fontSize, fontColor, italic, bold, bgcolor } =
        props.component.__attr__;
      return {
        fontSize: `${fontSize}px`,
        color: fontColor,
        fontStyle: italic && 'italic',
        fontWeight: bold && 'bold',
        'background-color': bgcolor ? bgcolor : 'transparent',
      };
    });
    const highlightStyle = computed(() => {
      const { prefixLineColor, prefixLineWidth, fontSize } =
        props.component.__attr__;
      return {
        'background-color': prefixLineColor,
        width: `${prefixLineWidth}px`,
        height: `${fontSize}px`,
      };
    });
    return { style, highlightStyle };
  },
};
</script>

<style lang="scss" scoped>
.title-item {
  display: flex;
  align-items: center;
  padding: 0 5px;
  i {
    color: #999;
    margin-right: 8px;
  }
}
.highlight {
  margin-right: 10px;
}
</style>

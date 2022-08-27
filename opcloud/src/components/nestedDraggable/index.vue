<template>
  <draggable class="design-board" :list="componentList" item-key="componentId" group="componentsGroup" :sort="true" :animation="340">
    <template #item="{ element }">
      <div class="design-item-container">
        <slot name="item" :element="element"></slot>
        <template v-if="element.componentList&&element.componentList.length>0">
          <nested-draggable :componentList="element.componentList" />
        </template>
      </div>
    </template>
  </draggable>
</template>

<script lang="ts">
import draggable from 'vuedraggable';

export default {
  name: 'nestedDraggable',
  components: { draggable },
  props: {
    componentList: {
      require: true,
      type: Array,
    },
  },
  setup() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.design-item-container {
  display: flex;
  flex: 1;
}
</style>
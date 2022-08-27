<template>
  <draggable class="design-board" :list="itemList" item-key="componentId" group="componentsGroup" :sort="true" :animation="400">
    <template #item="{ element }">
      <slot name="item" :config="element"></slot>
    </template>
  </draggable>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive } from 'vue';
import draggable from 'vuedraggable';
import { DesignComponent } from '@/components/designComponent';

export default defineComponent({
  name: 'loopDraggable',
  components: { draggable },
  props: {
    itemList: Object as PropType<DesignComponent[]>,
  },
  setup() {
    const formModel = reactive({});

    return {
      formModel,
    };
  },
});
</script>

<style>
</style>
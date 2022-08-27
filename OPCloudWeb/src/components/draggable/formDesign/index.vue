<!-- 表单设计 -->
<template>
  <el-form class="desgin-main-form" :model="formModel" :size="formConf.size" :label-position="formConf.labelPosition" :disabled="formConf.disabled" :label-width="`${formConf.labelWidth}px`">
    <draggable class="design-board" :list="currentComponentList" item-key="componentId" group="componentsGroup" :sort="true" :animation="400">
      <template #item="{ element }">
        <template v-if="element.__config__.isLayout !== true">
          <draggable-item :itemConfig="element" :formModel="formModel">
          </draggable-item>
        </template>
        <template v-else>
          <component :is="element.componentTag" :model="formModel" :component="element"></component>
        </template>
      </template>
    </draggable>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { useDesign, useActiveDesignComponent } from '@/use/useDesign';
import draggable from 'vuedraggable';
// import formDrag from './../index.vue';
import draggableItem from './formItem.vue';

const { formConf, currentComponentList } = useDesign();
const formModel = reactive({});
</script>

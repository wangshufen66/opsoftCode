<template>
  <el-col class="design-board-item" :span="formItem?.span" @click.stop="onActiveComponentHandler()" @mouseenter="mouseenter=true" @mouseleave="mouseenter=false">
    <el-form-item :class="{
        'active-form-item': itemConfig.componentId === activeComponentId,
      }" :label="(formItem.showLabel && formItem.label) || ''" :required="formItem?.required" :label-width="getLabelWidth()">
      <component :is="itemConfig.componentTag" :model="formModel" :component="itemConfig">
      </component>
    </el-form-item>
    <span class="oper-button-wrap">
      <i v-if="itemConfig.componentId === activeComponentId || mouseenter" class="right-oper-icon el-icon-document-copy icon-error" @click.stop="onCopyComponent"></i>
      <i v-if="itemConfig.componentId === activeComponentId || mouseenter" class="right-oper-icon el-icon-delete icon-error" @click.stop="onRemoveComponent"></i>
    </span>
  </el-col>
</template>

<script lang="ts">
import { PropType, ref } from 'vue';
import { useDesign, useActiveDesignComponent } from '@/use/useDesign';
import { deepClone } from '@/utils/utils';
import { DesignComponent } from '@/components/designComponent';

export default {
  props: {
    itemConfig: Object as PropType<DesignComponent>,
    formModel: Object,
  },
  setup(props) {
    console.log('props.itemConfig', props.itemConfig);
    const { currentComponentList, formConf } = useDesign();
    const { activeComponentId, setActiveComponent } = useActiveDesignComponent(
      currentComponentList
    );

    const componentRef = ref(null);
    const mouseenter = ref<boolean>(false);

    // 组件配置
    const componentCfig = props.itemConfig;
    // 组件表单项配置
    const formItem = ref(componentCfig?.__form__);
    // 组件基础自定义配置
    const config = ref(componentCfig?.__config__);

    function getLabelWidth() {
      const width = props.itemConfig?.__form__?.labelWidth;
      if (width === 0 || !!width) {
        return `${width}px`;
      } else {
        return `${formConf.value.labelWidth || 120}px`;
      }
    }

    // 组件点击事件
    const onActiveComponentHandler = () => {
      setActiveComponent(props.itemConfig);
    };

    // 组件移除事件
    const onRemoveComponent = () => {
      const componentId = props.itemConfig?.componentId;
      const index = currentComponentList.value.findIndex(
        (f) => f.componentId === componentId
      );
      index > -1 && currentComponentList.value.splice(index, 1);
      setActiveComponent(undefined);
    };
    // 复制组件
    const onCopyComponent = () => {
      const newComponent: DesignComponent = deepClone(props.itemConfig);
      const timeStamp: number = +new Date();
      newComponent.componentId = timeStamp;
      newComponent.__vModel__ = `field${timeStamp}`;
      currentComponentList.value.push(newComponent);
    };

    return {
      formItem,
      config,
      mouseenter,
      activeComponentId,
      getLabelWidth,
      onActiveComponentHandler,
      onRemoveComponent,
      componentRef,
      onCopyComponent,
    };
  },
};
</script>

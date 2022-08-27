<template>
  <template v-if="itemConfig?.__config__.isModel == undefined">
    <el-col
      class="design-board-item"
      :class="{
        'design-active-item': itemConfig?.componentId === activeComponentId,
      }"
      :span="formItem?.span"
      @click.stop="onActiveComponentHandler()"
      @mouseenter="mouseenter = true"
      @mouseleave="mouseenter = false"
    >
      <el-form-item
        :label="(formItem.showLabel && formItem.label) || ''"
        :required="formItem?.required"
        :label-width="getLabelWidth()"
      >
        <component :is="itemConfig?.componentTag" :model="formModel" :component="itemConfig"></component>
      </el-form-item>
      <span class="oper-button-wrap">
        <i
          v-if="itemConfig?.componentId === activeComponentId || mouseenter"
          class="right-oper-icon el-icon-document-copy icon-error"
          @click.stop="onCopyComponent"
        ></i>
        <i
          v-if="itemConfig?.componentId === activeComponentId || mouseenter"
          class="right-oper-icon el-icon-delete icon-error"
          @click.stop="onRemoveComponent"
        ></i>
      </span>
    </el-col>
  </template>
  <template v-else>
    <component
      class="design-board-item"
      :class="{
        'design-active-item': itemConfig.componentId === activeComponentId,
      }"
      :is="itemConfig.componentTag"
      :component="itemConfig"
      @click.stop="onActiveComponentHandler()"
    ></component>
  </template>
</template>

<script lang="ts">
import { PropType, ref, inject } from "vue";
import { useDesign, useActiveDesignComponent } from "@/hooks/use-design";
import { DesignComponent } from "@/components/designComponent";
import { deleteComponent } from "@/api/homeApi/index";
import { deepClone, confirmBox, messageAlert } from "@/shared/utils/utils";

export default {
  props: {
    itemConfig: Object as PropType<DesignComponent>,
    formModel: Object,
  },
  setup(props) {
    const { currentComponentList, formConf } = useDesign();
    const { activeComponentId, setActiveComponent } =
      useActiveDesignComponent(currentComponentList);

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
    const pageid = inject("pageid");

    // 组件移除事件
    const onRemoveComponent = () => {
      //删除
      deleteComponent({
        pageId: pageid,
        fieldName: props.itemConfig?.__vModel__,
      }).then((res) => {
        confirmBox('移除该组件', () => {
          const componentId = props.itemConfig?.componentId;
          const index = currentComponentList.value.findIndex(
            (f) => f.componentId === componentId
          );
          index > -1 && currentComponentList.value.splice(index, 1);
          setActiveComponent(undefined);
          messageAlert("success", "删除成功");
        })
      });
      return;
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

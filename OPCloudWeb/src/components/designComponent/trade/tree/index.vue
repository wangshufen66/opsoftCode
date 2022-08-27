<template>
  <div class="designTree-wrap">
    <el-tree
      v-if="designStatus"
      class="design-tree"
      ref="treeRef"
      node-key="id"
      v-bind="component.__attr__"
      @node-click="onNodeClick"
    ></el-tree>
    <el-tree
      v-else
      class="design-tree"
      ref="treeRef"
      node-key="id"
      :load="loadNode"
      lazy
      v-bind="component.__attr__"
      @node-click="onNodeClick"
    ></el-tree>
  </div>
</template>

<script lang="ts">
import useEitter from "@/use/useEitter";
import { PropType, ref } from "vue";
import { TreeComponent } from "./IConfig";
import { useStore } from "vuex";
export default {
  name: "designTree",
  props: {
    component: Object as PropType<TreeComponent>,
  },
  emits: ['onNodeClick'],
  setup(props, { emit }) {
    const treeRef = ref<any>(null);
    const store = useStore();
    const mitter = useEitter();
    const designStatus = ref<boolean>(store.state.apps.designStatus);
    useEitter([
      //树形组件添加
      { key: "design-tree-node-add", value: addNode },
      //树形组件删除
      { key: "design-tree-node-remove", value: removeNode },
    ]);

    /**api添加节点*/
    function addNode(obj: { data: any; parentKey: string | number }) {
      const { data, parentKey } = obj;
      if (treeRef.value) {
        treeRef.value.append(data, parentKey);
      }
    }

    /**api删除节点*/
    function removeNode(data: any) {
      if (treeRef.value) {
        treeRef.value.remove({ name: data?.label, id: data?.id });
      }
    }

    function loadNode(node?: any, resolve?: any) {
      mitter.emitter.emit("on-load-tree", {
        component: props.component,
        node,
        resolve,
      });
    }

    function onNodeClick(data) {
      emit('onNodeClick', data)
    }

    return {
      treeRef,
      loadNode,
      designStatus,
      onNodeClick
    };
  },
};
</script>

<style lang="scss" scoped>
.design-tree {
  height: 100%;
}
</style>

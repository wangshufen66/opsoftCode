<template>
  <div class="module-header">
    <div class="main-title" :style="{ width: `${titleWidth}px` }">{{ title }}</div>
    <i
      :class="['opfont', collapse ? ' opicon-gourp-right' : 'opicon-group-left']"
      @click="handleCollapse"
    ></i>
    <el-breadcrumb class="breadcrumb-separator">
      <template v-for="item in paths" :key="item">
        <el-breadcrumb-item v-if="!item.path" class="path-item">{{ item.name }}</el-breadcrumb-item>
        <el-breadcrumb-item v-else class="path-item" :to="item.path" replace>{{ item.name }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance, ref, watch } from 'vue';
import type { PropType } from 'vue';
import type { Breadcrumb } from './type';


export default defineComponent({
  props: {
    title: String,
    titleWidth: Number,
    // paths: Array,
    paths: Array as PropType<Breadcrumb[]>,

  },

  setup(props) {

    // icon发送值给menu，控制折叠
    const collapse = ref(false)
    const eventBus = getCurrentInstance()?.appContext.config.globalProperties.$emitter

    const handleCollapse = () => {
      collapse.value = !collapse.value
      eventBus.emit('collapse', collapse.value)
    }
    return {
      collapse,
      handleCollapse
    };
  },
});
</script>

<style lang="scss" scoped>
.module-header {
  display: flex;
  align-items: center;
  height: 52px;
  // margin: 4px 0 10px 6px;
}
.main-title {
  opacity: 1;
  font-size: 16px;
  color: #343948;
  margin-right: 20px;
}

.path-item {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  :deep .el-breadcrumb__inner {
    font-weight: 500 !important;
  }
}
i {
  cursor: pointer;
  font-size: 20px;
  margin-right: 10px;
  &:hover {
    color: $color-primary;
  }
}
</style>

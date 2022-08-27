<template>
  <div class="operation-tool">
    <i class="el-icon-warning highlight"></i>
    <div class="select-content">
      已选择
      <span class="highlight">{{ selectCount }}</span>
      项
    </div>
    <div class="tool">
      <slot name="default">
        <el-button type="text" @click="clearSelect">清空</el-button>
      </slot>
      <slot name="tool">
        <el-button v-if="batchDelete" type="text" @click="dataDelete">批量删除</el-button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>

defineProps({
  selectCount: Number,
  batchDelete: Boolean,
});

const emit = defineEmits(['onClearSelect', 'onDataDelete']);

function dataDelete() {
  emit('onDataDelete');
}

function clearSelect() {
  emit('onClearSelect');
}
</script>
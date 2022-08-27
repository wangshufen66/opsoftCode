<template>
  <div class="fixedDialog">
    <el-dialog v-model="visible" :title="title" :before-close="beforeClose">
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <div class="legend">
        <div class="item">已完成</div>
        <div class="item">进行中</div>
        <div class="item">未执行</div>
      </div>
      <img class="process-image" v-if="imageUrl" :src="imageUrl" />
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { getToken } from '@/utils/utils';

const props = defineProps({
  visible: Boolean,
  title: String,
  id: String,
});
// 事件定义
const emit = defineEmits(['update:visible']);

const title = ref<string>('');

const imageUrl = ref<string>('');

watch(
  () => props.visible,
  () => {
    title.value = '工作流详情' + (props.title && ` - ${props.title}`);
    const token = getToken('accessToken');
    imageUrl.value = `/flowable/processInstanceImage?processInstanceId=${props.id
      }&access_token=${token}&time=${+new Date()}`;
  }
);

function beforeClose(): void {
  imageUrl.value = '';
  emit('update:visible', false);
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/workflow/processdetail.scss";
</style>

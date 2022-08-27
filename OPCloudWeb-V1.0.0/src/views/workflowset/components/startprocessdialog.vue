<template>
  <div class="start-process-dialog">
    <el-dialog :title="title" v-model="visible" width="900px">
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>

      <top-form :formvisible="false" :formConf="props.formConf" :componentList="props.components"></top-form>
      <div>
        <el-button icon="el-icon-close" @click="visible = false">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="doStartInstance">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { startProcessInstance } from '@/api/flowable';
import topForm from '@/components/moduleform/form.vue';
import { messageAlert } from '@/utils/utils';

const props = defineProps({
  visible: Boolean,
  title: String,
  id: String,
  formConf: Object,
  components: [],
});

// 事件定义
const emit = defineEmits(['update:visible']);

const title = ref<string>('');

watch(
  () => props.visible,
  () => {
    title.value = '工作流详情--' + props.title;
  }
);

const doStartInstance = async (params: any) => {
  const res = await startProcessInstance({ processDefinitionId: props.id });
  if (res.code === 200) {
    messageAlert('success', res.msg);
    emit('update:visible', false);
  }
};
</script>

<template>
  <div class="start-process-dialog">
    <el-dialog title="执行任务" v-model="visible" width="900px">
      <template v-slot:title>
        <dialog-title title="执行任务"></dialog-title>
      </template>

      <!-- <template v-if="props.componentList&&props.componentList.length>0" height="500px">
        <top-form :formvisible="false" :formConf="props.formConf" :componentList="props.componentList" ref="topSearchForm">
        </top-form>
      </template>-->
      <div style="display: flex">
        意见:
        <div style="margin-bottom: 20px; flex: 1; margin-left: 10px">
          <el-input v-model="inputContent.message" type="textarea" placeholder="请输入意见" />
        </div>
      </div>

      <div>
        <el-button icon="el-icon-close" @click="visible = false">取消</el-button>
        <el-button icon="el-icon-check" type="primary" @click="onComplete">提交</el-button>
        <el-button icon="el-icon-check" type="primary" @click="onStop">终止</el-button>
        <!-- <el-button icon="el-icon-check" type="primary">转办 </el-button>
        <el-button icon="el-icon-check" type="primary">委派 </el-button>
        <el-button icon="el-icon-check" type="primary">退回 </el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive,
  watch,
} from 'vue';
import { completeTask, stopProcessInstance } from '@/api/flowable';
import { messageAlert } from '@/utils/utils';

const props = defineProps({
  visible: Boolean,
  id: String,
  formConf: Object,
  componentList: Array,
});
// const title = ref<string>('');

// 意见输入框
const inputContent = reactive({
  message: '',
});
// 事件定义
const emit = defineEmits(['update:visible', 'refreshList']);

const onComplete = async (row: any) => {
  const res = await completeTask({
    message: inputContent.message,
    taskId: props.id,
    ccToVos: [],
  });

  if (res.code === 200) {
    messageAlert('success', res.msg);
    emit('update:visible', false);
  }
};

const onStop = async (row: any) => {
  const res = await stopProcessInstance({
    message: inputContent.message,
    taskId: props.id,
  });

  if (res.code === 200) {
    messageAlert('success', '已终止')
    emit('update:visible', false);
  }
};

watch(
  () => props.visible,
  () => { }
);
</script>
<style lang="scss" scoped>
@import "@/styles/modules/design/preview.scss";
</style>

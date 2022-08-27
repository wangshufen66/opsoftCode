<template>
  <el-dialog v-model="visible" title="表单呈现设置" width="700px" :before-close="beforeClose">
    <template v-slot:title>
      <dialog-title title="表单呈现设置"></dialog-title>
    </template>

    <el-form ref="formRef" :model="form" label-width="120px" :rules="rules">
      <el-form-item label="呈现方式" prop="showType">
        <el-radio-group v-model="form.showType" size="small">
          <el-radio-button label="dialog" border>弹窗</el-radio-button>
          <el-radio-button label="drawer" border>顶部抽屉</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抽屉方向" v-if="form.showType === 'drawer'">
        <el-select v-model="form.direction">
          <el-option value="rtl" label="从右向左"></el-option>
          <el-option value="btt" label="从下向上"></el-option>
          <el-option value="ltr" label="从左往右"></el-option>
          <el-option value="ttb" label="从上往下"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="窗体大小" prop="size">
        <el-input v-model.number="form.size" style="width: 150px" clearable>
          <template #append>
            <span>%</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { getCurrentInstance, reactive, ref, watch } from 'vue';

import { useDesign } from '@/hooks/use-design';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  }
});
const emit = defineEmits(['update:visible']);

const formRef = ref<any>(null);

const { formConf } = useDesign();

const form = reactive({
  showType: formConf.value.dialogType,
  direction: formConf.value.direction,
  size: formConf.value.width,
});

watch(
  () => props.visible,
  (val) => {
    if (!!val) {
      form.showType = formConf.value.dialogType;
      form.direction = formConf.value.direction;
      form.size = formConf.value.width;
    }
  }
);

const rules = reactive({
  showType: [{ required: true, message: '请选择呈现方式' }],
  size: [
    { required: true, message: '请填写大小' },
    { pattern: /^([1-9]\d|100)$/g, message: '大小范围是1~100%' },
  ],
});

const currentInstance = getCurrentInstance();
const emitter = currentInstance?.appContext.config.globalProperties.$emitter;

// 关闭前事件
function beforeClose() {
  emit('update:visible', false);
}

//提交
function submit() {
  formRef.value.validate((valid) => {
    if (valid) {
      beforeClose();
      emitter.emit('on-preview-page', { visible: true, ...form });
    }
  });
}
</script>

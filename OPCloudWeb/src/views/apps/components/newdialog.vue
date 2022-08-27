<template>
  <el-dialog title="新建应用" v-model="visible" destroy-on-close :before-close="beforeClose">
    <template v-slot:title >
            <dialog-title title="新建应用"></dialog-title>
      </template>

    <el-form :model="form" :rules="formRules" ref="formRef" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入应用名称"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="des">
        <el-input v-model="form.des" placeholder="请输入应用描述信息"></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon">
        <el-upload action="/upload/image" list-type="picture-card" :auto-upload="true" :multiple="false" :limit="1" :http-request="uploadImage">
          <template #default>
            <i class="el-icon-plus"></i>
          </template>
          <template #file="{ file }">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
          </template>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visibleChange(false)">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">下一步</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
import request from '@/utils/request';

defineProps({
  // 显示
  visible: {
    type: Boolean,
    default: false,
  },
});
// 事件定义
const emit = defineEmits(['update:visible']);

const form = reactive({
  icon: '',
  name: '',
  des: '',
});

const formRules = reactive({
  icon: { required: true, message: '请选择应用图标', trigger: 'blur' },
  name: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' },
  ],
  des: [
    { required: true, message: '请输入应用描述信息', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
  ],
});

const formRef = ref<any>(null);
const loading = ref(false);
const router = useRouter();

const visibleChange = (value: boolean): void => {
  emit('update:visible', value);
};

const submit = (): void => {
  loading.value = true;
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      request()
        .post('/create/app', form)
        .then((res: any) => {
          loading.value = false;
          if (res.status === 200) {
            router.push('/design');
          }
        });
    } else {
      loading.value = false;
      return false;
    }
  });
};

const beforeClose = (): void => {
  emit('update:visible', false);
};

const uploadImage = async (fileOptions: any): Promise<void> => {
  const { file } = fileOptions;
  const formData: FormData = new FormData();
  formData.append('files', file.uploadFile);
  const res = await request().post('/upload/image', formData);
  form.icon = file.name;
};
</script>

<style lang="scss" scoped></style>

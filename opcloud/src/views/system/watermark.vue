<template>
  <div class="appsupdate-form">
    <el-form :model="waterMark" ref="formRef" :inline="false" :rules="formRule" label-width="120px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="水印标题" prop="title">
            <el-input v-model="waterMark.title" clearable placeholder="水印名称,长度在2~10个字符"></el-input>
          </el-form-item>
          <el-form-item label="水印内容" prop="content">
            <el-input v-model="waterMark.content" clearable placeholder="水印内容,长度在2~10个字符"></el-input>
          </el-form-item>
          <el-form-item label="是否隐藏" prop="isHidden">
            <el-select v-model="waterMark.isHidden" placeholder="是否隐藏水印" style="width: 100%">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-row>
          <el-form-item label="颜色" prop="color">
            <el-color-picker v-model="waterMark.color" show-alpha></el-color-picker>
          </el-form-item>
        </el-row>
      </el-row>
      <el-row>
        <el-col class="btns">
          <el-button @click="onSubmitCancel">取 消</el-button>
          <el-button type="primary" @click="onSubmitWatermark">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue';
import useEitter from '@/hooks/use-core/useMitt';

const { emitter } = useEitter();

const waterMark = reactive({
  title: undefined,
  color: undefined,
  content: undefined,
  isHidden: 0,//是否隐藏
  id: undefined,
});
const formRef = ref<any>(null);

// 验证规则
const formRule = reactive({
  title: [
    { required: true, message: '请输入水印标题', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'blur' },
    {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
      message: '名称不能包含特殊字符',
      trigger: 'blur',
    },
  ],
  content: [
    { min: 2, max: 10, message: '长度在 2 到 10 个字符之间', trigger: 'blur' },
    {
      pattern: /^[\u4E00-\u9FA5A-Za-z0-9_]+$/,
      message: '内容不能包含特殊字符',
      trigger: 'blur',
    },

  ],
  color: [
    { required: true, message: '请选择颜色', trigger: 'change' },
  ]
});

//点击保存按钮
async function onSubmitWatermark() {
  let params = { ...waterMark }
  //新增
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emitter.all.get("create-page-watermark") &&
        emitter.emit("create-page-watermark", params);
    }
  })
};

// 取消配置水印操作
const onSubmitCancel = () => {
  formRef.value.resetFields()
  waterMark.id = undefined
};

</script>

<style lang="scss" scoped>
@import "@/styles/modules/appdetail.scss";
</style>

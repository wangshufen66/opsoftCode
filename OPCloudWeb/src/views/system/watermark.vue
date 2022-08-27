<template>
  <div class="appsupdate-form">
    <el-form
      :model="waterMark"
      ref="appFormRef"
      :inline="false"
      :rules="appFormRule"
      label-width="120px"
    >
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="水印标题" prop="title">
            <el-input
              v-model="waterMark.title"
              :disabled="disabled"
              clearable
              placeholder="水印名称,长度在2~10个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="水印内容" prop="content">
            <el-input
              v-model="waterMark.content"
              :disabled="disabled"
              clearable
              placeholder="水印内容,长度在2~10个字符"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否隐藏" prop="isHidden">
            <el-select
              v-model="waterMark.isHidden"
              :disabled="disabled"
              placeholder="是否隐藏水印"
              style="width: 100%"
            >
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
      <div><span></span></div>
      <el-row>
        <el-col class="btns">
          <el-button @click="onSubmitCancel" :disabled="disabled">取 消</el-button>
          <el-button type="primary" @click="onSubmitWatermark" :disabled="disabled">保 存</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router';
import { reactive, ref, computed, onMounted } from 'vue';
import { useStore } from "vuex"
import useEitter from '@/use/useEitter';
import { getStorage } from '@/utils/utils';
const mitter = useEitter();
const route = useRoute();
const router = useRouter();
const store = useStore()

// 全局事件定义获取水印数据
const waterMark = reactive({
  orgId: '',
  title: '',
  color: '',
  content: '',
  isHidden: 0,//是否隐藏
  id: undefined,
});
const appFormRef = ref<any>(null);

// 验证规则
const appFormRule = reactive({
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
    { required: true, message: '请输入水印内容', trigger: 'blur' },
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

/**是否启用设置 */
const disabled = computed(() => {
  // const userInfo = getStorage('user')
  // return userInfo.value.orgId !== '000'
})


//点击保存按钮
async function onSubmitWatermark() {
  let params = {
    orgId: waterMark.orgId,
    title: waterMark.title,
    content: waterMark.content,
    color: waterMark.color,
    isHidden: waterMark.isHidden,
    id: waterMark.id
  }
  //新增
  appFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      mitter.emitter.emit("on-water-set", params);
    }
  })
};

// 取消配置水印操作
const onSubmitCancel = () => {
  waterMark.title = '';
  waterMark.content = '';
  waterMark.color = '';
  router.push('/systemset/mange/watermark');
};


onMounted(() => {
  //可能会有延迟
  setTimeout(() => {
    const storeWater = store.state.comm.waterMark
    if (storeWater) {
      waterMark.id = storeWater.id;
      waterMark.orgId = storeWater.orgId;
      waterMark.title = storeWater.title;
      waterMark.content = storeWater.content;
      waterMark.color = storeWater.color;
      waterMark.isHidden = storeWater.isHidden;
    }
  }, 300)

})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/appdetail.scss";
</style>

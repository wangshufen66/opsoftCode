<template>
  <div class="home-config">
    <div class="report-config">
      <design-label class="form-item-label" :component="labelCfg"></design-label>
      <el-form :model="reportConfig" ref="reportFormRef" :rules="reportFormRule" label-width="120px">
        <el-form-item label="URL" prop="url">
          <el-input v-model="reportConfig.url" clearable placeholder="请输入URL地址"></el-input>
        </el-form-item>
        <el-form-item label="Token" prop="token">
          <el-input v-model="reportConfig.token" clearable placeholder="请输入Token"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="report-btn">
            <el-button @click="onReportCancel">取 消</el-button>
            <el-button type="primary" @click="onReportSubmit">保 存</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
  
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { messageAlert } from '@/utils/utils';
import { getHomeConfig, updateHomeConfig } from '@/api/system';

const reportConfig = reactive({
  url: '',
  token: '',
});
const reportFormRef = ref<any>(null);

const labelCfg = reactive({
  __config__: {
    label: '报表配置',
  },
  __attr__: {
    prefixLine: true,
    prefixLineColor: '#539af8',
    prefixLineWidth: 4,
    fontSize: 14,
    fontColor: '#333',
  },
})

// 验证规则
const reportFormRule = reactive({
  url: [
    {
      validator: (rule, value, callback) => {

        let urlReg = /(http|https):\/\/([\w.]+\/?)\S*/i;
        if (!urlReg.test(value)) {
          callback(
            new Error("必须以http或https开头,且需符合URL规范,检查格式是否正确")
          );
        }
        callback();
      },
      trigger: "blur", required: true
    },
  ],
  token: [{ required: true, message: "Token为必填", trigger: "blur" }]

});

//获取首页配置数据
async function getHomePageConfig() {
  const res = await getHomeConfig()
  if (res.code == 200) {
    reportConfig.url = res.data.url;
    reportConfig.token = res.data.token;
  }
}
//报表配置保存
async function onReportSubmit() {
  let params = {
    url: reportConfig.url,
    token: reportConfig.token,
  }
  reportFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const res = await updateHomeConfig(params);
      if (res.code == 200) {
        messageAlert('success', '保存成功')
      }
    }
  })
};

// 取消报表配置操作
function onReportCancel () {
  reportConfig.url = '';
  reportConfig.token = '';
};

getHomePageConfig()

</script>
  
<style lang="scss" scoped>
@import "@/styles/modules/system/homeConfig.scss";
</style>
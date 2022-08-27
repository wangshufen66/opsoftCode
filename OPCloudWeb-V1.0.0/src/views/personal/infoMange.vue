<template>
  <div class="infoMange">
    <el-descriptions border direction="horizontal" :column="1">
      <template #extra>
        <el-button type="primary" @click="updateInfo">修改个人信息</el-button>
      </template>
      <el-descriptions-item label="用户名" :span="3">{{ personalData.username }}</el-descriptions-item>
      <el-descriptions-item label="昵称">{{ personalData.nickName }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ personalData.mobile }}</el-descriptions-item>
    </el-descriptions>
  </div>
  <el-dialog v-model="dialogVisible" title="修改个人信息" width="30%">
    <template v-slot:title>
      <dialog-title title="修改个人信息"></dialog-title>
    </template>

    <el-form :model="updatePersonalData" label-width="100px" ref="formRef" :rules="ruleRef">
      <el-form-item label="用户名">
        <el-input v-model="updatePersonalData.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="updatePersonalData.nickName" maxlength="15" show-word-limit clearable></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="mobile">
        <el-input v-model="updatePersonalData.mobile"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="onSubmitForm(ruleRef)">修 改</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { getPersonalInfo, putPersonalInfo } from '@/api/system';
import { getToken, messageAlert, setStorage, setToken } from '@/utils/utils';
import { useStore } from 'vuex';
import useEitter from '@/use/useEitter';

const mitter = useEitter();
const store = useStore();
// 是否显示弹框
const dialogVisible = ref<boolean>(false);

const formRef = ref<any>(null);
//编辑个人信息
const personalData = reactive({
  username: '',
  nickName: '',
  mobile: '',
  orgId: '',
});

const updatePersonalData = reactive({
  username: '',
  nickName: '',
  mobile: '',
  orgId: '',
});

//编辑个人信息管理
function updateInfo() {
  dialogVisible.value = true;
  updatePersonalData.username = personalData.username;
  updatePersonalData.nickName = personalData.nickName;
  updatePersonalData.mobile = personalData.mobile;
  updatePersonalData.orgId = personalData.orgId;
}
//手机号验证
const checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('手机号不能为空'));
  } else {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
    if (reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入正确的手机号'));
    }
  }
};

// 表单验证
const ruleRef = reactive({
  nickName: [
    { required: true, trigger: 'blur' },
    {
      pattern: /^[\u4E00-\u9FA5\w]{1,50}$/,
      message: '只能输入数字、字母、下划线和中文字符且不能超过50',
      trigger: 'blur',
    },
  ],
  mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
});

async function onSubmitForm() {
  formRef.value &&
    formRef.value.validate(async (valid: boolean) => {
      if (valid) {
        let param = {
          userId: getToken('user').userId,
          userName: updatePersonalData.username,
          nickName: updatePersonalData.nickName,
          mobile: updatePersonalData.mobile,
          orgId: updatePersonalData.orgId,
        };
        const res = await putPersonalInfo(param);
        if (res.code === 200) {
          messageAlert('success', '个人信息修改成功');
          dialogVisible.value = false;
          getDataList();
        }
      } else {
        return false;
      }
    });
}
// 获取数据
async function getDataList() {
  let param = {
    userId: getToken('user').userId,
  };
  const res = await getPersonalInfo(param);
  if (res.code === 200) {
    personalData.username = res.data.username;
    personalData.nickName = res.data.nickName;
    personalData.mobile = res.data.mobile;
    personalData.orgId = res.data.orgId;
    setStorage('nickName', res.data.nickName);
    mitter.emitter.emit('on-nickName', res.data.nickName);
  }
}
getDataList();
// }
</script>

<style>
.infoMange {
  align-content: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-descriptions {
  box-sizing: border-box;
  font-size: 14px;
  color: #303133;
  width: 1000px;
  align-items: center;
}
</style>

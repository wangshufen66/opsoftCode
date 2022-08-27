<template>
  <div class="changePwd-out">
    <el-form
      :model="ruleForm"
      status-icon
      :rules="ruleRef"
      ref="restData"
      class="changePwd-In"
      label-width="80px"
    >
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="ruleForm.password" placeholder="请输入原密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm.newPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input
          type="password"
          v-model="ruleForm.checkPassword"
          placeholder="请确认新密码"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmitForm">确 定</el-button>
        <el-button @click="resetForm">清 空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { updatePassword } from '@/api/system';
import { getToken } from '@/utils/utils';
import { ElMessage } from 'element-plus';

const resetFormData = ref(null);
const router = useRouter();

const restData = ref<any>(null);

const ruleForm = reactive({
  password: '', //原密码
  newPassword: '', // 新密码
  checkPassword: '', //确认密码
});

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== ruleForm.newPassword) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

// 表单验证
const ruleRef = reactive({
  password: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    {
      pattern: /^[\w-]{1,32}$/i,
      message: '只能输入数字、字母、下划线和-且不能超过32',
      trigger: 'blur',
    },
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      pattern: /^[\w-]{1,32}$/i,
      message: '只能输入数字、字母、下划线和-且不能超过32',
      trigger: 'blur',
    },
  ],
  checkPassword: [
    { validator: validatePass2, required: true, trigger: 'blur' },
    {
      pattern: /^[\w-]{1,32}$/i,
      message: '只能输入数字、字母、下划线和-且不能超过32',
      trigger: 'blur',
    },
  ],
  orgId: [{ required: true, message: '请输入所属组织', trigger: 'blur' }],
});
//提交按钮
async function onSubmitForm() {
  restData.value &&
    restData.value.validate(async (valid: boolean) => {
      if (valid) {
        let param = {
          password: ruleForm.password,
          newPassword: ruleForm.newPassword,
          orgId: getToken('user').orgId,
          userName: getToken('user').userRealName,
        };
        const res = await updatePassword(param);
        if (res.code === 200) {
          ElMessage.success({
            message: '密码修改成功',
            type: 'success',
          });
        }

        if (res.code === 200) {
          router.replace('/login');
        }
      }
    });
}
//重置
const resetForm = () => {
  restData.value.resetFields();
};
</script>

<style scoped>
.changePwd-out {
  display: flex;
  justify-content: center;
  align-items: center;
}
.changePwd-In {
  width: 500px;
}
</style>

<template>
  <div class="login-container coverbg">
    <div class="login-form register-form">
      <div class="register-logo containbg lazyimage"></div>
      <div class="login-item">
        <el-form
          class="form-wrap"
          ref="loginForm"
          :model="form"
          :rules="formRules"
          label-width="0px"
        >
          <el-form-item prop="orgName">
            <el-input
              v-model="form.orgName"
              prefix-icon="el-icon-office-building"
              placeholder="请输入企业名称"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item prop="orgNumber">
            <el-input v-model="form.orgNumber" prefix-icon="el-icon-office-building" placeholder="请输入企业代码"></el-input>
          </el-form-item>-->
          <el-form-item prop="username">
            <el-input v-model="form.username" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="secondPass">
            <el-input
              v-model="form.secondPass"
              type="password"
              prefix-icon="el-icon-lock"
              placeholder="再次输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <el-input v-model="form.phone" prefix-icon="el-icon-lock" placeholder="手机号"></el-input>
          </el-form-item>
          <div class="msgcode">
            <div class="msg-left">
              <el-form-item prop="verifyCode" style="margin-bottom: 0px">
                <el-input v-model="form.verifyCode" prefix-icon="el-icon-lock" placeholder="验证码"></el-input>
              </el-form-item>
            </div>

            <div class="msg-right">
              <span class="secondMsgBtn" v-if="second == 0" @click="getMsg">{{ secondMsg }}</span>
              <span class="second" v-else>{{ second }}秒</span>
            </div>
          </div>

          <el-form-item style="margin-top: 22px; margin-bottom: 10px">
            <el-button type="primary" @click="onRegister" :loading="loading">注册</el-button>
          </el-form-item>
          <div class="register" @click="router.push('/login')">直接登录</div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { AxiosInstance } from 'axios';
import { useRouter } from 'vue-router';
import { setToken } from '@/utils/utils';
import { getCurrentInstance, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
// import { userSignUp, userLogin, getMsgCode } from '@/api/userApi/index';
// 当前实例
const currentInstance = getCurrentInstance();
// 表单ref
const loginForm = ref<any>(null);
// loading
const loading = ref(false);

const secondMsg = ref<string>('获取验证码');

const second = ref<number>(0);

const timer = ref<any>(null);
// 表单对象
const form = reactive({
  orgName: undefined,
  // orgNumber: undefined,
  username: undefined,
  password: undefined,
  secondPass: undefined,
  phone: undefined,
  verifyCode: undefined,
});
// 密码再次验证
const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};
// 获取验证码
const getMsg = () => {
  let reg = /^1[0-9]{10}$/;
  if (form.phone == '' || !reg.test(form.phone)) {
    ElMessage.warning('手机号码格式不对');
    return;
  } else {
    let para = {
      phone: form.phone,
    };
    getMsgCode(para)
      .then((res: any) => {
        if (res.code == 200) {
          ElMessage.success(res.msg);
          second.value = 60;
          secondMsg.value = '';
          countDown();
        }
      })
      .catch((res) => {
        ElMessage.error('系统错误，稍后重试');
      });
  }
};

//倒计时120s
function countDown() {
  clearInterval(timer);
  timer.value = setInterval(() => {
    if (second.value == 0) {
      clearInterval(timer);
      secondMsg.value = '重新获取';
    } else {
      second.value = second.value - 1;
    }
  }, 1000);
}

// 表单验证规则
const formRules = reactive({
  orgName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
  // orgNumber: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  secondPass: [{ validator: validatePass2, trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  verifyCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
});

const router = useRouter();
// 注册
const onRegister = () => {
  loading.value = true;
  loginForm.value &&
    loginForm.value.validate((valid: boolean) => {
      loading.value = false;
      if (valid) {
        userSignUp(form).then((res: any) => {
          loading.value = false;
          if (res.code == 200) {
            // const { accessToken, expiresIn } = res.data
            // if (!accessToken) return
            // // 设置token缓存
            // setToken("accessToken", accessToken, expiresIn)
            ElMessage.success(res.msg);
            router.replace('/login');
          }
        });
      } else {
        loading.value = false;
        return false;
      }
    });
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/login.scss";
</style>
<style lang="scss">
.login-item {
  .el-input__inner {
    background-color: transparent !important;
    color: #ffffff !important;
    height: 45px;
    border: none;
    font-size: 16px;
    padding-left: 42px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0;
    line-height: 45px;
  }
  .el-input__icon {
    line-height: 45px;
    font-size: 18px;
  }
}
</style>

<template>
  <div class="login-container coverbg">
    <div class="main-contain-img">
      <img src="../../assets/images/logo1.png" />
    </div>
    <div class="main-contain">
      <div class="text-tip">
        <div class="text1-css">
          <span class="text1-1">Hello，</span>
          <span class="text1-2">Welcome to OPSOFT</span>
        </div>
        <div class="text2-css">轻部署、轻应用、轻上手的MES工业互联网平台</div>
      </div>
      <div class="login-form register-form">
        <div class="login-logo containbg lazyimage">欧软云平台注册</div>
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
                <el-form-item prop="verifyCode">
                  <el-input v-model="form.verifyCode" prefix-icon="el-icon-lock" placeholder="验证码"></el-input>
                </el-form-item>
              </div>

              <div class="msg-right">
                <button class="secondMsgBtn" v-if="second == 0" @click="getMsg">{{ secondMsg }}</button>
                <span class="second" v-else>{{ second }}秒</span>
              </div>
            </div>
            <div class="send-register">
              <el-form-item>
                <el-button type="primary" @click="onRegister" :loading="loading">申请注册</el-button>
              </el-form-item>
            </div>

            <div class="register" @click="router.push('/login')">直接登录</div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="footer-link">
      Copyright © 2013-2021 欧软云保留所有版权 ICP备案号：
      <a
        href="https://beian.miit.gov.cn/#/Integrated/index"
        target="_balnk"
      >苏ICP备13024158号</a>
      <a href=" http://www.beian.gov.cn/portal/registerSystemInfo" target="_balnk">
        <img src="../../assets/images/gh.png" style="display: inline-block" target="_balnk" />苏公网安备 32059002003521号
      </a>
      <a href="https://www.opsoft.com.cn/about/falvshengming/" target="_balnk">法律声明</a>
      |
      <a href="https://www.opsoft.com.cn/about/yinsizhengce/" target="_balnk">隐私政策</a>
      |
      <a href="https://www.opsoft.com.cn/sitemap.xml" target="_balnk">网站地图</a>
      <a>版本号3.1.0</a>
    </div>
  </div>
  <!-- 审核账户是否过期的弹窗 -->
  <el-dialog :title="formTitle" v-model="dialogVisible" width="600px">
    <template v-slot:title>
      <DialogTitle :dialogTitle="formTitle"></DialogTitle>
    </template>
    <span class="text-tip">恭喜！您的账户已注册成功，正在审核中，麻烦耐心等待。如急用，请及时联系欧软云工作人员，致电：400-878-8790</span>
    <span class="text-tip">您的账户已到期，如需继续使用，请及时联系欧软云工作人员，致电：400-878-8790-878-8790</span>
    <template #footer>
      <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { AxiosInstance } from "axios";
import DialogTitle from '@/components/dialogTitle/index.vue';
import { useRouter } from "vue-router";
import { setToken } from "@/utils/utils";
import { computed, getCurrentInstance, reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { userSignUp, userLogin, getMsgCode } from "@/api/userApi/index";
// 表单ref
const loginForm = ref<any>(null);
// loading
const loading = ref(false);

const secondMsg = ref<string>("获取验证码");
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
const second = ref<number>(0);
//判断账号是否已审核
const isChecked = ref<boolean>(false);
//弹出框提示信息
const formTitle = computed(() => {
  return isChecked.value ? '账户审核中' : '账户已到期'
})
const timer = ref<any>(null);
// 表单对象

const form = reactive({
  isChecked: undefined,//是否审核
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
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== form.password) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};
// 获取验证码
const getMsg = () => {
  let reg = /^1[0-9]{10}$/;
  if (form.phone == "" || !reg.test(form.phone)) {
    ElMessage.warning("手机号码格式不对");
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
          secondMsg.value = "";
          countDown();
        }
      })
      .catch((res) => {
        ElMessage.error("系统错误，稍后重试");
      });
  }
};

//倒计时120s
function countDown() {
  clearInterval(timer);
  console.log("定时器", timer);
  timer.value = setInterval(() => {
    if (second.value == 0) {
      clearInterval(timer);
      secondMsg.value = "重新获取";
    } else {
      second.value = second.value - 1;
    }
  }, 1000);
}

// 表单验证规则
const formRules = reactive({
  orgName: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
  // orgNumber: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  secondPass: [{ validator: validatePass2, trigger: "blur" }],
  phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
            router.replace("/login");
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
    background-color: rgba(245, 245, 245, 100);
    color: #ffffff !important;
    height: 45px;
    border: none;
    font-size: 16px;
    padding-left: 42px;
    border-radius: 4px;
    line-height: 20px;
  }
  .el-input__icon {
    line-height: 45px;
    font-size: 18px;
  }
}
</style>

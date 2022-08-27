<template>
  <div class="login-container lazyimage">
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

      <div class="login-form">
        <div class="login-logo containbg lazyimage">欧软云平台登录</div>
        <div class="login-item">
          <el-form
            class="form-wrap"
            ref="loginForm"
            :model="form"
            :rules="formRules"
            label-width="0px"
            size="default"
          >
            <el-form-item prop="orgNumber">
              <el-input
                v-model="form.orgNumber"
                prefix-icon="el-icon-office-building"
                placeholder="请输入企业代码"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="username">
              <el-input
                v-model="form.username"
                prefix-icon="el-icon-user"
                placeholder="请输入用户名"
                clearable
                @keyup.enter="onSubmit"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                type="password"
                prefix-icon="el-icon-lock"
                placeholder="请输入密码"
                clearable
                @keyup.enter="onSubmit"
              ></el-input>
            </el-form-item>
            <div class="forget-pwd">
              <span @click="onForgetClick">忘记密码?</span>
            </div>

            <el-form-item>
              <div style="display: flex; ">
                <el-button
                  type="primary"
                  @click="onSubmit"
                  @keyup.enter="onSubmit"
                  :loading="loading"
                >登录</el-button>
              </div>
              <div class="register go-register" @click="onRegister">
                <span>去注册</span>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="bottom-wrap">
                <span>
                  <img src="../../assets/images/icon.png" style="vertical-align: middle;" />
                  <a class="register go-helper" target="_blank" href="/document/helper.html">帮助手册</a>
                </span>

                <span @click="showQrcode">其他登录方式:钉钉</span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <div class="footer-link login-footer">
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
  <el-dialog v-model="forgetVisible" title="找回密码" @closed="forgetClose" width="600px">
    <el-form :model="forgetFrom" :rules="forgetRules" label-width="80px" ref="forgetFormRef">
      <template v-if="!verify.status">
        <el-form-item label="企业代码" prop="orgId">
          <el-input v-model="forgetFrom.orgId" placeholder="请输入企业代码"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="account">
          <el-input v-model="forgetFrom.account" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-row>
            <el-col :span="16">
              <el-input v-model="forgetFrom.phone" placeholder="请输入手机号"></el-input>
            </el-col>
            <el-col :span="6" :push="2">
              <el-button plain @click="sendCode" :disabled="verify.isSend">
                {{
                  verify.text
                }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="forgetFrom.code" placeholder="请输入验证码"></el-input>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="forgetFrom.password"
            placeholder="请输入新密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rePassword">
          <el-input
            v-model="forgetFrom.rePassword"
            placeholder="请再次输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="forgetVisible = false">取 消</el-button>
      <el-button type="primary" :loading="subLoading" @click="onSubmitForm">确定</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="ddvisible" title="扫码密码" @closed="ddClose" width="400px">
    <qrcode-vue :value="qrCodeValue" class="out-qrCode" :size="200" level="H"></qrcode-vue>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { setToken, setStorage } from "@/utils/utils";
import {
  userLogin,
  getVerifyCode,
  verifyInfo,
  setNewPass,
  getddqr,
} from "@/api/userApi/index";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import QrcodeVue from "qrcode.vue";

// "https://oapi.dingtalk.com/connect/qrconnect?appid=suiteio3vmtapxbirc3zf&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://192.168.0.145/opcloud/sys/dingLogin"
const qrCodeValue = ref(
  "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=suiteio3vmtapxbirc3zf&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://192.168.0.145/opcloud/sys/dingLogin"
);

// 当前实例
// 表单ref
const loginForm = ref<any>(null);
// loading
const loading = ref<boolean>(false);
// 表单对象
const form = reactive({
  orgNumber: "",
  username: undefined,
  password: undefined,
});
// 表单验证规则
const formRules = reactive({
  orgNumber: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
const store = useStore();
const router = useRouter();

// 注册
const onRegister = (): void => {
  router.push("/register");
};

// 登录
const onSubmit = (): void => {
  loading.value = true;
  loginForm.value &&
    loginForm.value.validate((valid: boolean) => {
      if (valid) {
        let para = {
          username: form.username + "_" + form.orgNumber,
          orgNumber: form.orgNumber,
          password: form.password,
          grant_type: "password",
          client_id: "opcloud",
          client_secret: "1",
        };
        userLogin(para)
          .then((res: any) => {
            loading.value = false;
            if (res.code == 200) {
              //有效期设置为7200s
              const { expiresIn, access_token } = res.data;
              setToken("accessToken", access_token, expiresIn);
              setToken("user", res.data, expiresIn);
              const routeQuery = router.currentRoute.value.query;
              if (routeQuery && routeQuery.redirect) {
                const redirect: string = routeQuery.redirect as string;
                router.replace(decodeURIComponent(redirect));
              } else {
                router.replace("/");
              }
              setStorage("nickName", res.data.nickName);
            }
          })
          .catch(() => {
            loading.value = false;
          });
      } else {
        loading.value = false;
        return false;
      }
    });
};

/**密码框失去焦点*/
const blurPassword = (rule, value, callback) => {
  if (
    value !== "" &&
    forgetFrom.rePassword !== "" &&
    forgetFrom.rePassword !== value
  ) {
    callback(new Error("两次输入的密码不一致"));
  } else if (forgetFrom.rePassword === value) {
    forgetFormRef.value.validateField("rePassword");
  }
  callback();
};
/**确认密码失去焦点*/
const blurRePassword = (rule, value, callback) => {
  if (forgetFrom.password !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    forgetFormRef.value.validateField("password");
  }
  callback();
};
/**忘记密码表单*/
const forgetFrom = reactive({
  orgId: "",
  account: "",
  phone: "",
  code: "",
  userId: "",
  password: "",
  rePassword: "",
});
/**忘记密码表单验证规则*/
const forgetRules = reactive({
  orgId: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
  account: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  phone: [
    { required: true, message: "请输入手机号码", trigger: "blur" },
    {
      pattern: /^1[\d]{10}$/i,
      message: "输入的手机号码不正确",
      trigger: "blur",
    },
  ],
  code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { validator: blurPassword, trigger: "blur" },
  ],
  rePassword: [
    { required: true, message: "请再次输入密码", trigger: "blur" },
    { validator: blurRePassword, trigger: "blur" },
  ],
});

/**找回密码表单Ref*/
const forgetFormRef = ref<any>(null);

/**验证码相关表单*/
const verify = reactive({
  /**验证成功状态*/
  status: false,
  /**验证码显示文字*/
  text: "发送验证码",
  /**验证码的倒计时*/
  count: 60,
  /**是否发送验证码*/
  isSend: false,
  /**发送验证码多次点击判断*/
  sendFlag: false,
});

/**验证码的定时器*/
const timer = ref<any>(null);

/**找回密码框显示隐藏*/
const forgetVisible = ref<boolean>(false);

/**弹框确定按钮loading*/
const subLoading = ref<boolean>(false);
/**点击忘记密码*/
const onForgetClick = () => {
  forgetVisible.value = true;
};
// 钉钉扫码登录弹框

const ddvisible = ref(false);

/**发送验证码*/
const sendCode = () => {
  forgetFormRef.value.validateField("phone", async (msg) => {
    if (verify.sendFlag) return;
    if (msg.length === 0) {
      verify.sendFlag = true;
      const res = await getVerifyCode({ phone: forgetFrom.phone });
      verify.sendFlag = false;
      if (res.code === 200) {
        countDown();
        verify.count = 60;
      }
    }
  });
};

/**倒计时*/
const countDown = () => {
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (verify.count == 0) {
      clearInterval(timer);
      verify.text = "重新获取";
      verify.isSend = false;
    } else {
      verify.count -= 1;
      verify.text = `${verify.count}s 后重试`;
      verify.isSend = true;
    }
  }, 1000);
};

//忘记密码
const onSubmitForm = () => {
  forgetFormRef.value.validate(async (valid) => {
    if (!valid) return;
    if (verify.status) {
      //验证码已验证
      const res = await setNewPass({
        userId: forgetFrom.userId,
        newPassword: forgetFrom.rePassword,
      });
      if (res.code === 200) {
        ElMessage.success(res.msg);
        forgetVisible.value = false;
      }
    } else {
      //验证码未验证
      const res = await verifyInfo({
        userName: forgetFrom.account,
        orgId: forgetFrom.orgId,
        phone: forgetFrom.phone,
        verificationCode: forgetFrom.code,
      });
      if (res.code === 200) {
        verify.status = true;
        // resetForm();
        forgetFrom.userId = res.data.userId;
      }
    }
  });
};

/**重置表单*/
function resetForm() {
  forgetFrom.orgId = "";
  forgetFrom.account = "";
  forgetFrom.code = "";
  forgetFrom.phone = "";
  forgetFrom.userId = "";
  forgetFrom.password = "";
  forgetFrom.rePassword = "";
}

/** 忘记密码弹框关闭*/
const forgetClose = () => {
  forgetFormRef.value.clearValidate();
  resetForm();
  verify.status = false;
};
// 关闭dd登录弹框
const ddClose = () => {
  ddvisible.value = false;
};

const showQrcode = () => {
  window.open(
    "https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=suiteio3vmtapxbirc3zf&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=http://192.168.0.145/opcloud/sys/dingLogin"
  );
  // ddvisible.value = true;
  // getddqr({}).then((res) => {
  //   console.log("123", res);
  // });
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/login.scss";
</style>
<style lang="scss">
.login-item {
  .el-input__inner {
    background-color: rgba(245, 245, 245, 100);
    height: 50px;
    // margin-bottom: 10px;
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

<template>
  <div class="login-container coverbg lazyimage">
    <div class="login-wrap">
      <div class="login-logo containbg lazyimage">
        <img src="../../assets/images/logo.png" />
      </div>
      <div class="left-wrap">
        <p>
          欢迎使用
          <br />运营管理平台
        </p>
      </div>
      <div class="right-wrap">
        <div class="login-form">
          <div class="login-item">
            <div class="login-title">用户登录</div>
            <el-form
              class="form-wrap"
              ref="loginForm"
              :model="form"
              :rules="formRules"
              label-width="0px"
              size="default"
            >
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
              <el-form-item>
                <div style="display: flex; margin-top: 30px;">
                  <el-button
                    type="primary"
                    @click="onSubmit"
                    @keyup.enter="onSubmit"
                    :loading="loading"
                  >登录</el-button>
                </div>
              </el-form-item>
            </el-form>
            <div class="bottom-wrap">
              <!-- <div class="forget-password" @click="onForgetClick">
                忘记密码?
              </div>-->
              <!-- <a class="register" target="_blank" href="/document/helper.html">帮助手册</a> -->
            </div>
          </div>
        </div>
      </div>
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
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { setToken, setStorage } from "@/utils/utils";
import { userLogin, getVerifyCode, verifyInfo, setNewPass } from "@/api/system";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
// 表单ref
const loginForm = ref<any>(null);
// loading
const loading = ref<boolean>(false);
// 表单对象
const form = reactive({
  orgNumber: "000",
  username: undefined,
  password: undefined,
});
// 表单验证规则
const formRules = reactive({
  // orgNumber: [{ required: true, message: "请输入企业代码", trigger: "blur" }],
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
          //调用145加的参数,后期删除
          // grant_type: "password",
          // client_id: "opcloud",
          // client_secret: "1",
        };
        userLogin(para)
          .then((res: any) => {
            loading.value = false;
            if (res.code == 200) {
              // 有效期设置为7200s 调用145
              const { expiresIn, token } = res.data;
              setToken("accessToken", token, expiresIn);
              // const { expiresIn, access_token } = res.data;
              // setToken("accessToken", access_token, expiresIn);
              setToken("user", res.data, expiresIn);

              const routeQuery = router.currentRoute.value.query;
              if (routeQuery && routeQuery.redirect) {
                router.replace(routeQuery.redirect as string);
              } else {
                router.replace("/systemset/manage");
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
</script>
<style>
.el-form-item__error {
  padding-top: 0px !important;
}
</style>
<style lang="scss" scoped>
.forget-password {
  cursor: pointer;
}
.footer-link {
  position: absolute;
  bottom: 80px;
  flex-direction: column;
}
.sendBtn {
  font-size: 12px;
  width: 120px;
  padding: 0;
}
.opcloud-knowledge {
  cursor: not-allowed !important;
  a {
    color: #999;
  }
}

a {
  text-decoration: none;
  color: #fff;
}
</style>
<style lang="scss" >
@import "@/styles/modules/login.scss";
</style>


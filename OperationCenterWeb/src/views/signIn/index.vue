<template>
  <div class="login-container coverbg lazyimage">
    <div class="login-wrap">
      <div class="left-wrap">
        <div class="left-lower-wrap">
          <div class="news-wrap">
            <div class="news-item">
              <div class="item-date">2021.11.04</div>
              <div class="item-content">V1.2.1正式版发布，好用更好看!</div>
            </div>
            <div class="news-item">
              <div class="item-date">2021.09.09</div>
              <div class="item-content">V1.1.0发布：工资核算、订单跟踪、设备管理等54项功能上线</div>
            </div>
          </div>
          <div class="module-wrap">
            <div
              :class="['module-item', item.className]"
              v-for="(item, index) in moduleName"
              :key="index"
            >
              <a
                v-if="!item.isPop"
                :href="item.site ? item.site : void 0"
                target="_blank"
              >{{ item.name }}</a>
              <el-popover v-else trigger="hover">
                <template #reference>
                  <div>{{ item.name }}</div>
                </template>
                <div>
                  <img style="width: 100%; height: 100%;" src="../../assets/images/qrcode.png" alt />
                </div>
              </el-popover>
            </div>
          </div>
        </div>
      </div>
      <div class="right-wrap">
        <div class="login-form">
          <div class="login-titles">
            <div class="login-logo containbg lazyimage">
              <img src="../../assets/images/logo.png" alt />
            </div>
            <div class="login-title">登 录</div>
          </div>

          <div class="login-item">
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
              <a class="register" target="_blank" href="/document/helper.html">帮助手册</a>
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
// 登录页超链接
const moduleName = [
  {
    name: "云搭正式环境",
    className: "opcloud-pro-env",
    site: "https://www.opcloud.cn/",
    isPop: false,
  },
  {
    name: "交付管理",
    className: "opcloud-pay-env",
    site: "http://demo.opcloud.com/",
    isPop: false,
  },
  {
    name: "云搭测试环境",
    className: "opcloud-test-env",
    site: "http://test.opcloud.com/",
    isPop: false,
  },
  {
    name: "云搭开发环境",
    className: "opcloud-dev-env",
    site: "http://dev.opcloud.com/",
    isPop: false,
  },
  {
    name: "云搭演示环境",
    className: "opcloud-demo-env",
    site: "https://demo.opsoft.com.cn/",
    isPop: false,
  },
  {
    name: "知识库",
    className: "opcloud-knowledge",
    site: "",
    isPop: false,
  },
  {
    name: "云搭看板",
    className: "opcloud-board",
    site: "http://124.70.106.26:51980/",
    isPop: false,
  },
  {
    name: "APP下载",
    className: "opcloud-app-download",
    site: "",
    isPop: true,
  },
];
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

<style lang="scss" scoped>
@import "@/styles/modules/login.scss";
</style>
<style lang="scss" scoped>
.login-title {
  font-size: 20px;
}
.forget-password {
  cursor: pointer;
}
.login-item {
  .el-input__inner {
    height: 50px;
    font-size: 16px;
    padding-left: 42px;
    line-height: 50px;
  }
  .el-input__icon {
    line-height: 50px;
    font-size: 18px;
  }
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

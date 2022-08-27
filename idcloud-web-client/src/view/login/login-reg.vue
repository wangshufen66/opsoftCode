<template>
  <div id="login-container">
    <div class="row-wrapper">
      <div class="col-wrapper">
        <div class="main-wrapper">
          <div ref="loginWrapper" class="login-wrapper">
            <div ref="loginLeftPicWrapper" class="login-left-pic-wrapper">
              <img ref="loginLeftPic" src="../../assets/images/new-login-page/pic_image.png"/>
            </div>
            <div class="login-right-form-wrapper">
              <div ref="logoWrapper" class="logo-wrapper">
                <div>
                  <img src="../../assets/images/new-login-page/logo-min.png"/>
                </div>
              </div>
              <div ref="formWrapper" id="form-wrapprr" class="form-wrapper">
                <el-form
                  id="form-login"
                  v-show="loginReg&&!$route.hash"
                  :model="loginForm"
                  ref="loginForm"
                  :rules="loginFormRules"
                  @keydown.enter.native="clickLogin"
                >
                  <el-form-item prop="orgNumber">
                    <el-input
                      class="form-input"
                      prefix-icon="el-icon-office-building"
                      v-model="loginForm.orgNumber"
                      placeholder="请输入企业代码"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="username">
                    <el-input class="form-input" prefix-icon="el-icon-user"
                              v-model="loginForm.username" placeholder="请输入登陆账号">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      class="form-input"
                      v-model="loginForm.password"
                      prefix-icon="el-icon-lock"
                      show-password
                      placeholder="请输入密码"
                    >
                    </el-input>
                  </el-form-item>
                  <el-form-item id="form-button-wrapper">
                    <el-button
                      :loading="loginLoading"
                      type="primary"
                      class="form-btn"
                      @click="clickLogin"
                    >登 录
                    </el-button>
                  </el-form-item>
                  <el-form-item>
                    <div class="forget-pwd-wrapper">
                      <el-button class="forget-pwd-btn" @click="forgetPwdClick" type="text">忘记密码？</el-button>
                    </div>
                  </el-form-item>
                </el-form>

                <el-form
                  id="reg-form"
                  v-show="!loginReg&&!$route.hash"
                  :model="regForm"
                  ref="regForm"
                  :rules="regFormRules"
                >
                  <el-form-item class="reg-form-title">
                    <div>创建您的ID Cloud账号</div>
                  </el-form-item>
                  <div class="reg-wrap-wrapper">
                    <el-form-item prop="userName">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg"
                        v-model.trim="regForm.userName"
                        placeholder="请输入注册账号"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div v-if="accountHintShow" class="reg-wrap-wrapper-small">
                    <p class="hint-line">可以使用字母、数字、下划线，长度在4-16位之间</p>
                  </div>
                  <div class="reg-wrap-wrapper">
                    <el-form-item prop="password">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg go-right"
                        v-model.trim="regForm.password"
                        show-password
                        placeholder="请输入密码"
                      ></el-input>
                    </el-form-item>
                    <el-form-item class="reg-confirm-pwd" prop="passwordConfirm">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg"
                        v-model.trim="regForm.passwordConfirm"
                        show-password
                        placeholder="请确认密码"
                      ></el-input>
                    </el-form-item>
                  </div>
                  <div v-if="pwdHintShow" class="reg-wrap-wrapper-small">
                    <p class="hint-line">长度在8-16位，至少包含一个字母或数字</p>
                  </div>
                  <div class="reg-wrap-wrapper">
                    <el-form-item prop="name">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg go-right"
                        v-model.trim="regForm.name"
                        placeholder="企业名称"
                      ></el-input>
                    </el-form-item>

                    <el-form-item prop="industry">
                      <span class="reg-required">*</span>
                      <el-select
                        class="form-input-reg"
                        v-model="regForm.industry"
                        placeholder="所属行业"
                      >
                        <el-option
                          v-for="item in industryList"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="reg-wrap-wrapper">
                    <el-form-item prop="creditCode">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg go-right"
                        v-model.trim="regForm.creditCode"
                        placeholder="社会统一信用代码"
                      ></el-input>
                    </el-form-item>

                    <el-form-item prop="phone">
                      <span class="reg-required">*</span>
                      <el-input class="form-input-reg" v-model="regForm.phone" placeholder="联系电话"></el-input>
                    </el-form-item>
                  </div>

                  <div class="reg-wrap-wrapper">
                    <el-form-item prop="email">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg go-right"
                        id="form-input-reg"
                        v-model.trim="regForm.email"
                        placeholder="联系邮箱"
                      >
                        <el-button
                          :loading="btnLoading"
                          :disabled="btnDisabled"
                          style="margin-right: 10px;"
                          @click="getVerificationCode"
                          type="text"
                          slot="suffix"
                          ref="VCBtn"
                        >{{btnText}}
                        </el-button>
                      </el-input>
                    </el-form-item>

                    <el-form-item prop="verificationCode">
                      <span class="reg-required">*</span>
                      <el-input
                        class="form-input-reg"
                        v-model.trim="regForm.verificationCode"
                        placeholder="邮箱验证码"
                      ></el-input>
                    </el-form-item>
                  </div>

                  <div class="reg-wrap-wrapper">
                    <el-form-item class="go-right-spec" prop="simpleAddress">
                      <span class="reg-required"></span>
                      <el-cascader
                        class="form-cascader-reg"
                        placeholder="请输入省市区"
                        v-model="regForm.simpleAddress"
                        :options="locationData"
                        clearable
                        @change="simpleAddressChange"
                        filterable
                      />
                    </el-form-item>

                    <el-form-item prop="detailAddress">
                      <span class="reg-required"></span>
                      <!-- <el-input
                        class="form-input-addr-reg"
                        v-model.trim="regForm.detailAddress"
                        placeholder="请输入详细地址"
                      ></el-input>-->
                      <el-autocomplete
                        class="form-input-addr-reg"
                        :debounce="1000"
                        v-model.trim="regForm.detailAddress"
                        :fetch-suggestions="detailAddressInputSugg"
                        placeholder="请输入详细信息"
                        :trigger-on-focus="false"
                        @select="getAnswer"
                      >
                        <template slot-scope="{ item }">
                          <div class="name">{{ item.value }}</div>
                          <span class="addr">{{ item.district + item.address }}</span>
                        </template>
                      </el-autocomplete>
                    </el-form-item>
                  </div>

                  <el-form-item id="reg-form-button-wrapper">
                    <el-button
                      :loading="regLoading"
                      type="primary"
                      @click="clickReg('regForm')"
                    >立即注册
                    </el-button>
                    <el-button class="login-to-current" type="text" @click="goLogin">登录现有账号</el-button>
                  </el-form-item>
                </el-form>

                <el-form
                  id="free-reg"
                  v-show="$route.hash"
                  :model="freeForm"
                  ref="freeForm"
                  :rules="freeFormRules"
                >
                  <el-form-item prop="business">
                    <el-input prefix-icon="el-icon-office-building"
                              v-model="freeForm.business" placeholder="请输入企业名称(必填)">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="name">
                    <el-input prefix-icon="el-icon-user"
                              v-model="freeForm.name" placeholder="请输入姓名(必填)">
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="phone">
                    <el-input prefix-icon="el-icon-mobile-phone" style="width: 65%"
                              v-model="freeForm.phone" placeholder="请输入手机号(必填)">
                    </el-input>
                    <el-button v-loading="code.loading"
                               :disabled="code.disabled"
                               style="width: 35%"
                               type="success" plain
                               @click="sendCode">{{code.text}}
                    </el-button>
                  </el-form-item>
                  <el-form-item prop="verificationCode">
                    <el-input prefix-icon="el-icon-help"
                              v-model="freeForm.verificationCode" placeholder="请输入验证码(必填)">
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button :loading="loginLoading" type="primary"
                               class="form-btn" @click="freeComplete">
                      完 成
                    </el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div class="go-to-reg-wrapper">
                <span v-show="loginReg&&!$route.hash">还没有账号?</span>
                <div @click="goReg" v-show="loginReg&&!$route.hash">去注册</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="background-pic-wrapper">
      <img src="../../assets/images/new-login-page/leftup.png"/>
      <img src="../../assets/images/new-login-page/leftdown.png"/>
      <img src="../../assets/images/new-login-page/right1.png"/>
      <img src="../../assets/images/new-login-page/right2.png"/>
      <img src="../../assets/images/new-login-page/right3.png"/>
      <img src="../../assets/images/new-login-page/bg_netview.png"/>
    </div>

    <el-dialog
      @open="dialogOpen"
      @closed="dialogClosed"
      @close="dialogClose"
      id="forget-pwd-dialog"
      width="520px"
      :title="forgetPwdForm.userId?'重置密码':'找回密码'"
      :close-on-click-modal="false"
      :visible.sync="forgetPwdFormVisible"
    >
      <el-form
        ref="forgetPwdForm"
        :model="forgetPwdForm"
        :rules="forgetPwdFormRules"
        label-width="80px"
        label-position="right"
      >
        <el-form-item v-if="!forgetPwdForm.userId"
                      style="height: 43px" label="企业代码" prop="orgNumber">
          <el-input
            style="width: 380px"
            placeholder="请输入"
            v-model="forgetPwdForm.orgNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!forgetPwdForm.userId"
                      style="height: 43px" label="账号" prop="username">
          <el-input
            style="width: 380px"
            placeholder="请输入"
            v-model="forgetPwdForm.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!forgetPwdForm.userId"
                      style="height: 43px" label="手机号" prop="phone">
          <el-input
            style="width: 260px"
            placeholder="请输入"
            v-model="forgetPwdForm.phone"
            autocomplete="off"
          ></el-input>
          <el-button v-loading="code.loading"
                     :disabled="code.disabled"
                     style="width: 120px"
                     type="success" plain
                     @click="sendCode">{{code.text}}
          </el-button>
        </el-form-item>
        <el-form-item v-if="!forgetPwdForm.userId"
                      style="height: 43px" label="验证码" prop="verificationCode">
          <el-input
            style="width: 380px"
            placeholder="请输入"
            v-model="forgetPwdForm.verificationCode"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="forgetPwdForm.userId"
                      style="height: 43px" label="新密码" prop="password">
          <el-input
            style="width: 380px"
            placeholder="请输入"
            v-model="forgetPwdForm.password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item v-if="forgetPwdForm.userId"
                      style="height: 43px" label="确认密码" prop="passwordConfirm">
          <el-input
            style="width: 380px"
            placeholder="请输入"
            v-model="forgetPwdForm.passwordConfirm"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="forgetPwdFormClose">取 消</el-button>
        <el-button type="primary" @click="forgetPwdFormConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <div v-if="hintDisplay" class="fixed-wrapper">
      <span>为了保证正常使用，我们建议使用浏览器：Chrome、Firefox | 建议屏幕分辨率：1920*1080像素</span>
      <i @click="handleClickHideHint" class="el-icon-circle-close"></i>
    </div>

    <el-dialog
      :show-close="false"
      :visible.sync="applySuccess.show"
      top="5vh"
      width="90%"
      :before-close="afterApplySuccess"
    >
      <span slot="title"></span>
      <span slot="footer"></span>
      <el-image
        :src="tableWidth>1022?applySuccessPc:applySuccessPhone"
        style="width: 100%"
        @click="afterApplySuccess"
        alt="恭喜!你已经申请成功!" />
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  ::v-deep {
    .el-form-item__label {
      width: 80px !important;
    }
  }

  .fixed-wrapper {
    position: fixed;
    width: calc(100% - 0.24px);
    bottom: 0;
    height: 40px;
    background-color: #1150e6;
    text-align: center;

    span {
      line-height: 40px;
      color: #ffffff;
      font-size: 12px;
    }

    i {
      position: absolute;
      font-size: 22px;
      color: #ffffff;
      line-height: 40px;
      right: 10px;
      cursor: pointer;
    }
  }
</style>

<script>
  import jsonData from "@/assets/static/data/address";
  import {mapActions} from "vuex";
  import {
    register,
    getIndustryList,
    getVerificationCode,
    forgetPassword,
    sendCode,
    registered,
    forgetCode,
    confirmPassword,
  } from "@/api/auth";
  import ElImage from "element-ui/packages/image/src/main";
  import applySuccessPc from "./applySuccessPc.png";
  import applySuccessPhone from "./applySuccessPhone.png";

  let pwdValidateCount = 0;
  let nameValidateCount = 0;
  export default {
    name: "log-reg",
    components: {ElImage},
    created() {
      this.locationData = jsonData;
      this.getIndustryList();
      window.addEventListener("resize", this.getTableWidth);
      this.getTableWidth();
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.getTableWidth);
    },
    computed: {
      emailAddr() {
        return this.regForm.email;
      },
    },
    watch: {
      emailAddr: {
        handler: function (n) {
          const pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
          this.btnDisabled = !pattern.test(n);
        },
        immediate: true,
      },
    },
    methods: {
      getTableWidth() {
        this.tableWidth = `${document.documentElement.clientWidth}`;
      },
      //手机验证
      checkPhone(rule, value, callback) {
        if (!(/^1[34578]\d{9}$/.test(value))&&this.freeForm.business&&this.freeForm.phone) {
          this.code.disabled = true;
          callback(new Error("请输入正确的手机号"));
        } else {
          this.code.disabled = false;
          callback();
        }
      },
      //免费注册界面-发送短信
      async sendCode() {
        this.code.loading = true;
        const quest = this.freeForm.phone ?
          sendCode({phone: this.freeForm.phone}) :
          forgetCode({phone: this.forgetPwdForm.phone});
        await quest.then(value => {
            if (value.status === 200 && value.data.code === 200) {
              let that = this;
              let second = 60;
              this.code.disabled = true;
              const interval = setInterval(() => {
                that.code.text = '重发验证(' + second + ')s';
                second--;
                if (second < 0) {
                  clearInterval(interval);
                  this.code.text = '发送验证码';
                  this.code.disabled = false;
                }
              }, 1000);
            } else {
              this.$notifyError("接口访问失败", value.data.msg);
              this.code.text = '发送验证码';
            }
          },
        ).finally(() => {
          this.code.loading = false;
        })
      },
      //免费试用 - 发送 免费使用者信息
      async freeComplete() {
        this.$refs.freeForm.validate(async (valid) => {
          if (valid) {
            await registered({
              name: this.freeForm.name,
              phone: this.freeForm.phone,
              company: this.freeForm.business,
              code: this.freeForm.verificationCode
            }).then(() => {
              this.applySuccess.show = true;
            })
          } else {
            return false;
          }
        });
      },
      //关闭界面后跳转到登录界面
      afterApplySuccess() {
        this.applySuccess.show = false;
        this.$router.push({
          name: 'login'
        })
      },

      handleClickHideHint() {
        this.hintDisplay = false;
      },
      clickLogin() {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.handleLoginSubmit();
          } else {
            return false;
          }
        });
      },
      clickReg(dom) {
        this.$refs[dom].validate((valid) => {
          if (valid) {
            this.handleReg();
          } else {
            return false;
          }
        });
      },

      async getIndustryList() {
        try {
          let res = await Promise.resolve(getIndustryList());
          if (res.data.code === 200) {
            this.industryList = res.data.data;
          }
        } catch (error) {
          console.log(error);
        }
      },
      clearNE() {
        this.addressNE = {};
        this.wholeAddress = "";
      },
      async detailAddressInputSugg(str, callback) {
        this.clearNE();
        const url = "https://restapi.amap.com/v3/assistant/inputtips";
        const key = "593a113247c4ba8949221df3acbdc499";
        const addressInfo = str;
        const city = this.regForm.simpleAddress[1];
        let cityParam = `&city=${city}`;
        if (city === undefined) {
          cityParam = "";
        }

        await this.$http
          .get(`${url}?key=${key}&keywords=${addressInfo}${cityParam}`)
          .then((res) => {
            let returnArray = res.data.tips.map((item) => {
              item.key = item.name;
              item.value = item.name;
              item.fullAddress = item.district + item.address;
              item.wholeLink = item.address + " (" + item.name + ")";
              return item;
            });

            callback(returnArray);
          })
          .catch((e) => {
            console.log(e);
          });
      },
      getAnswer(item) {
        let regex =
          "(?<province>[^省]+省|.+自治区)(?<city>[^自治州]+自治州|[^市]+市|[^盟]+盟|[^地区]+地区|.+区划)(?<county>[^市]+市|[^县]+县|[^旗]+旗|.+区)?(?<town>[^区]+区|.+镇)?(?<village>.*)";
        let address = item.district;
        let matchArray = address.match(regex);
        this.regForm.simpleAddress[0] = matchArray.groups.province;
        this.regForm.simpleAddress[1] = matchArray.groups.city;
        this.regForm.simpleAddress[2] = matchArray.groups.county;

        let locationArr = item.location.split(",");
        this.addressNE.lng = locationArr[0];
        this.addressNE.lat = locationArr[1];
      },
      async getGeoXY() {
        const url = "https://restapi.amap.com/v3/geocode/geo";
        const key = "593a113247c4ba8949221df3acbdc499";
        await this.$http
          .get(`${url}?key=${key}&address=${this.regForm.detailAddress}`)
          .then((res) => {
            let locationArr = res.data.geocodes[0].location.split(",");
            this.addressNE.lng = locationArr[0];
            this.addressNE.lat = locationArr[1];
          });
      },
      verificationCodeCountdown() {
        let that = this;
        let countdown = 60;
        let timer = "";
        setTime();

        function setTime() {
          if (timer !== "") {
            clearTimeout(timer);
          }

          if (countdown === 0) {
            clearTimeout(timer);
            that.btnDisabled = false;
            that.btnText = "再次获取";
            countdown = 60;
            return;
          } else {
            that.btnDisabled = true;
            that.btnText = `重新发送(${countdown})`;
            countdown--;
          }
          timer = setTimeout(() => {
            setTime();
          }, 1000);
        }
      },
      async getVerificationCode() {
        this.verificationCodeDecode = "";
        this.btnLoading = true;
        const param = {
          email: this.regForm.email,
        };
        try {
          let res = await Promise.resolve(getVerificationCode(param));
          if (res.data.code === 200) {
            this.$Notice.success({
              title: "验证码发送成功",
            });
            const codeComputed = window.atob(res.data.data);
            const codeArr = codeComputed.split("$$");
            this.verificationCodeDecode = codeArr[0];
            // console.log(this.verificationCodeDecode);

            this.verificationCodeCountdown();
          } else {
            this.$Notice.error({
              title: "验证码发送失败",
              desc: res.data.msg,
            });
          }
        } catch (error) {
          this.$Notice.error({
            title: "验证码接口调用失败",
            desc: error,
          });
        } finally {
          this.btnLoading = false;
        }
      },
      goReg() {
        this.$router.push({
          name:"login",
          hash:"#free"
        })
        // this.loginReg = false;
        // this.$refs.logoWrapper.style.transform =
        //   "translateX(-660px) translateY(60px)";
        // // this.$refs.loginLeftPic.style.transform = "scale(0.7) translateY(150px) translateX(-60px)";
        // this.$refs.loginLeftPic.style.transform =
        //   "scale(0.75) translateY(100px) translateX(-40px)";
        // this.$refs.loginWrapper.style["grid-template-columns"] = "40% 60%";
        // // this.$refs.loginLeftPicWrapper.style['justify-self'] = 'right'
        // this.$refs.formWrapper.style["justify-content"] = "flex-start";
        //
        // this.$refs.loginForm.clearValidate();
        // this.clearLoginForm();
        // this.verificationCodeDecode = "";
        // nameValidateCount = 0;
        // pwdValidateCount = 0;
        // this.accountHintShow = true;
        // this.pwdHintShow = true;
      },
      goLogin() {
        this.loginReg = true;
        this.$refs.logoWrapper.style.transform = "translateX(0) translateY(0)";
        this.$refs.loginLeftPic.style.transform =
          "scale(1) translateY(0) translateX(0)";
        this.$refs.loginWrapper.style["grid-template-columns"] = "50% 50%";
        this.$refs.formWrapper.style["justify-content"] = "center";

        this.$refs.regForm.clearValidate();
        this.clearRegForm();
        this.verificationCodeDecode = "";
        nameValidateCount = 0;
        pwdValidateCount = 0;
        this.accountHintShow = true;
        this.pwdHintShow = true;
      },
      simpleAddressChange(data) {
        console.log(data);
      },
      // login
      ...mapActions(["handleLogin", "getUserInfo"]),
      handleLoginSubmit() {
        const username =
          this.loginForm.username + "$$" + this.loginForm.orgNumber;
        // this.loginForm.username;
        const password = this.loginForm.password;

        this.loginLoading = true;
        this.handleLogin({username, password})
          .then((res) => {
            const orgId = sessionStorage.getItem(this.$store.state.user.token + "changeOrgId");
            const orgName = sessionStorage.getItem(this.$store.state.user.token + "changeOrgName");
            const orgNumber = sessionStorage.getItem(this.$store.state.user.token + "changeOrgNumber");
            if (res !== null && res !== undefined) {
              this.$message.success(res);
            }
            this.getUserInfo({orgId, orgName, orgNumber})
              .then((res) => {
                this.$router.push(
                  {
                    name: this.$config.homeName,
                  },
                  () => {
                    this.loginLoading = false;
                  }
                );
              })
              .catch((err) => {
                this.$notifyError("登录失败", err.msg || "接口访问失败");
                this.loginLoading = false;
              });
          })
          .catch((err) => {
            this.$notifyError("登录失败", err.msg || "接口访问失败");
            this.loginLoading = false;
          });
      },
      // reg
      async handleReg() {
        this.regLoading = true;
        if (this.regForm.detailAddress !== "") {
          // console.log("address not null");
          if (this.addressNE === "") {
            // console.log('ne null');

            try {
              await this.getGeoXY();
            } catch (error) {
              console.log(error);
            }
          }
        }
        // const orgNumber = this.regForm.industry;
        // const username = this.regForm.userName;
        // const password = this.regForm.password;
        const data = {
          userName: this.regForm.userName,
          password: this.regForm.password,
          name: this.regForm.name,
          unifiedSocialCreditCode: this.regForm.creditCode,
          // 所属行业
          businessType: this.regForm.industry,
          phone: this.regForm.phone,
          email: this.regForm.email,
          // 地区信息

          // 详细地址
          // address: this.regForm.detailAddress
        };
        if (
          this.regForm.simpleAddress !== "" &&
          this.regForm.simpleAddress !== [] &&
          this.regForm.simpleAddress !== null
        ) {
          data.province = this.regForm.simpleAddress[0];
          data.city = this.regForm.simpleAddress[1];
          data.district = this.regForm.simpleAddress[2];
        }
        if (this.regForm.detailAddress !== "") {
          data.longitude = this.addressNE.lng;
          data.latitude = this.addressNE.lat;
          if (this.wholeAddress !== "") {
            data.address = this.wholeAddress;
          } else {
            data.address = this.regForm.detailAddress;
          }
        }

        try {
          let res = await Promise.resolve(register(data));
          if (res.data.code === 200) {
            this.$message.success("注册成功");
            this.clearRegForm();
            this.goLogin();
            // 自动填充登录表单
            // this.loginForm = {
            //   orgNumber: orgNumber,
            //   username: username,
            //   password: password
            // };
          } else {
            this.$notifyError("注册失败", res.data.msg);
          }
        } catch (err) {
          this.$notifyError("注册接口调用失败", err);
        } finally {
          this.regLoading = false;
        }
      },

      checkSocialCreditCode(rule, Code, callback) {
        const patrn = /^[0-9A-Z]+$/;
        //18位校验及大写校验
        if (Code.length != 18 || patrn.test(Code) === false) {
          callback(new Error("不是有效的统一社会信用代码！"));
        } else {
          let Ancode; //统一社会信用代码的每一个值
          let Ancodevalue; //统一社会信用代码每一个值的权重
          let total = 0;
          const weightedfactors = [
            1,
            3,
            9,
            27,
            19,
            26,
            16,
            17,
            20,
            29,
            25,
            13,
            8,
            24,
            10,
            30,
            28,
          ]; //加权因子
          const str = "0123456789ABCDEFGHJKLMNPQRTUWXY";
          //不用I、O、S、V、Z
          for (var i = 0; i < Code.length - 1; i++) {
            Ancode = Code.substring(i, i + 1);
            Ancodevalue = str.indexOf(Ancode);
            total = total + Ancodevalue * weightedfactors[i];
            //权重与加权因子相乘之和
          }
          let logiccheckcode = 31 - (total % 31);
          if (logiccheckcode == 31) {
            logiccheckcode = 0;
          }
          const Str =
            "0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y";
          const Array_Str = Str.split(",");
          logiccheckcode = Array_Str[logiccheckcode];
          const checkcode = Code.substring(17, 18);
          if (logiccheckcode != checkcode) {
            callback(new Error("不是有效的统一社会信用代码！"));
          }
        }
        callback();
      },
      checkVCode(rule, Code, callback) {
        if (Code === "") {
          callback(new Error("验证码不得为空"));
        }
        if (Code !== this.verificationCodeDecode) {
          callback(new Error("验证码不正确"));
        }
        callback();
      },
      checkName(rule, Code, callback) {
        const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if (Code === "") {
          callback(new Error("注册账号不得为空"));
          nameValidateCount++;
          // 这个要注意
          if (nameValidateCount > 0) {
            this.accountHintShow = false;
          }
          return;
        }
        if (pattern.test(Code) === false) {
          this.accountHintShow = false;
          callback(new Error("账号必须在4-16位，不得包含特殊字符"));
          return;
        }
        this.accountHintShow = true;
        callback();
        return;
      },
      checkPwd(rule, Code, callback, source, options) {
        // options.first = false;
        // this.pwdHintShow = true
        const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        if (Code === "") {
          callback(new Error("密码不得为空"));
          pwdValidateCount++;

          if (pwdValidateCount > 1) {
            this.pwdHintShow = false;
          }

          return;
        }
        if (pattern.test(Code) === false) {
          callback(new Error("密码必须在8-16位，至少包含一个字母或数字"));
          this.pwdHintShow = false;
          return;
        }
        this.pwdHintShow = true;
        callback();
        return;
      },
      checkPwdConfirm(rule, Code, callback) {
        if (Code === "") {
          callback(new Error("确认密码不得为空"));
        } else {
          if (Code !== this.regForm.password) {
            callback(new Error("两次密码不正确"));
          }
        }
        callback();
      },
      checkPwdConfirm2(rule, Code, callback) {
        if (Code === "") {
          callback(new Error("确认密码不得为空"));
        } else {
          if (Code !== this.forgetPwdForm.passwordConfirm) {
            callback(new Error("两次密码不正确"));
          }
        }
        callback();
      },

      forgetPwdClick() {
        this.forgetPwdFormVisible = true;
      },
      forgetPwdFormClose() {
        this.forgetPwdForm = {
          //找回密码
          orgNumber: "",
          username: "",
          phone: "",
          verificationCode: "", //验证码
          //设置密码
          userId: '',//ID
          password: "", //密码
          passwordConfirm: "", //密码确认
        };
        this.forgetPwdFormVisible = false;
      },
      forgetPwdFormConfirm() {
        this.$refs.forgetPwdForm.validate((valid) => {
          if (valid) {
            if(this.forgetPwdForm.userId)
              this.reSetPwd();
            else
              this.handleForgetPwdSubmit();
          } else {
            return false;
          }
        });
      },
      forgetPwdCheckName(rule, Code, callback) {
        const pattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if (Code === "") {
          callback(new Error("登录账号不得为空"));
          return;
        }
        if (pattern.test(Code) === false) {
          callback(new Error("账号在4-16位之间，不包含特殊字符"));
          return;
        }
        callback();
        return;
      },
      // dialog open callback func
      dialogOpen() {
      },
      // forgetPwd
      async handleForgetPwdSubmit() {
        const param = {
          orgNumber: this.forgetPwdForm.orgNumber,
          phone: this.forgetPwdForm.phone,
          username: this.forgetPwdForm.username,
          verificationCode: this.forgetPwdForm.verificationCode,
        };
        try {
          let res = await Promise.resolve(forgetPassword(param));
          if (res.data.code === 200) {
            this.forgetPwdForm.userId = res.data.data;
            // this.forgetPwdFormClose();
          } else {
            this.$notifyError("短信验证失败", res.data.msg);
          }
        } catch (err) {
          this.$notifyError("接口调用失败", err);
        }
      },
      //重置密码
      async reSetPwd(){
        const param = {
          userId: this.forgetPwdForm.userId,
          userPasswordNew: this.forgetPwdForm.password,
        };
        try {
          let res = await Promise.resolve(confirmPassword(param));
          if (res.data.code === 200) {
            this.$message.success(res.data.msg);
            this.forgetPwdFormClose();
          } else {
            this.$notifyError("重置密码失败", res.data.msg);
          }
        } catch (err) {
          this.$notifyError("重置密码接口调用失败", err);
        }
      },
      dialogClosed() {
        this.forgetPwdFormClose();
      },
      dialogClose() {
        this.$refs.forgetPwdForm.clearValidate();
      },

      clearLoginForm() {
        this.loginForm = {
          orgNumber: "",
          username: "",
          password: "",
        };
        this.clearNE();
      },
      clearRegForm() {
        this.regForm = {
          userName: "", //帐号
          password: "", //密码
          passwordConfirm: "", //密码确认
          name: "", //企业名称
          creditCode: "", //社会信用统一代码
          industry: "", //企业行业
          phone: "", //企业电话
          email: "", //邮箱
          simpleAddress: "", //企业省市区地址
          detailAddress: "", //企业详细地址
          verificationCode: "", //验证码
        };
        this.clearNE();
      },
    },
    data() {
      return {
        applySuccessPc:applySuccessPc,
        applySuccessPhone:applySuccessPhone,
        tableWidth:'',
        applySuccess: {
          show: false,
        },
        code: {
          loading: false,
          text: '发送验证码',
          disabled: true,
        },
        //免费注册
        freeForm: {
          phone: "", //电话
          verificationCode: "", //验证码
          name: "", //姓名
          business: "", //企业
        },
        freeFormRules: {
          phone: [
            {required: true, message: "手机号不可为空", trigger: "blur"},
            {
              validator: (rule, value, callback) => {
                this.checkPhone(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          verificationCode: [
            {required: true, message: "验证码不可为空", trigger: "blur"},
          ],
          name: [
            {required: true, message: "姓名不可为空", trigger: "blur"},
          ],
          business: [
            {required: true, message: "企业不可为空", trigger: "blur"},
          ],
        },

        hintDisplay: true,
        loginForm: {
          orgNumber: "",
          username: "",
          password: "",
        },
        loginFormRules: {
          orgNumber: [
            {required: true, message: "企业代码不可为空", trigger: "blur"},
          ],
          username: [
            {required: true, message: "登陆账号不可为空", trigger: "blur"},
          ],
          password: [
            {required: true, message: "密码不可为空", trigger: "blur"},
          ],
        },
        regForm: {
          userName: "", //帐号
          password: "", //密码
          passwordConfirm: "", //密码确认
          name: "", //企业名称
          creditCode: "", //社会信用统一代码
          industry: "", //企业行业
          phone: "", //企业电话
          email: "", //邮箱
          simpleAddress: "", //企业省市区地址
          detailAddress: "", //企业详细地址
          verificationCode: "", //验证码
        },
        regFormRules: {
          userName: [
            {
              validator: (rule, value, callback) => {
                this.checkName(rule, value, callback);
              },
              trigger: ["blur"],
              // required: true,
              // message: "注册账号不能为空",
              // trigger: "blur"
            },
          ],
          password: [
            {
              validator: (rule, value, callback) => {
                this.checkPwd(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          passwordConfirm: [
            {
              validator: (rule, value, callback) => {
                this.checkPwdConfirm(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          name: [
            {
              required: true,
              message: "企业名称不能为空",
              trigger: "blur",
            },
          ],
          creditCode: [
            {
              required: true,
              message: "社会统一信用代码不能为空",
              trigger: "blur",
            },
            {
              validator: (rule, value, callback) => {
                this.checkSocialCreditCode(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          industry: [
            {
              required: true,
              message: "所属行业不能为空",
              trigger: "blur",
            },
          ],
          phone: [
            {
              required: true,
              // type: 'tel',
              // message: '请填写正确的联系电话',
              message: "联系电话不能为空",
              trigger: "blur",
            },
          ],
          email: [
            {
              required: true,
              type: "email",
              message: "请填写正确的邮箱",
              trigger: "blur",
            },
          ],
          verificationCode: [
            {
              validator: (rule, value, callback) => {
                this.checkVCode(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
        },
        industryList: [
          {
            id: 1,
            name: "汽配",
          },
          {
            id: 2,
            name: "光伏",
          },
          {
            id: 3,
            name: "光通信",
          },
        ],
        // true - login   false - reg
        loginReg: true,
        loginLoading: false,
        regLoading: false,
        // 省市区jsondata
        locationData: [],
        btnDisabled: true,
        btnLoading: false,
        btnText: "获取验证码",
        // lng lat
        addressNE: {},
        wholeAddress: "",
        verificationCodeDecode: "",
        accountHintShow: true,
        pwdHintShow: true,
        forgetPwdFormVisible: false,
        forgetPwdForm: {
          //找回密码
          orgNumber: "",
          username: "",
          phone: "",
          verificationCode: "", //验证码
          //设置密码
          userId: '',//ID
          password: "", //密码
          passwordConfirm: "", //密码确认
        },
        forgetPwdFormRules: {
          orgNumber: [{required: true, message: "企业代码不能为空", trigger: "blur",}],
          username: [
            {
              required: true,
              validator: (rule, value, callback) => {
                this.forgetPwdCheckName(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          phone: [
            {required: true, message: "手机号不可为空", trigger: "blur"},
            {
              validator: (rule, value, callback) => {
                this.checkPhone(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          verificationCode: [
            {required: true, message: "验证码不可为空", trigger: "blur"},
          ],
          password: [
            {required: true, message: "密码不可为空", trigger: "blur"},
            {
              validator: (rule, value, callback) => {
                this.checkPwd(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
          passwordConfirm: [
            {required: true, message: "确认密码密码不可为空", trigger: "blur"},
            {
              validator: (rule, value, callback) => {
                this.checkPwdConfirm2(rule, value, callback);
              },
              trigger: ["blur"],
            },
          ],
        },
      };
    },
  };
</script>

<style lang="less" scoped>
  #login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    min-height: 800px;
    min-width: 1200px;
    width: 100%;
    background: linear-gradient(to top, #256bfe, #6b68f0);

    .row-wrapper {
      z-index: 10;

      .col-wrapper {
        display: flex;
        justify-content: center;
        height: 100%;

        .main-wrapper {
          width: 1300px;
          height: 650px;
          background-color: white;
          border-radius: 15px;
          // box-shadow:1px 1px 10px black inset;
          display: flex;
          flex-direction: column;
          justify-content: center;

          .login-wrapper {
            display: grid;
            // grid-template-columns: 40% 60%;
            grid-template-columns: 50% 50%;
            width: 100%;
            height: 100%;

            .login-left-pic-wrapper {
              display: flex;
              flex-direction: column;
              justify-content: center;
              justify-self: center;

              img {
                position: relative;
                transition: all 0.5s;
                top: 20px;
                right: 10px;
                // background-color: #f9f9f9;
                // here
                // transform: scale(0.8) translateX(-100px) translateY(100px);
                width: 500px;
                height: 500px;
              }
            }

            .login-right-form-wrapper {
              display: flex;
              flex-direction: column;
              justify-content: space-evenly;

              .logo-wrapper {
                position: relative;
                transition: all 0.5s;
                display: flex;
                justify-content: center;
                // here
                // transform: translateX(-530px);
                img {
                  width: 130px;
                  height: 110px;
                }
              }

              .form-wrapper {
                position: relative;
                top: -30px;
                display: flex;
                justify-content: center;
                // justify-content: flex-start;
                .reg-form-title {
                  position: relative;
                  text-align: left;

                  div {
                    font-size: 28px;
                  }
                }

                .form-input {
                  width: 400px;
                  display: flex;
                  justify-content: center;
                  flex-direction: column;

                  .form-input-pic {
                    width: 17px;
                    height: 20px;
                  }
                }

                .reg-wrap-wrapper {
                  display: flex;
                  flex-wrap: nowrap;
                  height: 65px;
                }

                .reg-wrap-wrapper-small {
                  display: flex;
                  flex-wrap: nowrap;
                  height: 0;
                  position: relative;
                  left: 10px;
                  top: -17px;
                }

                .form-input-reg {
                  width: 300px;
                }

                .form-cascader-reg {
                  width: 200px;
                }

                .form-btn {
                  width: 400px;
                }

                .form-input-addr-reg {
                  width: 440px;
                }

                #reg-form-button-wrapper {
                  position: relative;
                  left: 230px;

                  .login-to-current {
                    margin-top: 10px;
                    margin-left: 30px;
                  }
                }

                .reg-required {
                  display: inline-block;
                  color: red;
                  position: relative;
                  right: 10px;
                  top: 6px;
                  font-size: 22px;
                  cursor: default;
                  height: 40px;
                  width: 10px;
                }

                .go-right {
                  margin: 0 50px 0 0;
                }

                .go-right-spec {
                  margin: 0 20px 0 0;
                }

                .forget-pwd-wrapper {
                  line-height: 16px;

                  .forget-pwd-btn {
                    font-size: 14px;
                    // font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #8c8c8c;
                  }
                }
              }

              .go-to-reg-wrapper {
                text-align: center;
                color: #8c8c8c;

                span {
                  cursor: default;
                  font-size: 16px;
                  // font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                }

                div {
                  display: inline-block;
                  cursor: pointer;
                  margin-left: 12px;
                  color: #2782fe;
                  font-size: 16px;
                  // font-family: PingFangSC-Semibold, PingFang SC;
                  font-weight: 600;
                }
              }
            }
          }
        }
      }
    }

    #reg-form {
      .hint-line {
        font-size: 12px;
        line-height: 12px;
        color: rgba(0, 0, 0, 0.45);
      }
    }

    .background-pic-wrapper {
      position: fixed;

      img:nth-child(1) {
        z-index: 2;
        position: fixed;
        top: 8vh;
        left: 10vw;
      }

      img:nth-child(2) {
        z-index: 2;
        position: fixed;
        bottom: 18px;
        left: 5vw;
      }

      img:nth-child(3) {
        z-index: 2;
        position: fixed;
        top: 8vh;
        left: 80vw;
      }

      img:nth-child(4) {
        z-index: 2;
        position: fixed;
        top: 20vh;
        // left: 95vw;
        // left: calc(100vw - 75px);
        right: 18px;
      }

      img:nth-child(5) {
        z-index: 2;
        position: fixed;
        bottom: 18px;
        // bottom: calc(0.01vh + 18px);
        right: 18px;
      }

      img:nth-child(6) {
        position: fixed;
        z-index: 1;
        top: 10vh;
        left: 1vw;
      }
    }
  }
</style>
<style lang="less">
  #form-login {
    .el-input__prefix {
      display: flex;
      justify-content: center;
      flex-direction: column;
      margin-left: 2px;
    }

    .el-input__inner {
      padding-left: 35px;
    }

    .forget-pwd-wrapper {
      .el-button {
        padding: 0 0;
      }
    }
  }

  #form-input-reg {
    button {
      span {
        font-size: 12px;
      }
    }
  }

  #reg-form {
    .el-form-item__error {
      // width: 100px;
      // text-align: center;
      // background-color: white;
      position: relative;
      top: 2px;
      left: 10px;
    }
  }

  #forget-pwd-dialog {
    .el-form-item__error {
      position: relative;
      line-height: 0;
      top: 8px;
      left: 75px;
    }
  }
</style>

//自适应屏幕
<style lang="less" scoped>
  @media (max-width: 1200px) {
    #login-container {
      min-width: auto !important;

      .login-left-pic-wrapper {
        display: none !important;

        img {
          display: none !important;
        }
      }

      .col-wrapper {
        display: inline !important;
      }

      .main-wrapper {
        width: 90vw !important;
        margin-left: 5vw !important;

        .login-wrapper {
          display: flex !important;
          flex-direction: row !important;
          justify-content: center !important;
        }
      }
    }
  }

  @media (max-width: 800px) {
    #login-container {
      overflow: auto;

      #reg-form {
        position: static;
        padding-left: 7vw;

        .reg-wrap-wrapper {
          flex-direction: column;
          height: auto;
          width: auto;

          .form-cascader-reg {
            width: 300px;
          }

          .form-input-addr-reg {
            width: 300px;
          }

          .go-right-spec {
            margin: 0 50px 22px 0;
          }
        }

        #reg-form-button-wrapper {
          position: static;
          margin-left: 15%;
        }

      }

      .main-wrapper {
        height: auto !important;
      }

      .logo-wrapper {
        margin-top: 50px;
        margin-bottom: 55px;
      }

      .go-to-reg-wrapper {
        margin-top: 60px !important;
        margin-bottom: 50px !important;
      }

      .fixed-wrapper {
        display: none !important;
      }
    }
  }

  @media (max-width: 600px) {
    #login-container {
      /deep/ .form-input {
        width: 70vw !important;
        min-width: 300px;
      }

      .form-btn {
        width: 70vw !important;
        min-width: 300px;
      }

      /deep/ .el-dialog {
        width: 100% !important;

        /deep/ .el-input {
          width: 75% !important;
          min-width: 200px;
        }
      }
    }
  }

  @media (max-width: 450px) {
    #login-container {
      #reg-form {
        padding-left: 0;

        .go-right {
          margin: 0;
        }

        .go-right-spec {
          margin: 0 !important;

          .reg-required {
            display: none;
          }

          .form-cascader-reg {
            margin-left: 10px;
            margin-bottom: 10px;
          }
        }
      }
    }
  }
</style>

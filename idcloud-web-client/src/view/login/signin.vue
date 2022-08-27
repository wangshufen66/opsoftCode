<template>
  <div>
    <Modal v-model="loginObj.show" header-hide footer-hide  class="signin-modal">
      <div
           element-loading-text="登录中..."
           element-loading-spinner="el-icon-loading"
           element-loading-background="rgba(255, 255, 255, 0.9)" class="signin-wrapper">
        <img class="signin-img" src="../../assets/images/login/signin.png">
        <p class="signin-title">欢迎登录 IDClOUD 平台</p>
        <login-form ref="loginForm" :buttonLoading="loginLoading" class="signin-form" @on-success-valid="handleSubmit"></login-form>
      </div>
    </Modal>
    <div></div>
  </div>
</template>

<script>
import LoginForm from "_c/login-form";
import { mapActions } from "vuex";

  export default {
    components: {
    	LoginForm
    },
    data() {
      return {
        loginLoading: false,
      }
    },
    props: {
      loginObj: {
        type: Object
      }
    },
    methods: {
      ...mapActions([
      	'handleLogin',
      	'getUserInfo'
      ]),
      handleSubmit({username, password}) {
        this.loginLoading = true
      	this.handleLogin({username, password}).then(res => {
          const orgId=sessionStorage.getItem(this.$store.state.user.token+"changeOrgId");
          const orgName=sessionStorage.getItem(this.$store.state.user.token+"changeOrgName");
          const orgNumber=sessionStorage.getItem(this.$store.state.user.token+"changeOrgNumber");
      		this.getUserInfo({orgId,orgName,orgNumber}).then(res => {
            this.$router.push({
      				name: this.$config.homeName
      			},()=>{
              this.loginLoading = false
            })
      		}).catch(err => {
      			this.$notifyError('登录失败',err.msg || '账号密码错误!！');
            this.loginLoading = false
      		})
      	}).catch(err => {
      		this.$notifyError('登录失败', err.msg || '账号密码错误!');
          this.loginLoading = false
      	})
      }
    }
  }
</script>

<style>
.signin-modal .ivu-modal-content {
  background-color: transparent;
}
.signin-modal .ivu-modal-body {
  padding: 0;
}
.signin-wrapper {
  position: relative;
}
.signin-img {
  width: 100%;
}
.signin-title {
  position: absolute;
  top: 36px;
  right: 128px;
  color: #fff;
  font-size: 16px;
}
.signin-form {
  position: absolute;
  top: 62px;
  right: 60px;
  width: 240px;
}
</style>

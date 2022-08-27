<template>
  <div class="login">
    <div class="header">
      <img class="logo" src="../../assets/images/login/new/logo/logo-min.png">
      <div class="columns">
        <el-button type="text" class="text-btn"><a href="http://www.opsoft.com.cn/" target="_blank" style="color: #5274ff">首页</a></el-button>
        <el-button type="text" class="text-btn"><a href="http://www.opsoft.com.cn/product.php" target="_blank">产品中心</a></el-button>
        <el-button type="text" class="text-btn"><a href="http://www.opsoft.com.cn/solution.php" target="_blank">解决方案</a></el-button>
        <el-button type="text" class="text-btn"><a href="http://www.opsoft.com.cn/page.php?mod=contact" target="_blank">服务支持</a></el-button>
        <el-button type="text" class="text-btn"><a href="http://www.opsoft.com.cn/info.php?cid=1" target="_blank">新闻动态</a></el-button>
        <el-button type="text" class="text-btn"><a href="http://www.opsoft.com.cn/page.php?mod=about" target="_blank">关于我们</a></el-button>
        <el-button class="btn-left" @click="signinFunc" round size="medium" type="primary">登录</el-button>
        <el-button v-if="true" class="btn-right" @click="registerFunc" round size="medium" type="primary">注册</el-button>
      </div>
    </div>
    <div class="header-wrapper">
      <img class="header-img" src="../../assets/images/login/new/area1-min.png">
    </div>
    <div class="container">
      <div class="pic-wrapper">
      <div class="pic-unit">
        <img src="../../assets/images/login/new/area2-min.png">
      </div>
      <div class="pic-unit">
        <img src="../../assets/images/login/new/area3-min.png">
      </div>
      <div class="pic-unit">
        <img src="../../assets/images/login/new/area4-min.png">
      </div>
      <div class="pic-unit">
        <img src="../../assets/images/login/new/area5-min.png">
      </div>
      <div class="pic-unit">
        <img src="../../assets/images/login/new/area6-min.png">
      </div>
      </div>
    </div>
    <div class="footer-wrapper" style="background-color: #3868e6">
      <div class="footer">
        <div class="footer-unit">
          <img class="unit-logo" src="../../assets/images/login/new/logo/logo-white-min.png">
        </div>
        <div class="footer-unit">
          <p style="font-size: 22px; margin-bottom: 10px; letter-spacing: 2px">产品中心</p>
          <img src="../../assets/images/login/new/line.png">
          <div class="unit-link-wrapper">
            <a>智能工厂软件</a>
            <a>智能工厂硬件</a>
            <a>企业管理系统</a>
            <a>智能工厂规划</a>
          </div>
        </div>
        <div class="footer-unit">
          <p style="font-size: 22px; margin-bottom: 10px; letter-spacing: 2px">解决方案</p>
          <img src="../../assets/images/login/new/line.png">
          <div class="unit-link-wrapper">
            <a>汽车零部件行业</a>
            <a>光通信行业</a>
            <a>光伏行业</a>
            <a>注塑行业</a>
          </div>
        </div>
        <div class="footer-unit">
          <p style="font-size: 22px; margin-bottom: 10px; letter-spacing: 2px">关于我们</p>
          <img src="../../assets/images/login/new/line.png">
          <div class="unit-link-wrapper">
            <a>关于ID Cloud</a>
            <a>行业资讯</a>
            <a>社会招聘</a>
            <a>联系我们</a>
          </div>
        </div>
        <div class="footer-unit">
          <img style="border-radius: 15px" src="../../assets/images/login/new/logo/qr-min.png">
          <p>关注官方微信</p>
        </div>
      </div>
    </div>
    <div class="copyright-wrapper" style="background-color: #285adb">
      <div style="display: flex; justify-content: center">
        <p class="footer-text" style="margin-right: 20px">Copyright © 2012-2020</p>
        <p class="footer-text">江苏欧软信息科技有限公司</p>
      </div>
      <div style="display: flex;justify-content: center;">
        <p class="footer-text" style="margin-right: 40px">保留所有版权</p>
        <a class="footer-text" style="margin-right: 40px" href="http://www.beian.miit.gov.cn/" target=_blank>ICP备案号：苏ICP备13024158号</a>
        <a href="#" style="margin-right: 15px">法律声明</a>
        <p class="footer-text">|</p>
        <a href="#" style="margin-left: 15px">隐私政策</a>
      </div>
      <div style="width: 100%;text-align: center;"><span style="font-size: 8px;">版本：{{version}}</span></div>
    </div>
    <Signin :loginObj="loginObj" ></Signin>
    <Register ref="registerMap" :registerObj="registerObj"></Register>
  </div>
</template>

<script>
  import Signin from './signin'
  import Register from './register'

	export default {
		components: {
      Signin,
      Register
		},
    data() {
      return {
        loginObj: {
          show: false
        },
        registerObj: {
          show: false,
          title: '欢迎注册 IDCLOUD 账号'
        },
        version: '1.0.3'  // 当前版本号
      }
    },
    mounted() {
		  // todo：暂且在登录页面直接做强制刷新
      // todo：后期需要后台记录版本号，并在所有接口反馈中都带一个版本信息（如版本是否更新的标识），前端每次请求接口都要进行判定，如果版本更新了，就执行以下代码，来强制刷新页面
      // todo：以上只是方案推荐，若有更有方案更加
      // location.reload()  // 相当于浏览器的 ctrl+f5 强制刷新，会清理掉浏览器的缓存，避免更新版本后，浏览器因遗留缓存而画面没有更新
      // this.$route.go(0)
    },
		methods: {
      signinFunc() {
        this.loginObj.show = true
      },
      registerFunc() {
        this.registerObj.show = true
        this.$refs.registerMap.initFunc()
      }
		}
	}
</script>

<style lang="less" scoped>
  .copyright-wrapper{
    padding: 20px;
    color: #ffffff;
  }
  .footer-text{
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    margin-bottom: 6px;
  }
  .copyright-wrapper a{
    color: #ffffff;
    line-height: 16px;
    font-size: 12px;
    text-align: center;
    margin-bottom: 6px;
  }
  .text-btn a{
    color: black;
    font-size: 16px;
  }
  .text-btn a:hover {
    color: #00a8ff;
  }

  .text-btn {
    margin-left: 50px;
  }
  .btn-left {
    margin-left: 50px;
  }

  .header-wrapper {
    position: relative;
    margin-top: 70px;
  }
  .header-img {
    width: 100%;
  }
  .pic-unit img {
    width: 100%;
  }
  .header {
    position:fixed;
    width: 100%;
    /*max-width: 1200px;*/
    height: 32px;
    padding: 12px 0;
    /*position: absolute;*/
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 9999;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .header:after{
    content: "";
    display: block;
    width: 100%;
    height: 70px;
    background: white;
    position: fixed;
    top: 0;
    z-index: -1;
    opacity: 0.8;
  }
  .logo {
    height: 60px;
  }
  .columns {
    line-height: 60px;
    margin-left: 100px;
    white-space:nowrap;
  }
  .button {
    margin-left: 12px;
    color: black;
    background-color: transparent;
  }
  .login-col {
    margin-right: 60px;
  }
  .button a {
    color: #000;
  }
  .pic-unit {
    position: relative;
  }

  .odd-unit, .even-unit {
    width: 100%;
    text-align: center;
  }
  .even-unit {
    background-color: #f8f8f8;
  }
  .footer-wrapper {
    padding: 40px 0;
    background: #22262a;
    color: #ffffff;
    font-size: 12px;
  }
  .footer {
    display: flex;
    width: 50%;
    max-width: 1200px;
    margin: 0 auto;
  }
  .footer .unit {
    flex: 1;
    text-align: left;
    font-size: 16px;
  }
  .footer .unit p {
    line-height: 36px;
  }
  .footer .unit p img {
    vertical-align: middle;
  }
  .footer-unit {
    margin-right: 80px;
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
  .footer-unit img{
    width: 100px;
    margin-bottom: 12px;
  }
  .unit-logo {
    position: relative;
    height: 50%;
    top: 20%;
  }
  .unit-qr {
    position: relative;
    height: 60%;
    top: 20%;
  }
  .unit-link-wrapper {
    display: flex;
    text-align: left;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: start;
    font-size: 15px;
  }
  .unit-link-wrapper a{
    margin: 3px 0;
    color: #ffffff;
    letter-spacing: 1px
  }
</style>

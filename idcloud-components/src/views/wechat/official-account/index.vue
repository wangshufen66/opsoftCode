<template>
  <div class="container" v-title data-title="IDCloud - 微信公众号">
    <div>
      <div class="upper-wrapper">
        <div class="img-wrapper">
          <img class="logo" src="./static/logo.png" />
        </div>
        <div class="text-wrapper">
          ID
          Cloud工业互联网平台由欧软与东南大学创新中心联合研发，是聚焦于汽车零部件行业的云平台，它具有了远程管理、灵活配置、大数据实时分析、大屏展示等诸多特点，着眼设备管理的痛点，以设备上云为抓手，构建生产制造工厂、设备厂商、设备监管“三位一体”生态体系，创新商业模式。
        </div>
      </div>
      <div class="down-wrapper">
        <div class="img-wrapper" style="margin-bottom: 2vh">
          <img class="qr" src="./static/wechat.jpg" />
        </div>
        <div style="color: #2e2e2e; font-size: 12px">长按识别或截图保存</div>
        <div style="color: #2e2e2e; font-size: 12px">
          关注公众号，移动管理数据服务
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "wechat-official-account",
  data() {
    return {};
  },
  async mounted() {},
  unmounted() {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
}
.img-wrapper {
  display: flex;
  justify-content: center;
}
.upper-wrapper {
  padding-top: 7vh;
  width: 100vw;
  max-width: 960px;
  height: 50vh;
  background-color: white;

  .logo {
    width: 40vw;
    height: 25vw;
    max-width: 200px;
    max-height: 125px;
  }
  .text-wrapper {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #2e2e2e;
    padding: 4vh 16px 0 16px;
  }
}
.down-wrapper {
  width: 100vw;
  max-width: 960px;
  height: 50vh;
  background-color: #f5f5f5;
  padding-top: 6vh;
  text-align: center;
  .qr {
    width: 50vw;
    height: 50vw;
    max-width: 300px;
    max-height: 300px;
  }
}
</style>
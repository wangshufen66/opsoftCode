<template>
  <div v-if="showFullScreenBtn" class="full-screen-btn-con">
    <el-tooltip :content="value ? '退出全屏' : '全屏'" placement="bottom">
      <i
        @click="handleChange"
        :class="value ? 'el-icon-crop' : 'el-icon-full-screen'"
        style="font-size: 23px; font-weight: bolder; cursor: pointer"
      ></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "Fullscreen",
  computed: {
    showFullScreenBtn() {
      return window.navigator.userAgent.indexOf("MSIE") < 0;
    },
  },
  // props: {
  //   value: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  data(){
    return{
      value:false,
    }
  },
  methods: {
    handleFullscreen() {
      let main = document.body;
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen();
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen();
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen();
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen();
        }
      }
      // this.value=!this.value;
    },
    handleChange() {
      this.handleFullscreen();
    },
  },
  mounted() {
    let isFullscreen =
      document.fullscreenElement ||
      document.mozFullScreenElement ||
      document.webkitFullscreenElement ||
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    isFullscreen = !!isFullscreen;
    document.addEventListener("fullscreenchange", () => {
      this.$emit("input", !this.value);
      this.$emit("on-change", !this.value);
      this.value=!this.value;
    });
    document.addEventListener("mozfullscreenchange", () => {
      this.$emit("input", !this.value);
      this.$emit("on-change", !this.value);
      this.value=!this.value;
    });
    document.addEventListener("webkitfullscreenchange", () => {
      this.$emit("input", !this.value);
      this.$emit("on-change", !this.value);
      this.value=!this.value;
    });
    document.addEventListener("msfullscreenchange", () => {
      this.$emit("input", !this.value);
      this.$emit("on-change", !this.value);
      this.value=!this.value;
    });
    this.$emit("input", isFullscreen);
  },
};
</script>

<style lang="less" scoped>
.full-screen-btn-con .el-tooltip {
  height: 44px;
  margin-top: 22px;
}
</style>

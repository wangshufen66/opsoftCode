<template>
  <div
    :style="{
      display: val.display,
      position: 'absolute',
      width: val.width / w * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / w * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      borderImage: `url(/static/images/border/${val.picValue}.png) ${val.borderImageSlice} fill stretch`,
      backgroundSize: '100% 100%',
      backgroundColor: val.backgroundColor,
      borderStyle: val.borderStyle,
      borderRadius: val.radius + 'px',
      borderColor: val.borderColor,
      borderWidth: val.borderWidth + 'px',
      flexDirection: val.dir,
      justifyContent: val.justify,
      alignItems: val.align
    }"
    class="lz-container"
  >
    <!-- 子组件 -->
    <slot />
  </div>
</template>

<script>
import stylec from "./style.vue";
const WIDGET_NAME = "BackgroundBorder";

export default {
  name: WIDGET_NAME,
  group: "material",
  icon: require("./icon/thumb-rect.png"),
  title: "边框",
  panel: stylec,
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    hasGuide: true,
    isUpload: false,
    isChild: false,
    dragable: true,
    resizable: true,
    name: "背景边框",
    desc: "", // 描述, 可自定义
    width: 600,
    height: 400,
    left: 50,
    top: 0,
    z: 0,
    display: "flex",
    bgColor: "",
    bgType: "bgColor",
    bgGradientcolor: "linear-gradient(#f00,#ff0)",
    backPic: "",
    backPicUrl: "",
    radius: 0,
    borderColor: "",
    borderWidth: 25,
    dir: "row",
    justify: "flex-start",
    align: "flex-start",
    belong: "page",
    animationName: "",

    borderStyle: "solid",

    backgroundColor: "rgba(0, 0, 0, 0)",
    borderWeight: 25,

    bgGradientcolor1: "#ffffff",
    bgGradientcolor2: "#333333",
    bgGradientdir1: "left",
    picValue: "bg1",
    borderImageSlice: '26'

  },
  props: ["w", "h", "val"],
  watch: {
    "val.bgType": function (newVal, oldVal) {
      console.log(this.val.bgType);
    },
    "val.borderWidth"(n) {
      this.val.borderWeight = n;
    },
    "val.borderWeight"(n) {
      this.val.borderWidth = n;
    }
  },
};
</script>

<style scoped>
.lz-container {
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
}
</style>

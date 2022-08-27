<template>
  <div :style="{
      position: 'absolute',
      width: val.width / w * 100 + '%',
      height: val.height / h * 100 + '%',
      left: val.left / w * 100 + '%',
      top: val.top / h * 100 + '%',
      zIndex: val.z,
      fontSize: val.fontSize + 'px',
      border: val.borderWeight + 'px ' + val.borderColor + ' solid',
      backgroundColor: val.backgroundColor,
      color: val.color
    }">
    <div class="lay-cont"></div>
    <dv-border-box-8>dv-border-box-8</dv-border-box-8>

  </div>
</template>

<script>
import stylec from './style.vue';

const WIDGET_NAME = 'DvBorderBox1';
export default {
  name: WIDGET_NAME,
  group: 'border',
  icon: require('./icon/rotate-line.png'),
  title: '边框1',
  panel: stylec,
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    width: 200,
    height: 200,
    left: 400,
    top: 400,
    z: 0,
    color: '#ff8000',
    name: '边框1', // 组件名称, 可自定义
    desc: '', // 描述, 可自定义
    belong: 'page',
    animationName: '',

    // 背景颜色、边框颜色、粗细
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderWeight: '1',
    borderColor: 'rgba(0, 0, 0, 0)',

    reverse: false,
    fontSize: 18,
  },
  props: ['w', 'h', 'val'],
  data() {
    return {};
  },
  computed: {},
  mounted() {
    // console.log(this.val);
  },
};
</script>

<style scoped>
</style>

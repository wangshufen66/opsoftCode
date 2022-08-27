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

    <!-- <dv-decoration-1 style="width:200px;height:50px;" /> -->

    <!-- <dv-decoration-2 style="width:200px;height:5px;" /> -->
    <!-- <dv-decoration-5 style="width:300px;height:40px;" /> -->

    <dv-decoration-4 :reverse="true" style="width:250px;height:5px;" />
  </div>
</template>

<script>
import stylec from './style.vue';

const WIDGET_NAME = 'DvDecoration1';
export default {
  name: WIDGET_NAME,
  group: 'decoration',
  icon: require('./icon/rotate-line.png'),
  title: '装饰1',
  panel: stylec,
  setting: {
    type: WIDGET_NAME,
    isContainer: false,
    isUpload: false,
    hasGuide: true,
    isChild: true,
    dragable: true,
    resizable: true,
    width: 350,
    height: 200,
    left: 400,
    top: 400,
    z: 0,
    color: '#ff8000',
    name: '装饰1', // 组件名称, 可自定义
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
    console.log(this.val);
  },
};
</script>

<style scoped>
</style>

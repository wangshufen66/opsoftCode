<template>
  <!--
   :class是为样式做准备的
   无论怎样都得提前准备好组件样式，以下只是加载方式的不同
   有三种策略
   1.如下 styleOne来加载新的class标签  缺点 只能用一个参数判断 优点 加载方便 调用该样式只需要组件中写一个styleOne即可
   2.直接用参数来打class标签 参数名即class标签 缺点 加载需要每次都写标签名 优点 可以写个数组多次变换标签
   3.计算属性 参照el-button本身组件加载class的方式 复杂场景下考虑 且配置复杂（可以考虑）
  -->
  <el-button
    class="id-button"
    :class="[
      styleOne ? 'id-button-style-one' : '',
      styleTwo ? 'id-button-style-two' : '',
      classKey,
    ]"
    v-loading="idLoad"
    v-if="idIf"
    v-show="idShow"
    :disabled="idDisable"
    v-on="$listeners"
    v-bind="$attrs"
  >
    <i v-if="beforeIf" class="id-button-before-icon" :class="beforeClass"></i>
    {{ text }}
    <i v-if="afterIf" class="id-button-after-icon" :class="afterClass"></i>
  </el-button>
</template>
<style lang="less" scoped>
  //公司按钮规范样式1  白底 蓝框蓝字体 =》 按钮组的按钮、下拉菜单的按钮 都是基于这个样式的底层
  .id-button-style-one {
    color: #1890ff;
    border: 1px solid #1890ff;
  }

  //公司图标按钮规范样式 =》 只有图标和文字的按钮
  //-------------------------------------------
  .id-button-style-two {
    border: 0;
    font-size: 14px;
    padding-left: 0;
    padding-right: 0;
    background-color: transparent;
  }

  .id-button-style-two:hover {
    background-color: transparent;
    color: #606266;
  }

  .id-button-style-two:focus {
    background-color: transparent;
    color: #606266;
  }

  //------------------------------------------
</style>
<script>
  export default {
    name: "id-button",
    props: {
      idLoad: {type: Boolean, default:false},
      idIf: {type: Boolean, default:true},
      idDisable: {type: Boolean, default:false},
      idShow: {type: Boolean, default:true},
      classKey: {type: String, default: "",},
      text: {type: String, default: "", required: true,},
      styleOne: {
        type: Boolean,
        default() {
          return false;
        },
      },
      styleTwo: {
        type: Boolean,
        default() {
          return false;
        },
      },
      beforeIf: {
        type: Boolean,
        default() {
          return false;
        },
      },
      beforeClass: {
        type: String,
        default() {
          return "";
        },
      },
      afterIf: {
        type: Boolean,
        default() {
          return false;
        },
      },
      afterClass: {
        type: String,
        default() {
          return "";
        },
      },
    },
  };
</script>

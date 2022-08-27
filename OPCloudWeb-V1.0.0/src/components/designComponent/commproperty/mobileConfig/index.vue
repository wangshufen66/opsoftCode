<!-- 组件属性配置 — 正则表达式配置 -->
<template>
  <div class="divider-wrap">移动端显示配置</div>
  <div class="mobilecfg">

    <div class="switchList">
      <div class="switchItem">是否显示
        <el-switch v-model="componentCfg.__mConfig__.inMobile" />
      </div>
      <div class="switchItem">标题字段
        <el-switch v-model="componentCfg.__mConfig__.isTitle" />
      </div>
      <div class="switchItem">二级标题
        <el-switch v-model="componentCfg.__mConfig__.isSecondTitle" />
      </div>
      <div class="switchItem">时间字段
        <el-switch v-model="componentCfg.__mConfig__.isTime" />
      </div>
      <div class="switchItem">状态字段
        <el-switch v-model="componentCfg.__mConfig__.isStatus" />
      </div>
      <div class="switchItem">进度字段
        <el-switch v-model="componentCfg.__mConfig__.isProgress" />
      </div>
      <div class="switchItem">卡片字段
        <el-switch v-model="componentCfg.__mConfig__.isCard" />
      </div>
      <div class="switchItem">搜索字段
        <el-switch v-model="componentCfg.__mConfig__.inSearch" />
      </div>
      <div class="switchItem">排序字段
        <el-switch v-model="componentCfg.__mConfig__.isTableSort" />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  name: "PropertyMobileConfig",
  props: {
    componentCfg: Object,
  },
  setup(props) {},
};
</script>

<style lang="scss" scoped>
.mobilecfg {
  width: 100%;
  .switchList {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px 20px;
  }
  .switchItem {
    width: 50%;
    height: 35px;
    font-size: 14px;
    color: #606266;
  }
}
</style>

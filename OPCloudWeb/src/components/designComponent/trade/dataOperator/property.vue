<!-- 组件属性配置 -->
<template>
  <el-form ref="formRef" label-width="100px" size="small">
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="子组件栅格">
      <el-slider v-model="componentCfg.__attr__.childSpan" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="显示创建人">
          <el-switch v-model="componentCfg.__attr__.creator" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="显示创建时间">
          <el-switch v-model="componentCfg.__attr__.createTime" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="显示更新人">
          <el-switch v-model="componentCfg.__attr__.updater" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="显示更新时间">
          <el-switch v-model="componentCfg.__attr__.updateTime" />
        </el-form-item>
      </el-col>
    </div>
  </el-form>
</template>

<script lang="ts">

export default {
  name: 'DataOperatorProperty',
  props: {
    componentCfg: Object,
  },
  setup(props) {
    
  },
};
</script>

<style>
</style>
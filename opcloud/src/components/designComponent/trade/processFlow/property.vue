<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="高度">
      <el-input-number :min="50" :max="800" v-model="componentCfg.__config__.height"></el-input-number>
    </el-form-item>
    <div class="divider-wrap">节点状态设置</div>
    <div class="switch-wrap">
      <template v-for="(item, index) in componentCfg?.__nodeStatus__">
        <div class="setting-item">
          <span class="close-btn" @click="componentCfg?.__nodeStatus__.splice(index, 1)">
            <i class="el-icon-remove-outline" />
          </span>
          <el-col :span="12">
            <el-form-item label="状态值">
              <el-select v-model="item.value" placeholder="Select">
                <el-option label="初始" :value="1"></el-option>
                <el-option label="执行中" :value="2"></el-option>
                <el-option label="关闭" :value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态颜色">
              <el-color-picker v-model="item.color"></el-color-picker>
            </el-form-item>
          </el-col>
        </div>
      </template>
      <div style="margin-left: 20px">
        <el-button icon="el-icon-circle-plus-outline" type="text" @click="onAddNodeStatus">添加状态配置</el-button>
      </div>
    </div>
    <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
  </el-form>
</template>

<script lang="ts">
import { PropType, reactive } from "vue";
import { ProcessFlowComponent } from "./IConfig";

export default {
  name: "ProcessFlowProperty",
  props: {
    componentCfg: Object as PropType<ProcessFlowComponent>,
  },
  setup(props) {
    const formModel = reactive({});
    const formRules = reactive({});

    function onAddNodeStatus() {
      props.componentCfg?.__nodeStatus__.push({
        value: '',
        color: ''
      })
    }

    return {
      formModel,
      formRules,
      onAddNodeStatus
    };
  },
};
</script>

<style lang="scss" scoped>
.tab-list-header {
  padding: 0;
}
.tab-item-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.tab-item {
  display: flex;
  align-items: center;
  border: 1px dashed #bbb;
  padding: 2px 8px;
  i {
    cursor: pointer;
    font-size: 18px;
  }
  .remove {
    color: #f86a6a;
  }
  .move-icon {
    padding: 0 4px;
    color: #777;
  }
  &.active {
    background-color: #d1eefa;
    border-color: #539af8;
  }
}
</style>

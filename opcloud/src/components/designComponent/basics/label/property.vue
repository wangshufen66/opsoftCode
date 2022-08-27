<!-- 组件属性配置 -->
<template>
  <el-form ref="formRef" label-width="100px" size="small">
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__config__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="头部图标">
      <el-input
        v-model="componentCfg.__attr__['prefix-icon']"
        placeholder="设置最大长度"
        clearable
        @change="onIconChange"
      >
        <template #append>
          <el-button @click="openIconsDialog('prefix-icon')">选择</el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="前置标线">
      <el-select v-model="componentCfg.__attr__.prefixLine">
        <el-option label="显示" :value="true"></el-option>
        <el-option label="不显示" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题大小">
      <el-input v-model="componentCfg.__attr__.fontSize" placeholder="设置标题文字大小" clearable></el-input>
    </el-form-item>
    <el-form-item label="标题斜体">
      <el-select v-model="componentCfg.__attr__.italic">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="标题加粗">
      <el-select v-model="componentCfg.__attr__.bold">
        <el-option label="是" :value="true"></el-option>
        <el-option label="否" :value="false"></el-option>
      </el-select>
    </el-form-item>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="背景色">
          <el-color-picker show-alpha v-model="componentCfg.__attr__.bgcolor"></el-color-picker>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="字体颜色">
          <el-color-picker show-alpha v-model="componentCfg.__attr__.fontColor"></el-color-picker>
        </el-form-item>
      </el-col>
      <template v-if="componentCfg.__attr__.prefixLine">
        <el-col :span="12">
          <el-form-item label="标线颜色">
            <el-color-picker show-alpha v-model="componentCfg.__attr__.prefixLineColor"></el-color-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标线宽度">
            <el-input
              v-model="componentCfg.__attr__.prefixLineWidth"
              placeholder="设置前置标线宽度"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
      </template>
    </div>
    <el-form-item label="表单展示">
      <el-switch v-model="componentCfg.__config__.inForm" />
    </el-form-item>
  </el-form>
  <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
</template>

<script lang="ts">
import useEmitter from "@/hooks/use-core/useMitt";
export default {
  name: "LabelProperty",
  props: {
    componentCfg: Object,
  },
  setup(props) {
    const mitter = useEmitter();

    function openIconsDialog(type: string) {
      props.componentCfg.__attr__.prefixLine = false;
      mitter.emitter.emit("on-property-setIcon", {
        parent: "__attr__",
        node: type,
      });
    }

    function onIconChange(e) {
      if (!e) {
        props.componentCfg.__attr__.prefixLine = true;
      }
    }

    return {
      openIconsDialog,
      onIconChange,
    };
  },
};
</script>

<style></style>

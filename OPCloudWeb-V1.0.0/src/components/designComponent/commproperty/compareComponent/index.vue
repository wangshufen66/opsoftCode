<template>
  <div v-if="componentCfg.__config__.verifyComponent">
    <div class="divider-wrap">组件校验</div>
    <el-form-item label="校验组件">
      <el-select v-model="componentCfg.__config__.verifyComponent.tag" clearable>
        <el-option
          v-for="component in componentList"
          :key="component.componentId"
          :value="component.componentId"
          :label="component.__form__.label"
          @change="addCompareItem"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="校验类型">
      <el-select
        v-model="componentCfg.__config__.verifyComponent.type"
        clearable
        @change="addCompareItem"
      >
        <el-option
          v-for="(item,index) in regTypeList"
          :key="index"
          :value="item.value"
          :label="item.lable"
        ></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { computed } from "vue";
import { useDesign } from "@/use/useDesign";
export default {
  name: "PropertyCompareComponent",
  props: {
    componentCfg: Object,
  },
  setup(props) {
    const { currentComponentList, componentValidation } = useDesign();
    const regTypeList = [
      { value: "==", lable: "等于" },
      { value: ">", lable: "大于" },
      { value: "<", lable: "小于" },
      { value: ">=", lable: "大于等于" },
      { value: "<=", lable: "小于等于" },
      { value: "!=", lable: "不等于" },
    ];
    const componentList = computed(() => {
      return currentComponentList.value.filter(
        (f) => f.componentId !== props.componentCfg.componentId
      );
    });
    /** 添加校验 */
    function addCompareItem() {
      componentValidation.value.push({
        tag: props.componentCfg.__config__.verifyComponent.tag,
        type: props.componentCfg.__config__.verifyComponent.type,
      });
    }

    return {
      componentList,
      addCompareItem,
      regTypeList,
    };
  },
};
</script>

<style></style>

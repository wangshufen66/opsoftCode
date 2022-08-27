<!-- 组件属性配置 — 正则表达式配置 -->
<template>
  <div class="divider-wrap">正则校验</div>
  <el-form-item label="默认正则">
    <el-select v-model="defregex" clearable @change="onDefaultChange">
      <el-option v-for="(regex, i) in defaultRegexList" :label="regex.name" :value="regex.codeInfoId" :key="i"></el-option>
    </el-select>
  </el-form-item>
  <template v-for="(item, index) in componentCfg.__form__?.regList" :key="index">
    <div v-if="!item.internally" class="setting-item">
      <span class="close-btn" @click="componentCfg?.__form__.regList.splice(index, 1)">
        <i class="el-icon-remove-outline" />
      </span>
      <el-form-item label="表达式">
        <el-input v-model="item.pattern" clearable placeholder="请输入正则" />
      </el-form-item>
      <el-form-item label="错误提示">
        <el-input v-model="item.message" clearable placeholder="请输入错误提示" />
      </el-form-item>
    </div>
  </template>
  <div style="margin-left: 20px">
    <el-button icon="el-icon-circle-plus-outline" type="text" @click="addReg">
      添加规则
    </el-button>
  </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { useDesign } from '@/use/useDesign';

export default {
  name: 'PropertyRegex',
  props: {
    componentCfg: Object,
  },
  setup(props) {
    const defregex = ref<string>();

    const { defaultRegexList } = useDesign();

    watch(
      () => props.componentCfg.componentId,
      () => {
        init();
      }
    );

    /**
     * 初始化
     */
    function init() {
      const internally = props.componentCfg?.__form__.regList.find(
        (item) => item.internally === true
      );
      const defaultCode =
        internally &&
        defaultRegexList.value.find((f) => f.code === internally?.pattern);
      defregex.value = defaultCode?.codeInfoId;
    }

    /**
     * 添加正则
     */
    const addReg = () => {
      if (props.componentCfg?.__form__.regList) {
        props.componentCfg.__form__.regList.push({
          pattern: '',
          message: '',
        });
      }
    };
    /**
     * 默认正则change事件
     */
    function onDefaultChange(e) {
      const regList = props.componentCfg?.__form__.regList || [];
      if (!e) {
        const index = regList.findIndex((item) => item.internally === true);
        index > -1 && props.componentCfg?.__form__.regList.splice(index, 1);
        return;
      }
      const currentDefaultregex = regList.find(
        (item) => item.internally === true
      );
      const defaultRegex = defaultRegexList.value.find(
        (f) => f.codeInfoId === e
      );
      if (currentDefaultregex) {
        currentDefaultregex.pattern = defaultRegex?.code;
        currentDefaultregex.message = defaultRegex?.remark;
      } else {
        regList.push({
          pattern: defaultRegex?.code,
          message: defaultRegex?.remark,
          internally: true,
        });
      }
    }

    init();

    return {
      defaultRegexList,
      defregex,
      addReg,
      onDefaultChange,
    };
  },
};
</script>

<style></style>

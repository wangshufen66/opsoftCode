<!-- 组件属性配置 -->
<template>
  <el-form ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg.__runtime__?.fieldDisabled"></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="占位文本">
      <el-input v-model="componentCfg.__attr__.placeholder" placeholder="设置占位文本" clearable></el-input>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <!-- 暂时不启用 -->
    <!-- <el-form-item>
      <template #label>
        生成接口
        <el-tooltip content="不填写则使用内置功能生成。" placement="bottom">
          <i class="header-icon el-icon-info"></i>
        </el-tooltip>
      </template>
      <el-input v-model="componentCfg.__attr__.action" placeholder="设置自动生成编码接口" clearable></el-input>
    </el-form-item>-->
    <el-form-item label="最大长度">
      <el-input-number disabled v-model="componentCfg.__attr__.maxlength" placeholder="设置最大长度" controls-position="right" style="width:100%;"></el-input-number>
    </el-form-item>
    <el-form-item label="头部图标">
      <el-input v-model="componentCfg.__attr__['prefix-icon']" placeholder="设置头部图标" clearable>
        <template #append>
          <el-button @click="openIconsDialog('prefix-icon')">选择</el-button>
        </template>
      </el-input>
    </el-form-item>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="显示标题">
          <el-switch v-model="componentCfg.__form__.showLabel" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否必填">
          <el-switch v-model="componentCfg.__form__.required" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否只读">
          <el-switch v-model="componentCfg.__attr__.readonly" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否禁用">
          <el-switch v-model="componentCfg.__attr__.disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template #label>
            不可跳号
            <el-tooltip placement="bottom">
              <i class="header-icon el-icon-info"></i>
              <template #content>
                跳号：编号不连续；新增时编号可见；
                <br />不跳号：编号连续；新增时编号不可见，保存后自动生成；不可重新生成；
              </template>
            </el-tooltip>
          </template>
          <el-switch v-model="componentCfg.__config__.isSeries" @change="onIsSeriesChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="可重新生成">
          <el-switch v-model="componentCfg.__attr__['reset-create']" :disabled="componentCfg.__config__.isSeries" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="搜索条件">
          <el-switch v-model="componentCfg.__config__.inSearch" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格展示">
          <el-switch v-model="componentCfg.__config__.inTable" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格排序">
          <el-switch v-model="componentCfg.__config__.tableSort" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表单展示">
          <el-switch v-model="componentCfg.__config__.inForm" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="唯一性">
          <el-switch v-model="componentCfg.__config__.unique" />
        </el-form-item>
      </el-col>
    </div>
    <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>

    <div class="divider-wrap">编码规则</div>
    <el-form-item label="规则">
      <el-select v-model="componentCfg.autorule.type" @change="onAutoTypeChange">
        <el-option :value="1" label="自增长数字"></el-option>
        <el-option :value="2" label="字母+数字"></el-option>
        <el-option :value="3" label="数字+字母"></el-option>
        <el-option :value="4" label="字母+日期"></el-option>
        <el-option :value="5" label="日期+自增长数字"></el-option>
        <el-option :value="6" label="字母+日期+自增长数字"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="默认字母" v-show="[2, 3, 4, 6].includes(componentCfg.autorule.type)">
      <el-input v-model="componentCfg.autorule.letter" placeholder="设置默认字母" clearable></el-input>
    </el-form-item>
    <el-form-item label="数字长度" v-show="componentCfg.autorule.type !== 4">
      <el-input v-model="componentCfg.autorule.numLen" min="1" max="30" placeholder="设置数字长度" clearable></el-input>
    </el-form-item>
    <el-form-item label="日期格式" v-show="[4, 5, 6].includes(componentCfg.autorule.type)">
      <el-select v-model="componentCfg.autorule.dataformat">
        <el-option :value="1" label="yyyyMMdd"></el-option>
        <el-option :value="2" label="yyyy-MM-dd"></el-option>
        <el-option :value="3" label="yyyyMMddHHmmss"></el-option>
        <el-option :value="4" label="yyyy-MM-dd HH:mm:ss"></el-option>
      </el-select>
    </el-form-item>
  </el-form>

</template>

<script lang="ts">
import { ref } from "vue";

import { defineComponent, PropType, onMounted } from "vue";
import useEmitter from "@/use/useEitter";
import { AutoCodeComponent } from "./IConfig";
import { useDesign } from "@/use/useDesign";

export default defineComponent({
  name: "AutoCodeProperty",
  props: {
    componentCfg: Object as PropType<AutoCodeComponent>,
  },
  setup(props) {
    const activeName = ref<string>("0");

    const { pageId } = useDesign();

    const mitter = useEmitter();

    function openIconsDialog(type: string) {
      mitter.emitter.emit("on-property-setIcon", {
        parent: "__attr__",
        node: type,
      });
    }

    function onAutoTypeChange(e) {
      if (props.componentCfg) {
        if ([1].includes(e)) {
          props.componentCfg.autorule.letter = undefined;
          props.componentCfg.autorule.dataformat = undefined;
        } else if ([5].includes(e)) {
          props.componentCfg.autorule.letter = undefined;
        } else if ([1, 2, 3].includes(e)) {
          props.componentCfg.autorule.dataformat = undefined;
        } else if ([4].includes(e)) {
          props.componentCfg.autorule.numLen = undefined;
        }
      }
    }

    function onIsSeriesChange(e) {
      // 连续的编码
      if (!!e) {
        props.componentCfg.__attr__["reset-create"] = false;
      }
    }

    onMounted(() => {
      // 创建的时候，确认组件的页面ID，避免被外部污染
      if (props.componentCfg) {
        props.componentCfg.autorule.tableId = pageId.value && pageId.value[2];
      }
    });

    return {
      activeName,
      openIconsDialog,
      onAutoTypeChange,
      onIsSeriesChange,
    };
  },
});
</script>

<style>
</style>
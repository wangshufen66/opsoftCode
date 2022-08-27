<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="110px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg.__runtime__?.fieldDisabled">
      </el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <el-form-item label="上传接口">
      <el-input v-model="componentCfg.__attr__.action" placeholder="请输入上传接口" clearable>
      </el-input>
    </el-form-item>
    <el-form-item label="最大文件大小">
      <el-input v-model="componentCfg.__config__.maxSize" placeholder="设置上传文件大小">
        <template #suffix>Mb</template>
      </el-input>
    </el-form-item>
    <el-form-item label="最大选择数">
      <el-input-number style="width: 100%" v-model="componentCfg.__attr__.limit" :max="10" :min="1" placeholder="设置单次上传数" controls-position="right"></el-input-number>
    </el-form-item>
    <el-form-item label="文件类型">
      <el-select style="width: 100%" v-model="componentCfg.__attr__['list-type']" @change="typeChange">
        <el-option label="图片" value="picture-card"></el-option>
        <el-option label="其他文件" value="text"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="允许类型">
      <el-select style="width: 100%" multiple v-model="selectedType" @change="selectChange">
        <el-option v-for="item in selectTypeList" :key="item.id" :label="item.label" :value="item.value"></el-option>
      </el-select>
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
        <el-form-item label="是否禁用">
          <el-switch v-model="componentCfg.__attr__.disabled" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="多选文件">
          <el-switch v-model="componentCfg.__attr__.multiple" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="携带token">
          <el-switch v-model="componentCfg.__config__.takeToken" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="携带cookie">
          <el-switch v-model="componentCfg.__attr__['with-credentials']" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template #label>已传列表
            <el-tooltip placement="bottom">
              <template #content> 图片模式不支持该选项 </template>
              <i class="header-icon el-icon-info"></i>
            </el-tooltip>
          </template>
          <el-switch v-model="componentCfg.__attr__['show-file-list']" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <template #label>支持拖拽
            <el-tooltip placement="bottom">
              <template #content> 拖拽模式下，文件上传类型不限制！ </template>
              <i class="header-icon el-icon-info"></i>
            </el-tooltip>
          </template>
          <el-switch v-model="componentCfg.__attr__.drag" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格展示">
          <el-switch v-model="componentCfg.__config__.inTable" />
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
    <property-regex :componentCfg="componentCfg"></property-regex>
  </el-form>
</template>

<script lang="ts">
import { PropType, reactive, ref, watch } from "vue";
import { getDictionariesInfo } from "@/api/system";
import { UploadComponent } from "./IConfig";
export default {
  name: "UploadProperty",
  props: {
    componentCfg: Object as PropType<UploadComponent>,
  },
  setup(props, { emit }) {
    const formModel = reactive({});

    const formRules = reactive({});

    const selectTypeList = ref<any[]>([]);

    const select = reactive<{
      img: any;
      other: any;
    }>({
      img: [],
      other: [],
    });

    const selectedType = ref([]);

    select.img = getTypeList("imgFileType");
    select.other = getTypeList("otherFileType");

    /**监听选择文件的变化*/
    watch(
      () => props.componentCfg.__attr__["list-type"],
      async (value) => {
        if (value === "text") {
          selectTypeList.value = await select.other;
        } else {
          selectTypeList.value = await select.img;
        }
      },
      { immediate: true }
    );
    /**监听允许类型变化*/
    watch(
      () => props.componentCfg.__attr__.accept,
      (value) => {
        selectedType.value = value ? value.split(",") : [];
      },
      { immediate: true }
    );

    /**获取可选类型下拉*/
    async function getTypeList(type) {
      const res = await getDictionariesInfo({
        dictionaryCode: type,
        current: 1,
        size: 100,
      });
      const arr = res.data.records.map((item) => ({
        label: item.name,
        value: item.code,
        id: item.codeInfoId,
      }));
      return arr;
    }
    /**文件类型下拉改变*/
    async function typeChange() {
      selectedType.value = [];
      props.componentCfg.__attr__.accept = "";
    }
    /**允许类型下拉改变*/
    function selectChange() {
      props.componentCfg.__attr__.accept = selectedType.value.toString();
    }

    return {
      formModel,
      formRules,
      selectTypeList,
      selectedType,
      selectChange,
      typeChange,
    };
  },
};
</script>

<style></style>

<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg?.__runtime__?.fieldDisabled"></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input v-model="componentCfg.__form__.label" placeholder="设置标题" clearable></el-input>
    </el-form-item>
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
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
        <el-form-item label="是否禁用">
          <el-switch v-model="componentCfg.__attr__.disabled" />
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
    </div>
    <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
    <div class="divider-wrap">基准时间</div>
    <el-form-item label="关联表">
      <el-select v-model="componentCfg.datum.tableName" clearable filterable placeholder="不设置时默认为当前时间" @change="onTableChange($event, 1)">
        <el-option v-for="table in tableList" :key="table.id" :value="table.tableName" :label="table.tableRemark"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="日期字段">
      <el-select v-model="componentCfg.datum.dateFileName" clearable filterable>
        <el-option v-for="field in tableFieldList" :key="field.fieldName" :value="field.fieldName" :label="field.fieldRemark"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联字段">
      <el-select v-model="componentCfg.datum.relField" clearable filterable>
        <el-option v-for="field in tableFieldList" :key="field.fieldName" :value="field.fieldName" :label="field.fieldRemark"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="表单字段">
      <el-select v-model="componentCfg.datum.field" clearable filterable>
        <el-option v-for="component in currentComponentList" :key="component.componentId" :value="component.__vModel__" :label="component.__form__.label || component.__vModel__"></el-option>
      </el-select>
    </el-form-item>
    <div class="divider-wrap">目标时间</div>
    <el-form-item label="关联表">
      <el-select v-model="componentCfg.contrast.tableName" clearable filterable @change="onTableChange($event, 2)">
        <el-option v-for="table in tableList" :key="table.id" :value="table.tableName" :label="table.tableRemark"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="日期字段">
      <el-select v-model="componentCfg.contrast.dateFileName" clearable filterable>
        <el-option v-for="field in contrastFieldList" :key="field.fieldName" :value="field.fieldName" :label="field.fieldRemark"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="关联字段">
      <el-select v-model="componentCfg.contrast.relField" clearable filterable>
        <el-option v-for="field in contrastFieldList" :key="field.fieldName" :value="field.fieldName" :label="field.fieldRemark"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="表单字段">
      <el-select v-model="componentCfg.contrast.field" clearable filterable>
        <el-option v-for="component in currentComponentList" :key="component.componentId" :value="component.__vModel__" :label="component.__form__.label || component.__vModel__"></el-option>
      </el-select>
    </el-form-item>
    <div class="divider-wrap">计算结果设置</div>
    <el-form-item label="结果单位">
      <el-select v-model="componentCfg.__config__.resultUnit" clearable filterable>
        <el-option :value="1" label="天"></el-option>
        <el-option :value="2" label="小时"></el-option>
        <el-option :value="3" label="分钟"></el-option>
        <el-option :value="4" label="秒"></el-option>
      </el-select>
    </el-form-item>
    <template v-for="item in componentCfg.result" :key="item.type">
      <el-form-item :label="item.type" label-width="60px" size="mini">
        <div class="result-wrap">
          <el-input-number v-model="item.criticalityValue" controls-position="right"></el-input-number>+
          <el-input v-model="item.criticalityLabel" placeholder="当前阶段描述"></el-input>
          <el-color-picker v-model="item.criticalityColor"></el-color-picker>
        </div>
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts">
import { reactive, ref } from "vue";
import useEmitter from "@/hooks/use-core/useMitt";
import { getfieldsByTableId, getTablesBypage } from "@/api/homeApi";
import { useDesign } from "@/hooks/use-design";

export default {
  name: "DateCriticalityProperty",
  props: {
    componentCfg: Object,
  },
  setup(props) {
    const activeName = ref<string>("0");

    const formModel = reactive({});

    const formRules = reactive({});

    const mitter = useEmitter();

    const tableList = ref<any[]>([]);

    const tableFieldList = ref<any[]>([]);

    const contrastFieldList = ref<any[]>([]);

    const { currentComponentList } = useDesign();

    function openIconsDialog(type: string) {
      mitter.emitter.emit("on-property-setIcon", {
        parent: "__attr__",
        node: type,
      });
    }

    async function onTableChange(value, type) {
      if (!value) {
        if (type === 1) {
          props.componentCfg && (props.componentCfg.datum.relField = undefined);
        } else {
          props.componentCfg &&
            (props.componentCfg.contrast.relField = undefined);
        }
        return;
      }
      const tableId = tableList.value.find((f) => f.tableName == value).id;
      if (!tableId) return;
      let para = { tableId };
      const res = await getfieldsByTableId(para);
      if (res.code === 200) {
        if (type === 1) {
          tableFieldList.value = res.data;
        } else {
          contrastFieldList.value = res.data;
        }
      }
    }

    async function getTables(): Promise<void> {
      let para = {
        pageIndex: 1,
        pageSize: 2000,
      };
      const res = await getTablesBypage(para);
      if (res.code === 200) {
        tableList.value = res.data.records;
      }
    }

    /**
     * 初始化
     */
    async function init() {
      await getTables();
      if (props.componentCfg.datum.tableName) {
        onTableChange(props.componentCfg.datum.tableName, 1);
      }
      if (props.componentCfg.contrast.tableName) {
        onTableChange(props.componentCfg.contrast.tableName, 2);
      }
    }

    init();

    return {
      activeName,
      formModel,
      formRules,
      tableList,
      contrastFieldList,
      tableFieldList,
      currentComponentList,
      openIconsDialog,
      onTableChange,
    };
  },
};
</script>

<style lang="scss">
.result-wrap {
  display: flex;
}
</style>

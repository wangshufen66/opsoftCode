<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="110px" size="small">
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="行索引">
          <el-switch v-model="componentCfg.__attr__.indexCol" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="行多选">
          <el-switch v-model="componentCfg.__attr__.selectionCol" @change="onSelectionColChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="批量删除">
          <el-switch v-model="componentCfg.__attr__.batchDelete" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="分页">
          <el-switch v-model="componentCfg.__attr__.paging" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表单展示">
          <el-switch v-model="componentCfg.__config__.inForm" />
        </el-form-item>
      </el-col>
    </div>
    <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>

    <div class="divider-wrap">数据源</div>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="数据源设置">
          <el-button :type="componentCfg.selectModel && componentCfg.selectModel.length > 0 ? 'success' : 'danger'" plain icon="el-icon-setting" @click="dataSoureSetVisible = true"></el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格列设置">
          <el-button :type="componentCfg.columnModel && componentCfg.columnModel.length > 0 ? 'success' : 'danger'" plain icon="el-icon-setting" @click="columnSetVisible = true"></el-button>
        </el-form-item>
      </el-col>
    </div>
  </el-form>

  <data-soure-setting v-model:visible="dataSoureSetVisible" :setting="componentCfg?.selectModel" @on-submit="onSubmitDataSoureSet"></data-soure-setting>
  <column-setting v-model:visible="columnSetVisible" :columnSetting="componentCfg?.columnModel"></column-setting>

</template>

<script lang="ts">
import { reactive, ref } from "vue";
import dataSoureSetting from "@/components/dataSoureSetting/index.vue";
import columnSetting from "@/components/commontable/columnSetting.vue";
import { ITableColunmSetting } from "@/interfaces/ITableConfig";

export default {
  name: "TableProperty",
  components: { dataSoureSetting, columnSetting },
  props: {
    componentCfg: Object,
  },
  setup(props, { emit }) {
    const formModel = reactive({});

    const formRules = reactive({});

    const dataSoureSetVisible = ref<boolean>(false);
    const columnSetVisible = ref<boolean>(false);

    function onSelectionColChange(e: boolean) {}

    function onSubmitDataSoureSet(obj: any[]) {
      props.componentCfg && (props.componentCfg.selectModel = obj);
      // 生成列配置
      const columnSetting = columnTransform(props.componentCfg?.selectModel);
      columnSetting &&
        columnSetting.length > 0 &&
        (props.componentCfg.columnModel = columnSetting);
    }

    /**
     * 数据源配置转换成列
     * @configList 数据源配置
     */
    function columnTransform(configList: any[]) {
      const colums: ITableColunmSetting[] = [];
      for (let i = 0; i < configList.length; i++) {
        const config = configList[i];
        const filters = config.fields.filter((f) => f.check === true);
        colums.push(
          ...filters.map((m) => {
            return {
              prop: `${config.tableName}__${m.fieldName}`.toLocaleUpperCase(),
              label:
                m.fieldRemark === "id"
                  ? `${config.tableRemark}__ID`
                  : m.fieldRemark,
              width: 180,
              sortable: m.sortable,
              check: false,
              insearh: 0,
            };
          })
        );
      }
      return colums;
    }

    return {
      formModel,
      formRules,
      dataSoureSetVisible,
      columnSetVisible,
      onSelectionColChange,
      onSubmitDataSoureSet,
    };
  },
};
</script>

<style>
</style>
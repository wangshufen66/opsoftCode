<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="栅格">
      <el-slider v-model="componentCfg.__form__.span" :max="24" :min="1" :marks="{ 6: '', 12: '', 18: '' }" />
    </el-form-item>
    <div class="divider-wrap tab-list-header">标签页</div>
    <draggable class="tab-item-list" :list="componentCfg.tabOptions" :animation="400" item-key="id" group="tabItem" draggable=".tab-item">
      <template #item="{ element, index }">
        <div class="tab-item" :class="{ active: currentTabId === element.id }" @click="onTabItemClick(element.id, index)">
          <div class="remove">
            <i class="el-icon-remove-outline" @click.stop="onDeleteTabItem(index)" />
          </div>
          <div class="move-icon">
            <i class="el-icon-s-operation" />
          </div>
          <el-input v-model="element.label" size="mini"></el-input>
        </div>
      </template>
    </draggable>
    <div class="property-additem">
      <el-button class="btn-operate" icon="el-icon-circle-plus-outline" type="text" @click="addTabItem">
        添加选项
      </el-button>
    </div>
    <div class="divider-wrap">数据源</div>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="数据源设置">
          <el-button type="success" plain icon="el-icon-setting" @click="dataSoureSetVisible = true"></el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格列设置">
          <el-button type="success" plain icon="el-icon-setting" @click="columnSetVisible = true"></el-button>
        </el-form-item>
      </el-col>
    </div>
    <div class="divider-wrap">主从关联设置</div>
    <el-form-item label="主表字段">
      <el-select v-model="relFields.masterField" filterable clearable placeholder="默认主表ID字段">
        <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="表格字段">
      <el-select v-model="relFields.field" filterable clearable>
        <el-option v-for="item in columnModel.columnConfig" :key="item.prop" :value="item.prop" :label="item.label"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
  <property-mobile-config :componentCfg="componentCfg"></property-mobile-config>
  <data-soure-setting v-model:visible="dataSoureSetVisible" :setting="selectModel.config" @on-submit="onSubmitDataSoureSet"></data-soure-setting>
  <column-setting v-model:visible="columnSetVisible" :columnSetting="columnModel.columnConfig"></column-setting>
</template>

<script lang="ts">
import { computed, PropType, reactive, ref, watch } from "vue";
import dataSoureSetting from "@/components/dataSoureSetting/index.vue";
import columnSetting from "@/components/commontable/columnSetting.vue";
import draggable from "vuedraggable";
import { ITableColunmSetting } from "@/interfaces/ITableConfig";
import { CustomAddComponent } from "./config";
import { useDesign } from "@/use/useDesign";

export default {
  name: "CustomAddProperty",
  components: { dataSoureSetting, columnSetting, draggable },
  props: {
    componentCfg: Object as PropType<CustomAddComponent>,
  },
  setup(props) {
    const formModel = reactive({});
    const formRules = reactive({});

    const currentTabId = ref<number | string | undefined>(undefined);

    const dataSoureSetVisible = ref<boolean>(false);
    const columnSetVisible = ref<boolean>(false);

    const selectModel = ref<any>({});
    const columnModel = ref<any>({});

    const relFields = ref<any>({
      pid: undefined,
      masterField: undefined,
      field: undefined,
    });

    const { currentComponentList } = useDesign();

    let add = 0;

    watch(currentTabId, (value) => {
      selectModel.value = props.componentCfg?.selectModelList.find(
        (f) => f.pid === value
      );
      columnModel.value =
        props.componentCfg?.columnModelList.find((f) => f.pid === value) || [];
      relFields.value = props.componentCfg?.relFields.find(
        (f) => f.pid === value
      ) || {
        pid: undefined,
        masterField: undefined,
        field: undefined,
      };
    });

    const masterComponent = computed(() => {
      const propList: any = [];
      const componentList = currentComponentList.value;
      componentList &&
        componentList.forEach((item) => {
          if (item.componentId != props.componentCfg?.componentId) {
            propList.push({
              label: item.__form__.label,
              value: item.__vModel__,
            });
          }
        });
      return propList;
    });

    function addTabItem() {
      add++;
      const id = +new Date();
      currentTabId.value = id;
      props.componentCfg?.tabOptions.push({
        id,
        label: `标签页${add}`,
      });
      props.componentCfg?.selectModelList.push({
        pid: id,
        config: [],
      });
      props.componentCfg?.columnModelList.push({
        pid: id,
        columnConfig: [],
      });
      props.componentCfg?.relFields.push({
        pid: id,
        masterField: undefined,
        field: undefined,
      });
      props.componentCfg?.dataSourceList.push({
        pid: id,
        dataSource: [],
      });
    }

    function onDeleteTabItem(index: number) {
      const delId = props.componentCfg?.tabOptions[index].id;
      if (props.componentCfg?.tabOptions[index].id === currentTabId.value) {
        currentTabId.value =
          props.componentCfg?.tabOptions[0] &&
          props.componentCfg?.tabOptions[0].id;
      }
      props.componentCfg?.tabOptions &&
        props.componentCfg?.tabOptions.length > 0 &&
        props.componentCfg?.tabOptions.splice(index, 1);
      deleteTabItemConfig(props.componentCfg?.selectModelList, delId);
      deleteTabItemConfig(props.componentCfg?.columnModelList, delId);
      deleteTabItemConfig(props.componentCfg?.relFields, delId);
      deleteTabItemConfig(props.componentCfg?.dataSourceList, delId);
    }

    function deleteTabItemConfig(list, delId) {
      const len = list.length || 1;
      for (let i = len - 1; i >= 0; i--) {
        if (list[i].pid === delId) {
          list.splice(i, 1);
        }
      }
    }

    function onTabItemClick(id: number | string, index: number) {
      currentTabId.value = id;
    }

    function onSubmitDataSoureSet(obj: any[]) {
      selectModel.value && (selectModel.value.config = obj);
      // 生成列配置
      const columnSetting = columnTransform(selectModel.value.config);
      columnSetting &&
        columnSetting.length > 0 &&
        (columnModel.value.columnConfig = columnSetting);
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
              width: 150,
              sortable: m.sortable,
              check: false,
              insearh: 0,
            };
          })
        );
      }
      return colums;
    }

    const tabOptions = props.componentCfg?.tabOptions;
    currentTabId.value = tabOptions && tabOptions[0] && tabOptions[0].id;

    return {
      formModel,
      formRules,
      currentTabId,
      selectModel,
      columnModel,
      relFields,
      masterComponent,
      dataSoureSetVisible,
      columnSetVisible,
      addTabItem,
      onSubmitDataSoureSet,
      onDeleteTabItem,
      onTabItemClick,
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

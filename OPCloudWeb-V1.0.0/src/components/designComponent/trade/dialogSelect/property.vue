<!-- 组件属性配置 -->
<template>
  <el-form :model="formModel" :rules="formRules" ref="formRef" label-width="100px" size="small">
    <el-form-item label="字段名">
      <el-input v-model="componentCfg.__vModel__" placeholder="请输入字段名" clearable :disabled="componentCfg?.__runtime__?.fieldDisabled"></el-input>
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
    <el-form-item label="头部图标">
      <el-input v-model="componentCfg.__attr__['prefix-icon']" placeholder="设置最大长度" clearable>
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
        <el-form-item label="是否禁用">
          <el-switch v-model="componentCfg.__attr__.disabled" />
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
    <div class="divider-wrap">数据源</div>
    <div class="switch-wrap">
      <el-col :span="12">
        <el-form-item label="数据源设置">
          <el-button :type="
              componentCfg.selectModel && componentCfg.selectModel.length > 0
                ? 'success'
                : 'danger'
            " plain icon="el-icon-setting" @click="dataSoureSetVisible = true"></el-button>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="表格列设置">
          <el-button :type="
              componentCfg.columnModel && componentCfg.columnModel.length > 0
                ? 'success'
                : 'danger'
            " plain icon="el-icon-setting" @click="columnSetVisible = true"></el-button>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="绑定值">
          <el-select v-model="componentCfg.__config__.valueBindField" filterable clearable placeholder="选择组件值字段">
            <el-option v-for="item in componentCfg.columnModel" :key="item.prop" :value="item.prop" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="显示文本">
          <el-select v-model="componentCfg.__config__.textBindField" filterable clearable placeholder="选择回显文本字段">
            <el-option v-for="item in componentCfg.columnModel" :key="item.prop" :value="item.prop" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </div>
    <property-rel-component :componentCfg="componentCfg"></property-rel-component>
    <div class="divider-wrap">数据复制设置</div>
    <div class="switch-wrap">
      <el-form-item label="绑定复制功能">
        <el-select v-model="componentCfg.copyData.bindCopy" filterable clearable>
          <el-option v-for="item in bindingList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联条件">
        <el-select v-model="componentCfg.copyData.relation" filterable clearable>
          <el-option v-for="item in relationComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
    </div>
  </el-form>
  <data-soure-setting v-model:visible="dataSoureSetVisible" :setting="componentCfg?.selectModel" @on-submit="onSubmitDataSoureSet"></data-soure-setting>
  <column-setting v-model:visible="columnSetVisible" :columnSetting="componentCfg?.columnModel"></column-setting>
</template>

<script lang="ts">
import { reactive, ref, PropType, computed } from "vue";
import useEmitter from "@/use/useEitter";
import dataSoureSetting from "@/components/dataSoureSetting/index.vue";
import columnSetting from "@/components/commontable/columnSetting.vue";
import { ITableColunmSetting } from "@/interfaces/ITableConfig";
import { DialogSelectComponent } from "./IConfig";
import { getCopySelect } from "@/api/homeApi/index";
import { useDesign } from "@/use/useDesign";
export default {
  name: "DialogSelectProperty",
  components: { dataSoureSetting, columnSetting },
  props: {
    componentCfg: Object as PropType<DialogSelectComponent>,
  },
  setup(props) {
    const activeName = ref<string>("0");

    const formModel = reactive({});

    const formRules = reactive({});

    const mitter = useEmitter();

    const dataSoureSetVisible = ref<boolean>(false);
    const columnSetVisible = ref<boolean>(false);

    const { currentComponentList } = useDesign();

    /** 绑定复制功能下拉数据*/
    const bindingList = ref<any>(null);

    getCopySelect().then((res) => {
      if (res.code === 200) {
        bindingList.value = res.data.map((item) => ({
          value: item.id,
          label: item.modelName,
        }));
      }
    });

    //关联条件下拉
    const relationComponent = computed(() => {
      const propList: any = [];
      const componentList = currentComponentList.value;
      componentList &&
        componentList.forEach((item) => {
          propList.push({
            label: item.__form__?.label,
            value: item.__vModel__,
            componentId: item.componentId,
          });
        });
      return propList;
    });
    function openIconsDialog(type: string) {
      mitter.emitter.emit("on-property-setIcon", {
        parent: "__attr__",
        node: type,
      });
    }

    function onSubmitDataSoureSet(obj: any[]) {
      props.componentCfg && (props.componentCfg.selectModel = obj);
      // 生成列配置
      const columnSetting = columnTransform(props.componentCfg.selectModel);
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

    return {
      activeName,
      formModel,
      formRules,
      dataSoureSetVisible,
      columnSetVisible,
      openIconsDialog,
      onSubmitDataSoureSet,
      bindingList,
      relationComponent,
    };
  },
};
</script>

<style></style>

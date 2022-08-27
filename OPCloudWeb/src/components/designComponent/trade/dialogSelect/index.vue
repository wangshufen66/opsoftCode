<template>
  <div class="dialog-select-wrap">
    <el-input
      v-bind="component?.__attr__"
      v-model="inputValue"
      suffix-icon="el-icon-search"
      placeholder="请选择"
      @click.stop="onSelectData"
    ></el-input>
    <div class="fixedDialog">
      <el-dialog
        title="数据选择"
        v-model="dialogVisible"
        width="900px"
        :append-to-body="true"
        destroy-on-close
      >
        <template v-slot:title>
          <dialog-title title="数据选择"></dialog-title>
        </template>
        <template v-if="tableConfig.tableComponents && tableConfig.tableComponents.length > 0">
          <el-popover
            placement="right"
            v-model:visible="filterVisible"
            :width="500"
            trigger="manual"
          >
            <div class="filter-wrap">
              <el-form :model="searchForm" label-width="100px">
                <template v-for="item in tableConfig.tableComponents" :key="item.componentId">
                  <el-form-item :label="item.__form__.label">
                    <component :is="item.componentTag" :model="searchForm" :component="item"></component>
                  </el-form-item>
                </template>
              </el-form>
            </div>
            <div class="filter-bottom">
              <el-button size="mini" @click="filterVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="searchData">确定</el-button>
            </div>
            <template #reference>
              <el-button
                type="text"
                icon="el-icon-search"
                size="mini"
                @click="filterVisible = true"
              >搜索</el-button>
            </template>
          </el-popover>
        </template>
        <table-extend
          class="table-extend"
          v-bind="tableOption"
          :tableColums="tableColums"
          @row-click="onRowClick"
          v-loading="tableOption.tableLoading"
          @pageSizeChange="onPageSizeChange"
          @currentChange="currentChange"
          @tableSort="onTableSort"
        ></table-extend>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, PropType, reactive, ref, watch } from 'vue';
import { DialogSelectComponent } from './IConfig';
import useEitter from '@/use/useEitter';
import { ModuleFormProvide } from '@/use/useForm';

export default defineComponent({
  name: 'designDialogSelect',
  props: {
    component: Object as PropType<DialogSelectComponent>,
    model: Object,
  },
  setup(props) {
    /**
     * 调用当前组件的表单
     * 针对非应用列表-表单的情况，如：主从表主键新增编辑表单；
     * 后续需全部调整为当前组件表单，以解耦列表
     */
    const moduleForm = inject<ModuleFormProvide>('moduleForm', {} as ModuleFormProvide);

    const mitter = useEitter();

    const inputValue = ref<string>()

    const dialogVisible = ref<boolean>(false);

    const searchModel = ref<any>({});
    //表格排序属性
    const chartOrderField = { fieldName: undefined, orderDesc: undefined };

    const pageRequest = { pageIndex: 1, pageSize: 15 };

    const filterVisible = ref<boolean>(false);

    const tableOption = reactive({
      tableLoading: false,
      selectionCol: false,
      tableData: [],
      paging: true,
      total: 0,
    });
    // 表格组件、表配置
    const tableConfig = reactive<any>({
      tableList: undefined,
      tableComponents: undefined
    });
    // 搜索条件
    const searchForm = reactive({

    });

    const tableColums = computed(() => {
      if (
        props.component?.columnModel &&
        props.component?.columnModel.length > 0
      ) {
        const columns = props.component?.columnModel.filter(
          (f) => f.check === true
        );
        return columns;
      } else {
        return [];
      }
    });

    watch(
      [
        () => dialogVisible.value,
        () => props.model[`${props.component.__vModel__}_dialogSelect`] // 列表'_dialogSelect'值
      ],
      (value) => {
        if (value[0]) {
          // 加载表单数据
          if (mitter.emitter.all.get('on-load-reltable-data')) {
            searchData();
          }
        }
        if (!!value[1]) {
          inputValue.value = props.model[props.component.__vModel__];
          props.model[props.component.__vModel__] = props.model[`${props.component.__vModel__}_dialogSelect`];
          delete props.model[`${props.component.__vModel__}_dialogSelect`]
        }
      }
    );

    function init() {
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = undefined;
      }
    }
    // 表格数据获取
    function searchData() {
      filterVisible.value = false;
      tableOption.tableLoading = true;
      const config: any = settingTransform(props.component?.selectModel);
      config.chartFilterFields = []
      // 增加筛选条件
      Object.keys(searchForm).forEach(key => {
        searchForm[key] != undefined && config.chartFilterFields.push({
          fieldName: key,
          fieldValue: searchForm[key],
        });
      })
      config.chartOrderField =
        (chartOrderField.fieldName && chartOrderField) || undefined;
      config.pageRequest = pageRequest;
      mitter.emitter.emit('on-load-reltable-data', {
        config,
        model: props.model,
        /**所属表单的组件列表 */
        components: moduleForm?.formComponents || [],
        componentCfg: props.component,
        callback: loadTableCallBack,
      });
    }

    /**
     * 选择数据
     */
    function onSelectData() {
      dialogVisible.value = true;
    }
    /**
     * 行选择change,确保只能单选行
     */
    function onRowClick(row) {
      mitter.emitter.emit('on-set-reltable-data', {
        row,
        model: props.model,
        /**所属表单的组件列表 */
        components: moduleForm?.formComponents || [],
        componentCfg: props.component
      });
      dialogVisible.value = false;
      if (props.model && props.component && props.component.__vModel__) {
        props.model[props.component.__vModel__] = row[props.component.__config__.valueBindField];
        inputValue.value = row[props.component.__config__.textBindField] || row[props.component.__config__.valueBindField];
      }
    }

    const onPageSizeChange = (e): void => {
      pageRequest.pageSize = e.pageSize;
      currentChange(e);
    };
    // 页码改变
    const currentChange = (e): void => {
      pageRequest.pageIndex = e.pageIndex;
      searchData();
    };

    /**
     * 表格字段排序事件
     */
    function onTableSort(e) {
      const { sortName, sortType } = e;
      chartOrderField.fieldName = sortName;
      chartOrderField.orderDesc = sortType;
      searchData();
    }

    /**
     * 配置转换
     * @configList 关联配置
     */
    function settingTransform(configList: any[]) {
      const params = {
        masterFieldValue: undefined,
        masterRelatedFieldName: undefined,
        masterRelatedTableName: undefined,
        tableEntityList: [] as any[],
      };
      for (let i = 0; i < configList.length; i++) {
        const config = configList[i];
        const tableEntity: any = {
          displayedFields: [],
          relatedFieldsConfig: [],
          tableName: undefined,
        };
        config.fields &&
          tableEntity.displayedFields.push(
            ...config.fields
              .filter((f) => f.check === true)
              .map((m) => {
                return {
                  fieldName: m.fieldName,
                };
              })
          );
        const rellist = config.rellist;
        rellist &&
          tableEntity.relatedFieldsConfig.push(
            ...rellist.map((m) => {
              return {
                fieldName: m.field,
                foreignTableName: m.fField[0],
                foreignFieldName: m.fField[1],
                relatedType:
                  m.reltype === 'join' ? 0 : m.reltype === 'left join' ? 1 : 2,
              };
            })
          );
        i === 0 && (params.masterRelatedTableName = config.tableName);
        tableEntity.tableName = config.tableName;
        params.tableEntityList.push(tableEntity);
      }
      return params;
    }

    /**
     * 表格数据读取后回调
     */
    function loadTableCallBack(obj: any) {
      const { tableData, tableComponents, tableList } = obj;
      tableConfig.tableList = tableList;
      tableConfig.tableComponents = tableComponents;
      tableOption.tableLoading = false;
      const tableRows = tableData.records || [];
      tableOption.tableData = tableRows;
      tableOption.total = tableData.total;
    }

    function getSearchModelTitle(value: any, key: string) {
      const obj = tableColums.value.find((f) => f.prop === key);
      return (obj && obj.label) || '';
    }

    function onSearchData() { }

    onMounted(() => {
      init();
    });

    return {
      dialogVisible,
      searchModel,
      tableOption,
      tableColums,
      inputValue,
      filterVisible,
      tableConfig,
      searchForm,
      onSelectData,
      onRowClick,
      onPageSizeChange,
      currentChange,
      onTableSort,
      getSearchModelTitle,
      onSearchData,
      searchData,
    };
  },
});
</script>

<style lang="scss" scoped>
.table-search {
  padding: 0 10px;
}
.table-extend {
  padding: 10px 0;
  height: 350px;
}
.filter-trigger {
  text-align: right;
}
.filter-wrap {
  padding: 20px;
}
.filter-bottom {
  text-align: right;
  margin: 0;
}
</style>
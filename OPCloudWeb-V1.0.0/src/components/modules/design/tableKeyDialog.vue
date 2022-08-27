<template>
  <div class="fixedDialog">
    <el-dialog :modelValue="visible" title="关联外键表设置" width="800px" :before-close="beforeClose">
      <template v-slot:title>
        <dialog-title title="关联外键表设置"></dialog-title>
      </template>

      <el-form ref="formRef" :model="formModel" :rules="formRules" size="small" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="关联表类型" prop="tableType">
              <el-select
                v-model="formModel.tableType"
                clearable
                filterable
                @change="onTableTypeChange"
              >
                <el-option label="基础信息表" :value="1"></el-option>
                <el-option label="字典表" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="formModel.tableType == 1 ? 12 : 24">
            <template v-if="formModel.tableType == 1">
              <el-form-item label="关联表" prop="tableId">
                <el-cascader
                  v-model="formModel.pageIds"
                  ref="cascaderRef"
                  :props="cascaderProps"
                  @change="onFtableChange"
                  separator="-"
                ></el-cascader>
              </el-form-item>
            </template>
            <template v-else>
              <el-form-item label="字典类型" prop="dictType">
                <el-select
                  v-model="formModel.dictType"
                  clearable
                  filterable
                  @change="onDictTypeChange"
                >
                  <el-option
                    v-for="dictType in dictTypeList"
                    :key="dictType.code"
                    :value="dictType.code"
                    :label="dictType.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
        <template v-if="formModel.tableType === 1">
          <el-row>
            <el-col :span="12">
              <el-form-item label="关联字段" prop="key">
                <el-select v-model="formModel.key" clearable filterable>
                  <el-option
                    v-for="field in tableFieldList"
                    :key="field.fieldName"
                    :value="field.fieldName"
                    :label="field.fieldRemark"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="显示字段" prop="relName">
                <el-select v-model="formModel.relName" clearable filterable>
                  <el-option
                    v-for="field in tableFieldList"
                    :key="field.fieldName"
                    :value="field.fieldName"
                    :label="field.fieldRemark"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="过滤条件"
            prop="filterConfig"
            v-if="componentCfg?.componentTag !== 'designCascader'"
          >
            <filter-setting
              :fieldList="tableFieldList"
              :fieldConfig="fieldConfig"
              :filterConfig="formModel.filterConfig"
            ></filter-setting>
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clearRel">清除关联</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { watch, reactive, ref, inject, computed } from 'vue';
import { getTablesBypage, getfieldsByTableId } from '@/api/homeApi/index';
import { getDictionariesType } from '@/api/system';
import filterSetting from '@/components/filterSetting/index.vue';
import { getPageItem } from '@/api/homeApi';
import { useDesign } from '@/use/useDesign';
import { getModelByApp, getPageByModel } from '@/api/userApi';

const props = defineProps({
  /**是否显示 */
  visible: Boolean,
  componentCfg: Object,
});
// 事件定义
const emit = defineEmits(['update:visible', 'refresh']);

const foreignTableFields: any = inject('foreignTableFields')

const { appList } = useDesign()

const formModel = reactive<any>({
  tableType: 1, // 表类型：1、基础信息表 2、字典表
  tableId: undefined,
  tableName: undefined,
  key: undefined,
  relName: undefined,
  dictType: undefined,
});
const formRules = reactive({
  tableId: [{ required: true, message: '请选择外键表', trigger: 'blur' }],
  key: [{ required: true, message: '请选主键字段', trigger: 'blur' }],
  relName: [{ required: true, message: '请选择名称字段', trigger: 'blur' }],
  filterConfig: [
    { required: false, validator: validateFilterCfg, trigger: 'blur' },
  ],
});

const formRef = ref<any>(null);
const tableFieldList = ref<any[]>([]);
const dictTypeList = ref<any[]>([]);

const fieldConfig = ref<any>([]);

const cascaderRef = ref<any>(null);

watch(
  () => props.visible,
  (visible: boolean) => {
    if (visible) {
      init();
    }
  }
);

/**
 * 获取字段属性配置
 */
const cascaderProps = computed(() => {
  const props = {
    lazy: true,
    lazyLoad: cascaderLazyLoad
  };
  return props;
});

async function init() {
  const {
    tableType,
    tableId,
    pageIds,
    tableName,
    dictType,
    key,
    relName,
    filterConfig,
  } = props.componentCfg?.__relTable__;
  formModel.tableType = tableType || 1;
  formModel.tableId = tableId;
  formModel.pageIds = pageIds;
  formModel.tableName = tableName;
  formModel.dictType = dictType;
  formModel.key = key;
  formModel.relName = relName;
  formModel.filterConfig = (filterConfig &&
    filterConfig.length > 0 &&
    filterConfig) || [
      { filterName: undefined, filterCompare: undefined, filterValue: [] },
    ];
  // 根据表类型获取数据表/字典表列表
  loadTableDict();
  // 当前字段是否有关联外键
  if (formModel.tableType === 1 && formModel.tableId) {
    let para = {
      tableId: formModel.tableId,
    };
    const res = await getfieldsByTableId(para);
    if (res.code === 200) {
      tableFieldList.value = res.data;
      foreignTableFields.value = res.data.map(m => {
        return {
          label: m.fieldRemark,
          value: m.fieldName
        }
      })
    }
    // onFtableChange([null, null, formModel.tableId]);
    getfieldsByTableId({ tableId: formModel.tableId }).then(res => {
      // 获取列组件配置
      getTableFieldConfig(formModel.tableId);
      if (res.code === 200) {
        tableFieldList.value = res.data;
      }
    });
  } else {
    tableFieldList.value = [];
    foreignTableFields.value = [];
  }
}
/**
 * 表类型change事件
 */
function onTableTypeChange() {
  formModel.key = undefined;
  formModel.tableId = undefined;
  formModel.pageIds = undefined;
  formModel.tableName = undefined;
  formModel.relName = undefined;
  loadTableDict();
}

function beforeClose(): void {
  emit('update:visible', false);
}

// 提交
function submit(): void {
  formRef.value?.validate((valid) => {
    if (valid) {
      if (props.componentCfg) {
        props.componentCfg.__relTable__.tableType = formModel.tableType;
        props.componentCfg.__relTable__.dictType = formModel.dictType;
        props.componentCfg.__relTable__.tableId = formModel.tableId;
        props.componentCfg.__relTable__.pageIds = formModel.pageIds;
        props.componentCfg.__relTable__.tableName = formModel.tableName;
        props.componentCfg.__relTable__.key = formModel.key;
        props.componentCfg.__relTable__.relName = formModel.relName;
        props.componentCfg.__relTable__.filterConfig = formModel.filterConfig.filter(
          (f) => f.filterName && f.filterCompare && f.filterValue
        );
        props.componentCfg.__config__.defaultValue = undefined;
        foreignTableFields.value = tableFieldList.value.map(m => {
          return {
            label: m.fieldRemark,
            value: m.fieldName
          }
        })
      }
      emit('refresh')
      beforeClose();
      resetFields();
    }
  });
} 

// 重置
function resetFields(): void {
  dictTypeList.value = [];
  tableFieldList.value = [];
  formRef.value?.resetFields();
  formModel.filterConfig = [
    {
      filterName: undefined,
      filterCompare: undefined,
      filterValue: [],
    },
  ];
}
/**
 * 清除关联
 */
function clearRel() {
  props.componentCfg && (props.componentCfg.__relTable__ = {});
  foreignTableFields.value = [];
  resetFields();
  init();
}


// 选中外键表以后获取字段数据
async function onFtableChange(val) {
  formModel.key = undefined;
  formModel.relName = undefined;
  formModel.tableId = val[2];
  if (val[0]) {
    const node = cascaderRef.value.getCheckedNodes(true);
    const tableName = node && node[0].data.name
    formModel.tableName = tableName;
  }
  let para = {
    tableId: val[2],
  };
  const res = await getfieldsByTableId(para);
  // 获取列组件配置
  getTableFieldConfig(formModel.tableId);
  if (res.code === 200) {
    tableFieldList.value = res.data;
  }
}

async function onDictTypeChange(e) {
  formModel.key = 'codeInfoId';
  formModel.relName = 'name';
}

async function cascaderLazyLoad(node, resolve) {
  const { level, value } = node;
  if (level === 0) {
    const nodes = appList.value && appList.value.map((m) => {
      return {
        label: m.appName,
        value: m.id,
        leaf: level >= 2,
      };
    });
    resolve(nodes);
  } else if (level === 1) {
    // 加载模块
    const res = await getModelByApp({ appId: value });
    if (res.code == 200) {
      const nodes = res.data.map((m) => {
        return {
          label: m.modelName,
          value: m.id,
          leaf: level >= 2,
        };
      });
      resolve(nodes);
    }
  } else if (level === 2) {
    // 加载页面
    const res = await getPageByModel({ modelId: value });
    if (res.code == 200) {
      const nodes = res.data.map((m) => {
        return {
          label: m.pageName,
          value: m.id,
          name: m.pageTableName,
          leaf: level >= 2,
        };
      });
      resolve(nodes);
    }
  }
}

function loadTableDict() {
  dictTypeList.value = [];
  tableFieldList.value = [];
  if (formModel.tableType === 1) {
    // getTables();
  } else if (formModel.tableType === 2) {
    // 加载字典类型
    getDictType();
  }
}

/**
 * 获取字典类型列表
 */
async function getDictType(): Promise<void> {
  const params = { current: 1, size: 200 };
  const res = await getDictionariesType(params);
  if (res.code === 200) {
    dictTypeList.value = res.data.records.map((m) => {
      return {
        code: m.dictionaryCode,
        name: m.dictionaryName,
      };
    });
  }
}

async function getTableFieldConfig(tableId) {
  if (!tableId) return;
  const res = await getPageItem({ pageIdList: tableId });
  if (res.code == 200) {
    const pageConfig = res.data && res.data[tableId];
    fieldConfig.value = pageConfig && pageConfig.components
  }
}

function validateFilterCfg(rule, value, callback) {
  if (value && value.length > 0) {
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      if (!item['filterName'] && !item['filterCompare'] && item['filterValue'] && item['filterValue'].length === 0) {
        continue;
      }
      if (!(item['filterName'] && item['filterCompare'] && item['filterValue'] && item['filterValue'].length > 0)) {
        callback(new Error('请填写完整的过滤条件'));
        return;
      }
    }
  }
  callback();
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/design/tablekey.scss";
</style>

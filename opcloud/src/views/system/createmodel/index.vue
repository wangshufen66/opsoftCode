<template>
  <div class="model-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :inline="true">
          <el-form-item label="模型类型">
            <el-select v-model="searchForm.modelType" clearable filterable>
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="模型名称">
            <el-input type="text" v-model="searchForm.modelName" clearable></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button type="primary" plain @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_modelType="{ data }">{{ data.modelType == 0 ? "工序模型" : "计算模型" }}</template>
      <template #col_status="{ data }">
        <el-tag v-if="data.isUsing === 1" type="success">可用</el-tag>
        <el-tag v-else-if="data.isUsing === 0" type="danger">不可用</el-tag>
      </template>
      <template #col_belongsto="{ data }">
        <el-tag v-if="data.belong === 1" type="success">外部</el-tag>
        <el-tag v-else-if="data.belong === 0" type="danger">内部</el-tag>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="280">
          <template #default="scope">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="onSetting(scope.row)">公式设置</el-button>
            <el-button
              type="text"
              size="small"
              @click="onChangeStatus(scope.row)"
            >{{ scope.row.isUsing === 1 ? "停用" : "启用" }}</el-button>
            <el-button type="text" size="small" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <!-- <detail-form
      v-model:visible="formState.detailVisible"
      :params="formState.detail"
      @onSubmit="onDetailSubmit"
    ></detail-form>-->
    <el-dialog v-model="detailVisible" @closed="closeDialog" destroy-on-close width="1000px">
      <template v-slot:title>
        <dialog-title :title="title"></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="模型类型" prop="modelType">
          <el-select
            v-model="dataForm.modelType"
            placeholder="请选择模型类型"
            style="width: 100%"
            :disabled="!!dataForm.id"
            filterable
            clearable
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="模型名称" prop="modelName">
          <el-input v-model="dataForm.modelName" placeholder="请输入模型名称" clearable></el-input>
        </el-form-item>

        <el-form-item label="使用状态">
          <el-radio-group v-model="dataForm.isUsing">
            <el-radio :label="1">可用</el-radio>
            <el-radio :label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="所属">
          <el-radio-group v-model="dataForm.belong">
            <el-radio :label="0">内部</el-radio>
            <el-radio :label="1">外部</el-radio>
          </el-radio-group>
          <!-- <el-input
            v-model="dataForm.outsidelink"
            placeholder="请输入"
            clearable
            style="position: absolute; width: 70%; right: 80px"
          ></el-input>-->
        </el-form-item>

        <el-form-item label="模型说明">
          <el-input v-model="dataForm.remark" placeholder="请输入模型说明" clearable></el-input>
        </el-form-item>
        <el-form-item label="计算结果">
          <el-radio-group v-model="dataForm.notVirtualResult">
            <el-radio :label="0">视图类</el-radio>
            <el-radio :label="1">实体类</el-radio>
            <el-radio :label="2">跨表公式</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="detailVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saveLoding" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
    <formula-setting v-model:visible="formState.paramsVisible" :params="formState.params"></formula-setting>
  </div>
</template>

<script lang="ts" setup>
import { provide, reactive, ref, onMounted } from "vue";
import tableColums from "@/config/tableConfig/sysCreateModelList";
import formulaSetting from "./formulasetting.vue";

import {
  getFunctionModelTypeList,
  setModelDisableStatus,
  setModelUsingStatus,
  deleteModelType,
  addModelType,
  updateModelType,
  functionModelType
} from "@/api/functionModel";
import { getDictionariesInfo } from "@/api/system";
import { confirmBox, messageAlert } from "@/shared/utils/utils";

const tableOption = reactive({
  tableData: [],
  tableColums: tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
});
// 查询表单参数
const searchForm = reactive({
  modelType: undefined,
  modelName: undefined,
});

const pagination = reactive({
  current_page: 1,
  page_size: 15,
});

const title = ref<string>("");
// 是否显示弹框
const detailVisible = ref<boolean>(false);
const formRef = ref<any>(null);
const saveLoding = ref<boolean>();
const dataForm = reactive({
  id: undefined,
  modelType: "",
  modelName: "",
  isUsing: "",
  belong: "",
  outsidelink: "",
  remark: "",
  notVirtualResult: "",
});
const formState = reactive({
  detailVisible: false,
  detail: {
    id: undefined,
  },
  paramsVisible: false,
  params: {
    id: undefined,
  },
});
// 表单验证规则
const formRules = reactive({
  modelName: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
  modelType: [{ required: true, message: "请选择模型类型", trigger: "blur" }],
});
/**
 * 获取模型类型
 */
const typeList = ref<any>([]);
provide("functionModel", {
  typeList: typeList,
});
async function getModelType() {
  const res = await getDictionariesInfo({
    dictionaryCode: "modelType",
    current: 1,
    size: 15,
  });
  if (res.code == 200) {
    const modelTypelist = res.data.records;
    let modelType = [];
    if (modelTypelist) {
      modelType = modelTypelist.map((item) => {
        return {
          codeInfoId: item.codeInfoId,
          value: Number(item.code),
          label: item.name,
          remark: item.remark,
        };
      });
    }

    typeList.value = modelType;
  }
}
getModelType();

/**
 * 获取计算模型列表
 */
async function getModelList() {
  const params = {
    ...searchForm,
    ...pagination,
  };
  tableOption.tableLoading = true;

  const res = await getFunctionModelTypeList(params);
  if (res.code == 200) {
    tableOption.total = res.data.total;
    tableOption.tableData = res.data.records || [];
  }
  tableOption.tableLoading = false;
}

//获取计算模型列表
getModelList();

/**
 * 表格pagesize
 */
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.page_size = pageSize as number;
  getModelList();
}
/**
 * 表格页码切换
 */
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current_page = pageIndex as number;
  getModelList();
}
/*
 *查询
 */
function onSearch() {
  pagination.current_page = 1;
  getModelList();
}

/**
 * 新增模型
 */
function onAdd() {
  detailVisible.value = true;
  title.value = "添加模型";
  dataForm.id = undefined;
  dataForm.modelName = "";
  dataForm.modelType = "";
  dataForm.belong = "";
  dataForm.isUsing = "";
  dataForm.outsidelink = "";
  dataForm.remark = "";
  dataForm.notVirtualResult = "";
}

/**
 * 编辑
 */
function onEdit(row: any) {
  detailVisible.value = true;
  title.value = "编辑模型";
  dataForm.id = row.id;
  dataForm.modelName = row.modelName;
  dataForm.modelType = row.modelType;
  dataForm.belong = row.belong;
  dataForm.isUsing = row.isUsing;
  dataForm.outsidelink = row.outsidelink;
  dataForm.remark = row.remark;
  dataForm.notVirtualResult = row.notVirtualResult;
}

/**
 * 关闭弹窗
 */
function closeDialog() {
  detailVisible.value = false;
  formRef.value?.resetFields();
}
function onSubmitForm() {
  saveLoding.value = true;
  formRef.value.validate(async (valid) => {
    if (!valid) {
      saveLoding.value = false;
    } else {
      const res = !dataForm.id
        ? await addModelType(dataForm)
        : await updateModelType(dataForm);
      saveLoding.value = false;
      if (res.code == 200) {
        messageAlert("success", dataForm.id ? "修改成功" : "新增成功");
        closeDialog();
        getModelList();
      }
    }
  });
}

/**
 * 公式设置
 */
function onSetting(row: any) {
  formState.paramsVisible = true;
  formState.params.id = row.id;
}

function onDetailSubmit() {
  formState.detail.id = undefined;
  getModelList();
}

/**
 * 启用、停用
 */
async function onChangeStatus(row: any) {
  const params = {
    id: row.id,
  };
  if (row.isUsing === 1) {
    const res = await setModelDisableStatus(params);
    if (res.code === 200) {
      messageAlert("success", "停用成功");
      getModelList();
    }
  } else {
    const res = await setModelUsingStatus(params);
    if (res.code === 200) {
      messageAlert("success", "启用成功");
      getModelList();
    }
  }
}

/**
 * 删除
 */
function onDelete(row: any) {
  confirmBox("删除数据", async () => {
    const res = await deleteModelType({ id: row.id });
    if (res.code == 200) {
      messageAlert("success", "删除成功");
      getModelList();
    }
  });
}

onMounted(() => { });
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/model.scss";
</style>

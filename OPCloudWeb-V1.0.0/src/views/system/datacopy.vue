<template>
  <div class="data-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true" @submit.prevent>
          <el-form-item label="表单名称">
            <el-input
              type="text"
              placeholder="请输入表单名称"
              v-model.trim="searchForm.sourceTableName"
              clearable
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" plain @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_type="{ data }">{{ getOperation(data.type) }}</template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="280">
          <template #default="scope">
            <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog v-model="dialogVisible" @closed="dialoagClose" destroy-on-close width="60%">
      <template v-slot:title>
        <dialog-title title></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="模型名称" prop="modelName">
              <el-input v-model="dataForm.modelName" placeholder="请输入模型名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复制类型" prop="type">
              <el-select
                v-model="dataForm.type"
                placeholder="请选择复制类型"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in select.type"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="表单" prop="sourceTableId" :error="error.formErr">
              <el-cascader
                style="width: 100%"
                :options="select.formName"
                filterable
                v-model="dataForm.sourceTableId"
                :show-all-levels="false"
                @change="formChange"
                :props="{ value: 'id' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标表单" prop="targetTableId" :error="error.targetErr">
              <el-cascader
                style="width: 100%"
                :options="select.formName"
                filterable
                v-model="dataForm.targetTableId"
                :show-all-levels="false"
                @change="targetChange"
                :props="{ value: 'id' }"
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="table-header">
          <el-col class="col-item" :span="7">字段</el-col>
          <el-col class="col-item" :span="7">目标字段</el-col>
          <el-col class="col-item" :span="6">类型</el-col>
          <el-col class="col-item" :span="4">操作</el-col>
        </el-row>
        <el-row class="table-item" v-for="(item, index) in dataForm.fieldList">
          <el-col class="col-item" :span="7">
            <el-form-item
              :prop="'fieldList.' + index + '.sourceFieldId'"
              :rules="[
                {
                  required: true,
                  message: '字段不能为空',
                  trigger: 'blur',
                },
              ]"
              label-width="0px"
            >
              <el-select
                v-model="item.sourceFieldId"
                placeholder="请选择字段"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in select.sourceForm"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="col-item" :span="7">
            <el-form-item
              :prop="'fieldList.' + index + '.targetFieldId'"
              :rules="[
                {
                  required: true,
                  message: '目标字段不能为空',
                  trigger: 'blur',
                },
              ]"
              label-width="0px"
            >
              <el-select
                v-model="item.targetFieldId"
                placeholder="请选择目标字段"
                filterable
                style="width: 100%"
              >
                <el-option
                  v-for="item in select.targetForm"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="col-item" :span="6">
            <el-form-item
              :prop="'fieldList.' + index + '.type'"
              :rules="[
                {
                  required: true,
                  message: '请选择是否外键',
                  trigger: 'blur',
                },
              ]"
              label-width="0px"
            >
              <el-select v-model="item.type" placeholder="请选择是否外键" filterable style="width: 100%">
                <el-option
                  v-for="item in select.filedType"
                  :label="item.label"
                  :value="item.value"
                  :key="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col class="col-item" :span="3" :offset="1">
            <el-button icon="el-icon-delete" @click.stop="formDel(index)"></el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="center" class="btn">
          <el-button @click="addFiled" class="el-icon-circle-plus-outline" type="success">增加</el-button>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import tableColums from "@/config/tableConfig/sysDataList";
import { confirmBox, messageAlert } from "@/utils/utils";
import { getFormKey } from "@/api/flowable";
import {
  getDataCopyList,
  getDataDetail,
  getfieldsByTableId,
  saveDataCopy,
  delDataCopy,
} from "@/api/homeApi/index";
interface dataForm {
  id: null;
  /**模型名称 */
  modelName: string;
  //复制类型1插入2更新
  type: string;
  //目标表单
  targetTableId: number[];
  //表单
  sourceTableId: number[];
  //表单字段
  fieldList: Array<{
    sourceFieldId: string;
    targetFieldId: string;
    type: number;
  }>;
}

interface select {
  type: optionsType[];
  formName: Array<any>;
  sourceForm: optionsType[];
  targetForm: optionsType[];
  filedType: optionsType[];
}

type optionsType = {
  value: string | number;
  label: string;
};

// 查询表单参数
const searchForm = reactive({
  sourceTableName: undefined,
});
//报错提示
const error = reactive({
  formErr: "",
  targetErr: "",
});

const select = reactive<select>({
  //操作类型
  type: [
    { value: 1, label: "数据插入" },
    { value: 2, label: "数据更新" },
  ],
  //表单名称
  formName: [],
  sourceForm: [],
  targetForm: [],
  filedType: [
    { value: 1, label: "非外键" },
    { value: 2, label: "外键" },
  ],
});

//列表配置项
const tableOption = reactive({
  tableData: [],
  tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});

const pagination = reactive({
  current_page: 1,
  page_size: 15,
});

//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive<dataForm>({
  id: null,
  //模型名称
  modelName: "",
  //复制类型1插入2更新
  type: "",
  //目标表单
  targetTableId: [],
  //表单
  sourceTableId: [],
  //表单字段
  fieldList: [
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 2,
    },
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 1,
    },
  ],
});
//添加和编辑表单的验证规则
const formRules = reactive({
  modelName: [{ required: true, message: "请输入模型名称", trigger: "blur" }],
  type: [{ required: true, message: "请选择复制类型", trigger: "change" }],
  targetTableId: [
    { required: true, message: "请选择目标表单", trigger: "blur" },
  ],
  sourceTableId: [{ required: true, message: "请选择源表单", trigger: "blur" }],
});

//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? "编辑" : "新增";
});

//表单配置下拉
getFormKey({ accountGroupId: 10001, isActive: 0, isCopy: true }).then((res) => {
  if (res.code === 200) {
    select.formName = res.data;
  }
});

// 查询
function onSearch() {
  pagination.current_page = 1;
  getDataList();
}
// 获取数据
async function getDataList() {
  tableOption.tableLoading = true;
  const params = {
    ...searchForm,
    ...pagination,
  };
  const res = await getDataCopyList(params);
  const { code, data } = res;
  if (code === 200) {
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableOption.tableLoading = false;
}
//获取下拉的label值
function getOperation(num: number) {
  switch (num) {
    case 1:
      return "数据插入";
    case 2:
      return "数据更新";
  }
}

//获取字段下拉
async function getFiledList(id: number | string, type: "source" | "target") {
  const res = await getfieldsByTableId({ tableId: id });
  const arr = res.data
    .filter((item) => item.id)
    .map((item) => ({
      value: item.id,
      label: item.fieldRemark,
    }));
  if (type === "source") {
    select.sourceForm = arr;
  } else {
    select.targetForm = arr;
  }
}

//表单下拉改变
function formChange() {
  error.targetErr = "";
  error.formErr = "";
  if (
    dataForm.targetTableId &&
    dataForm.sourceTableId.toString() === dataForm.targetTableId.toString()
  ) {
    error.formErr = "表单不能和目标表单相同";
    return;
  }
  getFiledList(
    dataForm.sourceTableId[dataForm.sourceTableId.length - 1],
    "source"
  );
  dataForm.fieldList = [
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 2,
    },
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 1,
    },
  ];
}

//目标表单下拉改变
function targetChange() {
  error.targetErr = "";
  error.formErr = "";
  if (
    dataForm.sourceTableId &&
    dataForm.sourceTableId.toString() === dataForm.targetTableId.toString()
  ) {
    error.targetErr = "目标表单不能和表单相同";
    return;
  }

  getFiledList(
    dataForm.targetTableId[dataForm.sourceTableId.length - 1],
    "target"
  );
  dataForm.fieldList = [
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 2,
    },
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 1,
    },
  ];
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.page_size = pageSize as number;
  getDataList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current_page = pageIndex as number;
  getDataList();
}

//弹框关闭
function dialoagClose() {
  formRef.value.clearValidate();
  dataForm.id = null;
  dataForm.type = "";
  dataForm.modelName = "";
  dataForm.sourceTableId = [];
  dataForm.targetTableId = [];
  dataForm.fieldList = [
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 2,
    },
    {
      sourceFieldId: "",
      targetFieldId: "",
      type: 1,
    },
  ];
  error.targetErr = "";
  error.formErr = "";
  select.sourceForm = [];
  select.targetForm = [];
}

//新增角色
function onAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
}

// 编辑表单
async function onEdit(row: any) {
  getFiledList(row.sourceTableId, "source");
  getFiledList(row.targetTableId, "target");
  const res = await getDataDetail({ id: row.id });
  let tempArr = [0, 0];
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.id = row.id;
  dataForm.modelName = row.modelName;
  dataForm.type = row.type;
  dataForm.sourceTableId = [0, 0, row.sourceTableId];
  dataForm.targetTableId = [0, 0, row.targetTableId];
  dataForm.fieldList = res.data.fieldList.map((item) => ({
    sourceFieldId: item.sourceFieldId,
    targetFieldId: item.targetFieldId,
    type: item.type,
  }));
}
//添加字段
function addFiled() {
  dataForm.fieldList.push({
    sourceFieldId: "",
    targetFieldId: "",
    type: 1,
  });
}
//删除字段
function formDel(index) {
  if (dataForm.fieldList.length <= 2) {
    messageAlert('warning', "至少保留两条字段包含外键和非外键");
    return;
  }
  dataForm.fieldList.splice(index, 1);
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    // subLoading.value = true;
    let isFlag = false,
      noFlag = false;
    const len = dataForm.fieldList.length;
    for (let i = 0; i < len; i++) {
      const item = dataForm.fieldList[i];
      if (item.type === 1) {
        noFlag = true;
      } else if (item.type === 2) {
        isFlag = true;
      }
      for (let j = i + 1; j < len; j++) {
        const compare = dataForm.fieldList[j];
        if (
          item.sourceFieldId === compare.sourceFieldId &&
          item.targetFieldId === compare.targetFieldId &&
          item.type === compare.type
        ) {
          messageAlert('error', '不能填写两条相同的数据')
          return;
        }
        if (
          item.targetFieldId === compare.targetFieldId &&
          item.type === 1 &&
          compare.type === 1
        ) {
          messageAlert('error', '非外键情况不能复制多个字段到单一字段')
          return;
        }
      }
    }
    if (!isFlag) {
      messageAlert('error', '必须包含一个外键')
      return;
    } else if (!noFlag) {
      messageAlert('error', '必须包含一个非外键')
      return;
    }
    const { targetTableId, sourceTableId, ...params } = dataForm;
    const res = await saveDataCopy({
      ...params,
      targetTableId: dataForm.targetTableId[dataForm.targetTableId.length - 1],
      sourceTableId: dataForm.sourceTableId[dataForm.sourceTableId.length - 1],
    });

    if (res.code === 200) {
      messageAlert('success', isEdit.value ? '修改成功' : '添加成功')
      getDataList();
      dialogVisible.value = false;
    }
    subLoading.value = false;
  });
}

//删除
function onDelete(id) {
  confirmBox("删除该条数据", async () => {
    const res = await delDataCopy({ id });
    if (res.code === 200) {
      messageAlert('success', '操作成功')
      getDataList();
    }
  });
}

getDataList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/data.scss";
</style>

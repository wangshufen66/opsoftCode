<template>
  <div class="dictionaries-list">
    <div class="list-left">
      <div class="search-wrap">
        <div class="form-wrap">
          <el-form mode="topForm" :inline="true" @submit.prevent>
            <el-form-item label="字典名称">
              <el-input
                type="text"
                v-model.trim="typeSearch.dictionaryName"
                clearable
                @keyup.enter="onTypeSearch"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="button-wrap">
          <el-button class="btn-search" type="primary" plain @click="onTypeSearch">查询</el-button>
          <el-button class="btn-add" type="primary" plain @click="onTypeAdd">新增字典</el-button>
        </div>
      </div>
      <table-extend
        v-bind="typeTableOption"
        @pageSizeChange="typePageSizeChange"
        @currentChange="typeCurrentChange"
        @rowClick="rowClick"
      >
        <template #operatColumn>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template #default="scope">
              <el-button type="text" size="small" @click.stop="onTypeEdit(scope.row)">编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="onTypeDelete(scope.row.id)"
                :disabled="scope.row.id == '000' && scope.row.id === '1'"
              >删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>
    </div>
    <div class="list-right">
      <div class="search-wrap">
        <div class="form-wrap">
          <el-form mode="topForm" :inline="true" @submit.prevent>
            <el-form-item label="名称">
              <el-input
                type="text"
                v-model.trim="infoSearch.name"
                @keyup.enter="onInfoSearch"
                clearable
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="button-wrap">
          <el-button class="btn-search" type="primary" plain @click="onInfoSearch">查询</el-button>
          <el-button class="btn-add" type="primary" plain @click="onInfoAdd">新增code</el-button>
        </div>
      </div>
      <table-extend
        v-bind="infoTableOption"
        @pageSizeChange="infoPageSizeChange"
        @currentChange="infoCurrentChange"
      >
        <template #operatColumn>
          <el-table-column label="操作" min-width="120" fixed="right">
            <template #default="scope">
              <el-button type="text" size="small" @click="onInfoEdit(scope.row)">编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="onInfoDelete(scope.row.codeInfoId)"
              >删除</el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>
    </div>
    <el-dialog v-model="dialogVisible" @closed="dialogClosed">
      <template v-slot:title>
        <dialog-title title></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="150px">
        <el-form-item label="字典code" prop="dictionaryCode" v-if="isType">
          <el-input
            v-model="dataForm.dictionaryCode"
            placeholder="请输入字典code"
            maxlength="32"
            show-word-limit
            clearable
            :disabled="dataForm.dictionaryCode.value === '000'"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="字典id" prop="dictionaryId" v-if="isType">
          <el-input v-model="dataForm.dictionaryId" placeholder="请输入字典ID"></el-input>
        </el-form-item>-->
        <el-form-item label="字典名称" prop="dictionaryName" v-if="isType">
          <el-input
            v-model="dataForm.dictionaryName"
            placeholder="请输入字典名称"
            maxlength="25"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="code" prop="code" v-if="!isType">
          <el-input
            v-model="dataForm.code"
            placeholder="请输入code"
            maxlength="400"
            rows="3"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name" v-if="!isType">
          <el-input
            v-model="dataForm.name"
            placeholder="请输入名称"
            maxlength="30"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortNo">
          <el-input v-model="dataForm.sortNo" placeholder="请输入排序值" type="number"></el-input>
        </el-form-item>
        <el-form-item
          label="备注"
          prop="remark"
          :rules="typeActive == 'basicRegex' ? formRules.remark : formRules.remark1"
        >
          <el-input
            v-model="dataForm.remark"
            type="textarea"
            placeholder="请输入备注"
            maxlength="100"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saveLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import typeTableColums from '@/config/tableConfig/sysDictionType';
import infoTableColums from '@/config/tableConfig/sysDictionInfo';
import { confirmBox, messageAlert } from '@/utils/utils';
import {
  getDictionariesType,
  getDictionariesInfo,
  addDictionariesType,
  addDictionariesInfo,
  editDictionariesType,
  editDictionariesInfo,
  delDictionariesType,
  delDictionariesInfo,
} from '@/api/system';
import { nextTick } from 'process';

//类型列表参数调用的组件(左侧)
const typeTableOption = reactive({
  tableData: [],
  tableColums: typeTableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});
// 信息列表参数(右侧)
const infoTableOption = reactive({
  tableData: [],
  tableColums: infoTableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});
const typeSearch = reactive({
  typeId: '',
  // dictionaryName: '',
});
//记录选中的type
const typeActive = ref<string | null>(null);
const typeActive2 = ref<string | null>(null);
const typeActive3 = ref<string | null>(null);

const typePagination = reactive({
  current: 1,
  size: 15,
});

const infoSearch = reactive({
  // infoInput: '',
  name: '',
});
const infoPagination = reactive({
  current: 1,
  size: 15,
});

//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  dictionaryCode: '', //字典code
  dictionaryId: '',
  // dictionaryId: '',
  typeId: '',
  dictionaryName: '', //字典名称
  remark: '', //备注
  sortNo: '', //排序值
  code: '', //code值
  name: '', //名称
  id: '',
  orgId: '',
  codeInfoId: '', //信息ID
  isInner: '', //是否内置
});

//添加和编辑表单的验证规则
const formRules = reactive({
  dictionaryCode: [
    { required: true, message: '请输入字典Code', trigger: 'blur' },
    {
      pattern: /^[\w-]{1,32}$/i,
      message: '只能输入数字、字母、下划线和-且不能超过32',
      trigger: 'blur',
    },
  ],
  dictionaryName: [
    { required: true, message: '请输入字典名称', trigger: 'blur' },
    {
      pattern: /^[\u4E00-\u9FA5\w]{1,100}$/,
      message: '只能输入数字、字母、下划线和中文字符且不能超过100',
      trigger: 'blur',
    },
  ],
  sortNo: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    {
      pattern: /(^[0-9]$)|(^[1-9]\d{1,3}$)/,
      message: '只能输入数字且最大不能超过9999',
      trigger: 'blur',
    },
  ],

  code: [
    { required: true, message: '请输入code值', trigger: 'blur', max: 250 },
  ],
  name: [{ required: true, message: '请输入名称', trigger: 'blur', max: 100 }],

  remark: [
    {
      required: true,
      min: 0,
      max: 100,
      message: '长度不超过100个字符',
      trigger: 'blur',
    },
  ],
  remark1: [
    {
      required: false,
      min: 0,
      max: 100,
      message: '长度不超过100个字符',
      trigger: 'blur',
    },
  ],
});
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为字典相关操作
const isType = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  let str = isType.value ? '字典' : '信息';
  return (isEdit.value ? '编辑' : '新增') + str;
});
//确定的loading
const saveLoading = ref<boolean>(false);

// 获取数据
async function getTypeist() {
  typeTableOption.tableLoading = true;
  const params = {
    ...typeSearch,
    ...typePagination,
  };
  const res = await getDictionariesType(params);
  const { code, data } = res;
  if (code === 200) {
    typeTableOption.tableData = data.records;
    typeTableOption.total = data.total;
  }
  typeTableOption.tableLoading = false;
}
//获取字典表信息
async function getInfoList() {
  infoTableOption.tableLoading = true;
  const params = {
    dictionaryCode: typeActive.value,
    ...infoSearch,
    ...infoPagination,
  };
  const res = await getDictionariesInfo(params);
  const { code, data } = res;
  if (code === 200) {
    infoTableOption.tableData = data.records;
    infoTableOption.total = data.total;
  }
  infoTableOption.tableLoading = false;
}

// 类型表格pagesize
function typePageSizeChange(options): void {
  const { pageSize } = options;
  typePagination.size = pageSize as number;
  getTypeist();
}
// 类型表格页码切换
function typeCurrentChange(options): void {
  const { pageIndex } = options;
  typePagination.current = pageIndex as number;
  getTypeist();
}

// 类型表格pagesize
function infoPageSizeChange(options): void {
  const { pageSize } = options;
  infoPagination.size = pageSize as number;
  getInfoList();
}
// 类型表格页码切换
function infoCurrentChange(options): void {
  const { pageIndex } = options;
  infoPagination.current = pageIndex as number;
  getInfoList();
}

//类型表格点击
function rowClick(row) {
  //清空表单
  dataForm.dictionaryCode = row.dictionaryCode;

  typeActive.value = row.dictionaryCode;
  typeActive2.value = row.id;
  typeActive3.value = row.id;
  infoSearch.name = '';
  getInfoList();
}

// 字典查询
function onTypeSearch() {
  infoTableOption.tableData = [];
  typePagination.current = 1;
  getTypeist();
}
//新增字典
function onTypeAdd(row) {
  isType.value = true;
  isEdit.value = false;
  dataForm.dictionaryCode = '';
  dataForm.dictionaryName = '';

  dialogVisible.value = true;
}
//字典编辑
async function onTypeEdit(row: any) {
  dataForm.isInner = row.isInner;
  dataForm.orgId = row.orgId;
  dataForm.id = row.id;
  dataForm.sortNo = row.sortNo;
  dataForm.remark = row.remark;
  dataForm.dictionaryCode = row.dictionaryCode;
  dataForm.dictionaryName = row.dictionaryName;
  isType.value = true;
  isEdit.value = true;
  nextTick(() => {
    dialogVisible.value = true;
  });
}
//字典删除
async function onTypeDelete(id: string) {
  confirmBox('删除该数据', async () => {
    const res = await delDictionariesType({ ids: id });
    if (res.code === 200) {
      messageAlert('success', '删除成功')
      getTypeist();
      typeActive.value = '';
      infoTableOption.tableData = [];
      infoTableOption.total = 0;
    }
  });
}

// 信息查询
function onInfoSearch() {
  infoTableOption.tableData = [];
  typePagination.current = 1;
  getInfoList();
}
//新增字典code
function onInfoAdd() {
  dataForm.sortNo = '';
  dataForm.remark = '';
  dataForm.dictionaryCode = '';
  dataForm.dictionaryId = '';
  dataForm.typeId = '';
  dataForm.dictionaryName = '';
  dataForm.code = '';
  dataForm.name = '';
  dataForm.orgId = '';
  dataForm.id = '';
  dataForm.codeInfoId = '';

  if (!typeActive.value) {
    messageAlert('warning', '请先选字典再添加code')
    return;
  }
  isType.value = false;
  isEdit.value = false;
  dialogVisible.value = true;
}
//信息编辑
async function onInfoEdit(row: any) {
  // dataForm.dictionaryCode = row.dictionaryCode;
  dataForm.dictionaryId = row.dictionaryCode;
  dataForm.typeId = row.typeId;
  dataForm.name = row.name;
  dataForm.orgId = row.orgId;
  dataForm.id = row.id;
  dataForm.code = row.code;
  dataForm.sortNo = row.sortNo;
  dataForm.codeInfoId = row.codeInfoId;
  dataForm.remark = row.remark;
  isType.value = false;
  isEdit.value = true;
  dialogVisible.value = true;
}
//信息删除
function onInfoDelete(id: string) {
  confirmBox('删除该数据', async () => {
    const res = await delDictionariesInfo({ ids: id });
    if (res.code === 200) {
      messageAlert('success', '删除成功')
      getInfoList();
    }
  });
}
//提交编辑或添加表单
function onSubmitForm() {
  saveLoading.value = true;
  formRef.value.validate(async (val) => {
    if (!val) {
      saveLoading.value = false;
      return;
    }
    let params: any = {
      sortNo: dataForm.sortNo,
      orgId: dataForm.orgId,
      id: dataForm.id,
      isInner: dataForm.isInner,
      remark: dataForm.remark,
      typeId: typeActive3.value,
      dictionaryId: typeActive.value,
      dictionaryName: dataForm.dictionaryName,
    };
    //类型表单
    if (isType.value) {
      //编辑表单
      if (isEdit.value) {
        let para = {
          dictionaryName: dataForm.dictionaryName,
          dictionaryCode: dataForm.dictionaryCode,
          remark: dataForm.remark,
          sortNo: dataForm.sortNo,
          id: dataForm.id,
          orgId: dataForm.orgId,
          isInner: dataForm.isInner,
        };
        const res = await editDictionariesType(para);
        saveLoading.value = false;
        if (res.code === 200) {
          getTypeist();
          dialogVisible.value = false;
          messageAlert('success', res.msg)
        }
      } else {
        let para = {
          dictionaryName: dataForm.dictionaryName,
          dictionaryCode: dataForm.dictionaryCode,
          remark: dataForm.remark,
          sortNo: dataForm.sortNo,
        };
        //类型增加
        const res = await addDictionariesType(para);
        saveLoading.value = false;
        if (res.code === 200) {
          getTypeist();
          dialogVisible.value = false;
          messageAlert('success', res.msg)
        }
      }
    } else {
      params.dictionaryCode = typeActive.value;
      (params.dictionaryId = typeActive2.value),
        // params.dictionaryId = typeActive.value;
        (params.name = dataForm.name);
      params.code = dataForm.code;

      //信息表单
      if (isEdit.value) {
        params.dictionaryId = typeActive.value;

        //编辑表单
        params.codeInfoId = dataForm.codeInfoId;
        const res = await editDictionariesInfo(params);
        saveLoading.value = false;
        if (res.code === 200) {
          getInfoList();
          dialogVisible.value = false;
          messageAlert('success', res.msg)
        }
      } else {
        params.dictionaryId = typeActive.value;
        //信息增加
        const res = await addDictionariesInfo(params);
        saveLoading.value = false;
        if (res.code === 200) {
          getInfoList();
          dialogVisible.value = false;
          messageAlert('success', res.msg)
        }
      }
    }
  });
}

//弹窗关闭
function dialogClosed() {
  formRef.value.clearValidate();
  formRef.value.resetFields();
}

getTypeist();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/dictionaries.scss";
</style>

<template>
  <div class="clue-manage">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-select v-model="followStatus" @change="onChangeStatus" style="margin-right:10px">
          <el-option
            v-for="(item, index) in statusList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input type="text" placeholder="请输入手机号" v-model.trim="searchForm.phone" clearable></el-input>
        <el-input
          type="text"
          placeholder="请输入企业名称"
          v-model.trim="searchForm.customerName"
          clearable
        ></el-input>
        <el-button class="btn-search" type="primary" @click="onSearch">查询</el-button>
      </div>

      <div class="import-export">
        <el-button type="primary" @click="onAdd">新增线索</el-button>
        <el-button class="btn-search" type="primary">
          <el-upload
            action
            :before-upload="beforeUpload"
            class="upload-demo"
            accept=".xls, .xlsx"
            :http-request="uploadFunc"
            :show-file-list="false"
          >
            <a>导入数据</a>
          </el-upload>
        </el-button>
        <el-button class="btn-search" type="primary" @click="onExportExcel">导出数据</el-button>
      </div>
    </div>

    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_belongId="{ data }">
        <span>{{ changeOwner(data.belongId) }}</span>
      </template>
      <template #col_updateTime="{ data }">
        <span>{{ formatcreateTime(data.updateTime) }}</span>
      </template>
      <template #col_createTime="{ data }">
        <span>{{ formatcreateTime(data.createTime) }}</span>
      </template>
      <template #col_nextContactTime="{ data }">
        <span>{{ formatnextTime(data.nextContactTime) }}</span>
      </template>
      <template #col_followStatus="{ data }">
        <span>{{ initFollowStatus(data.followStatus) }}</span>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="left" width="80">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="onEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <el-dialog v-model="dialogVisible" @close="closeDialog" destroy-on-close width="1300px">
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="状态" prop="followStatus">
              <el-select v-model="dataForm.followStatus" placeholder="筛选状态" style="width: 100%">
                <el-option
                  v-for="(item, index) in statusList.slice(1)"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区" prop="region">
              <el-cascader style="width: 300px" v-model="dataForm.region" :options="cityMap"></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="下次联系时间" prop="nextContactTime">
              <el-date-picker
                v-model="dataForm.nextContactTime"
                style="width: 300px"
                type="date"
                placeholder="请选择下次联系时间"
                :disabled-date="disabledDate"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-input v-model="dataForm.source" placeholder="请输入来源" maxlength="11" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input
                v-model="dataForm.customerName"
                placeholder="请输入客户名称"
                maxlength="20"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input
                v-model="dataForm.contactName"
                placeholder="请输入联系人"
                style="width: 100%"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="dataForm.position" placeholder="请输入职位" clearable></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dataForm.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="dataForm.telephone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="更多联系人" prop="moreContacts">
              <el-input
                v-model="dataForm.moreContacts"
                placeholder="请输入更多联系人"
                style="width: 100%"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属人" prop="belongId">
              <el-select
                filterable
                style="width: 100%;"
                placeholder="请选择归属人"
                v-model="dataForm.belongId"
              >
                <el-option
                  v-for="item in StaffList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.nickName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="备注" prop="mark">
              <el-input
                type="textarea"
                v-model="dataForm.mark"
                placeholder="请输入备注"
                maxlength="100"
                show-word-limit
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="跟进记录" prop="followList">
              <div style="display: flex;align-items: center;">
                <div style="width:50%;">
                  <el-input v-model="dataForm.followlog" placeholder="请输入跟进记录" clearable></el-input>
                </div>
                <div style="display: flex;margin-left: 10px;">
                  <i class="el-icon-circle-plus-outline" @click="onAddRecord"></i>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="dataForm.followList.length > 0" :gutter="10" style="margin-left: 40px;">
          <el-col :span="22">
            <div>
              <span>跟进日志</span>
              <el-table :data="dataForm.followList">
                <el-table-column prop="followTime" label="跟进时间" width="200" />
                <el-table-column prop="followLog" label="跟进记录" width="440" />
                <el-table-column prop="follower" label="跟进人" width="100" />
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue";
import tableColums from "@/config/tableConfig/cluesManageColumn";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";

import {
  geListByPerson,
  addManageUser,
  updateUserInfoClue,
  exportDataListExcel,
  importExcel,
  getStaffListAll
} from "@/api/system";
import DialogTitle from "@/components/dialogTitle/index.vue";
import cityMap from "@/assets/pc-code.json";

import { messageAlert, deepClone, getToken } from "@/utils/utils";



const formRef = ref<any>(null);
const subLoading = ref<boolean>(false);

// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);

//用户列表
const userList = ref<any>([]);

const formTitle = ref<string>('新增线索');
const contactphone = ref<any>(null);

// 查询表单参数
const searchForm = reactive({
  phone: undefined,
  customerName: undefined,
});
// 查询
function onSearch() {
  // followStatus.value;
  pagination.currentPage = 1;
  getDataList();
}

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
  currentPage: 1,
  pageSize: 15,
});

//添加和编辑的表单
const dataForm = reactive({
  orgName: "",
  orgId: "",
  id: "",
  followStatus: 5, //（0：潜在: 1：鱼池: 2：线索: 3：商机: 4：成交、5：未联系，默认为未联系）
  status: 0, //（1：试用中: 2：已成交: 3：已到期、0：未成交、4：已禁用）
  isDeal: 0, //（是否成交 1：成交、2：未成交）
  region: "", //（地区）
  nextContactTime: "", //下次联系时间
  source: "", //来源
  customerName: "",
  contactName: "", //（联系人）
  position: "", //（职位）
  telephone: "", //（电话）
  moreContacts: "", //（更多联系人）
  mark: null, //（备注）
  phone: "", //手机号码
  belongId: "", //所属人）
  updateTime: "",
  // registerTime: "", //（注册时间）
  auditBy: 1, //（创建人）
  auditName: null,
  // expireTime: "", //（过期时间）
  // auditTime: "", //（审核时间）
  // createTime: '',//添加时间
  belongName: '',
  nickName: '',
  followlog: "",
  followList: [
    {
      userInfoId: '',
      followTime: '',
      followLog: '',
      follower: getToken("user").nickName,
    },
  ],
});

//筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
const followStatus = ref<any>(-1);

//添加和编辑表单的验证规则
const formRules = reactive({
  orgName: [
    { required: true, message: "请选择企业名称", trigger: "blur" },
    { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" },
  ],
  // status: [
  //   { required: true, message: "请输入状态", trigger: "blur" },
  //   { min: 1, max: 50, message: "状态值为数字", trigger: "blur" },
  // ],
  customerName: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
  ],
  phone: [
    { min: 0, max: 11, message: "长度在 0 到 11 个字符", trigger: "blur" },
    {
      pattern: /^1[\d]{10}$/i,
      message: "输入的手机号码不正确",
      trigger: "blur",
    },
  ],

});

// 根据状态列表
const statusList = [
  {
    value: -1,
    label: "全部",
  },
  {
    value: 0,
    label: "潜在",
  },
  {
    value: 1,
    label: "鱼池",
  },
  {
    value: 2,
    label: "线索",
  },
  {
    value: 3,
    label: "商机",
  },
  {
    value: 4,
    label: "成交",
  },
  {
    value: 5,
    label: "未联系",
  },
];


function onChangeStatus(e) {

  searchForm.phone = undefined;
  searchForm.customerName = undefined;
  followStatus.value = e == -1 ? null : e;
  getDataList(followStatus.value);
}

// 关闭模态框
function closeDialog() {
  nextTick(() => {
    dialogVisible.value = false;
    formRef.value.resetFields();
  })
}

// 新增跟进记录
const onAddRecord = () => {
  if (!dataForm.followlog.trim()) return messageAlert('error', '跟进记录不能为空!');
  // if (dataForm.followList.length < 10) {
  dataForm.followList.unshift({
    userInfoId: dataForm.id,
    followLog: dataForm.followlog,
    follower: getToken("user").nickName,
    followTime: dayjs().format("YYYY-MM-DD HH:mm:ss") + '',
  });
  dataForm.followlog = ""
  // } else {
  //   ElMessage.warning({
  //     message: "一次最多添加10条跟进记录",
  //     type: "warning",
  //   });
  //   return;
  // }
};

// 删除跟进记录
const onRemoveRecord = (index) => {
  dataForm.followList.splice(index, 1);
};
//获取列表数据
async function getDataList(followStatus?: Number | null) {
  tableOption.tableLoading = true;

  const params = {
    followStatus: followStatus,
    ...searchForm,
    ...pagination,
  };
  const res = await geListByPerson(params);

  tableOption.tableLoading = false;
  if (res.code === 200) {
    let { data } = res;
    tableOption.tableData = data.records.map((item) => {
      return {
        ...item,
        lastFollow: item.lastFollow === null ? null : item.lastFollow.followLog,
      };
    });
    tableOption.total = data.total;
  }
}
getDataList();
// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.pageSize = pageSize as number;
  getDataList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.currentPage = pageIndex as number;
  getDataList();
}
//新增客户
const onAdd = () => {
  isEdit.value = false;
  formTitle.value = "新增线索";
  isEdit.value = false;
  dialogVisible.value = true;
  for (const key in dataForm) {
    if (key === 'followList') {
      dataForm[key] = []
    } else if (key === 'followStatus') {
      dataForm[key] = 5
    } else {
      dataForm[key] = ''
    }
  }
}

// 编辑
const onEdit = (row: any) => {
  formTitle.value = "编辑线索"
  isEdit.value = true;
  nextTick(() => {
    for (const key in dataForm) {
      key === 'followList' ? (row[key] ? dataForm[key] = deepClone(row[key]).reverse() : dataForm[key] = [
        {
          userInfoId: row.id,
          followLog: "",
        }
      ]) : dataForm[key] = row[key]
    }
  })
  dialogVisible.value = true
}

function initFollowStatus(follStatus) {
  switch (follStatus) {
    case -1:
      return "全部";
    case 0:
      return "潜在";
    case 1:
      return "鱼池";
    case 2:
      return "线索";
    case 3:
      return "商机";
    case 4:
      return "成交";
    case 5:
      return "未联系";
  }
}

//提交编辑或添加表单
function onSubmitForm() {
  dataForm.region = Array.isArray(dataForm.region)
    ? dataForm.region[1]
    : dataForm.region;
  const submitForm = deepClone(dataForm)
  submitForm.followList.reverse()
  submitForm.followList = submitForm.followList.filter(i => i.followLog.replaceAll(' ', '').length !== 0)
  formRef.value.validate(async (valid) => {
    if (dataForm.region) {
      dataForm.region = dataForm.region[1];
    }
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      const res = await addManageUser(submitForm);
      // dataForm.followList = [{ userInfoId: '', followLog: '' }];

      subLoading.value = false;
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
        dialogVisible.value = false;
      }
    } else {
      delete (submitForm.lastFollow)
      const res = await updateUserInfoClue(submitForm);


      subLoading.value = false;
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
      } else {
        getDataList();
      }
      if (res.code === 200) {
        ElMessage.success(res.msg);
        dialogVisible.value = false;
      }
    }
    closeDialog()
  });
}

//文件上传之前
const beforeUpload = (file) => {
  let isExcel = true;
  const typeList = ["xlsx", "xls"];
  const Excel = file.name.substring(file.name.lastIndexOf(".") + 1);
  const isLt2M = file.size / 1024 <= 500;

  if (!typeList.includes(Excel)) {
    messageAlert("error", "上传的文件只能是xlsx或者是xls格式");
    isExcel = false;
  }
  if (!isLt2M) {

    messageAlert("error", "上传的文件excel文件大小不能超过500M");
  }
  return isLt2M && isExcel;
};


//excel下载
const onExportExcel = async () => {
  const res = await exportDataListExcel();
  if (res.code == 200) {
    tableOption.tableLoading = false;
  }
};

//填入数据并上传excel表格
const uploadFunc = async (fileOptions: any): Promise<void> => {
  tableOption.tableLoading = true;
  const formData = new FormData();
  formData.append("file", fileOptions.file);

  const res = await importExcel(formData);

  if (res.code == 200) {
    messageAlert("success", "导入成功");
    tableOption.tableLoading = false;
    getDataList()
  } else {
    tableOption.tableLoading = false;
  }
};
//涉及到下次联系时间的不可选过往时间
function disabledDate(time) {
  return time.getTime() < Date.now()
}
//归属人范围下拉
const StaffList = ref<any>([]);

//处理下拉数据传参问题
function changeOwner(id) {
  if (id) {
    return StaffList.find((item) => item.id === id).nickName;
  }
}
// 获取数据
async function getStaffDataList() {

  const res = await getStaffListAll();
  StaffList.value = res.data;
}
getStaffDataList();

//格式化下次联系时间
function formatnextTime(str, format = "YYYY-MM-DD ") {
  if (!str) return "";
  return dayjs(str).format(format);
}
//格式化时间
function formatcreateTime(str) {
  if (!str) return "";
  return dayjs(str).format("YYYY-MM-DD HH:mm");
}
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/clueManagement.scss";
.el-icon-circle-plus-outline {
  font-size: 20px;
}
</style>


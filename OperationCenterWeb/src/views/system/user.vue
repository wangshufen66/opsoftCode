<template>
  <div class="user-list">
    <!-- 搜索栏 -->
    <div class="search-wrap">
      <el-select
        v-model="followStatus"
        @change="onChangeStatus"
        clearable
        style="margin-right:10px"
      >
        <el-option
          v-for="item in statusList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>

      <el-input type="text" placeholder="请输入客户名称" v-model.trim="searchForm.customerName" clearable></el-input>
      <el-input type="text" placeholder="请输入手机号" v-model.trim="searchForm.phone" clearable></el-input>
      <el-button type="primary" @click="onSearch" size="medium">搜索</el-button>
      <el-button type="primary" @click="onAdd" size="medium">新增用户</el-button>
    </div>
    <!-- 用户列表 -->
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_source="{ data }">
        <span v-show="data.source == 0">云搭</span>
        <span v-show="data.source == 1">钉钉</span>
        <span v-show="data.source == 2">线下</span>
      </template>
      <template #operatColumn>
        <!-- <el-table-column label="通过审核" min-width="100">
          <template #default="scope">
            <el-button v-show="scope.row.isDeal == 1" plain type="danger" size="small">已审核</el-button>
            <el-button
              v-show="scope.row.isDeal == 0"
              @click="onVerify(scope.row)"
              plain
              type="success"
              size="small"
            >审核</el-button>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" fixed="left" width="200">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="onEdit(scope.row)">编辑用户</el-button>
            <el-button
              v-show="scope.row.isDeal == 0"
              @click="onVerify(scope.row)"
              plain
              type="success"
              size="small"
            >审核</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <!-- 编辑弹出框 -->
    <el-dialog v-model="dialogVisible" @close="dialogClosed" destroy-on-close>
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="跟进状态" prop="followStatus">
              <el-select v-model="dataForm.followStatus" placeholder="请选择状态" style="width: 300px;">
                <el-option
                  v-for="(item, index) in statusListSelect"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地区" prop="region">
              <el-select v-model="dataForm.region" placeholder="请选择地区" style="width: 300px;">
                <el-option
                  v-for="(item, index) in allProvinceData"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="下次联系时间" prop="nextContactTime">
              <el-date-picker
                type="date"
                v-model="dataForm.nextContactTime"
                style="width: 300px;"
                placeholder="请选择下次联系时间"
                :disabled-date="disabledDate"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-select
                v-model="dataForm.source"
                :disabled="isEdit"
                placeholder="请选择来源"
                style="width: 100%;"
              >
                <el-option value="0" label="云搭"></el-option>
                <el-option value="1" label="钉钉"></el-option>
                <el-option value="2" label="线下"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input
                v-model="dataForm.customerName"
                placeholder="请输入客户名称"
                maxlength="11"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactName">
              <el-input
                v-model="dataForm.contactName"
                placeholder="请输入联系人"
                style="width: 100%;"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="dataForm.userName" placeholder="请输入用户名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="dataForm.position" placeholder="请输入职位" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="dataForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="电话" prop="telephone">
              <el-input v-model="dataForm.telephone" placeholder="请输入电话"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="更多联系人" prop="moreContacts">
              <el-input
                v-model="dataForm.moreContacts"
                placeholder="请输入更多联系人"
                style="width: 100%;"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="备注" prop="mark">
              <el-input v-model="dataForm.mark" placeholder="请输入备注" style="width: 100%;" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="20">
            <el-form-item label="跟进记录">
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
        <el-row
          v-if="dataForm.followList && dataForm.followList.length > 0"
          :gutter="10"
          style="margin-left: 40px;"
        >
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
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick } from "vue";
import tableColums from "@/config/tableConfig/sysUserList";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import { getUserInfo, updateUserInfo, verifyUser, getStaffList, addRegisterUser, getDictionaryInfo } from "@/api/system";
import DialogTitle from "@/components/dialogTitle/index.vue";
import { messageAlert, getToken } from "@/utils/utils";

//添加和编辑的表单
const dataForm = reactive({
  orgName: "",
  id: "",
  followStatus: 5, //（0：潜在: 1：鱼池: 2：线索: 3：商机: 4：成交、5：未联系，默认为未联系）
  status: 0, //（1：试用中: 2：已成交: 3：已到期、0：未成交、4：已禁用）
  isDeal: 0, //（ "isDeal": 0,  有两个含义 是否成交 0未成交 1成交  0未审核 1审核  ）
  region: undefined, //（地区）
  nextContactTime: "", //下次联系时间
  source: "", //来源
  customerName: "",//客户名称=企业名称(来自云搭注册)
  contactName: "", // 联系人
  userName: "",//用户名 (来自云搭注册) 
  position: "", //（职位）
  moreContacts: "", //（更多联系人）
  mark: undefined, //（备注）
  phone: "", //手机号码
  updateTime: "",
  registerTime: "", //（注册时间）
  expireTime: "", //（过期时间）
  auditTime: "", //（审核时间）
  followlog: '',
  followList: [
    {
      userInfoId: '',
      followTime: '',
      followLog: '',
      follower: getToken("user").nickName,
    },
  ],
});


//归属人范围下拉
const StaffList = ref<any>([]);
const formTitle = ref<string>('新增用户');

//涉及到下次联系时间的不可选过往时间
function disabledDate(time) {
  return time.getTime() < Date.now()
}

// 新增跟进记录
const onAddRecord = () => {
  // if (dataForm.followList && dataForm.followList.length < 10) {
  if (!dataForm.followlog.trim()) return messageAlert('error', '跟进记录不能为空!');
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
// const onRemoveRecord = (index: number): void => {
//   recordObj.value.followList.splice(index, 1);
// };
// 搜索内容
// const input = ref("");
// 查询表单参数
const searchForm = reactive({
  phone: undefined,
  customerName: undefined,
});

// 查询
function onSearch() {
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

// 员工下拉获取数据
async function getStaffDataList() {
  const params = {
    ...pagination
  };
  const res = await getStaffList(params);
  StaffList.value = res.data.records;
}
// getStaffDataList();
//选中的菜单id

const formRef = ref<any>(null);
const subLoading = ref<boolean>(false);

// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//是否显示编辑租户权限
//判断是否为编辑
const isEdit = ref<boolean>(false);

//用户列表

//添加和编辑表单的验证规则
const formRules = reactive({
  customerName: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
  ],
  source: [
    { required: true, message: "请选择来源", trigger: "blur" },
  ],
  nextContactTime: [
    { required: true, message: "请选择下次联系时间", trigger: "blur" },
  ],
  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  contactName: [
    { required: true, message: "请输入联系人", trigger: "blur" },
  ],
  // telephone: [
  //   { required: true, message: "请输入电话", trigger: "blur" },
  // ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
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
  // {
  //   value: 4,
  //   label: "成交",
  // },
  {
    value: 5,
    label: "未联系",
  },
];

// 根据状态列表
const statusListSelect = [
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
  // {
  //   value: 4,
  //   label: "成交",
  // },
  {
    value: 5,
    label: "未联系",
  },
];

// 初始化筛选框数据
const followStatus = ref<any>(-1);

// 筛选列表数据
const onChangeStatus = (e) => {
  e == -1 ? getDataList() : getDataList({ followStatus: followStatus.value });
  followStatus.value = statusList.find((i) => {
    return e === i.value;
  })?.label;
};

//获取列表数据
async function getDataList(queryParams?: object) {
  tableOption.tableLoading = true;
  const params = {
    ...searchForm,
    // 分页参数
    ...pagination,
    // 其他url参数
    ...queryParams,
    isDeal: 0,
  };
  const res = await getUserInfo(params);
  tableOption.tableLoading = false;
  if (res.code === 200) {
    let { data } = res;
    // 将请求得到的数据格式化
    tableOption.tableData = data.records.map((item) => {
      return {
        ...item,
        //处理跟进状态
        followStatus: statusList.find((i) => {
          return item.followStatus === i.value;
        })?.label,
        //格式化下次联系时间、修改时间、注册时间
        nextContactTime: formatTime(item.nextContactTime, "YYYY-MM-DD"),
        lastFollow: item.lastFollow === null ? null : item.lastFollow.followLog,
        updateTime: formatTime(item.updateTime, "YYYY-MM-DD HH:mm"),
        registerTime: formatTime(item.registerTime, "YYYY-MM-DD HH:mm"),
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

//新增用户
async function onAdd() {
  dataForm.followStatus = 5;
  dataForm.region = undefined;
  dataForm.nextContactTime = "";
  dataForm.source = "";
  dataForm.customerName = "";
  dataForm.contactName = "";
  dataForm.userName = "";
  dataForm.position = "";
  dataForm.phone = "";
  dataForm.moreContacts = "";
  dataForm.mark = undefined;
  dataForm.followList = [];
  isEdit.value = false;
  dialogVisible.value = true;
  formTitle.value = "新增客户";


}

// 编辑
async function onEdit(row: any) {
  formTitle.value = "编辑用户";
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.orgName = row.orgName;
  // dataForm.orgId = row.orgId;
  dataForm.id = row.id;
  dataForm.status = row.status;
  dataForm.region = row.region;
  dataForm.nextContactTime = formatTime(row.nextContactTime);
  dataForm.source = row.source;
  dataForm.customerName = row.customerName;
  dataForm.contactName = row.contactName;
  dataForm.userName = row.userName;
  dataForm.position = row.position;
  dataForm.phone = row.phone;
  dataForm.moreContacts = row.moreContacts;
  dataForm.mark = row.mark;
  dataForm.followList = row.followList || [];
}


//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      try {
        const res = await addRegisterUser(dataForm);
        subLoading.value = false;
        if (res.code === 200) {
          ElMessage.success(res.msg);
          getDataList();
          dialogVisible.value = false;
        }
      } catch (error) {
        subLoading.value = false;
      }
    } else {
      try {
        const res = await updateUserInfo(dataForm);
        subLoading.value = false;
        if (res.code === 200) {
          ElMessage.success(res.msg);
          dialogVisible.value = false;
          getDataList();
        }
      } catch (error) {
        ElMessage.error('保存失败');
        subLoading.value = false;
      }
    }
  });
}

function onCancel() {
  dialogVisible.value = false;
  formRef.value.resetFields();

}

//弹框关闭
function dialogClosed() {
  formRef.value.clearValidate();
  dataForm.orgName = "";
  // dataForm.orgId = "";
  dataForm.id = "";
  nextTick(() => {
    dialogVisible.value = false;
    formRef.value.resetFields();
  })
}

//格式化时间
function formatTime(str, format = "YYYY-MM-DD HH:mm:ss") {
  if (!str) return "";
  return dayjs(str).format(format);
}


async function onVerify(row) {
  const params = {
    // orgId: row.orgId,
    id: row.id,
  };
  const res = await verifyUser(params);
  if (res.code == 200) {
    ElMessage.success({
      message: res.msg,
      type: "success",
    });
  }
  getDataList();
}
const allProvinceData = ref<any>([]);
//获取所有省份列表
async function getProvincesList() {
  const params = {
    dictionaryCode: "province",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    allProvinceData.value = res.data.records;

  }
}
getProvincesList();


</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/user.scss";
</style>

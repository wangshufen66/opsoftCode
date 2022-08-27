<template>
  <div class="user-list">
    <div class="search-wrap">
      <el-select
        v-model="followStatus"
        @change="onChangeStatus"
        clearable
        style="margin-right:10px"
      >
        <el-option
          v-for="(item, index) in statusList"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input type="text" placeholder="请输入客户名称" v-model.trim="searchForm.customerName" clearable></el-input>
      <el-input type="text" placeholder="请输入手机号" v-model.trim="searchForm.phone" clearable></el-input>
      <el-button type="primary" @click="onSearch">搜索</el-button>
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
      <!-- <template #col_belongId="{ data }">
        <span>{{ changeOwner(data.belongId) }}</span>
      </template>-->
      <template #col_nextContactTime="{ data }">
        <span>{{ formatnextTime(data.nextContactTime) }}</span>
      </template>
      <template #col_expireTime="{ data }">
        <span>{{ formatnextTime(data.expireTime) }}</span>
      </template>
      <template #col_statusName="{ data }">
        <div
          :style="{
            color:
              data.statusName === '试用中'
                ? '#F1B643'
                : data.statusName === '已成交'
                  ? '#3468D4'
                  : data.statusName === '已审核' ? '#67c23a' : '#FB6041',
          }"
        >{{ data.statusName }}</div>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="left" width="200">
          <template #default="{ row }">
            <el-dropdown @command="handleOprList($event, row)">
              <el-button type="primary" size="small" plain>
                更改状态
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="0">未成交</el-dropdown-item>
                  <el-dropdown-item command="1">试用</el-dropdown-item>
                  <el-dropdown-item command="2">成交</el-dropdown-item>
                  <el-dropdown-item command="3">已到期</el-dropdown-item>
                  <el-dropdown-item command="4">已审核</el-dropdown-item>
                  <el-dropdown-item command="5">禁用</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button
              type="primary"
              plain
              size="small"
              @click="onEdit(row)"
              style="margin-left: 10px;"
            >编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <!-- 编辑弹出框 -->
    <el-dialog v-model="dialogVisible" @close="dialogClosed" destroy-on-close title="编辑客户">
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input
                v-model="dataForm.customerName"
                :disabled="true"
                placeholder="请输入客户名称"
                maxlength="11"
                clearable
              ></el-input>
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
                style="width: 300px;"
                v-model="dataForm.nextContactTime"
                placeholder="请选择下次联系时间"
                :disabled-date="disabledDate"
                clearable
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-select v-model="dataForm.source" :disabled="isEdit" placeholder="请选择来源">
                <el-option value="0" label="云搭"></el-option>
                <el-option value="1" label="钉钉"></el-option>
                <el-option value="2" label="线下"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
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
            <el-form-item label="到期时间" prop="expireTime">
              <el-date-picker
                v-model="dataForm.expireTime"
                style="width: 100%;"
                placeholder="请选择到期时间"
                clearable
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="注册时间" prop="registerTime">
              <el-date-picker
                v-model="dataForm.registerTime"
                style="width: 100%;"
                placeholder="请选择注册时间"
                clearable
                disabled
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="10">
          <!-- <el-col :span="12">
            <el-form-item label="归属人" prop="belongId">
              <el-select style="width: 100%;" placeholder="请选择归属人" v-model="dataForm.belongId">
                <el-option
                  v-for="item in StaffList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.nickName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->

          <el-col :span="12">
            <el-form-item label="成交金额" prop="dealAmount">
              <el-input
                v-model="dataForm.dealAmount"
                placeholder="请输入成交金额"
                maxlength="11"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="mark">
              <el-input v-model="dataForm.mark" placeholder="请输入备注" maxlength="11" clearable></el-input>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
    <!-- 修改状态下拉框的dialog -->
    <el-dialog v-model="operaDialogVisible" width="30%">
      <template #title>
        <span v-if="isDisabled">填写禁用原因</span>
        <span v-else>提示</span>
      </template>
      <strong v-if="!isDisabled">
        确认更改用户状态为
        <span class="confirm-msg">"{{ confirmMsg }}"</span>
        ?
      </strong>
      <el-form v-else :model="ruleForm" ref="ruleFormRef" :rules="formRules">
        <el-form-item label="禁用原因" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="corfirm">保 存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import tableColums from "@/config/tableConfig/dealList";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
import {
  getUserInfo,
  updateUserInfo,
  getAuthList,
  getStaffListAll,
  updateAuthList,
  getDictionaryInfo
} from "@/api/system";
import cityMap from "@/assets/pc-code.json";
import { deepClone } from "@/utils/utils";
import { nextTick } from "process";
import { messageAlert, getToken } from "@/utils/utils";

let isDisabled = ref<boolean>(true);
let confirmMsg = ref<string>("");
let selectID = ref(null);
//当前选中行的orgId
let orgIdName = ref(null);

let selectStatus = ref(null);


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
  dealAmount: undefined,
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


const formRef = ref<any>(null);
let subLoading = ref<boolean>(false);
// 初始化筛选框数据
const followStatus = ref<any>(-1);
// 是否显示弹框
let dialogVisible = ref<boolean>(false);
// 是否显示操作弹框
let operaDialogVisible = ref<boolean>(false);
//判断是否为编辑
let isEdit = ref<boolean>(false);
//列表配置项
const tableOption = reactive({
  tableData: [],
  tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
});
// 根据状态列表
const statusList = [
  {
    value: -1,
    label: "全部",
  },
  {
    value: 0,
    label: "未成交",
  },
  {
    value: 1,
    label: "试用中",
  },
  {
    value: 2,
    label: "已成交",
  },
  {
    value: 3,
    label: "已到期",
  },
  {
    value: 4,
    label: "已审核",
  },
  {
    value: 5,
    label: "禁用",
  },
];

//更改状态表单绑定
const ruleFormRef = ref(null);
//禁用原因
const ruleForm = reactive({
  desc: "",
});

//涉及到下次联系时间的不可选过往时间
function disabledDate(time) {
  return time.getTime() < Date.now()
}

const menuTreeRef = ref<any>(null);
//归属人范围下拉
const StaffList = ref<any>([]);
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
//处理下拉数据传参问题
function changeOwner(id) {
  if (id) {
    return StaffList.find((item) => item.id === id).nickName;
  }
}
// 员工下拉获取数据
async function getStaffDataList(row?) {
  const res = await getStaffListAll();
  StaffList.value = res.data;
}
// getStaffDataList();

//添加和编辑表单的验证规则
const formRules = reactive({
  desc: [{ required: true, message: "请填写禁用原因", trigger: "blur" }],
  customerName: [
    { required: true, message: "请输入客户名称", trigger: "blur" },
  ],
});

const handleOprList = (command, row) => {
  operaDialogVisible.value = true;
  selectID = row.id;
  orgIdName = row.orgId;
  selectStatus = command;
  if (command !== "5") {
    isDisabled.value = false;

    switch (command) {
      case "1":
        confirmMsg.value = '试用中'
        break;
      case "2":
        confirmMsg.value = '已成交'
        break;
      case "3":
        confirmMsg.value = '已到期'
        break;
      case "4":
        confirmMsg.value = '已审核'
        break;
      case "0":
        confirmMsg.value = '未成交'
        break;
      default:
        confirmMsg.value = '未成交'
        break;
    }
  } else {
    isDisabled.value = true;
  }
};
// 查询表单参数
const searchForm = reactive({
  phone: undefined,
  customerName: undefined,
});
// 添加跟进记录
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
// const onRemoveRecord = (index) => {
//   dataForm.followList.splice(index, 1);
// };

// 查询
function onSearch() {
  pagination.currentPage = 1;
  getDataList();
}

// 筛选列表数据
const onChangeStatus = (e) => {
  e == -1 ? getDataList() : getDataList({ status: followStatus.value });
  followStatus.value = statusList.find((i) => {
    return e === i.value;
  })?.label;
};

//获取列表数据
async function getDataList(queryParams?: object) {
  tableOption.tableLoading = true;
  const params = {
    // 分页参数
    ...pagination,
    // currentPage: pagination.currentPage,
    // pageSize: pagination.pageSize,
    // 其他url参数
    ...queryParams,
    ...searchForm,
    isDeal: 1,
  };
  const res = await getUserInfo(params);
  if (res.code === 200) {
    tableOption.tableLoading = false;
    let { data } = res;
    tableOption.tableData = data.records.map((item) => {
      return {
        ...item,
        //格式化下次联系时间、修改时间、注册时间
        statusName: statusList.find((i) => {
          return item.status === i.value;
        })?.label,
        // expireTime: formatTime(item.expireTime, "YYYY-MM-DD HH:mm"),
        // nextContactTime: formatTime(item.nextContactTime, "YYYY-MM-DD HH:mm"),
        // updateTime: formatTime(item.updateTime, "YYYY-MM-DD HH:mm"),
        // registerTime: formatTime(item.registerTime, "YYYY-MM-DD HH:mm"),
        // auditTime: formatTime(item.auditTime, "YYYY-MM-DD HH:mm"),
        // 控制应用授权按钮是否可见
        visible: false,
      };
    });
    tableOption.total = data.total;
  }
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize, pageIndex } = options;
  pagination.pageSize = pageSize as number;
  pagination.currentPage = pageIndex as number

  getDataList();
}
// 表格页码切换
function currentChange(options): void {

  const { pageIndex } = options;
  pagination.currentPage = pageIndex as number;
  getDataList();
}

// 编辑
async function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
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
}
//提交编辑或添加表单
function onSubmitForm() {
  // dataForm.belongName = dataForm.nickName = StaffList.value.find(
  //   (item) => item.id === dataForm.belongId
  // ).nickName;
  const submitForm = deepClone(dataForm)
  // submitForm.followList.reverse()
  // submitForm.followList = submitForm.followList.filter(i => i.followLog.replaceAll(' ', '').length !== 0)
  // dataForm.region = Array.isArray(dataForm.region)
  //   ? dataForm.region[1]
  //   : dataForm.region;
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit) {
      try {
        const res = await dataForm;
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
        let params = {
          ...dataForm,
        };
        const res = await updateUserInfo(params);
        dataForm.followList = [{ followLog: "" }];
        subLoading.value = false;
        if (res.code === 200) {
          ElMessage.success(res.msg);
          dialogVisible.value = false;
          getDataList();
        }
      } catch (error) {
        // ElMessage.error(res.msg);
        subLoading.value = false;
      }
    }
  });
}
//弹框关闭
function dialogClosed() {
  formRef.value.clearValidate();
  dataForm.orgName = "";
  dataForm.orgId = "";
  dataForm.id = "";

}

// 取消
const cancel = () => {
  operaDialogVisible.value = false;
};

// 更改状态提示确认
async function corfirm(row) {
  let params = {
    id: selectID,
    status: selectStatus,
    isDeal: 1,
    orgId: orgIdName,
  };
  if (isDisabled.value) {
    ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        const res = await updateUserInfo(params);
        if (res.code == 200) {
          ElMessage.success("修改成功");
        }
        getDataList();

        operaDialogVisible.value = false;
        ruleForm.desc = "";
      } else {
        return false;
      }
    });
  } else {
    const res = await updateUserInfo(params);
    if (res.code == 200) {
      ElMessage.success("修改成功");
    }
    getDataList();
    operaDialogVisible.value = false;
  }
}
//格式化时间
function formatTime(str, format = "YYYY-MM-DD HH:mm:ss") {
  if (!str) return "";
  return dayjs(str).format(format);
}
//格式化下次联系时间
function formatnextTime(str, format = "YYYY-MM-DD ") {
  if (!str) return "";
  return dayjs(str).format(format);
}

getDataList();
</script>
<style lang="scss" scoped>
@import "@/styles/modules/system/dealList.scss";
</style>

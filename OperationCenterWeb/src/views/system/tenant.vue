<template>
  <div class="user-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form :inline="true" @submit.prevent>
          <el-form-item label="企业代码">
            <el-input
              type="text"
              placeholder="请输入企业代码"
              v-model="searchForm.orgId"
              clearable
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业名称">
            <el-input
              type="text"
              placeholder="请输入企业名称"
              v-model="searchForm.orgName"
              clearable
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
          <el-form-item label="到期账套">
            <el-select v-model="searchForm.expireType" placeholder="请选择到期账套" clearable>
              <el-option
                v-for="item in expireTenantList"
                :label="item.label"
                :value="item.id"
                :key="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" @click="onAdd">新建账套</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_disableStatus="{ data }">
        <span v-show="data.disableStatus == 1">启用</span>
        <span v-show="data.disableStatus == 2">禁用</span>
      </template>
      <template #col_applicationsList="{ data }">
        <span>{{ onFormatAppList(data.applicationsList) }}</span>
      </template>
      <template #col_expireTime="{ data }">
        <span>{{ data.expireTime && data.expireTime.substring(0, 10) }}</span>
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="left" width="80">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="onEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog :title="formTitle" v-model="dialogVisible" @close="closeDialog" destroy-on-close>
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="140px">
        <el-form-item label="超级管理员" prop="adminUser">
          <el-select v-model="dataForm.adminUser" placeholder="请选择超级管理员">
            <el-option v-for="item in adminUserList" :value="item.userName" :label="item.userName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账套到期时间" prop="expireTime">
          <el-date-picker
            v-model="dataForm.expireTime"
            placeholder="请选择到期时间"
            :disabled-date="disabledDate"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="授权应用" style="padding-right:90px" prop="applicationsList">
          <el-tree
            show-checkbox
            ref="treeRef"
            :data="treeData.appTreeData"
            :props="treeData.defaultProps"
            node-key="id"
            :highlight-current="true"
            :expand-on-click-node="false"
            :default-checked-keys="treeData.checks"
          >
            <template #default="{ node, data }" style="height: 40px;">
              <span class="custom-tree-node" style="height: 40px;">
                <span>{{ node.label }}</span>
                <el-date-picker
                  v-model="data.expireTime"
                  v-if="data.level == 1"
                  placeholder="请选择到期时间"
                  :disabled-date="disabledDate"
                ></el-date-picker>
              </span>
            </template>
          </el-tree>
        </el-form-item>
        <el-form-item label="授权子用户数" prop="accNum">
          <el-input-number v-model="dataForm.accNum"></el-input-number>
        </el-form-item>
        <el-form-item label="账套状态">
          <el-select v-model="dataForm.disableStatus" placeholder="请选择账套状态">
            <el-option :value="1" label="启用"></el-option>
            <el-option :value="2" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标准账套版本" props="orgVersion">
          <el-select v-model="dataForm.orgVersion" placeholder="请选择标准账套版本">
            <el-option
              v-for="item in orgVersionList"
              :value="item.code"
              :label="item.name"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否私有部署">
          <el-select v-model="dataForm.privateInstall" placeholder="请选择是否私有部署">
            <el-option :value="1" label="是"></el-option>
            <el-option :value="0" label="否"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务器位置" props="serviceLocation">
          <el-select v-model="dataForm.serviceLocation" placeholder="请选择服务器位置">
            <el-option
              v-for="item in serviceLocationList"
              :value="item.code"
              :label="item.name"
              :key="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服" props="customerService">
          <el-select v-model="dataForm.customerServiceIdList" multiple placeholder="请选择客服">
            <el-option
              v-for="item in customerServiceList"
              :value="item.userId"
              :label="item.nickName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref, nextTick } from "vue";
import tableColums from "@/config/tableConfig/tenant";
import { messageAlert, confirmBox } from "@/utils/utils";
import DialogTitle from "@/components/dialogTitle/index.vue";
import { getAllSysOrg, getAdministrator, getAppStandard, addSysOrg, updateSysOrg, getSysOrgById, getStaffList, getDictionaryInfo } from "@/api/system";

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
const expireTenantList = ref<any>([
  { id: 1, label: "已到期" },
  { id: 2, label: "一个月内" },
  { id: 3, label: "三个月内" },
  { id: 4, label: "六个月内" },
])

const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
});

const treeRef = ref<any>();
//定义超级管理员列表
const adminUserList = ref<any>([]);

//客服列表
const customerServiceList = ref<any>([]);
//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? "编辑账套" : "新建账套";
});
//版本列表
const orgVersionList = ref<any>([]);
//服务器位置列表
const serviceLocationList = ref<any>([]);

//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  id: "",
  orgId: "",//企业代码
  orgName: "",//企业名称  orgName
  adminUser: "",//超级管理员
  expireTime: "",//账套到期时间
  applicationsList: [],//applicationsList
  accNum: 1,
  disableStatus: 1,//账套状态
  region: "",
  regionName: "",
  customerServiceIdList: [],
  customerService: [],
  orgVersion: '',//标准账套版本号
  privateInstall: 0,//是否私有部署
  serviceLocation: ''//服务器位置
});

//添加和编辑表单的验证规则
const formRules = reactive({
  adminUser: [
    { required: true, message: "请选择超级管理员", trigger: "blur" },
  ],
  expireTime: [
    { required: true, message: "请选择到期时间", trigger: "blur" },
  ],
  accNum: [
    { required: true, message: "请输入授权子用户数", trigger: "blur" }
  ]
});

// function validateApplication(rule, value, callback) {
//   if (value && value.length > 0) {
//     for (let i = 0; i < value.length; i++) {
//       const item = value[i];
//       if (!item["expireTime"]) {
//         callback(new Error("请为选择的应用添加到期时间"));
//         return;
//       }
//     }
//   }
//   callback();
// }

const treeData = reactive({
  appTreeData: [],
  checks: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  },
});

// 查询表单参数
const searchForm = reactive({
  orgId: "",
  orgName: "",
  expireType: "",
});

// 查询
function onSearch() {
  pagination.currentPage = 1;
  getAllSysOrgData();
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.pageSize = pageSize as number;
  getAllSysOrgData();
}

// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.currentPage = pageIndex as number;
  getAllSysOrgData();
}
//获取字典表消息等级列表
async function getorgVersionList() {
  const params = {
    dictionaryCode: "orgVersion",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    orgVersionList.value = res.data.records;
  }
}
getorgVersionList()
//获取字典表消息等级列表
async function getServiceLocationList() {
  const params = {
    dictionaryCode: "serviceLocation",
    current: 1,
    size: 100,
  };
  const res = await getDictionaryInfo(params);
  if (res.code === 200) {
    serviceLocationList.value = res.data.records;
  }
}
getServiceLocationList()
//弹框关闭
function closeDialog() {
  dialogVisible.value = false;
  formRef.value && formRef.value.resetFields();
  treeData.checks = [];//清楚treeData中选中的数据
}

//新增账套
const onAdd = () => {
  dataForm.id = "",
    dataForm.adminUser = "",
    dataForm.accNum = 1,
    dataForm.disableStatus = 1,
    dataForm.customerServiceIdList = [],
    dataForm.expireTime = "",
    dataForm.orgId = "",
    dataForm.orgName = "",
    dataForm.region = "",
    dataForm.regionName = "",
    dataForm.orgVersion = "",
    dataForm.privateInstall = 0,
    dataForm.serviceLocation = "",
    isEdit.value = false;
  dialogVisible.value = true;
}
//涉及到下次联系时间的不可选过往时间
function disabledDate(time) {
  return time.getTime() < Date.now()
}

// 获取账套列表数据
async function getAllSysOrgData() {
  const params = {
    ...pagination,
    ...searchForm,
  };
  const res = await getAllSysOrg(params);
  if (res.code == 200) {
    tableOption.tableData = res.data.records;
    tableOption.total = res.data.total;
  }
}
getAllSysOrgData()

// 查询管理员 参数为 orgId 或者空字符串
async function getAdministratorData() {
  const res = await getAdministrator({
    orgId: ""
  });
  if (res.code == 200) {
    adminUserList.value = res.data
  }
}
getAdministratorData()

// 获取员工列表数据,作为客服列表
async function getcustomerServiceList() {
  const res = await getStaffList({
    currentPage: 1,
    pageSize: 10000,
  });
  if (res.code == 200) {
    customerServiceList.value = res.data.records
  }
}
getcustomerServiceList()

// 查询标准账套应用
async function getAppStandardData() {
  const res = await getAppStandard();
  const appData: any[] = [];
  res.data.forEach((ele: any, index) => {
    appData.push({
      id: ele.id,
      label: ele.appName,
      children: [],
      level: 1,
      expireTime: "",
    });
    if (ele.models && ele.models.length > 0) {
      ele.models.forEach(item => {
        appData[index].children.push({
          id: item.id,
          parentId: ele.id,
          label: item.modelName,
          level: 2,
        })
      });
    }
  })
  treeData.appTreeData = appData
}
getAppStandardData()

//提交保存
async function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    let selectedAppModule = treeRef.value.getCheckedNodes(false, true);
    let arrOnelEvel = [];
    let arrTwolEvel = [];
    for (let index = 0; index < selectedAppModule.length; index++) {
      const item: any = selectedAppModule[index];
      if (item.level == 1) {
        if (!item.expireTime) return messageAlert("error", "请为选择的应用添加到期时间");
        arrOnelEvel.push({
          expireTime: item.expireTime,
          appId: item.id,
          appName: item.label,
          level: item.level,
          modelList: []
        });
      }
      if (item.level == 2) {
        arrTwolEvel.push(item);
      }
    }

    arrOnelEvel.forEach((ele1) => {
      arrTwolEvel.forEach((ele2) => {
        if (ele2.parentId == ele1.appId) {
          ele1.modelList.push({
            appId: ele2.id,
            appName: ele2.label,
          });
        }
      });
    });
    dataForm.applicationsList = arrOnelEvel
    dataForm.customerService = []
    for (let index = 0; index < dataForm.customerServiceIdList.length; index++) {
      const element: any = dataForm.customerServiceIdList[index];
      for (let index = 0; index < customerServiceList.value.length; index++) {
        const item: any = customerServiceList.value[index];
        if (element == item.userId) {
          dataForm.customerService.push({
            orgId: item.orgId,
            userId: item.userId,
            nickName: item.nickName
          })
        }
      }
    }

    if (dataForm.orgId) {
      subLoading.value = true;
      const res = await updateSysOrg(dataForm)
      subLoading.value = false;
      if (res.code == 200) {
        messageAlert("success", "编辑成功");
        getAllSysOrgData();
        dialogVisible.value = false;
      }
    } else {
      const userinfo = adminUserList.value.find(item => item.userName == dataForm.adminUser);
      if (userinfo) {
        dataForm.region = userinfo.region
        dataForm.regionName = userinfo.regionName
        dataForm.orgName = userinfo.customerName
        if (!userinfo.region || userinfo.region == 91) {
          return messageAlert("error", "将要创建的账套的超级管理员归属区域不正确，请到与客户确认并到成交列表页面完善客户区域信息后再试。", false, 6000);
        }
      } else {
        return messageAlert("error", "请重新选择超级管理员");
      }



      const params = {
        adminUser: dataForm.adminUser,
        orgName: dataForm.orgName,
        region: dataForm.region,
        expireTime: dataForm.expireTime,
        accNum: dataForm.accNum,
        disableStatus: dataForm.disableStatus,
        orgVersion: dataForm.orgVersion,
        privateInstall: dataForm.privateInstall,
        serviceLocation: dataForm.serviceLocation,
        customerService: dataForm.customerService,
        applicationsList: dataForm.applicationsList,
      }

      confirmBox(`要新建的账套，区域归属【${userinfo.regionName}】，点击确认按钮将生成新的账套`, async () => {
        subLoading.value = true;
        const res = await addSysOrg(params)
        subLoading.value = false;
        if (res.code == 200) {
          messageAlert("success", "新增成功");
          getAllSysOrgData();
          dialogVisible.value = false;
          getAdministratorData();
        }
      });
    }
  })
}

/**
 * 编辑
*/
async function onEdit(row: any) {
  const res = await getSysOrgById({ id: row.id })
  isEdit.value = true;
  dataForm.id = row.id
  dataForm.orgId = row.orgId
  dataForm.orgName = row.orgName
  dataForm.adminUser = row.adminUser;
  dataForm.expireTime = row.expireTime;
  dataForm.accNum = row.accNum;
  dataForm.disableStatus = row.disableStatus;
  dataForm.orgVersion = row.orgVersion;
  dataForm.privateInstall = row.privateInstall;
  dataForm.serviceLocation = row.serviceLocation;
  dataForm.customerServiceIdList = row.customerService && row.customerService.length > 0 && row.customerService.map(item => item.userId);
  dataForm.region = row.region;

  row.applicationsList && row.applicationsList.length > 0 && row.applicationsList.forEach(ele => {
    if (ele.modelList && ele.modelList.length > 0) {
      ele.modelList.forEach(item => {
        treeData.checks.push(item.appId)
      })
    }
  })

  treeData.appTreeData && treeData.appTreeData.length > 0 && treeData.appTreeData.forEach(ele => {
    row.applicationsList && row.applicationsList.length > 0 && row.applicationsList.forEach(item => {
      if (ele.id == item.appId) {
        ele.expireTime = item.expireTime
      }
    })
  });
  dialogVisible.value = true;
}

/**
 * 将选中的应用格式化成字符串显示  
*/
function onFormatAppList(data: any) {
  let strs = ""
  data && data.length > 0 && data.forEach(element => {
    strs += element.appName + '、';
  });
  strs = strs.substring(0, strs.length - 1);
  return strs
}
</script>

<style lang="scss">
.el-tree-node__content {
  height: 40px !important;
}
</style>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node {
  height: 40px !important;
}
.is-focusable {
  height: 40px !important;
}
@import "@/styles/modules/system/user.scss";
</style>
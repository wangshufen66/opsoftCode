<template>
  <div class="role-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-input
          type="text"
          placeholder="请输入员工姓名"
          v-model.trim="searchForm.nickName"
          clearable
          @keyup.enter="onSearch"
        ></el-input>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" @click="onAdd">新增员工</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_createTime="{ data }">
        <span>{{ formatTime(data.createTime) }}</span>
      </template>

      <!--通知范围  -->
      <!-- <template #col_roleNameList="{ data }">
        <el-tag type="success">{{ initroleList(data.roleNameList) }}</el-tag>
      </template>-->
      <template #col_roleName="{ data }">
        <el-tag v-if="data.roleName" type="success">{{ data.roleName }}</el-tag>
      </template>
      <template #col_auditStatus="{ data }">
        <el-tag v-show="data.auditStatus == 0" type="danger">未审核</el-tag>
        <el-tag v-show="data.auditStatus == 1" type="success">已审核</el-tag>
      </template>
      <template #col_disableStatus="{ data }">
        <el-tag v-show="data.disableStatus == 1" type="danger">已禁用</el-tag>
        <el-tag v-show="data.disableStatus == 0" type="success">未禁用</el-tag>
      </template>

      <template #operatColumn>
        <el-table-column label="操作" fixed="left" width="300">
          <template #default="scope">
            <el-button v-show="scope.row.auditStatus == 0" type="success" plain size="small" @click="onAudit(scope.row)">
              <span>审核</span>
            </el-button>
            <el-button v-show="scope.row.auditStatus == 1" type="success" plain size="small" disabled style="margin: 0;">
              <span >已审核</span>
            </el-button>
            <el-button type="danger" plain size="small" @click="onDisable(scope.row)">
              <span v-show="scope.row.disableStatus == 1" style="color: green;">启用</span>
              <span v-show="scope.row.disableStatus == 0" style="color: red;">禁用</span>
            </el-button>
            <el-button type="danger" plain size="small" @click="onDelete(scope.row)">删除</el-button>
            <el-button type="primary" plain size="small" @click="onEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog
      :title="formTitle"
      v-model="dialogVisible"
      @close="closeDialog"
      destroy-on-close
      style="width: 300px;"
    >
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item prop="nickName" label="姓名">
          <el-input placeholder="请输入姓名" v-model="dataForm.nickName"></el-input>
        </el-form-item>
        <el-form-item prop="userName" label="用户名">
          <el-input placeholder="请输入用户名" v-model="dataForm.userName"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="roleList">
          <el-select v-model="dataForm.roleList" placeholder="请选择角色" multiple style="width: 100%;">
            <el-option v-for="item in selectedList" :value="item.id" :label="item.roleName"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input placeholder="请输入密码" v-model="dataForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="dataForm.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号">
          <el-input placeholder="请输入手机号" v-model="dataForm.mobile"></el-input>
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
import tableColums from "@/config/tableConfig/staffManage";
import { ElMessage } from "element-plus";
import { confirmBox } from "@/utils/utils";
import dayjs from "dayjs";

import DialogTitle from "@/components/dialogTitle/index.vue";
import {
  getStaffList,
  addUsers,
  editUsers,
  delUsers,
  disableUser,
  antiDisableUser,
  auditUser,
  getRoleList
} from "@/api/system";
import _Row from "element-plus/lib/el-row";

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
//当前选中行的orgId
let orgIdName = ref(null);
const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
});

const roleList = ref<any>([]);
const selectedList = ref<any>([]);

// 获取数据
async function getDataRoleList() {
  const params = {
    ...pagination,
  };
  const res = await getRoleList(params);
  selectedList.value = res.data.records
  // if (res.code === 200) {
  //   for (let index = 0; index < res.data.records.length; index++) {
  //     const element = res.data.records[index];
  //     element.roleName = '';
  //     if (element.roleList && element.roleList.length > 0) {
  //       for (let i = 0; i < element.roleList.length; i++) {
  //         const ele = element.roleList[i];
  //         if (ele.roleName) {
  //           //定义行内元素实现分配角色指定样式显示
  //           element.roleName = ele.roleName
  //         }
  //       }
  //     }

  // }
}
getDataRoleList()
//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  orgId: "000",
  nickName: "",
  mobile: "",
  email: "",
  userName: '',
  password: "",
  roleId: "",
  roleName: '',
  roleList: [],
  roleNameList: [],//下拉角色名的回显
  id: '',
  userId: '',
  status: "",
  roleCode: ''
});
//添加和编辑表单的验证规则
const formRules = reactive({
  mobile: [
    { required: 'blur', message: "请输入电话号码" },
    {
      pattern: /^1[\d]{10}$/i,
      message: "输入的手机号码不正确",
      trigger: "blur",
    },
  ],
  roleList: [
    { required: true, message: "请选择角色名称", trigger: "blur" },
  ],
  nickName: [
    { required: true, message: "请输入姓名", trigger: "blur" },
  ],

  userName: [
    { required: true, message: "请输入用户名", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    {
      // pattern: /[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+/,
      pattern: /[a-zA-Z0-9]+@(opcloud\.cn||opsoft\.com\.cn)$/,
      message: "请输入以opcloud.cn或opsoft.com.cn结尾的邮箱",
      trigger: "blur",
    }
  ],
  // password: [
  //   { required: true, message: "请输入密码", trigger: "blur" },
  // ],
});

//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? "编辑员工" : "新增员工";
});

const imgloading = ref<boolean>(false);
//授权保存按钮loading
const authLoading = ref<boolean>(false);

//选中的roleid
const activeRole = ref<string | null>(null);
// 查询表单参数
const searchForm = reactive({
  nickName: "",
});
// 查询
function onSearch() {
  pagination.currentPage = 1;
  getDataList();
}
// 获取数据
async function getDataList() {
  tableOption.tableLoading = true;
  const params = {
    ...pagination,
    ...searchForm
  };
  const res = await getStaffList(params);
  const { code, data } = res;
  if (code === 200) {
    for (let index = 0; index < data.records.length; index++) {
      const element = data.records[index];
      element.roleName = '';
      if (element.roleNameList && element.roleNameList.length > 0) {
        element.roleName = element.roleNameList.join(',')
      }
    }

    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  tableOption.tableLoading = false;
}

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
//弹框关闭
function closeDialog() {
  dialogVisible.value = false;
  formRef.value.resetFields();
}

//新增角色
const onAdd = () => {
  isEdit.value = false;
  dialogVisible.value = true;
}

// 编辑角色
async function onEdit(row: any) {
  isEdit.value = true;
  nextTick(() => {
    dataForm.nickName = row.nickName;
    dataForm.orgId = row.orgId;
    dataForm.userName = row.userName;
    dataForm.mobile = row.mobile;
    dataForm.email = row.email;
    dataForm.password = row.password;
    dataForm.userId = row.userId;
    dataForm.id = row.id;
    dataForm.status = row.status;
    if (selectedList.value && selectedList.value.length > 0) {
      dataForm.roleList = row.roleList.map((item) => {
        return item.id
      })
    }
  })

  dialogVisible.value = true;
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid) => {
    //处理用户选择列表,定义一个空数组
    // dataForm.roleList = []
    let newArr = []
    for (let index = 0; index < dataForm.roleList.length; index++) {
      const element = dataForm.roleList[index];
      for (let i = 0; i < selectedList.value.length; i++) {
        const user = selectedList.value[i];
        if (element == user.id) {
          newArr.push(user)
        }
      }
    }
    dataForm.roleList = newArr
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      const res = await addUsers(dataForm);
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    } else {
      const res = await editUsers(dataForm);
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    }
    closeDialog()

  });
}

function onAudit(row) {
  if (!row.auditStatus) {
    //审核
    confirmBox("审核该用户", async () => {
      const res = await auditUser({ id: row.id });
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
      }
    });
  }
}

//禁用
function onDisable(row) {
  if (!row.disableStatus) {
    confirmBox("停用该配置", async () => {
      const res = await disableUser({ id: row.id });
      if (res.code === 200) {
        ElMessage.error(res.msg);
        getDataList();
      }
    });
  } else {
    //禁用
    confirmBox("解除该配置停用状态", async () => {
      const res = await antiDisableUser({ id: row.id });
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
      }
    });
  }
}


//删除
function onDelete(row) {
  confirmBox("删除该角色", async () => {
    const res = await delUsers({ id: row.id });
    if (res.code === 200) {
      ElMessage.success(res.msg);
      getDataList();
    }
  });
}

//处理角色分配显示数据
// function initroleList(obj) {
//   return obj.toString()
// }
//格式化时间
function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm')
}
getDataList();
</script>
<style lang="scss" scoped>
@import "@/styles/modules/system/staffManage.scss";
</style>
<template>
  <div class="role-list">
    <div class="search-wrap">
      <el-input
        type="text"
        placeholder="请输入角色名称"
        v-model.trim="searchForm.roleName"
        clearable
        @keyup.enter="onSearch"
      ></el-input>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" @click="onAdd">新增角色</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
      style="width: 100%;"
    >
      <template #col_disableStatus="{ data }">
        <el-tag v-show="data.disableStatus == 1" type="danger">已禁用</el-tag>
        <el-tag v-show="data.disableStatus == 0" type="success">未禁用</el-tag>
      </template>

      <template #col_createTime="{ data }">
        <span>{{ formatTime(data.createTime) }}</span>
      </template>

      <template #operatColumn style="width: 100%;">
        <el-table-column label="操作" fixed="left" width="280">
          <template #default="scope">
            <el-button type="primary" plain size="small" @click="onEdit(scope.row)">编辑</el-button>

            <el-button type="danger" plain size="small" @click="onDisable(scope.row)">
              <span v-show="scope.row.disableStatus == 1" style="color: green;">启用</span>
              <span v-show="scope.row.disableStatus == 0" style="color: red;">禁用</span>
            </el-button>
            <el-button type="primary" size="small" @click="getAuthorList(scope.row)">授权</el-button>
            <el-button type="danger" plain size="small" @click="onDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </table-extend>

    <el-dialog
      :title="formTitle"
      v-model="dialogVisible"
      @close="closeDialog"
      destroy-on-close
      width="600px"
    >
      <!-- @open="dialogOpen" -->
      <template v-slot:title>
        <DialogTitle :dialogTitle="formTitle"></DialogTitle>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <!-- <el-form-item label="企业名称" prop="orgName"  >
          <el-input :disabled="isEdit" v-model="dataForm.orgName" placeholder="请输入企业名称"></el-input>
        </el-form-item>-->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="dataForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="dataForm.roleCode" placeholder="请输入角色代码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>

    <el-dialog title="角色授权" @close="authClose" v-model="visible" destroy-on-close width="600px">
      <template #title>
        <span>角色授权</span>
      </template>
      <el-scrollbar height="60vh">
        <el-tree
          ref="menuTreeRef"
          :data="menuTab.menuData"
          show-checkbox
          node-key="id"
          current-node-key
          :props="menuTab.defaultProps"
          :default-expanded-keys="menuTab.selectData"
          :default-checked-keys="menuTab.selectData"
          v-loading.lock="menuLoading"
        ></el-tree>
      </el-scrollbar>
      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="authLoading" @click="updateAuthorList">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, nextTick } from "vue";
import { ElMessage } from "element-plus";
import tableColums from "@/config/tableConfig/sysRoleList";
import dayjs from "dayjs";
import { confirmBox, messageAlert } from "@/utils/utils";
import {
  getRoleList,
  addRole,
  editRole,
  delRole,
  getQueryByRoleId,
  updateRolePersissions,
  antiDisableUsers,
  disableUsers,

} from "@/api/system";
import _Row from "element-plus/lib/el-row";
import DialogTitle from '@/components/dialogTitle/index.vue';

// 查询表单参数
const searchForm = reactive({
  roleName: undefined,
});
//当前行得选中ID
let selectID = ref(null);
//当前行的角色名称
let selectRoleName = ref(null);
//当前行的角色code
let selectRoleCode = ref(null);
//当前行的orgid
let orgIdName = ref(null);
//判断是否为编辑
const isEdit = ref<boolean>(false);
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
//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  orgName: '',
  id: "",
  orgId: "000",
  roleCode: '',
  roleName: "",
  createTime: '',
  pid: '',
  roleId: '',
  persissionCode: '',
  permissionName: '',
  // roleId: "",
});
//菜单树
const menuTab = reactive({
  menuData: [
    {
      label: "客户列表",
      id: 1,
      pid: 0,
      permissionName: "客户列表",
      persissioncode: "CUSTOMER-LIST",
      children: [
        {
          label: '注册用户',
          id: 5,
          pid: 1,
          permissionName: "注册用户",
          persissioncode: "REGISETER-LIST",
        },
        {
          label: '成交列表',
          id: 6,
          pid: 1,
          permissionName: "成交列表",
          persissioncode: "RDEAL-LIST",
        },
        {
          label: '线索管理',
          id: 7,
          pid: 1,
          permissionName: "线索管理",
          persissioncode: "CLUE-LIST",
        },
        {
          label: '合同管理',
          id: 8,
          pid: 1,
          permissionName: "合同管理",
          persissioncode: "CONTARCT-LIST",

        },
      ],
    },
    {

      label: "综合功能",
      id: 2,
      pid: 0,
      permissionName: "综合功能",
      persissioncode: "COMPREHENSIVE-FUNCTION",

      children: [
        {
          id: 9,
          pid: 2,
          permissionName: "启动页管理",
          persissioncode: " STARPUP-PAGE",
          label: "启动页管理"
        },
        {
          id: 10,
          pid: 2,
          permissionName: "公告中心",
          persissioncode: "NEW-LIST",
          label: "公告中心"
        },
        {
          id: 11,
          pid: 2,
          permissionName: "知识库",
          persissioncode: "KNOWLEDGE-BASE",
          label: "知识库"
        },

      ],
    },

    {
      label: "账户中心",
      id: 3,
      pid: 0,
      permissionName: "账户中心",
      persissioncode: "ACCOUNT-CENTER",
      children: [
        {
          id: 12,
          pid: 3,
          permissionName: "角色管理",
          persissioncode: "ROLE-MANAGE",
          label: "角色管理"
        },
        {
          id: 13,
          pid: 3,
          permissionName: "员工管理",
          persissioncode: "STAFF-MANAGE",
          label: "员工管理"
        }, {
          id: 14,
          pid: 3,
          permissionName: "更新密码",
          persissioncode: "UPDATE-PWD",
          label: "更新密码"
        },
      ],
    },
    {
      label: "报表统计",
      id: 4,
      pid: 0,
      permissionName: "报表统计",
      persissioncode: "REPORT-LIST",

      children: [
        {
          id: 15,
          pid: 4,
          permissionName: "客户总量",
          persissioncode: "CUSTOMER-AMOUNT",
          label: "客户总量"
        },
        {
          id: 16,
          pid: 4,
          permissionName: "用户活跃度",
          persissioncode: "CUSTOMER-ACTIVITY",
          label: "用户活跃度"

        },
        {
          id: 17,
          pid: 4,
          permissionName: "合同金额",
          persissioncode: "CONTRACT-VALUE",
          label: "合同金额"
        },
      ],
    },

  ],

  defaultProps: {
    children: "children",
    label: "label",
  },
  selectData: [],
  rolePermissionList: [],
});

const pagination = reactive({
  currentPage: 1,
  pageSize: 15,
});

//添加和编辑表单的验证规则
const formRules = reactive({
  roleName: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
  roleCode: [{ required: true, message: "请输入角色代码", trigger: "blur" }]
});

//保存按钮的loading
const subLoading = ref<boolean>(false);
// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? "编辑角色" : "新增角色";
});


//菜单loading
const menuLoading = ref<boolean>(false);

//授权保存按钮loading
const authLoading = ref<boolean>(false);
const visible = ref<boolean>(false);
const menuTreeRef = ref<any>(null);


// 查询
function onSearch() {
  pagination.currentPage = 1;
  getDataList();
}
// 获取数据
async function getDataList() {
  tableOption.tableLoading = true;
  const params = {
    ...searchForm,
    ...pagination,
  };
  const res = await getRoleList(params);
  const { code, data } = res;
  if (code === 200) {
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



//新增角色
function onAdd() {
  isEdit.value = false;
  dialogVisible.value = true;

}
function closeDialog() {
  dialogVisible.value = false;
  formRef.value.resetFields()
}

// 编辑角色
async function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
  nextTick(() => {
    dataForm.id = row.id;
    dataForm.orgId = row.orgId;
    dataForm.orgName = row.orgName
    dataForm.roleCode = row.roleCode;
    dataForm.roleName = row.roleName;
    dataForm.roleId = row.roleId;
  })
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      const res = await addRole(dataForm);
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
        dialogVisible.value = false;
      }
      subLoading.value = false;
    } else {
      const res = await editRole(dataForm);
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


//禁用
function onDisable(row) {
  if (row.disableStatus) {
    //反禁用
    confirmBox("解除该角色禁用状态", async () => {
      const res = await antiDisableUsers({ id: row.id, roleCode: row.roleCode });
      if (res.code === 200) {
        ElMessage.success(res.msg);
        getDataList();
      }
    });
  } else {
    //禁用
    confirmBox("禁用该角色", async () => {
      const res = await disableUsers({ id: row.id, roleCode: row.roleCode });
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
    const res = await delRole({ ids: row.id });
    if (res.code === 200) {
      ElMessage.success(res.msg)
      getDataList();
    }
  });
}
//获取授权列表
async function getAuthorList(row?) {
  visible.value = true;
  selectID = row.id
  orgIdName = row.orgId;
  selectRoleCode = row.roleCode
  selectRoleName = row.roleName
  const res = await getQueryByRoleId({ roleId: selectID });
  if (res.code === 200) {
    //回显选中状态,seletData绑定返回的id
    menuTab.selectData = res.data.rolePermissionList.map((item) => {
      return item.permissionId
    });

  }
}
function authClose() {
  menuTab.selectData = [];
}
//更新授权列表
async function updateAuthorList(row) {
  visible.value = false;
  const permissionName: string[] = []
  const rolePermissionList = menuTreeRef.value.getCheckedNodes();

  rolePermissionList.forEach((item) => {
    permissionName.push(item);
  });


  const params = {
    orgId: orgIdName,
    roleName: selectRoleName,
    roleCode: selectRoleCode,
    roleId: selectID,
    rolePermissionList: permissionName
  }

  const res = await updateRolePersissions(params);
  if (res.code == 200) {
    ElMessage.success("角色授权成功")
    getDataList();
  }
}

//格式化时间
function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm')
}
getDataList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/role.scss";
</style>

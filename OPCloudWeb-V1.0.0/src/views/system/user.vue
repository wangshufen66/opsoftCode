<template>
  <div class="user-list">
    <div class="search-wrap">
      <div class="form-wrap">
        <el-form mode="topForm" :inline="true" @submit.prevent>
          <el-form-item label="用户姓名">
            <el-input
              type="text"
              placeholder="请输入用户姓名"
              v-model.trim="searchForm.userName"
              clearable
              @clear="onSearch(searchForm.userName)"
              @keyup.enter="onSearch"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="button-wrap">
        <el-button class="btn-search" type="primary" plain @click="onSearch">查询</el-button>
        <el-button class="btn-add" type="primary" plain @click="onAdd">新增用户</el-button>
      </div>
    </div>
    <table-extend
      v-bind="tableOption"
      @pageSizeChange="pageSizeChange"
      @currentChange="currentChange"
    >
      <template #col_auditStatus="{ data }">
        <!-- {{ data.auditStatus ? '已审核' : '未审核' }} -->
        <el-tag
          :type="data.auditStatus ? 'success' : 'error'"
        >{{ data.auditStatus ? '已审核' : '未审核' }}</el-tag>
      </template>
      <template #col_disableStatus="{ data }">
        <el-tag
          :type="data.disableStatus ? 'error' : 'success'"
        >{{ data.disableStatus ? '已禁用' : '未禁用' }}</el-tag>
      </template>
      <!-- 角色列表 -->
      <template #col_roleName="{ data }">
        <el-tag type="success">{{ data.roleName }}</el-tag>
      </template>
      <template #col_auditTime="{ data }">
        <!-- {{ data.auditStatus ? '已审核' : '未审核' }} -->
        {{ formatTime(data.auditTime) }}
      </template>
      <template #operatColumn>
        <el-table-column label="操作" fixed="right" min-width="280">
          <template #default="scope">
            <text-button
              :disabled="scope.row.auditStatus === 1"
              :type="scope.row.auditStatus ? 'error' : 'success'"
              @click="onVerify(scope.row)"
            >{{ scope.row.auditStatus ? '已审核' : '待审核' }}</text-button>

            <text-button
              :type="!scope.row.disableStatus ? 'error' : 'success'"
              @click="onDisable(scope.row)"
            >{{ scope.row.disableStatus ? '禁用' : '启用' }}</text-button>
            <text-button @click="onDelete(scope.row.userId)">删除</text-button>
            <!-- --------操作组 -->
            <el-dropdown style="margin-left: 10px">
              <span class="el-dropdown-link">
                <el-button type="text">操作</el-button>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item icon="el-icon-plus" @click="onEditUser(scope.row)">
                    <el-button type="text" size="small">角色分配</el-button>
                  </el-dropdown-item>
                  <el-dropdown-item icon="el-icon-plus" @click="onEdit(scope.row)">
                    <el-button type="text" size="small">编辑</el-button>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-button type="text" size="small" @click="onEdit(scope.row)">编辑</el-button> -->
          </template>
        </el-table-column>
      </template>
    </table-extend>
    <!-- 角色分配穿梭框-->
    <el-dialog v-model="dialogVisibleRole" width="680px">
      <template v-slot:title>
        <dialog-title title="角色分配"></dialog-title>
      </template>
      <el-transfer
        :data="roleData.allList"
        :titles="['可选角色', '已选角色']"
        v-model="roleData.selectList"
        @change="handleRoleMenuChange"
      ></el-transfer>

      <div slot="footer" class="diaFooter">
        <el-button @click="dialogVisibleRole = false" style="margin-right: 20px" size="medium">取消</el-button>
        <el-button type="primary" @click="confirmTo" size="medium">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="dialogVisible" destroy-on-close>
      <template v-slot:title>
        <dialog-title :title="formTitle"></dialog-title>
      </template>
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
        <el-form-item label="企业名称" prop="orgId">
          <el-select
            v-model="dataForm.orgId"
            placeholder="请选择企业名称"
            style="width: 100%"
            @change="orgChange"
            :disabled="isEdit"
          >
            <el-option
              v-for="item in orgList"
              :key="item.orgId"
              :value="item.orgId"
              :label="item.orgName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="dataForm.roleId" placeholder="请选择角色" multiple style="width: 100%">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :value="item.roleId"
              :label="item.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="角色" prop="roleName">
          <el-select v-model="dataForm.roleName" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roleList" :key="item.roleName" :value="item.roleName" :label="item.roleName"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model.trim="dataForm.userName"
            :disabled="isEdit"
            placeholder="请输入用户名"
            maxlength="20"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="nickName">
          <el-input
            v-model.trim="dataForm.nickName"
            placeholder="请输入别名"
            maxlength="20"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model.trim="dataForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import tableColums from '@/config/tableConfig/sysUserList';
import dayjs from 'dayjs';
import { confirmBox, messageAlert } from '@/utils/utils';
import {
  getUserList,
  saveUser,
  editUser,
  delUser,
  antiAuditUser,
  antiDisableUser,
  auditUser,
  disableUser,
  getOrgSelect,
  getRoleSelect,
  findSelectableRoleList,
  findSelectedRoleList,
  saveRoleUsers,
} from '@/api/system';

//保存按钮的loading
const subLoading = ref<boolean>(false);

// 是否显示弹框
const dialogVisible = ref<boolean>(false);

//是否显示伸缩框
const dialogVisibleRole = ref<boolean>(false);

// 是否伸缩框
const bindOrgAuthority = ref<boolean>(false);

//判断是否为编辑
const isEdit = ref<boolean>(false);
// 查询表单参数
const searchForm = reactive({
  userName: undefined,
});

//企业名称下拉
const orgList = ref([]);
//角色下拉
const roleList = ref<any>([]);
const roleData = reactive({
  allList: [] as any,
  selectList: [] as any,
  // roleList:[] as any,
});
//dialogRef
const formRef = ref<any>(null);
//列表配置项
const tableOption = reactive({
  tableData: [],
  roleNameList: [], //获取角色列表
  tableColums,
  selectionCol: false,
  paging: true,
  total: 0,
  tableLoading: false,
  noTableRight: false,
});
//分页
const pagination = reactive({
  current: 1,
  size: 15,
});

const editUserId = ref<string | null>(null);
//添加和编辑的表单
const dataForm = reactive({
  orgId: '',
  roleId: [],
  userName: '',
  nickName: '',
  mobile: '',
  userId: '',
  roleIdList: [],
  roleName: '', //角色名称
});

//用户名验证规则
const validateKey = (rule, value, callback) => {
  let idReg = /^[A-Za-z0-9]+$/;
  if (!idReg.test(value)) {
    callback(new Error('只能输入数字、字母'));
  }
  callback();
};
//添加和编辑表单的验证规则
const formRules = reactive({
  orgId: [{ required: true, message: '请选择企业名称', trigger: 'blur' }],
  // roleId: [
  //   { required: true, message: '请选择角色', trigger: ['blur', 'change'] },
  // ],
  userName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { validator: validateKey, trigger: 'blur' },
  ],
  nickName: [{ required: true, message: '请输入别名', trigger: 'blur' }],
  mobile: [{ message: '请输入手机号', trigger: 'blur' }],
});
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑用户' : '新增用户';
});

//格式化时间
function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm:ss');
}

// 查询
function onSearch() {
  pagination.current = 1;
  getDataList();
}

const style = computed(() => {
  return {};
});

// 获取数据
async function getDataList() {
  tableOption.tableLoading = true;
  const params = {
    ...searchForm,
    ...pagination,
  };
  //穿梭框实现角色的分配
  const res = await getUserList(params);
  const { code, data } = res;
  if (code === 200) {
    for (let index = 0; index < data.records.length; index++) {
      const element = data.records[index];
      element.roleName = '';
      if (element.roleList && element.roleList.length > 0) {
        for (let i = 0; i < element.roleList.length; i++) {
          const ele = element.roleList[i];
          if (ele.roleName) {
            //定义行内元素实现分配角色指定样式显示
            element.roleName = ele.roleName
          }
        }
      }
    }
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
  getRoleList();
  tableOption.tableLoading = false;
}
//切换企业
function orgChange() {
  dataForm.roleId = [];
  getRoleList();
}

//企业下拉列表
async function getOrgList() {
  const res = await getOrgSelect({ disableStatus: 0 });
  orgList.value = res.data;
}
//角色下拉
async function getRoleList() {
  const res = await getRoleSelect({ orgId: dataForm.orgId });
  if (res.code === 200) {
    roleList.value = res.data;
  }
}

//角色可选列表
const findSelectable = (val1, val2) => {
  let leftList = [];
  let rightList = [];
  let para = {
    orgId: val1,
    userId: val2,
  };
  //涉及到同步异步的问题
  Promise.all([
    findSelectableRoleList(para),
    //角色已选择列表
    findSelectedRoleList(para),
  ]).then((res: any[]) => {
    leftList = (res[0] && res[0].data) || [];
    rightList = (res[1] && res[1].data) || [];
    roleData.allList = [...leftList[0].roleList, ...rightList].map((m: any) => {
      return {
        key: m.roleId,
        label: m.roleName,
      };
    });
    if (rightList && rightList.length > 0) {
      roleData.selectList = rightList.map((item: any) => {
        return item.roleId;
      });
    }
  });
};

//确定按钮
function confirmTo() {
  let newroleList = [];

  for (let i = 0; i < roleData.selectList.length; i++) {
    const element = roleData.selectList[i];
    newroleList.push({
      roleId: element,
    });
  }
  let para = {
    orgId: dataForm.orgId,
    userId: dataForm.userId,
    roles: newroleList,
  };
  saveRoleUsers(para).then((res) => {
    if (res.code == 200) {
      dialogVisibleRole.value = false;
      getDataList();
    }
  });
}

// 表格pagesize
function pageSizeChange(options): void {
  const { pageSize } = options;
  pagination.size = pageSize as number;
  getDataList();
}
// 表格页码切换
function currentChange(options): void {
  const { pageIndex } = options;
  pagination.current = pageIndex as number;
  getDataList();
}
//右侧列表元素变化时触发
function handleRoleMenuChange(newTargetKeys, direction, moveKeys) {
  roleData.selectList = newTargetKeys;
}

//点击新增用户
function onAdd() {
  isEdit.value = false;
  dialogVisible.value = true;
  dataForm.orgId = '';
  dataForm.roleId = [];
  dataForm.userName = '';
  dataForm.nickName = '';
  dataForm.mobile = '';
}

//穿梭框
async function onEditUser(row: any) {
  dialogVisibleRole.value = true;
  dataForm.orgId = row.orgId;
  dataForm.userId = row.userId;

  isEdit.value = true;
  bindOrgAuthority.value = true;
  findSelectable(row.orgId, row.userId);
}
// 编辑
async function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.orgId = row.orgId;
  dataForm.roleId = row.roleId?.split(',');
  dataForm.userName = row.userName;
  dataForm.nickName = row.nickName;
  dataForm.mobile = row.mobile;
  editUserId.value = row.userId;
  getRoleList();
}

//审核
async function onVerify(row) {
  if (row.auditStatus) {
    //反审核
    confirmBox('去除该角色审核状态', async () => {
      const res = await antiAuditUser({ userId: row.userId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  } else {
    //审核
    confirmBox('审核该角色', async () => {
      const res = await auditUser({ userId: row.userId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  }
}

//禁用
function onDisable(row) {
  if (row.disableStatus) {
    //反禁用
    confirmBox('解除该角色禁用状态', async () => {
      const res = await antiDisableUser({ userId: row.userId });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  } else {
    //禁用
    confirmBox('禁用该角色', async () => {
      const res = await disableUser({ userId: row.userId });
      if (res.code === 200) {
        messageAlert('error', res.msg)
        getDataList();
      }
    });
  }
}

//删除
function onDelete(ids) {
  confirmBox('删除该用户', async () => {
    const res = await delUser({ ids });
    if (res.code === 200) {
      messageAlert('success', res.msg)
      getDataList();
    }
  });
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return;
    subLoading.value = true;

    let { roleId, roleIdList, ...params } = dataForm;
    let newroleIdList = roleId.map((item) => ({
      roleId: item,
    }));

    let reqParams = {
      ...params,
      userId: editUserId.value,
      roleId: dataForm.roleId.toString(),
      roleIdList: newroleIdList,
    };

    if (!isEdit.value) {
      const res = await saveUser(reqParams);
      subLoading.value = false;
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
        dialogVisible.value = false;
      }
    } else {
      const res = await editUser(reqParams);
      subLoading.value = false;
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
        dialogVisible.value = false;
      }
    }
  });
}

getDataList();
getOrgList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/user.scss";
.diaFooter {
  // display: flex;
  width: 200px;
  margin-left: 420px;
  margin-top: 20px;
}
</style>
<style>
.role-style {
  height: 35px;
  color: #67c23a;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  padding: 0 8px;
  margin: 5px;
  background-color: #f0f9eb;
  border-color: #e1f3d8;
  display: inline-block;
}
</style>

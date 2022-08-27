<template>
  <div class="page-content">
    <div class="page-left">
      <div class="search-wrap">
        <el-input type="text" placeholder="请输入企业名称" v-model.trim="org.filterText" clearable></el-input>
      </div>
      <div class="filter-tree">
        <el-tree
          :data="org.orgData"
          :props="org.defaultProps"
          :filter-node-method="filterNode"
          @node-click="onNodeClick"
          @node-drop="handleDrop"
          draggable
          node-key="id"
          ref="treeRef"
          default-expand-all
          :current-node-key="active.id"
        ></el-tree>
      </div>
    </div>
    <div class="page-right">
      <div class="search-wrap">
        <div class="form-wrap"></div>
        <div class="button-wrap">
          <el-button class="btn-add" type="primary" @click="onAdd()">新增租户</el-button>
        </div>
      </div>
      <table-extend
        v-bind="tableOption"
        @pageSizeChange="pageSizeChange"
        @currentChange="currentChange"
      >
        <template #col_audictStatus="{ data }">
          <!-- {{ data.auditStatus ? '已审核' : '待审核' }} -->
          <el-tag v-show="data.auditStatus" type="success">已审核</el-tag>
          <el-tag v-show="!data.auditStatus" type="danger">待审核</el-tag>
        </template>
        <template #col_disableStatus="{ data }">
          <!-- {{ data.disableStatus ? '已禁用' : '未禁用' }} -->
          <el-tag v-show="data.disableStatus" type="danger">已禁用</el-tag>
          <el-tag v-show="!data.disableStatus" type="success">未禁用</el-tag>
        </template>
        <template #col_auditTime="{ data }">{{ formatTime(data.auditTime) }}</template>
        <template #operatColumn>
          <el-table-column label="操作" fixed="right" min-width="280">
            <template #default="scope">
              <el-button
                type="text"
                size="small"
                @click="onEdit(scope.row)"
                :disabled="scope.row.id == '000'"
                :style="scope.row.orgId === '000' ? 'color: red' : ''"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.auditStatus === 1"
                @click="onVerify(scope.row)"
              >
                <span v-show="scope.row.auditStatus" style="color: red">已审核</span>
                <span v-show="!scope.row.auditStatus" style="color: green">待审核</span>
              </el-button>
              <el-button
                type="text"
                size="small"
                :disabled="scope.row.orgId == '000'"
                @click="onDisable(scope.row)"
              >
                <span v-show="scope.row.disableStatus" style="color: green">启用</span>
                <span v-show="!scope.row.disableStatus" style="color: red">禁用</span>
              </el-button>
            </template>
          </el-table-column>
        </template>
      </table-extend>

      <el-dialog v-model="dialogVisible" @open="getOrgList" @close="dialogClosed" destroy-on-close>
        <template v-slot:title>
          <dialog-title :title="formTitle"></dialog-title>
        </template>
        <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="120px">
          <el-form-item label="企业名称" prop="orgName">
            <el-input
              v-model="dataForm.orgName"
              placeholder="请输入企业名称"
              maxlength="30"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="企业代码" prop="orgId">
            <el-input
              v-model="dataForm.orgId"
              placeholder="请输入企业代码"
              :disabled="isEdit"
              maxlength="32"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="所属企业" prop="parentOrgName" v-if="!isEdit">
            <el-select
              v-model="dataForm.parentOrgName"
              placeholder="请选择所属企业"
              style="width: 100%"
              clearable
              :disabled="!isEdit"
            >
              <el-option
                v-for="(item, index) in orgList"
                :key="item.index"
                :value="item.orgId"
                :label="item.orgName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="企业联系人" prop="contactName">
            <el-input
              v-model="dataForm.contactName"
              placeholder="请输入企业联系人"
              maxlength="50"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人手机号" prop="contactPhone">
            <el-input v-model="dataForm.contactPhone" placeholder="请输入手机号" maxlength="11" clearable></el-input>
          </el-form-item>
          <el-form-item label="是否付费账号" prop="isPaying">
            <el-select
              v-model="dataForm.isPaying"
              placeholder="请选择是否付费"
              style="width: 100%"
              clearable
            >
              <el-option value="1" label="是"></el-option>
              <el-option value="0" label="否"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号信息" prop="bankAccount">
            <el-input
              type="textarea"
              v-model="dataForm.bankAccount"
              placeholder="请输入账号信息"
              maxlength="60"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="dataForm.remark"
              placeholder="请输入备注"
              maxlength="60"
              show-word-limit
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="subLoading" @click="onSubmitForm">保 存</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue';
import tableColums from '@/config/tableConfig/sysTenantList';
import dayjs from 'dayjs';
import { confirmBox, messageAlert } from '@/utils/utils';
import {
  getOrgTree,
  addTenant,
  editTenant,
  disableTenant,
  antiDisableTenent,
  auditTenant,
  antiAuditTenant,
  getOrgSelect,
  getOrgListByIdWithPage,
  getmodifyOrgParentAndLevel,
} from '@/api/system';

// 查询表单参数
const searchForm = reactive({
  orgName: undefined,
});
const org = reactive({
  filterText: '',
  orgData: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  },
  // selectData: [],
});

// const getExpand = () => {
//   org.orgData.forEach((item) => {
//     org.selectData.push(item.id);
//   });
// };

watch(
  () => org.filterText,
  (val) => {
    treeRef.value.filter(val);
  }
);
const treeRef = ref<any>(null);

//列表配置项
// const tableloading = ref<boolean>(false);
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
  current: 1,
  size: 15,
});
//选中的菜单id
const active = reactive({
  id: '',
  isLeaf: false,
});

//添加和编辑的表单
const dataForm = reactive({
  orgName: '',
  orgId: '',
  id: '',
  parentOrgId: '',
  contactName: '',
  contactPhone: '',
  isPaying: '',
  bankAccount: '',
  remark: '',
  auditStatus: 0,
  disableStatus: 0,
  parentOrgName: '',
});
const formRef = ref<any>(null);
const subLoading = ref<boolean>(false);

// 是否显示弹框
const dialogVisible = ref<boolean>(false);
//判断是否为编辑
const isEdit = ref<boolean>(false);
//弹出框的标题
const formTitle = computed(() => {
  return isEdit.value ? '编辑租户' : '新增租户';
});

//所属企业下拉
const orgList = ref<any>([]);

//筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
//节点点击
async function onNodeClick(row) {
  const res = await getOrgListByIdWithPage({ ...pagination, orgId: row.id });
  if (res.code === 200) {
    tableOption.tableData = res.data.records;
    // tableOption.total = res.data.total;
    tableOption.total = res.data.total;
  }
  //想要返回orgId
  active.id = row.data.orgId;

  if (row) {
    active.isLeaf = true;
  }
  const { data } = row;
  dataForm.parentOrgName = data.orgName;
  dataForm.parentOrgId = data.id;
}

//添加和编辑表单的验证规则
const formRules = reactive({
  orgName: [
    { required: true, message: '请选择企业名称', trigger: 'blur' },
    { min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' },
  ],
  orgId: [
    { required: true, message: '请输入企业代码', trigger: 'blur' },
    { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' },
  ],
  contactName: [
    { min: 0, max: 50, message: '长度在 0 到 50 个字符', trigger: 'blur' },
  ],
  contactPhone: [
    { min: 0, max: 11, message: '长度在 0 到 11 个字符', trigger: 'blur' },
  ],
  bankAccount: [
    { min: 0, max: 60, message: '长度在 0 到 60 个字符', trigger: 'blur' },
  ],
  isPaying: [{ required: true, message: '请选择是否付费', trigger: 'blur' }],
});

// 查询
function onSearch() {
  pagination.current = 1;
}

//获取组织树
async function orgTree() {
  const res = await getOrgTree();
  if (res.code === 200) {
    org.orgData = res.data;
    // getExpand();
    // menu.selectData.push(res.data[0].id);
    if (org.orgData.length >= 0) {
      active.id = org.orgData[0].id;
      getDataList();
    }
  }
}

async function handleDrop(draggingNode, dropNode, dropType, ev) {
  let para = {
    source: draggingNode.data.id,
    sourceId: draggingNode.data.data.id,
    targetId: dropNode.data.data.id,
    target: dropNode.data.id,
  };
  // if (dropType === 'inner')
  //   para = {
  //     source: draggingNode.data.id,
  //     sourceId: draggingNode.data.data.id,
  //     target: dropNode.data.id,
  //     targetId: dropNode.data.data.id,
  //   };
  // else
  //   para = {
  //     source: draggingNode.data.id,
  //     sourceId: draggingNode.data.data.id,
  //     target: dropNode.parent.data.length > 1 ? -1 : dropNode.parent.data.id,
  //     targetId: dropNode.data.data.length > 1 ? -1 : dropNode.parent.data.id,
  //   };

  const res = await getmodifyOrgParentAndLevel(para);
  if (res.code === 200) {
    getDataList();
    messageAlert('success', '移动成功')
    org.orgData = res.data.data;
  }
  orgTree();
  // getExpand();
}
//获取所属企业下拉
async function getOrgList() {
  const res = await getOrgSelect({
    disableStatus: 0,
    excludeSelf: dataForm.orgId,
  });
  if (res.code === 200) {
    orgList.value = res.data;
  }
}

//获取列表数据
async function getDataList() {
  tableOption.tableLoading = true;
  const res = await getOrgListByIdWithPage({
    ...pagination,
    orgId: active.id,
  });
  tableOption.tableLoading = false;

  if (res.code === 200) {
    let { data } = res;
    tableOption.tableData = data.records;
    tableOption.total = data.total;
  }
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
//新增用户
function onAdd() {
  console.log(active.isLeaf);
  if (!active.isLeaf) {
    dialogVisible.value = false;
    messageAlert('error', '请选择组织')
  } else {
    isEdit.value = false;
    dialogVisible.value = true;
  }
}

// 编辑
async function onEdit(row: any) {
  isEdit.value = true;
  dialogVisible.value = true;
  dataForm.orgName = row.orgName;
  dataForm.orgId = row.orgId;
  dataForm.id = row.id;
  dataForm.parentOrgId = row.parentOrgId;
  dataForm.contactName = row.contactName;
  dataForm.contactPhone = row.contactPhone;
  dataForm.isPaying = row.isPaying;
  dataForm.bankAccount = row.bankAccount;
  dataForm.remark = row.remark;
  dataForm.auditStatus = row.auditStatus;
  dataForm.disableStatus = row.disableStatus;
}

//审核
async function onVerify(row) {
  if (row.auditStatus) {
    //反审核
    confirmBox('去除该租户审核状态', async () => {
      const res = await antiAuditTenant({ id: row.id });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  } else {
    //审核
    confirmBox('启用该租户', async () => {
      const res = await auditTenant({ id: row.id });
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
    confirmBox('解除该租户禁用状态', async () => {
      const res = await antiDisableTenent({ id: row.id });
      if (res.code === 200) {
        messageAlert('success', res.msg)
        getDataList();
      }
    });
  } else {
    //禁用
    confirmBox('禁用该租户', async () => {
      const res = await disableTenant({ id: row.id });
      if (res.code === 200) {
        messageAlert('error', res.msg)
        getDataList();
      }
    });
  }
}

//提交编辑或添加表单
function onSubmitForm() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    subLoading.value = true;
    if (!isEdit.value) {
      try {
        const res = await addTenant(dataForm);
        // dataForm.orgId = active.id;
        subLoading.value = false;
        if (res.code === 200) {
          messageAlert('success', res.msg)
          getDataList();
          orgTree();
          dialogVisible.value = false;
        }
      } catch (error) {
        subLoading.value = false;
      }
    } else {
      try {
        const res = await editTenant(dataForm);
        dataForm.orgId = active.id;

        subLoading.value = false;
        if (res.code === 200) {
          orgTree();
          messageAlert('success', res.msg)
          dialogVisible.value = false;
        }
      } catch (error) {
        subLoading.value = false;
      }
    }
  });
}
//弹框关闭
function dialogClosed() {
  formRef.value.clearValidate();
  dataForm.orgName = '';
  dataForm.orgId = '';
  dataForm.id = '';
  dataForm.parentOrgId = '';
  dataForm.contactName = '';
  dataForm.contactPhone = '';
  dataForm.isPaying = '';
  dataForm.bankAccount = '';
  dataForm.remark = '';
  // dataForm.disableStatus = '';
}

//格式化时间
function formatTime(str) {
  if (!str) return '';
  return dayjs(str).format('YYYY-MM-DD HH:mm:ss');
}
orgTree();
// getDataList();
</script>

<style lang="scss" scoped>
.search-wrap {
  flex-direction: row;
}
@import "@/styles/modules/system/container.scss";
</style>

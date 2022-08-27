<template>
  <div class="page-content">
    <div class="page-left">
      <div class="search-wrap">
        <el-input placeholder="输入关键字进行过滤" v-model.trim="menu.filterText"></el-input>
        <el-col :span="4">
          <el-button type="primary" plain @click="onAdd">新 增</el-button>
        </el-col>
      </div>
      <div class="filter-tree">
        <el-tree
          v-loading.lock="menuLoading"
          :data="menu.menuData"
          :props="menu.defaultProps"
          :filter-node-method="filterNode"
          @node-click="onNodeClick"
          node-key="id"
          ref="treeRef"
        ></el-tree>
      </div>
    </div>
    <div class="page-right">
      <el-form :model="dataForm" ref="formRef" :rules="formRules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="dataForm.menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="上级菜单" prop="parentMenuName">
              <el-input v-model="dataForm.parentMenuName" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单URL" prop="menuUrl">
              <el-input v-model="dataForm.menuUrl" placeholder="请输入菜单URL"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="授权" prop="menuPermissions">
              <el-input v-model="dataForm.menuPermissions" placeholder="请输入授权"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="组件" prop="component">
              <el-input v-model="dataForm.component" placeholder="请输入组件"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重定向" prop="redirect">
              <el-input v-model="dataForm.redirect" placeholder="请输入重定向地址"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否路由" prop="isRoute">
              <el-select
                v-model="dataForm.isRoute"
                clearable
                placeholder="请选择是否路由"
                style="width: 100%"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="路由名称" prop="routeName">
              <el-input v-model="dataForm.routeName" placeholder="请输入路由名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否隐藏" prop="hidden">
              <el-select
                v-model="dataForm.hidden"
                clearable
                placeholder="请选择是否路由"
                style="width: 100%"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否缓存" prop="isCache">
              <el-select
                v-model="dataForm.isCache"
                clearable
                placeholder="请选择是否缓存"
                style="width: 100%"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否常驻菜单" prop="affix">
              <el-select
                v-model="dataForm.affix"
                clearable
                placeholder="请选择是否常驻菜单"
                style="width: 100%"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否叶子" prop="isLeaf">
              <el-select
                v-model="dataForm.isLeaf"
                clearable
                style="width: 100%"
                placeholder="请选择是否叶子"
                disabled
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
              <!-- <el-input v-model="dataForm.isLeaf" disabled></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="排序值" prop="sortNo">
              <el-input v-model="dataForm.sortNo" placeholder="请输入排序值"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="menuIcon">
              <el-input v-model="dataForm.menuIcon" placeholder="请输入菜单图标"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4" :offset="10">
            <el-button type="primary" :loading="saveLoading" @click="onSave">保 存</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="danger" @click="onDelete">删 除</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getMneuTree,
  delMneuTree,
  editMneuTree,
  addMneuTree,
} from '@/api/system';
import { confirmBox, closeRemind } from '@/utils/utils';
const menu = reactive({
  filterText: '',
  menuData: [],
  defaultProps: {
    children: 'children',
    label: 'label',
  },
  // selectData: [],
});

watch(
  () => menu.filterText,
  (val) => {
    treeRef.value.filter(val);
    resetForm();
    dataForm.parentMenuName = '';
  }
);

const menuLoading = ref<boolean>(false);

const treeRef = ref<any>(null);

//表单ref
const formRef = ref<any>(null);
//添加和编辑的表单
const dataForm = reactive({
  menuId: '', //菜单ID
  parentMenuName: '', //上级菜单
  menuName: '', //菜单名称
  menuIcon: '', //菜单图标
  menuUrl: '', //菜单url
  menuPermissions: '', //授权
  component: '', //组件
  redirect: '', //重定向
  isRoute: '', //是否路由
  routeName: '', //路由名称
  hidden: '', //是否隐藏
  isCache: '', //是否缓存
  affix: '', //是否常驻菜单
  isLeaf: '', //是否叶子
  sortNo: '', //排序号
  parentMenuId: '', //父类菜单id
  orgId: '',
});

//添加和编辑表单的验证规则
const formRules = reactive({
  menuId: [{ required: true, message: '请输入菜单ID', trigger: 'blur' }],
  menuName: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
  menuUrl: [{ required: false, message: '请输入菜单URL', trigger: 'blur' }],
  sortNo: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    {
      pattern: /^\d+$/,
      message: '只能输入数字',
      trigger: 'blur',
    },
  ],
});
//是否为新增
const isAdd = ref<boolean>(false);
//是否第一次点击保存
const isFirst = ref<boolean>(true);
//保存的loading
const saveLoading = ref<boolean>(false);

//获取菜单树
async function menuTree() {
  menuLoading.value = true;
  const res = await getMneuTree();
  menuLoading.value = false;
  menu.filterText = '';
  if (res.code === 200) {
    menu.menuData = res.data;
    // menu.selectData.push(res.data[0].id);
  }
}

//筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
}
//节点点击
function onNodeClick(row) {
  // if (row.parentId) {
  //   const node = treeRef.value.getCurrentNode();
  //   const flag = menu.selectData.findIndex((item) => item === row.parentId) === -1;
  //   if (flag) {
  //     menu.selectData.push(node.id);
  //   }
  // }
  isAdd.value = false;
  isFirst.value = false;
  const { data } = row;
  dataForm.menuId = data.menuId; //菜单ID
  dataForm.parentMenuName = data.parentMenuName; //上级菜单
  dataForm.menuName = data.menuName; //菜单名称
  dataForm.menuIcon = data.menuIcon; //菜单图标
  dataForm.menuUrl = data.menuUrl; //菜单url
  dataForm.menuPermissions = data.menuPermissions; //授权
  dataForm.component = data.component; //组件
  dataForm.redirect = data.redirect; //重定向
  dataForm.isRoute = data.isRoute; //是否路由
  dataForm.routeName = data.routeName; //路由名称
  dataForm.hidden = data.hidden; //是否隐藏
  dataForm.isCache = data.isCache; //是否缓存
  dataForm.affix = data.affix; //是否常驻菜单
  dataForm.isLeaf = data.isLeaf; //是否叶子
  dataForm.sortNo = data.sortNo; //排序号
  dataForm.parentMenuId = data.parentMenuId; //父类菜单id
}

//保存
function onSave() {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    saveLoading.value = true;
    if (isAdd.value || isFirst.value) {
      const res = await addMneuTree(dataForm);
      saveLoading.value = false;
      if (res.code === 200) {
        ElMessage.success(res.msg);
        menuTree();
        resetForm();
        dataForm.parentMenuName = '';
      }
    } else {
      const res = await editMneuTree(dataForm);
      saveLoading.value = false;
      if (res.code === 200) {
        ElMessage.success(res.msg);
        menuTree();
        resetForm();
        dataForm.parentMenuName = '';
      }
    }
  });
}

//删除
function onDelete() {
  if (!dataForm.menuId) {
    ElMessage.warning('清先选择需要删除的菜单');
    return;
  }
  confirmBox('删除该菜单', async () => {
    const res = await delMneuTree({ id: dataForm.menuId });
    if (res.code === 200) {
      ElMessage.success(res.msg);
      menuTree();
      resetForm();
      dataForm.parentMenuName = '';
    }
  });
}

//新增
function onAdd() {
  resetForm();
  isAdd.value = true;
  isFirst.value = false;
}

function resetForm() {
  dataForm.parentMenuId = dataForm.menuId;
  dataForm.menuId = '';
  dataForm.parentMenuName = dataForm.menuName;
  dataForm.menuName = '';
  dataForm.menuIcon = '';
  dataForm.menuUrl = '';
  dataForm.menuPermissions = '';
  dataForm.component = '';
  dataForm.redirect = '';
  dataForm.isRoute = '';
  dataForm.routeName = '';
  dataForm.hidden = '';
  dataForm.isCache = '';
  dataForm.affix = '';
  dataForm.isLeaf = '';
  dataForm.sortNo = '';
}

menuTree();
onMounted(() => {
  closeRemind();
});
onUnmounted(() => {
  window.onbeforeunload = null;
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/container.scss";
</style>

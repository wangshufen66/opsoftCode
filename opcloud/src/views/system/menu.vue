<template>
  <div class="page-content">
    <div class="page-left">
      <div class="search-wrap">
        <el-col :span="16">
          <el-input placeholder="输入关键字进行过滤" v-model.trim="menu.filterText"></el-input>
        </el-col>
        <el-col :span="4" :offset="1">
          <el-button type="primary" plain @click="onAdd">新 增</el-button>
        </el-col>
      </div>
      <div class="filter-tree">
        <el-tree
          ref="treeRef"
          v-loading.lock="menuLoading"
          :data="menu.menuData"
          node-key="id"
          :highlight-current="true"
          :expand-on-click-node="false"
          :default-expanded-keys="expandedNode"
          :filter-node-method="filterNode"
          @node-click="onNodeClick"
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
            <el-form-item label="标准菜单" prop="affix">
              <el-select
                v-model="dataForm.affix"
                clearable
                style="width: 100%"
                placeholder="请选择是否标准菜单"
                :disabled="affixDisabled"
              >
                <el-option label="是" value="1"></el-option>
                <el-option label="否" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单类型" prop="menuFrom">
              <el-select
                v-model="dataForm.menuFrom"
                clearable
                style="width: 100%"
                placeholder="请选择菜单类型"
                :disabled="menuFromDisabled"
              >
                <el-option label="应用菜单" :value="1"></el-option>
                <el-option label="系统菜单" :value="0"></el-option>
              </el-select>
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
            <el-form-item label="是否叶子" prop="isLeaf">
              <el-select
                v-model="dataForm.isLeaf"
                clearable
                style="width: 100%"
                placeholder="请选择是否叶子"
                disabled
              >
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="菜单图标" prop="menuIcon">
              <el-input v-model="dataForm.menuIcon" placeholder="请输入菜单图标"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序值" prop="sortNo">
              <el-input v-model="dataForm.sortNo" placeholder="请输入排序值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="btn-wrap">
          <el-button type="primary" :loading="saveLoading" @click="onSave">保存</el-button>
          <el-button type="danger" @click="onDelete">删除</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch, onUnmounted } from 'vue';
import { getMneuTree, delMneuTree, editMneuTree, addMneuTree } from '@/api/system';
import { confirmBox, messageAlert } from '@/shared/utils/utils';

const menuLoading = ref<boolean>(false);

const treeRef = ref<any>(null);

//表单ref
const formRef = ref<any>(null);

//保存的loading
const saveLoading = ref<boolean>(false);

const expandedNode = ref<string[]>([])
// 标准菜单是否启用
const affixDisabled = ref<boolean>(false)
// 菜单类型是否启用
const menuFromDisabled = ref<boolean>(false)
// 是否添加状态
const isAdd = ref<boolean>(false)

const menu = reactive({
  filterText: '',
  menuData: [] as any[]
});

//添加和编辑的表单
const dataForm = reactive({
  menuId: '', //菜单ID
  parentMenuName: '', //上级菜单
  menuName: '', //菜单名称
  menuIcon: '', //菜单图标
  menuUrl: '', //菜单url
  isLeaf: 0, //是否叶子
  sortNo: '', //排序号
  parentMenuId: '', //父类菜单id
  affix: "1", //是否只显示在标准账套下；1表示只在标准账套下显示
  menuFrom: 1 //菜单来源[0:Opsoft系统菜单 1:应用菜单]
});

//添加和编辑表单的验证规则
const formRules = reactive({
  menuId: [{ required: true, message: '请输入菜单ID', trigger: 'blur' }],
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuUrl: [{ required: false, message: '请输入菜单URL', trigger: 'blur' }],
  sortNo: [
    { required: true, message: '请输入排序值', trigger: 'blur' },
    { pattern: /^\d+$/, message: '只能输入数字', trigger: 'blur' },
  ],
});

watch(
  () => menu.filterText,
  (val) => {
    treeRef.value.filter(val);
    resetForm();
  }
);

//获取菜单树
async function menuTree() {
  menuLoading.value = true;
  const res = await getMneuTree();
  menuLoading.value = false;
  menu.filterText = '';
  if (res.code === 200) {
    // 组织数据
    const data = res.data;
    // data["0"]为系统菜单;data["1"]为应用菜单
    const menuData: any[] = [];
    menuData.push({
      id: "1",
      isLeaf: false,
      label: "应用菜单",
      children: data[1],
      data: {
        menuId: "1"
      }
    }, {
      id: "0",
      isLeaf: false,
      label: "系统菜单",
      children: data[0],
      data: {
        menuId: "0"
      }
    })
    menu.menuData = menuData;
  }
}

//筛选节点
function filterNode(value, data) {
  if (!value) return true;
  return data.label.indexOf(value) > -1;
}

//节点点击
function onNodeClick(node) {
  const { id, data } = node;
  if (!data.parentMenuId) {
    affixDisabled.value = menuFromDisabled.value = false;
  } else {
    affixDisabled.value = menuFromDisabled.value = true;
  }
  Object.keys(dataForm).forEach(key => {
    dataForm[key] = data[key]
  })
  dataForm.parentMenuName = !data.parentMenuId ? "" : treeRef.value.store.nodesMap[data.parentMenuId].data.label;
}

//保存
function onSave() {
  const currentNode = treeRef.value.getCurrentNode()
  if (!currentNode) {
    messageAlert("error", isAdd.value ? "请选择要添加菜单的节点" : "请选择要修改的菜单")
    return
  }
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    saveLoading.value = true;
    let req: Promise<any> = isAdd.value ? addMneuTree(dataForm) : editMneuTree(dataForm);
    req.then(res => {
      saveLoading.value = false;
      if (res.code === 200) {
        messageAlert("success", res.msg)
        menuTree().then(() => {
          expandedNode.value = dataForm.parentMenuId ? [dataForm.parentMenuId] : ["0", "1"]
        })
        resetForm();
      }
    })
  });
}

//删除
function onDelete() {
  if (!dataForm.menuId) {
    messageAlert("warning", '清先选择需要删除的菜单')
    return;
  }
  confirmBox('删除该菜单', async () => {
    const res = await delMneuTree({ id: dataForm.menuId });
    if (res.code === 200) {
      messageAlert("success", res.msg)
      menuTree();
      resetForm();
      dataForm.parentMenuName = '';
      expandedNode.value = ["0", "1"]
    }
  });
}

//新增
function onAdd() {
  // 获取当前选中的菜单
  const currentNode = treeRef.value.getCurrentNode()
  if (!currentNode) {
    messageAlert("error", "请选择要添加菜单的节点")
    return
  }
  resetForm();
  isAdd.value = true;
  // 如果父级菜单不存在，则为顶级菜单
  if (["0", "1"].includes(currentNode.id)) {
    affixDisabled.value = menuFromDisabled.value = false;
    dataForm.menuFrom = Number(currentNode.id);
    menuFromDisabled.value = true;
  } else {
    affixDisabled.value = menuFromDisabled.value = true;
    // 设置要添加菜单的父级菜单
    dataForm.parentMenuName = currentNode.label;
    dataForm.parentMenuId = currentNode.data.menuId;
    dataForm.affix = currentNode.data.affix;
    dataForm.menuFrom = currentNode.data.menuFrom;
  }
}

function resetForm() {
  formRef.value.resetFields()
  dataForm.menuId = ""
  isAdd.value = false
}

menuTree();

</script>

<style lang="scss" scoped>
@import "@/styles/modules/system/container.scss";
.page-content {
  background-color: var(--background-color);
}
.page-right {
  background-color: var(--background-color-inverse);
  padding-right: 40px;
}
.btn-wrap {
  justify-content: center;
}
</style>

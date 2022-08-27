<template>
  <div class="pageList-top">
    <el-form mode="topForm" :inline="true" @submit.prevent>
      <el-col :span="12">
        <el-form-item label="页面名称">
          <el-input
            type="text"
            v-model="topForm.pageName"
            clearable
            @keyup.enter="getPageList"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-button type="primary" @click="getPageList">点击搜索</el-button>
      <el-button type="primary" @click="addPage" icon="el-icon-plus"
        >添加页面</el-button
      >
    </el-form>
  </div>
  <template v-if="tableOption.total > 0">
    <table-extend
      v-bind="tableOption"
      @handleSelectionChange="handleSelectionChange"
      @pageSizeChange="handleSizeChange"
      @currentChange="currentpage"
      :batchDelete="true"
      @dataDelete="dataDelete"
    >
      <template #col_pageName="{ data }">
        <div class="page-name-wrap">
          {{ data.pageName }}
          <template v-if="data.hasStoragePageConfig">
            <el-tag
              type="warning"
              size="small"
              :title="data.storageTime && `暂存时间:${data.storageTime}`"
              >暂存</el-tag
            >
          </template>
        </div>
      </template>
      <template #col_pcIsUsing="{ data }">
        {{ data.pcIsUsing ? "不可用" : "可用" }}
      </template>
      <template #col_appIsUsing="{ data }">
        {{ data.appIsUsing ? "不可用" : "可用" }}
      </template>
      <template #col_isAppHome="{ data }">
        {{ data.isAppHome ? "首页不显示" : "首页显示" }}
      </template>
      <template #col_pageType="{ data }">
        {{
          data.pageType == 0
            ? "基础信息"
            : data.pageType == 1
            ? "流程表单"
            : data.pageType == 2
            ? "报表页面"
            : "嵌入页面"
        }}
      </template>
      <template #operatColumn>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="text" size="small" @click="goPageDesign(scope.row)"
              >页面设计</el-button
            >
            <el-button type="text" size="small" @click="pageEdit(scope.row)"
              >页面编辑</el-button
            >
            <el-button type="text" size="small" @click="onDelRow(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </template>
    </table-extend>
  </template>
  <template v-else>
    <el-empty description="暂无页面"></el-empty>
  </template>
  <page-form
    v-model:visible="visible"
    :title="title"
    :formData="addPageForm"
    @onSubmit="onSubmitForm"
  ></page-form>
  <icons-dialog
    v-model:visible="iconDialogState.visible"
    :current="addPageForm.menuIcon"
    @select="setIcon"
  />
</template>

<script lang="ts" setup>
import { useRouter, useRoute } from "vue-router";
import { reactive, ref, nextTick, provide } from "vue";
import {
  addPages,
  updatePageById,
  getPagesBypage,
  delPageById,
  delPages, //删除普通页面
  delEchartsList, //删除图表页面
  uploadBgImage,
  getApppageSuffix,
} from "@/api/homeApi/index";
import IconsDialog from "@/components/iconSelect/index.vue";
import { setStorage, confirmBox, messageAlert, deepClone } from "@/shared/utils/utils";
import { useStore } from "vuex";
import columnpageconfig from "@/config/tableConfig/pageconfig";
import pageForm from "./pageForm.vue";

/**
 * 图标选择
 **/
const iconDialogState = reactive({
  visible: false,
});

provide("parent", {
  iconDialogState,
});

const store = useStore();
// 搜索条件表单
const topForm = reactive({
  pageName: "",
});
const router = useRouter();
const route = useRoute();

const { appid, modelid } = route.query;

const addloading = ref<boolean>(false);

const title = ref<string>("新增页面");
// 是否显示弹框
const visible = ref<boolean>(false);

const deleteIds = ref<number[]>([]);

const addPageRef = ref<any>(null);
//列表配置项
const tableOption = reactive({
  tableData: [],
  tableColums: columnpageconfig,
  paging: true,
  total: 0,
  tableLoading: false,
  border: false,
});

// 新增编辑时表单
let addPageForm = ref<any>({
  pageName: "",
  pageCode: "",
  tableNamePrefix: undefined,
  tableNameSuffix: undefined,
  pageType: 0,
  pageRemark: "",
  pageSource: "1",
  id: undefined,
  menuIcon: undefined,
  //背景图片
  backgroundImagePath: "",
  //pc端
  pcIsShow: 0,
  pcIsUsing: 1,
  pcOrd: 1,
  //app端
  appIsShow: 0,
  appIsUsing: 1,
  appOrd: 1,
  //企业微信
  ewIsShow: 0,
  ewIsUsing: 1,
  ewOrd: 1,
  //钉钉
  dingIsShow: 0,
  dingIsUsing: 1,
  dingOrd: 1,
  isAppHome: 0,
  //嵌入页面的4属性
  url: "",
  token: "",
  openType: 0,
  keepPublicPage: 0,
});

/** */
function addPage() {
  title.value = "添加页面";
  addPageForm.value.id = undefined;
  // 获取表名前缀
  getApppageSuffix({ modelId: modelid }).then((res) => {
    if (res.code == 200) {
      addPageForm.value.tableNamePrefix = res.msg;
    }
  });
  visible.value = true;
}

// 编辑页面
const pageEdit = (row) => {
  title.value = "编辑页面";
  visible.value = true;
  nextTick(() => {
    addPageForm.value = deepClone(row);
  });
};

// 跳转页面设计
function goPageDesign(row) {
  setStorage("curPageDesign", row);
  if (row.pageType == 0 || row.pageType == 1) {
    //当前操作的页面
    store.commit("design/setCurrentComponents", []);
    router.push({
      path: "/design",
      query: {
        appid: appid,
        modelid: modelid,
        appPageId: row.id,
        isUsing: row.isUsing,
        isNull: row.pageItemsBlank,
        pageType: row.pageType,
        pageName: row.pageName,
      },
    });
  } else if (row.pageType == 2) {
    store.commit("designChart/setCurrentCharts", []);
    router.push({
      path: "/designchart",
      query: {
        appPageId: row.id,
      },
    });
  } else if (row.pageType == 9) {
    messageAlert("warning", "当前类型不需要设计组件，请选择编辑");
  } else {
    messageAlert("warning", "当前类型暂无设计页面，请选择其它类型");
  }
}

// 批量选择
function handleSelectionChange(vals) {
  deleteIds.value =
    vals.length > 0
      ? vals.map((item) => {
          return item.id;
        })
      : [];
}

// 批量删除
function dataDelete() {
  if (deleteIds.value.length == 0) {
    messageAlert("error", "请选择要删除的数据");
    return;
  } else {
    confirmBox("删除数据", async () => {
      const res = await delPages(deleteIds.value);
      if (res.code == 200) {
        messageAlert("success", "删除成功");
        getPageList();
      }
    });
  }
}

// 表单提交
const onSubmitForm = () => {
  getPageList();
};

// 分页器
const pageRequest = reactive({
  pageIndex: 1,
  pageSize: 15,
});

//分页
function handleSizeChange(val) {
  pageRequest.pageSize = val.pageSize;
  getPageList();
}
function currentpage(val) {
  pageRequest.pageIndex = val.pageIndex;
  getPageList();
}
// 获取模块下的页面数据
const getPageList = async () => {
  tableOption.tableLoading = true;
  let para = {
    modelId: modelid,
    pageName: topForm.pageName,
    pageRequest: pageRequest,
  };
  const res = await getPagesBypage(para);
  if (res.code == 200) {
    let newArr: any[] = [];
    res.data.records.forEach((item) => {
      let tempObj = {},
        { menuOrder, ...params } = item;
      tempObj = { ...menuOrder, ...params };
      newArr.push(tempObj);
    });
    tableOption.tableData = newArr;
    tableOption.total = res.data.total;
  }
  tableOption.tableLoading = false;
};

// 根据id删除页面
const onDelRow = (row) => {
  //删除普通页面和删除工作流类型页面
  if (row.pageType === 0 || row.pageType === 1 || row.pageType === 9) {
    let para = {
      appPageId: row.id,
    };
    confirmBox("删除数据", async () => {
      const res = await delPageById(para);
      if (res.code == 200) {
        messageAlert("success", "删除成功");
        getPageList();
      }
    });
  }
  //删除echartpage类型页面
  if (row.pageType == 2) {
    let para = {
      pageId: row.id,
    };
    confirmBox("删除数据", async () => {
      const res = await delEchartsList(para);
      if (res.code == 200) {
        messageAlert("success", "删除成功");
        getPageList();
      }
    });
  }
};

/** 确认选择图标*/
function setIcon(val) {
  addPageForm.value.menuIcon = val;
}

getPageList();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/pagelist.scss";
</style>

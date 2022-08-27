<template>
  <div
    class="module-detail-list"
    v-loading.lock="currentPage.loading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
    element-loading-text="数据加载中…"
  >
    <!-- 表单、流程表单页面 -->
    <template
      v-if="currentPage.pageType === PageType.FORM_PAGE || currentPage.pageType === PageType.FLOW_PAGE"
    >
      <div class="page-header">
        <div class="page-search">
          <top-form
            v-if="searchForm.componentList && searchForm.componentList.length > 0"
            :formConf="searchForm.formConf"
            :componentList="searchForm.componentList"
            :formData="searchForm.formData"
          ></top-form>
        </div>
        <tool-bar :sceneConfig="sceneConfig" :sceneComponentList="sceneComponentList"></tool-bar>
      </div>
      <div class="page-container">
        <!-- <template v-if="tableOption.tableColums.length > 0"> -->
          <table-extend
            v-bind="tableOption"
            @handleSelectionChange="handleSelectionChange"
            @pageSizeChange="onPageSizeChange"
            @currentChange="currentChange"
            @tableSort="onTableSort"
            @rowDblClick="viewDetails"
          >
            <template #operatColumn>
              <el-table-column
                fixed="right"
                label="操作"
                min-width="250"
                v-if="tableOption.tableColums.length > 0"
              >
                <template #default="scope">
                  <text-button
                    @click="onEditRow(scope.row)"
                  >{{ scope.row.status === 4 ? "重新提交" : "编辑" }}</text-button>
                  <text-button type="error" @click="onDelRow(scope.row)">删除</text-button>
                  <flow-buttons
                    :row="scope.row"
                    :formConf="pageSetting.formConf"
                    :startFlowLabel="startFlowLabel"
                    @onStart="onStart"
                    @onFlowDetail="onFlowDetail"
                    @onExcuteBtnWorkOrder="excuteBtnWorkOrder"
                  ></flow-buttons>
                </template>
              </el-table-column>
            </template>
          </table-extend>
        <!-- </template> -->
        <!-- <template v-else>
          <el-empty description="暂无数据"></el-empty>
        </template> -->
      </div>
    </template>
    <!-- 报表页面 -->
    <template v-else-if="currentPage.pageType === PageType.EMBEDDED_PAGE && embedPage.iframeShow">
      <iframe :src="embedPage.url" style="height: 100%; width: 100%; border: none" />
    </template>
  </div>
  <model-form
    v-model:visible="pageSetting.visible"
    :title="pageSetting.title"
    :type="pageSetting.type"
    :formConf="pageSetting.formConf"
    :formData="currentFormData"
    :componentList="pageSetting.componentList"
    @onSubmit="onSubmit"
    ref="modelFormRef"
  >
    <template #otherBtn v-if="currentFormData.status === 4">
      <el-button type="primary" @click="reSubmit">重新提交</el-button>
    </template>
  </model-form>
  <div class="fixedDialog">
    <el-dialog
      v-if="currentPage.pageType == PageType.FLOW_PAGE"
      width="800px"
      v-model="processvisible"
      destroy-on-close
    >
      <template v-slot:title>
        <dialog-title :title="detailType === 'detail' ? '流程详情' : '流程审核'"></dialog-title>
      </template>
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane
          :label="ele.name"
          :name="`${index}`"
          v-for="(ele, index) in flowFormTabs.formList"
          :key="index"
        >
          <div class="columRow">
            <top-form
              :formConf="ele.formConf"
              :formData="ele.formModel"
              :componentList="ele.componentList"
            ></top-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="流程图" name="processIntanceImage" v-if="detailType === 'detail'">
          <el-scrollbar>
            <img class="process-image" :src="flowFormTabs.imageUrl" alt="流程图" />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane :label="flowable.tabName" name="exec" v-if="detailType !== 'detail'">
          <div class="columRow">
            <top-form
              :formConf="flowable.formConf"
              :componentList="flowable.componentList"
              :formData="currentFormData"
              ref="flowableForm"
            ></top-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <template #footer v-if="detailType !== 'detail'">
        <el-button @click="processvisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="onDone(item)"
          v-for="(item, index) in buttonList"
          :key="index"
        >{{ item.nameSpace }}</el-button>
      </template>
      <template #footer v-else>
        <el-button icon="el-icon-close" @click="processvisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>

  <!-- 主从表新增编辑表单，后续需要优化-->
  <table-edit-form
    v-model:visible="tableForm.visible"
    :title="tableForm.title"
    :type="tableForm.type"
    :formConf="tableForm.formConf"
    :formData="tableForm.formData"
    :componentList="tableForm.componentList"
    @onSubmit="onSubmitTableForm(tableForm)"
  ></table-edit-form>

  <table-edit-form
    v-model:visible="copyTableForm.visible"
    :title="copyTableForm.title"
    :type="copyTableForm.type"
    :formConf="copyTableForm.formConf"
    :formData="copyTableForm.formData"
    :componentList="copyTableForm.componentList"
    @onSubmit="onSubmitTableForm(copyTableForm)"
  ></table-edit-form>
  <!-- 打印表单页面（打印使用） -->
  <print-order-form v-show="false" :form-data-list="printOrderData"></print-order-form>
</template>
  
<script lang="ts" setup>
import { reactive, ref, nextTick, provide, watch, computed, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import useEmitter from "@/use/useEitter";
import useComponentEmit from '@/viewHooks/use-component-emit';
import useInitComponentData from "@/viewHooks/use-init-component";
import { useModuleList, useFlowable, useFunctionModel } from "./useModuleList";
import useTableExtend from "@/use/useTableExtend";
import usePrint from '@/use/usePrint';
import topForm from "@/components/moduleform/form.vue";
import modelForm from "@/components/moduleform/index.vue";
import tableEditForm from "@/components/moduleform/index.vue";
import ToolBar from "@/components/modules/apps/toolBar.vue";
import printOrderForm from '@/components/modules/apps/printOrderForm.vue';
import FlowButtons from '@/components/modules/apps/flowButtons.vue';
import {
  getAppInfoById,
  getPageSetData,
  exportData,
  getTempExcel,
  importExcel,
  importRoute,
  pageDelData,
  pageUpdateData,
  pageAddData,
  getModelConditions,
  getPageCfgByTableId,
  getOrderPrintData,
} from "@/api/homeApi/index";
import { confirmBox, deepClone, messageAlert } from "@/utils/utils";
import { PageType } from "@/interfaces/type";
import type { SubmitParams, TabTableData } from "./types";
import { PenetratePageType } from "@/components/designComponent/enum";
import useEitter from '@/use/useEitter';
import { getfunctionModel } from "@/api/functionModel";
import { startFlowable, reSubmitFlowable } from "@/api/flowable";
import useState from "./useState";
import { ElMessage } from "element-plus";

const uploadImportRoute = ref<any>(null);

const store = useStore();

//表格处理
const { tableOption, selectIds, handleSelectionChange, resetTableOption } = useTableExtend();
// 组件初始化相关
const { initComponentData, selectInit, tabTableInit, treeInit, transformDataSourceOfTableData, processFlowInit } = useInitComponentData();
// 组件事件相关
const { loadDialogSelectData, createAutoCode, fillDialogSelectData, delTabTableData, editTabTableData, viewDetailTabTableData, addTabTableData, selectChange: onSelectChange } = useComponentEmit();
// 计算模型相关
const { tabTableData, getPageFunctionModelList, relFunctionModel } = useFunctionModel();
// 打印相关
const { printHtlm } = usePrint();

const { addable, currentPage, searchForm, pageSetting, currentFormData, filterColumns, pageParmas, pageRequest, advancedCondition, sceneComponentList, sceneConfig, flowFormTabs, embedPage, printOrderData, tableForm, copyTableForm, filterlist, requestConditions } = useState();

// 工作流操作
const { flowable, exectId, detailType, processvisible, processDefinitionId, activeName, buttonList, startFlowLabel, flowableDetail, doneFlowable, getflowableFormDetail, flowableExcute, flowableExcuteForm } = useFlowable()

const {
  initPageConfig,
  rowFormTransform,
  multipleValueComponentTransform,
} = useModuleList(searchForm, pageSetting);
// 表单组件事件定义
useEmitter([
  // 自动生成自编码
  { key: "on-create-autocode", value: createAutoCode },
  // 加载开窗表格数据
  { key: "on-load-reltable-data", value: loadDialogSelectData },
  // 填充表格选择的数据
  { key: "on-set-reltable-data", value: fillDialogSelectData },
  // 删除主从表数据
  { key: "on-del-tabtable-data", value: delTabTableData },
  // 编辑主从表数据
  { key: "on-edit-tabtable-data", value: (e) => editTabTableData(e, tableForm) },
  // 主从表数据--查看详情
  { key: "on-viewDetail-tabtable-data", value: (e) => viewDetailTabTableData(e, tableForm) },
  // 新增主从表数据
  { key: "on-add-tabtable-data", value: (e) => addTabTableData(e, tableForm) },
  // 表单配置按钮  按钮执行事件
  { key: "on-do-event", value: excuteBtn },
  // 更新后表单配置按钮  按钮执行事件
  { key: "on-do-event-btnform", value: excuteBtnForm },
  // 树形组件加载
  { key: "on-load-tree", value: (e) => treeInit(e, currentPage.pageType) },
  // 从表点击编辑,主表按钮变成保存按钮
  { key: "on-change-tabtablebtn", value: changeTabTableBtn },
  // 表单下拉change事件
  { key: "on-select-change", value: onSelectChange },
]);

const mitter = useEitter();

//表格数据加载框
const route = useRoute();

const router = useRouter();

// 当前表单弹窗ref对象
const modelFormRef = ref<any>(null);

// ================Provide==============================
provide("parent", {
  currentPage,
  currentFormData,
  addable,
  selectIds,
  pageSetting,
  searchForm,
  pageParmas,
  tableOption,
  printOrderData,
  pageRequest,
  advancedCondition,
  exectId,
  reloadPage,
  reloadTable,
  getPageSet,
  getInfoByappid,
  tableRowClick,
  delDatas,
  initComponentData,
  multipleValueComponentTransform,
  autoCreateData,
  printHtlm
});

// 表格provide
provide('table-components', pageSetting)

// 点击页面切换,更改当前的显示页面
const pageChange = (model, page) => {
  pageParmas.pageTableName = page.pageTableName
  pageParmas.pageName = page.pageName;
  pageParmas.modelName = model.modelName;
  pageParmas.pageId = page.id;
  pageParmas.modelId = model.id;
  currentPage.pageType = page.pageType;
  if (currentPage.pageType === PageType.EMBEDDED_PAGE) {
    embedPage.url = page.url + `&token=${page.token}`
    router.replace({
      path: "/application",
      query: {
        appid: route.query.appid,
        modelid: pageParmas.modelId,
        pageId: page.url + `&token=${page.token}`,
      },
    });
    if (page.openType == 1) {
      embedPage.iframeShow = false
      window.open(embedPage.url, '_blank')
    }
    if (page.openType == 0) {
      embedPage.iframeShow = true
    }
  }

  if (
    currentPage.pageType === PageType.FORM_PAGE ||
    currentPage.pageType === PageType.FLOW_PAGE
  ) {
    router
      .replace({
        path: "/application",
        query: {
          appid: route.query.appid,
          modelid: pageParmas.modelId,
          pageId: pageParmas.pageId,
        },
      })
      .then(() => {
        reloadPage();
      });
  }
  if (currentPage.pageType === PageType.REPORT_PAGE) {
    const { appid, modelid, pageId } = route.query;
    router.replace({
      path: "/application",
      query: {
        appid: route.query.appid,
        modelid: pageParmas.modelId,
        pageId: pageParmas.pageId,
      },
    });
  }
};

// 查看详情
const viewDetails = (row) => {
  pageSetting.formConf.disabled = true
  initComponentData(pageSetting.componentList, "edit", row);
  pageSetting.title = `详情信息 ${currentPage.appName
    } / ${pageParmas.modelName} / ${pageParmas.pageName}`;
  pageSetting.visible = true;

  exectId.value = row.id;
  nextTick(() => {
    currentFormData.value = rowFormTransform(row, pageSetting.componentList);
    initFormComponentData(currentFormData.value, pageSetting.componentList);
  });
};

//编辑一条数据弹框
const onEditRow = (row) => {
  pageSetting.formConf.disabled = false
  initComponentData(pageSetting.componentList, "edit", row);
  pageSetting.title = `${row.status === 4 ? "重新提交" : "编辑"} ${currentPage.appName} / ${pageParmas.modelName} / ${pageParmas.pageName}`;
  pageSetting.visible = true;

  exectId.value = row.id;
  nextTick(() => {
    currentFormData.value = rowFormTransform(row, pageSetting.componentList);
    initFormComponentData(currentFormData.value, pageSetting.componentList);
  });
};
// 启动流程
const onStart = (row: any, str?: string) => {
  exectId.value = row.id;
  let para = {
    jsonDATA: row,
    modelId: pageParmas.modelId as string,
    pageId: pageParmas.pageId,
    updateId: row.id,
    processDefinitionId: processDefinitionId.value,
    taskId: row.taskId ? row.taskId : "",
  };
  // 启动流程
  if (row.startable) {
    confirmBox(str, async () => {
      const res = await startFlowable(para);
      if (res.code === 200) {
        messageAlert("success", "提交成功");
        getPageSet();
      }
    });
  }
  // 执行流程
  if (row.executable) {
    activeName.value = "exec";
    onFlowDetail("exec", row);
    getflowableForm(row, para);
  }
};

function onDone(item) {
  doneFlowable(item).then(() => {
    getPageSet()
  })
}

//获取执行流程的表单详情
async function getflowableForm(row: any, para) {
  getflowableFormDetail(row, para)
};

// 单个删除
function onDelRow(row: any) {
  selectIds.value = [row.id];
  delDatas();
};

/**
 * 详情
 */
async function onFlowDetail(type, row: any) {
  if (type === "detail") {
    activeName.value = "0";
  } else {
    activeName.value = "exec";
  }
  flowableDetail(row, type)
};

// 页面大小改变
const onPageSizeChange = (e): void => {
  pageRequest.pageSize = e.pageSize;
  currentChange(e);
};
// 页码改变
const currentChange = (e): void => {
  pageRequest.pageIndex = e.pageIndex;
  reloadTable();
};

function onTableSort(obj): void {
  const { sortName, sortType } = obj;
  pageSetting.sortField = sortName;
  pageSetting.sortType = sortType;
  onSearch();
}


// 提交
const onSubmit = async (formModel): Promise<void> => {
  const { modelId, pageId } = pageParmas;
  await submitForm(formModel, modelId, pageId, null);
  pageSetting.visible = false;
  reloadTable();
};

async function submitForm(model: any, modelId, pageId, tableData) {
  let params: SubmitParams = {
    jsonDATA: model,
    modelId: modelId,
    pageId: pageId,
    tableDataEntities: getTabTableData(tableData)
  };
  let res: any = undefined;
  if (model.id) {
    params.updateId = model.id;
    res = await pageUpdateData(params);
  } else {
    res = await pageAddData(params);
  }
  if (res.code == 200) {
    messageAlert("success", (model.id && "编辑成功") || "添加成功");
  }
}

//重新提交
const reSubmit = () => {
  modelFormRef.value.formValid(async () => {
    let formModel = modelFormRef.value.getParams();
    let params = {
      jsonDATA: formModel,
      modelId: pageParmas.modelId as string,
      pageId: pageParmas.pageId,
      values: {
        formConf: pageSetting.formConf || null,
        componentList: pageSetting?.componentList || null,
        formModel,
      },
      processInstanceId: currentFormData.value.processInstanceId,
    };
    const res = await reSubmitFlowable(params);
    if (res.code == 200) {
      messageAlert("success", res.msg || "");
      pageSetting.visible = false;
      reloadTable();
    }
  });
};

// 单个多个删除
async function delDatas() {
  let parmas = {
    modelId: pageParmas.modelId,
    pageId: pageParmas.pageId,
    deleteIds: selectIds.value,
  };
  confirmBox("删除数据", async () => {
    const res = await pageDelData(parmas);
    if (res.code == 200) {
      messageAlert("success", "删除成功");
      reloadTable();
      selectIds.value = [];
    }
  });
};
// 获取页面组件数据,可搜索与弹框分开
const getInSearch = async () => {
  // 获取搜索里关联外键值
  initComponentData(searchForm.componentList);
};

// 获取页面配置属性数据
async function getPageSet() {
  // 弹框
  pageSetting.visible = false;
  pageSetting.type = "";
  pageSetting.size = 0;
  pageSetting.formConf = undefined;
  pageSetting.componentList = [];
  tableOption.tableLoading = true;
  const relationalData = {};
  const selectFields: Array<string> = []
  Object.keys(route.query).forEach(key => {
    if (!['appid', 'modelid', 'pageId'].includes(key)) {
      relationalData[key] = route.query[key];
      selectFields.push(key);
    }
  });
  let para = {
    dataRequest: {
      modelId: pageParmas.modelId,
      pageId: pageParmas.pageId,
      filterColumns: filterColumns.value,
      sortFileId: pageSetting.sortField,
      sortOrder: pageSetting.sortType,
      filterParmas: filterlist,
      filterType: {},
      requestConditions: requestConditions.value,
      relationalData,
      selectFields,
      relationalPageId: pageParmas.pageId,
      conditions: advancedCondition.value || null
    },
    pageRequest: pageRequest,
  };
  const res = await getPageSetData(para);
  if (res.code == 200) {
    const { pageItems } = res.data.appPageData;
    if (!pageItems || pageItems.components.length === 0) {
      messageAlert("error", "当前页面未设计，无法呈现！");
      resetTableOption();
    } else {
      addable.value = pageItems.addable;
      processDefinitionId.value = pageItems.formConf.processDefinitionId;
      startFlowLabel.value = pageItems.formConf.startFlowLabel;
      initPageConfig(res).then((tableConfig: any) => {
        tableOption.total = tableConfig.total;
        tableOption.tableColums = tableConfig.tableColums;
        tableOption.tableData = tableConfig.tableData;
        tableOption.tableLoading = false;
      });
      // 数据加载成功后，根据需要加载搜索栏（如果已加载，则不再执行加载）
      pageSetting.reload && initComponentData(searchForm.componentList);
    }
  } else {
    tableOption.tableLoading = false;
  }
  requestConditions.value = [];
};

//根据appid  获取应用信息和左侧菜单信息
async function getInfoByappid() {
  const { appid, modelid, pageid: pageId } = route.params;
  let para = {
    applicationId: appid,
    isActive: 1,
  };
  currentPage.loading = true;
  const res = await getAppInfoById(para);
  if (res.code == 200) {
    const { appName, models } = res.data;
    currentPage.appName = appName;
    currentPage.models = models;
    // 当有模块id的时候设置默认展开项对应到具体模块的第一个页面
    if (!currentPage.models || currentPage.models.length === 0) {
      currentPage.loading = false;
      return;
    }
    const currentModel = modelid
      ? currentPage.models.find((f) => f.id == modelid)
      : currentPage.models[0];
    if (!currentModel) {
      currentPage.loading = false;
      return;
    }
    if (!currentModel.appPagesList || currentModel.appPagesList.length === 0) {
      tableOption.tableColums = [];
      currentPage.loading = false;
      return;
    }
    const page =
      (pageId &&
        currentModel.appPagesList.find(
          (f) => f.menuDisplayed === 1 && f.id == pageId
        )) ||
      currentModel.appPagesList.find((f) => f.menuDisplayed === 1);
    if (!page) return;
    pageParmas.pageId = page.id;
    pageParmas.pageTableName = page.pageTableName
    pageParmas.pageName = page.pageName;
    pageParmas.modelName = currentModel.modelName;
    pageParmas.modelId = currentModel.id;
    currentPage.pageType = page.pageType;

    if (
      currentPage.pageType === PageType.FORM_PAGE ||
      currentPage.pageType === PageType.FLOW_PAGE
    ) {
      reloadPage();
    } else if (currentPage.pageType == PageType.REPORT_PAGE) {
      router.replace({
        path: "/application",
        query: {
          appid: appid,
          modelid: pageParmas.modelId,
          pageId: pageParmas.pageId,
        },
      });
    } else if (currentPage.pageType === PageType.EMBEDDED_PAGE) {
      embedPage.url = page.url + `&token=${page.token}`;
      router.replace({
        path: "/application",
        query: {
          appid: appid,
          modelid: pageParmas.modelId,
          pageId: embedPage.url,
        },
      });

      if (page.openType == 1) {
        embedPage.iframeShow = false;
        window.open(embedPage.url, "_blank");
      }
      if (page.openType == 0) {
        embedPage.iframeShow = true;
      }
    } else {
      messageAlert("error", "当前页面类型不能展示哦");
    }
  }
  currentPage.loading = false;
}

/**
 * 初始化表格组件数据
 */
function initFormComponentData(row: any, components: any[]) {
  for (let i = 0; i < components.length; i++) {
    const element = components[i] as any;
    const tag = element.componentTag;
    if (tag === "designTabTable") {
      tabTableInit(row, element).then((res: any) => {
        tabTableData.value = deepClone(element.dataSourceList);
        // 组件数据处理
        const tabTableComponents = res;
        for (let j = 0; j < element.dataSourceList.length; j++) {
          const table = element.dataSourceList[j];
          const componentList = res[table.pid];
          initComponentData(componentList).then(() => {
            // 根据组件类型，处理表格数据
            transformDataSourceOfTableData(componentList, table.dataSource || []);
          })
        }
      });
    } else if (tag === "designProcessFlow") {
      // 工序流程图
      if (currentFormData.value.FICMONO) {
        processFlowInit(element, currentFormData.value.FICMONO)
      }
    }
  }
}
/**
 * 自动创建值
 */
function autoCreateData(componentList) {
  componentList.forEach((component) => {
    if (
      component.componentTag === "designAutoCode" &&
      !component.__config__.isSeries
    ) {
      createAutoCode({
        component,
        formModel: currentFormData.value,
        tableId: component.autorule.tableId || pageParmas.pageId,
      });
    }
  });
}

// 按钮执行
function excuteBtn(obj: any) {
  flowableExcute(obj, pageParmas.pageId).then(() => {
    getPageSet();
    pageSetting.visible = false;
    tableForm.visible = false;
    processvisible.value = false;
  })
}
function changeTabTableBtn() {
  pageSetting.formConf.disabled = false
}
// 更新后的按钮执行
function excuteBtnForm(item: any) {
  flowableExcuteForm(item, pageParmas.pageId).then(() => {
    if (item.eventCode == "IMPORT_WORK") {
      initFormComponentData(currentFormData.value, pageSetting.componentList);
      return;
    }
    if (item.closeable == false) {
      dataCopy(item);
      return;
    }
    getPageSet();
    pageSetting.visible = false;
    tableForm.visible = false;
    processvisible.value = false;
    dataCopy(item);
  })
}

async function excuteBtnWorkOrder(item: any, data: any, fileOptions: any) {
  exectId.value = data.id;

  // 打印功能
  if (item.eventCode === 'PRINT_WORK') {
    const res = await getOrderPrintData({ ids: [data.id] })
    if (res.code == 200) {
      printOrderData.value = res.data || [];
      if (printOrderData.value.length === 0) {
        messageAlert('error', '无效工单数据，不允许打印');
        return
      }
      nextTick(() => {
        printHtlm('#print-order-list');
      })
    }
    //工艺流程导入
  } else if (item.eventCode === "IMPORT_WORK") {

    uploadImportRoute.value.$refs.uploadRef.inputRef.click();

  } else {
    item.data = data;
    excuteBtnForm(item);
  }
}

async function dataCopy(item: any) {
  if (!item.copyPageId) {
    return;
  }
  const params = { appPageId: item.copyPageId[2] };
  const res = await getPageCfgByTableId(params);
  const data = item.data;
  if (res.code == 200) {
    const { formConf, components } = res.data;
    copyTableForm.visible = true;
    copyTableForm.tableId = item.copyPageId[2];
    copyTableForm.title = "新增信息";
    copyTableForm.type = formConf.dialogType;
    copyTableForm.size = formConf.width;
    copyTableForm.formConf = formConf;
    copyTableForm.componentList = components;
    copyTableForm.options = {};
    initComponentData(copyTableForm.componentList);
    // 获取当前表单计算模型字段
    getPageFunctionModelList(copyTableForm.tableId || '');
    nextTick(() => {
      const autoCodeComponent: any = copyTableForm.componentList.find(
        (f) => f.componentTag === "designAutoCode" && !f.__config__.isSeries
      );
      autoCodeComponent &&
        createAutoCode({
          component: autoCodeComponent,
          formModel: copyTableForm.formData,
          tableId: autoCodeComponent.autorule.tableId || item.copyPageId[2],
        });
      for (var i = 0; i < item.dataCopyFieldList.length; i++) {
        var field = item.dataCopyFieldList[i].targetFieldId;
        var sourceField = item.dataCopyFieldList[i].sourceFieldId;
        copyTableForm.formData[field] = data[sourceField];
        copyTableForm.formData[`${field}_dialogSelect`] = data[sourceField];
      }
    });
  }
}

/**
 * 提交主从表数据
 */
async function onSubmitTableForm(tableForm: any) {
  // 将数据添加到从表表格中
  const { selectModelList, dataSourceList } = tableForm.options as any;
  if (!selectModelList) {
    await submitForm(tableForm.formData, null, tableForm.tableId, tableForm);
    tableForm.visible = false;
    tabTableInit(currentFormData.value, tableForm.options);
    return;
  }
  const selectModel = selectModelList.find(f => f.config[0].id == tableForm.tableId)
  const optionId = selectModel.pid;
  const tableName = selectModel.config[0].tableName;
  const dataSource = dataSourceList.find(f => f.pid == optionId).dataSource;
  let row: any = {}
  // 新增
  if (tableForm.formType === 1) {
    row.key_id = `${+new Date()}`;
    Object.keys(tableForm.formData).forEach((key: string) => {
      const value = tableForm.formData[key];
      row[`${tableName}__${key}`.toLocaleUpperCase()] = Array.isArray(value) ? JSON.stringify(value) : value;
      row[`${tableName}__${key}_key`] && delete row[`${tableName}__${key}_key`];
      row[`${tableName}__${key}_dialogSelect`] && delete row[`${tableName}__${key}_dialogSelect`];
    })
    dataSource.push(row);
  } else {
    // 编辑
    if ((<any>tableForm.formData).key_id) {
      row = dataSource.find(f => f.key_id === (<any>tableForm.formData).key_id);
      row && Object.keys(tableForm.formData).forEach((key: string) => {
        const value = tableForm.formData[key];
        row[`${tableName}__${key}`.toLocaleUpperCase()] = Array.isArray(value) ? JSON.stringify(value) : value
        row[`${tableName}__${key}_key`] && delete row[`${tableName}__${key}_key`];
        row[`${tableName}__${key}_dialogSelect`] && delete row[`${tableName}__${key}_dialogSelect`];
      })
    }
  }
  // 保存时使用
  tabTableData.value = deepClone(dataSourceList);
  // 数据加工-表格呈现
  tableForm.componentList.map((component: any) => {
    const field =
      `${tableName}__${component.__vModel__}`.toLocaleUpperCase();
    component.__vModel__ = field;
  });
  transformDataSourceOfTableData(tableForm.componentList, [row]);
  let formData: any = currentFormData.value;
  let pageId: string = pageParmas.pageId;
  // 按钮表单显示
  if (copyTableForm.visible) {
    formData = copyTableForm.formData;
    pageId = copyTableForm.tableId || '';
  }
  relFunctionModel(formData, pageId)
  // 如果是按钮表单，重置页面计算模型字段
  if (copyTableForm.visible) {
    getPageFunctionModelList(pageParmas.pageId);
  }
  tableForm.visible = false;
}

/**
 * 重新加载页面
 */
function reloadPage() {
  pageSetting.reload = true;
  QuerySchemeList();
  getPageFunctionModelList(pageParmas.pageId);
  // ModelConditions();
  getPageSet();
}
/**
 * 重新加载表格
 */
function reloadTable() {
  pageSetting.reload = false;
  getPageSet();
}

async function QuerySchemeList() {
  mitter.emitter.emit("on-advanced-search");
  advancedCondition.value = undefined
}

/**
 * 表格单元格点击跳转，非按钮点击事件
 */
function tableRowClick(
  page: Array<number | string>,
  params: any,
  type: PenetratePageType = PenetratePageType.PAGE
) {
  if (page && page.length > 0 && type === PenetratePageType.PAGE) {
    router
      .replace({
        path: "/application",
        query: {
          appid: page[0],
          modelid: page[1],
          pageId: page[2],
          ...params,
        },
      })
      .then(() => {
        getInfoByappid();
      });
  } else {
  }
}

/**保存获取从表数据 */
function getTabTableData(tableData: any): TabTableData[] {
  const tableDataEntities: TabTableData[] = []
  const tabTableConfig = (tableData ? tableData.componentList : <any[]>pageSetting.componentList).find(f => f.componentTag === 'designTabTable');
  if (tabTableConfig) {
    const { dataSourceList, relFields, tabOptions, selectModelList } = tabTableConfig
    for (let i = 0; i < tabOptions.length; i++) {
      const { id: pid } = tabOptions[i];
      const relField = relFields.find(f => f.pid == pid);
      const selectModel = selectModelList.find(f => f.pid == pid);
      const dataSource = dataSourceList.find(f => f.pid == pid)
      const postData = deepClone(dataSource || [])
      for (let j = 0; j < postData.dataSource.length; j++) {
        const row = postData.dataSource[j];
        Object.keys(row).forEach((key: string) => {
          if (row[`${key}_key`] != undefined) {
            row[key] = row[`${key}_key`]
            delete row[`${key}_key`]
          } else if (row[`${key}_dialogSelect`]) {
            row[key] = row[`${key}_dialogSelect`]
            delete row[`${key}_dialogSelect`]
          }
        })
      }
      tableDataEntities.push({
        masterFieldName: relField.masterField || 'id',
        tableId: selectModel.config[0].id,
        tableName: selectModel.config[0].tableName,
        tableData: postData.dataSource,
        slaveFieldName: relField.field
      })
    }
  }
  return tableDataEntities
}

getInfoByappid();

</script>
  
  <style lang="scss" scoped>
@import "@/styles/modules/pagelist/moduledetaillist.scss";
</style>
  
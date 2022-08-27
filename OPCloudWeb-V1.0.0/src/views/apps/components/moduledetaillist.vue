<template>
  <div
    class="module-detail-list"
    v-loading.lock="modulesLoading"
    element-loading-background="rgba(0, 0, 0, 0.2)"
    element-loading-text="模块加载中…"
  >
    <div class="container">
      <div class="left-container">
        <template v-if="moduleLayout.menus.length > 0">
          <module-menu
            :menus="moduleLayout.menus"
            :activeIndex="moduleLayout.activeMenu"
            @onMenuClick="onMenuClick"
          ></module-menu>
        </template>
      </div>
      <div class="right-wrap">
        <!-- 表单、流程表单页面 -->
        <template
          v-if="
            curpageType === PageType.FORM_PAGE ||
            curpageType === PageType.FLOW_PAGE
          "
        >
          <div class="right-header">
            <menu-header :paths="moduleLayout.paths"></menu-header>
            <div class="button-group">
              <el-button
                size="small"
                type="primary"
                plain
                icon=" el-icon-plus"
                v-if="addable"
                @click="onAddRow"
                >添加</el-button
              >
              <el-button
                size="small"
                type="primary"
                plain
                icon="el-icon-search"
                @click="onSearch"
                >查询</el-button
              >
              <el-button
                size="small"
                type="primary"
                plain
                icon="el-icon-delete"
                @click="onBatchDelete"
                >批量删除</el-button
              >
              <el-button
                v-if="
                  /^t_aegongdan_mshengchanzhixing_pICMO(_(\opcloud|\d+))?$/.test(
                    pageParmas.pageTableName
                  )
                "
                size="small"
                type="primary"
                plain
                icon="el-icon-printer"
                @click="onBatchPrint"
                >批量打印</el-button
              >
              <AdvancedSearch
                class="advanced-search"
                :rowList="rowList"
                :componentsConfig="componentsConfig"
                :modulePageId="pageParmas.pageId"
                @advancedSearch="onAdvancedSearch"
              ></AdvancedSearch>
              <el-dropdown
                class="more-button"
                placement="bottom-start"
                style="margin-left: 10px;"
              >
                <i class="el-icon-more" title="更多"></i>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="onDownload"
                      :disabled="tableOption.tableData.length == 0"
                      >下载数据</el-dropdown-item
                    >
                    <el-dropdown-item @click="onDownloadTemplate"
                      >下载模板</el-dropdown-item
                    >
                    <el-dropdown-item>
                      <el-upload
                        action
                        :before-upload="beforeUpload"
                        class="upload-demo"
                        accept=".xls, .xlsx"
                        :http-request="uploadFunc"
                        :show-file-list="false"
                      >
                        <a>导入数据</a>
                      </el-upload>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <div class="right-container">
            <template v-if="tableOption.tableColums.length > 0">
              <!-- 计算模型页面相关 -->
              <div class="modelcondition" v-if="modelConditionList.length > 0">
                <el-form size="small">
                  <el-col
                    v-for="(item, index) in modelConditionList"
                    :key="index"
                    :span="12"
                  >
                    <el-form-item :label="item.opFields.fieldRemark">
                      <el-input
                        v-if="item.type == 0"
                        size="small"
                        v-model="item.opFields.fieldValue"
                      ></el-input>
                      <el-date-picker
                        v-if="item.type == 1"
                        v-model="item.opFields.fieldValue"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-form>
              </div>
              <div class="right-search">
                <top-form
                  v-if="topSetting.componentList && topSetting.componentList.length > 0"
                  :formConf="topSetting.formConf"
                  :componentList="topSetting.componentList"
                  :formData="topSetting.formData"
                ></top-form>
              </div>

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
                      <el-button
                        v-if="scope.row.status === 0"
                        size="mini"
                        type="danger"
                        >待审核</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 1"
                        size="mini"
                        type="success"
                        >已审核</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 2"
                        size="mini"
                        type="danger"
                        >等待</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 3"
                        size="mini"
                        type="danger"
                        >已退回</el-button
                      >
                      <el-button
                        v-if="scope.row.status === 4"
                        size="mini"
                        type="danger"
                        >已退回</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        @click="onEditRow(scope.row)"
                        >{{
                          scope.row.status === 4 ? "重新提交" : "编辑"
                        }}</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        @click="onDelRow(scope.row)"
                        >删除</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        @click="onDetail('detail', scope.row)"
                        v-if="
                          scope.row.startable === false &&
                          scope.row.status !== 4
                        "
                        >详情</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        @click="onStart(scope.row, startFlowLabel)"
                        v-if="scope.row.startable === true"
                        >{{ startFlowLabel }}</el-button
                      >
                      <el-button
                        type="text"
                        size="mini"
                        @click="onStart(scope.row)"
                        v-if="scope.row.executable === true"
                        >审核</el-button
                      >
                      <template
                        v-for="(item, index) in (pageSetting.formConf ? pageSetting.formConf.buttonList : [])"
                      >
                        <el-button
                          v-bind="item"
                          size="mini"
                          v-if="isShow(scope.row, item, index)"
                          :key="index"
                          @click="excuteBtnWorkOrder(item, scope.row)"
                          >{{ item.title }}</el-button
                        >
                      </template>
                    </template>
                  </el-table-column>
                </template>
              </table-extend>
            </template>
            <template v-else>
              <el-empty description="暂无数据"></el-empty>
            </template>
          </div>
        </template>
        <!-- 报表页面 -->
        <template v-else-if="curpageType === PageType.REPORT_PAGE">
          <div class="right-header">
            <menu-header :paths="moduleLayout.paths"></menu-header>
          </div>
          <report-view></report-view>
        </template>
        <template
          v-else-if="curpageType === PageType.EMBEDDED_PAGE && iframeShow"
        >
          <div class="right-header">
            <menu-header :paths="moduleLayout.paths"></menu-header>
          </div>
          <iframe
            :src="embedPageUrl"
            style="height: 100%; width: 100%; border: none;"
          />
        </template>
        <!-- <template v-else>
          <el-result icon="error" title="无效页面" subTitle="无知无效页面"></el-result>
        </template>-->
      </div>
    </div>
    <model-form
      v-model:visible="pageSetting.visible"
      :title="pageSetting.title"
      :type="pageSetting.type"
      :formConf="pageSetting.formConf"
      :formData="form.formData"
      :componentList="pageSetting.componentList"
      @onSubmit="onSubmit"
      ref="modelFormRef"
    >
      <template #otherBtn v-if="form.formData.status === 4">
        <el-button type="primary" @click="reSubmit">重新提交</el-button>
      </template>
    </model-form>
  </div>
  <div class="fixedDialog">
    <el-dialog
      v-if="curpageType == PageType.FLOW_PAGE"
      width="800px"
      v-model="processvisible"
      destroy-on-close
    >
      <template v-slot:title>
        <dialog-title
          :title="detailType === 'detail' ? '流程详情' : '流程审核'"
        ></dialog-title>
      </template>

      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane
          :label="ele.name"
          :name="`${index}`"
          v-for="(ele, index) in variables.__FormList__"
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
        <el-tab-pane
          label="流程图"
          name="processIntanceImage"
          v-if="detailType === 'detail'"
        >
          <el-scrollbar>
            <img class="process-image" :src="variables.imageUrl" alt="流程图" />
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane
          :label="flowable.tabName"
          name="exec"
          v-if="detailType !== 'detail'"
        >
          <div class="columRow">
            <top-form
              :formConf="flowable.formConf"
              :componentList="flowable.componentList"
              :formData="form.formData"
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
          >{{ item.nameSpace }}</el-button
        >
      </template>
      <template #footer v-else>
        <el-button icon="el-icon-close" @click="processvisible = false"
          >关闭</el-button
        >
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

  <print-form v-show="false" :form-data-list="printData"></print-form>
</template>

<script lang="ts" setup>
import { reactive, ref, nextTick, provide, watch, computed, unref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import useEmitter from "@/use/useEitter";
import useComponentEmit from "@/viewHooks/use-component-emit";
import useInitComponentData from "@/viewHooks/use-init-component";
import { useModuleList, useFlowable, useFunctionModel } from "./useModuleList";
import useTableExtend from "@/use/useTableExtend";
import usePrint from "@/use/usePrint";
import topForm from "@/components/moduleform/form.vue";
import modelForm from "@/components/moduleform/index.vue";
import tableEditForm from "@/components/moduleform/index.vue";
import menuHeader from "@/components/moduleMenu/header.vue";
import moduleMenu from "@/components/moduleMenu/menus.vue";
import reportView from "@/components/reportView/index.vue";
import AdvancedSearch from "@/components/advancedSearch/index.vue";
import printForm from "@/components/modules/apps/printOrderForm.vue";

import {
  getAppInfoById,
  getPageSetData,
  exportData,
  getTempExcel,
  importExcel,
  pageDelData,
  pageUpdateData,
  pageAddData,
  getModelConditions,
  getPageCfgByTableId,
  getOrderPrintData,
  timeSubtract,
} from "@/api/homeApi/index";
import { confirmBox, deepClone, messageAlert } from "@/utils/utils";
import { startFlowable, reSubmitFlowable } from "@/api/flowable";
import { PageType } from "./types";
import { PenetratePageType } from "@/components/designComponent/enum";
import useEitter from "@/use/useEitter";
import { getfunctionModel } from "@/api/functionModel";

export type SubmitParams = {
  /**表单数据 */
  jsonDATA: any;
  /**模块ID */
  modelId: number | string;
  /**页面ID */
  pageId: number | string;
  /**更新数据的ID */
  updateId?: number;
  /**删除数据ID列表 */
  deleteIds?: number[];
  /**从表数据 */
  tableDataEntities?: TabTableData[];
};
/**提交表单从表数据结构 */
type TabTableData = {
  /**从表绑定主表字段 */
  masterFieldName: string;
  /**从表数据 */
  tableData: any[];
  /**从表ID */
  tableId: string | number;
  /**从表名称 */
  tableName: string;
  /**从表关联字段 */
  slaveFieldName: string;
};

const printData = ref<any[]>([]);

const store = useStore();
// 布局处理
const {
  moduleLayout,
  topSetting,
  pageSetting,
  setPaths,
  initHeaderNav,
  initPageConfig,
  rowFormTransform,
  multipleValueComponentTransform,
  resetTopSetting
} = useModuleList();
// 工作流操作
const {
  flowable,
  exectId,
  detailType,
  processvisible,
  processDefinitionId,
  activeName,
  buttonList,
  startFlowLabel,
  flowableDetail,
  doneFlowable,
  getflowableFormDetail,
  flowableExcute,
  flowableExcuteForm,
} = useFlowable();

//表格处理
const {
  tableOption,
  selectIds,
  handleSelectionChange,
  resetTableOption,
} = useTableExtend();
// 组件初始化相关
const {
  initComponentData,
  selectInit,
  tabTableInit,
  treeInit,
  transformDataSourceOfTableData,
} = useInitComponentData();
// 组件事件相关
const {
  loadDialogSelectData,
  createAutoCode,
  fillDialogSelectData,
  delTabTableData,
  editTabTableData,
  viewDetailTabTableData,
  addTabTableData,
} = useComponentEmit();
// 计算模型相关
const {
  tabTableData,
  getPageFunctionModelList,
  relFunctionModel,
} = useFunctionModel();
const rowList = reactive({
  options: [],
});

const componentsConfig = ref<any>([]);

provide("parent", { getInfoByappid, tableRowClick });

provide("table-components", pageSetting);

// 全局事件定义

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
  {
    key: "on-edit-tabtable-data",
    value: (e) => editTabTableData(e, tableForm),
  },
  // 主从表数据--查看详情
  {
    key: "on-viewDetail-tabtable-data",
    value: (e) => viewDetailTabTableData(e, tableForm),
  },
  // 新增主从表数据
  { key: "on-add-tabtable-data", value: (e) => addTabTableData(e, tableForm) },
  // 表单配置按钮  按钮执行事件
  { key: "on-do-event", value: excuteBtn },
  // 更新后表单配置按钮  按钮执行事件
  { key: "on-do-event-btnform", value: excuteBtnForm },
  // 树形组件加载
  { key: "on-load-tree", value: (e) => treeInit(e, curpageType.value) },
  // 从表点击编辑,主表按钮变成保存按钮
  { key: "on-change-tabtablebtn", value: changeTabTableBtn },
]);

const mitter = useEitter();

// 当前的页面类型
const curpageType = ref<any>(null);
// 嵌入页面URL
const embedPageUrl = ref<string>("");
//是否在本页面通过iframe展示
const iframeShow = ref<boolean>(false);
// 左侧菜单模块加载loading/*  */
const modulesLoading = ref<boolean>(false);
//表格数据加载框
const route = useRoute();

const router = useRouter();

const variables = reactive({
  __FormList__: [],
  imageUrl: "",
});

// 控制添加按钮，默认为true
const addable = ref<boolean>(true);

// 选中的tab
const app = reactive({
  name: undefined,
  models: [] as any[],
});

// 编辑时表单对象
const form = reactive<any>({
  formData: {},
});
//弹框
const modelFormRef = ref<any>(null);

//筛选条件
const modelConditionList = ref<any>([]);
// 分页器
const pageRequest = { pageIndex: 1, pageSize: 15 };

let filterColumns = {};
let requestConditions = [];

// 页面参数
const pageParmas = reactive({
  pageName: "",
  pageTableName: "",
  modelName: "",
  modelId: route.query.modelid || "",
  pageId: "",
  file: "",
});

const filterlist = reactive({
  filterName: "",
  filterCompare: "",
  private: [],
});

const tableForm = reactive({
  visible: false,
  title: "",
  type: "",
  size: 0,
  formType: 1, // 1：新增；2：编辑
  formConf: undefined,
  tableId: undefined,
  componentList: [],
  formData: {},
  options: {},
});

// 点击页面切换,更改当前的显示页面
const pageChange = (model, page) => {
  pageParmas.pageTableName = page.pageTableName;
  pageParmas.pageName = page.pageName;
  pageParmas.modelName = model.modelName;
  pageParmas.pageId = page.id;
  pageParmas.modelId = model.id;
  filterColumns = {};
  curpageType.value = page.pageType;
  if (curpageType.value === PageType.EMBEDDED_PAGE) {
    embedPageUrl.value = page.url + `&token=${page.token}`;
    router.replace({
      path: "/pages/moduledetaillist",
      query: {
        appid: route.query.appid,
        modelid: pageParmas.modelId,
        pageId: page.url + `&token=${page.token}`,
      },
    });
    if (page.openType == 1) {
      iframeShow.value = false;
      window.open(embedPageUrl.value, "_blank");
    }
    if (page.openType == 0) {
      iframeShow.value = true;
    }
  }

  if (
    curpageType.value === PageType.FORM_PAGE ||
    curpageType.value === PageType.FLOW_PAGE
  ) {
    router
      .replace({
        path: "/pages/moduledetaillist",
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
  if (curpageType.value === PageType.REPORT_PAGE) {
    const { appid, modelid, pageId } = route.query;
    router.replace({
      path: "/pages/moduledetaillist",
      query: {
        appid: route.query.appid,
        modelid: pageParmas.modelId,
        pageId: pageParmas.pageId,
      },
    });
  }
};

let advancedCondition;
//高级筛选回调
const onAdvancedSearch = (value) => {
  advancedCondition = value;
  reloadTable();
};
// 点击搜索
const onSearch = () => {
  modelConditionList.value.forEach((element, index) => {
    requestConditions.push({
      fieldName: element.opFields.fieldName,
      type: element.type,
      param:
        element.type == 0
          ? element.opFields.fieldValue
            ? element.opFields.fieldValue.split(",")
            : []
          : element.opFields.fieldValue,
    });
  });

  filterColumns = topSetting.formData || {};
  pageSetting.reload = false;
  reloadTable();
};

// 新增数据弹框
const onAddRow = () => {
  store.commit("apps/setDesignStatus", false);
  initComponentData(pageSetting.componentList, "add");
  multipleValueComponentTransform(pageSetting.componentList);
  pageSetting.title = `新增 ${app.name} / ${pageParmas.modelName} / ${pageParmas.pageName}`;
  pageSetting.visible = true;
  form.formData["id"] = undefined;
  exectId.value = undefined;
  // 自编码数据
  autoCreateData(pageSetting.componentList);
};

//excel下载
const onDownload = async () => {
  filterColumns = topSetting.formData || {};
  pageSetting.reload = false;
  pageSetting.visible = false;
  pageSetting.type = "";
  pageSetting.size = 0;
  pageSetting.formConf = undefined;
  pageSetting.componentList = [];
  tableOption.tableLoading = true;
  let para = {
    dataRequest: {
      modelId: pageParmas.modelId,
      pageId: pageParmas.pageId,
      filterColumns,
      sortFileId: pageSetting.sortField,
      sortOrder: pageSetting.sortType,
    },
    pageRequest: pageRequest,
  };

  const res = await exportData(para);

  if (res.code == 200) {
    tableOption.tableLoading = false;
    reloadPage();
  }
};
//excel模板下载
const onDownloadTemplate = async () => {
  let params = {
    pageId: pageParmas.pageId,
  };
  const res = await getTempExcel(params);
  if (res.code == 200) {
    tableOption.tableLoading = false;
  }
};
//文件上传之前
const beforeUpload = (file) => {
  let isExcel = true;
  const typeList = ["xlsx", "xls"];
  const Excel = file.name.substring(file.name.lastIndexOf(".") + 1);
  const isLt2M = file.size / 1024 <= 500;

  if (!typeList.includes(Excel)) {
    messageAlert("error", "请先下载模板再上传的文件,且只能是xlsx或者是xls格式");
    isExcel = false;
  }
  if (!isLt2M) {
    messageAlert("error", "上传的文件excel文件大小不能超过500M");
  }
  return isLt2M && isExcel;
};

//根据下载的模板填入数据并上传excel表格
const uploadFunc = async (fileOptions: any): Promise<void> => {
  tableOption.tableLoading = true;
  const formData = new FormData();
  formData.append("file", fileOptions.file);
  formData.append("pageId", pageParmas.pageId);
  formData.append("modelId", pageParmas.modelId);

  const res = await importExcel(formData);
  if (res.code == 200) {
    messageAlert("success", "导入成功");
    tableOption.tableLoading = false;
    getPageSet();
  } else {
    tableOption.tableLoading = false;
  }
};
// 查看详情
const viewDetails = (row) => {
  pageSetting.formConf.disabled = true;
  initComponentData(pageSetting.componentList, "edit", row);
  pageSetting.title = `详情信息 ${app.name} / ${pageParmas.modelName} / ${pageParmas.pageName}`;
  pageSetting.visible = true;

  exectId.value = row.id;
  nextTick(() => {
    form.formData = rowFormTransform(row, pageSetting.componentList);
    initTableComponentData(form.formData, pageSetting.componentList);
  });
};
//编辑一条数据弹框
const onEditRow = (row) => {
  pageSetting.formConf.disabled = false;
  initComponentData(pageSetting.componentList, "edit", row);
  pageSetting.title = `${row.status === 4 ? "重新提交" : "编辑"} ${
    app.name
  } / ${pageParmas.modelName} / ${pageParmas.pageName}`;
  pageSetting.visible = true;

  exectId.value = row.id;
  nextTick(() => {
    form.formData = rowFormTransform(row, pageSetting.componentList);
    initTableComponentData(form.formData, pageSetting.componentList);
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
    onDetail("exec", row);
    getflowableForm(row, para);
  }
};

function onDone(item) {
  doneFlowable(item).then(() => {
    getPageSet();
  });
}

//获取执行流程的表单详情
const getflowableForm = async (row: any, para) => {
  getflowableFormDetail(row, para);
};

// 单个删除
const onDelRow = (row: any) => {
  selectIds.value = [row.id];
  delDatas();
};

/**
 * 详情
 */
const onDetail = async (type, row: any) => {
  if (type === "detail") {
    activeName.value = "0";
  } else {
    activeName.value = "exec";
  }
  flowableDetail(row, type);
};

// 批量删除
function onBatchDelete() {
  if (!selectIds.value || selectIds.value?.length == 0) {
    messageAlert("error", "请选择要删除的数据");
    return;
  } else {
    delDatas();
  }
}

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

// 菜单点击
function onMenuClick(menu: any) {
  for (let i = 0; i < app.models.length; i++) {
    const model = app.models[i];
    if (!model.appPagesList) continue;
    for (let j = 0; j < model.appPagesList.length; j++) {
      const page = model.appPagesList[j];
      const keys = menu.key.split("_");
      const menuKey = keys && keys[1];
      if (page.id == menuKey) {
        moduleLayout.paths = [
          { name: app.name, path: "/apps" },
          { name: model.modelName },
          { name: page.pageName },
        ];
        moduleLayout.activeMenu = `${model.id} _${page.id} `;
        pageChange(model, page);
        return;
      }
    }
  }
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
      processInstanceId: form.formData.processInstanceId,
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
const delDatas = async () => {
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
  initComponentData(topSetting.componentList);
};

// 获取页面配置属性数据
const getPageSet = async () => {
  // 弹框
  pageSetting.visible = false;
  pageSetting.type = "";
  pageSetting.size = 0;
  pageSetting.formConf = undefined;
  pageSetting.componentList = [];
  tableOption.tableLoading = true;
  const relationalData = {};
  const selectFields: Array<string> = [];
  Object.keys(route.query).forEach((key) => {
    if (!["appid", "modelid", "pageId"].includes(key)) {
      relationalData[key] = route.query[key];
      selectFields.push(key);
    }
  });
  let para = {
    dataRequest: {
      modelId: pageParmas.modelId,
      pageId: pageParmas.pageId,
      filterColumns,
      sortFileId: pageSetting.sortField,
      sortOrder: pageSetting.sortType,
      filterParmas: filterlist,
      filterType: {},
      requestConditions: requestConditions,
      relationalData,
      selectFields,
      relationalPageId: pageParmas.pageId,
      conditions: advancedCondition || null,
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
      initPageConfig(tableOption, res);
      console.log('topSetting', topSetting)
      console.log('pageSetting', pageSetting)
      // 数据加载成功后，根据需要加载搜索栏（如果已加载，则不再执行加载）
      pageSetting.reload && initComponentData(topSetting.componentList);
      if (pageItems.components) {
        rowList.options = [];
        componentsConfig.value = pageItems.components;
        pageItems.components.forEach((element) => {
          rowList.options.push({
            label: element.__form__.label,
            value: element.__vModel__,
            type: element.componentTag,
          });
        });
      }
    }
  }
  requestConditions = [];
  tableOption.tableLoading = false;
};

//根据appid  获取应用信息和左侧菜单信息
async function getInfoByappid() {
  const { appid, modelid, pageId } = route.query;
  let para = {
    applicationId: appid,
    isActive: 1,
  };
  modulesLoading.value = true;
  const res = await getAppInfoById(para);
  if (res.code == 200) {
    const { appName, models } = res.data;
    app.name = appName;
    app.models = models;
    // 当有模块id的时候设置默认展开项对应到具体模块的第一个页面
    if (!app.models || app.models.length === 0) {
      modulesLoading.value = false;
      return;
    }
    // 设置菜单数据源
    setPaths(app.models);
    const currentModel = modelid
      ? app.models.find((f) => f.id == modelid)
      : app.models[0];
    if (!currentModel) {
      modulesLoading.value = false;
      return;
    }
    initHeaderNav(appName, currentModel, pageId as string);
    if (!currentModel.appPagesList || currentModel.appPagesList.length === 0) {
      tableOption.tableColums = [];
      modulesLoading.value = false;
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
    pageParmas.pageTableName = page.pageTableName;
    pageParmas.pageName = page.pageName;
    pageParmas.modelName = currentModel.modelName;
    pageParmas.modelId = currentModel.id;
    curpageType.value = page.pageType;

    if (
      curpageType.value === PageType.FORM_PAGE ||
      curpageType.value === PageType.FLOW_PAGE
    ) {
      reloadPage();
    } else if (curpageType.value == PageType.REPORT_PAGE) {
      router.replace({
        path: "/pages/moduledetaillist",
        query: {
          appid: appid,
          modelid: pageParmas.modelId,
          pageId: pageParmas.pageId,
        },
      });
    } else if (curpageType.value === PageType.EMBEDDED_PAGE) {
      embedPageUrl.value = page.url + `&token=${page.token}`;
      router.replace({
        path: "/pages/moduledetaillist",
        query: {
          appid: appid,
          modelid: pageParmas.modelId,
          pageId: embedPageUrl.value,
        },
      });

      if (page.openType == 1) {
        iframeShow.value = false;
        window.open(embedPageUrl.value, "_blank");
      }
      if (page.openType == 0) {
        iframeShow.value = true;
      }
    } else {
      messageAlert("error", "当前页面类型不能展示哦");
    }
  }
  modulesLoading.value = false;
}

/**
 * 初始化表格组件数据
 */
function initTableComponentData(row: any, components: any[]) {
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
            transformDataSourceOfTableData(
              componentList,
              table.dataSource || []
            );
          });
        }
      });
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
        formModel: form.formData,
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
  });
}
function changeTabTableBtn() {
  pageSetting.formConf.disabled = false;
}
// 更新后的按钮执行
function excuteBtnForm(item: any) {
  flowableExcuteForm(item, pageParmas.pageId).then(() => {
    if (item.eventCode == "IMPORT_WORK") {
      initTableComponentData(form.formData, pageSetting.componentList);
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
  });
}

async function excuteBtnWorkOrder(item: any, data: any) {
  exectId.value = data.id;
  // 打印功能
  if (item.eventCode === "PRINT_WORK") {
    const res = await getOrderPrintData({ ids: [data.id] });
    if (res.code == 200) {
      printData.value = res.data || [];
      if (printData.value.length === 0) {
        messageAlert("error", "无效工单数据，不允许打印");
        return;
      }
      nextTick(() => {
        onPrint();
      });
    }
  } else {
    item.data = data;
    excuteBtnForm(item);
  }
}

const copyTableForm = reactive({
  visible: false,
  title: "",
  type: "",
  size: 0,
  formType: 1,// 1：新增；2：编辑
  formConf: undefined,
  tableId: undefined,
  componentList: [],
  formData: {},
  options: {},
});

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
async function onSubmitTableForm(tableForm:any) {
  const res = await timeSubtract({
    tableId: tableForm.tableId,
    data: tableForm.formData,
  });
  if (res.code == 200) {
    tableForm.formData = res.data.data;
  }
  // 将数据添加到从表表格中
  const { selectModelList, dataSourceList } = tableForm.options as any;
  if (!selectModelList) {
    await submitForm(tableForm.formData, null, tableForm.tableId, tableForm);
    tableForm.visible = false;
    tabTableInit(form.formData, tableForm.options);
    return;
  }
  const selectModel = selectModelList.find(
    (f) => f.config[0].id == tableForm.tableId
  );
  const optionId = selectModel.pid;
  const tableName = selectModel.config[0].tableName;
  const dataSource = dataSourceList.find((f) => f.pid == optionId).dataSource;
  let row: any = {};
  // 新增
  if (tableForm.formType === 1) {
    row.key_id = `${+new Date()}`;
    Object.keys(tableForm.formData).forEach((key: string) => {
      const value = tableForm.formData[key];
      row[`${tableName}#${key}`.toLocaleUpperCase()] = Array.isArray(value)
        ? JSON.stringify(value)
        : value;
      row[`${tableName}#${key}_key`] && delete row[`${tableName}#${key}_key`];
      row[`${tableName}#${key}_dialogSelect`] &&
        delete row[`${tableName}#${key}_dialogSelect`];
    });
    dataSource.push(row);
  } else {
    // 编辑
    if ((<any>tableForm.formData).key_id) {
      row = dataSource.find(
        (f) => f.key_id === (<any>tableForm.formData).key_id
      );
      row &&
        Object.keys(tableForm.formData).forEach((key: string) => {
          const value = tableForm.formData[key];
          row[`${tableName}#${key}`.toLocaleUpperCase()] = Array.isArray(value)
            ? JSON.stringify(value)
            : value;
          row[`${tableName}#${key}_key`] &&
            delete row[`${tableName}#${key}_key`];
          row[`${tableName}#${key}_dialogSelect`] &&
            delete row[`${tableName}#${key}_dialogSelect`];
        });
    }
  }
  // 保存时使用
  tabTableData.value = deepClone(dataSourceList);
  // 数据加工-表格呈现
  tableForm.componentList.map((component: any) => {
    const field = `${tableName}#${component.__vModel__}`.toLocaleUpperCase();
    component.__vModel__ = field;
  });
  transformDataSourceOfTableData(tableForm.componentList, [row]);
  let formData: any = form.formData;
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
  ModelConditions();
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
  advancedCondition = "";
}

/**
 * 模型筛选条件
 */
async function ModelConditions() {
  const res = await getModelConditions({ pageId: pageParmas.pageId });
  if (res.code == 200) {
    modelConditionList.value = [];
    res.data.forEach((element) => {
      modelConditionList.value.push(element);
    });
  }
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
        path: "/pages/moduledetaillist",
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

function isShow(formData, item, index) {
  if (item.eventCode == "IMPORT_WORK") {
    return true;
  }
  if (!formData.hasOwnProperty("workOrderStatus")) {
    return formData.buttonList ? formData.buttonList[index].show : false;
  }
  if (item.eventCode == "OTHER_WORK") {
    return formData.buttonList ? formData.buttonList[index].show : false;
  }
  if (formData.workOrderStatus == null) {
    return false;
  }
  if (item.eventCode == "START_WORK") {
    if (formData.workOrderStatus == "0") {
      return true;
    } else {
      return false;
    }
  }
  if (item.eventCode == "FINISH_WORK") {
    if (formData.workOrderStatus == "1") {
      return true;
    } else {
      return false;
    }
  }
  if (item.eventCode == "REPORT_WORK") {
    if (formData.workOrderStatus == "1") {
      return true;
    } else {
      return false;
    }
  }
}

/**保存获取从表数据 */
function getTabTableData(tableData:any): TabTableData[] {
  const tableDataEntities: TabTableData[] = [];
  const tabTableConfig = (tableData ? tableData.componentList : <any[]>pageSetting.componentList).find(
    (f) => f.componentTag === "designTabTable"
  );
  if (tabTableConfig) {
    const {
      dataSourceList,
      relFields,
      tabOptions,
      selectModelList,
    } = tabTableConfig;
    for (let i = 0; i < tabOptions.length; i++) {
      const { id: pid } = tabOptions[i];
      const relField = relFields.find((f) => f.pid == pid);
      const selectModel = selectModelList.find((f) => f.pid == pid);
      const dataSource = dataSourceList.find((f) => f.pid == pid);
      const postData = deepClone(dataSource || []);
      for (let j = 0; j < postData.dataSource.length; j++) {
        const row = postData.dataSource[j];
        Object.keys(row).forEach((key: string) => {
          if (row[`${key}_key`] != undefined) {
            row[key] = row[`${key}_key`];
            delete row[`${key}_key`];
          } else if (row[`${key}_dialogSelect`]) {
            row[key] = row[`${key}_dialogSelect`]
            delete row[`${key}_dialogSelect`]
          }
        });
      }
      tableDataEntities.push({
        masterFieldName: relField.masterField || "id",
        tableId: selectModel.config[0].id,
        tableName: selectModel.config[0].tableName,
        tableData: postData.dataSource,
        slaveFieldName: relField.field,
      });
    }
  }
  return tableDataEntities;
}

// 批量打印
async function onBatchPrint() {
  if (!selectIds.value || selectIds.value?.length == 0) {
    messageAlert("error", "请选择要打印的数据");
    return;
  } else {
    const res = await getOrderPrintData({ ids: selectIds.value });
    if (res.code == 200) {
      printData.value = res.data || [];
      nextTick(() => {
        onPrint();
      });
    }
  }
}

function onPrint() {
  const { print: printHtml } = usePrint();
  const printForm = document.querySelector("#print-order-list");
  printForm && printHtml(printForm.innerHTML);
}

getInfoByappid();
</script>

<style lang="scss" scoped>
@import "@/styles/modules/pagelist/moduledetaillist.scss";
</style>

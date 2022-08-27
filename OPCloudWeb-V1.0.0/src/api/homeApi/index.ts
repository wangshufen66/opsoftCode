import request, { ResponseType } from "@/utils/request";

//使用者
const userbase = "/api/opcloud/application";

//应用操作者
const adminbase = "/api/opcloud/lcdp";
// 获取应用列表
export const getHomepage = (params?: any): Promise<ResponseType> =>
  request().get(`${userbase}/apps/homepage`, {
    params: params,
  });
// 获取应用列表
export const getAppList = (params?: any): Promise<ResponseType> =>
  request().get(`${userbase}/apps/getlist`, {
    params: params,
  });
//==============================================================================
  // 生产开工列表
export const getStartsOrderList = (params?: any): Promise<ResponseType> =>
request().get(`${adminbase}/adjust/getStartsOrder`, {
  params: params,
});
//生产开工数量调整
export const adjustStartsOrder = (params?: any): Promise<ResponseType> =>
request().post(`${adminbase}/adjust/adjustStartsOrder`, 
   params,
);
//生产汇报列表
export const getReportOrderList = (params?: any): Promise<ResponseType> =>
request().get(`${adminbase}/adjust/getReportOrder`, {
  params: params,
});
//生产汇报数量调整
export const adjustReportOrder = (params?: any): Promise<ResponseType> =>
request().post(`${adminbase}/adjust/adjustReportOrder`, 
   params,
);

//委外计划数量列表
export const getOutsourceProcess = (params?: any): Promise<ResponseType> =>
request().get(`${adminbase}/adjust/getOutsourceProcess`, 
{params:params},
);
//委外计划数量调整
export const adjustOutsourceProcess = (params?: any): Promise<ResponseType> =>
request().post(`${adminbase}/adjust/adjustOutsourceProcess`, 
params,
);

//委外发出数量调整列表
export const getOutsourceOut = (params?: any): Promise<ResponseType> =>
request().get(`${adminbase}/adjust/getOutsourceOut`, 
{params:params},
);
//委外发出数量调整
export const adjustOutsourceOut = (params?: any): Promise<ResponseType> =>
request().post(`${adminbase}/adjust/adjustOutsourceOut`, 
params,
);
//委外接收数量调整列表
export const getOutsourceReceive = (params?: any): Promise<ResponseType> =>
request().get(`${adminbase}/adjust/getOutsourceReceive`, 
{params:params},
);
//委外接收数量调整
export const adjustOutsourceReceive = (params?: any): Promise<ResponseType> =>
request().post(`${adminbase}/adjust/adjustOutsourceReceive`, 
params,
);

//调整记录

export const getAdjustRecordList = (params?: any): Promise<ResponseType> =>
request().get(`${adminbase}/adjustRecord/getAdjustRecordList`, 
{params:params},
);
  //==============================================================================

// 应用开发下的获取应用列表
export const getAppListByDev = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apps/getlist`, {
    params: params,
  });
// 获取某个应用的信息
export const getAppInfoById = (params?: any): Promise<ResponseType> =>
  request().get(`${userbase}/apps/get`, {
    params: params,
  });
// 应用操作下获取某个应用的信息
export const getAppById = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apps/get`, {
    params: params,
  });
// 删除应用列表
export const delAppInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/apps/del`, params);

// 修改更新应用列表
export const updateAppInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/apps/update`, params);

// 新增应用列表
export const addAppList = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/apps/add`, params);

// ==========应用下的模块操作=======

// 获取模块列表
// export const getModelList = (params?: any) => request().get(`/opcloud/modes/getlist`, {
//   params: params
// });
// 分页获取模块列表
export const getModelListBypage = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/modes/pagelist`, params);

// 删除一个模块
export const delModelInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/modes/del?modelid=${params.modelid}`, params);

// 批量删除模块
export const delModels = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/modes/batchDel`, params);

// 修改更新模块
export const updateModelInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/modes/update`, params);

// 新增模块
export const addModel = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/modes/add`, params);

// ============模块下的页面操作接口=============

// 分页获取模块下页面列表
export const getPagesBypage = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/pagelist`, params);
// 获取某个页面的信息
export const getPageById = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/get`, {
    params: params,
  });
// 删除页面
export const delPageById = (params?: any): Promise<ResponseType> =>
  request().post(
    `${adminbase}/apppage/del?appPageId=${params.appPageId}`,
    params
  );

// 批量删除页面
export const delPages = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/batchDel`, params);

// 根据页面id修改更新页面,更新应用页面，不包括更新应用页面所含的组件
export const updatePageById = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/update`, params);

// 新增模块下页面
export const addPages = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/add`, params);

//更新应用页面所包含的组件
export const updatePageItemById = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/updateitems`, params);
/**
 * 暂存组件配置
 */
export const tempSavePageComponet = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/apppage/storage", params);
// ============获取页面配置数据模块===========

// 根据页面id获取页面配置属性数据
export const getPageSetData = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/appdata/get`, params);

// 根据页面id获取页面配置导出数据
export const exportData = (params?: any): Promise<ResponseType> =>
  request({ responseType: "blob" }).post(`${userbase}/appdata/export`, params);

//根据pageid下载页面表格模板
export const getTempExcel = (params?: any): Promise<ResponseType> =>
  request({ responseType: "blob" }).get(`${userbase}/appdata/getTempExcel`, {
    params,
  });

//根据下载的模板导入数据
export const importExcel = (params?: any): Promise<ResponseType> =>
  request({ contentType: "multipart/form-data" }).post(
    `${userbase}/appdata/importExcel`,
    params
  );

//生产订单的导入
export const importOrder = (params?: any): Promise<ResponseType> =>
  request({ contentType: "multipart/form-data" }).post(
    `/api/opcloud/lcdp/appdata/importOrder`,
    params
  );

//工艺流程的导入
export const importRoute = (params?: any): Promise<ResponseType> =>
  request({ contentType: "multipart/form-data" }).post(
    `/api/opcloud/lcdp/appdata/importRoute`,
    params
  );

//生产订单和工艺模板下载
export const getOrderRouteTempExcel = (params?: any): Promise<ResponseType> =>
  request({ responseType: "blob" }).get(
    `${adminbase}/appdata/exportExcelTemplate`,
    {
      params,
    }
  );

//根据页面id获取页面配置可作为搜索条件的数据
export const getInSearchData = (params?: any): Promise<ResponseType> =>
  request().get(`${userbase}/apppage/filters`, params);

//生产汇报更新汇报数量
export const getReportNumber = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/appdata/getReportNumber`, 
     params,
  );

// 根据页面id获取页面配置列表数据

export const pageAddData = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/appdata/add`, params);

// 根据页面id删除页面配置列表数据
export const pageDelData = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/appdata/delete`, params);

// 根据页面id修改更新页面配置列表数据
export const pageUpdateData = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/appdata/update`, params);

//  // 根据外键关联的字段查询级联数据，维护数据时用
export const pageCascadeData = (params?: any): Promise<ResponseType> =>
  request().post(`${userbase}/appdata/cascade`, params);

// ============消息内容管理===========

// 获已发布取消息列表
export const getNewsPublish = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/pageMessage/publish`, {
    params: params,
  });
//字典表列表
export const getDictionary = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/pageMessage/getDictionary`, {
    params: params,
  });
// 获取消息列表
export const getNewsList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/pageMessage/getList`, {
    params: params,
  });
// 获取某个消息的详情
export const getNewsInfoById = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/pageMessage/getDetail`, {
    params: params,
  });
// 删除某个消息
export const delNewsInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/pageMessage/del`, params);

// 修改更新某个消息
export const updateNewsInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/pageMessage/update`, params);

// 新增某个消息
export const addNewsList = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/pageMessage/add`, params);

// =============分页获取数据库表，数据库表里面的字段，显示名称等数据 =========

// 获取外键表的数据
export const getTablesBypage = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/tables`, params);
// 换算组件获取外键表的数据
export const getCalTablesBypage = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/formulaTable`, { params });
// 获取外键表里面的字段数据

export const getfieldsByTableId = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/fields`, { params: params });

//获取下一张表
export const getNextTable = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/nextTables`, { params: params });

// 根据外键关联的字段查询下拉数据，维护数据时用

export const getRelatedBypage = (params?: any): Promise<ResponseType> =>
  request().post(`${adminbase}/appdata/related`, params);

// ==========================上传图片文件===========================

export const uploadBgImage = (params?: any): Promise<ResponseType> =>
  request({ contentType: "multipart/form-data" }).post(
    `/api/opcloud/file/upload`,
    params
  );

// ================================自编码相关=======================

export const autoCodeRule = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/appdata/codeRule", params);

// ================================图表设计相关数据=======================

// 更新图表页面组件信息
export const updateEchartsList = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/chartdesign/update`, params);

// 添加图表页面组件信息

export const addEchartsList = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/chartdesign/add`, params);
// 删除图表页面
export const delEchartsList = (params?: any): Promise<ResponseType> =>
  request().post(
    `/api/opcloud/chartdesign/del?pageId=${params.pageId}`,
    params
  );
// 获取图表页面详情
export const getEchartsDetail = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/chartdesign/get`, { params: params });

// 通过sql语句获取图表数据
export const getDataBySql = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/chartdesign/getData`, params);

// 图表页面通过sql获取数据//页面数据
export const getChartData = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/chartdesign/chartdata`, params);

// 获取用户组列表
export const getUserGroupList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/sys/role/list`, { params: params });

// 报表表格通过关联表拼接sql 并获取数据
export const getDataByJointsql = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/chartdesign/jointsql`, params);

// 换算组件公式校验接口
export const getCheckFormula = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/lcdp/appdata/checkFormula`, { params });

/**
 * 主从表数据删除
 */
export const deleteTabTableData = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/table/delete", params);

/**
 * 根据表ID获取页面组件配置
 */
export const getPageCfgByTableId = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/apppage/filters", params);

// 获取按钮事件列表
export const getBtnEventList = (): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/buttonComponent/getEventList");

// 获取按钮执行事件接口
export const doBtnEvent = (params?: any): Promise<ResponseType> =>
  request().post(
    "/api/opcloud/lcdp/buttonComponent/executeButtonEvent",
    params
  );

//表单数据复制
export const getDataCopyList = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/getSyncTables`, { params });

//表单数据复制
export const getCopySelect = (params?: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/getSysncTablesName`, { params });

//表单数据复制详情
export const getDataDetail = (params: any): Promise<ResponseType> =>
  request().get(`${adminbase}/apppage/getSyncTablesDetail`, { params });

//表单数据复制保存
export const saveDataCopy = (params: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/SaveSyncTables`, params);

//表单数据复制删除
export const delDataCopy = (params: any): Promise<ResponseType> =>
  request().post(`${adminbase}/apppage/delSyncTable?id=${params.id}`, params);

//树形组件首层数据
export const getFirstTreeData = (params: any): Promise<ResponseType> =>
  request().get(`${userbase}/appdata/getFirstTreeData`, { params });

//树形组件首层数据
export const getTreeData = (params: any): Promise<ResponseType> =>
  request().get(`${userbase}/appdata/getTreeData`, { params });

//模型筛选条件
export const getModelConditions = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/functionModel/getModelConditions`, { params });

export const getReportFirstTreeData = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/chartdesign/getFirstTreeData`, { params });

//关联模型删除提示
export const deleteComponent = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/lcdp/apppage/deleteComponent`, { params });

/**根据表格ID获取表单结构配置 */
export const getPageItem = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/lcdp/apppage/getPageItem`, { params });
//增加筛选场景  根据字段类型获取中间条件
export const getQueryList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/lcdp/apppage/getQueryList`, { params });

//增加筛选场景
export const insertQueryScheme = (params: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/lcdp/appdata/insertQueryScheme`, params);

//获取筛选场景
export const getQuerySchemeList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/lcdp/appdata/getQuerySchemeList`, { params });

/**
 * 删除场景
 */
export const deleteScheme = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/lcdp/appdata/deleteScheme", params);

/**
 * 更新场景
 */
export const updateQueryScheme = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/lcdp/appdata/updateQueryScheme`, params);

/**获取页面包含结果字段的计算模型 */
export const functionDataList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/functionData/getList`, { params });

/**获取模型计算结果 */
export const realTimeFunctionData = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/realTimeData/get`, params);
/**获取表名前缀 */
export const getApppageSuffix = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/lcdp/apppage/suffix`, { params });
/**获取工单打印数据 */
export const getOrderPrintData = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/application/appdata/printWorkOrder`, params);

/**筛选自定义数据源数据 */
export const getLinkageItemData = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/linkage/itemData", params);

/**工单状态流转  计算时间 */
export const timeSubtract = (params: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/lcdp/appdata/timeSubtract`, params);

/**获取应用菜单 */
export const getAppMenuList = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/application/apps/getMenuList", { params });

/**获取工单工序流程列表 */
export const getOrderProcessList = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/appdata/getProcess", { params });

/**批量委外  发出|接收|检验 */
export const OutSourceBatchEvent = (params?: any): Promise<ResponseType> =>
  request().post(
    "/api/opcloud/lcdp/buttonComponent/executeOutSourceCopyBatchEvent",
    params
  );
/**生产检验  批量检验 */
export const executeUpdateBatchEvent = (params?: any): Promise<ResponseType> =>
  request().post(
    "/api/opcloud/lcdp/buttonComponent/executeUpdateBatchEvent",
    params
  );

export const getPageInfo = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/apppage/config", { params });

/**  生产订单 工序任务中工艺流程导入 */
export const importProcess = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/appdata/importProcess", params);

//云盒清单数据同步
export const IotDataEvent = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/lcdp/buttonComponent/executeIotDataEvent", {
    params,
  });

/**获取工序进度数据 */
export const getProcPercentageData = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/application/linkage/procPercentage", params);

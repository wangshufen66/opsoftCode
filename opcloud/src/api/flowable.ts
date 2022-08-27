import request, { ResponseType } from '@/shared/utils/request';

// 流程设计保存
export const saveModelEditor = (params: any): Promise<ResponseType> =>
  request().put('/flowable/model/saveModelEditor', params);

// 流程定义列表
export const getProcessDefinitionList = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processDefinition/list', { params });

// 激活流�
export const activeProcessDefinition = (params: any): Promise<ResponseType> =>
  request().put('/flowable/processDefinition/activate', params);

// 挂起流程
export const suspendProcessDefinition = (params: any): Promise<ResponseType> =>
  request().put('/flowable/processDefinition/suspend', params);

// 激活流程
export const deplayProcessDefinition = (params: any): Promise<ResponseType> =>
  request().put('/flowable/processInstance/activate', params);

// 获取运行中的流程
export const getProcessInstanceList = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processInstance/list', { params });

// 继续流程
export const startProcessInstance = (params: any): Promise<ResponseType> =>
  request().post('/flowable/processInstance/start', params);

//获取配置数据
export const getRenderedStartForm = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processDefinition/renderedStartForm', { params });

// 挂起流程
export const suspendProcessInstance = (params: any): Promise<ResponseType> =>
  request().put('/flowable/processInstance/suspend', params);

// 流程列表查询
export const getModelList = (params: any): Promise<ResponseType> =>
  request().get('/flowable/model/list', { params });

// 查询流程
export const processInstanceImage = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processInstanceImage', { params });

// 部署流程模型
export const deployModel = (params: any): Promise<ResponseType> =>
  request().post('/flowable/model/deploy', params);

// 删除流程模型
export const deleteModel = (params: any): Promise<ResponseType> =>
  request().delete('/flowable/model/delete', { params });

//流程保存
export const saveModel = (params: any): Promise<ResponseType> =>
  request().post('/flowable/model/save', params);

//导入模型
export const doImportModel = (params?: any): Promise<ResponseType> =>
  request({ contentType: 'multipart/form-data' }).post(
    `/flowable/model/import`,
    params
  );

// 查询单个设计图
export const getModelById = (params: any): Promise<ResponseType> =>
  request().get('/flowable/model/queryById', { params });

//获取执行人、候选用户、候选组
export const getExecUser = (params: any): Promise<ResponseType> =>
  request().get('/flowable/model/getUserAndGroup', { params });

//获取通过字典表配置的下拉列表
export const getProcessType = (params: any): Promise<ResponseType> =>
  request().get('/flowable/codeInfo/getSysCodeInfos', { params });

//获取表单配置表单key
export const getFormKey = (params?: any): Promise<ResponseType> =>
  request().get('/flowable/form/formList', { params });


//发起流程列表
export const startProcess = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processDefinition/listMyself', { params });

//我的待办
export const listTodoList = (params?: any): Promise<ResponseType> =>
  request().get('/flowable/task/listTodo', { params });

//我的已办
export const listDoneList = (params?: any): Promise<ResponseType> =>
  request().get('/flowable/task/listDone', { params });

//取消签收
export const unclaimTask = (params: any): Promise<ResponseType> =>
  request().put('/flowable/task/unclaim', params);

//执行任务
export const executeTaskData = (params: any): Promise<ResponseType> =>
  request().get('/flowable/task/executeTaskData', { params });

//我的待办--执行--提交任务
export const completeTask = (params: any): Promise<ResponseType> =>
  request().put('/flowable/task/complete', params);

//我的待办--执行--终止
export const stopProcessInstance = (params: any): Promise<ResponseType> =>
  request().put('/flowable/task/stopProcessInstance', params);

//我的待办--已阅阿
export const readProcessInstance = (params: any): Promise<ResponseType> =>
  request().put('/flowable/task/read', params);

// 我的已办--查看详情--过程意见
export const getDoneDeatailComments = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processInstance/comments', { params });

// 我的待办--查看详情--流程表单
export const getformData = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processInstance/formData', { params });

// 获取工作流流程列表
export const getFlowablelist = (params: any): Promise<ResponseType> =>
  request().get('flowable/processDefinition/listMyself?latestVersion=true', { params });


// 首页启动工作流程
export const startFlowable = (params: any): Promise<ResponseType> =>
  request().post('/flowable/processInstance/start', params);

// 首页执行工作流程前获取流程配置数据
export const getFlowableData = (params: any): Promise<ResponseType> =>
  request().get('/flowable/task/taskForm', { params });

// 首页执行工作流程
export const doFlowable = (params: any): Promise<ResponseType> =>
  request().put('/flowable/task/complete', params);

// 首页工作流程获取详情
export const getFlowableDetail = (params: any): Promise<ResponseType> =>
  request().get('/flowable/processInstance/formData', { params });

// 首页重新提交流程
export const reSubmitFlowable = (params: any): Promise<ResponseType> =>
  request().post('/flowable/processInstance/updateForm',params)
/* 设备加工信息 */
import axios from "@/libs/api.request";
import store from "../../store/index";
// 分页获取列表
export const findMoList = params => {
  return axios.request({
    url: "/box8303/list",
    method: "get",
    params: params
  });
};

export const getX8303boxList = params => {
  return axios.request({
    url: "/box8303/list",
    method: "get",
    params: params
  });
};

// 详情
export const findMoDetail = id => {
  return axios.request({
    // url: `/box8303/list?id=${id}&orgId=${store.state.user.userInfo.orgId}`,
    url: `/box8303/getDetail/${id}`,
    method: "get"
  });
};

// 添加
export const addMo = data => {
  return axios.request({
    url: "/box8303/saveBox8303",
    method: "post",
    data: data
  });
};

// 更新
export const updateMo = data => {
  return axios.request({
    url: "/box8303/updateBox8303",
    method: "post",
    data: data
  });
};

// 删除
export const deleteMo = data => {
  return axios.request({
    url: "/box8303/delBatchBox8303",
    method: "post",
    data: data
  });
};

// cloudbox batch
export const addX8303boxBatch = data => {
  return axios.request({
    url: "/box8303/saveBatchBox8303",
    method: "post",
    data: data
  });
};

export const getX8303boxBrandList = data => {
  return axios.request({
    url: `/Box8303Brand/list`,
    method: "get",
    params: data
  });
};
export const getConnectionManagementList = params => {
  return axios.request({
    url: "/connection/list",
    method: "get",
    params: params
  });
};

// 获取从机列表

export const getChildDeviceList = data => {
  return axios.request({
    url: `/cloudBox/findCloudboxFromList`,
    method: "get",
    params: data
  });
};

export const addSlaveDevice = data => {
  return axios.request({
    url: "/cloudBox/saveCloudboxFrom",
    method: "post",
    data: data
  });
};

export const updateSlaveDevice = data => {
  return axios.request({
    url: "/cloudBox/saveCloudboxFrom",
    method: "post",
    data: data
  });
};

export const deleteSlaveDevice = data => {
  return axios.request({
    url: "/cloudBox/delCloudboxFrom",
    method: "post",
    data: data
  });
};

export const enableSlaveDevice = data => {
  return axios.request({
    url: "/cloudBox/effectCloudboxFrom",
    method: "post",
    data: data
  });
};

export const sendSlaveDevice = data => {
  return axios.request({
    url: "/cloudBox/sendCloudboxFrom",
    method: "post",
    data: data
  });
};

export const getConfigList = data => {
  return axios.request({
    url: `/cloudBox/getCloudboxLink`,
    method: "get",
    params: data
  });
};

export const getConfigStatus = data => {
  return axios.request({
    url: "/cloudBox/sendGetMac",
    method: "post",
    data: data
  });
};
export const reloadConfig = data => {
  return axios.request({
    url: "/cloudBox/restartCloudbox",
    method: "post",
    data: data
  });
};
export const saveConfig = data => {
  return axios.request({
    url: "/cloudBox/editCloudboxLink",
    method: "post",
    data: data
  });
};
export const dispatchConfig = data => {
  return axios.request({
    url: "/cloudBox/sendCloudboxLink",
    method: "post",
    data: data
  });
};

import axios from '@/libs/api.request'

/* 云盒绑定 */
// 获取用户绑定的云盒列表
export const findBindCloudboxList = info => {
	return axios.request({
		url: '/cloudbox/findBindCloudboxList',
		params: info,
		method: 'get'
	})
}
// 编辑云盒的绑定信息
export const editCloudboxBind = info => {
	return axios.request({
		url: '/cloudbox/editCloudboxBind',
		data: info,
		method: 'post'
	})
}
// 云盒解除绑定
export const unbindCloudbox = info => {
	return axios.request({
		url: '/cloudbox/unbindCloudbox',
		data: info,
		method: 'post'
	})
}
// 获取云盒从机列表
export const findCloudboxFromList = info => {
	return axios.request({
		url: '/cloudbox/findCloudboxFromList',
		params: info,
		method: 'get'
	})
}
// 保存云盒从机
export const saveCloudboxFrom = info => {
	return axios.request({
		url: '/cloudbox/saveCloudboxFrom',
		data: info,
		method: 'post'
	})
}
// 删除云盒从机
export const delCloudboxFrom = info => {
	return axios.request({
		url: '/cloudbox/delCloudboxFrom',
		data: info,
		method: 'post'
	})
}
// 获取云盒连接属性
export const getCloudboxLink = info => {
	return axios.request({
		url: '/cloudbox/getCloudboxLink',
		params: info,
		method: 'get'
	})
}
// 编辑云盒的连接属性
export const editCloudboxLink = info => {
	return axios.request({
		url: '/cloudbox/editCloudboxLink',
		data: info,
		method: 'post'
	})
}
// 配置云盒的连接属性
export const sendCloudboxLink = info => {
	return axios.request({
		url: '/cloudbox/sendCloudboxLink',
		data: info,
		method: 'post'
	})
}
// 绑定云盒
export const bindCloudbox = info => {
	return axios.request({
		url: '/cloudbox/bindCloudbox',
		data: info,
		method: 'post'
	})
}
// 配置云盒从机
export const sendCloudboxFrom = info => {
	return axios.request({
		url: '/cloudbox/sendCloudboxFrom',
		data: info,
		method: 'post'
	})
}
// 生效配置
export const effectCloudboxFrom = info => {
	return axios.request({
		url: '/cloudbox/effectCloudboxFrom',
		data: info,
		method: 'post'
	})
}

/* 数据点管理 */
// 获取云盒数据点接口
export const getAttrList = () => {
	return axios.request({
		url: '/cloudbox/getAttrList',
		method: 'get'
	})
}
// 获取云盒数据点详情
export const getArr = info => {
	return axios.request({
		url: '/cloudbox/getAttr',
		params: info,
		method: 'get'
	})
}
// 保存云盒数据点
export const saveAttr = info => {
	return axios.request({
		url: '/cloudbox/saveAttr',
		data: info,
		method: 'post'
	})
}
// 控制云盒数据点
export const controlAttr = info => {
	return axios.request({
		url: '/cloudbox/controlAttr',
		data: info,
		method: 'post'
	})
}

/* 后台型号库 */
// 获取云盒型号列表
export const findTypeList = info => {
	return axios.request({
		url: '/cloudbox/findTypeList',
		params: info,
		method: 'get'
	})
}
// 获取全部云盒型号列表
export const findAllTypeList = () => {
	return axios.request({
		url: '/cloudbox/findAllTypeList',
		method: 'get'
	})
}
// 保存云盒型号
export const saveType = info => {
	return axios.request({
		url: '/cloudbox/saveType',
		data: info,
		method: 'post'
	})
}
// 删除云盒型号
export const delType = info => {
	return axios.request({
		url: '/cloudbox/delType',
		data: info,
		method: 'post'
	})
}

/* 后台终端库 */
// 获取云盒型号信息
export const getType = info => {
	return axios.request({
		url: '/cloudbox/getType',
		params: info,
		method: 'get'
	})
}
// 获取云盒列表
export const findCloudboxList = info => {
	return axios.request({
		url: '/cloudbox/findCloudboxList',
		params: info,
		method: 'get'
	})
}
// 无分页获取云盒列表
export const findAllBindCloudboxList = params => {
  return axios.request({
    url: "/cloudbox/findAllBindCloudboxList",
    params: params,
    method: "get"
  });
}
// 批量保存云盒属性
export const saveAttrBatch = params => {
  return axios.request({
    url: "/cloudbox/saveAttrBatch",
    data: params,
    method: "post"
  });
}

// 获取云盒实时数据
export const getCloudboxReal = info => {
	return axios.request({
		url: '/cloudbox/getCloudboxReal',
		params: info,
		method: 'get'
	})
}
// 保存云盒
export const saveCloudbox = info => {
	return axios.request({
		url: '/cloudbox/saveCloudbox',
		data: info,
		method: 'post'
	})
}
// 删除云盒
export const delCloudbox = info => {
	return axios.request({
		url: '/cloudbox/delCloudbox',
		data: info,
		method: 'post'
	})
}

// 手动获取云盒参数
export const sendGetMac = info => {
	return axios.request({
		url: '/cloudbox/sendGetMac',
		data: info,
		method: 'post'
	})
}

// 重启云盒
export const restartCloudbox = info => {
	return axios.request({
		url: '/cloudbox/restartCloudbox',
		data: info,
		method: 'post'
	})
}
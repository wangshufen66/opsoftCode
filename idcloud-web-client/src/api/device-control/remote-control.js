import axios from '@/libs/api.request'

export const getList = (params) => {
	return axios.request({
		url: '/remote/list',
		params: params,
		method: 'get'
	})
}

export const useControl = (data) => {
	return axios.request({
		url: '/remote/control',
		data: data,
		method: 'post'
	})
}


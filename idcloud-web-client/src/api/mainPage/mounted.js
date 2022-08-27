import axios from '@/libs/api.request'

export const getAuthority = (param) => {
  return axios.request({
    url: '/auth/getAuthority',
    method: 'post',
    data: param
  })
}

import axios from '@/libs/api.request'
// user api 和系统管理员（orgAdmin）重复部分，直接调取系统管理员api，由参数控制不同点
// 这里只写不同的api
import store from '../../store/index'



// 常用模块 list 
// type = 2 写死
export const getUsualModuleList = () => {
  return axios.request({
    url: '/index/userCommonList',
    method: 'get',
    params: {
      type: 2,
      orgId: store.state.user.userInfo.orgId
    }
  })
}

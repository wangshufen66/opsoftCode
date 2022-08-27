import {
  login,
  logout,
  getUserInfo,
} from '@/api/systemManagement/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    token: getToken(),
    accessButton: [], // 用户具有权限的操作按钮
    userInfo: '',
    access: [], // 用户具有权限的菜单
    hasGetInfo: false, // 用户是否已经获取到个人信息的标识位
  },
  mutations: {
    setAccessButton (state, accessButton) {
      state.accessButton = accessButton
    },
    setAccessMenu (state, accessMenu) {
      state.access = accessMenu
    },
    setAccessRouter (state, accessRouter) {
      state.accessRouter = accessRouter
    },
    setUserInfo (state, info) {
      state.userInfo = info
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
  },
  actions: {
    handleLogin ({ commit }, { username, password }) {
      return new Promise((resolve, reject) => {
        login({
          username,
          password
        }).then(res => {
          if (res.data.code === 200) {
            const data = res.data.data;
            commit('setToken', data.token);
            resolve(data.info);
          } else {
            reject(res.data);
          }
        }).catch(err => {
          reject(err);
        })
      })
    },
    // 获取用户相关信息和权限
    getUserInfo ({ state, commit }, { orgId, orgName,orgNumber }) {
      return new Promise((resolve, reject) => {
        try {
          let param={};
          if(orgId!==null)
            param={id:orgId,name:orgName,number:orgNumber};
          //等于 getAuthority
          getUserInfo(param).then(res => {
            if (res.data.code === 200) {
              //test 数据 alter 写完修改修改！！！！！！！！！！
              const data = res.data.data;
              commit('setAccessMenu', data.menu);
              commit('setAccessButton', data.button);
              commit('setAccessRouter', data.router);
              data.user.orgId=data.currentOrg.id;
              data.user.orgName=data.currentOrg.name;
              data.user.orgNumber=data.currentOrg.number;
              commit('setUserInfo', data.user);
              commit('setHasGetInfo', true);
              resolve(data)
            } else {
              reject(res.data)
            }
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    },
  }
}

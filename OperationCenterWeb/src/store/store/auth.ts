import { removeToken, removeStorage, setStorage } from "./../../utils/utils";

/**
 * 用户状态
 */


const state = () => {
};

const mutations: any = {

};

const actions: any = {
  loginOut: ({ commit }) => {
    removeToken();
    removeStorage("user-info");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

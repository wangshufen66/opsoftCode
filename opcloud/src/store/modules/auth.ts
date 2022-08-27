import { removeToken, removeStorage, setStorage } from "../../shared/utils/utils";

/**
 * 用户状态
 */

type State = {
  // nickName: string;

};

const state = () => {
};

const mutations: any = {

};

const actions: any = {
  loginOut: ({ commit }) => {
    removeToken();
    removeStorage("user");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

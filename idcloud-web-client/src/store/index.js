import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import publicParams from './module/publicParams';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    collapsed: false,
  },
  mutations: {
    changeCollapsed(state, res) {
      state.collapsed = res
    },
  },
  actions: {

  },
  modules: {
    user,
    app,
    publicParams,
  }
})

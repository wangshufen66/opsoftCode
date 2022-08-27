type State = {
  editStatus: boolean;
};

const state = () => {
  return {
    editStatus: false,
  };
};

const mutations: any = {
  /**设置设计状态*/
  setEditStatus: (state: State, flag: boolean): void => {
    state.editStatus = flag;
  },
};

const actions: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

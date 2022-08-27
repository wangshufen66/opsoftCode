import { DesignComponent } from "@/components/designComponent";

type State = {
  componentList: DesignComponent[];
  /**是否为设计页面*/
  designStatus: boolean;
};

const state = (): State => {
  return {
    componentList: [],
    designStatus: false,
  };
};

const mutations: any = {
  /**设置表单组件 */
  setFormComponent: (state: State, componentlist: any): void => {
    state.componentList = componentlist;
  },
  /**设置设计状态*/
  setDesignStatus: (state: State, flag: boolean): void => {
    state.designStatus = flag;
  },
};

const actions: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

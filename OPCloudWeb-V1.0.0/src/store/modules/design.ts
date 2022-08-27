import { formConfig } from "@/config/component/config";
import { IFormConfig } from "@/interfaces/IFormConfig";
import { IDesginComponent } from "@/interfaces/IDesginComponent";
/**
 * 设计状态
 */

type State = {
  page: Array<string | number>;
  designType: string;
  formConf: IFormConfig;
  currentComponents: IDesginComponent[];
  activeComponent: IDesginComponent;
  activeComponentId: number | string | undefined;
  defaultRegexList: any[];
  functionModel: any[];
  dataModelList: any[];
  componentValidation: any[];
  appList: any[];
};

const state = () => {
  return {
    /**页面ID-[应用ID,模块ID,页面ID] */
    page: [],
    /**设计页面类型 */
    designType: "baseInfo",
    // 默认表单配置
    formConf: formConfig,
    // 当前设计组件列表
    currentComponents: [],
    // 当前激活选中的组件
    activeComponent: undefined,
    // 当前激活选中的组件ID
    activeComponentId: undefined,
    // 默认正则校验规则
    defaultRegexList: [],
    /**计算模型 */
    dataModelList: [],
    /**组件校验 */
    componentValidation: [],
    /**应用列表 */
    appList: [],
  };
};

const mutations: any = {
  setPage: (state: State, list: any): void => {
    state.page = list;
  },
  setDesignType: (state: State, type: string): void => {
    state.designType = type;
  },
  setCurrentComponents: (state: State, list: IDesginComponent[]): void => {
    state.currentComponents = list;
  },
  setActiveComponent: (state: State, component: IDesginComponent): void => {
    state.activeComponent = component;
    state.activeComponentId = component && component.componentId;
  },
  setActiveComponentId: (state: State, componentId: number): void => {
    state.activeComponentId = componentId;
  },
  setDefaultRegexList: (state: State, list: any[]): void => {
    state.defaultRegexList = list;
  },
  setFunctionModel: (state: State, list: any[]): void => {
    state.dataModelList = list;
  },
  setFormConfig: (state: State, list: IFormConfig): void => {
    state.formConf = list;
  },
  setComponentValidation: (state: State, list: any): void => {
    state.componentValidation = list;
  },
  setAppList: (state: State, list: any): void => {
    state.appList = list;
  },
};

const actions: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

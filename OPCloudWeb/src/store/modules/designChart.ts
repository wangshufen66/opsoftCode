import { chartPanel } from "@/config/echarts/config";
import { TypeDesignChart, ChartPanel } from "@/interfaces/IDesginChart";
/**
 * 图表设计状态
 */

type State = {
  chartPanel: ChartPanel;
  currentCharts: TypeDesignChart[];
  activeChart: TypeDesignChart | undefined;
  activeChartId: string | number | undefined;
};

const state = (): State => {
  return {
    // 默认表单配置
    chartPanel: chartPanel,
    // 当前设计组件列表
    currentCharts: [],
    // 当前激活选中的组件
    activeChart: undefined,
    // 当前激活选中的组件ID
    activeChartId: undefined,
  };
};

const mutations: any = {
  setCurrentCharts: (state: State, list: TypeDesignChart[]): void => {
    state.currentCharts = list;
  },
  setActiveChart: (state: State, chart: TypeDesignChart): any => {
    state.activeChart = chart;
    state.activeChartId = chart && chart.chartId;
  },
  setActiveChartId: (state: State, componentId: number): any => {
    state.activeChartId = componentId;
  },
  setChartPanel: (state: State, obj: object): any => {
    
    state.chartPanel = obj || chartPanel;
  },
};

const actions: any = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};

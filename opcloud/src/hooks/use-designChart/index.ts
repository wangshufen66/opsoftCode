import { computed, reactive, ComputedRef, nextTick } from "vue";
import store from "vuex";
import {
  AxisType,
  ChartPanel,
  TypeDesignChart,
} from "@/shared/chartType";
import { ECOption } from "@/plugins/echarts";
import useEcharts from "./../use-chart";
import { deepClone } from "@/shared/utils/utils";

/**
 * 报表设计器
 * @returns
 */
export function useDesignChart() {
  const state = reactive({});

  const { renderChart, getChartConfig } = useEcharts();

  /**
   * 表单配置
   */
  const panelConf = computed<ChartPanel>({
    get: () => {
      return store.state.designChart.chartPanel;
    },
    set: (value?: ChartPanel) => {
      store.commit("designChart/setChartPanel", value);
    },
  });

  /**
   * 当前设计组件
   */
  const currentChartList = computed<TypeDesignChart[]>({
    get: () => {
      return store.state.designChart.currentCharts;
    },
    set: (value) => {
      store.commit("designChart/setCurrentCharts", value);
    },
  });

  /**
   * 初始化设计器
   */
  function initDesign() {
    // const chartList = store.state.designChart.currentCharts;
    // chartList.length === 0 && chartList.push(defaultChart);
    //设置默认激活组件
    // store.commit("designChart/setActiveChart", chartList[0]);
  }

  /**
   * 渲染当前所有图表
   * @param warpDom 图表DOM
   */
  function renderAllCharts(warpDom: string = "", chartCofigList?: any[]) {
    const chartList = chartCofigList ? chartCofigList : currentChartList.value;
    // render图表
    const render = (config: TypeDesignChart) => {
      const option: ECOption = getChartConfig(config);
      const dom =
        (warpDom && `${warpDom} #chart_${config.chartId}`) ||
        `#chart_${config.chartId}`;
      renderChart(option, dom, false);
    };
    for (let i = 0; i < chartList.length; i++) {
      const chartConf: TypeDesignChart = chartList[i];
      if (chartConf.type === "chart") {
        render(chartConf);
      } else if (chartConf.type === "container") {
        const children = chartConf.children;
        children &&
          children.forEach((element) => {
            if (element.type === "chart") {
              render(element);
            }
          });
      }
    }
  }

  function refreshChart(chartId: string) {
    const render = (chartList) => {
      for (let i = 0; i < chartList.length; i++) {
        const chartConf = chartList[i];
        if (chartConf.chartId === chartId) {
          const option: ECOption | undefined =
            chartConf && getChartConfig(chartConf);
          chartConf &&
            option &&
            renderChart(option, `#chart_${chartConf.chartId}`, false);
          return;
        }
        if (chartConf.children && chartConf.children.length > 0) {
          render(chartConf.children);
        }
      }
    };
    render(currentChartList.value);
  }
  /**
   * 复制组件
   * @param chart
   */
  function copyComponent(chart) {
    const newComponent = deepClone(chart);
    const timeStamp: number = +new Date();
    newComponent.chartId = timeStamp;
    currentChartList.value.push(newComponent);
    nextTick(() => {
      refreshChart(newComponent.chartId);
    });
  }

  /**
   * 图表移除事件
   * @param chartId
   */
  function removeEchart(chartId) {
    const remove = (chartList) => {
      for (let i = 0; i < chartList.length; i++) {
        const chartConf = chartList[i];
        if (chartConf.chartId === chartId) {
          chartList.splice(i, 1);
          const { setActiveChart } = useActiveDesignChart();
          setActiveChart(undefined);
          return;
        }
        if (chartConf.children && chartConf.children.length > 0) {
          remove(chartConf.children);
        }
      }
    };
    remove(currentChartList.value);
  }

  return {
    panelConf,
    currentChartList,
    currentProps: state,
    initDesign,
    getChartConfig,
    renderAllCharts,
    refreshChart,
    copyComponent,
    removeEchart,
  };
}

/**
 * 当前激活图表hook
 * @param currentChartList
 * @returns
 */
export function useActiveDesignChart(
  currentChartList?: ComputedRef<TypeDesignChart[]>
) {
  const { renderChart, getChartConfig } = useEcharts();
  /**
   * 当前选中组件
   */
  const activeChart = computed<TypeDesignChart>(() => {
    return store.state.designChart.activeChart;
  });

  /**
   *  激活组件ID
   */
  const activeChartId = computed<number>(() => {
    return store.state.designChart.activeChartId;
  });

  const hasAxis = computed(() => {
    return !!activeChart.value.series.find((f) =>
      ["line", "bar", "scatter"].includes(f.type)
    );
  });

  /**
   * 设置当前激活组件,并添加到组件集合
   * @param activeData 组件结构
   */
  function activeChartAndPush(activeData: TypeDesignChart | undefined): void {
    if (activeData) {
      store.commit("designChart/setActiveChart", activeData);
      currentChartList?.value.push(activeData);

      nextTick(() => {
        if (activeData.__config__.type !== "table-extend") {
          refreshChart();
        }
      });
    }
  }

  /**
   * 设置当前激活组件
   * @param activeData 组件结构
   */
  function setActiveChart(activeData: any): void {
    if (activeData) {
      store.commit("designChart/setActiveChart", activeData);
    }
  }

  /**
   * 刷新当前图表
   */
  function refreshChart(warpDom: string = "") {
    const chartConf: TypeDesignChart = activeChart.value;
    if (chartConf.type === "chart") {
      chartConf.xAxis && (chartConf.xAxis.show = hasAxis.value);
      chartConf.yAxis && (chartConf.yAxis.show = hasAxis.value);
      if (chartConf.xAxis) {
        // 时间轴
        if (chartConf.xAxis.type === AxisType.TIME) {
        }
        // 非时间轴
      }
      if (chartConf.yAxis) {
        // 时间轴
        // 非时间轴
      }

      const option: ECOption = getChartConfig(chartConf);
      const dom =
        (warpDom && `${warpDom} #chart_${chartConf.chartId}`) ||
        `#chart_${chartConf.chartId}`;
      renderChart(option, dom, false);
    }
  }

  // 移除图表
  function removeSerie(index: number): void {
    const { series } = activeChart.value;
    series && series.splice(index, 1) && refreshChart();
  }

  // 添加默认图表
  function addDefaultSerie(): void {
    if (!activeChart.value.xAxis) {
      activeChart.value.xAxis = {
        type: "category",
        show: true,
        axisLine: {
          show: true,
        },
        axisLabel: {
          formatter: "{value}",
        },
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      };
    }
    if (!activeChart.value.yAxis) {
      activeChart.value.yAxis = {
        type: "value",
        show: true,
        axisLine: {
          show: false,
        },
        axisLabel: {
          formatter: "{value}",
        },
      };
    }
    const { series } = activeChart.value;
    series &&
      series.push({
        id: `line_${new Date().getTime()}`,
        name: `line_${new Date().getTime()}`,
        type: "line",
        data: [19, 16, 25, 40, 30],
      }) &&
      refreshChart();
  }

  return {
    activeChart,
    activeChartId,
    setActiveChart,
    hasAxis,
    activeChartAndPush,
    refreshChart,
    addDefaultSerie,
    removeSerie,
  };
}

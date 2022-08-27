import { TypeDesignChart } from "@/shared/chartType";
import echarts, { ECOption } from "@/plugins/echarts";
import { deepClone } from "@/shared/utils/utils";

const echartMap: Map<string, echarts.ECharts> = new Map();

/**
 * echarts类
 * @returns echartsType
 */
export default function useEcharts() {
  /**
   * 渲染图表
   * @param option
   * @param domId
   * @param isdark
   */
  function renderChart(option: ECOption, domId: string, isdark: boolean) {
    let chart = echartMap.get(domId);
    chart && chart.dispose();
    const chartDom = document.querySelector(domId);
    if (!chartDom) return;
    chart = echarts.init(
      chartDom as HTMLElement,
      (isdark && "dark") || undefined
    );
    chart.setOption(option);
    echartMap.set(domId, chart);
  }
  /**
   * 删除图表
   * @param {string} domId
   */
  function removeChart(domId: string) {
    echartMap.delete(domId);
  }

  /**
   * 根据图表配置生成echarts配置
   * @param config
   * @returns
   */
  function getChartConfig(config: TypeDesignChart): ECOption | undefined {
    const chartconf = deepClone(config);
    delete chartconf.chartId;
    delete chartconf.__config__;
    if (chartconf.title) {
      chartconf.title = {
        text: chartconf.title,
      };
    }
    // grid
    chartconf.grid && setGrid(chartconf);
    // xAxis
    chartconf.xAxis && setXAxis(chartconf);
    // yAxis
    chartconf.yAxis && setYAxis(chartconf);

    if (!hasAxis(chartconf)) {
      delete chartconf.xAxis;
      delete chartconf.yAxis;
    }
    // legend
    if (chartconf.legend && chartconf.legend.position) {
      const { show, position } = chartconf.legend;
      const legend = {};
      legend.show = show;
      if (position === "top") {
        legend.top = 0;
      } else if (position === "left") {
        legend.left = 0;
        legend.orient = "vertical";
      } else if (position === "bottom") {
        legend.bottom = 0;
      } else {
        legend.right = 0;
        legend.orient = "vertical";
      }
      legend.type = "scroll";
      chartconf.legend = legend;
    }
    // pie
    const { series } = chartconf;
    if (!series) return undefined;
    for (let i = 0; i < series.length; i++) {
      if (series[i].type === "pie") {
        if (series[i].annular) {
          series[i].radius = ["40%", `${series[i].radius}%`];
        } else {
          series[i].radius = ["0%", `${series[i].radius}%`];
        }
        if (series[i].ratio) {
          series[i].label.formatter = "{b}：{c}({d}%)";
        } else {
          series[i].label.formatter = undefined;
        }
      } else {
        delete series[i].radius;
        if (series[i].type === "gauge") {
          // series[i]
        }
      }
      delete series[i].annular;
    }
    return chartconf as ECOption;
  }

  function setGrid(chartconf: any) {
    Object.keys(chartconf.grid).forEach((p) => {
      chartconf.grid[p] = chartconf.grid[p] + "%";
    });
  }

  function setXAxis(chartconf: any) {
    const { type } = chartconf.xAxis;
    if (type === "value") {
      for (let i = 0; i < chartconf.xAxis.length; i++) {
        chartconf.xAxis.max = function (value) {
          return value + Math.ceil(value / 10);
        };
      }
    }
  }

  function setYAxis(chartconf: any): void {
    const { type } = chartconf.yAxis;
    if (type === "value") {
      for (let i = 0; i < chartconf.yAxis.length; i++) {
        chartconf.yAxis.max = function (value) {
          return value + Math.ceil(value / 10);
        };
      }
    }
  }

  function hasAxis(chartconf: any) {
    return (
      !!chartconf.series &&
      chartconf.series.find((f) => ["line", "bar", "scatter"].includes(f.type))
    );
  }

  return {
    renderChart,
    getChartConfig,
    removeChart,
  };
}

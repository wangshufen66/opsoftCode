import echarts, { ECOption } from '@/plugins/echarts';
import { deepClone } from '@/utils/utils';

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

    chart = echarts.init(
      chartDom as HTMLElement,
      (isdark && 'dark') || undefined
    );
    chart.setOption(option);
    echartMap.set(domId, chart);
  }

  return {
    renderChart,
  };
}

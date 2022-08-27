// echarts
import * as echarts from 'echarts/core';
import {
  BarChart,
  // 系列类型的定义后缀都为 SeriesOption
  BarSeriesOption,
  LineChart,
  LineSeriesOption,
  PieChart,
  PieSeriesOption,
  ScatterChart,
  ScatterSeriesOption,
  RadarChart,
  RadarSeriesOption,
  GaugeChart,
  GaugeSeriesOption,
  GraphChart,
  GraphSeriesOption,
} from 'echarts/charts';
import {
  TitleComponent,
  // 组件类型的定义后缀都为 ComponentOption
  TitleComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  GridComponent,
  GridComponentOption,
  VisualMapComponent,
  VisualMapComponentOption,
  LegendComponent,
  LegendComponentOption,
} from 'echarts/components';
import { SVGRenderer } from 'echarts/renderers';

// 通过 ComposeOption 来组合出一个只有必须组件和图表的 Option 类型
export type ECOption = echarts.ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | TitleComponentOption
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | VisualMapComponentOption
  | PieSeriesOption
  | LegendComponentOption
  | ScatterSeriesOption
  | RadarSeriesOption
  | GaugeSeriesOption
  | GraphSeriesOption
>;

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  VisualMapComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  SVGRenderer,
  GraphChart,
]);

export default echarts;

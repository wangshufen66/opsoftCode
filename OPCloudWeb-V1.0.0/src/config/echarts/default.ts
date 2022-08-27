export default {
  chartId: `${+new Date()}`,
  type: "chart",
  componentTag: "linechart",
  __config__: {
    label: "折线图",
    type: "line",
    icon: "linechart",
    isDark: false,
    dataType: ["0"],
    dataOrg: [""],
    dataSource: undefined,
    colSpan: 1,
    rowSpan: 1,
    isDetail: false,
    detailParamsText: "",
    detailParams: undefined,
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    show: false,
    position: "top",
  },
  xAxis: {
    type: "category",
    show: true,
    axisLine: {
      show: true,
    },
    axisLabel: {
      formatter: "{value}",
    },
    data: [
      "3月20日",
      "3月21日",
      "3月22日",
      "3月23日",
      "3月24日",
      "3月25日",
      "3月26日",
    ],
  },
  yAxis: {
    type: "value",
    show: true,
    axisLine: {
      show: false,
    },
    axisLabel: {
      formatter: "{value}",
    },
  },
  series: [
    {
      id: "line_1617675415680",
      name: "line_1617675415680",
      type: "line",
      data: [18, 20, 21, 22, 23, 19, 16],
    },
  ],
  grid: {
    top: 10,
    left: 5,
    right: 5,
    bottom: 5,
    containLabel: true,
  },
};

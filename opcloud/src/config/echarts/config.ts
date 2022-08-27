import { ChartPanel } from "@/shared/chartType";

/**
 * echars图表配置
 */
export const chart = [
  {
    type: "chart",
    isAxis: true,
    componentTag: "linechart",
    __config__: {
      label: "折线图",
      type: "line",
      icon: "linechart",
      isDark: false,
      colSpan: 1,
      rowSpan: 1,
      dataType: ["0"],
      dataOrg: [""],
      /**X轴绑定字段(可空) */
      xAxisDataAttr: undefined,
      /**Y轴绑定字段(可空) */
      yAxisDataAttr: undefined,
      /**值绑定字段 */
      dataSourceAttr: [],
      /**是否跳转详情 */
      isDetail: false,
      /**跳转页面文本(呈现必须) */
      detailParamsText: "",
      /**跳转页面应用、模块、页面ID */
      detailParams: undefined,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    chartType: 0,
    title: undefined,
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
        // formatter: "{value}",
      },
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
      show: true,
      axisLine: {
        show: true,
      },
      axisLabel: {
        // formatter: "{value}",
      },
    },
    series: [
      {
        id: "line_1617675415680",
        name: "line_1617675415680",
        type: "line",
        data: [150, 230, 224, 218, 135, 147, 260],
      },
    ],
    grid: {
      top: 15,
      left: 5,
      right: 10,
      bottom: 15,
      containLabel: false,
    },
  },
  {
    type: "chart",
    isAxis: true,
    componentTag: "barchart",
    __config__: {
      label: "柱状图",
      type: "bar",
      icon: "barchart",
      isDark: false,
      colSpan: 1,
      rowSpan: 1,
      dataType: ["0"],
      dataOrg: [""],
      /**X轴绑定字段(可空) */
      xAxisDataAttr: undefined,
      /**Y轴绑定字段(可空) */
      yAxisDataAttr: undefined,
      /**值绑定字段 */
      dataSourceAttr: [],
      isDetail: false,
      detailParamsText: "",
      detailParams: undefined,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    chartType: 0,
    title: undefined,
    tooltip: {
      trigger: "axis",
    },
    legend: {
      show: true,
      position: "top",
    },
    xAxis: {
      type: "category",
      show: false,
      axisLine: {
        show: true,
      },
      data: ["2017年", "2018年", "2019年", "2020年", "2021年", "2022年"],
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
        id: "bar_1617675415680",
        name: "bar_1617675415680",
        type: "bar",
        data: [1, 2, 4, 7, 10, 15, 16],
        backgroundStyle: {
          color: "rgba(253,184,0,1)",
        },
      },
    ],
    grid: {
      top: 15,
      left: 5,
      right: 10,
      bottom: 15,
      containLabel: true,
    },
  },
  {
    type: "chart",
    isAxis: true,
    componentTag: "scatter",
    __config__: {
      label: "散点图",
      type: "scatter",
      icon: "scatter",
      isDark: false,
      colSpan: 1,
      rowSpan: 1,
      dataType: ["0"],
      dataOrg: [""],
      /**X轴绑定字段(可空) */
      xAxisDataAttr: undefined,
      /**Y轴绑定字段(可空) */
      yAxisDataAttr: undefined,
      /**值绑定字段 */
      dataSourceAttr: [],
      /**是否跳转详情 */
      isDetail: false,
      detailParamsText: "",
      detailParams: undefined,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    chartType: 0,

    title: undefined,
    tooltip: {
      trigger: "item",
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
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
        id: "scatter_1617675415680",
        name: "scatter_1617675415680",
        type: "scatter",
        data: [150, 230, 224, 218, 135, 147, 260],
      },
    ],
    grid: {
      top: 15,
      left: 5,
      right: 10,
      bottom: 15,
      containLabel: true,
    },
  },
  {
    type: "chart",
    isAxis: false,
    componentTag: "piechart",
    __config__: {
      label: "饼图",
      type: "pie",
      icon: "pie",
      isDark: false,
      colSpan: 1,
      rowSpan: 1,
      dataType: ["0"],
      dataOrg: [""],
      /**X轴绑定字段(可空) */
      xAxisDataAttr: undefined,
      /**Y轴绑定字段(可空) */
      yAxisDataAttr: undefined,
      /**值绑定字段 */
      dataSourceAttr: [],
      /**是否跳转详情 */
      isDetail: false,
      detailParamsText: "",
      detailParams: undefined,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    chartType: 0,
    title: undefined,
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
      position: "top",
    },
    series: [
      {
        id: "pie_1617675415680",

        name: "pie_1617675415680",
        type: "pie",
        radius: 50,
        annular: false,
        /**显示占比 */
        ratio: true,
        label: {},
        data: [
          { name: "Mon", value: 150 },
          { name: "Tue", value: 230 },
          ,
          { name: "Wed", value: 224 },
          { name: "Thu", value: 218 },
          { name: "Fri", value: 135 },
          { name: "Sat", value: 147 },
          { name: "Sun", value: 260 },
        ],
      },
    ],
    grid: {
      top: 15,
      left: 5,
      right: 10,
      bottom: 15,
      containLabel: true,
    },
  },
  {
    type: "chart",
    isAxis: false,
    componentTag: "gaugechart",
    __config__: {
      label: "仪表盘",
      type: "gauge",
      icon: "gauge",
      isDark: false,
      colSpan: 1,
      rowSpan: 1,
      dataType: ["0"],
      dataOrg: [""],
      /**值绑定字段 */
      dataSourceAttr: [],
      /**是否跳转详情 */
      isDetail: false,
      /**跳转页面文本(呈现必须) */
      detailParamsText: "",
      /**跳转页面应用、模块、页面ID */
      detailParams: undefined,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    chartType: 0,

    title: undefined,
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
      position: "top",
    },
    series: [
      {
        id: "gauge_1617675415680",
        name: "gauge_1617675415680",
        type: "gauge",
        min: 0,
        max: 100,
        data: [
          {
            name: "Mon",
            value: 150,
            title: {
              offsetCenter: ["0%", "70%"],
            },
            detail: {
              offsetCenter: ["0%", "100%"],
            },
          },
        ],
      },
    ],
    grid: {
      top: 15,
      left: 5,
      right: 10,
      bottom: 15,
      containLabel: true,
    },
  },
  {
    type: "chart",
    isAxis: false,
    componentTag: "radarchart",
    __config__: {
      label: "雷达图",
      type: "radar",
      icon: "radarchart",
      isDark: false,
      colSpan: 1,
      rowSpan: 1,
      dataType: ["0"],
      dataOrg: [""],
      /**值绑定字段 */
      dataSourceAttr: [],
      isDetail: false,
      detailParamsText: "",
      detailParams: undefined,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    chartType: 0,

    title: undefined,
    tooltip: {
      trigger: "item",
    },
    legend: {
      show: false,
      position: "top",
    },
    radar: {
      shape: "circle",
      indicator: [
        { name: "销售（Sales）", max: 6500 },
        { name: "管理（Administration）", max: 16000 },
        { name: "信息技术（Information Technology）", max: 30000 },
        { name: "客服（Customer Support）", max: 38000 },
      ],
    },
    series: [
      {
        id: "radar_1043124",
        name: "预算开销（Budget vs spending）",
        type: "radar",
        data: [
          {
            value: [4200, 3000, 20000, 35000],
            name: "预算分配（Allocated Budget）",
          },
        ],
      },
    ],
    grid: {
      top: 15,
      left: 5,
      right: 10,
      bottom: 15,
      containLabel: true,
    },
  },
  {
    type: "table",
    componentTag: "designTable",
    __config__: {
      icon: "table",
      label: "表格",
      /**组件所占列 */
      colSpan: 1,
      /**组件所占行 */
      rowSpan: 1,
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    __attr__: {
      selectionCol: true,
      indexCol: true,
      paging: false,
    },
    selectModel: [],
    columnModel: [],
  },
  {
    type: "container",
    componentTag: "container",
    __config__: {
      icon: "panel",
      inForm: true,
      label: "容器",
      /**组件所占列 */
      colSpan: 1,
      /**组件所占行 */
      rowSpan: 1,
    },
    /**组件行数 */
    rows: 2,
    /**组件列数 */
    columns: 2,
    gap: 10,
    children: [],
  },
  {
    type: "card",
    componentTag: "card",
    __config__: {
      icon: "textarea",
      inForm: true,
      label: "卡片",
      /**组件所占列 */
      colSpan: 1,
      /**组件所占行 */
      rowSpan: 1,
      dataType: "sql",
      dataSql: "",
      relComponent: undefined,
      relFieldList: undefined,
      relField: undefined,
    },
    /**组件行数 */
    rows: 2,
    /**组件列数 */
    columns: 2,
    gap: 10,
    backgroundColor: "#fff",
    backgroundImage: undefined,
    children: [],
    dataSource: undefined,
  },
  {
    type: "image",
    componentTag: "image",
    __config__: {
      icon: "el-icon-picture-outline",
      label: "图片",
      rowSpan: 1,
      colSpan: 1,
    },
    dataModel: [],
    dataField: undefined,
    /**数据类型:model模型;path:静态路径 */
    dataType: "path",
    /**图片填充类型 */
    fillType: "fill",
    /**圆角 */
    borderRadius: 0,
    /**图片路径，数据类型为path时必填 */
    path: undefined,
  },
  {
    type: "text",
    componentTag: "text",
    __config__: {
      icon: "shuzi",
      label: "文本数字",
      rowSpan: 1,
      colSpan: 1,
    },
    dataModel: [],
    dataField: undefined,
    /**数据类型:model模型;static:静态路径 */
    dataType: "static",
    /**静态文本值 */
    fieldValue: "文本数字",
    /**格式：bl百分比；thousands千分位;date日期时间 */
    format: undefined,
    /**日期时间格式 */
    dateFormat: "YYYY-MM-DD",
    /**字体颜色 */
    color: "#333",
    /**背景色 */
    backgroundColor: "#fff",
    /**字体大小 */
    fontSize: 14,
    /**字体大小 */
    "font-weight": 500,
    /**自定义格式表达式 */
    express: "{value}",
    /**水平排布方式 */
    horizontal: "flex-start",
    /**垂直排布方式 */
    vertical: "flex-start",
  },
  {
    type: "tree",
    componentTag: "designTree",
    __config__: {
      label: "树形组件",
      icon: "cascader",
      rowSpan: 1,
      colSpan: 1,
    },
    __attr__: {
      "expand-on-click-node": false,
      props: {
        children: "children",
        label: "name",
        value: "id",
        isLeaf: "leaf",
      },
      accordion: false,
      data: [
        {
          id: +new Date(),
          name: "层级 1",
          children: [],
        },
      ],
    },
    options: [
      {
        id: +new Date(),
        name: "层级1",
        levelType: 1,
        pageTableName: "",
        fieldCode: "",
        fieldForeignCode: "",
        tableId: null,
      },
    ],
  },
];

/**
 *  表格页面容器配置
 */
export const chartPanel: ChartPanel = {
  rows: 3,
  columns: 2,
  cellWidth: undefined,
  // cellHeight: 280,
  gap: 10,
  searchConfig: [],
};

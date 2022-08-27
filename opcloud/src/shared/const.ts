declare type labelValue = {
    /**文本字段 */
    label: string;
    /**
     * 值字段
     */
    value: string;
  };
  
  export enum dateTimeFormat {
    /** 日期 */
    date = 'YYYY-MM-DD',
    /** 周 */
    week = 'gggg第ww周',
    /** 年月 */
    month = 'YYYY-MM',
    /** 年 */
    year = 'YYYY',
    /** 日期时间 */
    datetime = 'YYYY-MM-DD HH:mm:ss',
    /** 多个日期 */
    dates = 'YYYY-MM-DD',
    /** 时间 */
    time = 'HH:mm:ss',
  }
  
  /**
   * 单位类型
   * @enum {number}
   */
  export enum ResultUnit {
    /** 天 */
    DAY = 1,
    /** 小时 */
    HOUR = 2,
    /** 分钟 */
    MINUTE = 3,
    /** 秒 */
    SECOND = 4,
  }
  
  export const justifyOptions: Array<labelValue> = [
    {
      label: 'start',
      value: 'start',
    },
    {
      label: 'end',
      value: 'end',
    },
    {
      label: 'center',
      value: 'center',
    },
    {
      label: 'space-around',
      value: 'space-around',
    },
    {
      label: 'space-between',
      value: 'space-between',
    },
  ];
  
  export const dateTypeOptions: Array<labelValue> = [
    {
      label: '日(date)',
      value: 'date',
    },
    {
      label: '周(week)',
      value: 'week',
    },
    {
      label: '月(month)',
      value: 'month',
    },
    {
      label: '年(year)',
      value: 'year',
    },
    {
      label: '日期时间(datetime)',
      value: 'datetime',
    },
    // {
    //   label: '多个日期(dates)',
    //   value: 'dates',
    // },
  ];
  
  export const dateRangeTypeOptions: Array<labelValue> = [
    {
      label: '日期范围(daterange)',
      value: 'daterange',
    },
    {
      label: '月范围(monthrange)',
      value: 'monthrange',
    },
    {
      label: '日期时间范围(datetimerange)',
      value: 'datetimerange',
    },
  ];
  
  export const colorFormatOptions: Array<labelValue> = [
    {
      label: 'hex',
      value: 'hex',
    },
    {
      label: 'rgb',
      value: 'rgb',
    },
    {
      label: 'rgba',
      value: 'rgba',
    },
    {
      label: 'hsv',
      value: 'hsv',
    },
    {
      label: 'hsl',
      value: 'hsl',
    },
  ];
  
  export const AxisType: labelValue[] = [
    {
      label: '数值轴',
      value: 'value',
    },
    {
      label: '类目轴',
      value: 'category',
    },
    {
      label: '时间轴',
      value: 'time',
    },
    {
      label: '对数轴',
      value: 'log',
    },
  ];
  
  export const chartType: labelValue[] = [
    { label: '折线图', value: 'line' },
    { label: '柱状图', value: 'bar' },
    { label: '饼图', value: 'pie' },
    { label: '散点图', value: 'scatter' },
    { label: '雷达图', value: 'radar' },
    { label: '仪表盘', value: 'gauge' },
  ];
  
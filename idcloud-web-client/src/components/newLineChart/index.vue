<template>
  <div id="main" v-loading="loading"
       element-loading-text=""
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.2)"></div>
  <!---->
</template>

<script>
  import echarts from 'echarts'

  export default {
    name: "newLineChart",
    props: {
      // xAxisData: {
      //   type: Array,
      //   default() {
      //     const data = [["2000-06-05"],["2000-06-06"],["2000-06-07"],["2000-06-08"],["2000-06-09"],["2000-06-10"],["2000-06-11"],["2000-06-12"],["2000-06-13"],["2000-06-14"]];
      //     return data
      //   }
      // },
      loading: {
        type: Boolean,
        default() {
          return false
        }
      },
      titleText: {
        type: String,
        default() {
          return null
        }
      },
      titleShow: {
        type: Boolean,
        default() {
          return null
        }
      },
      titleTextColor: {
        type: String,
        default() {
          return 'black'
        }
      },
      titleTextFontStyle: {
        type: String,
        default() {
          return 'normal'
        }
      },
      titleTextFontWeight: {
        type: String,
        default() {
          return 'normal'
        }
      },
      titleTextFontFamily: {
        type: String,
        default() {
          return 'Arial'
        }
      },
      titleTextFontSize: {
        type: Number,
        default() {
          return 40
        }
      },
      // seriesData: {
      //   type: Array,
      //   default() {
      //     const data = [820, 932, 901, 934, 1290, 1730, 1320 , 820, 932, 901, 934, 1290, 1330, 1320, 1630, 1320];
      //     return data
      //   }
      // },
      tooltipShow: {
        type: Boolean,
        default() {
          return null
        }
      },
      tooltipBackgroundColor: {
        type: String,
        default() {
          return '#fff'
        }
      },
      tooltipTextFontStyle: {
        type: String,
        default() {
          return 'normal'
        }
      },
      tooltipTextFontWeight: {
        type: String,
        default() {
          return 'normal'
        }
      },
      tooltipTextFontSize: {
        type: Number,
        default() {
          return 30
        }
      },
      tooltipTextColor: {
        type: String,
        default() {
          return '#000'
        }
      },
      // visualMapShow:{
      //   type: Boolean,
      //   default() {
      //     return false
      //   }
      // },
      visualMapPieces: {
        type: Array,
        default() {
          const data = [{
            gt: 0,
            lte: 100000000,
            color: '#ABC5FB'
          }];
          return data
        }
      },
      // dataZoomStartValue: {
      //   type: String,
      //   default() {
      //     return '2000-06-11'
      //   }
      // },
      // dataZoomEndValue: {
      //   type: String,
      //   default() {
      //     return '2000-06-13'
      //   }
      // },
      dataZoomShow: {
        type: Boolean,
        default() {
          return null
        }
      },
      dataZoomZoomLock: {
        type: Boolean,
        default() {
          return false
        }
      },
      grid: {
        left: {
          type: String,
          default() {
            return null
          }
        },
        right: {
          type: String,
          default() {
            return null
          }
        },
        top: {
          type: String,
          default() {
            return null
          }
        },
        bottom: {
          type: String,
          default() {
            return null
          }
        },
        height: {
          type: String,
          default() {
            return null
          }
        },
        width: {
          type: String,
          default() {
            return null
          }
        },
      },
      dataUnit: {
        type: String,
        default() {
          return ''
        }
      }
    },
    mounted() {
      // this.drawLine();
    },
    data() {
      return {
        // height:800,
        // width: 100,
        myChart: null,
        chartData: {
          xAxisData: [],
          seriesData: [],
          yAxisData: {
            yAxisMin: 0,
            yAxisMax: 99999,
            yAxisSplitNumber: 10,
          }
        },
      }
    },
    // watch:{
    //   chartData: {
    //     handler(val){
    //       this.drawLine(val.xAxisData, val.seriesData)
    //     },
    //     // immediate: true,  //刷新加载 立马触发一次handler
    //     deep: true  // 可以深度检测到 person 对象的属性值的变化
    //   }
    // },
    methods: {
      drawLine(xAxisData, seriesData) {
        this.chartData.xAxisData = xAxisData
        this.chartData.seriesData = seriesData

        this.myChart = echarts.init(document.getElementById('main'));
        this.myChart.setOption({
          grid: {
            left: this.grid.left,
            right: this.grid.right,
            top: this.grid.top,
            bottom: this.grid.bottom,
            height: this.grid.height,
            width: this.grid.width,
          },
          xAxis: {
            type: 'category',
            data: this.chartData.xAxisData,
          },
          yAxis: {
            type: 'value',
            min: this.chartData.yAxisData.yAxisMin,
            max: this.chartData.yAxisData.yAxisMax,
            splitNumber: this.chartData.yAxisData.yAxisSplitNumber,
          },
          title: [{
            left: 'left',  //相关属性right 用户 控制左右侧距离  参数：20 像素值/'20%' 百分比/'left'/'center'/'right'
            top: 'top',  //相关属性bottom 用户控制上下侧侧距离  参数：20 像素值/'20%' 百分比/'top'/'middle'/'bottom'
            text: this.titleText,
            show: this.titleShow,
            textStyle: {
              color: this.titleTextColor,
              fontStyle: this.titleTextFontStyle,
              fontWeight: this.titleTextFontWeight,
              fontFamily: this.titleTextFontFamily,
              fontSize: this.titleTextFontSize
            }
          }],
          series: [{
            data: this.chartData.seriesData,
            type: 'line'
          }],
          tooltip: {
            trigger: 'axis',//触发类型-'item'无类目轴的图表中使用|'axis'类目轴的图表中使用|'none'
            show: this.tooltipShow,
            backgroundColor: this.tooltipBackgroundColor,
            axisPointer: {//坐标轴指示器配置项。
              type: 'line',//指示器类型 参数'line'线性|'shadow'阴影|'none'|'cross'十字准星。
              axis: 'auto', //指示器坐标轴
            },
            //formatter: '{b0}: {c0}<br />{b1}: {c1}',//提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
            textStyle: {//提示框浮层的文本样式
              fontStyle: this.tooltipTextFontStyle,
              fontWeight: this.tooltipTextFontWeight,
              fontSize: this.tooltipTextFontSize,
              color: this.tooltipTextColor,
            },
            formatter: param => {
              return param[0].name + '<br>'+ param[0].marker + param[0].data + `${this.dataUnit}`
            }
          },
          visualMap: {
            show: false,
            type: 'piecewise',
            id: 'visualMap',
            // min: 0,
            // max: 1500,
            bottom: 10,
            left: 10,
            pieces: this.visualMapPieces,
            outOfRange: {color: '#ABC5FB'},
          },
          dataZoom: {
            type: 'slider',  //滑动型slider|内置型inside
            // startValue: this.dataZoomStartValue,
            // endValue: this.dataZoomEndValue,
            // start: null,
            // end: null,
            show: this.dataZoomShow,
            zoomLock: this.dataZoomZoomLock,
            backgroundColor: 'rgba(47,69,84,0)',
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: '#000',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            },
          },
        });
      }
    },

  }
</script>

<!--<style scoped>-->

<!--</style>-->

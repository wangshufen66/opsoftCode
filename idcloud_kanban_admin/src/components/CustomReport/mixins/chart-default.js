/*
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @LastEditors: jsjzh
 * @Date: 2019-02-27 10:20:10
 * @LastEditTime: 2019-04-29 10:19:19
 * @Description: chart 实例默认 mixin 配置
 */
// import { defaultLineOption, defaultPieOption, defaultBarOption } from '../js/variable'

// const chartOptions = { defaultLineOption, defaultPieOption, defaultBarOption }

export default {
  methods: {
    getChartsInstance() {
      return this.$$chartInstance
    },
    // 同时还接受父组件传来的 option
    setOption(option) {
      // 这里的setOption 第二个参数 设置为true，则说明 option 不跟之前设置的 option 进行合并，也就意味着，每个组件的中都要写上完整的option
      // 因为这里的setOption 第二个参数默认为 false的情况下，实际运行的效果不对，后台接口数据有变化时，无法真正匹配
      // this.$$chartInstance.clear();
      this.$$chartInstance && this.$$chartInstance.setOption(option, true)
    },
    handleResize() {
      this.$nextTick(() => {
        typeof this.$$chartInstance === 'object' && this.$$chartInstance.resize()
      })
    },
    initChart(refName) {
      const chartDom = this.$refs[refName]
      this.$$chartInstance = this.$echarts.init(chartDom)
    },
    addResizeListener() {
      this.$$events.resize = _.debounce(this.handleResize, 200, true)
      window.addEventListener('resize', this.$$events.resize)
    }
  },
  mounted() {
    this.$$chartInstance = null
    this.$$events = {
      resize: null
    }

    this.initChart(this.$options.name)
    // this.setOption(chartOptions[this.optionName])
    this.$emit('reload', this.$$chartInstance)
    this.addResizeListener()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.$$events.resize)
    this.$$chartInstance.dispose()
    this.$$chartInstance = null
    this.$$events.resize = null
    this.$$events = null
  }
}

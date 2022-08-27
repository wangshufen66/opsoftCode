<!--
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @Date: 2019-02-18 10:42:41
 * @LastEditors: jsjzh
 * @LastEditTime: 2019-03-11 19:47:30
 * @Description: 基础 table 组件
 -->
<template>
  <!--下面一行注释的 class style 添加到对应的地方，可让区域内容 自动向下滚动-->
  <!--斑马纹样式属性=》 :stripe="true"-->
  <div id="m-default-table">
    <el-table
      ref="table"
      :stripe="false"
      :data="tableData"
      size="mini"
      style="width: 100%;height:100%;"
    >
      <el-table-column v-if="haveIndex" type="index" label="序号"/>
      <el-table-column
        v-for="(colConfig, colIndex) in tableOption"
        :prop="colConfig.prop"
        :label="colConfig.label"
        :key="colIndex">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag v-if="scope.row.cellTypes[colConfig.prop] != 'none'" :type="scope.row.cellTypes[colConfig.prop]" effect="dark">
              {{ scope.row[colConfig.prop] }}
            </el-tag>
            <div v-else>
              {{ scope.row[colConfig.prop] }}
            </div>

          <!--<el-tag>标签一</el-tag>-->
          <!--<el-tag type="success">标签二</el-tag>-->
          <!--<el-tag type="info">标签三</el-tag>-->
          <!--<el-tag type="warning">标签四</el-tag>-->
          <!--<el-tag type="danger">标签五</el-tag>-->
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
export default {
  name: 'DefaultTable',
  props: {
    tableData: {
      type: Array,
      default() {
        return []
      }
    },
    tableOption: {
      type: Array,
      default() {
        return []
      }
    },
    haveIndex: { type: Boolean, default: true },
    // 自动滚动功能参数
    autoScroll: {
      type: Object,
      default() {
        return {
          isAutoScroll: false,
          scrollIndex: 0
        }
      }
    }

  },
  data() {
    return {
      isInit: true, // 是否初始化的标识（监听组件参数时，首次接收到异步数据，则启动表格自动滚动定时器）
      autoScrollTimer: null, // 实现表格自动向下滚动的定时器
      activeIndex: 0,
      isAutoScroll: false
    }
  },
  watch: {
    tableData: {
      handler(newvalue, oldvalue) {
        if (this.isInit) {
          this.isInit = false
          if (this.isAutoScroll) {
            // console.log("表格开启自动滚动")
            // console.log(this.tableData.length)
            // console.log(JSON.stringify(this.tableData))
            this.autoScrollTable(this.tableData.length)
          }
        }
      }
    },
    activeIndex: {
      handler(newvalue, oldvalue) {

      }
    },
    autoScroll: {
      handler(newvalue, oldvalue) {
        // console.log(JSON.stringify(newvalue))
        this.isAutoScroll = newvalue.isAutoScroll
        this.activeIndex = newvalue.scrollIndex
      }
    }
  },
  mounted() {
    // this.$refs.table.bodyWrapper.scrollTop =10;
  },
  beforeDestroy() {
    this.clearAllTimer()
  },
  methods: {
    // 清理所有定时器
    clearAllTimer() {
      if (this.autoScrollTimer) {
        clearInterval(this.autoScrollTimer)
      }
    },

    // 表格自动滚动
    autoScrollTable(rowCount) {
      // 开启定时器
      this.autoScrollTimer = setInterval(() => {
        // 自定义滚动 出勤率
        /**
                     * 表格定位案例：以下对应的标签—— <el-table ref="table"></el-table> 其中 ref="table" 就是 this.$refs.table 的关键
                     * （1）表格定位到头部，即 第一行
                     * this.$refs.table.bodyWrapper.scrollTop = 0;
                     * （2）表格定位到尾部，即 最后一行
                     * this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight;
                     */
        // todo：表格行滚动的核心计算公式
        // console.log("表格数据行数：" + rowCount)
        // console.log("计数变量：" + this.activeIndex)
        // console.log(this.$refs.table.bodyWrapper.clientHeight)
        // 计算表格已显示的行数（多余的滚动次数）= 区域高度 / 单位行高数值(此数值是经过测试的一个模糊值，并不准确)
        // todo:如果样式中更改了行高，那么这里的 30 也需要进行相应更改
        const moreScrollCount = parseInt(this.$refs.table.bodyWrapper.clientHeight / 30)
        // 滚动循环次数 = 数据总行数 - 多余的滚动次数(即 上面计算出的值) + 一个模糊值（此模糊值，为了避免如果容器尺寸不够，而没滚到最后一行就回到第一行了）
        const scrollCount = rowCount - moreScrollCount + 2
        if (this.activeIndex < scrollCount) { // 若 小于，则未滚动到最后一行
          // 每次滚动的行高 = 表格滚动高度 / 数据总行数 * 当前循环索引值
          // 表格行滚动定位追加
          this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight / rowCount * this.activeIndex
          this.activeIndex += 1
          // console.log("行滚动的值：" + this.$refs.table.bodyWrapper.scrollTop)
        } else { // 否则说明到达最后一行，再重新回到第一行
          this.activeIndex = 0
          this.$refs.table.bodyWrapper.scrollTop = 0
        }
      }, 2000)
    }

  }

}
</script>

<style lang="scss">
  #m-default-table{
    @import "css/el-table-custom";
    .el-table__row {
      height: 10px;
    }
  }
</style>

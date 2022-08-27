<!--
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @Date: 2019-02-18 10:43:52
 * @LastEditors: jsjzh
 * @LastEditTime: 2019-03-07 22:34:03
 * @Description: custom-report-table-pie-module
 -->
<template>
  <div
    v-loading="loading"
    style="display: flex;flex-direction: column;"
    element-loading-text=""
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0)">
    <div style="width:98%;margin-top: -18px;display: flex;justify-content: flex-end;">
      <el-tag v-for="(cellTypeVal,cellTypeKey,cellTypeIndex) in cellTypesExplain" :key="cellTypeIndex" :type="cellTypeKey=='normal'?'':cellTypeKey" size="mini" class="color-box-explain" effect="dark">
        {{ cellTypeVal }}
      </el-tag>
      <!--如果没有色块，就用一个隐藏组件来占据空间，让顶部永远保留出一段空间-->
      <el-tag v-if="cellTypesExplain == null" :class="{'el-tag-hidden':cellTypesExplain == null}" effect="dark">NULL</el-tag>

      <!--<el-tag class="color-box-explain">标签一</el-tag>-->
      <!--<el-tag class="color-box-explain" type="success">标签二</el-tag>-->
      <!--<el-tag class="color-box-explain" type="info">标签三</el-tag>-->
      <!--<el-tag class="color-box-explain" type="warning">标签四</el-tag>-->
      <!--<el-tag class="color-box-explain" type="danger">标签五</el-tag>-->
    </div>
    <default-table :auto-scroll="autoScroll" :table-data="reportData" :table-option="tableOption" style="flex: 18"/>
    <div style="flex: 1;">
      <span style="margin-right: 1rem;font-size: 14px;color:rgba(255,255,255,0.5)">第{{ curPage }}页</span>
      <span style="margin-right: 1rem;font-size: 14px;color:rgba(255,255,255,0.5)">共{{ reportData.length }}行</span>
      <span style="font-size: 14px;color:rgba(255,255,255,0.5)">共{{ totalPage }}页</span>
    </div>
  </div>
</template>

<script>
import request from '@/utils/requestCustom'
import defaultTable from './default-table'

export default {
  name: 'CustomReportTableModule',
  components: { defaultTable },
  props: {
    api: {
      type: String,
      default() { // 后台请求接口的路由地址
        return ''
      }
    },
    apiMethod: { // 后台请求接口的访问方式
      type: String,
      default() {
        return 'get'
      }
    },
    callIntervalSec: { // 请求后台数据的定时器执行间隔时间(单位：秒)
      type: Number,
      default() {
        return 5
      }
    }
  },
  data() {
    return {
      loading: false,
      timer: null, // 定时器
      totalPage: 1, // 总页数
      curPage: 1, // 记录数据的当前页码（此变量只用于查看）
      nextPage: 1, // 记录下一次请求后台数据的页码（此变量用于提交请求参数，控制请求的数据）
      cellTypesExplain: {}, // 色块说明的对象
      tableOption: [],
      reportData: [],
      autoScroll: {
        isAutoScroll: true,
        scrollIndex: 0
      }
    }
  },
  watch: {
    // reportData: {
    //     handler(newVal, oldVal) {
    //         console.log(JSON.stringify(this.reportData));
    //     }
    // }
  },
  mounted() {
    // console.log(JSON.stringify(this.api));
    // console.log(JSON.stringify(this.apiMethod));
    this.callData()

    // 初始化定时器
    this.timer = setInterval(this.callData, (this.callIntervalSec * 1000))
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  methods: {
    // 异步请求后台数据
    callData() {
      this.loading = true
      this.autoScroll = {
        isAutoScroll: true,
        scrollIndex: 0
      }

      // 网络请求
      request({
        url: this.api,
        method: this.apiMethod,
        params: {
          'pageNum': this.nextPage
        }
      }).then(response => {
        response = response.data
        if (response.errno !== 0) { // 请求失败
          // this.openNotificationError(res.errmsg)
        } else { // 请求成功
          this.cellTypesExplain = response.data.configParam.cellTypesExplain
          this.tableOption = response.data.configParam.tableOptionList
          this.reportData = response.data.configParam.tableDataList
          this.totalPage = response.data.totalPage
          this.curPage = response.data.curPage
          this.nextPage = response.data.nextPage
        }
      }).finally(() => {
        this.loading = false
      })
    }

  }
}
</script>

<style lang="scss" scoped>
    @import "./css/index.scss";

    /*色块说明样式*/
    .color-box-explain{
        margin-left: 10px;
    }

    .el-tag-hidden{
        visibility: hidden;
    }
</style>


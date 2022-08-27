<template>
  <div v-loading="isLoading" class="preview-report bg">
    <!--用于把内容括起来的 div 方便开发（后期删除）-->
    <div >
      <!--动画流行群-->
      <div class="star" style="position: absolute;z-index: 0;"/>
      <div class="star pink" style="position: absolute;z-index: 0;"/>
      <div class="star blue" style="position: absolute;z-index: 0;"/>
      <!--星空背景-->
      <starry-sky
        :sky-width="screenWidth"
        :sky-height="screenHeight"
        style="position:absolute;"
        point="35"
        line-color="rgba(255,255,255,0.2)"
        round-color="rgba(45,140,210,0.5)"/>
      <!--组件布局-->
      <div class="preview-container">
        <!--头部标题区域*******-->
        <div>
          <!--标题-->
          <span class="title-span shadow-font">{{ layoutData.title }}</span>
          <!--其他文字信息 左侧-->
          <span class="subtitle-span-left shadow-font">{{ layoutData.subTitleLeft }}</span>
          <!--实时时间 右侧-->
          <span class="subtitle-span-right shadow-font">{{ curDateTime | dateFormat('yyyy-MM-dd hh:mm:ss') }}</span>
          <!--这个自己封装的数字动画时钟组件有BUG后期再修复-->
          <!--<custom-clock-simple  class="subtitle-span-right"></custom-clock-simple>-->

          <!--logo和背景-->
          <div class="div-preview-row">
            <!--看板logo（客户公司logo）-->
            <div class="div-preview-logo">
              <img v-show="layoutData.userCompanyLogo.show" :src="layoutData.userCompanyLogo.imgSrcReq" class="i-preview-logo-user" >
            </div>
            <!--背景-->
            <div class="div-preview-title-bg"/>
            <!--看板logo（自己公司logo）-->
            <div class="div-preview-logo">
              <i v-show="layoutData.companyLogo.show" :class="[layoutData.companyLogo.imgSrc, 'i-preview-logo']"/>
            </div>
          </div>
        </div>
        <!--主体区域：图形组件布局-->
        <div
          v-for="(row, rowIndex) in layoutData.children"
          id="slide"
          :style="{justifyContent: row.align, height: `${row.height}px`}"
          :key="rowIndex"
          class="layout-row slide"
          @mouseenter="row.showBtns = true"
          @mouseleave="row.showBtns = false"
        >
          <!--行容器-->
          <div
            v-for="(col, colIndex) in row.children"
            id="slide1"
            :style="previewColStyle({width: col.initCol,height: row.height}, 100, 1, 24)"
            :key="colIndex"
            class="layout-col"
          >
            <!--列容器-->
            <default-container v-if="col.componentKey" class="tp">
              <!--todo:绘制图形的关键-->
              <!--<div class="col-title" :title="`custom-report-${col.componentName}`">{{col.title}}</div>-->
              <div :title="`custom-report-${col.componentName}`" class="col-title">{{ col.title }}</div>
              <!--动态加载图形组件-->
              <component
                :is="`custom-report-${col.componentName}`"
                :api="col.api"
                :api-method="col.method"
                :call-interval-sec="col.refreshSec"
                style="flex: 1"
              />
            </default-container>
            <default-container v-else>空组件</default-container>
          </div>
          <div id="slide2"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { chartType } from '@/global/chartType'
import StarrySky from '@/components/StarrySky/index'
import colStyle from './mixins/methods/col-style'
import customReports from './helper'
import DefaultContainer from '@/components/CustomReport/default-container'
// import { debounce } from 'lodash'
// resolveStorage
import { flatLayoutData, resolveStorage } from '@/utils'
import { queryComponentList } from '@/api/chartConfig'
import { queryKanbanTemplateDetail } from '@/api/boardTemplate'
import { objIsNullOrEmpty } from '@/utils/objUtils'
import { tvappTemplates } from '@/global/tvapp-templates'

export default {
  name: 'PreviewReport',
  components: { DefaultContainer, StarrySky, ...customReports },
  filters: {
    dateFormat(value, fmt) {
      const getDate = new Date(value)
      const o = {
        'M+': getDate.getMonth() + 1,
        'd+': getDate.getDate(),
        'h+': getDate.getHours(),
        'm+': getDate.getMinutes(),
        's+': getDate.getSeconds(),
        'q+': Math.floor((getDate.getMonth() + 3) / 3),
        'S': getDate.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
      }
      return fmt
    }
  },
  mixins: [colStyle],
  data() {
    return {
      // ===== 对话框相关 ===start===
      fullLoadingWindow: null,
      // ===== 对话框相关 ===end===
      screenWidth: document.body.clientWidth + 'px', // 屏幕尺寸
      screenHeight: document.body.clientHeight + 'px', // 屏幕尺寸
      autoScrollTimer: null, // 用于实现自动滚动页面的定时器
      autoScrollDownIndex: 0,
      autoScrollTopLongId: 0,
      autoScrollBottomLongId: 0,
      curDateTime: new Date(),
      curDateTimer: null,
      isLoading: false,
      isEditPath: false,
      editBtnTop: 30,
      showQueryContainer: false,
      // loadingExport: true,
      componentDatas: [],
      layoutData: {
        companyLogo: {
          show: true,
          imgSrc: 'iconfont icon-idclogo'
        },
        userCompanyLogo: {
          show: true,
          imgSrc: '',
          imgSrcReq: '' // 预处理的图片引入地址，如 require('@/' + item.imgSrc)
        }
      },
      queryData: {},
      apiList: {},
      flatData: [],
      requestList: [],
      pageCharts: [],
      colorBtns: [
        { color: 'default', type: 'primary' },
        { color: 'dark', type: 'success' },
        { color: 'shine', type: 'warning' },
        { color: 'infographic', type: 'danger' }
      ],
      chartType: chartType(),
      reportUnionKey: null,
      reportDetailData: null, // 记录下当前看板模板的详细数据
      reportDetailDataCommitMode: null // 提交数据到后台进行保存的数据模板（与后台数据交互的规范模板）
    }
  },

  mounted() {
    //* * 显示当前实时时间的定时器 **
    this.startCurDateTimer()
    // 设置监听器
    this.addListener()

    // 初始加载
    this.initLoad()
  },

  beforeDestroy() {
    // 清理显示当前实时时间的定时器
    this.clearAllTimer()

    // ============
    // window.removeEventListener('scroll', this.$$listeners.scroll)
    // window.onbeforeunload = null
  },

  methods: {
    //* * 开启显示当前实时时间的定时器 **
    startCurDateTimer() {
      this.curDateTimer = setInterval(() => {
        this.curDateTime = new Date()
      }, 1000)
    },

    // 设置监听器
    addListener() {
      // this.$$listeners = { scroll: null }
      // this.$$listeners.scroll = debounce(this.handleListenerScroll, 10)
      // window.addEventListener('scroll', this.$$listeners.scroll)
    },

    //* * 清理所有定时器 **
    clearAllTimer() {
      if (this.autoScrollTimer) {
        clearInterval(this.autoScrollTimer)
      }
      if (this.curDateTimer) {
        clearInterval(this.curDateTimer)
      }
    },

    // 将服务端的组件列表参数 转换成 这里用于配置的参数
    serverComponentsDataToConfig(cmpList) {
      const cmpDatas = []
      cmpList.forEach((item, index) => {
        const cmpItem = {
          'refreshSec': item.cmpRefSec,
          'componentType': item.cmpType,
          'label': item.cmpName,
          'componentKey': item.id,
          'componentName': '', // 这是对应VUE组件的后缀名称
          'api': item.cmpImpRoute,
          'method': 'get',
          'dataKey': '',
          'col': 6,
          'height': 250,
          'previewImage': ''
        }

        cmpItem.componentName = this.chartType[item.cmpType].name // 这是对应VUE组件的后缀名称(预览中 绘制组件 的关键)
        cmpItem.previewImage = this.chartType[item.cmpType].previewImage

        // 加入集合
        cmpDatas.push(cmpItem)
      })

      this.componentDatas = cmpDatas
    },

    // 将获取到的后台数据 转换 成当前的配置数据
    serverDataToConfigData(serverKbTmpCntList) {
      // 转换
      const reportDetailDataTemp = {
        'reportUnionKey': serverKbTmpCntList.id,
        'title': serverKbTmpCntList.tmpName,
        'subTitleLeft': serverKbTmpCntList.tmpNameSub,
        'companyLogo': {
          show: serverKbTmpCntList.tmpLogoShow,
          imgSrc: objIsNullOrEmpty(serverKbTmpCntList.tmpLogoUrl) ? 'iconfont icon-idclogo' : serverKbTmpCntList.tmpLogoUrl // 带默认值
        },
        'userCompanyLogo': {
          show: serverKbTmpCntList.tmpLogoSubShow,
          imgSrc: serverKbTmpCntList.tmpLogoSubUrl,
          imgSrcReq: objIsNullOrEmpty(serverKbTmpCntList.tmpLogoSubUrl) ? '' : serverKbTmpCntList.tmpLogoSubUrl
        },
        'children': []
      }

      // 记录到全局变量
      this.reportUnionKey = serverKbTmpCntList.id
      this.reportDetailDataCommitMode = serverKbTmpCntList.kbContainerRootList
      // 遍历转换详细布局数据
      serverKbTmpCntList.kbContainerRootList.forEach((item, index) => {
        const children1ItemTemp = {
          'align': '',
          'height': 0,
          'index': 0,
          'children': []
        }
        children1ItemTemp.align = item.cntAlign
        children1ItemTemp.height = item.cntHeight
        children1ItemTemp.index = item.cntIndex
        item.kbContainerList.forEach((itemB, index) => {
          const children2ItemTemp = {
            'col': 0,
            'componentKey': 0,
            'initCol': 0,
            'title': ''
          }
          children2ItemTemp.initCol = itemB.cntCol
          children2ItemTemp.col = itemB.cntCol
          children2ItemTemp.componentKey = itemB.cntComponentId
          children2ItemTemp.title = itemB.cntComponentName // 使用组件的标题

          // 加入集合
          children1ItemTemp.children.push(children2ItemTemp)
        })

        // 加入集合
        reportDetailDataTemp.children.push(children1ItemTemp)
      })

      // serverKbTmpCntList.

      this.reportDetailData = reportDetailDataTemp
    },

    // 接收处理服务端的组件列表参数
    receiveServerComponentsData(res) {
      res = res.data
      // 接收到模板布局数据
      if (res.errno !== 0) { // 访问失败
        this.$notify.error({
          title: '错误',
          message: res.errmsg
        })
      } else { // 访问成功
        if (!res.data.hasOwnProperty('kbComponentList') || objIsNullOrEmpty(res.data.kbComponentList) || res.data.kbComponentList.length < 1) {
          this.$notify({
            title: '警告',
            message: '没有查询到任何组件',
            type: 'warning'
          })
          this.componentDatas = []
        } else {
          // 将服务端的组件列表参数 转换成 这里用于配置的参数
          this.serverComponentsDataToConfig(res.data.kbComponentList)
        }
      }
    },

    // 根据组件ID匹配相应的统计图组件
    resolveReportData(reportData) {
      reportData.children &&
      reportData.children.forEach(row => {
        row.showBtns = false
        row.children &&
        row.children.forEach((col, colIndex) => {
          const curr =
            this.componentDatas.find(
              component => String(component.componentKey) === String(col.componentKey)
            ) || {}
          this.$set(row.children, colIndex, {
            ...col,
            ...curr
          })
        })
      })
      return reportData
    },

    // 处理图形组件的请求参数
    dealRequests() {
      // console.log(JSON.stringify(this.layoutData))
      this.flatData = flatLayoutData(this.layoutData)
      const { flatData, apiList } = this
      for (let index = 0; index < flatData.length; index++) {
        const item = flatData[index]
        const api = item.api
        if (!api) continue
        if (api in apiList) {
          apiList[api].sameIndexs.push(index)
        } else {
          apiList[api] = {}
          apiList[api].sameIndexs = [index]
        }
        if (!apiList[api].keys) {
          apiList[api].keys = []
        }
        apiList[api].keys[index] = item.dataKey
        apiList[api].method = item.method
      }
    },

    // 接收到模板布局信息
    receiveServerReportData(resolve, reportData) {
      reportData = reportData.data
      // 接收到模板布局数据
      if (reportData.errno !== 0) { // 访问失败
        this.$notify.error({
          title: '错误',
          message: reportData.errmsg
        })
      } else if (!reportData.hasOwnProperty('data') || !reportData.data.hasOwnProperty('kbTmpCntList') ||
        objIsNullOrEmpty(reportData.data.kbTmpCntList) || reportData.data.kbTmpCntList.length < 1) {
        this.$notify({
          title: '警告',
          message: '没有查询到任何模板数据',
          type: 'warning'
        })
        this.reportDetailData = []
      } else { // 访问成功
        // 将获取到的后台数据 转换 成当前的配置数据
        this.serverDataToConfigData(reportData.data.kbTmpCntList)
        // 绘制布局
        this.layoutData = this.resolveReportData(this.reportDetailData)
        this.dealRequests()
        resolve(1)
      }
    },

    // 从后台服务端请求模板布局数据绘制看板
    renderReport() {
      return new Promise((resolve, reject) => {
        // const { reportUnionKey } = this.$route.query
        // this.reportUnionKey = reportUnionKey

        const promises = [
          queryComponentList(),
          queryKanbanTemplateDetail(this.reportUnionKey)
        ]

        Promise.all(promises).then(ress => {
          const [componentDatas = [], reportData = {}] = ress
          // 接收到组件数据
          this.receiveServerComponentsData(componentDatas)

          // 接收到模板布局信息
          this.receiveServerReportData(resolve, reportData)
        })
      })
    },

    // getChartComponents() {
    //   const { pageCharts } = this
    //
    //   function getCharts(root) {
    //     root.$children.forEach(item => {
    //       if (item.$options.name.indexOf('chart') !== -1) pageCharts.push(item)
    //       if (item.$children.length) getCharts(item)
    //     })
    //   }
    //
    //   getCharts(this)
    // },

    // 从本地存储读取看板模板的完整数据
    getReportDetailStorageData() {
      const { reportUnionKey } = this.$route.query
      const previewData = resolveStorage('drag-report-data')
      // previewData.children = previewData.children;
      const data = { ...previewData, reportUnionKey }

      return data
    },

    // 从本地存储读取模板布局数据绘制看板
    renderReportByStorage() {
      return new Promise((resolve, reject) => {
        const { reportUnionKey } = this.$route.query
        this.reportUnionKey = reportUnionKey

        const promises = [
          queryComponentList()
        ]

        Promise.all(promises).then(ress => {
          const [componentDatas = []] = ress
          // 接收到组件数据
          // this.componentDatas = componentDatas;
          this.receiveServerComponentsData(componentDatas)

          // 从本地存储读取模板布局数据数据
          this.reportDetailData = this.getReportDetailStorageData()
          // 绘制布局
          this.layoutData = this.resolveReportData(this.reportDetailData)
          console.log('this.layoutData = ' + JSON.stringify(this.layoutData))
          this.dealRequests()
          resolve(1)
        })
      })
    },

    // 初始加载
    initLoad() {
      // 从本地存储读取是否来自编辑页标识：true=认为是从编辑页跳转过来，则读取本地模板数据；false=认为是从模板列表页跳转过来，则请求服务端模板数据
      // this.isEditPath = resolveStorage('drag-report-data:isEdit')
      // 接收路由参数
      const { reportUnionKey, isFromEdit, isTvApp, tvAppNoCode } = this.$route.query
      this.isEditPath = isFromEdit
      this.reportUnionKey = reportUnionKey
      // 根据路由参数判断执行逻辑
      if (isTvApp === 'true' && !objIsNullOrEmpty(tvAppNoCode)) {
        // 如果是TV看板的模板，则进行特殊的逻辑处理
        this.reportUnionKey = tvappTemplates()[tvAppNoCode]
        this.renderReport().then(() => {
          // this.getChartComponents()
          // this.loadingExport = false
        })
      } else if (this.isEditPath === 'true') { // 如果传递的数据中 isLocal=true 则认为是从编辑页面跳转过来，从而读取本地数据
        // 读取本地数据
        this.renderReportByStorage().then(() => {
          // this.getChartComponents()
        })
      } else { // 如果传递的数据中 isLocal=false，则认为是从 模板列表页面 跳转过来，从而读取服务器数据
        this.renderReport().then(() => {
          // this.getChartComponents()
          // this.loadingExport = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./layout.scss";
  @import "./layout-cool.scss";
  @import "./starShooting";
</style>
<style>

  .slide{position:absolute;height:100px;width:100%;overflow:hidden;}

</style>

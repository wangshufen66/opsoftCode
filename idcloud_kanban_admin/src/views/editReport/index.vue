<template>
  <div v-loading="isLoading" class="drag-report-main-container bg" style="margin-right: 2rem">
    <!--=========== 对话框组件 ==========start==========-->

    <!--普通信息对话框-->
    <simple-dialog
      :dialog-visible="simpleDialogData.dialogVisible"
      :dialog-title="simpleDialogData.dialogTitle"
      :dialog-message="simpleDialogData.dialogMessage"
      :dialog-cancel-callback="simpleDialogData.dialogCancelCallback"
      :dialog-confirm-callback="simpleDialogData.dialogConfirmCallback"/>

    <!--走马灯图片选择对话框-->
    <carousel-dialog
      :dialog-visible="carouselDialog.dialogVisible"
      :title="carouselDialog.dialogTitle"
      :images-data="carouselDialog.dialogImages"
      :dialog-cancel-callback="carouselDialog.dialogCancelCallback"
      :dialog-confirm-callback="carouselDialog.dialogConfirmCallback"/>

    <!--=========== 对话框组件 ==========end==========-->

    <!--左侧 保存 按钮（暂时按照原开源框架的思路，预览界面进行保存）-->
    <i
      v-if="!addRow.show"
      :style="{top: `${addContainerTop}px`,color:`#FF3030`, marginLeft:`22rem`}"
      class="el-icon-document ps-icon-btn"
      title="保存"
      @click="handleSaveLayout"
    />

    <!--左侧添加布局方块的 + 按钮-->
    <i
      v-if="!addRow.show"
      :style="{top: `${addContainerTop}px`,color:`#FF3030`, marginLeft:`28rem`}"
      class="el-icon-plus add-row-icon ps-icon-btn"
      title="添加布局"
      @click="addRow.show = true"
    />

    <!--右侧添加组件方块的 + 按钮-->
    <i
      v-if="!addCol.show"
      :style="{top: `${addContainerTop}px`,color:`#FF3030`, marginRight:`28.3rem`}"
      class="el-icon-plus add-col-icon ps-icon-btn"
      title="添加组件"
      @click="addCol.show = true"
    />

    <!--右侧启动预览界面 》 按钮-->
    <i
      v-if="!addCol.show"
      :style="{top: `${addContainerTop}px`,color:`#FF3030`, marginRight:`23rem`}"
      class="el-icon-view preview-icon ps-icon-btn"
      title="预览"
      @click="handleToPreviewPage"
    />

    <!--头部标题区域***start****-->
    <div style="margin-bottom:2rem;">
      <!--标题-->
      <span class="title-span shadow-font">
        <div>
          <span
            v-if="!showTitleEditer"
            @click="handleEditTitle"
          >{{ dragReportData.title || '请输入标题' }}</span>
          <el-input
            v-if="showTitleEditer"
            ref="titleInput"
            v-model="dragReportData.title"
            style="width: 380px;margin-left: 80px;"
            placeholder="请输入标题"
            @keyup.enter.native="showTitleEditer = false"
            @blur="showTitleEditer = false"
          />
        </div>
      </span>
      <!--其他文字信息 左侧-->
      <span class="subtitle-span-left shadow-font">
        <div>
          <span
            v-if="!showTitleEditer"
            @click="handleEditSubTitleLeft"
          >{{ dragReportData.subTitleLeft || '请输入副标题' }}</span>
          <el-input
            v-if="showTitleEditer"
            ref="subTitleLeftInput"
            v-model="dragReportData.subTitleLeft"
            style="width: 380px;margin-left: 80px;"
            placeholder="请输入副标题"
            @keyup.enter.native="showTitleEditer = false"
            @blur="showTitleEditer = false"
          />
        </div>
      </span>
      <!--实时时间 右侧-->
      <span class="subtitle-span-right shadow-font">日期时间</span>

      <!--logo和背景-->
      <div class="div-preview-row">
        <!--看板logo（客户公司logo）-->
        <div class="div-preview-logo">
          <div class="div-edit-logo">
            <div style="display: flex;flex-direction: row;">
              <el-switch
                v-model="dragReportData.userCompanyLogo.show"
                class="div-edit-log-switch"
                active-color="#13ce66"
                inactive-color="#ff4949"/>
              <el-button class="div-edit-log-select" size="mini" icon="el-icon-search" @click="handleClickUserCompanyLogo">LOGO选择</el-button>
            </div>
            <img v-show="dragReportData.userCompanyLogo.show" :src="dragReportData.userCompanyLogo.imgSrcReq" class="i-preview-logo-user">
          </div>
        </div>
        <!--背景-->
        <div class="div-preview-title-bg"/>
        <!--看板logo（自己公司logo）-->
        <div class="div-preview-logo">
          <div class="div-edit-logo">
            <el-switch
              v-model="dragReportData.companyLogo.show"
              class="div-edit-log-switch"
              active-color="#13ce66"
              inactive-color="#ff4949"/>
            <i v-show="dragReportData.companyLogo.show" :class="[dragReportData.companyLogo.imgSrc,'i-preview-logo']" style="flex: 5;"/>
          </div>
        </div>
      </div>
    </div>
    <!--头部标题区域***end****-->

    <!--下方布局组件区域-->
    <div class="drag-report-container">
      <div
        v-for="(row, rowIndex) in dragReportData.children"
        :key="rowIndex"
        :style="{justifyContent: row.align, height: `${row.height}px`}"
        class="layout-row-box"
        @drop="handleDropRow($event, row)"
        @dragover="handleDragOver($event, row)"
        @mouseenter="row.showControllerBar = true"
        @mouseleave="row.showControllerBar = false"
      >
        <transition name="slide-fade">
          <div
            v-if="row.showControllerBar"
            draggable="true"
            class="row-controller-bar"
            @dragstart="handleDragRow($event, row)"
          >
            <div class="row-controller-bar-title-box">index: {{ row.index }}</div>
            <div class="row-controller-bar-title-box">suggest-height: {{ row.height }}</div>
            <div
              class="row-controller-bar-title-box"
            >suggest-col: {{ PAGE_layout(row.children, "initCol") }}
            </div>
            <div class="row-controller-bar-title-box">real-col: {{ PAGE_layout(row.children, "col") }}</div>
            <div class="controller-bar-right-box">
              <span
                v-for="(align, alignIndex) in alignType"
                :title="align.title"
                :class="{active: row.align === align.value}"
                :key="alignIndex"
                class="align-type-item"
                @click="row.align = align.value">{{ align.label }}</span>
              <span class="align-type-item remove-item" @click="handleRemoveRow($event, row)">移除行</span>
            </div>
          </div>
        </transition>

        <div
          v-for="(col, colIndex) in row.children"
          :style="previewColStyle({repeat:'norepeat',width: col.initCol, height: row.height}, 100, 1, 24, {backgroundImage: col.previewImage ? `url(${col.previewImage})` : null, cursor: col.previewImage ? 'all-scroll' : null})"
          :key="colIndex"
          :draggable="col.previewImage ? true : false"
          class="layout-col-box layout-col-box-bg"
          @mouseenter="col.previewImage ? col.showChildrenControllerBar = true : null"
          @mouseleave="col.showChildrenControllerBar = false"
          @dragstart="handleDragCol($event, col, false)"
          @drop="handleDropCol($event, col)"
          @dragover="handleDragOver($event, col)">
          <transition name="slide-fade">
            <div v-if="col.showChildrenControllerBar" class="col-controller-bar">
              <span class="col-controller-bar-title-box" style="float: left">{{ col.title }}</span>
              <span class="col-controller-bar-title-box remove-item" @click="resetCol(col)">移除组件</span>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!--拖拽窗体组件-->
    <div>
      <transition name="slide-fade">
        <div
          v-show="addRow.show"
          :style="{top: `${addContainerTop}px`,position: 'fixed',height:'95%'}"
          class="drag-report-add-box drag-report-add-row-box"
          @mouseenter="addRow.showControllerBar = true"
          @mouseleave="addRow.showControllerBar = false"
        >
          <transition name="slide-fade">
            <div v-if="addRow.showControllerBar" class="title-box">
              <i class="el-icon-close" @click="addRow.show = false"/>
            </div>
          </transition>

          <report-layouts-window
            v-clickoutside="handleClickoutside(addRow)"
            @drag-row-start="handleDragNewRow"
          />
        </div>
      </transition>

      <transition name="slide-fade">
        <div
          v-show="addCol.show"
          :style="{top: `${addContainerTop}px`,position: 'fixed',height:'95%'}"
          class="drag-report-add-box drag-report-add-col-box drag-box"
          @mouseenter="addCol.showControllerBar = true"
          @mouseleave="addCol.showControllerBar = false"
        >
          <transition name="slide-fade">
            <div v-if="addCol.showControllerBar" class="title-box">
              <i class="el-icon-close" @click="addCol.show = false"/>
            </div>
          </transition>

          <charts-window
            v-clickoutside="handleClickoutside(addCol)"
            @drag-col-start="handleDragCol"
          />
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
import { chartType } from '@/global/chartType'
import { userLogos } from '@/global/user-logos'
import SimpleDialog from '@/components/SimpleDialog/index'
import CarouselDialog from '@/components/CarouselDialog/index'
import { objIsNullOrEmpty } from '@/utils/objUtils'
// queryKanbanTemplateDetail, saveKanbanTemplate, deleteKanbanTemplate
import { queryComponentList } from '@/api/chartConfig'
import { saveKanbanTemplate, queryKanbanTemplateDetail } from '@/api/boardTemplate'
import colStyle from '@/components/ChartsWindow/mixins/methods/col-style'
import clickoutside from '@/directive/clickoutside'
// openNewWindow, setStorage
import { deepCloneByJson, openNewWindow, setStorage } from '@/utils'
import ReportLayoutsWindow from '@/components/ReportLayoutsWindow/index'
import ChartsWindow from '@/components/ChartsWindow/index'

const colSkipArr = ['initCol']

export default {
  name: 'EditReport',
  components: { ChartsWindow, ReportLayoutsWindow, CarouselDialog, SimpleDialog },
  directives: { clickoutside },
  mixins: [colStyle],
  data() {
    return {
      // ===== 对话框相关 ===start===
      simpleDialogData: {
        dialogVisible: false, // 是否显示
        dialogTitle: '提示',
        dialogMessage: '',
        dialogCancelCallback: null,
        dialogConfirmCallback: null
      },

      // 走马灯图片选择对话框
      carouselDialog: {
        dialogVisible: false, // 是否显示
        dialogTitle: '提示',
        dialogImages: [],
        dialogCancelCallback: null,
        dialogConfirmCallback: null
      },
      // ===== 对话框相关 ===end===
      componentType: chartType(),
      isLoading: false,
      showTitleEditer: false,
      dragReportData: {
        title: '',
        subTitleLeft: '',
        companyLogo: {
          show: true,
          imgSrc: 'iconfont icon-idclogo'
        },
        userCompanyLogo: {
          show: true,
          imgSrc: '',
          imgSrcReq: '' // 预处理的图片引入地址，如 require('@/' + item.imgSrc)
        },
        children: []
      },
      componentDatas: [],
      alignType: [
        { title: '左对齐', label: 'left', value: 'flex-start' },
        { title: '居中对齐', label: 'center', value: 'center' },
        { title: '右对齐', label: 'right', value: 'flex-end' },
        { title: '两侧留白', label: 'around', value: 'space-around' },
        { title: '两侧对齐', label: 'between', value: 'space-between' }
      ],
      dragData: {
        isRow: false,
        isNewRow: false,
        isNewCol: false,
        col: null,
        row: null,
        rowIndex: null
      },
      addContainerTop: 50,
      addRow: {
        show: false,
        showControllerBar: false
      },
      addCol: {
        show: false,
        showControllerBar: false
      },
      reportUnionKey: null,
      reportDetailData: null, // 记录下当前看板模板的详细数据
      reportDetailDataCommitMode: null // 提交数据到后台进行保存的数据模板（与后台数据交互的规范模板）
    }
  },
  mounted() {
    this.addListener()
    const { reportUnionKey } = this.$route.query
    this.reportUnionKey = reportUnionKey
    // console.log("接收到的看板ID：" + JSON.stringify(this.reportUnionKey))

    if (objIsNullOrEmpty(reportUnionKey)) { // 传递过来的【看板模板ID】为空(NULL),则执行【新增模式】
      // 【新增模式】初始化
      this.initNewReportLayout()
    } else { // 传递过来的【看板模板ID】不为空(NULL),则执行【编辑模式】
      // 【编辑模式】初始化(从后台读取数据)
      // 获取后台模板布局数据
      this.handleCallLayout()
    }
  },
  beforeDestroy() {
    // window.removeEventListener("scroll", this.$$listeners.scroll);
  },
  methods: {
    // ====== 通知对话框 ======start======

    openNotificationSuccess(msg) {
      this.$notify({
        title: '成功',
        message: msg,
        type: 'success'
      })
    },

    openNotificationWarning(msg) {
      this.$notify({
        title: '警告',
        message: msg,
        type: 'warning'
      })
    },

    openNotificationInfo(msg) {
      this.$notify.info({
        title: '消息',
        message: msg
      })
    },

    openNotificationError(msg) {
      this.$notify.error({
        title: '错误',
        message: msg
      })
    },
    // ======= 通知对话框 ======end=======
    // ===== 对话框相关 ===start===

    // 打开 普通信息对话框（自定义封装的组件，保证全工程通用）
    openCmpSimpleDialog: function(title, msg, cancelCallback, confirmCallback) {
      this.simpleDialogData.dialogTitle = title
      this.simpleDialogData.dialogMessage = msg
      this.simpleDialogData.dialogVisible = true

      // 设置取消按钮点击回调函数
      this.simpleDialogData.dialogCancelCallback = cancelCallback
      // 设置确定按钮点击回调函数
      this.simpleDialogData.dialogConfirmCallback = confirmCallback
    },

    // 打开 走马灯图片选择对话框
    openCarouselDialog: function(title, imgs, cancelCallback, confirmCallback) {
      this.carouselDialog.dialogTitle = title
      this.carouselDialog.dialogImages = imgs
      this.carouselDialog.dialogVisible = true

      this.carouselDialog.dialogCancelCallback = cancelCallback
      this.carouselDialog.dialogConfirmCallback = confirmCallback
    },

    // ===== 对话框相关 ===end===

    addListener() {
      // this.$$listeners = { scroll: null }
      // this.$$listeners.scroll = debounce(this.handleListenerScroll, 10)
      // window.addEventListener('scroll', this.$$listeners.scroll)
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

    // 接收到模板布局数据
    receiveServerReportData(reportData) {
      reportData = reportData.data
      // 接收到模板布局数据
      if (reportData.errno !== 0) { // 访问失败
        this.openNotificationError(reportData.errmsg)
      } else if (!reportData.hasOwnProperty('data') || !reportData.data.hasOwnProperty('kbTmpCntList') ||
        objIsNullOrEmpty(reportData.data.kbTmpCntList) || reportData.data.kbTmpCntList.length < 1) {
        this.openNotificationWarning('没有查询到任何模板数据')
        this.reportDetailData = []
      } else { // 访问成功
        // 将获取到的后台数据 转换 成当前的配置数据
        this.serverDataToConfigData(reportData.data.kbTmpCntList)
        // 绘制当前布局
        this.resolveReportData(this.reportDetailData)
      }
    },

    /**
     * 获取看板模板布局（异步访问后台接口）
     * （编辑已有模板时调用）
     * */
    handleCallLayout() {
      if (!objIsNullOrEmpty(this.reportUnionKey)) { // 模板ID不为空，才查询
        const promises = [
          // getcomponentinfo(),
          queryComponentList(),
          queryKanbanTemplateDetail(this.reportUnionKey)
        ]

        // 打开全屏等待
        this.isLoading = true
        // 通过 Promise.all 将两个异步请求，按先后次序执行
        Promise.all(promises)
          .then(ress => {
            const [componentDatas = [], reportData = {}] = ress
            // console.log(JSON.stringify(ress))

            // 获取请求到的组件数据
            // 接收服务端的组件数据
            this.receiveServerComponentsData(componentDatas)
            // this.componentDatas = componentDatas;

            // 接收到模板布局数据
            this.receiveServerReportData(reportData)
          })
          .finally(() => {
            // 关闭全屏等待
            this.isLoading = false
          })
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
          'componentName': '', // :这里应该存放可以使用的VUE组件名称(预览中 绘制组件 的关键)
          'api': item.cmpImpRoute,
          'method': 'get',
          'dataKey': '',
          'col': 2,
          'height': 10,
          'previewImage': ''
        }

        cmpItem.componentName = this.componentType[item.cmpType].name // 这是对应VUE组件的后缀名称(预览中 绘制组件 的关键)
        cmpItem.previewImage = this.componentType[item.cmpType].previewImage

        // 加入集合
        cmpDatas.push(cmpItem)
      })

      this.componentDatas = cmpDatas
    },

    // 接收处理服务端的组件列表参数
    receiveServerComponentsData(res) {
      res = res.data
      if (res.errno !== 0) { // 访问失败
        this.openNotificationError(res.errmsg)
      } else if (!res.hasOwnProperty('data') ||
        !res.data.hasOwnProperty('kbComponentList') ||
        res.data.kbComponentList === undefined ||
        res.data.kbComponentList.length <= 0) {
        this.openNotificationWarning('没有查询到任何组件')
      } else { // 访问成功
        // 将服务端的组件列表参数 转换成 这里用于配置的参数
        this.serverComponentsDataToConfig(res.data.kbComponentList)
      }
    },

    resolveReportData(dragReportData) {
      // 为保证存到数据库的数据少一些，对数据做一些优化
      dragReportData.children &&
      dragReportData.children.forEach(row => {
        row.showControllerBar = false
        row.children &&
        row.children.forEach((col, colIndex) => {
          const mixinCol = { showChildrenControllerBar: false }
          const curr =
            this.componentDatas.find(
              component => String(component.componentKey) === String(col.componentKey)
            ) || {}
          this.$set(row.children, colIndex, {
            ...col,
            ...curr,
            ...mixinCol
          })
        })
      })
      this.dragReportData = dragReportData
    },

    /**
     * 初始化一个新的看板布局
     * （新增模板时调用）
     * */
    initNewReportLayout() {
      // 新增模式下，设置一行默认的空布局（因为至少必须有一个行布局）
      const reportData = {
        'title': '新模板',
        'reportUnionKey': null,
        'subTitleLeft': '',
        'companyLogo': {
          show: true,
          imgSrc: 'iconfont icon-idclogo' // 带默认值
        },
        'userCompanyLogo': {
          show: true,
          imgSrc: '',
          imgSrcReq: ''
        },
        'children': [{
          align: 'flex-start',
          height: 250,
          index: 0,
          children: [
            { col: 24, componentKey: null, initCol: 24, title: null }
          ]
        }]
      }
      this.isLoading = true
      const promises = [
        // getcomponentinfo(),
        queryComponentList()
      ]

      Promise.all(promises)
        .then(ress => {
          const [componentDatas = []] = ress
          // 接收服务端的组件数据
          this.receiveServerComponentsData(componentDatas)
          // this.componentDatas = componentDatas;
          // console.log(JSON.stringify(this.componentDatas))

          // 绘制布局
          this.resolveReportData(reportData)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    // 行布局图件排序
    sortRow() {
      const { dragReportData } = this
      dragReportData.children = dragReportData.children.sort(
        (a, b) => a.index - b.index
      )
      dragReportData.children.forEach((item, index) => (item.index = index))
    },

    // 获取初始列参数
    getInitCol(options) {
      const obj = {
        title: null,
        col: 0,
        componentKey: null,
        initCol: 0,
        showChildrenControllerBar: false
      }
      return { ...obj, ...options }
    },

    // 拖拽窗体组件点击外部区域的事件
    handleClickoutside(container) {
      return function() {
        container.show && (container.show = false)
      }
    },

    // 行布局窗体，拖拽内部图件事件
    handleDragNewRow(event, row) {
      this.dragData.isRow = true
      this.dragData.isNewRow = true
      this.dragData.row = {
        index: null,
        align: 'flex-start',
        height: row[0].height,
        showControllerBar: false,
        children: row.map(col =>
          this.getInitCol({
            initCol: col.value
          })
        )
      }
    },

    // 图形组件窗体，拖拽内部图件事件
    handleDragCol(event, component, isNewCol = true) {
      /**
       * isNewCol 区分是否是拖动的新的组件
       */
      if (!component.previewImage) return
      this.dragData.isRow = false
      this.dragData.col = component
      this.dragData.isNewCol = isNewCol
      this.addCol.show = false
    },

    // 接收到拖拽的行布局图件
    handleDropRow(event, row) {
      // console.log("拖拽过来的高度：" + this.dragData.row.height);
      if (!this.dragData.isRow) return
      // 计算当前页高度
      const sum = this.dragReportData.children.reduce(
        (pre, curr) => (pre = parseInt(pre) + parseInt(curr.height)),
        0
      )
      if (!this.dragData.isNewRow) {
        const dragIndex = this.dragData.row.index
        const oldIndex = row.index
        this.dragData.row.index = oldIndex
        row.index = dragIndex
        this.sortRow()
      } else {
        // console.log("当前页的高度：" + sum);
        const h = parseInt(sum) + parseInt(this.dragData.row.height)
        // console.log("接收到拖拽过来组件后的高度：" + h);
        // todo：尝试废除高度限制（因为如果拖拽的组件高度超出250，就会出现高度值混乱的问题，后期再修改）
        if (h > 2300) {
          this.$message.error('高度超出一页纸')
          return
        }
        const { dragReportData } = this
        const behindRows = dragReportData.children.reduce((prev, curr) => {
          if (curr.index > row.index) {
            return [...prev, curr]
          } else {
            return prev
          }
        }, [])
        behindRows.forEach(row => row.index++)
        dragReportData.children.push({
          ...this.dragData.row,
          index: row.index + 1
        })
        this.sortRow()
      }
    },

    setCol(from, target) {
      for (const key in from) {
        if (from.hasOwnProperty(key)) {
          if (colSkipArr.indexOf(key) === -1) {
            this.$set(target, key, from[key])
          }
        }
      }

      // console.log("setCol后的数据：" + JSON.stringify(target))
    },

    delCol(component) {
      for (const key in component) {
        if (component.hasOwnProperty(key)) {
          if (colSkipArr.indexOf(key) === -1) {
            this.$delete(component, key)
            // console.log("移除组件后的component数据对象：" + JSON.stringify(component))
          }
        }
      }
    },

    resetCol(col) {
      const init = this.getInitCol({
        initCol: col.initCol
      })
      this.delCol(col)
      this.setCol(init, col)
    },

    // 接收到拖拽的图形组件的图件
    handleDropCol(event, target) {
      // 如果拖动的是 row，忽略
      if (this.dragData.isRow) return
      const oldFrom = deepCloneByJson(this.dragData.col)
      const oldTarget = deepCloneByJson(target)

      this.setCol(this.dragData.col, target)
      if (!this.dragData.isNewCol) {
        // 若拖动的组件不是新组件
        if (oldTarget.previewImage) {
          // 若放置的位置不是空的，则将两者交换
          this.setCol(oldFrom, target)
          this.setCol(oldTarget, this.dragData.col)
        } else {
          // 若放置的位置是空的，则将 target 赋值并重置 from
          this.setCol(this.dragData.col, target)
          this.resetCol(this.dragData.col)
        }
      } else {
        this.addCol.show = true
      }
    },

    // 接收到拖拽的图形组件的图件
    handleDragOver(event) {
      // 默认情况下，对于 drop 的元素，要使用 dragover 移除默认事件，event.preventDefault()
      event.preventDefault()
    },

    // 行拖拽事件
    handleDragRow(event, row) {
      this.dragData.isRow = true
      this.dragData.isNewRow = false
      this.dragData.row = row
    },

    handleRemoveRow(event, row) {
      const { dragReportData } = this
      if (dragReportData.children.length === 1) {
        this.$message({
          message: '至少需要一条布局',
          type: 'warning'
        })
        return
      }
      dragReportData.children = dragReportData.children.filter(
        item => item.index !== row.index
      )
    },

    PAGE_layout(cols, key) {
      return cols.map(item => (item[key] ? item[key] : 0)).join(' : ')
    },

    // 标题编辑事件
    handleEditTitle() {
      this.showTitleEditer = true
      this.$nextTick(() => {
        const { titleInput } = this.$refs
        titleInput.focus()
      })
    },

    // 副标题编辑事件
    handleEditSubTitleLeft() {
      this.showTitleEditer = true
      this.$nextTick(() => {
        const { subTitleLeftInput } = this.$refs
        subTitleLeftInput.focus()
      })
    },

    // 头部左边客户公司logo图片点击事件
    handleClickUserCompanyLogo() {
      // 打开选择logo的图片选择对话框
      this.openCarouselDialog('选择LOGO', userLogos(), () => { // 取消按钮回调
        // 关闭对话框
        this.carouselDialog.dialogVisible = false
      }, (curImageItem) => { // 确定按钮回调
        // 关闭对话框
        this.carouselDialog.dialogVisible = false
        this.dragReportData.userCompanyLogo = { // 用户公司的logo数据（从图片选择对话框接收到的回调数据，其中右图片地址信息）
          show: true,
          // key: curImageItem.key,    //key值一定要唯一
          // label: curImageItem.label,   //图片标签内容
          imgSrc: curImageItem.imgSrc, // 记录图片地址原值
          imgSrcReq: objIsNullOrEmpty(curImageItem.imgSrc) ? '' : curImageItem.imgSrc // 预处理的图片引入地址，如 require('@/' + item.imgSrc)
        }
        console.log('LOGO图片选择，接收到的回调参数：' + JSON.stringify(curImageItem))
      })
    },

    // 整合布局数据
    resolvePreviewData() {
      return {
        title: this.dragReportData.title,
        subTitleLeft: this.dragReportData.subTitleLeft,
        companyLogo: this.dragReportData.companyLogo,
        userCompanyLogo: this.dragReportData.userCompanyLogo,
        reportUnionKey: this.dragReportData.reportUnionKey,
        children: this.dragReportData.children.map(row => {
          return {
            align: row.align,
            height: row.height,
            index: row.index,
            children: row.children.map(col => ({
              col: col.col,
              componentKey: col.componentKey,
              initCol: col.initCol,
              title: col.title
            }))
          }
        })
      }
    },

    // 获取看板模板的完整数据
    getReportDetailStorageData() {
      const { reportUnionKey } = this.$route.query
      const previewData = this.resolvePreviewData()
      const data = { ...previewData, reportUnionKey }

      return data
    },

    // 将看板模板详细数据 转换成 与后台交互的模板数据
    reportDetailDataToCommitMode() {
      // 获取当前模板数据
      let reportUnionKeyTemp = '' // 记录下看板模板id，用于提交更新数据
      if (!objIsNullOrEmpty(this.reportDetailData)) {
        reportUnionKeyTemp = this.reportDetailData.reportUnionKey
      }
      this.reportDetailData = this.getReportDetailStorageData()
      this.reportDetailData.reportUnionKey = reportUnionKeyTemp

      // 转换成 与后台交互的模板数据
      // 模板头主数据
      const dataCommitMode = {
        'id': this.reportDetailData.reportUnionKey, // 模板ID
        'tmpName': this.reportDetailData.title, // 模板名称（标题）
        'tmpNameSub': this.reportDetailData.subTitleLeft, // 模板名称（标题）
        'tmpLogoUrl': this.dragReportData.companyLogo.imgSrc, // 公司logo图片地址（这里存的是class样式字符串，用的是阿里矢量图 iconfont xxx）
        'tmpLogoShow': this.dragReportData.companyLogo.show, // 公司logo图片是否显示
        'tmpLogoSubUrl': this.dragReportData.userCompanyLogo.imgSrc, // 客户公司logo图片地址
        'tmpLogoSubShow': this.dragReportData.userCompanyLogo.show, // 客户公司logo是否显示

        'kbContainerRootList': []
      }
      // 遍历详细布局数据
      this.reportDetailData.children.forEach((item, index) => {
        const kbContainerRootListItemTemp = {
          'id': '',
          'cntAlign': '', // 容器对其样式
          'cntHeight': 0, // 容器高度
          'cntIndex': 0, // 行容器自上而下的索引
          'relTmpCntrootId': '',
          'kbContainerList': []
        }
        kbContainerRootListItemTemp.cntAlign = item.align
        kbContainerRootListItemTemp.cntHeight = item.height
        kbContainerRootListItemTemp.cntIndex = item.index
        item.children.forEach((itemB, index) => {
          const kbContainerListItemTemp = {
            'id': '',
            'cntIndex': index, // 由左往右的列索引值（后台查询时，需要安装此索引进行排序，以保存时的次序进行反馈）
            'cntCol': 0, // 宽度占位比
            'cntComponentId': '', // 组件ID
            'relCntrootCntId': ''
          }

          kbContainerListItemTemp.cntCol = itemB.initCol
          kbContainerListItemTemp.cntComponentId = itemB.componentKey

          // 加入集合
          kbContainerRootListItemTemp.kbContainerList.push(kbContainerListItemTemp)
        })

        // 加入集合
        dataCommitMode.kbContainerRootList.push(kbContainerRootListItemTemp)
      })

      this.reportDetailDataCommitMode = dataCommitMode
    },

    /**
     * 保存看板模板（异步提交数据到后台）
     */
    handleSaveLayout() {
      this.simpleDialogData.dialogConfirmCallback = null
      // 打开普通信息对话框 进行提示
      this.openCmpSimpleDialog('提示', '确定要保存吗？', () => {
        this.simpleDialogData.dialogVisible = false
      }, () => {
        // 关闭对话框
        this.simpleDialogData.dialogVisible = false
        // 打开全屏等待
        this.isLoading = true

        // 先将看板模板的配置数据 转换成 与后台交互的数据格式
        this.reportDetailDataToCommitMode()
        // 把转换成功的数据提交到后台
        saveKanbanTemplate(this.reportDetailDataCommitMode).then(res => {
          res = res.data
          if (res.errno !== 0) { // 保存失败
            this.openNotificationError(res.errmsg)
          } else { // 保存成功
            // 更新当前数据id
            this.reportDetailData.reportUnionKey = res.data.id
            this.reportDetailDataCommitMode.id = res.data.id
            this.openNotificationSuccess(res.data.msg)
          }
        }).finally(() => {
          // 关闭全屏等待
          this.isLoading = false
        })
      })
    },

    // 打开模板预览页面
    openPreviewReportPage(params) {
      const { href } = this.$router.resolve({
        path: '/previewReport',
        query: params
      })
      openNewWindow(href)
    },

    // 预览按钮 点击事件
    handleToPreviewPage() {
      // 将当前的布局参数存入localstorage（让模板预览页面从本地获取）
      const previewData = this.resolvePreviewData()
      setStorage('drag-report-data', JSON.stringify(previewData))
      // 开启模板预览页面（并传递路由参数）
      const { reportUnionKey } = this.$route.query // 获取路由传递过来的 reportUnionKey 模板ID
      const isFromEdit = true // 这个值为true，则模板预览页面会从本地获取布局参数，而非访问后台数据
      const params = { reportUnionKey, isFromEdit }
      this.openPreviewReportPage(params)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "./layout.scss";
  @import "../previewReport/layout-cool.scss";

  drag-box{
    position: fixed;
    height: 5rem;
  }

  /*组件布局框的背景图样式*/
  .layout-col-box-bg{
    background-size: 95% 95%;
    background-repeat: no-repeat;
    opacity: 0.8;
  }

  // 客户公司logo样式
  .user-company-logo{

  }
  // 客户公司logo鼠标悬浮样式样式
  .user-company-logo:hover{
    //悬浮变手型
    cursor: pointer;
  }

</style>

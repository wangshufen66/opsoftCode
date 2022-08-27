<template>
  <div v-loading="pageLoading" class="fx-main-container">
    <!--========对话框=============start=============-->
    <!--普通信息对话框-->
    <simple-dialog
      :dialog-width="simpleDialogData.dialogWidth"
      :dialog-visible="simpleDialogData.dialogVisible"
      :dialog-title="simpleDialogData.dialogTitle"
      :dialog-message="simpleDialogData.dialogMessage"
      :dialog-grid-table="simpleDialogData.dialogGridTable"
      :dialog-cancel-callback="simpleDialogData.dialogCancelCallback"
      :dialog-confirm-callback="simpleDialogData.dialogConfirmCallback"
      style="flex: 0"/>
    <!--========对话框=============end=============-->
    <!--左侧：图件列表-->
    <el-card :style="{height:pageHeight + 'px'}" class="box-card chart-list-card">
      <div slot="header" class="clearfix chart-list-card-header">
        <el-input v-model="chartInfo.searchInput" clearable class="filter-item" placeholder="请输入图件名称" />
        <el-button icon="el-icon-search" type="text">搜索</el-button>
      </div>
      <div v-loading="chartInfo.fullLoading" class="infinite-list-wrapper chart-list-card-body">
        <ul
          v-infinite-scroll="chartInfoLoad"
          :style="{height:(pageHeight - 120) + 'px'}"
          class="list image-scroll"
          infinite-scroll-disabled="chartInfoDisabled">
          <li
            v-for="item in getFilterArray(chartInfo.data, 'cmpName', chartInfo.searchInput)"
            :id="item.id"
            :key="item.id"
            :class="['list-item', 'image-container', { 'image-container-border': item.selected }]"
            @click="handlerChartInfoClick(item)">
            <span class="image-title">名称：{{ item.cmpName }}</span>
            <span class="image-title-sub">类型：{{ item.cmpTypeName }}</span>
            <img :src="item.cmpImageSrc">
          </li>
          <p v-if="chartInfo.loading" class="chart-list-hint">加载中...</p>
          <p v-if="chartInfoNoMore" class="chart-list-hint">没有更多了</p>
        </ul>
      </div>
    </el-card>
    <!--右侧：图型编辑-->
    <div :style="{height:pageHeight + 'px'}" class="edit">
      <!--走马灯搜索栏-->
      <div slot="header" class="carousel-header">
        <el-input v-model="chartTypeSearch" clearable class="carousel-search-input" placeholder="请输入图件类型名称"/>
        <el-button icon="el-icon-search" class="carousel-search-button" type="text">搜索</el-button>
      </div>
      <!--走马灯-->
      <el-carousel
        ref="chartTypeCarousel"
        :autoplay="false"
        class="m-carousel"
        trigger="click"
        type="card"
        height="15rem"
        style="margin-top: 1rem;"
        @change="handlerChartTypeChange">
        <el-carousel-item
          v-for="(item, key) in chartType()"
          :key="key"
          :label="item.label"
          :name="item.label"
          class="m-carousel-item"
        >
          <el-tag class="img-label" >{{ item.label }}</el-tag>
          <img :src="item.previewImage" class="m-image" >
        </el-carousel-item>
      </el-carousel>
      <div class="edit-inputs">
        <!--操作按钮-->
        <div class="option-buttons">
          <div class="option-buttons-left">
            <el-button class="option-button-left" type="success" @click="handlerAddClick">添加 </el-button>
            <el-button v-show="canEdit" class="option-button-left" type="warning" @click="handlerClearClick">清空</el-button>
            <i v-show="canEdit && !curEditInfo.id" class="el-icon-circle-plus-outline" style="margin-left: 2rem;color:red;"> 新 </i>
          </div>
          <div class="option-buttons-right">
            <el-button v-show="curEditInfo.id" class="option-button-right" type="danger" @click="handlerDeleteClick">删除</el-button>
            <el-button v-show="canEdit" class="option-button-right" type="primary" @click="handlerSaveClick">保存</el-button>
          </div>
        </div>
        <!--表单-->
        <el-form
          ref="dynamicValidateForm"
          :model="dynamicValidateForm"
          class="m-edit-form">
          <el-form-item
            v-for="(form, index) in dynamicValidateForm.domains"
            v-if="form.isDraw"
            :label="form.title"
            :key="form.key"
            :prop="'domains.' + index + '.value'"
            :rules="form.rules"
            class="m-edit-form-item">
            <div class="form-box">
              <!--帮助提示-->
              <el-tooltip
                :content="form.tip"
                effect="dark"
                placement="top-start"
                style="margin-right: 1rem;">
                <i class="el-icon-question tip"/>
              </el-tooltip>
              <!--普通输入栏-->
              <el-input
                v-if="form.type === 'input'"
                :disabled="!canEdit"
                :type="form.inputType"
                :maxlength="form.maxlength"
                :minlength="form.minlength"
                :max="form.max"
                :min="form.min"
                :placeholder="form.title"
                v-model="form.value"
                class="m-form-input"
                @change="handlerInputChange(form.value,form.key)"
              />
              <!--时间选择器输入栏-->
              <el-time-picker
                v-if="form.type === 'timePicker'"
                :disabled="!canEdit"
                :default-value="form.timeDefaultValue"
                v-model="form.value"
                :picker-options="{selectableRange: form.timeRange}"
                :placeholder="form.placeholder"
                class="m-form-input"
                value-format="HH:mm:ss"
                @change="handlerTimePickerChange(form.value,form.key)"/>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
</div></template>

<script>
import { chartType } from '@/global/chartType'
import { getFilterArray, getFilterJson } from '@/utils/filterUtils'
import { dateTimeFormatToDate, secToTime, timeToSec } from '@/utils/dateUtils'
import { queryComponentList, saveComponent, deleteComponent } from '@/api/chartConfig'
import SimpleDialog from '@/components/SimpleDialog/index'

export default {
  name: 'ChartConfig',
  components: { SimpleDialog },
  data() {
    return {
      pageHeight: 0,
      pageLoading: false,
      simpleDialogData: {
        dialogWidth: '30%',
        dialogVisible: false, // 是否显示
        dialogTitle: '提示',
        dialogMessage: '',
        dialogGridTable: {},
        dialogCancelCallback: null,
        dialogConfirmCallback: null
      },
      chartInfo: {
        data: [
          {
            id: 0,
            cmpType: '',
            cmpTypeName: '',
            cmpName: '',
            cmpImageSrc: '',
            cmpRefSec: 0,
            cmpImpRoute: '',
            selected: false
          }
        ],
        dataTotalCount: 0, // todo:后期加入下拉加载更多数据的功能后，此值将从后台获取，目前只做预留，没有实际作用
        searchInput: '',
        loading: false,
        fullLoading: false
      },
      chartTypeSearch: '',
      canEdit: true,
      curEditInfo: {
        id: '',
        cmpType: '',
        cmpTypeName: '',
        cmpName: '',
        cmpImageSrc: '',
        cmpRefSec: 0,
        cmpImpRoute: ''
      },
      // ===== 表单相关 ===start===

      // （动态）表单输入栏位绑定属性
      dynamicValidateForm: {
        domains: [
          // // 新方案：通过弹出比较绚的 走马灯图片 选择统计图类型
          // {
          //   value: '', // 表单验证时，需要绑定的输入属性值
          //   name: '',
          //   isDraw: false, // 是否需要绘制，暂时用此字段对输入栏进行更改，避免注释代码后报错的情况
          //   key: 'commpontType',
          //   type: 'selectImage',
          //   tip: '组件图形的展示类型',
          //   title: '组件类型',
          //   rules: { required: true, message: '[组件类型]不能为空', trigger: 'blur' } // 表单验证规则
          // },
          // // 旧方案：通过下来选择框 实现 统计图类型 选择
          // {
          // value: "",  //表单验证时，需要绑定的输入属性值
          // isDraw: true, //是否需要绘制，暂时用此字段对输入栏进行更改，避免注释代码后报错的情况
          // key: "commpontType",
          // type: "selectRadio",
          // radioVlaues: componentType(),
          // tip: "组件图形的展示类型",
          // title: "组件类型",
          // rules: {required: true, message: '[组件类型]不能为空', trigger: 'blur'}  //表单验证规则
          // },
          {
            value: '', // 表单验证时，需要绑定的输入属性值
            isDraw: true, // 是否需要绘制，暂时用此字段对输入栏进行更改，避免注释代码后报错的情况
            key: 'cmpName',
            type: 'input',
            tip: '组件名称，前端开发完一个组件之后，假设是 custom-report-demo，那这里就填 demo 即可',
            title: '组件名称',
            rules: { required: true, message: '[组件名称]不能为空', trigger: 'blur' } // 表单验证规则
          },
          { // 刷新间隔时间
            value: '', // 表单验证时，需要绑定的输入属性值
            isDraw: true, // 是否需要绘制，暂时用此字段对输入栏进行更改，避免注释代码后报错的情况
            key: 'cmpRefSec',
            type: 'timePicker',
            timeRange: '00:00:00 - 23:59:59',
            timeDefaultValue: dateTimeFormatToDate('2019-01-01 00:01:00'),
            placeholder: '请选择时间',
            tip: '组件请求后台数据，并刷新图像的间隔时间',
            title: '刷新时间',
            rules: { required: true, message: '[刷新时间]不能为空', trigger: 'blur' } // 表单验证规则
          },
          {
            value: '', // 表单验证时，需要绑定的输入属性值
            isDraw: true, // 是否需要绘制，暂时用此字段对输入栏进行更改，避免注释代码后报错的情况
            key: 'cmpImpRoute',
            type: 'input',
            tip: '组件数据对应的接口',
            title: '后台接口',
            rules: { required: true, message: '[后台接口]不能为空', trigger: 'blur' } // 表单验证规则
          }]
      }

      // ===== 表单相关 ===end===
    }
  },
  computed: {
    chartInfoNoMore() {
      return this.chartInfo.data.length >= this.chartInfo.dataTotalCount
    },
    chartInfoDisabled() {
      return this.chartInfo.loading || this.chartInfoNoMore
    }
  },
  watch: {
    // 图件类型搜索输入框 输入值改变的监听器
    chartTypeSearch: {
      handler(newVal, oldVal) {
        let chartTypaName = ''
        // 从图件类型数据中模糊查询出对应的对象集合，获取其中第一个的label，作为走马灯跳转的name索引
        const filterJson = this.getFilterJson(this.chartType(), 'label', newVal)
        for (const itemKey in filterJson) {
          chartTypaName = filterJson[itemKey].label
        }
        // 走马灯跳转
        this.$refs.chartTypeCarousel.setActiveItem(chartTypaName)
      }
    },

    // 监听当前编辑栏的数据集合对象 改变事件
    'curEditInfo.id': {
      handler(newVal, oldVal) {
        // 发生改变，则赋值到表单对应的栏位中
        for (const key in this.curEditInfo) {
          this.dynamicValidateForm.domains.forEach(item => {
            if (String(key) === String(item.key)) {
              if (String(key) === 'cmpRefSec') {
                // 刷新时间，需要进行特殊转换(将单位为秒的值，转换成 时间格式字符串)
                item.value = secToTime(this.curEditInfo[key])
              } else {
                item.value = this.curEditInfo[key]
              }
            }
          })
        }
        // 设置当前走马灯
        this.$refs.chartTypeCarousel.setActiveItem(this.curEditInfo.cmpTypeName)
      }
    }
  },
  mounted() {
    this.pageHeight = (document.documentElement.clientHeight * 0.86)
    this.chartInfoInitLoad()
  },
  methods: {
    dateTimeFormatToDate: dateTimeFormatToDate,
    secToTime: secToTime,
    timeToSec: timeToSec,
    chartType: chartType,
    getFilterArray: getFilterArray,
    getFilterJson: getFilterJson,
    // 打开 普通信息对话框（自定义封装的组件，保证全工程通用）
    openCmpSimpleDialog(width, title, msg, gridTable, cancelCallback, confirmCallback) {
      this.simpleDialogData.dialogWidth = width
      this.simpleDialogData.dialogTitle = title
      this.simpleDialogData.dialogMessage = msg
      this.simpleDialogData.dialogGridTable = gridTable
      this.simpleDialogData.dialogVisible = true

      // 设置取消按钮点击回调函数
      this.simpleDialogData.dialogCancelCallback = cancelCallback
      // 设置确定按钮点击回调函数
      this.simpleDialogData.dialogConfirmCallback = confirmCallback
    },

    // 清除所有图件列表的选中状态
    clearChartInfoSelected() {
      this.chartInfo.data.forEach(item => {
        item.selected = false
      })
    },

    // 初始加载图件列表数据（目前直接从后台获取所有数据，暂未实现分页加载），此函数也可用作刷新功能
    chartInfoInitLoad() {
      this.chartInfo.fullLoading = true
      queryComponentList().then(response => {
        response = response.data
        if (response.errno !== 0) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: '原因：' + response.errmsg
          })
        } else if (!response.hasOwnProperty('data') ||
          !response.data.hasOwnProperty('kbComponentList') ||
          response.data.kbComponentList === undefined ||
          response.data.kbComponentList.length <= 0) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的数据量为0'
          })
        } else {
          // 反馈正常信息
          const allChartType = this.chartType()
          this.chartInfo.data = []
          let curCmpId = ''
          response.data.kbComponentList.forEach(item => {
            const chartData = {
              id: item.id,
              cmpType: item.cmpType,
              cmpTypeName: allChartType.hasOwnProperty(item.cmpType) ? allChartType[item.cmpType].label : '不存在的类型',
              cmpName: item.cmpName,
              cmpImageSrc: allChartType.hasOwnProperty(item.cmpType) ? allChartType[item.cmpType].previewImage : '',
              cmpRefSec: item.cmpRefSec,
              cmpImpRoute: item.cmpImpRoute,
              selected: (item.id === this.curEditInfo.id) // 与当前编辑项的id进行匹配，相等的，则激活其选中状态的样式
            }
            this.chartInfo.data.push(chartData)
            if (chartData.selected) {
              curCmpId = item.id
            }
          })
          // 若当前有已选中的图件项，则滚动到指定位置
          if (curCmpId) {
            // 滚动到指定位置（一定要通过定时器延迟执行，即等待UI绘制完成后才可滚动，否则效果不佳，滚动不到正确的位置；
            // 若页面绘制卡顿也可能造成滚动不到正确的位置，这种BUG后期再优化）
            const timer = setInterval(() => {
              document.getElementById(curCmpId).scrollIntoView()
              clearInterval(timer)
            }, 1000)
          }
        }
      }).catch(response => {
        const errorMsg = '异常信息：' + JSON.stringify(response)
        console.log(errorMsg)
        this.$notify.error({
          title: '失败',
          message: errorMsg
        })
      }).finally(() => {
        this.chartInfo.fullLoading = false
      })
    },
    // 下拉加载更多数据
    chartInfoLoad() {
      // TODO:后期加入下拉加载功能，目前直接请求所有数据
      // this.chartInfo.loading = true
      // setTimeout(() => {
      //   this.chartInfo.count += 2
      //   this.chartInfo.loading = false
      // }, 2000)
    },
    // 图件列表的图件项 点击事件
    handlerChartInfoClick(curChartInfoData) {
      // todo: 改变当前图件项的 选中样式 绑定变量值
      // 先清理原来选中状态的图件项的选中样式绑定值
      this.chartInfo.data.forEach(item => {
        if (item.selected) {
          item.selected = false
        }
      })
      // 激活当前点击的图件项的选中样式绑定值
      curChartInfoData.selected = true

      // 将当前点击的图件信息传递到编辑栏
      for (const key in curChartInfoData) {
        this.curEditInfo[key] = curChartInfoData[key]
      }
    },

    // 走马灯切换改变事件
    handlerChartTypeChange(newIndex, oldIndex) {
      // 走马灯切换，则当前编辑项的图件类型的值也要跟着改变
      // 由于该走马灯组件的改变事件，只能传递索引值，而我们的对象是JSON，只能通过索引值从JSON中进行匹配想要的内容
      let chartTypeKey = ''
      let chartTypeName = ''
      let jsonIndex = 0
      const chatTypeData = chartType()
      for (const key in chatTypeData) {
        if (parseInt(jsonIndex) === parseInt(newIndex)) {
          chartTypeKey = key
          chartTypeName = chatTypeData[key].label
          break
        }
        jsonIndex++
      }
      this.curEditInfo.cmpType = chartTypeKey
      this.curEditInfo.cmpTypeName = chartTypeName
    },
    /**
     * 输入栏框的值改变事件
     * @param inputValue 输入值
     * @param inputKey 输入框的key，标识这是哪个输入框（比如 组件名称的输入框的key=cmpName）
     */
    handlerInputChange(inputValue, inputKey) {
      // 把输入值 录入到 当前编辑对象中，后面用于提交到后台服务，进行增删改的操作
      if (inputKey === 'cmpName') {
        // 组件名称 输入值
        this.curEditInfo.cmpName = inputValue
      } else if (inputKey === 'cmpImpRoute') {
        // 组件绑定的接口完整地址URL
        this.curEditInfo.cmpImpRoute = inputValue
      }
    },
    /**
     * 时间输入栏框的值改变事件
     * @param inputValue 输入值
     * @param inputKey 输入框的key，标识这是哪个输入框（比如 组件名称的输入框的key=cmpName）
     */
    handlerTimePickerChange(inputValue, inputKey) {
      // 把输入值 录入到 当前编辑对象中，后面用于提交到后台服务，进行增删改的操作
      if (inputKey === 'cmpRefSec') {
        // 组件刷新时间 输入值
        this.curEditInfo.cmpRefSec = this.timeToSec(inputValue)
      }
      console.log('当前时间输入值：' + inputValue)
      console.log('当前编辑对象：' + JSON.stringify(this.curEditInfo))
    },

    // 重置图件类型走马灯选择器,以及当前编辑对象对应的值
    resetChartTypeCarouselSelectorWithEdit() {
      this.$refs.chartTypeCarousel.setActiveItem(0)
      const chartTypes = this.chartType()
      // 取json的第一项
      for (const key in chartTypes) {
        this.curEditInfo.cmpType = key
        this.curEditInfo.cmpTypeName = chartTypes[key].label
        break
      }
    },

    // 清空按钮点击事件
    handlerClearClick() {
      this.openCmpSimpleDialog('30%', '清空', '是否清空当前的编辑数据', null, () => {
        this.simpleDialogData.dialogVisible = false
      }, () => {
        this.simpleDialogData.dialogVisible = false
        this.clearCurEditData()
      })
    },

    // 清空当前编辑数据
    clearCurEditData() {
      // 清空当前输入框的绑定变量值
      this.dynamicValidateForm.domains.forEach(item => {
        item.value = ''
      })

      // 清空当前编辑对象(除了其中的id)
      for (const key in this.curEditInfo) {
        if ((String(key)) === 'cmpRefSec') {
          // 刷新时间不能为空字符串，因为需要进行来回进行时间和数值之间的转换，为空会引发异常错误
          this.curEditInfo[key] = '0'
        } else if (String(key) !== 'id') {
          this.curEditInfo[key] = ''
        }
      }
      // 重置图件类型走马灯选择器,以及当前编辑对象对应的值
      this.resetChartTypeCarouselSelectorWithEdit()
    },

    // 清空当前编辑对象(包括其中的id)
    clearCurEditDataWithId() {
      this.curEditInfo.id = ''
      this.clearCurEditData()
      // 清除所有图件列表的选中状态
      this.clearChartInfoSelected()
    },

    // 新增按钮点击事件
    handlerAddClick() {
      this.openCmpSimpleDialog('30%', '新增', '是否新增，将清空当前正在编辑的数据', null, () => {
        this.simpleDialogData.dialogVisible = false
      }, () => {
        this.simpleDialogData.dialogVisible = false
        this.clearCurEditDataWithId()
      })
    },

    // 获取根据当前编辑对象生成的用于在对话框中显示表格数据的对象
    getCurEditGridTableInfoForSimpleDialog() {
      return {
        width: 180,
        columns: [{
          property: 'cmpName',
          label: '组件名称'
        },
        {
          property: 'cmpTypeName',
          label: '组件类型'
        },
        {
          property: 'cmpRefSec',
          label: '刷新时间'
        },
        {
          property: 'cmpImpRoute',
          label: '后台接口'
        }
        ],
        data: [{ cmpName: this.curEditInfo.cmpName,
          cmpTypeName: this.curEditInfo.cmpTypeName,
          cmpRefSec: this.secToTime(this.curEditInfo.cmpRefSec),
          cmpImpRoute: this.curEditInfo.cmpImpRoute }]
      }
    },

    // 将当前编辑对象 整理成 用于提交后台的数据对象(删除操作)
    getCommitDeleteData() {
      return {
        id: this.curEditInfo.id,
        cmpType: this.curEditInfo.cmpType,
        cmpName: this.curEditInfo.cmpName,
        cmpRefSec: this.curEditInfo.cmpRefSec,
        cmpImpRoute: this.curEditInfo.cmpImpRoute
      }
    },

    // 删除按钮点击事件
    handlerDeleteClick() {
      this.openCmpSimpleDialog('50%', '是否删除这条前数据', '', this.getCurEditGridTableInfoForSimpleDialog(), () => {
        this.simpleDialogData.dialogVisible = false
      }, () => {
        this.simpleDialogData.dialogVisible = false
        // 提交删除数据
        deleteComponent(this.getCommitDeleteData()).then(response => {
          response = response.data
          if (response.errno !== 0) {
            // 反馈错误信息
            this.$notify.error({
              title: '失败',
              message: '原因：' + response.errmsg
            })
          } else {
            // 清理当前编辑内容
            this.clearCurEditDataWithId()
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success'
            })
            // 刷新图件列表
            this.chartInfoInitLoad()
          }
        }).catch(response => {
          const errorMsg = '异常信息：' + JSON.stringify(response)
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.pageLoading = false
        })
      })
    },

    // 保存按钮 点击事件
    handlerSaveClick() {
      this.$refs.dynamicValidateForm.validate((valid) => {
        if (valid) {
          // 验证通过：提交组件数据 保存到 服务端
          this.commitToSaveData()
        } else {
          // 验证不通过，自动显示所有错误提示
          return false
        }
      })
    },
    // 将当前编辑对象 整理成 用于提交后台的数据对象(保存操作)
    getCommitSaveData() {
      return {
        id: this.curEditInfo.id,
        cmpType: this.curEditInfo.cmpType,
        cmpName: this.curEditInfo.cmpName,
        cmpRefSec: this.curEditInfo.cmpRefSec,
        cmpImpRoute: this.curEditInfo.cmpImpRoute
      }
    },
    // 提交保存数据到后台
    commitToSaveData() {
      // 通过对话框进行提示是否需要保存
      const gridTable = this.getCurEditGridTableInfoForSimpleDialog()

      this.openCmpSimpleDialog('50%', '是否提交保存', '', gridTable, () => {
        this.simpleDialogData.dialogVisible = false
      }, () => {
        this.simpleDialogData.dialogVisible = false
        this.pageLoading = true
        // 提交数据处理
        saveComponent(this.getCommitSaveData()).then(response => {
          response = response.data
          if (response.errno !== 0) {
            // 反馈错误信息
            this.$notify.error({
              title: '失败',
              message: '原因：' + response.errmsg
            })
          } else if (!response.hasOwnProperty('data') ||
            !response.data.hasOwnProperty('id')) {
            this.$notify.error({
              title: '失败',
              message: '原因：得到的反馈data或者id为空，请维护'
            })
          } else {
            // 记录反馈的id
            this.curEditInfo.id = response.data.id
            this.$notify({
              title: '成功',
              message: response.data.msg,
              type: 'success'
            })
            // 刷新图件列表
            this.chartInfoInitLoad()
          }
        }).catch(response => {
          const errorMsg = '异常信息：' + JSON.stringify(response)
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.pageLoading = false
        })
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  $pageContainerMargin:1rem;
  $imageTitle:0.9rem;
  $imageTitleColor: #8470FF;
  $imageTitleSubColor:desaturate($imageTitleColor,90%);
  $carouselMarginVal:0.8rem;
  $optionButtonMarginVal:1rem;
  @mixin option-button($marginDirection, $marginVal){
    margin-#{$marginDirection}: $marginVal;
  }
  /*整个页面区域的样式（不被直接使用，用于被继承扩展）*/
  .page-container{
    @include rounded(margin, $pageContainerMargin);
  }
  /*最外层主容器*/
  .fx-main-container{
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    /*图件组件列表区域*/
    .chart-list-card{
      @extend .page-container;
      flex: 2;
      /*图件列表卡片头部*/
      .chart-list-card-header{
        display: flex;
        flex-direction: row;
        el-input{
          flex: 3;
        }
        el-button{
          flex: 1;
        }
      }
      /*图件列表卡片主体*/
      .chart-list-card-body{
        /*图片列表滚动容器*/
        .image-scroll{
          overflow-y: auto;
          padding-left: 0;
          /*图片卡片容器的边框样式（在作为选中状态下激活使用）*/
          .image-container-border{
            @include rounded(border, 0.1rem dashed #FF7F24);
            @include rounded(animation, twinkling 1s infinite ease-in-out);
            /*border: 0.1rem dashed #FF7F24;
            -webkit-animation: twinkling 1s infinite ease-in-out*/
          }
          /*图片卡片容器（包含图片以及文字等信息）*/
          .image-container{
            display: flex;
            flex-direction: column;
            height: 10rem;
            margin-bottom: 2rem;
            .image-title{
              flex:1;
              font-size: $imageTitle;
              color: $imageTitleColor;
            }
            .image-title-sub{
              flex:1;
              font-size: $imageTitle - 0.1;
              color: $imageTitleSubColor;
            }
            img{
              flex:3;
              width:auto;
              height:70%;
              border: 0.05rem solid gray;
              padding: 0.1rem;
            }
          }
          /*图片列表下方的下拉提示文字*/
          .chart-list-hint{
            width: 100%;
            text-align: center;
            font-size: 0.8rem;
            color: #91bbe9;
          }
        }
      }
    }
    /*编辑区域*/
    .edit{
      @extend .page-container;
      flex:8;
      border-width: 0.1rem;
      border-color: gray;
      border-style: none;
      box-shadow: 1px 1px 5px #949494;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      /*走马灯上方的搜索功能*/
      .carousel-header{
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: $carouselMarginVal;
        .carousel-search-input{
          width: 20rem;
        }
        .carousel-search-button{
          width: 1rem;
        }
      }
      /*上方图件类型选择走马灯图片*/
      .m-carousel{
        flex: 1;
        margin-left: $carouselMarginVal;
        margin-right: $carouselMarginVal;
        .m-carousel-item{
          background: white;
          border-width: 0.1rem;
          border-color: #7d7d7f;
          border-style: solid;
          box-shadow: 1px 1px 5px #949494;
          box-sizing: border-box;
          display: flex;flex-direction: column;text-align: center;
          .img-label{
            flex: 1;border: none;background: transparent;
          }
          .m-image{
            flex: 5;width: 100%;height: 100%;padding-bottom: 2rem;padding-left: 1rem;padding-right: 1rem;
          }
        }
      }
      /*下方输入栏位区域*/
      .edit-inputs{
        flex: 1;
        display: flex;
        flex-direction: column;
        .option-buttons{
          flex: 1;
          display: flex;
          flex-direction: row;
          margin-bottom: 2rem;
          .option-buttons-left{
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            .option-button-left{
              @include option-button('left',$optionButtonMarginVal);
            }
          }
          .option-buttons-right{
            flex: 1;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            .option-button-right{
              @include option-button('right',$optionButtonMarginVal);
            }
          }
        }
        .m-edit-form{
          flex: 8;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          .m-edit-form-item{
            width: 28rem;
            margin-left: 2rem;
            .form-box{
              .m-form-input{
                width: 20rem;
              }
            }
          }
        }
      }
    }
  }

  /*覆盖 .el-button 样式，避免自带样式影响效果*/
  .el-button{
    margin-left: 0px;
  }
  /*覆盖走马灯当前活动图片样式，实现自己想要的效果*/
  .el-carousel__item--card.is-active {
    z-index: 2;
    span{
      color: #FF7F24;
      font-size: 1.1rem;
    }
  }

  /*透明度闪烁动画*/
  .animated{
    @include rounded(nimation-duration, 10s);
    @include rounded(animation-fill-mode, both);
    /*-webkit-animation-duration: 10s;
    animation-duration: 10s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both*/
  }
  @-webkit-keyframes twinkling{
    0%{
      @include rounded(opacity, 0.5);
    }
    50%{
      @include rounded(opacity, 0.8);
    }
    100%{
      @include rounded(opacity, 1);
    }
  }
  @keyframes twinkling{
    0%{
      @include rounded(opacity, 0.5);
    }
    50%{
      @include rounded(opacity, 0.8);
    }
    100%{
      @include rounded(opacity, 1);
    }
  }
</style>

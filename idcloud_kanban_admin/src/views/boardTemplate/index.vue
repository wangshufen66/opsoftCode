<template>
  <div :style="{height: pageHeight + 'px'}" class="app-container m-container">
    <!--上方：搜索栏位-->
    <div class="filter-container">
      <el-input v-model="listQuery.templateName" clearable class="filter-item" style="width: 200px;" placeholder="请输入模板名称" @keyup.enter.native="handleTemplateFilter"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleTemplateFilter">查找</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreateNewTemplate">创建</el-button>
      <el-switch
        v-model="showTvTemplate"
        active-text="显示TV模板"
        inactive-text="隐藏TV模板"/>
      <el-button v-if="showTvTemplate" class="filter-item" type="warning" icon="el-icon-mobile-phone" @click="handleTvTemplate(1)">TV1</el-button>
      <el-button v-if="showTvTemplate" class="filter-item" type="warning" icon="el-icon-mobile-phone" @click="handleTvTemplate(2)">TV2</el-button>
      <el-button v-if="showTvTemplate" class="filter-item" type="warning" icon="el-icon-mobile-phone" @click="handleTvTemplate(3)">TV3</el-button>
    </div>
    <!--下方：卡片列表-->
    <div v-loading="templates.fullLoading" class="m-cards">
      <ul
        v-infinite-scroll="templateLoader"
        id="m-list-scroller"
        class="list"
        infinite-scroll-disabled="templatesDisabled">
        <el-card
          v-for="(tmpItem, tmpIndex) in templatesDataFilter"
          v-if="(tvappTemplates().tv1 === tmpItem.id || tvappTemplates().tv2 === tmpItem.id || tvappTemplates().tv3 === tmpItem.id)?showTvTemplate:true"
          :body-style="{ padding: '0px' }"
          :key="tmpIndex"
          class="m-card">
          <img src="@/assets/previewReport/databall.png" class="image image-title">
          <div style="padding: 14px;" class="m-card-bottom">
            <span class="m-card-text-title">{{ tmpItem.tmpName }}</span>
            <span class="m-card-text-sub">{{ tmpItem.tmpNameSub }}</span>
            <div class="bottom clearfix m-options">
              <!--<time class="time">{{ currentDate }}</time>-->
              <el-button type="text" class="button" @click="handleTemplatePreview(tmpItem)">预览</el-button>
              <el-button type="text" class="button" @click="handleTemplateEdit(tmpItem)">编辑</el-button>
              <!--禁止删除TV看板的模板数据-->
              <el-button
                v-if="tvappTemplates().tv1 !== tmpItem.id && tvappTemplates().tv2 !== tmpItem.id && tvappTemplates().tv3 !== tmpItem.id"
                type="text"
                class="button"
                @click="handleTemplateDelete(tmpItem)">删除</el-button>
              <span v-if="tvappTemplates().tv1 === tmpItem.id" style="color: #E65D6E;margin-left:1rem;">TV1</span>
              <span v-if="tvappTemplates().tv2 === tmpItem.id" style="color: #E65D6E;margin-left:1rem;">TV2</span>
              <span v-if="tvappTemplates().tv3 === tmpItem.id" style="color: #E65D6E;margin-left:1rem;">TV3</span>
            </div>
          </div>
        </el-card>
      </ul>
      <p v-if="templates.loading" class="loader-text">加载中...</p>
      <p v-if="templatesNoMore" class="loader-text">没有更多了</p>
    </div>
  </div>
</template>

<script>

// queryKanbanTemplateDetail, saveKanbanTemplate, deleteKanbanTemplate
import { queryKanbanTemplateList, deleteKanbanTemplate } from '@/api/boardTemplate'
import { getFilterArray } from '@/utils/filterUtils'
import { openNewWindow, setStorage } from '@/utils'
import { tvappTemplates } from '@/global/tvapp-templates'

export default {
  name: 'BoardTemplate',
  data() {
    return {
      pageHeight: 0,
      listQuery: {
        templateName: ''
      },
      // 是否显示TV模板的卡片以及按钮
      showTvTemplate: false,
      templates: {
        fullLoading: false,
        dataArray: [], // 来自后台的模板列表数据
        count: 10,
        loading: false
      },
      templatesDataFilter: [] // 用于显示的模板数据（每次对源数据进行过滤处理后，再为此进行赋值，从而实现点击按钮后过滤，而不是输入时直接过滤）
    }
  },
  computed: {
    // 暂时进行一次性加载所有数据，所以这里暂时设置为0
    templatesNoMore() {
      return this.templates.count >= 0
    },
    templatesDisabled() {
      return this.templates.loading || this.templatesNoMore
    }
  },
  mounted() {
    this.pageHeight = (document.documentElement.clientHeight * 0.88)
    // 访问后台，获取模板列表数据
    this.callTemplates()
  },
  methods: {
    getFilterArray: getFilterArray,
    openNewWindow: openNewWindow,
    setStorage: setStorage,
    tvappTemplates: tvappTemplates,

    // 传递特定的TV1的模板数据，并打开模板预览页面
    openPreTemplateTv1() {
      this.openPreviewReportPage(true, '', 'tv1')
    },
    // 传递特定的TV2的模板数据，并打开模板预览页面
    openPreTemplateTv2() {
      this.openPreviewReportPage(true, '', 'tv2')
    },
    // 传递特定的TV3的模板数据，并打开模板预览页面
    openPreTemplateTv3() {
      this.openPreviewReportPage(true, '', 'tv3')
    },

    // tv看板按钮 点击事件
    handleTvTemplate(tvNo) {
      // 根据tv编号判定要打开模板页面要传输的参数
      switch (tvNo) {
        case 1:
          this.openPreTemplateTv1()
          break
        case 2:
          this.openPreTemplateTv2()
          break
        case 3:
          this.openPreTemplateTv3()
          break
      }
    },

    // 搜索按钮点击事件：过滤模板列表
    handleTemplateFilter() {
      // 加载过滤处理后的模板列表数据
      this.loadTemplatesDataFilter()
    },

    // 创建新模板 按钮点击事件
    handleCreateNewTemplate() {
      // 传递一个空的id过去，打开模板编辑页面即可
      this.openReportEditPage('')
    },

    // 卡片的删除按钮点击事件：删除指定模块
    handleTemplateDelete(template) {
      // 访问后台，删除模板数据
      this.callDeleteTemplate(template.id)
      // 刷新——访问后台，获取模板列表数据
      this.callTemplates()
    },

    // 打开模板预览页面
    openPreviewReportPage(isTvApp, reportUnionKey, tvAppNoCode) {
      const isFromEdit = false
      const { href } = this.$router.resolve({
        path: '/previewReport', // path: //"/preTvAppReportTV_1", //path: "/previewReport",
        query: { reportUnionKey, isFromEdit, isTvApp, tvAppNoCode }
      })
      openNewWindow(href)
    },

    // 模板卡片上的 <预览> 按钮点击事件
    handleTemplatePreview(template) {
      // 打开模板预览页面
      const isTvApp = false
      const reportUnionKey = template.id
      this.openPreviewReportPage(isTvApp, reportUnionKey)
    },

    // 模板卡片上的 <编辑> 按钮点击事件
    handleTemplateEdit(template) {
      const reportUnionKey = template.id
      // 打开模板编辑页面
      this.openReportEditPage(reportUnionKey)
    },

    // 打开模板编辑页面
    openReportEditPage(reportUnionKey) {
      const { href } = this.$router.resolve({
        path: '/editReport', // path: //"/preTvAppReportTV_1", //path: "/previewReport",
        query: { reportUnionKey }
      })
      openNewWindow(href)
    },

    // 加载过滤处理后的模板列表数据
    loadTemplatesDataFilter() {
      this.templatesDataFilter = this.getFilterArray(this.templates.dataArray, 'tmpName', this.listQuery.templateName)
    },

    // TODO: 加载模板列表(后期后台接口升级为分页加载后，再实现此功能，目前留空)
    templateLoader() {
      // this.templates.loading = true
      // setTimeout(() => {
      //   this.templates.count += 2
      //   this.templates.loading = false
      // }, 2000)
    },
    // 访问后台，获取模板列表数据
    callTemplates() {
      this.templates.fullLoading = true
      queryKanbanTemplateList().then(response => {
        response = response.data
        if (response.errno !== 0) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: '原因：' + response.errmsg
          })
        } else if (!response.hasOwnProperty('data') ||
          !response.data.hasOwnProperty('kbTemplateList') ||
          response.data.kbTemplateList === undefined ||
          response.data.kbTemplateList.length <= 0) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的数据量为0'
          })
        } else {
          // 反馈正常信息
          // 存储到当前变量
          this.templates.dataArray = response.data.kbTemplateList
          // 加载过滤处理后的模板列表数据
          this.loadTemplatesDataFilter()
        }
      }).catch(response => {
        const errorMsg = '异常信息：' + JSON.stringify(response)
        console.log(errorMsg)
        this.$notify.error({
          title: '失败',
          message: errorMsg
        })
      }).finally(() => {
        this.templates.fullLoading = false
      })
    },

    // 访问后台，删除模板数据
    callDeleteTemplate(tmpId) {
      this.templates.fullLoading = true
      deleteKanbanTemplate(tmpId).then(response => {
        response = response.data
        if (response.errno !== 0) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: '原因：' + response.errmsg
          })
        } else if (!response.hasOwnProperty('data')) {
          this.$notify.error({
            title: '失败',
            message: '原因：data属性不存在'
          })
        } else {
          // 反馈正常信息
          this.$notify.success({
            title: '成功',
            message: response.data.msg
          })
        }
      }).catch(response => {
        const errorMsg = '异常信息：' + JSON.stringify(response)
        console.log(errorMsg)
        this.$notify.error({
          title: '失败',
          message: errorMsg
        })
      }).finally(() => {
        this.templates.fullLoading = false
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../styles/mixin';

  $card-width:15rem;

  .m-container{
    display: flex;
    flex-direction: column;
    .m-cards{
      flex: 1;
      width: 100%;
      background: #f0f0f0;
      border-radius: 0.8rem;
      box-shadow: darkgrey 10px 10px 30px 5px ;//边框阴影
      overflow-y: auto;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      #m-list-scroller{
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 0.1rem;
        .m-card{
          width: $card-width;
          height: 19rem;
          margin-left: 1rem;
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
          .image-title{
            width: $card-width;
            height: auto;
          }
          .m-card-bottom{
            @include rounded(max-width, 100%);
            @include rounded(display, flex);
            @include rounded(flex-direction, column);
            /*display: flex;*/
            /*flex-direction: column;*/
            .m-card-text-title{
              @include rounded(flex, 1);
              @include rounded(font-size, 1rem);
              @include rounded(color, #E65D6E);
              /*flex: 1;*/
              /*font-size: 1rem;*/
              /*color: #E65D6E;*/
            }
            .m-card-text-sub{
              @include rounded(flex, 1);
              @include rounded(font-size, 0.8rem);
              @include rounded(color, #91bbe9);
              margin-top: 1.2rem\0;
              /*flex: 1;*/
              /*font-size: 0.8rem;*/
              /*color: #91bbe9;*/
            }
            .m-options{
              margin-top: 1rem\0;
            }
          }
        }
      }
      .loader-text{
        width: 100%;
        text-align: center;
        font-size: 0.8rem;
        color: #91bbe9;
      }
    }
  }

</style>

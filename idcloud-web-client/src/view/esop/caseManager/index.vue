<template>
  <div id="container">
    <el-dialog class="dia-case-doc-select" :visible.sync="docSelectShow" width="40%" :show-close="true"
               :before-close="cancelPDF">
      <div class="case-doc-search">
        <el-input
          style="width: 180px;"
          size="small"
          placeholder="请输入内容"
          v-model="docSearch">
          <i slot="prefix" class="el-input__icon el-icon-search" style="padding-bottom: 50px;"></i>
        </el-input>
        <el-select
          style="width: 100px;margin-left: 10px" disabled
          size="small" v-model="docType" placeholder="请选择">
          <el-option
            v-for="item in docTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="case-doc-list" style="margin-top: 10px;">
        <el-card
          v-for="(card, index) of docCards" :key="index"
          :class="{'card-normal':true,'card-selected':card.name === docCardSelected}"
          style="margin-bottom: 10px;">
          <!---->
          <div style="display: flex;flex-direction: row ;" @click="handleDocOnClick(card)" @dblclick="confirmPDF(card)">
            <div style="flex: 1; display: flex;flex-direction: row">
              <h3>文档名称：</h3>
              <span
                :class="{'card-normal-text':card.name !== docCardSelected,'card-selected-text':card.name === docCardSelected,}">{{card.name}}</span>
            </div>
            <div style="width: 150px;display: flex;flex-direction: row">
              <h3>文档类型：</h3>
              <span
                :class="{'card-normal-text':card.name !== docCardSelected,'card-selected-text':card.name === docCardSelected,}">{{card.fileType}}</span>
            </div>
          </div>
        </el-card>
        <!--<div style="display: flex;justify-content: flex-end;">-->
        <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button type="error" @click="cancelPDF">取消</el-button>-->
        <!--<el-button type="primary" @click="confirmPDF()" style="margin-left: 1rem">确认</el-button>-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div class="block" style="display: flex;flex-direction: row;justify-content: center">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="docPage.total"
          @current-change="selectPdf">
        </el-pagination>
      </div>
    </el-dialog>

    <el-dialog class="dia-case-client-select" :visible.sync="clientSelectShow" width="40%"
               :show-close="true"
               :before-close="cancelClient">
      <div class="case-client-select">
        <div class="case-client-search">
          <el-input
            style="width: 180px;"
            size="small"
            placeholder="请输入内容"
            v-model="clientSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <el-select
            style="width: 100px;margin-left: 10px"
            size="small" v-model="clientStatus" placeholder="请选择">
            <el-option
              disabled
              v-for="item in clientStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="case-client-list" style="margin-top: 10px;">
          <el-card
            v-for="(card, index) of clientCards" :key="index"
            :class="{'card-normal':true,'card-selected':card.name === clientCardSelected}"
            style="margin-bottom: 10px;">
            <div style="display: flex;flex-direction: row;" @click="handleClientOnClick(card)"
                 @dblclick="confirmClient(card)">
              <div style="flex: 1;display: flex;flex-direction: row">
                <h3>名称：</h3>
                <span
                  :class="{'card-normal-text':card.name !== clientCardSelected,'card-selected-text':card.name === clientCardSelected,}">{{card.name}}</span>
              </div>
              <div style="flex: 2;display: flex;flex-direction: row">
                <h3>IP：</h3>
                <span
                  :class="{'card-normal-text':card.name !== clientCardSelected,'card-selected-text':card.name === clientCardSelected,}">{{card.ip}}</span>
              </div>
              <div>
                <i
                  :class="{'el-icon-link':true,'case-client-offline':card.status === '0','case-client-online':card.status === '1',}"
                  style="font-size: 24px;"></i>
              </div>
            </div>
          </el-card>
        </div>
        <div class="block" style="display: flex;flex-direction: row;justify-content: center">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="clientPage.total"
            @current-change="selectClient">
          </el-pagination>
        </div>
      </div>
      <!--<div style="display: flex;justify-content: flex-end;">-->
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button type="error" @click="cancelClient">取消</el-button>-->
      <!--<el-button type="primary" @click="confirmClient()" style="margin-left: 1rem">确认</el-button>-->
      <!--</div>-->
      <!--</div>-->
    </el-dialog>

    <el-dialog :title="treeChildTitle" :visible="childCatalogVisible"
               class="dialogChildCatalog" :show-close="false">
      <el-form :model="form" :rules="rules" ref="childNameForm">
        <el-form-item prop="childCatalogName">
          <el-input v-model="form.childCatalogName" placeholder="分组名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearFormData">取 消</el-button>
        <el-button type="primary" @click="submitChildName">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      class="dia-preview"
      :title="previewTitle"
      :visible.sync="centerDialogVisible"
      :fullscreen="true"
      top="0"
      center>
      <el-carousel :height="clientHeight*0.8+'px'" indicator-position="outside">
        <el-carousel-item v-for="(item,id) in viewSolutionList" :key="id">
          <div style="display: flex;flex-direction:column;justify-content: center;align-items: center;color: white;">
            <h3>{{item.originalFileName}}【第{{item.pageNum+1}}页】</h3>
          </div>
          <el-image
            style="width: 100%; height: 100%;overflow: auto"
            :src="config.baseUrl.fdfsAddress + item.address"
            fit="scale-down"
          >
          </el-image>
          <el-image
            style="width: 15%; height: 15%;overflow: auto;display: block;position: absolute;right:11%;bottom:3%"
            :src="defaultSealImageUrl"
            fit="scale-down"
          ></el-image>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>

    <div class="container"
         style="display: flex;flex-direction: row;margin-left:-27px">
      <id-tree
        style="margin-top: -16px"
        class="main-tree"
        ref="idTree"
        v-loading="treeLoading"
        :treeData="treeData"
        :highlight-current="highlightCurrent"
        :idConfig="treeActionBar"
        @nodeClick="nodeSelectFunc"
        @treeAdd="addNodeFunc"
        @treeDelete="delNodeFunc"
        @treeEdit="editNodeFunc"
      ></id-tree>
      <div style="margin-left: 10px;flex-grow: 1;width: 0">
        <!--表格组件-->
        <table-el
          v-show="tableShow"
          ref="tableEl_caseManager"
          :table-height="tableHeight"
          table-tag="caseManager"
          :serverPage="tabs.caseManager.serverPage"
          :table-uni-key="tabs.caseManager.tableUniKey"
          :vuex-first-key="tabs.caseManager.vuexFirstKey"
          :vuex-second-key="tabs.caseManager.vuexSecondKey"
          :columns-std="tabs.caseManager.columnsStd"
          :table-config="tabs.caseManager.tableConfig"
          :hasUploadButton="false"
          :hasAddButton="hasAddButton"
          :showTableColumnsSetting="false"
          :hasDisableAccess="false"
          :hasAntiDisableAccess="false"
          :hasConfigTableHeadBtn="false"
          :hasShowAllBtn="false"
          :hasHeadEditAccess="true"
          :hasHeadDelAccess="true"
          :enableTableHeadDel="enableTableHead"
          :hasSelectColumn="true"
          :hasSearchTypeSelect="true"
          :hasSearchDateTimeRange="true"
          :hasAuditAccess="false"
          :hasAntiAuditAccess="false"
          :editText="editText"
          :searchDateTimeRangeConfig="searchDateTimeRangeConfig"
          :hasServerExcelImportButton="hasServerExcelImportButton"
          @requestTablePageData="handleRequestTablePageData"
          @submitToDeleteRow="handleSubmitToDeleteRow"
          @goAddForm="handleTableGoAddForm"
          @handleTableHeadEdit="handleTableHeadEdit"
          @handleTableHeadDel="handleTableHeadDel"
          @handleTableSelectRowChange="handleTableSelectRowChange">
          <template slot="extraButton" slot-scope="{ row }">
            <el-button style="margin-left:0.2rem;margin-bottom:0.1rem"
                       type="primary" size="mini" plain
                       @click="previewDoc(row)">
              预览
            </el-button>
          </template>
        </table-el>
        <div v-show="!tableShow" class="one-case">
          <div class="case-title">
            <!--<h2 @click="handleTableGoAddForm">返回</h2>-->
            <el-button type="primary" size="small" @click="handleTableGoAddForm">返回</el-button>
            <!--<div class="case-title-blank"></div>-->
            <!--<div class="case-title-button">-->
            <el-button type="primary" size="small" @click="commitOneClient">提交</el-button>
            <!--</div>-->
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="case-left">
                <div class="case-doc-select">
                  <div class="case-doc-select-left">
                    <h3>文档</h3>
                  </div>
                  <el-input
                    size="small"
                    placeholder="请选择PDF文件"
                    :readonly="true"
                    v-model="pdfSelectName">
                    <!--<el-button slot="append"  @click="selectPdf"-->
                    <!--size="small"></el-button>-->
                    <template slot="append">
                      <el-button size="small" class="el-icon-more" @click="selectPdf(0)"></el-button>
                    </template>
                  </el-input>
                </div>
              </div>
              <div class="case-doc-preview">
                <!--<h1 style="color: red;">PDF预览</h1>-->
                <pdf-preview class="pdfPreview" ref="pdfPreview" :url="pdfUrl" :style="{height:clientHeight-230+'px'}"/>
                <el-button circle size="large" type="success" icon="el-icon-check"
                           @click="handleOnClickDocToClientBind"></el-button>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="case-middle">
                <div class="case-middle-title">
                  <h3>已选文档内容</h3>
                </div>
                <div class="case-client-bind-list" :style="{height:clientHeight-230+'px'}">
                  <el-card
                    v-for="(card, index) of clientBindCards" :key="index" :class="{'card-normal':true}"
                    style="margin-bottom: 10px">
                    <div style="display: flex;flex-direction: row;align-items: center">
                      {{card.originalFileName}}(第{{card.pageNum}}页)
                      <i class="el-icon-circle-close"
                         style="font-size: 20px;cursor: pointer;"
                         @click="handleClientBindOnClick(card)"></i>
                    </div>
                  </el-card>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="case-right">
                <div class="case-client-bind">
                  <div class="case-client-bind-title">
                    <div class="case-right-title">
                      <h3>客户端</h3>
                    </div>
                    <el-input
                      size="small"
                      placeholder="请选择客户端"
                      :readonly="true">
                      <template slot="append">
                        <el-button size="small" class="el-icon-more" @click="selectClient(0)"></el-button>
                      </template>
                    </el-input>
                  </div>
                  <div class="case-client-bind-list" :style="{height:clientHeight-230+'px'}">
                    <el-card
                      v-for="(card, index) of clients" :key="index" :class="{'card-normal':true}"
                      style="margin-bottom: 10px;">
                      <div style="display: flex;flex-direction: row;align-items: center">
                        {{card.name}}({{card.ip}})
                        <i class="el-icon-circle-close"
                           style="font-size: 20px;cursor: pointer;"
                           @click="handleDelClientOnClick(card)"></i>
                      </div>
                    </el-card>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import TableEl from "@/components/table-el/index"
  import {RequestFilterMixins} from "@/mixins/RequestFilterMixins"
  import {
    getSolutions,
    addSolution,
    delSolution,
    renameSolution,
    getSolutionClients,
    fileList,
    clientList,
    editSolution,
    activeSolution,
    antiActiveSolution,
    batchDelSolutionClient,
    viewSolution
  } from "@/api/esop/esopCaseManger"
  import pdfPreview from "@/components/pdfPreview/index.vue"
  import {getDefaultSeal} from "@/api/esop/esopClientManagement";
  import config from '@/config'
  import IdTree from "@/components/id-tree/index";
  import {configAll} from "@/components/id-tree/idTreeConfig";
  // 目前遇到的技术性问题：
  // You may have an infinite update loop in a component render function

  export default {
    name: "case_manager",
    components: {TableEl, IdTree, pdfPreview},
    mixins: [RequestFilterMixins],
    data() {
      return {
        //预览相关----------------------------------------------------
        previewTitle: '方案-客户端',
        centerDialogVisible: false,
        viewSolutionList: [],
        defaultSealImageUrl: '',//预览印章地址
        //新增方案相关-------------------------------------------------
        clientBindCards: [],//选择的文档列表
        clients: [],//选择的客户端列表
        clientCardSelected: '',//选择得IP地址名字
        clientPage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
        },//客户端页数相关参数
        docPage: {
          total: 0,
          currentPage: 1,
          pageSize: 10,
        },//文档页数相关参数
        clientSelectID: '',//选择客户端ID
        clientSelectShow: false,//是否显示客户端选择
        pdfSelectID: '',//PDF选择ID
        pdfSelectName: '',//PDF选择name
        pdfSelectType: '',//PDF选择文件类型
        pdfSelectUid: '',//PDF选择uid
        docSelectShow: false,//是否显示文档选择
        pdfUrl: '',
        projectSearch: '',//方案查询参数
        caseData: [],//方案列表
        docCardSelected: '',//重复参数
        docSearch: '',
        docType: '0',
        docTypeOptions: [{
          value: '0',
          label: 'pdf'
        }],
        docCards: [],
        clientSearch: '',
        clientStatus: '0',
        clientStatusOptions: [{
          value: '0',
          label: '在线'
        }, {
          value: '1',
          label: '离线'
        }],
        clientCards: [],
        //----------------------------------------------------------------------------------
        //勾选项---------------------------------------------------
        selectRows: [],
        //文件夹列表弹窗---------------------------------------------
        rules: {
          childCatalogName: [
            {required: true, message: '文件夹名称不能为空！', trigger: 'blur'},
          ],
        },//文件夹校验
        childCatalogVisible: false,//目录是否显示参数
        treeChildTitle: '新增文件夹分组',//分组标题
        //新建分组参数
        form: {
          childCatalogName: '',
        },
        //树形列表相关-----------------------------------------------
        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configAll, //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据
        containerInfosData: {}, //树形目录当前选中数据
        //马昆仑表格参数-------------------------------------------------------------
        editText: '发布',
        buttonParentName: 'caseManager', // 所有按钮对应的菜单名称（后台数据库存放的数据决定的）
        accessButtons: this.$store.state.user.accessButton, //获取当前存储的当前登录用户的所有权限按钮，根据名称进行匹配
        timerComm: null,  // 公共定时器
        tableShowTimer: null,
        tableShow: true,
        tableHeight: '610',
        pageHeight: 0,
        activeTab: 'person',  // 当前激活的页签(对象的key值)
        showAddTab: false,  // 控制添加页签的显示和隐藏
        hackTimer: null,  // 用于强制重新渲染组件timer定时器
        hasAddButton: true,
        enableTableHead: false,//能否选中表头的编辑和删除 add cdh 20200519
        hasServerExcelImportButton: false,
        searchDateTimeRangeConfig: {
          inputType: 'datetime',
          hasStartDatetime: true,
          hasEndDatetime: true,
          startDateTime: '',
          endDateTime: '',
          width: '13.1rem',
          datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
          disabled: false,
          label: '时间范围',  // VueI18n 多语言库中的key值
          startPlaceholder: '请输入', // VueI18n 多语言库中的key值
          endPlaceholder: '请输入' // VueI18n 多语言库中的key值
        },
        tabs: {
          caseManager: {
            label: '方案管理',
            type: 'normal',
            show: true,
            tableUniKey: 'id', // 作为表格数据唯一识别的字段名（即 属性 key）
            vuexFirstKey: 'caseManager', // 表格组件获取 vuex 数据的 一级Key
            vuexSecondKey: 'caseManager', // 表格组件获取 vuex 数据的 二级Key
            serverPage: true, // 分页模式，true=后台分页，false=前台分页
            // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
            columnsStd: [],
            tableConfig: {
              loading: false,
              tableName: '方案管理',  // 表格名称，在导出成Excel时，会使用该名称作为文件名
              columns: [],
              pageData: [], // 根据当前页最大行数进行分页计算所得的 当前页显示数据
              filterData: [], // 根据当前搜索内容进行过滤的表格数据
              // 表格的原始数据
              data: [],
              curPage: 1,
              pageSize: 10, // 每页最多显示行数`
              pageSizeOpts: [5, 10, 20, 30, 50, 100],
              countTotal: 0,
              search: '', // 输入的搜索名称
              searchPlaceholder: '请输入', // 搜索输入栏的提示
              // 单选搜索下拉框的选项集合：
              // 1、如果设为空，则默认使用收集当前所有的列属性作为搜索下拉框的选项集合，即 支持对表格的所有列进行搜索
              // 2、如果设置列字段对象数组，则将根据此变量作为搜索下拉框的选项集合（前提是columns中存在的里属性对象，这里会对此变量进行匹配验证）
              selectSearchColumnSelections: [
                // {
                //   title: '客户端名称',
                //   key: 'clientName',
                //   // width: '200',
                //   type: 'text'
                // },
                // {
                //   title: '客户端ip',
                //   key: 'clientIp',
                //   // width: '200',
                //   type: 'text'
                // },
              ],
              // 单选下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
              selectSearchColumn: 'clientName',
              // 单选下拉框的未选择任何内容时的提示内容
              selectSearchColumnPlaceholder: '请选择',
              showTotal: true,  // 是否显示 总数
              showPageInput: true // 是否显示页码跳转输入框
            }
          },
        },
      }
    },
    created() {
    },
    mounted() {
      this.findGroupListFunc()
      // this.$nextTick(()=>{
      //   this.$refs.pdfPreview.renderPage()
      // })
    },
    beforeDestroy() {

    },
    computed: {},
    methods: {
      handleTableSelectRowChange(rows) {
        // console.log('选择行');
        // console.log(rows);
        this.enableTableHead = false;
        this.selectRows = rows;
        if (this.selectRows.length > 0)
          this.enableTableHead = true;
      },
      //----------------------------------------------------------------------
      //表头删除
      handleTableHeadDel() {
        // console.log(rows)
        // let params = []
        // rows.forEach(item => params.push({id: item.id}))
        let params = []
        this.selectRows.forEach(item => params.push(item.id))
        // console.log(params)
        batchDelSolutionClient(params).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data
          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '删除成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">已删除</span>
                      </div>`,
              type: 'success'
            })
            // this.$store.dispatch(`set_SelectedRows_${this.tabs.caseManager.vuexSecondKey}`, [])//清除勾选项
            this.selectRows = []
          } else {
            // 操作回调
            this.$notify({
              title: '删除失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">未删除</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
          // 根据表格的唯一标识进行识别，刷新相应页签下的表格
          this.refreshTabTable('caseManager', null)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.caseManager.tableConfig.loading = false
        })
      },
      //表头编辑
      handleTableHeadEdit() {
        if (!this.containerInfosData.id) {
          this.$notify({
            title: '警告',
            message: '请选择你要发布的方案！',
            type: 'warning'
          });
          return;
        }
        let request = null
        if (this.containerInfosData.isActive)
          request = [antiActiveSolution({id: this.containerInfosData.id, orgId: this.$store.state.user.userInfo.orgId})]
        else
          request = [activeSolution({id: this.containerInfosData.id, orgId: this.$store.state.user.userInfo.orgId})]

        Promise.all(request).then(response => {
          // console.log(JSON.stringify(response))
          response = response[0].data
          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: this.containerInfosData.isActive ? '取消发布成功' : '发布成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">操作成功</span>
                      </div>`,
              type: 'success'
            });
            // console.log(JSON.stringify(this.treeData))
            // console.log(this.containerInfosData.isActive)
            this.selectRows = [];
            if (this.containerInfosData.isActive) {
              this.containerInfosData.isActive = false;
              this.treeData[this.treeData.findIndex(item => item.id === this.containerInfosData.id)].isActive = false;
            } else {
              this.containerInfosData.isActive = true;
              this.treeData[this.treeData.findIndex(item => item.id === this.containerInfosData.id)].isActive = true;
            }
            // console.log(JSON.stringify(this.treeData))
            // console.log(this.containerInfosData.isActive)
          } else {
            // 操作回调
            this.$notify({
              title: this.containerInfosData.isActive ? '取消发布失败' : '发布失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">操作失败</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
          // 根据表格的唯一标识进行识别，刷新相应页签下的表格
          this.refreshTabTable('caseManager', null)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.caseManager.tableConfig.loading = false
        })
      },
      //文件夹分组弹窗相关-------------------------------------------------------
      //清除分组名称字段 隐藏弹窗
      clearFormData() {
        this.childCatalogVisible = false
        this.form.childCatalogName = ''
        this.$refs['childNameForm'].resetFields()
      },
      //提交新建分组
      submitChildName() {
        this.$refs['childNameForm'].validate((valid) => {
            if (valid) {
              // alert('submit!');
              if (this.treeChildTitle === '新建方案') {
                const params = {
                  name: this.form.childCatalogName,
                  pid: !this.containerInfosData.id ? 0 : this.containerInfosData.id,
                  orgId: this.$store.state.user.userInfo.orgId
                }
                // console.log(JSON.stringify(params))
                this.commitAddData(params)
                this.clearFormData();
              } else if (this.treeChildTitle === '修改方案名称') {
                const params = {
                  id: this.containerInfosData.id,
                  name: this.form.childCatalogName,
                  pid: this.containerInfosData.pid,
                  orgId: this.$store.state.user.userInfo.orgId
                }
                // console.log(JSON.stringify(params))
                this.renameTreeFolder(params)
                this.clearFormData()
              }
            } else {
              // console.log('error submit!!');
              return false;
            }
          }
        );
      },
      //提交数据
      commitAddData(params) {
        // this.loading = true
        addSolution(params).then(response => {
          // response = response.data
          // console.log(JSON.stringify(response))
          if (response.status === 200 && response.data.code === 200) {
            // 操作成功回调
            // this.$notify({
            //   title: '提交成功',
            //   dangerouslyUseHTMLString: true,
            //   message: `<div style="display: flex;flex-direction: column;justify-content: left;">
            //             <span v-if="formId" style="color:orange;">已添加</span>
            //           </div>`,
            //   type: 'success'
            // })
            this.findGroupListFunc()
          } else {
            // 操作成功回调
            this.$notify({
              title: '提交失败',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${response.data.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '提交失败',
            message: errorMsg
          })
        }).finally(() => {
          // this.loading = false
        })
      },
      //重命名文件夹
      renameTreeFolder(params) {
        renameSolution(params).then(response => {
          // console.log(JSON.stringify(response))
          if (response.status === 200 && response.data.code === 200) {
            // 操作成功回调
            // this.$notify({
            //   title: '提交成功',
            //   dangerouslyUseHTMLString: true,
            //   message: `<div style="display: flex;flex-direction: column;justify-content: left;">
            //             <span v-if="formId" style="color:orange;">已添加</span>
            //           </div>`,
            //   type: 'success'
            // })
            this.findGroupListFunc()
          } else {
            // 操作成功回调
            this.$notify({
              title: '提交失败',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${response.data.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '提交失败',
            message: errorMsg
          })
        }).finally(() => {
        })
      },
      //-------------------------------------------------------------------------
      /* 修改 节点 */
      editNodeFunc() {
        if (!this.containerInfosData.id) {
          this.$notify({
            title: '警告',
            message: '请选择你要编辑的方法名称！',
            type: 'warning'
          });
          return;
        }
        this.treeChildTitle = '修改方案名称';
        this.form.childCatalogName = this.containerInfosData.name;
        this.childCatalogVisible = true;
      },
      /* 添加 节点 */
      addNodeFunc() {
        if (this.containerInfosData.id >= 0) {
          this.$notify({
            title: '警告',
            message: '无法添加子方案！',
            type: 'warning'
          });
        } else {
          this.treeChildTitle = '新建方案';
          this.form.childCatalogName = '';
          this.childCatalogVisible = true;
        }
      },
      /* 删除 节点 */
      delNodeFunc() {
        if (this.containerInfosData.id === undefined) {
          return
        }
        this.$confirm('此操作将永久删除所选方案(只能删除【方案下无客户端】的分组), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delSolution({
            id: this.containerInfosData.id,
            orgId: this.$store.state.user.userInfo.orgId,
            name: this.containerInfosData.name
          }).then(res => {
            if (res.status === 200 && res.data.code === 200) {
              this.$Notice.success({
                title: '删除成功'
              })
              // this.containerInfosData = {}
              this.findGroupListFunc()
            } else {
              // 操作成功回调
              this.$notify({
                title: '操作失败',
                dangerouslyUseHTMLString: true,
                message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        await getSolutions({orgId: this.$store.state.user.userInfo.orgId}).then(res => {
          if (res.status === 200 && res.data.code === 200) {
            //生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true
            }
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, 'id')
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, 'pid')
            this.treeData = this.$utils.toTreeDataFunc(data)
            this.containerInfosData = {}
            this.$refs[`tableEl_caseManager`].drawTableData(this.tabs.caseManager.tableConfig.columns, [])
            this.selectRows = []

          } else {
            this.$notifyError("获取树形列表失败", res.data.msg);
          }
        }).finally(() => {
          if (this.treeData.length > 0) {
            this.$nextTick(() => {
              let isFirstSelect = false;
              if (this.containerInfosData.id !== undefined) {
                const nodeAll = document.querySelectorAll('.node-unselected');
                let that = this;
                [].forEach.call(nodeAll, function (div) {
                  if (div.firstElementChild.title === that.containerInfosData.name) {
                    div.click();
                    isFirstSelect = true;
                  }
                });
              }
              if (!isFirstSelect) {
                if (document.querySelector('.el-tree-node__content') !== null)
                  document.querySelector('.el-tree-node__content').click();
              }
            })
          }
        })
      },
      //点击目录节点事件
      nodeSelectFunc(data, node, vcom) {
        // 再次点击相同 node 取消选中
        if (this.treeSelectData === data) {
          this.highlightCurrent = false;
          this.treeSelectData = {};
          this.containerInfosData = {};
          this.$refs[`tableEl_caseManager`].drawTableData(this.tabs.caseManager.tableConfig.columns, [])
          this.selectRows = []
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          this.tabs.caseManager.tableConfig.curPage = 1;
          this.tabs.caseManager.tableConfig.pageSize = 10;
          this.requestCaseManagerTableData(this.tabs.caseManager.tableConfig.curPage,
            this.tabs.caseManager.tableConfig.pageSize)
        }
      },
      // 页签初始化操作
      initTabOption() {
        this.activeTab = 'caseManager'
      },
      // 请求<方案管理>页签下的表格数据
      async requestCaseManagerTableData(curPage, curPageSize, callback) {
        // 请求参数
        let param = {
          current_page: curPage,
          page_size: curPageSize,
          orgId: this.$store.state.user.userInfo.orgId
          // // 对于搜索，目前后台接口仅支持名称搜索
          // search_name: this.tabs.caseManager.tableConfig.selectSearchColumn === 'caseManager_name' ? this.tabs.caseManager.tableConfig.search : ''
        }

        // if (this.tabs.caseManager.tableConfig.search !== "")
        //   param[this.tabs.caseManager.tableConfig.selectSearchColumn] = this.tabs.caseManager.tableConfig.search;


        if (this.containerInfosData.id !== undefined) {
          param.id = this.containerInfosData.id;
        }
        // 请求参数中追加过滤参数
        // this.appendRequestFilterParams('caseManager', 'caseManager', param)

        let promiseArray = [
          //列表请求
          getSolutionClients(param)
        ]

        this.tabs.caseManager.tableConfig.loading = true
        await Promise.all(promiseArray).then(response => {
          // console.log(JSON.stringify(response))
          let [caseManagerResponse] = response

          // 接收页签的表格数据（后台数据）
          this.receiveCaseManagerTableData(caseManagerResponse, callback)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.caseManager.tableConfig.loading = false
        })
      },
      // 接收<方案管理>页签的表格数据（后台数据）
      receiveCaseManagerTableData(response, callback) {
        // console.log(JSON.stringify(response))
        response = response.data

        if (response.code !== 200) {
          // 反馈错误信息
          this.$notify.error({
            title: '失败',
            message: `原因：${response.msg}`
          })
        } else if (!response.hasOwnProperty('data') ||
          !response.data.hasOwnProperty('records') ||
          !response.data.records) {
          this.$notify.error({
            title: '失败',
            message: '原因：请求到的反馈数据为NULL'
          })
        } else {
          let tableData = response.data.records;
          tableData.map(item => {
            item['showRowEdit'] = false
            // item['disabledRowDelete'] = this.accessButtons.findIndex(btnName => btnName === `${this.buttonParentName}_delete`) >= 0
          })
          this.tabs.caseManager.tableConfig.columnsStd = [];
          this.tabs.caseManager.tableConfig.columns = [
            {
              title: '客户端名称',
              key: 'clientName',
              width: '200',
              // type: 'text'
            },
            {
              title: '客户端ip',
              key: 'clientIp',
              width: '200',
              // type: 'text'
            },
            {
              title: '发布状态',
              key: 'isActive',
              width: '120',
              render: (h, params) => {
                return h('span', {
                  style: {
                    color: String(params.row['isActive']) === 'false' ? '#F67049' : '#45C376'
                  }
                }, String(params.row['isActive']) === 'true' ? '已发布' : '未发布')
              }
            },
            {
              title: '发布时间',
              key: 'activeTime',
              width: '220',
            },
            // {
            //   title: '创建时间',
            //   key: 'createTime',
            //   width: '220',
            //   type: 'text',
            // },
            {
              title: '更新时间',
              key: 'updateTime',
              width: '220',
            },
          ];
          this.tabs.caseManager.tableConfig.countTotal = response.data.total;
          this.selectRows = [];
          if (this.$refs[`tableEl_caseManager`]) {
            this.$refs[`tableEl_caseManager`].drawTableData(this.tabs.caseManager.tableConfig.columns, tableData);
          }
        }
      },
      // TODO:直接删除行事件
      handleSubmitToDeleteRow(tableTag, row, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'caseManager':  // 方案管理
            // 请求<方案管理>删除一行数据
            this.requestDeleteCaseManagerRow(row, callback)
        }
      },
      // 请求<方案管理>删除一行数据
      async requestDeleteCaseManagerRow(row, callback) {
        this.tabs.caseManager.tableConfig.loading = true
        await batchDelSolutionClient([row.id]).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data

          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '删除成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <strong>地址：${row.clientIp}</strong>
                        <strong>名称：${row.clientName}</strong>
                        <span style="color:orange;">已删除</span>
                      </div>`,
              type: 'success'
            })
            this.selectRows = []
          } else {
            // 操作回调
            this.$notify({
              title: '删除失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <strong>地址：${row.clientIp}</strong>
                        <strong>名称：${row.clientName}</strong>
                        <span style="color:orange;">未删除</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }

          // 根据表格的唯一标识进行识别，刷新相应页签下的表格
          this.refreshTabTable('caseManager', callback)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.caseManager.tableConfig.loading = false
        })
      },
      //新增界面操作相关——————————————————————————————————————————————————————
      // 跳转到表单页面
      handleTableGoAddForm(tableTag) {
        this.clients = [];
        this.clientBindCards = [];
        this.cancelClient();
        this.cancelPDF();
        this.$nextTick(() => {
          this.$refs.pdfPreview.renderPage();
          this.tableShow = !this.tableShow;
        });
      },
      //表单新增
      commitOneClient() {
        if (!this.containerInfosData.id) {
          this.$notify.error({
            title: '错误',
            message: '请选择你需要配置的方案！'
          });
          return
        }
        if (this.clients.length === 0) {
          this.$notify.error({
            title: '错误',
            message: '请选择你要配置的客户端！'
          });
          return
        }
        if (this.clientBindCards.count === 0) {
          this.$notify.error({
            title: '错误',
            message: '请配置好你客户端下的文档列表！'
          });
          return
        }
        let pageNums1 = [];
        this.clientBindCards.forEach(item => pageNums1.push(item.pageNum - 1));
        this.clients.forEach(item => {
          item.clientId = item.id;
          item.orgId = this.$store.state.user.userInfo.orgId
        });
        const params = {
          id: this.containerInfosData.id,
          name: this.containerInfosData.name,
          fileId: this.pdfSelectUid,
          pageNums: pageNums1,
          clientList: this.clients,
          orgId: this.$store.state.user.userInfo.orgId
        }
        Promise.all([editSolution(params)]).then(response => {
          // response = response.data
          // console.log(JSON.stringify(response))
          if (response[0].status === 200 && response[0].data.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '提交成功',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                          <span v-if="formId" style="color:orange;">操作成功</span>
                        </div>`,
              type: 'success'
            })
            this.tableShow = !this.tableShow;
            this.selectRows = []
            this.requestCaseManagerTableData(this.tabs.caseManager.tableConfig.curPage,
              this.tabs.caseManager.tableConfig.pageSize);
          } else {
            // 操作成功回调
            this.$notify({
              title: '提交失败',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${response[0].data.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        })
      },
      //选择PDF 20191216 add by cdh
      selectPdf(pageChange) {
        if (!this.containerInfosData.id) {
          this.$notify.error({
            title: '错误',
            message: '请选择你要配置的方案！'
          });
          return
        }
        // console.log(pageChange)
        if (pageChange === 0)
          this.cancelPDF()
        const causeParam = {
          current_page: pageChange === 0 ? parseInt(this.docPage.currentPage) : parseInt(pageChange),
          page_size: this.docPage.pageSize,
          orgId: this.$store.state.user.userInfo.orgId,
          showAll: true,
          auditStatus: 1
        }
        let promiseArray = [
          //列表请求
          fileList(causeParam)
        ]
        Promise.all(promiseArray).then(response => {
          // console.log(JSON.stringify(response))
          let [Response] = response
          // console.log(JSON.stringify(Response.data))
          this.docCards = Response.data.data.records
          this.docPage.total = Response.data.data.total
          this.docSelectShow = true
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          // console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        })
      },
      //选择客户端
      selectClient(pageChange) {
        if (!this.containerInfosData.id) {
          this.$notify.error({
            title: '错误',
            message: '请选择你要配置的方案！'
          });
          return
        }
        if (pageChange === 0)
          this.cancelClient()
        const causeParam = {
          current_page: pageChange === 0 ? parseInt(this.clientPage.currentPage) : parseInt(pageChange),
          page_size: this.clientPage.pageSize,
          id: this.containerInfosData.id,
          orgId: this.$store.state.user.userInfo.orgId,
        }
        let promiseArray = [
          //列表请求
          clientList(causeParam)
        ]
        Promise.all(promiseArray).then(response => {
          // console.log(JSON.stringify(response))
          let [Response] = response
          // console.log(JSON.stringify(Response.data))
          // const clientList = this.selectNode.data.isSolution ? this.selectNode.data.children : this.selectNode.parent.data.children
          // for (let v of clientList) {
          //   Response.data.data.records.splice(Response.data.data.records.findIndex(item => item.ip === v.clientIp), 1)
          // }
          this.clientCards = Response.data.data.records
          this.clientPage.total = Response.data.data.total
          this.clientSelectShow = true
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          // console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        })
      },
      //初始化pdf
      cancelPDF() {
        this.docPage.total = 0
        this.docPage.currentPage = 1
        this.docPage.pageSize = 10
        this.docSelectShow = false
        this.docCardSelected = ''
        this.pdfSelectName = ''
        this.pdfSelectID = ''
        this.pdfSelectType = ''
        this.pdfSelectUid = ''
        this.docCards = []
      },
      //初始化客户端
      cancelClient() {
        this.clientSelectShow = false
        this.clientCardSelected = ''
        this.clientSelectID = ''
      },
      //确认选择PDF
      confirmPDF(card) {
        // console.log(card)
        if (card) {
          this.docCardSelected = card.name
          this.pdfSelectName = card.name
          this.pdfSelectID = card.id
          this.pdfSelectType = card.fileType
          this.pdfSelectUid = card.fileId
          this.pdfUrl = config.baseUrl.fdfsAddress + card.fileUri
          this.$nextTick(() => {
            this.$refs.pdfPreview.renderPage()
            this.docSelectShow = false
          })
        }
      },
      //确认选择客户端
      confirmClient(card) {
        this.clientSelectShow = false
        if (card) {
          this.clientCardSelected = card.ip
          this.clientSelectID = card.id
          if (this.clients.findIndex(item => item.ip === card.ip && item.name === card.name) < 0)
            this.clients.push(card)
        }
      },
      //绑定客户端
      handleOnClickDocToClientBind() {
        if (!this.containerInfosData.id) {
          this.$notify.error({
            title: '错误',
            message: '请选择你要配置的方案！'
          });
          return
        }
        if (this.pdfSelectName === '') {
          this.$notify.error({
            title: '错误',
            message: '请选择你的PDF文件！'
          });
          return
        }
        if (this.clients <= 0) {
          this.$notify.error({
            title: '错误',
            message: '请选择你要配置的客户端！'
          });
          return
        }
        if (this.clientBindCards.findIndex(item => item.originalFileName === this.pdfSelectName && item.pageNum === this.$refs.pdfPreview.pageNum)) {
          const newPdfPage = {
            id: this.pdfSelectID,
            uid: this.pdfSelectUid,
            type: this.pdfSelectType,
            originalFileName: this.pdfSelectName,
            pageNum: this.$refs.pdfPreview.pageNum,
            fileName: this.pdfSelectUid + '.' + this.pdfSelectType
          }
          this.clientBindCards.push(newPdfPage)
        }
        // console.log(JSON.stringify(this.clientBindCards))
      },
      //删除文档页数
      handleClientBindOnClick(card) {
        // console.log(card)
        this.$confirm(`确定要删除${card.originalFileName}第（${card.pageNum}）页`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clientBindCards.splice(this.clientBindCards.findIndex(item => item.originalFileName === card.originalFileName && item.pageNum === card.pageNum), 1)
        })
      },
      //删除客户端
      handleDelClientOnClick(card) {
        // console.log(card)
        this.$confirm(`确定要删除${card.name}(${card.ip})`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.clients.splice(this.clients.findIndex(item => item.ip === card.ip && item.name === card.name), 1)
        })
      },
      //选择文档
      handleDocOnClick(card) {
        if (card) {
          this.docCardSelected = card.name
          this.pdfSelectName = card.name
          this.pdfSelectID = card.id
        }
      },
      //选择客户端
      handleClientOnClick(card) {
        if (card) {
          this.clientCardSelected = card.name
          this.clientSelectID = card.id
        }
      },
      // 刷新某页签下的表格数据（重新请求）————————————————————————————————————————————————
      refreshTabTable(tableTag, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'caseManager':  // 方案管理
            // 请求<方案管理>页签下的表格数据
            this.requestCaseManagerTableData(this.tabs.caseManager.tableConfig.curPage, this.tabs.caseManager.tableConfig.pageSize, callback)
            break
        }
      },
      /**
       * 表格组件请求后台数据绑定事件，该事件会在以下情况下被激活
       * 1、点击搜索按钮时
       * 2、切换页码时
       * 3、切换当前页最大行数时
       * 请求表格后台数据函数
       * */
      handleRequestTablePageData(tableTag, curPage, curPageSize, callback, refreshAll) {
        if (refreshAll)
          this.findGroupListFunc();
        else
        // 根据表格的唯一标识进行识别，执行相应的请求
          this.refreshTabTable(tableTag, callback);
      },
      // 搜索输入框回车事件
      handleSearchEnter(tab) {
      },
      // 搜索输入框清空事件
      handleSearchClear(tab) {
      },
      //预览事件
      previewDoc(row) {
        // console.log(JSON.stringify(row));
        this.previewTitle = '【' + this.containerInfosData.name + '】' + row.clientName + '(' + row.clientIp + ')';
        // 请求参数
        let param = {
          orgId: this.$store.state.user.userInfo.orgId,
          solutionId: this.containerInfosData.id
        };
        let promiseArray = [
          //列表请求
          viewSolution(param),
          getDefaultSeal({orgId: this.$store.state.user.userInfo.orgId})
        ];
        Promise.all(promiseArray).then(response => {
          console.log(JSON.stringify(response))
          let [caseManagerResponse, defaultSealImageResponse] = response;
          this.viewSolutionList = caseManagerResponse.data.data
          this.defaultSealImageUrl = config.baseUrl.fdfsAddress + defaultSealImageResponse.data.data
          // console.log(this.defaultSealImageUrl)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.centerDialogVisible = true;
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  #container {
    margin-top: 20px;

    .dia-preview {
      /deep/ .el-dialog__headerbtn {
        top: 0;
        right: 1%;
        position: absolute;
        font-size: 60px;
        z-index: 1000;

        .el-dialog__close {
          color: white;
        }

        .el-dialog__close:hover {
          color: yellow;
        }
      }

      /deep/ .el-dialog__headerbtn:hover {
        color: yellow;
      }

      /deep/ .el-dialog__title {
        color: white;
        font-size: 24px;
      }

      /deep/ .el-dialog {
        width: 100%;
        height: 100%;
        background-image: url("../../../assets/images/ESOP/caseManager/casePreviewBackgroud.png");
        background-size: cover;
      }
    }
  }

  .one-case {
    width: 100%;
    height: 100%;

    .case-title {
      .el-button {
        margin: 0 10px 5px 0;
      }
    }

    .case-left {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 100%;

      .case-doc-select {
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-grow: 1;

        .case-doc-select-left {
          flex-grow: 1;
        }

        .el-input {
          margin-left: 20px;
          height: 30px;
          width: 180px;

          .el-button {
            background-color: #f1c40f36;
          }
        }

      }
    }

    .case-doc-preview {
      width: 100%;
      display: flex;
      flex-direction: row;
      border: 1px dashed #c4c4c4;
      position: relative;

      .pdfPreview {
        width: 100%;
        overflow: auto;
      }

      .el-button {
        z-index: 1000;
        position: absolute;
        right: 0;
      }
    }

    .case-middle {
      //background: yellow;
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;

      .case-middle-title {
        height: 40px;
        align-items: center;

        h3 {
          display: inline-block;
          line-height: 40px;
        }
      }
    }

    .case-right {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;

      .case-client-bind {
        display: flex;
        flex-direction: column;

        .case-client-bind-title {
          height: 40px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .case-right-title {
            flex-grow: 1;
          }

          .el-input {
            height: 30px;
            width: 180px;

            .el-button {
              background-color: #f1c40f36;
            }
          }
        }


      }

    }

    .case-client-bind-list {
      border: 1px dashed #c4c4c4;
      padding: 10px;
      overflow: auto;
    }

  }

  .card-normal-text {
    color: orange;
  }

  .card-selected-text {
    color: white;
  }

  .card-normal:hover {
    box-shadow: 5px 5px 2px #888888;
    transform: scaleX(1.02)
  }

  .card-selected {
    background: orange;
    box-shadow: 5px 5px 2px #888888;
    transform: scaleX(1.02);
  }
</style>

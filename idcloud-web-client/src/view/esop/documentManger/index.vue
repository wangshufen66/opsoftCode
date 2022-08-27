<template>
  <div id="container">
    <el-dialog :title="treeChildTitle" :visible="childCatalogVisible" class="dialogChildCatalog" :show-close="false">
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
      title="预览"
      :visible.sync="centerDialogVisible"
      width="75%"
      center
      @close="pdfUrl=''">
      <pdf-preview ref="pdfPreview" :url="pdfUrl"/>
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
          v-if="tableShow"
          ref="tableEl_documentManger"
          :table-height="tableHeight"
          table-tag="documentManger"
          :serverPage="tabs.documentManger.serverPage"
          :table-uni-key="tabs.documentManger.tableUniKey"
          :vuex-first-key="tabs.documentManger.vuexFirstKey"
          :vuex-second-key="tabs.documentManger.vuexSecondKey"
          :columns-std="tabs.documentManger.columnsStd"
          :table-config="tabs.documentManger.tableConfig"
          :hasUploadButton="true"
          :hasAddButton="hasAddButton"
          :showTableColumnsSetting="false"
          :hasDisableAccess="false"
          :hasAntiDisableAccess="false"
          :hasConfigTableHeadBtn="false"
          :hasShowAllBtn="false"
          :hasHeadEditAccess="true"
          :enableTableHeadEdit="enableTableHead"
          :editText="editText"
          :hasHeadDelAccess="true"
          :enableTableHeadDel="enableTableHead"
          :hasSelectColumn="true"
          :hasSearchTypeSelect="true"
          :hasSearchDateTimeRange="true"
          :searchDateTimeRangeConfig="searchDateTimeRangeConfig"
          :hasServerExcelImportButton="hasServerExcelImportButton"
          @requestTablePageData="handleRequestTablePageData"
          @submitToDeleteRow="handleSubmitToDeleteRow"
          @editRow="handleEditRow"
          @handleTableHeadEdit="handleTableHeadEdit"
          @handleTableHeadDel="handleTableHeadDel"
          @handleTableHeadAudit="handleTableHeadAudit"
          @handleTableHeadAntiAudit="handleTableHeadAntiAudit"
          @uploadSectionFile="uploadSectionFile"
          @handleDefaultBackgroundAvatarSuccess="handleDefaultBackgroundAvatarSuccess"
          @beforeDefaultBackgroundAvatarUpload="beforeDefaultBackgroundAvatarUpload"
          @handleTableSelectRowChange="handleTableSelectRowChange"/>
      </div>
    </div>
  </div>
</template>

<script>

  import TableEl from "@/components/table-el/index"
  import {RequestFilterMixins} from "@/mixins/RequestFilterMixins"
  import {
    getFolderTree,
    getFiles,
    createFolder,
    deleteFolder,
    renameFolder,
    modifyFolder,
    uploadFile,
    auditFile,
    antiAudiFile,
    deleteFile,
    viewFile,
    test
  } from "@/api/esop/esopDocumentManger"
  import pdfPreview from "@/components/pdfPreview/index.vue"
  import config from '@/config'
  import IdTree from "@/components/id-tree/index";
  import {configAll} from "@/components/id-tree/idTreeConfig";
  // 目前遇到的技术性问题：
  // You may have an infinite update loop in a component render function

  export default {
    name: "document_manager",
    components: {TableEl, IdTree, pdfPreview},
    mixins: [RequestFilterMixins],
    data() {
      return {
        //勾选项---------------------------------------------------
        selectRows: [],
        //预览弹窗-------------------------------------------------
        centerDialogVisible: false,//预览弹窗是否显示
        pdfUrl: '',//预览的PDF的地址
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
        editText: '预览',
        buttonParentName: 'documentManger', // 所有按钮对应的菜单名称（后台数据库存放的数据决定的）
        accessButtons: this.$store.state.user.accessButton, //获取当前存储的当前登录用户的所有权限按钮，根据名称进行匹配
        timerComm: null,  // 公共定时器
        tableShowTimer: null,
        tableShow: true,
        tableHeight: '610',
        pageHeight: 0,
        activeTab: 'person',  // 当前激活的页签(对象的key值)
        showAddTab: false,  // 控制添加页签的显示和隐藏
        hackTimer: null,  // 用于强制重新渲染组件timer定时器
        hasAddButton: false,
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
          documentManger: {
            label: '文档管理',
            type: 'normal',
            show: true,
            tableUniKey: 'id', // 作为表格数据唯一识别的字段名（即 属性 key）
            vuexFirstKey: 'documentManger', // 表格组件获取 vuex 数据的 一级Key
            vuexSecondKey: 'documentManger', // 表格组件获取 vuex 数据的 二级Key
            serverPage: true, // 分页模式，true=后台分页，false=前台分页
            // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
            columnsStd: [],
            tableConfig: {
              loading: false,
              tableName: '文档管理',  // 表格名称，在导出成Excel时，会使用该名称作为文件名
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
              selectSearchColumnSelections: [],
              // 单选下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
              selectSearchColumn: 'name',
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
        if (this.selectRows.length === 1)
          this.enableTableHead = true;

      },
      //上传文件相关代码-------------------------------------------------------
      //上传PDF文件
      uploadSectionFile(data) {
        // console.log(data.file)
        this.$message({
          message: '正在请求上传，请稍等...',
          type: 'success'
        });
        uploadFile(data.file,
          !this.containerInfosData.level ? 1 : this.containerInfosData.level + 1,
          !this.containerInfosData.id ? 0 : this.containerInfosData.id,
          data.file.name,
          this.$store.state.user.userInfo.orgId).then(response => {
          // console.log(JSON.stringify(response))
          if (response.status === 200 && response.data.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '提交成功',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span v-if="formId" style="color:orange;">已添加</span>
                      </div>`,
              type: 'success'
            })
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
          this.$refs.uploadList.clearFiles()
        })

        // uploadFile((res)=>{
        //   console.log(res)
        //   if (res.data) {
        //     uploadFile(data.file,!this.selectLevel ? 1 : this.selectLevel + 1, !this.selectTreeID ? 0 : this.selectTreeID)
        //   } else {
        //     this.$notify.error({
        //       title: '文件错误',
        //       message: '处理下载文件时发生未知错误'
        //     });
        //   }
        // },(err)=>{
        //   console.log(err)
        //   this.$notify.error({
        //     title: '下载失败',
        //     message: err
        //   });
        // })
      },
      //成功后刷新
      handleDefaultBackgroundAvatarSuccess(res, file) {
        // this.defaultBackgroundImageUrl = URL.createObjectURL(file.raw);
        this.findGroupListFunc()
      },
      //文件校验
      beforeDefaultBackgroundAvatarUpload(file) {
        // console.log(file)
        const isJPG = file.type === 'application/pdf';
        // const isLt2M = file.size / 1024 / 1024 < 2;
        const isLt2M = true
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 PDF 格式!');
        }
        // if (!isLt2M) {
        //   this.$message.error('上传头像图片大小不能超过 2MB!');
        // }
        // this.actionParams = {
        //   level: !this.selectLevel ? 1 : this.selectLevel + 1,
        //   pid: !this.selectTreeID ? 0 : this.selectTreeID,
        // }
        // console.log(this.actionParams)
        return isJPG && isLt2M;
      },
      //----------------------------------------------------------------------
      // 表头审核
      handleTableHeadAudit() {
        if (this.selectRows.length <= 0)
          return
        let params = []
        this.selectRows.forEach(item => params.push({id: item.id, orgId: this.$store.state.user.userInfo.orgId}))
        auditFile(params).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data
          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '审核成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">已审核</span>
                      </div>`,
              type: 'success'
            })
          } else {
            // 操作回调
            this.$notify({
              title: '审核失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">未审核</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
          // 根据表格的唯一标识进行识别，刷新相应页签下的表格
          this.refreshTabTable('documentManger', null)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '审核失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.documentManger.tableConfig.loading = false
        })
      },
      // 表头反审核
      handleTableHeadAntiAudit() {
        if (this.selectRows.length <= 0)
          return
        let params = []
        this.selectRows.forEach(item => params.push({id: item.id, orgId: this.$store.state.user.userInfo.orgId}))
        antiAudiFile(params).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data
          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '反审核成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">已反审核</span>
                      </div>`,
              type: 'success'
            })
          } else {
            // 操作回调
            this.$notify({
              title: '反审核失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">未反审核</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
          // 根据表格的唯一标识进行识别，刷新相应页签下的表格
          this.refreshTabTable('documentManger', null)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '反审核失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.documentManger.tableConfig.loading = false
        })
      },
      //表头删除
      handleTableHeadDel() {
        // console.log(rows)
        // let params = []
        // rows.forEach(item => params.push({id: item.id}))
        deleteFile({id: this.selectRows[0].id}).then(response => {
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
            // this.$store.dispatch(`set_SelectedRows_${this.tabs.documentManger.vuexSecondKey}`, [])//清除勾选项
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
          this.refreshTabTable('documentManger', null)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.documentManger.tableConfig.loading = false
        })
      },
      //表头编辑
      handleTableHeadEdit() {
        this.handleEditRow('documentManger', this.selectRows[0])
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
              if (this.treeChildTitle === '新建子文件夹分组') {
                const params = {
                  folderName: this.form.childCatalogName,
                  content: null,
                  level: !this.containerInfosData.level ? 1 : this.containerInfosData.level + 1,
                  pid: !this.containerInfosData.id ? 0 : this.containerInfosData.id,
                  orgId: this.$store.state.user.userInfo.orgId
                }
                // console.log(JSON.stringify(params))
                this.commitAddData(params)
                this.clearFormData();
              } else if (this.treeChildTitle === '修改文件夹分组') {
                const params = {
                  id: this.containerInfosData.id,
                  name: this.form.childCatalogName,
                  level: this.containerInfosData.level,
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
        createFolder(params).then(response => {
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
        renameFolder(params).then(response => {
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
            message: '请选择你要编辑的节点！',
            type: 'warning'
          });
          return;
        }
        this.treeChildTitle = '修改文件夹分组';
        this.form.childCatalogName = this.containerInfosData.name;
        this.childCatalogVisible = true;
      },
      /* 添加 节点 */
      addNodeFunc() {
        if (this.containerInfosData.id >= 0) {
          this.treeChildTitle = '新建子文件夹分组';
          this.form.childCatalogName = '';
          this.childCatalogVisible = true;
        } else {
          this.$notify({
            title: '警告',
            message: '无法添加根分组！',
            type: 'warning'
          });
        }
      },
      /* 删除 节点 */
      delNodeFunc() {
        if (this.containerInfosData.id === undefined) {
          return
        }
        if (this.containerInfosData.id === -1) {
          this.$notify({
            title: '警告',
            message: '无法删除根分组！',
            type: 'warning'
          });
          return
        }
        this.$confirm('此操作将永久删除所选分组(只能删除【最底层分组】并且【节点下无数据】的分组), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteFolder({
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
      //修改 节点 位置
      nodeDropFunc(draggingNode, dropNode, dropType, ev) {
        // console.log(draggingNode)
        // console.log(dropNode)
        // console.log(dropType)
        // console.log(ev)
        let param = {}
        if (dropType === 'inner')
          param = {source: draggingNode.data.id, target: dropNode.data.id}
        else
          param = {source: draggingNode.data.id, target: dropNode.parent.data.length > 1 ? -1 : dropNode.parent.data.id}
        this.treeload = true
        // console.log(param)
        modifyFolder(param).then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.$Notice.success({
              title: '移动文件节点成功！'
            })
            //初始化
            this.treeParams.nodeId = -1
            this.containerInfosData = {}
            this.$refs[`tableEl_documentManger`].drawTableData(this.tabs.documentManger.tableConfig.columns, [])
            this.selectRows = []
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
            this.findGroupListFunc()
          }
        }).finally(() => {
          this.treeload = false;
        })
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        await getFolderTree({orgId: this.$store.state.user.userInfo.orgId}).then(res => {
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
            // 清空 容器信息
            this.containerInfosData = {}
            this.$refs[`tableEl_documentManger`].drawTableData(this.tabs.documentManger.tableConfig.columns, [])
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
          this.$refs[`tableEl_documentManger`].drawTableData(this.tabs.documentManger.tableConfig.columns, [])
          this.selectRows = []
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          this.tabs.documentManger.tableConfig.curPage = 1;
          this.tabs.documentManger.tableConfig.pageSize = 10;
          this.requestDocumentMangerTableData(this.tabs.documentManger.tableConfig.curPage,
            this.tabs.documentManger.tableConfig.pageSize)
        }
      },

      // 页签初始化操作
      initTabOption() {
        this.activeTab = 'documentManger'
      },

      // 请求<文档管理>页签下的表格数据
      async requestDocumentMangerTableData(curPage, curPageSize, callback) {
        // 请求参数
        let param = {
          current_page: curPage,
          page_size: curPageSize,
          orgId: this.$store.state.user.userInfo.orgId,
          // // 对于搜索，目前后台接口仅支持名称搜索
          // search_name: this.tabs.documentManger.tableConfig.selectSearchColumn === 'documentManger_name' ? this.tabs.documentManger.tableConfig.search : ''
        }
        if (this.containerInfosData.id !== undefined) {
          param.id = this.containerInfosData.id;
          if (this.containerInfosData.id === 0)
            param.showAll = true;
        }
        // 请求参数中追加过滤参数
        // this.appendRequestFilterParams('documentManger', 'documentManger', param)

        let promiseArray = [
          //列表请求
          getFiles(param)
        ]

        this.tabs.documentManger.tableConfig.loading = true
        await Promise.all(promiseArray).then(response => {
          // console.log(JSON.stringify(response))
          let [documentMangerResponse] = response

          // 接收页签的表格数据（后台数据）
          this.receiveDocumentMangerTableData(documentMangerResponse, callback)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.documentManger.tableConfig.loading = false
        })
      },
      //  请求参数中追加过滤条件
      // appendRequestFilterParams(vuexModuleKey, mainKey, params) {
      //   this.appendFilterParams(vuexModuleKey, mainKey, params)
      // },
      // 接收<文档管理>页签的表格数据（后台数据）
      receiveDocumentMangerTableData(response, callback) {
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
          // tableData.map(item => {
          //   item['disabledRowEdit'] = this.accessButtons.findIndex(btnName => btnName === `${this.buttonParentName}_edit`) >= 0
          //   item['disabledRowDelete'] = this.accessButtons.findIndex(btnName => btnName === `${this.buttonParentName}_delete`) >= 0
          // })
          this.tabs.documentManger.tableConfig.columnsStd = [];
          this.tabs.documentManger.tableConfig.columns = [
            {
              title: '文档名称',
              key: 'name',
              width: '250',
              // type: 'text'
            },
            {
              title: '审核状态',
              key: 'auditStatus',
              width: '150',
              render: (h, params) => {
                return h('span', {
                  style: {
                    color: String(params.row['auditStatus']) === '0' ? '#F67049' : '#45C376'
                  }
                }, String(params.row['auditStatus']) === '1' ? '已审核' : '未审核')
              }
            },
            {
              title: '文件类型',
              key: 'fileType',
              width: '150',
              // type: 'text'
            },
            // {
            //   title: '文件大小',
            //   key: 'fileSize',
            //   width: '150',
            //   type: 'text'
            // },
            {
              title: '审核时间',
              key: 'auditTime',
              width: '220',
            },
            {
              title: '创建时间',
              key: 'createTime',
              width: '220',
            },
            {
              title: '更新时间',
              key: 'updateTime',
              width: '220',
            },
          ];
          this.tabs.documentManger.tableConfig.countTotal = response.data.total;
          this.selectRows = [];
          if (this.$refs[`tableEl_documentManger`]) {
            this.$refs[`tableEl_documentManger`].drawTableData(this.tabs.documentManger.tableConfig.columns, tableData);
          }
        }
      },

      // 表格行编辑按钮 点击事件
      handleEditRow(tableTag, row) {
        // 根据表格的唯一标识进行识别，执行相应的操作
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'documentManger':  // 文档管理
            // <文档管理>编辑一行数据
            // console.log(row);
            this.pdfUrl = config.baseUrl.fdfsAddress + row.fileUri;
            this.centerDialogVisible = true;
            this.$nextTick(() => {
              // console.log(this.pdfUrl);
              // console.log(this.$refs.pdfPreview)
              this.$refs.pdfPreview.renderPage()
            })
            break
        }
      },
      // TODO:直接删除行事件
      handleSubmitToDeleteRow(tableTag, row, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'documentManger':  // 文档管理
            // 请求<文档管理>删除一行数据
            this.requestDeleteDocumentMangerRow(row, callback)
        }
      },
      // 请求<文档管理>删除一行数据
      async requestDeleteDocumentMangerRow(row, callback) {
        this.tabs.documentManger.tableConfig.loading = true
        await deleteFile({id: row.id}).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data

          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '删除成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <strong>代码：${row.number}</strong>
                        <strong>名称：${row.name}</strong>
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
                        <strong>代码：${row.number}</strong>
                        <strong>名称：${row.name}</strong>
                        <span style="color:orange;">未删除</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }

          // 根据表格的唯一标识进行识别，刷新相应页签下的表格
          this.refreshTabTable('documentManger', callback)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.documentManger.tableConfig.loading = false
        })
      },
      // 刷新某页签下的表格数据（重新请求）
      refreshTabTable(tableTag, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'documentManger':  // 文档管理
            // 请求<文档管理>页签下的表格数据
            this.requestDocumentMangerTableData(this.tabs.documentManger.tableConfig.curPage, this.tabs.documentManger.tableConfig.pageSize, callback)
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
    }
  }
</script>

<style lang='less' scoped>
  #container {
    margin-top: 20px;
  }
</style>

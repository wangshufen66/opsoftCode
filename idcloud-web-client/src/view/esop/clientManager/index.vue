<template>
  <div id="container">
    <el-dialog :title="treeChildTitle" :visible.sync="childCatalogVisible" class="dialogChildCatalog"
               :show-close="false">
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

    <el-dialog :title="clientTitle" :visible.sync="clientVisible" class="dialogClientCatalog" width="40%"
               :show-close="false">
      <el-form :model="formClient" :rules="clientRules" ref="clientForm" label-width="120px">
        <el-form-item :label="clientAddressText" prop="clientAddress">
          <el-input v-model="formClient.clientAddress" placeholder="请输入客户端地址"></el-input>
        </el-form-item>
        <el-form-item :label="clientNameText" prop="clientContent">
          <el-input v-model="formClient.clientName" placeholder="请输入客户端名称"></el-input>
        </el-form-item>
        <el-form-item :label="clientGroupText" prop="clientContent">
          <el-select v-model="formClient.clientGroup" placeholder="请选择客户端组">
            <el-option
              v-for="item in treeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="clientContentText" prop="clientContent">
          <el-input v-model="formClient.clientContent" placeholder="请输入发送内容"></el-input>
        </el-form-item>
        <el-form-item :label="clientImageText" prop="clientImage">

          <!--          Todo: 暂时没有客户端个性化上传接口，先用默认背景，之后有了改这里-->
          <el-upload
            class="client-image"
            action=""
            :show-file-list="false"
            :http-request="handleClientUpload"
            :on-success="handleClientSuccess"
            :before-upload="handleBeforeClientUpload">
            <el-avatar style="margin-top: 2px" v-if="formClient.clientImage" shape="square" :size="85"
                       :src="formClient.clientImage"></el-avatar>
            <!--            <img v-if="defaultBackgroundImageUrl" :src="defaultBackgroundImageUrl" class="avatar">-->
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearClientForm">取 消</el-button>
        <el-button type="primary" @click="submitClientName">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="背景印章设置"
      :visible.sync="defaultShow"
      width="30%"
    >
      <div class="card-list-title-center">
        <div class="upload-default-bg" v-loading="defaultBackgroudLoading">
          <h3>默认背景</h3>
          <el-upload
            class="upload-image"
            accept="jpg"
            action=""
            :show-file-list="false"
            :http-request="handleBackgroundUpload"
            :on-success="handleDefaultBackgroundSuccess"
            :before-upload="handleDefaultBackgroundUpload">
            <el-avatar v-if="defaultBackgroundImageUrl" shape="square" :size="178"
                       :src="defaultBackgroundImageUrl"></el-avatar>
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="upload-seal" v-loading="defaultSealLoading">
          <h3>默认印章</h3>
          <el-upload
            accept="jpg"
            class="upload-image"
            action=""
            :show-file-list="false"
            :http-request="handleSealUpload"
            :on-success="handleDefaultSealSuccess"
            :before-upload="handleDefaultSealUpload">
            <el-avatar v-if="defaultSealImageUrl" shape="square" :size="178" :src="defaultSealImageUrl"></el-avatar>
            <!--                <img style="size: 70px 70px" v-if="defaultSealImageUrl" :src="defaultSealImageUrl" class="avatar">-->
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </div>
      </div>
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

        <el-row style="margin-bottom: 5px">
          <el-col :span="12" align="left">
            <el-button class="option-button" type="primary" size="small"
                       @click="addOrUpdateClient('add')">
              添加
            </el-button>
            <el-button
              class="option-button-edit"
              size="small" @click="handleEditRow">
              编辑
            </el-button>
            <div class="div-vertical-line-button"></div>
            <el-button
              class="option-button-delete"
              size="small" @click="handleSubmitToDeleteRow">
              删除
            </el-button>
            <el-select class="clientCommunicationMode" v-model="value" size="small">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="switch-wrapper" @click="switchWrapperClick">
              <el-image
                v-show="switchValue"
                :src="iconList">
              </el-image>
              <el-image
                v-show="!switchValue"
                :src="iconCard">
              </el-image>
              <span>{{switchValue?'列表显示':'卡片显示'}}</span>
            </span>
            <div class="div-vertical-line-button-two"></div>
            <i class="el-icon-setting column-setting"
               v-loading="defaultBackgroudLoading&&defaultSealLoading"
               @click="defaultShow=true"></i>
            <span>背景印章设置</span>
          </el-col>
          <el-col :span="12" align="right">
            <div v-show="switchValue" style="margin-right: -0.15rem">
              <Select
                v-model="tabs.clientManager.tableConfig.selectSearchColumn"
                style="width: 7.9rem"
                placeholder=""
              >
                <Option
                  v-for="(item, index) in tabs.clientManager.tableConfig.selectSearchColumnSelections"
                  :key="index"
                  :value="item.key"
                >{{ item.title }}
                </Option>
              </Select>
              <Input
                v-model="tabs.clientManager.tableConfig.search"
                clearable
                :placeholder="tabs.clientManager.tableConfig.searchPlaceholder"
                class="option-input"
                style="width:13rem;margin-left: 4px;"
                @on-enter="handleSearchEnter"
              />
              <el-button
                class="search-btn"
                ref="searchButton"
                type="primary"
                circle
                icon="el-icon-search"
                size="mini"
                style="margin: 0.1rem 0.45rem 0.15rem 0.55rem;"
                @click="handleSearchEnter"
              ></el-button>
            </div>
          </el-col>
        </el-row>
        <!--表格组件-->
        <table-el
          class="table-el"
          v-if="tableShow"
          v-show="!switchValue"
          ref="tableEl_clientManager"
          :table-height="tableHeight"
          table-tag="clientManager"
          :serverPage="tabs.clientManager.serverPage"
          :table-uni-key="tabs.clientManager.tableUniKey"
          :vuex-first-key="tabs.clientManager.vuexFirstKey"
          :vuex-second-key="tabs.clientManager.vuexSecondKey"
          :columns-std="tabs.clientManager.columnsStd"
          :table-config="tabs.clientManager.tableConfig"
          :hasUploadButton="false"
          :hasAddButton="false"
          :showTableColumnsSetting="false"
          :hasDisableAccess="false"
          :hasAntiDisableAccess="false"
          :hasConfigTableHeadBtn="false"
          :hasShowAllBtn="false"
          :hasHeadEditAccess="false"
          :hasHeadDelAccess="false"
          :hasSelectColumn="true"
          :hasServerExcelImportButton="false"
          :hasAuditAccess="false"
          :hasAntiAuditAccess="false"
          :hasSearchTypeSelect="false"
          :hasSearchDateTimeRange="false"
          :hasRefreshButton="false"
          :searchDateTimeRangeConfig="searchDateTimeRangeConfig"
          @requestTablePageData="handleRequestTablePageData"
          @submitToDeleteRow="handleSubmitToDeleteRow"
          @editRow="handleEditRow"
          @handleTableSelectRowChange="handleTableSelectRowChange"/>
        <div v-show="switchValue" class="client-card-list">
          <div v-for="(card, index) of filterClientList" :key="index" class="card-container">
            <!--<div :class="{'checkbox-hide':!batchOptionEnabled,'checkbox-show':batchOptionEnabled}">-->
            <!--<el-checkbox v-model="card.checked" size="medium">选择</el-checkbox>-->
            <!--</div>-->
            <div>
              <el-checkbox v-model="card.checked" size="medium">选择</el-checkbox>
            </div>
            <div class="option-card">
              <div class="option-card-content">
                <div class="option-card-top">
                  <h1>{{card.name}}</h1>
                  <h3>{{card.ip}}</h3>
                </div>
                <div class="option-card-bottom">
                  <div class="option-card-content">
                    <span><strong>发送内容：</strong>{{card.send}}</span>
                  </div>
                  <div class="image-container">
                    <img :src="card.imageUrl" alt="默认背景图"/>
                  </div>
                </div>
              </div>
              <div class="option-card-buttons">
                <div class="option-card-buttons-top">
                  <div class="option-container" v-if="value==='0'">
                    <i class="el-icon-refresh-left"/>
                    <span>重连</span>
                  </div>
                  <div class="option-container" v-if="value==='0'">
                    <i class="el-icon-paperclip"/>
                    <span>断开</span>
                  </div>
                  <div class="option-container" @click="addOrUpdateClient('edit',card)">
                    <i class="el-icon-edit-outline"/>
                    <span>编辑</span>
                  </div>
                  <div class="option-container" @click="getDelCardData(card)">
                    <i class="el-icon-delete"/>
                    <span>删除</span>
                  </div>
                </div>
              </div>
              <div class="status-flag">
                <i class="el-icon-connection" :style="{'color':card.communicationMode===1?'#4cd137':'#2f3542'}"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import TableEl from "@/components/table-el/index"
  import {RequestFilterMixins} from "@/mixins/RequestFilterMixins"
  import imageConversion from 'image-conversion'
  import {
    clientBaseUrl,
    deleteClient,
    deleteGroup,
    getDefaultBackground,
    getDefaultSeal,
    renameGroup,
    uploadBackground,
    uploadSeal,
    addClient,
    addGroup,
    editClient,
    getGroupTree,
    getClients
  } from "@/api/esop/esopClientManagement";
  import {uploadPic} from "@/api/basedata";
  import iconList from '@/assets/images/environmentMonitor/icon-list.png'
  import iconCard from '@/assets/images/environmentMonitor/icon-card.png'
  import config from '@/config'
  import IdTree from "@/components/id-tree/index";
  import {configAll} from "@/components/id-tree/idTreeConfig";
  // 目前遇到的技术性问题：
  // You may have an infinite update loop in a component render function

  export default {
    name: "client_manager",
    components: {TableEl, IdTree},
    mixins: [RequestFilterMixins],
    data() {
      //IP地址验证规则
      let validCodeIp = (rule, value, callback) => {
        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('输入IP格式不合法！'));
        }
      };
      return {
        //勾选参数
        selectRows: [],
        //卡片列表参数
        clientList: [],
        filterClientList: [],//筛选过后的客户端列表  add cdh 20200216
        //全局参数
        defaultBackgroudLoading: false,
        defaultSealLoading: false,
        defaultShow: false,
        defaultBackgroundImageUrl: '',//客户端默认图片地址
        defaultSealImageUrl: '',//客户端默认印章地址
        //新建客户端参数----------------------------------------------------
        clientVisible: false,
        clientTitle: '新增客户端',//客户端标题
        clientNameText: '客户端名称',
        clientAddressText: '客户端地址',
        clientContentText: '发送内容',
        clientGroupText: '客户端分组',
        clientImageText: '默认图片',
        formClient: {
          clientName: '',
          clientAddress: '',
          clientGroup: '',
          clientContent: '',
          clientImage: '',
        },
        clientRules: {
          clientAddress: [
            {required: true, message: '客户端地址不能为空！', trigger: 'blur'},
            {validator: validCodeIp, trigger: 'blur'}
          ],
        },
        //头部操作栏相关---------------------------------------------
        iconList,
        iconCard,
        switchValue: true,
        //下拉选择 通信模式
        options: [
          // {
          //   value: '0',
          //   label: '实时模式'
          // }
          {
            value: '1',
            label: '刷新模式'
          }
        ],
        value: '1',
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
        //------------------------------------------------------------
        //树形列表相关-----------------------------------------------
        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configAll, //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据
        containerInfosData: {}, //树形目录当前选中数据
        //----------------------------------------------------------------
        //马昆仑表格参数-------------------------------------------------------------
        addText: '上传',
        editText: '预览',
        buttonParentName: 'clientManager', // 所有按钮对应的菜单名称（后台数据库存放的数据决定的）
        accessButtons: this.$store.state.user.accessButton, //获取当前存储的当前登录用户的所有权限按钮，根据名称进行匹配
        timerComm: null,  // 公共定时器
        tableShowTimer: null,
        tableShow: true,
        tableHeight: `${document.documentElement.clientHeight}` - 242 + '',
        pageHeight: 0,
        activeTab: 'person',  // 当前激活的页签(对象的key值)
        showAddTab: false,  // 控制添加页签的显示和隐藏
        hackTimer: null,  // 用于强制重新渲染组件timer定时器
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
          clientManager: {
            label: '客户端管理',
            type: 'normal',
            show: true,
            tableUniKey: 'id', // 作为表格数据唯一识别的字段名（即 属性 key）
            vuexFirstKey: 'clientManager', // 表格组件获取 vuex 数据的 一级Key
            vuexSecondKey: 'clientManager', // 表格组件获取 vuex 数据的 二级Key
            serverPage: true, // 分页模式，true=后台分页，false=前台分页
            // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
            columnsStd: [],
            tableConfig: {
              loading: false,
              tableName: '客户端管理',  // 表格名称，在导出成Excel时，会使用该名称作为文件名
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
              selectSearchColumn: '',
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
      this.getDefaultPic()
      this.getDefaultSeal()
      this.findGroupListFunc()
    },
    beforeDestroy() {
    },
    computed: {},
    methods: {
      //设置全局参数
      //全局背景
      handleBackgroundUpload(file) {
        this.defaultBackgroundImageUrl = URL.createObjectURL(file.file);
        Promise.resolve(uploadBackground(file.file, this.$store.state.user.userInfo.orgId)).then(res => {
          if (res.data.code === 200) {
            this.getDefaultPic()
          } else {
            this.$notify.error({
              title: '失败',
              message: res.data.data.message
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      handleDefaultBackgroundSuccess(res, file) {
      },
      handleDefaultBackgroundUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        //如果图片小于0.5m则上传原图，否则压缩到400k
        const isLt05M = file.size / 1024 / 1024 < 0.5
        if (!(isJPG || isPNG)) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
          return false
        } else {
          return new Promise(resolve => {
            if (isLt05M) {
              // console.log('未压缩')
              // console.log(file)
              resolve(file)
            } else {
              imageConversion.compressAccurately(file, 400).then(res => {
                // console.log('已压缩')
                // console.log(res)
                resolve(res)
              })
            }
          }).catch(e => {
            this.$message.error('上传失败');
          })
        }
      },
      //全局印章
      handleSealUpload(file) {
        this.defaultSealImageUrl = URL.createObjectURL(file.file);
        Promise.resolve(uploadSeal(file.file, this.$store.state.user.userInfo.orgId)).then(res => {
          if (res.data.code === 200) {
            this.getDefaultSeal()
          } else {
            this.$notify.error({
              title: '失败',
              message: res.data.data.message
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      handleDefaultSealSuccess() {
      },
      handleDefaultSealUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        //如果图片小于0.5m则上传原图，否则压缩到400k
        const isLt05M = file.size / 1024 / 1024 < 0.5
        if (!(isJPG || isPNG)) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
          return false
        } else {
          return new Promise(resolve => {
            if (isLt05M) {
              // console.log('未压缩')
              // console.log(file)
              resolve(file)
            } else {
              imageConversion.compressAccurately(file, 400).then(res => {
                // console.log('已压缩')
                // console.log(res)
                resolve(res)
              })
            }
          }).catch(e => {
            this.$message.error('上传失败');
          })
        }
      },
      //获取全局参数 客户端默认图片 和 客户端默认印章-------------------------------
      //客户端默认图片
      async getDefaultPic() {
        try {
          this.defaultBackgroudLoading = true
          let res = await Promise.resolve(getDefaultBackground({orgId: this.$store.state.user.userInfo.orgId}))
          if (res.data.data !== null)
            this.defaultBackgroundImageUrl = config.baseUrl.fdfsAddress + res.data.data
          this.defaultBackgroudLoading = false
        } catch (e) {
          const errorMsg = '异常信息：' + e
          this.$notify.error({title: '失败', message: errorMsg})
        }
      },
      //客户端默认印章
      async getDefaultSeal() {
        try {
          this.defaultSealLoading = true
          let res = await Promise.resolve(getDefaultSeal({orgId: this.$store.state.user.userInfo.orgId}))
          if (res.data.data !== null)
            this.defaultSealImageUrl = config.baseUrl.fdfsAddress + res.data.data
          this.defaultSealLoading = false
        } catch (e) {
          const errorMsg = '异常信息：' + e
          this.$notify.error({title: '失败', message: errorMsg})
        }
      },
      //选择行函数------------------------------------------------------------
      handleTableSelectRowChange(rows) {
        // console.log('选择行')
        // console.log(rows)
        this.selectRows = rows
        if (!this.switchValue && this.selectRows.length > 0) {
          this.filterClientList.forEach(item => {
            item.checked = false
            this.selectRows.forEach(selectRow => {
                if (item.id === selectRow.id)
                  item.checked = true
              }
            )
          })
          // this.clientList.forEach(item => {
          //   item.checked = false
          //   this.selectRows.forEach(selectRow => {
          //       if (item.id === selectRow.id)
          //         item.checked = true
          //     }
          //   )
          // })
        } else {
          // this.clientList.forEach(item => item.checked = false)
          this.filterClientList.forEach(item => item.checked = false)
        }
      },
      //客户端弹窗相关--------------------------------------------------------------
      handleClientUpload(file) {
        this.defaultBackgroundImageUrl = URL.createObjectURL(file.file);
        Promise.resolve(uploadPic(file.file, '')).then(res => {
          // this.getDefaultPic()
          // console.log(res)
          if (res.data.code === 200) {
            this.formClient.clientImage = `${config.baseUrl.fdfsAddress}/${res.data.data.address}`;
          }
        }).catch(e => {
          console.log(e)
        })
      },
      handleClientSuccess(res, file) {
      },
      handleBeforeClientUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        //如果图片小于0.5m则上传原图，否则压缩到400k
        const isLt05M = file.size / 1024 / 1024 < 0.5
        if (!(isJPG || isPNG)) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
          return false
        } else {
          return new Promise(resolve => {
            if (isLt05M) {
              // console.log('未压缩')
              // console.log(file)
              resolve(file)
            } else {
              imageConversion.compressAccurately(file, 400).then(res => {
                // console.log('已压缩')
                // console.log(res)
                resolve(res)
              })
            }
          }).catch(e => {
            this.$message.error('上传失败');
          })
        }
      },
      //清空客户端数据
      clearClientForm() {
        this.clientVisible = false
        this.addEditFlag = ''
        this.formClient.clientGroup = ''
        this.formClient.clientAddress = ''
        this.formClient.clientContent = ''
        this.formClient.clientImage = ''
        this.$refs['clientForm'].resetFields()
      },
      //提交客户端
      submitClientName() {
        this.$refs['clientForm'].validate((valid) => {
          if (valid) {
            if (this.addEditFlag === 'add') {
              this.addClient()
            } else {
              this.editClient()
            }
            this.clearClientForm();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //新增客户端
      addClient() {
        const paramArr = {
          name: this.formClient.clientName,
          ip: this.formClient.clientAddress,
          content: this.formClient.clientContent,
          pid: this.formClient.clientGroup,
          isGroup: 'false',
          orgId: this.$store.state.user.userInfo.orgId,
          backgroudImagePath: this.formClient.clientImage ? this.formClient.clientImage : null
        }
        const promiseArr = [
          addClient(paramArr)
        ]
        Promise.all(promiseArr).catch(e => {
          const errorMsg = '异常信息：' + e
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.requestClientManagerTableData(this.tabs.clientManager.tableConfig.curPage,
            this.tabs.clientManager.tableConfig.pageSize)
        })
      },
      //更新客户端
      editClient() {
        const paramArr = {
          id: this.theChosenOne.id,
          name: this.formClient.clientName,
          ip: this.formClient.clientAddress,
          pid: this.formClient.clientGroup,
          content: this.formClient.clientContent,
          backgroudImagePath: this.formClient.clientImage ? this.formClient.clientImage : null,
          isGroup: 'false'
        }
        const promiseArr = [
          editClient(paramArr)
        ]
        Promise.all(promiseArr).catch(e => {
          const errorMsg = '异常信息：' + e
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.requestClientManagerTableData(this.tabs.clientManager.tableConfig.curPage,
            this.tabs.clientManager.tableConfig.pageSize)
        })
      },
      //弹窗——新增客户端 + 更新客户端
      addOrUpdateClient(operate, card) {
        // console.log(card);
        if (this.containerInfosData.id === undefined) {
          this.$notify({
            title: '警告',
            message: '请先选择左侧客户端分组！',
            type: 'warning'
          });
          return;
        }
        this.theChosenOne = '';
        if (operate === "add") {
          this.clientTitle = '新增客户端';
          this.formClient.clientName = '';
          this.formClient.clientAddress = '';
          this.formClient.clientContent = '';
          this.formClient.clientImage = this.defaultBackgroundImageUrl ? this.defaultBackgroundImageUrl : '';
          this.formClient.clientGroup = this.containerInfosData === {} ? this.containerInfosData.id : '';
          this.addEditFlag = 'add';
        } else {
          this.clientTitle = '修改客户端';
          this.formClient.clientContent = card.send ? card.send : card.content;
          this.formClient.clientImage = card.imageUrl ? card.imageUrl : card.backgroudImagePath;
          this.addEditFlag = 'edit';
          this.theChosenOne = card;
          this.formClient.clientAddress = card.ip;
          this.formClient.clientName = card.name;
          this.formClient.clientGroup = card.pid;
        }
        this.clientVisible = true;
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
              if (this.treeChildTitle === '新建顶级分组') {
                const params = {
                  name: this.form.childCatalogName,
                  level: !this.containerInfosData.level ? 1 : this.containerInfosData.level + 1,
                  pid: !this.containerInfosData.id ? 0 : this.containerInfosData.id,
                  orgId: this.$store.state.user.userInfo.orgId
                }
                // console.log(JSON.stringify(params))
                this.commitAddData(params)
                this.clearFormData();
              } else if (this.treeChildTitle === '重命名分组') {
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
              } else {
                const params = {
                  folderName: this.form.childCatalogName,
                  content: null,
                  level: 1,
                  pid: 0,
                }
                // console.log(JSON.stringify(params))
                this.commitAddData(params)
                this.clearFormData();
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
        addGroup(params).then(response => {
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
      //重命名分组
      renameTreeFolder(params) {
        renameGroup(params).then(response => {
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
      //表头操作栏-------------------------------------------------------------
      //表头切换卡片和列表
      switchWrapperClick() {
        if (this.switchValue) {
          // this.selectRows = this.tabs.clientManager.tableConfig.data
          this.filterClientList.forEach(item => {
            if (item.checked)
              this.tabs.clientManager.tableConfig.data[
                this.tabs.clientManager.tableConfig.data.findIndex(tableRow => tableRow.id === item.id)
                ]._checked = true
            else
              this.tabs.clientManager.tableConfig.data[
                this.tabs.clientManager.tableConfig.data.findIndex(tableRow => tableRow.id === item.id)
                ]._checked = false
          })
        }
        this.switchValue = !this.switchValue
      },
      //树形目录操作栏--------------------------------------------------------
      /* 修改 节点 */
      editNodeFunc() {
        if (!this.containerInfosData.id) {
          this.$notify({
            title: '警告',
            message: '请选择你要编辑的节点！',
            type: 'warning'
          });
          return
        }
        this.treeChildTitle = '重命名分组'
        this.form.childCatalogName = this.containerInfosData.name
        this.childCatalogVisible = true
      },
      /* 添加 节点 */
      addNodeFunc() {
        if (!this.containerInfosData.id) {
          this.treeChildTitle = '新建顶级分组';
          this.form.childCatalogName = '';
          this.childCatalogVisible = true;
        } else {
          this.$notify({
            title: '警告',
            message: '无法添加子分组！',
            type: 'warning'
          });
        }
      },
      /* 删除 节点 */
      delNodeFunc() {
        if (this.containerInfosData.id === undefined) {
          return
        }
        this.$confirm('此操作将永久删除所选分组(只能删除【最底层分组】并且【节点下数据】的分组), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGroup({
            id: this.containerInfosData.id,
            orgId: this.$store.state.user.userInfo.orgId
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
        await getGroupTree({orgId: this.$store.state.user.userInfo.orgId}).then(res => {
          if (res.status === 200 && res.data.code === 200) {
            // 生成树形图结构数据
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
            this.$refs[`tableEl_clientManager`].drawTableData(this.tabs.clientManager.tableConfig.columns, [])
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
          this.$refs[`tableEl_clientManager`].drawTableData(this.tabs.clientManager.tableConfig.columns, [])
          this.selectRows = []
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          this.tabs.clientManager.tableConfig.curPage = 1;
          this.tabs.clientManager.tableConfig.pageSize = 10;
          this.requestClientManagerTableData(this.tabs.clientManager.tableConfig.curPage,
            this.tabs.clientManager.tableConfig.pageSize)
        }
      },
      // 获取树形目录窗口高度
      getClientHeight() {
        const _this = this
        this.clientHeight = `${document.documentElement.clientHeight}`
        window.onresize = () => {
          _this.clientHeight = `${document.documentElement.clientHeight}`
        }
      },
      // 页签初始化操作
      initTabOption() {
        this.activeTab = 'clientManager'
        this.initAccessButtons()
      },
      // 初始化按钮权限
      initAccessButtons() {

      },
      // 请求<客户端管理>页签下的表格数据
      async requestClientManagerTableData(curPage, curPageSize, callback) {
        // 请求参数
        let param = {
          current_page: curPage,
          page_size: curPageSize,
          orgId: this.$store.state.user.userInfo.orgId,
          // // 对于搜索，目前后台接口仅支持名称搜索
          // search_name: this.tabs.clientManager.tableConfig.selectSearchColumn === 'clientManager_name' ? this.tabs.clientManager.tableConfig.search : ''
        }

        // if (this.tabs.clientManager.tableConfig.search !== "")
        //   param[this.tabs.clientManager.tableConfig.selectSearchColumn] = this.tabs.clientManager.tableConfig.search;


        if (this.containerInfosData.id !== undefined)
          param.groupId = this.containerInfosData.id

        let promiseArray = [
          //列表请求
          getClients(param)
        ]

        this.tabs.clientManager.tableConfig.loading = true
        await Promise.all(promiseArray).then(response => {
          // console.log(JSON.stringify(response))
          let [clientManagerResponse] = response

          // 接收页签的表格数据（后台数据）
          this.receiveClientManagerTableData(clientManagerResponse, callback)
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '失败',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.clientManager.tableConfig.loading = false
        })
      },
      // 接收<客户端管理>页签的表格数据（后台数据）
      receiveClientManagerTableData(response, callback) {
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
          let tableData = response.data.records
          // tableData.map(item => {
          //   item['disabledRowEdit'] = this.accessButtons.findIndex(btnName => btnName === `${this.buttonParentName}_edit`) >= 0
          //   item['disabledRowDelete'] = this.accessButtons.findIndex(btnName => btnName === `${this.buttonParentName}_delete`) >= 0
          // })
          this.tabs.clientManager.tableConfig.columnsStd = []
          this.tabs.clientManager.tableConfig.columns = [
            {
              title: '客户端名称',
              key: 'name',
              width: '150',
              // type: 'text'
            },
            {
              title: '客户端地址',
              key: 'ip',
              width: '150',
              type: 'text'
            },
            {
              title: '发送内容',
              key: 'content',
              width: '250',
              // type: 'text'
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
          ]
          this.tabs.clientManager.tableConfig.countTotal = response.data.total

          if (this.$refs[`tableEl_clientManager`]) {
            this.$refs[`tableEl_clientManager`].drawTableData(this.tabs.clientManager.tableConfig.columns, tableData)
          }

          //卡片列表的初始化
          let clientList = []
          response.data.records.forEach(item => {
            if (item.isGroup === false) {
              clientList.push({
                pid: item.pid,
                id: item.id,
                name: item.name,
                //checked 写死
                checked: false,
                ip: item.ip,
                status: item.onlineStatus,
                send: item.content,
                imageUrl: item.backgroudImagePath,
                communicationMode: item.communicationMode
              })
            }
          })
          // console.log(clientList)
          clientList.forEach(item => {
            if (item.imageUrl === null || item.imageUrl === undefined) {
              item.imageUrl = this.defaultBackgroundImageUrl
            }
          })
          this.clientList = clientList
          this.filterClientList = clientList
        }
      },

      // 表格行编辑按钮 点击事件 + 表头编辑
      handleEditRow(tableTag, row) {
        // console.log(tableTag);
        // console.log(row);
        // 根据表格的唯一标识进行识别，执行相应的操作
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'clientManager':  // 客户端管理
            // <客户端管理>编辑一行数据
            this.addOrUpdateClient('edit', row);
            break;
          default:
            if (this.switchValue) {
              if (this.filterClientList.length > 0) {
                let checkedCount = 0
                this.filterClientList.forEach(item => {
                  if (item.checked)
                    checkedCount += 1;
                })
                if (checkedCount === 1)
                  this.addOrUpdateClient('edit', this.filterClientList[this.filterClientList.findIndex(item => item.checked === true)]);
              }
            } else {
              if (this.selectRows.length === 1)
                this.addOrUpdateClient('edit', this.selectRows[0]);
            }
            break;
        }
      },
      // 直接删除行事件 +  表头删除
      handleSubmitToDeleteRow(tableTag, row, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'clientManager':  // 客户端管理
            // 请求<客户端管理>删除一行数据
            this.requestDeleteClientManagerRow(row, callback);
            break;
          default:
            if (this.switchValue) {
              let selectCards = []
              this.filterClientList.forEach(item => {
                if (item.checked)
                  selectCards.push(item)
              })
              if (selectCards.length > 0)
                this.requestDeleteClientManagerRows(selectCards);
            } else {
              if (this.selectRows.length > 0)
                this.requestDeleteClientManagerRows(this.selectRows);
            }
            break;
        }
      },
      // 请求<客户端管理>删除多行数据
      async requestDeleteClientManagerRows(rows, callback) {
        this.tabs.clientManager.tableConfig.loading = true
        console.log(rows);
        let params = []
        rows.forEach(item => params.push({id: item.id, orgId: this.$store.state.user.userInfo.orgId}))
        await deleteClient(params).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data

          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '批量删除成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              type: 'success'
            })
            this.selectRows = []
            this.requestClientManagerTableData(this.tabs.clientManager.tableConfig.curPage,
              this.tabs.clientManager.tableConfig.pageSize)
          } else {
            // 操作回调
            this.$notify({
              title: '批量删除失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              type: 'error'
            })
          }
        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.clientManager.tableConfig.loading = false
        })
      },
      // 请求<客户端管理>删除一行数据
      async requestDeleteClientManagerRow(row, callback) {
        this.tabs.clientManager.tableConfig.loading = true
        // console.log(row);
        await deleteClient([{id: row.id, orgId: this.$store.state.user.userInfo.orgId}]).then(response => {
          // console.log(JSON.stringify(response))
          response = response.data

          if (response.code === 200) {
            // 操作成功回调
            this.$notify({
              title: '删除成功',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <strong>ip：${row.ip}</strong>
                        <strong>名称：${row.name}</strong>
                        <span style="color:orange;">已删除</span>
                      </div>`,
              type: 'success'
            })
            this.selectRows = []
            this.requestClientManagerTableData(this.tabs.clientManager.tableConfig.curPage,
              this.tabs.clientManager.tableConfig.pageSize)

          } else {
            // 操作回调
            this.$notify({
              title: '删除失败',
              position: 'top-right',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <strong>ip：${row.ip}</strong>
                        <strong>名称：${row.name}</strong>
                        <span style="color:orange;">未删除</span>
                        <span style="color:orange;">原因：${response.msg}</span>
                      </div>`,
              type: 'error'
            })
          }

        }).catch(response => {
          const errorMsg = '异常信息：' + response
          console.log(errorMsg)
          this.$notify.error({
            title: '删除失败',
            position: 'top-left',
            message: errorMsg
          })
        }).finally(() => {
          this.tabs.clientManager.tableConfig.loading = false
        })
      },
      // 刷新某页签下的表格数据（重新请求）
      refreshTabTable(tableTag, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        // 表格的唯一标识和页签的唯一key相同
        switch (tableTag) {
          case 'clientManager':  // 客户端管理
            // 请求<客户端管理>页签下的表格数据
            this.requestClientManagerTableData(this.tabs.clientManager.tableConfig.curPage, this.tabs.clientManager.tableConfig.pageSize, callback)
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
      handleRequestTablePageData(tableTag, curPage, curPageSize, callback) {
        // 根据表格的唯一标识进行识别，执行相应的请求
        this.refreshTabTable(tableTag, callback)
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
  @import "../../systemManagement/systemManageStyle.less";

  #container {
    margin-top: 20px;
  }

  .clientCommunicationMode {
    width: 150px;
    margin-left: 4px;
    /*overflow:auto;*/

    /deep/ .el-input__inner {
      border-color: #409EFF;
      background-color: white;
      color: #409EFF;
      /*height: auto !important;*/
      /*line-height:2.2rem;*/
    }

    /deep/ .el-select__caret {
      color: #409EFF;
    }
  }

  .switch-wrapper {
    display: inline;
    flex-direction: row;
    align-items: center;
    margin-right: 6px;

    .el-image {
      margin-bottom: -1.5px;
      margin-left: 8px;
      margin-right: 4px;
      width: 14px;
      height: 14px;
      display: inline-block;
    }
  }

  .div-vertical-line-button-two {
    width: 0.9px;
    background-color: #b4b4b4;
    margin-top: 7px;
    height: 17px;
    /*border-top: 1px solid #409EFF;*/
    display: inline-block;
    position: absolute;
  }

  .column-setting {
    margin-left: 6px;
    margin-right: 4px;
  }

  .table-el {
    margin-top: -37px;
  }

  .client-card-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 2px;
    overflow-x: hidden;

    .checkbox-show {
      animation: show-checkbox 0.5s forwards;
    }

    @keyframes show-checkbox {
      0% {
        transform: scaleY(0);
      }
      100% {
        transform: scaleY(1);
      }
    }

    .checkbox-hide {
      animation: hide-checkbox 0.5s forwards;
    }

    @keyframes hide-checkbox {
      0% {
        transform: scaleY(1);
      }
      100% {
        transform: scaleY(0);
      }
    }

    .option-card {
      width: 240px;
      height: 280px;
      border: 1px solid #c4c4c4;
      box-shadow: 5px 5px 3px gray;
      padding: 5px;
      margin-bottom: 50px;
      margin-right: 11px;

      .option-card-content {
        display: flex;
        flex-direction: column;

        .option-card-top {
          width: 100%;
          height: 70px;
          border-bottom: 1px solid #c4c4c4;
        }

        .option-card-bottom {
          .option-card-content {
            margin-bottom: 20px;
          }

          .image-container {
            width: 99%;
            height: 160px;

            img {
              width: 99%;
              height: 160px;
            }
          }
        }
      }

      .option-card-buttons {
        background: black;
        width: 99%;
        height: 50px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        transition: 0.5s;
        opacity: 0;
        visibility: visible;
        z-index: 999;
        position: relative;
        top: -56px;
        transform: scaleY(0);
        transform-origin: 0 100% 0; // transform-origin: x-axis y-axis z-axis; 改变缩放基点
        .option-card-buttons-top {
          flex: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;

          .option-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 5px;
            margin-left: 16px;
            cursor: pointer;

            i {
              font-size: 22px;
              color: #a4b0be;
              opacity: 0.9;
            }

            span {
              color: #a4b0be;
              opacity: 0.9;
            }
          }

          .option-container:hover {
            i {
              color: orange;
            }

            span:hover {
              color: orange;
            }
          }

        }
      }

      .status-flag {
        position: relative;
        z-index: 999;
        top: -336px;
        right: -196px;

        i {
          font-size: 32px;
        }
      }
    }

    .option-card:hover {
      .option-card-buttons {
        opacity: 0.8;
        transform: scaleY(1);
      }
    }
  }

  .dialogClientCatalog {
    /*width: 70%;*/
    /*margin-left: 15%;*/

    .el-input {
      width: 70%;
    }

    .client-image {
      width: 90px;
      height: 90px;
      display: flex;
      justify-content: center;
      border: 1px dashed gray;
      margin-left: 8px;
      margin-bottom: 8px;

      i {
        padding-top: 25px;
        font-size: 20px;
        font-weight: bolder;
      }
    }
  }

  .card-list-title-center {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;

    .upload-image {
      width: 180px;
      height: 180px;
      display: flex;
      justify-content: center;
      border: 1px dashed gray;
      margin-left: 8px;
      margin-bottom: 8px;

      i {
        padding-top: 25px;
        font-size: 20px;
        font-weight: bolder;
      }
    }

    .upload-default-bg {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: -30px;
    }

    .upload-seal {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-left: -30px;
    }
  }
</style>

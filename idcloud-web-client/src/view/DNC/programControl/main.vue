<template>
  <div class="container"
       style="display: flex;flex-direction: row;margin-left:-27px">
    <id-tree
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
      <div class="table-header-wrapper">
        <div class="table-header-left-wrapper">
          <div class="option-button-container">
            <el-button
              type="primary"
              size="small"
              @click="handleClickUpload"
              icon="el-icon-upload2"
            >上传
            </el-button>
            <el-button
              style="margin-left: 6px;"
              type="primary"
              size="small"
              @click="handleClickDownload"
              icon="el-icon-download"
            >下载
            </el-button>

            <el-button-group class="el-btn-group-style">
              <el-button @click="handleMultiEditClick" size="small" class="el-btn-style">编辑</el-button>
              <el-button @click="handleMultiDelClick" size="small" class="el-btn-style">删除</el-button>
            </el-button-group>

            <Dropdown class="option-dropdown">
              <el-button class="option-button" size="small">
                <span>审核</span>
                <i class="ivu-icon ivu-icon-ios-arrow-down"></i>
              </el-button>
              <DropdownMenu slot="list">
                <DropdownItem class="dropdown-line-wrapper">
                  <div style="width: 100%" @click="handleAuditClick" class="dropdown-line">审核</div>
                </DropdownItem>
                <DropdownItem class="dropdown-line-wrapper">
                  <div @click="handleAntiAuditClick" class="dropdown-line">反审核</div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <div
              @click="findGroupListFunc"
              style="height: 32px; line-height: 32px; margin-left: 12px; cursor: pointer; font-size: 14px;"
            >
              <i class="el-icon-refresh-right"></i>
              <span style="margin-left: 4px;">刷新</span>
            </div>
          </div>
        </div>
        <div class="search-wrapper">
          <el-select style="width: 120px" value-key="key" size="small" v-model="search.select">
            <el-option
              v-for="(item,index) in column"
              :key="index"
              :label="item.title"
              :value="item.desc"
            ></el-option>
          </el-select>
          <el-date-picker
            size="small"
            :picker-options="search.pickerOptions"
            style="width: 400px; margin: 0 0.5rem 0 0.2rem"
            v-if="search.select.type === 'dateTime'"
            v-model="search.input"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          ></el-date-picker>
          <el-select
            clearable
            v-else-if="search.select.type === 'select'"
            style="width: 180px; margin: 0 0.5rem 0 0.2rem"
            v-model="search.input"
            size="small"
            placeholder="请选择"
          >
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="审核" :value="1"></el-option>
            <!-- <el-option
              v-for="i in search.select.options"
              :key="i.key"
              :label="i.value"
              :value="i.key"
            />-->
          </el-select>
          <el-input
            v-else
            style="width: 180px; margin: 0 0.5rem 0 0.2rem"
            clearable
            size="small"
            placeholder="请输入"
            v-model.trim="search.input"
          ></el-input>
          <el-button
            @click="clickSearch"
            type="primary"
            size="small"
            icon="el-icon-search"
            circle
          ></el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          v-loading="table.loading"
          height="75vh"
          :data="table.data"
          :header-cell-style="setTableRowStyle"
          @row-dblclick="handleRowDbClick"
          border
          @select="handleTableSelect"
          @select-all="handleTableSelectAll"
        >
          <el-table-column align="center" type="index" width="45"></el-table-column>
          <el-table-column header-align="center" align="center" type="selection" width="45"></el-table-column>
          <el-table-column
            v-for="item in column"
            :key="item.desc.key"
            :prop="item.desc.key"
            :label="item.title"
            :width="item.width"
            resizable
          >
            <template slot-scope="scope">
              <div v-if="item.desc.key == 'auditStatus'">
                <span style="color: #F67049" v-if="scope.row[item.desc.key] == 0">未审核</span>
                <span style="color: #45C376" v-else-if="scope.row[item.desc.key] == 1">审核</span>
              </div>
              <span v-else>{{scope.row[item.desc.key]}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" header-align="center" label="操作" width="170">
            <template slot-scope="scope">
              <div class="inside-style" style="display: flex; justify-content: center;">
                <Dropdown v-if="scope.row.auditStatus == 0">
                  <el-button
                    style="width: 80px; margin-right: 10px;"
                    type="primary"
                    plain
                    class="option-button"
                    size="small"
                  >
                    <span style="margin-right: 4px">操作</span>
                    <i class="ivu-icon ivu-icon-ios-arrow-down"></i>
                  </el-button>
                  <DropdownMenu slot="list">
                    <DropdownItem class="dropdown-line-wrapper">
                      <div
                        style="width: 100%"
                        @click="handleEdit(scope.row)"
                        class="dropdown-line"
                      >编辑
                      </div>
                    </DropdownItem>
                    <DropdownItem class="dropdown-line-wrapper">
                      <div @click="handleAddVersion(scope.row)" class="dropdown-line">新增版本</div>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
                <el-button
                  v-else
                  plain
                  size="small"
                  type="primary"
                  @click="handleAddVersion( scope.row)"
                >新增版本
                </el-button>
                <el-button plain size="small" type="danger" @click="handleDelete( scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page-wrapper">
        <el-pagination
          @current-change="pageChange"
          @size-change="sizeChange"
          :current-page.sync="page.current"
          :page-size="page.size"
          :page-sizes="page.sizes"
          layout="total, sizes, prev, pager, next, jumper"
          :total="page.total"
        ></el-pagination>
      </div>
    </div>

    <group :groupObj="groupObj" @findGroupListFunc="findGroupListFunc"></group>
    <el-dialog
      @open="tableDialogOpen"
      top="60px"
      @closed="tableDialogClose"
      :title="tableDialog.title"
      :visible.sync="tableDialog.v"
    >
      <div class="table-search-wrapper">
        <el-select
          class="search-select-style"
          size="small"
          v-model="tableDialog.searchSelected"
          placeholder="请选择"
        >
          <el-option
            v-for="item in tableDialog.tableColumn"
            v-show="item.type === 'text'"
            :key="item.key"
            :label="item.title"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-input
          clearable
          class="search-input-style"
          size="small"
          v-model="tableDialog.searchInput"
        ></el-input>
        <el-button
          @click="handleTableDialogSearch"
          class="search-btn-style"
          type="primary"
          icon="el-icon-search"
          circle
        ></el-button>
      </div>

      <el-table
        highlight-current-row
        @current-change="handleCurrentChange"
        :data="tableDialog.tableData"
        v-loading="tableDialog.tableLoading"
        @select="handleSelect"
        @row-dblclick="handleFormTableDbClick"
        @select-all="handleSelectAll"
        @selection-change="handleSelectionChange"
        ref="dialogTable"
      >
        <el-table-column v-if="tableDialog.hasMultiSelection" type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="(item,index) in tableDialog.tableColumn"
          :key="index"
          :property="item.key"
          :label="item.title"
          :width="item.width"
        ></el-table-column>
      </el-table>
      <div class="pagination-style">
        <el-pagination
          @current-change="handleTableDialogPageChange"
          :current-page="tableDialog.currentPage"
          background
          layout="total,prev, pager, next"
          :total="tableDialog.total"
        ></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleTableDialogCancel">取 消</el-button>
        <el-button
          :disabled="tableDialog.confirmDisabled"
          type="primary"
          @click="handleTableDialogConfirm"
        >确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="480px"
      class="strangeDialog"
      :title="pushDialog.title"
      :visible.sync="pushDialog.v"
    >
      <el-form
        :model="pushForm.validate"
        :rules="pushForm.rules"
        ref="pushForm"
        label-width="100px"
      >
        <el-form-item
          v-for="(item,index) in pushForm.column"
          :key="index"
          :label="item.title"
          :prop="item.key"
        >
          <el-select
            v-if="item.type === 'multiSelect'"
            v-model="pushForm.validate[item.key]"
            multiple
            collapse-tags
            style="width: 260px"
            placeholder
          >
            <el-option
              v-for="i in pushForm.validate[item.key].options"
              :key="i.value"
              :label="i.label"
              :value="i.value"
            ></el-option>
          </el-select>
          <el-button
            v-if="item.type === 'multiSelect'"
            @click="setTrigger(item.key)"
            style="width: 40px"
            icon="el-icon-more"
          ></el-button>
          <el-input
            style="width: 300px"
            v-else-if="item.type === 'text'"
            v-model="pushForm.validate[item.key]"
          ></el-input>
          <el-input
            disabled
            style="width: 300px"
            v-else-if="item.type === 'disabled'"
            v-model="pushForm.validate[item.key]"
          ></el-input>
          <el-input
            style="width: 300px"
            v-else-if="item.type === 'dialogTable-edit'"
            v-model="pushForm.validate[item.key]"
          >
            <el-button
              @click="setTrigger(item.key)"
              style="width: 40px"
              icon="el-icon-more"
              slot="append"
            ></el-button>
          </el-input>
          <el-date-picker
            v-else-if="item.type === 'dateTime'"
            v-model="pushForm.validate[item.key]"
            type="datetime"
            style="width: 300px"
            placeholder
          ></el-date-picker>
          <el-input
            v-else-if="item.type === 'textarea'"
            style="width: 300px"
            type="textarea"
            maxlength="200"
            show-word-limit
            v-model="pushForm.validate[item.key]"
          ></el-input>
          <div v-else-if="item.type == 'upload'" style="display: flex">
            <input style="display: none" v-model="placeholder"/>
            <el-upload :http-request="uploadFunc" :show-file-list="false" :drag="false" action>
              <el-button size="small">点击上传</el-button>
            </el-upload>
            <span style="margin-left: 8px">{{pushForm.validate.file}}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="pushFormCancel">取 消</el-button>
        <el-button type="primary" :loading="buttonLoading" size="small" @click="pushFormConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    tableColumn,
    pickerOptions,
    tableColumnTraditional,
    fetchTable,
  } from "./public";
  import {uploadFile, downloadFile} from "@/api/publicApis";
  import group from "@/components/diaForm/addOrEditGroup";
  import {
    getGroupList,
    delGroup,
    getGroupDetail,
  } from "@/api/factoryModel/group";
  import {
    addOne,
    updateOne,
    batchDel,
    batchAudit,
    batchAntiAudit,
  } from "@/api/DNC/programControl";
  import IdTree from "@/components/id-tree/index";
  import {configAll} from "@/components/id-tree/idTreeConfig";

  export default {
    name: "program_control",
    components: {IdTree, group},
    mixins: [],
    props: {},
    data() {
      return {
        placeholder: "123",
        tableDialog: {
          title: "",
          width: "1000px",
          v: false,
          trigger: "",
          searchInput: "",
          searchSelected: "",
          tableColumn: [],
          tableData: [],
          tableSelected: "",
          currentPage: 1,
          pageSize: 10,
          total: 0,
          pageCount: 0,
          tableLoading: false,
          confirmDisabled: true,
          searchTrigger: false,
          hasMultiSelection: false,
        },
        buttonLoading: false,
        pushForm: {
          // （execPersonList）
          chargePersonList: [],
          execSubmitParam: [],
          equipmentList: [],
          equipmentSubmitParam: [],
          column: [
            {
              title: "文档名称",
              key: "name",
              width: "250",
              type: "dialogTable-edit",
            },
            {
              title: "版本号",
              key: "version",
              width: "250",
              type: "text",
            },
            {
              title: "程序文件",
              key: "file",
              width: "250",
              type: "upload",
            },
            {
              title: "备注信息",
              key: "mark",
              width: "250",
              type: "textarea",
            },
          ],
          validate: {
            name: "",
            version: "",
            mark: "",
            file: "",
          },
          rules: {
            name: [{required: true, message: "此项不能为空", trigger: "blur"}],
            version: [
              {required: true, message: "此项不能为空", trigger: "blur"},
            ],
            file: [
              {required: true, message: "此项不能为空", trigger: "blur"},
              {
                validator: (rule, value, callback) => {
                  this.validateUpload(rule, value, callback);
                },
                trigger: ["blur"],
              },
            ],
          },
          rawFile: "",
        },
        pushDialog: {v: false, title: "上传程序文件", trigger: ""},
        pushRow: {},

        orgId: this.$store.state.user.userInfo.orgId,
        column: [],
        table: {
          data: [],
          loading: false,
          selectRows: [],
        },
        page: {
          current: 1,
          total: 0,
          size: 10,
          sizes: [5, 10, 50, 100],
        },
        search: {
          select: "",
          input: "",
          pickerOptions: [],
        },

        //树形列表相关
        //分组列表弹窗----------------------
        groupObj: {
          show: false,
          title: "编辑企业账号",
          data: {},
        },
        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configAll, //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据
        containerInfosData: {}, //树形目录当前选中数据
      };
    },
    computed: {},
    watch: {
      "search.select"() {
        this.search.input = "";
      },
    },
    created() {
    },
    mounted() {
      this.column = tableColumn;
      this.search.select = this.column[0].desc;
      this.pickerOptions = pickerOptions;
    },
    activated() {
      this.findGroupListFunc();
    },
    beforeDestroy() {
    },
    methods: {
      validateUpload(rule, code, callback) {
        if (this.pushForm.validate.file === "") {
          callback(new Error("请上传文件"));
        }
        callback();
      },
      async uploadFunc(ev) {
        this.pushForm.rawFile = ev.file;
        this.pushForm.validate.file = ev.file.name;
      },
      // start
      setTrigger(key) {
        this.tableDialog.trigger = key;
        this.tableDialog.v = true;
      },
      pushFormCancel() {
        this.pushDialog.v = false;
      },
      clearPushForm() {
        this.pushForm.validate = {
          name: "",
          version: "",
          mark: "",
          file: "",
        };
      },
      pushFormConfirm() {
        this.$refs.pushForm.validate(async (valid) => {
          if (valid) {
            this.buttonLoading = true;
            try {
              let res = "";
              if (this.pushForm.rawFile !== "") {
                res = await Promise.resolve(uploadFile(this.pushForm.rawFile));
              } else {
                res = {
                  data: {
                    code: 200,
                    data: {
                      id: undefined,
                    },
                  },
                };
              }
              console.log(res);

              if (res.data.code === 200) {
                let r = "";
                let param = {
                  ...this.pushForm.validate,
                  groupId: this.containerInfosData.id,
                  orgId: this.orgId,
                };
                if (res.data.data.id !== undefined)
                  param.fdfsId = res.data.data.id;

                switch (this.pushDialog.trigger) {
                  case "upload":
                    r = await Promise.resolve(addOne(param));
                    break;
                  case "edit":
                    r = await Promise.resolve(updateOne(param));
                    break;
                  case "newVersion":
                    r = await Promise.resolve(addOne(param));
                    break;
                  default:
                    break;
                }
                if (r.data.code == 200) {
                  this.$Notice.success({
                    title: "成功",
                    message: r.data.msg,
                  });
                  this.getTableData();
                  this.pushDialog.v = false;
                } else {
                  this.$notify({
                    title: "错误",
                    message: r.data.msg,
                    type: "warning",
                  });
                }
              } else {
                this.$notify({
                  title: "错误",
                  message: "上传失败",
                  type: "warning",
                });
              }
            } catch (e) {
              console.log(e);
            } finally {
              this.pushForm.rawFile = "";
              this.buttonLoading = false;
            }
          }
        });
      },
      async tableDialogOpen() {
        try {
          let res = "";
          let param = {
            orgId: this.orgId,
            current_page: this.tableDialog.currentPage,
            page_size: this.tableDialog.pageSize,
          };
          if (this.tableDialog.searchInput !== "") {
            param[this.tableDialog.searchSelected] = this.tableDialog.searchInput;
          }
          this.tableDialog.tableLoading = true;
          switch (this.tableDialog.trigger) {
            // 负责人
            case "name":
              this.tableDialog.confirmDisabled = true;
              this.tableDialog.hasMultiSelection = false;
              this.tableDialog.tableColumn = tableColumnTraditional;
              if (!this.tableDialog.searchTrigger) {
                this.tableDialog.searchSelected = this.tableDialog.tableColumn[0].key;
              } else {
                this.tableDialog.searchTrigger = false;
              }
              res = await Promise.resolve(fetchTable(param));
              this.tableDialog.total = res.data.data.total;
              this.tableDialog.pageCount = res.data.data.pages;
              this.tableDialog.tableData = res.data.data.records;
              break;
            // 执行人
            case "chargePersonNameList":
              this.tableDialog.hasMultiSelection = true;
              this.tableDialog.confirmDisabled = false;
              this.tableDialog.tableColumn = [
                {
                  title: '员工代码',
                  key: 'number',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '员工名称',
                  key: 'name',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '员工属性',
                  key: 'type',
                  width: '250',
                  type: 'select',
                  selectOptions: [
                    {
                      value: '0',
                      label: '在职'
                    },
                    {
                      value: '1',
                      label: '试用'
                    },
                    {
                      value: '2',
                      label: '实习'
                    },
                    {
                      value: '3',
                      label: '退休'
                    },
                    {
                      value: '4',
                      label: '离职'
                    },
                    {
                      value: '5',
                      label: '离休'
                    },
                  ],
                  render: (h, params) => {
                    const selectionArray = [
                      {
                        value: '0',
                        label: '在职'
                      },
                      {
                        value: '1',
                        label: '试用'
                      },
                      {
                        value: '2',
                        label: '实习'
                      },
                      {
                        value: '3',
                        label: '退休'
                      },
                      {
                        value: '4',
                        label: '离职'
                      },
                      {
                        value: '5',
                        label: '离休'
                      },
                    ]
                    // 根据设置的选项集合，生成对应的下拉选项
                    let optionArray = []
                    selectionArray.map(item => {
                      optionArray.push(h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label
                        },
                        style: {
                          width: '80px',
                        }
                      }))
                    })

                    return h('Select', {
                      props: {
                        disabled: false,
                        size: 'small',
                        placeholder: '',
                        value: String(params.row['type'])
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      }
                    }, optionArray)
                  }
                },
                {
                  title: '所属部门代码',
                  key: 'departmentNumber',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '所属部门名称',
                  key: 'departmentName',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '所属班组代码',
                  key: 'teamNumber',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '所属班组名称',
                  key: 'teamName',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '公司邮箱',
                  key: 'email',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '家庭地址',
                  key: 'address',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '联系电话',
                  key: 'phone',
                  width: '250',
                  type: 'text',
                },
                {
                  title: '备注',
                  key: 'note',
                  width: '320',
                  type: 'text',
                },
                {
                  title: '制单人代码',
                  key: 'docMakerNumber',
                  width: '120',
                  type: 'text',
                },
                {
                  title: '制单人姓名',
                  key: 'docMakerName',
                  width: '120',
                  type: 'text',
                },
                {
                  title: '创建时间',
                  key: 'createTime',
                  width: '220',
                  type: 'datetime'
                },
                {
                  title: '审核状态',
                  key: 'auditStatus',
                  width: '120',
                  type: 'select',
                  selectOptions: [
                    {
                      value: '0',
                      label: '未审核'
                    },
                    {
                      value: '1',
                      label: '审核'
                    }
                  ],
                  render: (h, params) => {
                    const selectionArray = [
                      {
                        value: '0',
                        label: '未审核'
                      },
                      {
                        value: '1',
                        label: '审核'
                      }
                    ]
                    // 根据设置的选项集合，生成对应的下拉选项
                    let optionArray = []
                    selectionArray.map(item => {
                      optionArray.push(h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label
                        },
                        style: {
                          width: '80px',
                        }
                      }))
                    })

                    return h('Select', {
                      props: {
                        disabled: false,
                        size: 'small',
                        placeholder: '',
                        value: String(params.row['auditStatus'])
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      }
                    }, optionArray)
                  }
                },
                {
                  title: '审核人代码',
                  key: 'auditPersonNumber',
                  width: '120',
                  type: 'text',
                },
                {
                  title: '审核人姓名',
                  key: 'auditPersonName',
                  width: '120',
                  type: 'text',
                },
                {
                  title: '审核时间',
                  key: 'auditTime',
                  width: '120',
                  type: 'datetime'
                },
                {
                  title: '禁用状态',
                  key: 'isDisable',
                  width: '120',
                  type: 'select',
                  selectOptions: [
                    {
                      value: 'false',
                      label: '未禁用'
                    },
                    {
                      value: 'true',
                      label: '禁用'
                    }
                  ],
                  render: (h, params) => {
                    const selectionArray = [
                      {
                        value: 'false',
                        label: '未禁用'
                      },
                      {
                        value: 'true',
                        label: '禁用'
                      }
                    ]
                    // 根据设置的选项集合，生成对应的下拉选项
                    let optionArray = []
                    selectionArray.map(item => {
                      optionArray.push(h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label
                        },
                        style: {
                          width: '80px',
                        }
                      }))
                    })
                    return h('Select', {
                      props: {
                        disabled: false,
                        size: 'small',
                        value: String(params.row['isDisable'])
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      }
                    }, optionArray)
                  }
                },
                {
                  title: '禁用人代码',
                  key: 'disablePersonNumber',
                  width: '120',
                  type: 'text',
                },
                {
                  title: '禁用人姓名',
                  key: 'disablePersonName',
                  width: '120',
                  type: 'text',
                },
                {
                  title: '禁用时间',
                  key: 'disableTime',
                  width: '220',
                  type: 'datetime'
                },
                {
                  title: '更新时间',
                  key: 'updateTime',
                  width: '220',
                  type: 'datetime'
                },
              ];
              if (!this.tableDialog.searchTrigger) {
                this.tableDialog.searchSelected = this.tableDialog.tableColumn[0].key;
              } else {
                this.tableDialog.searchTrigger = false;
              }
              res = await Promise.resolve(getWorkerList(param));
              this.tableDialog.total = res.data.data.total;
              this.tableDialog.pageCount = res.data.data.pages;
              this.tableDialog.tableData = res.data.data.records;
              this.$nextTick(() => {
                this.pushForm.chargePersonList[
                this.tableDialog.currentPage - 1
                  ].forEach((i) => {
                  this.tableDialog.tableData.forEach((k) => {
                    if (i.id === k.id) {
                      this.$refs.dialogTable.toggleRowSelection(k, true);
                    }
                  });
                });
              });
              break;
            default:
              break;
          }
          this.tableDialog.tableLoading = false;
        } catch (e) {
          console.log(e);
        }
      },
      tableDialogClose() {
        this.tableDialog.currentPage = 1;
        this.tableDialog.confirmDisabled = true;
      },
      handleTableDialogSearch() {
        this.tableDialog.searchTrigger = true;
        this.tableDialog.currentPage = 1;
        this.tableDialogOpen();
      },
      handleCurrentChange(val) {
        this.tableDialog.tableSelected = val;
        this.tableDialog.confirmDisabled = false;
      },
      handleFormMulti() {
        switch (this.tableDialog.trigger) {
          // 负责人
          // 执行人
          case "chargePersonNameList":
            let arr1 = [];
            this.pushForm.chargePersonList.forEach((i) => {
              i.forEach((k) => {
                arr1.push(k.name);
                // 生成提交用数据格式
                this.pushForm.execSubmitParam.push({
                  personId: k.id,
                  personNumber: k.number,
                  personName: k.name,
                  orgId: this.orgId,
                });
              });
            });
            this.pushForm.validate.chargePersonNameList = arr1.join(",");

            break;
          // 设备
          case "equipmentNameList":
            let arr2 = [];
            this.pushForm.equipmentList.forEach((i) => {
              i.forEach((k) => {
                arr2.push(k.name);
                this.pushForm.equipmentSubmitParam.push({
                  deviceId: k.id,
                  deviceNumber: k.number,
                  deviceName: k.name,
                  orgId: this.orgId,
                });
              });
            });
            this.pushForm.validate.equipmentNameList = arr2.join(",");

            break;
          default:
            break;
        }
        this.handleTableDialogCancel();
      },
      handleFormTableDbClick() {
        const item = this.tableDialog.tableSelected;
        switch (this.tableDialog.trigger) {
          case "name":
            this.pushForm.validate.name = item.name;
            this.handleTableDialogCancel();
            break;
          default:
            break;
        }
      },
      handleSelectAll(val) {
        switch (this.tableDialog.trigger) {
          case "chargePersonNameList":
            this.pushForm.chargePersonList[
            this.tableDialog.currentPage - 1
              ] = val;
            break;
          case "equipmentNameList":
            this.pushForm.equipmentList[this.tableDialog.currentPage - 1] = val;
            break;
          default:
            break;
        }
      },
      handleSelect(val) {
        switch (this.tableDialog.trigger) {
          case "chargePersonNameList":
            this.pushForm.chargePersonList[
            this.tableDialog.currentPage - 1
              ] = val;
            break;
          case "equipmentNameList":
            this.pushForm.equipmentList[this.tableDialog.currentPage - 1] = val;
            break;
          default:
            break;
        }
      },
      handleRowDbClick(row) {
        if (row.auditStatus !== 1) this.handleEdit(row);
        else this.handleAddVersion(row);
      },
      handleSelectionChange(val) {
      },
      handleTableDialogPageChange(val) {
        this.tableDialog.currentPage = val;
        this.tableDialogOpen();
      },
      handleTableDialogConfirm() {
        if (this.tableDialog.trigger === "name") {
          this.handleFormTableDbClick();
        } else {
          this.handleFormMulti();
        }
      },
      handleTableDialogCancel() {
        this.tableDialog.v = false;
        this.tableDialogClose();
      },

      // end
      handleEdit(row) {
        this.clearPushForm();
        this.pushDialog.v = true;
        this.pushDialog.trigger = "edit";
        this.pushDialog.title = "编辑程序文件";
        this.pushForm.column[0].type = "disabled";
        this.pushForm.validate = {...row};
        this.pushForm.validate.file = row.fafsName;
      },
      handleDelete(row) {
        this.$confirm("确认删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(async () => {
            try {
              let param = [row.id];
              let res = await Promise.resolve(batchDel(param));
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  type: "success",
                  message: res.data.msg,
                });
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.data.msg,
                });
              }
            } catch (e) {
              console.log(e);
            } finally {
              this.getTableData();
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      handleAddVersion(row) {
        this.clearPushForm();
        this.pushDialog.v = true;
        this.pushDialog.trigger = "newVersion";
        this.pushDialog.title = "新增版本";
        this.pushForm.column[0].type = "disabled";
        this.pushForm.validate.name = row.name;
      },
      handleTableSelect(selection) {
        this.table.selectRows = selection;
      },
      handleTableSelectAll(selection) {
        this.handleTableSelect(selection);
      },
      handleClickUpload() {
        this.clearPushForm();
        this.pushDialog.v = true;
        this.pushDialog.title = "上传程序文件";
        this.pushDialog.trigger = "upload";
        this.pushForm.column[0].type = "dialogTable-edit";
      },
      handleClickDownload() {
        if (this.table.selectRows.length == 0) {
          this.$message({
            message: "请至少选择一条下载",
            type: "warning",
          });
        } else {
          this.table.selectRows.forEach(async (i) => {
            let res = await Promise.resolve(downloadFile(i.fdfsAddress));
            if (res.data) {
              const filename = i.fafsName;
              let blob = new Blob([res.data], {
                type: res.data.type,
              });
              if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrBlob(blob, filename);
              } else {
                let link = document.createElement("a");
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                var evt = document.createEvent("MouseEvents");
                evt.initEvent("click", false, false);
                link.dispatchEvent(evt);
                document.body.removeChild(link);
              }
            }
          });
        }
      },
      // 表头编辑点击事件
      handleMultiEditClick() {
        if (this.table.selectRows.length === 0) {
          this.$message({
            message: "请选择一条数据进行编辑",
            type: "warning",
          });
        } else if (this.table.selectRows.length > 1) {
          this.$message({
            message: "只能选择一条数据进行编辑",
            type: "warning",
          });
        } else {
          if (this.table.selectRows[0].auditStatus == 0)
            this.handleEdit(this.table.selectRows[0]);
          else {
            this.$message({
              message: "已审核无法编辑",
              type: "warning",
            });
          }
        }
      },
      // 表头删除点击事件
      handleMultiDelClick() {
        if (this.table.selectRows.length == 0) {
          this.$message({
            message: "请至少选择一条数据进行批量删除",
            type: "warning",
          });
        } else {
          this.$confirm("确认删除吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              try {
                let param = [];
                this.table.selectRows.forEach((i) => {
                  param.push(i.id);
                });
                let res = await Promise.resolve(batchDel(param));
                if (res.data.code == 200) {
                  this.$notify({
                    title: "成功",
                    type: "success",
                    message: res.data.msg,
                  });
                } else {
                  this.$notify.error({
                    title: "错误",
                    message: res.data.msg,
                  });
                }
              } catch (e) {
                console.log(e);
              } finally {
                this.getTableData();
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      },
      // 审核
      async handleAuditClick() {
        if (this.table.selectRows.length === 0) {
          this.$message({
            message: "请至少选择一条数据进行审核",
            type: "warning",
          });
        } else {
          try {
            let param = [];
            this.table.selectRows.forEach((i) => {
              param.push(i.id);
            });
            let res = await Promise.resolve(batchAudit(param));
            if (res.data.code == 200) {
              this.$notify({
                title: "成功",
                type: "success",
                message: res.data.msg,
              });
            } else {
              this.$notify.error({
                title: "错误",
                message: res.data.msg,
              });
            }
          } catch (e) {
            console.log(e);
          } finally {
            this.getTableData();
          }
        }
      },
      // 反审核
      async handleAntiAuditClick() {
        if (this.table.selectRows.length == 0) {
          this.$message({
            message: "请至少选择一条数据进行反审核",
            type: "warning",
          });
        } else {
          try {
            let param = [];
            this.table.selectRows.forEach((i) => {
              param.push(i.id);
            });
            let res = await Promise.resolve(batchAntiAudit(param));
            if (res.data.code == 200) {
              this.$notify({
                title: "成功",
                type: "success",
                message: res.data.msg,
              });
            } else {
              this.$notify.error({
                title: "错误",
                message: res.data.msg,
              });
            }
          } catch (e) {
            console.log(e);
          } finally {
            this.getTableData();
          }
        }
      },
      // 点击搜索事件
      clickSearch() {
        this.page.current = 1;
        this.getTableData();
      },
      // 初始化数据
      async initData() {
        try {
          let param = {
            current_page: 1,
            page_size: this.page.size,
            orgId: this.orgId,
          };
          if (this.containerInfosData.id !== undefined)
            param.groupId = this.containerInfosData.id;
          this.table.loading = true;
          let res = await Promise.resolve(fetchTable(param));
          if (res.data.code === 200) {
            this.table.data = res.data.data.records;
            this.page.total = res.data.data.total;
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.table.loading = false;
        }
      },
      async getTableData() {
        try {
          let param = {
            current_page: this.page.current,
            page_size: this.page.size,
            orgId: this.orgId,
          };
          if (this.containerInfosData.id !== undefined)
            param.groupId = this.containerInfosData.id;
          if (this.search.input !== null && this.search.input !== "") {
            if (this.search.select.type === "dateTime") {
              param[`${this.search.select.key}Start`] = this.search.input[0];
              param[`${this.search.select.key}End`] = this.search.input[1];
            } else {
              param[this.search.select.key] = this.search.input;
            }
          }
          this.table.loading = true;
          let res = await Promise.resolve(fetchTable(param));
          if (res.data.code === 200) {
            this.table.data = res.data.data.records;
            this.page.total = res.data.data.total;
          }
        } catch (e) {
          console.log(e);
        } finally {
          this.table.loading = false;
        }
      },
      pageChange(val) {
        this.page.current = val;
        this.getTableData();
      },
      sizeChange(val) {
        this.page.current = 1;
        this.page.size = val;
        this.getTableData();
      },

      /* 修改 节点 */
      editNodeFunc() {
        if (!this.containerInfosData.id) {
          this.$notify({
            title: "警告",
            message: "请选择你要编辑的节点！",
            type: "warning",
          });
          return;
        }
        this.groupObj.title = "修改分组";
        getGroupDetail(this.containerInfosData.id).then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            // console.log(res.data.data)
            this.groupObj.data = res.data.data;
            this.groupObj.show = true;
          } else {
            // 操作成功回调
            this.$notify({
              title: "获取节点数据失败",
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
              type: "error",
            });
          }
        });
      },
      /* 添加 节点 */
      addNodeFunc() {
        if (this.containerInfosData.id >= 0) {
          this.groupObj.title = "添加子分组";
          this.groupObj.data = {};
          this.groupObj.data.pid = this.containerInfosData.id;
          this.groupObj.data.orgId = this.$store.state.user.userInfo.orgId;
          this.groupObj.data.type = 23;
          this.groupObj.editOrgAuthority = true;
          this.groupObj.show = true;
        } else {
          this.$notify({
            title: "警告",
            message: "无法添加根分组！",
            type: "warning",
          });
        }
      },
      /* 删除 节点 */
      delNodeFunc() {
        if (this.containerInfosData.id === undefined) {
          return;
        }
        if (this.containerInfosData.id <= 0) {
          this.$notify({
            title: "警告",
            message: "无法删除根分组！",
            type: "warning",
          });
          return;
        }
        this.$confirm(
          "此操作将永久删除所选分组(只能删除【最底层分组】并且【节点下无基础资料】的分组), 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            delGroup({
              id: this.containerInfosData.id,
              orgId: this.$store.state.user.userInfo.orgId,
              type: 23,
            }).then((res) => {
              if (res.status === 200 && res.data.code === 200) {
                this.$Notice.success({
                  title: "删除成功",
                });
                // this.containerInfosData = {}
                this.findGroupListFunc();
              } else {
                // 操作成功回调
                this.$notify({
                  title: "操作失败",
                  dangerouslyUseHTMLString: true,
                  message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
                  type: "error",
                });
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        await getGroupList(23, {
          orgId: this.$store.state.user.userInfo.orgId,
        }).then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            // 生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true,
            };
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, "id");
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, "pid");
            this.treeData = this.$utils.toTreeDataFunc(data);
          } else {
            // 操作成功回调
            this.$notifyError("获取树形列表失败",res.data.msg);
          }
        }).finally(() => {
          if (this.treeData.length > 0) {
            this.$nextTick(() => {
              let isFirstSelect = false;
              if (this.containerInfosData.id !== undefined) {
                const nodeAll = document.querySelectorAll(".node-unselected");
                let that = this;
                [].forEach.call(nodeAll, function (div) {
                  if (
                    div.firstElementChild.title === that.containerInfosData.name
                  ) {
                    div.click();
                    isFirstSelect = true;
                  }
                });
              }
              if (!isFirstSelect) {
                if (document.querySelector(".el-tree-node__content") !== null)
                  document.querySelector(".el-tree-node__content").click();
              }
            });
          }
        });
      },
      //点击目录节点事件
      nodeSelectFunc(data, node, vcom) {
        // 再次点击相同 node 取消选中
        if (this.treeSelectData === data) {
          this.highlightCurrent = false;
          this.treeSelectData = {};
          this.containerInfosData = {};
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          this.initData();
        }
      },
      setTableRowStyle() {
        return "background: #F8F8F9; color:#606266";
      },
    },
  };
</script>

<style lang="less" scoped>
  @import "../tableHeadStyle.less";
  @import "../style.less";

  .option-button {
    margin-left: 0.2rem;
  }

  ::v-deep {
    .el-icon-more {
      position: relative;
      right: 7px;
    }

    .strangeDialog {
      .el-form-item__error {
        left: 100px !important;
      }
    }

    .ivu-select-small.ivu-select-single
    .ivu-select-selection
    .ivu-select-placeholder,
    .ivu-select-small.ivu-select-single
    .ivu-select-selection
    .ivu-select-selected-value {
      height: 22px;
      line-height: 28px;
    }
  }

  .pagination-style {
    display: flex;
    justify-content: center;
    margin-top: 5px;
  }

  .table-search-wrapper {
    display: flex;

    .search-select-style {
      width: 140px;
    }

    .search-input-style {
      width: 200px;
      margin: 0 2px;
    }

    .search-btn-style {
      width: 32px;
      height: 32px;

      ::v-deep {
        .el-icon-search {
          position: relative;
          right: 4px;
          bottom: 3px;
        }
      }
    }
  }
</style>

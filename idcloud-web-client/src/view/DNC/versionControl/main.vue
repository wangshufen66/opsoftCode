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
    ></id-tree>
    <div style="margin-left: 10px;flex-grow: 1;width: 0">
      <div class="table-header-wrapper">
        <div class="table-header-left-wrapper">
          <div class="option-button-container">
            <div
              @click="handleClickRefresh"
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
          border
        >
          <el-table-column align="center" type="index" width="45"></el-table-column>
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
          <el-table-column fixed="right" header-align="center" label="操作" width="110">
            <template slot-scope="scope">
              <div class="inside-style" style="display: flex; justify-content: center;">
                <el-button
                  plain
                  size="small"
                  type="primary"
                  @click="handleChangeVersion( scope.row)"
                >切换版本
                </el-button>
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
          :loading="buttonLoading"
          :disabled="tableDialog.confirmDisabled"
          type="primary"
          @click="handleTableDialogConfirm"
        >确 定
        </el-button>
      </div>
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
  import {
    getGroupList,
  } from "@/api/factoryModel/group";
  import {changeVersion} from "@/api/DNC/versionControl";
  import IdTree from "@/components/id-tree/index";
  import {configBase} from "@/components/id-tree/idTreeConfig";

  export default {
    name: "version_control",
    components: {IdTree},
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
          triggerRow: "",
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
        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configBase, //树形操作栏配置
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
      handleClickRefresh() {
        this.findGroupListFunc();
      },
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
      async tableDialogOpen() {
        try {
          let res = "";
          let param = {
            orgId: this.orgId,
            current_page: this.tableDialog.currentPage,
            page_size: this.tableDialog.pageSize,
            programName: this.tableDialog.triggerRow.name,
          };
          if (this.tableDialog.searchInput !== "") {
            param[this.tableDialog.searchSelected] = this.tableDialog.searchInput;
          }
          this.tableDialog.tableLoading = true;
          switch (this.tableDialog.trigger) {
            // 负责人
            case "switchVersion":
              this.tableDialog.confirmDisabled = true;
              this.tableDialog.hasMultiSelection = false;
              this.tableDialog.tableColumn = tableColumnTraditional;
              this.tableDialog.title = "切换版本信息";
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
      async handleFormTableDbClick() {
        const item = this.tableDialog.tableSelected;
        switch (this.tableDialog.trigger) {
          case "switchVersion":
            try {
              const param = {
                orgId: this.orgId,
                name: item.name,
                id: item.id,
              };
              this.buttonLoading = true;
              let res = await Promise.resolve(changeVersion(param));
              this.buttonLoading = false;
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  type: "success",
                  message: res.data.msg,
                });
                this.getTableData(true);
              } else {
                this.$notify.error({
                  title: "错误",
                  message: res.data.msg,
                });
              }
            } catch (e) {
              console.log(e);
            }
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

      handleChangeVersion(row) {
        this.tableDialog.triggerRow = row;
        this.setTrigger("switchVersion");
      },
      // 点击搜索事件
      clickSearch() {
        this.page.current = 1;
        this.getTableData(true);
      },
      // 初始化数据
      async initData() {
        try {
          let param = {
            current_page: 1,
            page_size: this.page.size,
            orgId: this.orgId,
            isDefault: 1,
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
      async getTableData(isDefault) {
        try {
          let param = {
            current_page: this.page.current,
            page_size: this.page.size,
            orgId: this.orgId,
          };
          if (isDefault) {
            param.isDefault = 1;
          }
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
        this.getTableData(true);
      },
      sizeChange(val) {
        this.page.current = 1;
        this.page.size = val;
        this.getTableData(true);
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        await getGroupList(23, {orgId: this.$store.state.user.userInfo.orgId,}).then((res) => {
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
            if (this.treeData.length > 0)  {
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

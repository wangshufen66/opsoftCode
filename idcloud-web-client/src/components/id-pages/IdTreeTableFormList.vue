<template>
  <div>
    <el-tabs v-model="elTabs.vModel" v-bind="elTabs" :before-leave="beforeLeave" @tab-remove="tabRemove">
      <!-- 左面列表 -->
      <el-tab-pane :class="$style.treeTable" :label="tableErrTip + '列表'" name="table">
        <id-tree v-if="isTree" class="main-tree" ref="idTree" v-loading="treeLoading" :treeData="treeData" :highlight-current="highlightCurrent" :idConfig="treeActionBar" @nodeClick="nodeSelectFunc" @treeAdd="treeAdd" @treeEdit="treeEdit" @treeDelete="treeDelete" v-bind="$attrs"></id-tree>
        <div :class="$style.containerMain">
          <div :class="$style.containerBar">
            <!-- 左侧添加修改删除按钮 -->
            <id-action-bar ref="idBar" :idConfig="actionBarConfig" @click="actionBarClick">
            </id-action-bar>
            <!-- 右侧搜索框组件 -->
            <id-query ref="idQuery" index="query" :default-value="searchColumn" :options="tableColumns" @query="queryData" v-bind="$attrs">
            </id-query>
          </div>
          <!-- 表格主体信息列表 -->
          <id-table :selection="false" v-loading="tableLoading" border :height="tableHeight - 20" :customAction="tableCustomAction" :columns="tableColumns" :table-data="tableData" @id-row-column-switch-refresh="handleQueryData" @selection-change="onSelectChange" @row-dblclick="editTableForm" v-bind="$attrs" v-on="$listeners">
            <template v-slot:action="{ row, column, index }">
              <slot name="moreAction" :row="row" :column="column" :index="index">
              </slot>
              <!--此处disabled留有疑问-->
              <el-button :disabled="!row.deleteable" type="danger" plain size="mini" @click="deleteTableForm(row)">删除
              </el-button>
            </template>
          </id-table>
          <!-- 分页 -->
          <div :class="$style.elPageCenter">
            <el-pagination :class="$style.elPagination" @size-change="sizeChange" @current-change="currentChange" v-bind="page" layout="total,  prev, pager, next, sizes, jumper">
            </el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!-- 右侧表单双击字段跳转 -->
      <el-tab-pane :class="$style.fadeInRight" class="el-pane-form" v-for="(elTabPane, index) in elTabPanes" :key="index" :label="tableErrTip + '表单'" closable v-bind="elTabPane">
        <!--如果是多个el-tab-pane    请记得修改这里的ref-->
        <!-- 按钮组合 -->
        <id-action-bar :class="$style.formBar" ref="idBarForm" :idConfig="actionBarFormConfig" @click="actionBarClick">
        </id-action-bar>
        <!-- 表单表头 -->
        <id-form ref="form" v-bind="tableDetailForm"> </id-form>
        <!-- 选项卡 -->
        <el-tabs class="form-list" v-show="tableDetailForm.idForm.data.id" v-model="listElTabs.vModel" v-bind="listElTabs">
          <!-- 表体内容 -->
          <el-tab-pane v-for="(page, index) in formList" :key="page.tableErrTip" :label="page.tableErrTip + '表体'" :name="page.tableErrTip">
            <id-action-bar :class="$style.formBar" :idConfig="page.actionBarConfig" @click="listBarClick($event, index)">
            </id-action-bar>
            <!-- 表体内容表格内数据 -->
            <id-table v-loading="listElTabs.pages[index].tableLoading" border :height="(tableHeight * 3) / 4" custom-action :columns="page.tableColumns" :table-data="listElTabs.pages[index].tableData" @selection-change="onListSelectChange($event, index)" @row-dblclick="listRowDoubleClick($event, index)" v-bind="page">
              <template v-slot:action="{ row, column, cIndex }">
                <slot :name="'formListAction' + index" :row="row" :column="column" :index="cIndex">
                </slot>
                <el-button :disabled="row.deleteable" type="danger" plain size="mini" @click="listDelRow(row, index)">删除
                </el-button>
              </template>
            </id-table>
            <!-- 对话框 -->
            <el-dialog :visible.sync="listElTabs.pages[index].show" @closed="listFormClose(page.tableErrTip, index)">
              <id-form :ref="page.tableErrTip" class="dia-form" :id-form="page.form" label-width="100px"></id-form>
              <div slot="title" class="diaTitle">
                <span class="diaTitleText">{{ page.tableErrTip }}</span>
              </div>
              <div slot="footer" class="diaFooter">
                <el-button @click="listFormClose(page.tableErrTip, index)">取消</el-button>
                <el-button type="primary" @click="listFormConfirm(page.tableErrTip, index)">确认</el-button>
              </div>
            </el-dialog>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>
    </el-tabs>
    <!-- 弹出的对话框 -->
    <id-dialog-form ref="treeGroup" :getDetail="getTreeDetail" :addDetail="addTreeDetail" :updateDetail="updateTreeDetail" v-bind="treeDetail" @submitSuccess="getTreeListFunc" @initDiaFormDetail="initDiaFormDetail">
    </id-dialog-form>
  </div>
</template>

<script>
import IdActionBar from '../id-action-bar/index';
import IdTable from '../id-table/IdTable';
import IdQuery from '../id-query';
import IdForm from '../id-form/index';
import resizeTableHeightMixins from '@/mixins/resizeTableHeightMixins';
import IdDialogForm from '../id-dialog-form/index';
import IdTree from '../id-tree/index';
import { groupModel } from '../id-dialog-form/groupModel';
//树相关api
import {
  getGroupList,
  delGroup,
  getGroupDetail,
  addGroup,
  updateGroup,
} from '@/api/factoryModel/group';

export default {
  name: 'IdTreeTableFormList',
  components: {
    IdActionBar,
    IdTable,
    IdQuery,
    IdForm,
    IdDialogForm,
    IdTree,
  },
  watch: {
    'tableDetailForm.idForm.data.id'(n) {
      //可能写在这里不合理  =》根据打开的界面ID 来让该行不可编辑
      this.tableData.forEach((rItem) => {
        rItem.deleteable = true;
        if (n) {
          if (n === rItem.id) rItem.deleteable = false;
        }
      });
    },
  },
  computed: {
    getTreeDetail() {
      return getGroupDetail;
    },
    addTreeDetail() {
      return addGroup;
    },
    updateTreeDetail() {
      return updateGroup;
    },
  },
  mixins: [resizeTableHeightMixins],
  data() {
    return {
      //el-tabs选项卡配置
      elTabs: {
        type: 'card',
        closable: false,
        vModel: 'table',
      },
      //标签页配置
      elTabPanes: [
        // {
        //   label: 'number',
        //   name: 'id',
        // }
      ],
      // 树形目录组件相关参数---------------------
      treeLoading: false,
      treeSelectData: {}, //树形目录当前选中数据
      // treeActionBar: configAll, //树形操作栏配置
      highlightCurrent: true, //选中是否高亮行
      treeData: [], //树形目录数据

      //分组弹窗配置
      treeDetail: {
        title: '编辑分组',
        dialogFormLabelWidth: '80px',
        dialogForm: groupModel,
      },

      //显示字段设置
      // dialogTableColumnsVisible: false,
      // dialogTableColumnsMember: [],
      // fieldColumns: [
      //   {
      //     tag: "el-table-column",
      //     label: "字段代码",
      //     prop: "key",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "字段名称",
      //     prop: "title",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "宽度",
      //     prop: "width",
      //     width: 120,
      //     showOverflowTooltip: true,
      //   },
      // ], //字段设置
      // fieldSelection: [], //已经选中的行
      //显示字段设置 可能需要重新优化参数

      //查询相关参数------------------------------
      searchColumn: '', //搜索条件
      filterData: {}, // 过滤查询的条件
      //表格相关参数options-----------------------
      tableLoading: false,

      allTableData: [], //全部数据（当前端自动分页时，所有数据都保存在此，根据这个数据获取分页数据）
      tableData: [], //表格数据
      tableSelectData: [], //表格当前选中数据
      //分页相关参数
      page: {
        background: true,
        pageSizes: [10, 20, 30, 50, 100],
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },
      //上下页特殊处理参数 当双击进入界面时（编辑） 才会触发 将当前列表页的ID写入（保证这个筛选条件下的数据）
      //关闭表单界面即清空这个数组
      //这个上下页只不过是个临时处理 后台实现不了翻页的需求（需要带入筛选的参数进行分页）
      tableIdList: [],

      //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
      pageQuest: false,

      listElTabs: {
        type: 'card',
        closable: false,
        vModel: '',
        pages: [], //根据formList推入数据
      },
    };
  },
  props: {
    treeActionBar: { type: Array },
    treeType: { type: Number },
    getGroupList: { type: Function, default: getGroupList },
    // getTreeList: {type: Function},
    // getTreeDetail: {type: Function},
    // addTreeDetail: {type: Function},
    // updateTreeDetail: {type: Function},
    // delTreeDetails: {type: Function},
    getTable: { type: Function, required: true },
    actionBarConfig: { type: Array, required: true },
    getTableDetail: { type: Function, required: true },
    deleteTableDetails: { type: Function },
    addTableDetail: { type: Function },
    updateTableDetail: { type: Function },
    tableColumns: { type: Array, required: true },
    tableCustomAction: { type: Boolean, default: true },
    actionBarFormConfig: { type: Array, required: true },
    tableDetailForm: { type: Object, required: true },
    formList: { type: Array, required: true }, //表体配置
    audit: { type: Function },
    antiAudit: { type: Function },
    disable: { type: Function },
    antiDisable: { type: Function },
    tableErrTip: { type: String, default: '' },
    isPage: { type: Boolean, default: false }, //是否前台自动分页
    isTree: { type: Boolean, default: true }, //是否有树
  },
  created() {
    const tIndex = this.tableColumns.findIndex((tItem) => tItem.comp);
    this.searchColumn = this.tableColumns[tIndex].prop; //设置idQuery的选择项的默认值

    this.listElTabs.vModel =
      this.formList.length > 0 ? this.formList[0].tableErrTip : ''; //设置listElTabs的默认值
    //设置listElTabs的数据
    for (let a = 0; a < this.formList.length; a++) {
      this.listElTabs.pages.push({
        tableData: [],
        tableLoading: false,
        tableSelectData: [],
        show: false,
      });
    }
  },
  mounted() {
    this.getTreeListFunc();
  },
  methods: {
    //切换当前界面
    beforeLeave(activeName, oldActiveName) {
      //强制关闭 弹窗组件的所有 提示
      if (oldActiveName === 'form') {
        this.$emit('beforeLeave');
      }
    },
    //点击 tab 移除按钮后触发  => 这里的handleQueryData(刷新界面)应该可以拿掉
    tabRemove() {
      this.elTabs.vModel = 'table';
      this.elTabPanes = [];
      this.tableIdList = [];
      this.$nextTick(() => {
        this.$emit('initTableDetail');
        this.handleQueryData(); //=》为了保持列表的数据是最新的
      });
    },
    //获取树形列表
    async getTreeListFunc() {
      if (this.isTree) {
        this.treeLoading = true;
        let params = {
          orgId: this.$store.state.user.userInfo.orgId,
        };
        this.$emit('beforeGetTreeList', params);
        await this.getGroupList(this.treeType, params)
          .then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              //根据层级来限定
              this.$emit('afterGetTreeList', res.data.data);
              //对于设备管理的树形目录的特别处理
              res.data.data = res.data.data.filter((item) =>
                item.ctrType ? item.ctrType !== 4 : true
              );
              // 生成树形图结构数据
              let data = {
                rawdata: res.data.data,
                children: [],
                parent: [],
                expand: true,
              };
              // data.children
              data.children = this.$utils.toTreeChildrenFunc(
                res.data.data,
                'id'
              );
              // data.parent
              data.parent = this.$utils.toTreeParentFunc(res.data.data, 'pid');
              this.treeData = this.$utils.toTreeDataFunc(data);
            } else {
              this.$notifyError(
                `获取${this.tableErrTip}分组列表失败`,
                res.data.msg
              );
            }
          })
          .catch(() => {
            this.$notifyError('网络请求失败!', '');
          })
          .finally(() => {
            this.treeLoading = false;
            //当前界面自动点击树的第一个分组或者已经选中的分组
            this.$nextTick(() => {
              let isFirstSelect = false;
              if (this.treeSelectData.id) {
                const nodeAll = document.querySelectorAll(
                  '.el-tree-node__label'
                );
                let that = this;
                [].forEach.call(nodeAll, function (div) {
                  if (div.innerText === that.treeSelectData.name) {
                    div.click();
                    isFirstSelect = true;
                  }
                });
              }
              if (!isFirstSelect) {
                if (document.querySelector('.el-tree-node__content'))
                  document.querySelector('.el-tree-node__content').click();
              }
            });
          });
      } else {
        this.getTableList();
      }
    },
    //点击目录节点事件
    nodeSelectFunc(data, node, vcom) {
      this.page.currentPage = 1;
      this.page.pageSize = this.page.pageSizes[0];
      if (this.treeSelectData !== data) {
        this.highlightCurrent = true;
        this.treeSelectData = data;
        this.handleQueryData();
      } else {
        this.highlightCurrent = false;
        this.treeSelectData = {};
        this.allTableData = [];
        this.tableData = [];
        this.tableSelectData = [];
      }
    },
    //树弹窗初始化
    initDiaFormDetail(row) {
      if (row) {
        this.treeDetail.dialogForm.data = row;
      } else {
        this.treeDetail.dialogForm.data = {
          id: '',
          pid: this.treeSelectData.id,
          type: this.treeType,
          number: '',
          name: '',
          note: '',
          orgId: this.$store.state.user.userInfo.orgId,
        };
      }
    },
    //树新增
    treeAdd() {
      if (this.treeSelectData.id >= 0) {
        if (this.tableErrTip === '计量单位' && this.treeSelectData.pid === 0) {
          this.$message.warning(
            '此处无法添加子分组！请在计量单位下增加子分组！'
          );
          return;
        }
        this.treeDetail.title = '添加子分组';
        this.initDiaFormDetail();
        this.$nextTick(() => {
          this.$refs.treeGroup.diaShow();
        });
      } else {
        this.$message.warning('无法添加根分组！');
      }
    },
    //树编辑
    treeEdit() {
      if (this.treeSelectData.id === undefined) {
        this.$message.warning('请选择分组！');
        return;
      }
      if (this.treeSelectData.id === 0) {
        this.$message.warning('无法编辑根分组！');
        return;
      }
      this.treeDetail.title = '编辑分组';
      this.$refs.treeGroup.diaOpenEdit(this.treeSelectData);
    },
    //树删除
    treeDelete() {
      if (this.treeSelectData.id === undefined) {
        return;
      }
      if (this.treeSelectData.id === -1) {
        this.$message.warning('无法删除根分组！');
        return;
      }
      this.$confirm(
        '此操作将永久删除所选分组(只能删除【最底层分组】并且【节点下无基础资料】的分组), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          await delGroup({
            id: this.treeSelectData.id,
            orgId: this.$store.state.user.userInfo.orgId,
            type: this.treeType,
          }).then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              this.$message.success('删除成功');
              this.getTreeListFunc();
            } else {
              // 操作成功回调
              this.$notifyError('删除失败', `原因：${res.data.msg}`);
            }
          });
        })
        .catch(() => {
          this.$message.info('已取消删除');
        });
    },
    //获取table数据
    async getTableList() {
      this.tableLoading = true;
      this.filterData.orgId = this.$store.state.user.userInfo.orgId;
      if (!this.isPage) {
        this.filterData.current_page = this.page.currentPage;
        this.filterData.page_size = this.page.pageSize;
      }
      this.filterData.groupId = this.treeSelectData.id;
      this.$emit('beforeGetTableList', this.filterData);
      await this.getTable(this.filterData)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            if (this.isPage) {
              this.$emit('afterGetTableNoPage', res.data.data.list);
              this.allTableData = res.data.data.list;
              this.tableData = this.allTableData.slice(0, this.page.pageSize);
              this.page.total = this.allTableData.length;
            } else {
              this.$emit('afterGetTablePage', res.data.data.records);
              //可能写在这里不合理  =》根据打开的界面ID 来让该行不可编辑
              res.data.data.records.forEach((rItem) => {
                rItem.deleteable = true;
                if (this.tableDetailForm.idForm.data.id) {
                  if (this.tableDetailForm.idForm.data.id === rItem.id)
                    rItem.deleteable = false;
                }
              });
              this.tableData = res.data.data.records;
              this.page.total = res.data.data.total;
            }
          } else {
            this.$notifyError(`获取${this.tableErrTip}列表失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        })
        .finally(() => {
          this.tableLoading = false;
          this.pageQuest = false;
          this.filterData = {};
          this.tableSelectData = [];
        });
    },
    //操作栏点击 (用了switch 性能较差  其实有更好的处理方式)
    actionBarClick(target, value) {
      switch (target) {
        case 'add':
          this.addTableForm();
          break;
        case 'delete':
          this.deleteTableForm();
          break;
        case 'fresh':
          this.getTreeListFunc();
          break;
        case 'showAll':
          this.handleQueryData();
          break;
        case 'audit':
          this.auditTableForm();
          break;
        case 'antiAudit':
          this.antiAuditTableForm();
          break;
        case 'disable':
          this.disableTableForm();
          break;
        case 'antiDisable':
          this.antiDisableTableForm();
          break;
        case 'form-commit':
          this.validationFormData();
          break;
        case 'form-create':
          this.addTableForm();
          break;
        case 'form-copy':
          this.copyTableForm();
          break;
        case 'form-audit':
          this.auditTableForm([{ id: this.tableDetailForm.idForm.data.id }], 1);
          break;
        case 'form-antiAudit':
          this.antiAuditTableForm(
            [{ id: this.tableDetailForm.idForm.data.id }],
            1
          );
          break;
        case 'form-disable':
          this.disableTableForm(
            [{ id: this.tableDetailForm.idForm.data.id }],
            1
          );
          break;
        case 'form-antiDisable':
          this.antiDisableTableForm(
            [{ id: this.tableDetailForm.idForm.data.id }],
            1
          );
          break;
        case 'form-delete':
          this.deleteTableForm({ id: this.tableDetailForm.idForm.data.id }, 1);
          break;
        case 'form-previous':
          this.handleFormChangeId('previous');
          break;
        case 'form-next':
          this.handleFormChangeId('next');
          break;
        default:
          this.$emit('actionBarClick', target, value, this.tableSelectData);
          break;
      }
    },
    //上下页处理
    handleFormChangeId(action) {
      if (this.tableIdList.length > 0) {
        const nowId = this.tableDetailForm.idForm.data.id;
        let nowIndex = this.tableIdList.findIndex((n) => n === nowId);
        if (action === 'previous') {
          if (nowIndex === 0) {
            this.$message.warning('已经是当前页第一张了！');
            return;
          }
          nowIndex -= 1;
        } else if (action === 'next') {
          if (nowIndex === this.tableIdList.length - 1) {
            this.$message.warning('已经是当前页最后一张了！');
            return;
          }
          nowIndex += 1;
        }
        this.editTableForm({ id: this.tableIdList[nowIndex] }, 1);
      } else {
        this.$message.warning('当前页只有这一张单据！');
      }
    },
    //处理idQuery组件出来的查询参数
    queryData(data) {
      for (let name in data) {
        if (data[name] instanceof Array) {
          this.filterData[name + 'Start'] = data[name][0];
          this.filterData[name + 'End'] = data[name][1];
        } else if (typeof data[name] === 'boolean') {
          this.filterData[name] = data[name] ? 1 : 0;
        } else {
          this.filterData[name] = data[name];
        }
      }
      if (!this.pageQuest) this.page.currentPage = 1;
      this.getTableList();
    },
    //当前页的数据数量改变时
    sizeChange(pageSize) {
      this.pageQuest = true;
      this.page.pageSize = pageSize;
      if (this.isPage) this.dataPage();
      else this.handleQueryData();
    },
    //当前页修改  当前页跳转到某一页（向前或者向后都行）
    currentChange(currentPage) {
      this.pageQuest = true;
      this.page.currentPage = currentPage;
      if (this.isPage) this.dataPage();
      else this.handleQueryData();
    },
    //前台自动分页
    dataPage() {
      this.tableData = this.allTableData.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      );
      this.pageQuest = false;
    },
    //处理idQuery中的数据
    handleQueryData() {
      if (this.$refs.idQuery.filterConditions.length === 0) {
        this.$refs.idQuery.queryClick('one');
      } else {
        this.$refs.idQuery.queryClick('more');
      }
    },
    //记录 当前选择的数据行
    onSelectChange(selection) {
      this.tableSelectData = selection;
    },
    // 提交前的验证数据
    validationFormData() {
      this.$refs['form'][0].$refs['idForm'].validate((valid) => {
        if (valid) {
          this.addOrUpdateForm();
        } else {
          this.$message.error('*为必填项');
        }
      });
    },
    // detail保存或者更新数据(提交到后台) =》更新列表以及表格
    async addOrUpdateForm() {
      let submit = null;
      if (!this.tableDetailForm.idForm.data.id) submit = this.addTableDetail;
      else submit = this.updateTableDetail;
      this.$emit('beforeSubmit', this.tableDetailForm.idForm.data);
      await submit(this.tableDetailForm.idForm.data).then((res) => {
        if (res.data.code === 200 && res.status === 200) {
          this.$message.success('提交成功!');
          this.handleQueryData();
          if (this.tableDetailForm.idForm.data.id)
            this.editTableForm({ id: this.tableDetailForm.idForm.data.id });
          else this.editTableForm({ id: res.data.data.id });
        } else {
          this.$notifyError('提交失败!', res.data.msg);
        }
      });
    },
    // 新增form
    addTableForm() {
      if (this.isTree) {
        if (this.treeSelectData.id === undefined) {
          this.$message.error('请选择你的分组！');
          return;
        }
        if (this.treeSelectData.id === 0 && this.tableErrTip === '计量单位') {
          this.$message.error('计量单位必须建立在子分组下');
          return;
        }
      }
      //进入该界面先清除上份数据的form提醒
      if (this.$refs['form']) {
        if (this.$refs['form'].length > 0)
          this.$refs['form'][0].$refs['idForm'].resetFields();
      }
      this.$emit('initTableDetail', undefined, this.treeSelectData);
      this.tableIdList = [];
      this.goTableForm();
    },
    // 拷贝form
    copyTableForm() {
      //这写的不合理（需要改进）
      this.$emit('initTableDetail', {
        ...this.tableDetailForm.idForm.data,
        id: '',
        number: '',
        name: '',
        createTime: '', //创建时间
        docMakerId: 0, //创建人id
        docMakerNumber: '', //制单人代码
        docMakerName: '', //制单人姓名
        auditStatus: '0', //审核状态
        auditPersonId: 0, //审核人id
        auditPersonNumber: '', //审核人代码
        auditPersonName: '', //审核人姓名
        auditTime: '', //审核时间
        isDisable: 'false', //禁用状态
        disablePersonId: 0, //禁用人id
        disablePersonNumber: '', //禁用人代码
        disablePersonName: '', //禁用人姓名
        disableTime: '', //禁用时间
        updateTime: '', //最后更新时间
      });
      this.goTableForm();
    },
    //跳转到表单界面
    goTableForm() {
      this.$nextTick(() => {
        if (this.elTabPanes.length === 0)
          this.elTabPanes.push({
            label: this.tableDetailForm.idForm.data.number
              ? this.tableDetailForm.idForm.data.number
              : '代码',
            name: 'form',
          });
        else
          this.elTabPanes[0].label = this.tableDetailForm.idForm.data.number
            ? this.tableDetailForm.idForm.data.number
            : '代码';
        this.elTabs.vModel = 'form';
      });
    },
    //修改/获取 节点  最新数据
    async editTableForm(row, flag) {
      //进入该界面先清除上份数据的form提醒 => 已经修改了fomr的验证机制 改为['blur', 'change']
      await this.getTableDetail(row.id)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            this.$emit('initTableDetail', res.data.data);
            if (this.formList.length > 0) {
              this.formList.forEach((fItem, index) => {
                //获取表体数据
                if (res.data.data.hasOwnProperty(fItem.fromList)) {
                  //此处会修改这一行的能否删除状态
                  res.data.data[fItem.fromList].forEach((dItem) => {
                    if (
                      res.data.data.hasOwnProperty('auditStatus') &&
                      res.data.data.hasOwnProperty('isDisable')
                    )
                      dItem.deleteable = !(
                        res.data.data.auditStatus === '0' &&
                        (res.data.data.isDisable === 'false' ||
                          res.data.data.isDisable === '0')
                      );
                  });
                  this.$emit(
                    'formListAlter',
                    fItem.fromList,
                    res.data.data[fItem.fromList],
                    index
                  );
                  this.listElTabs.pages[index].tableData =
                    res.data.data[fItem.fromList];
                  // ========================================================================
                  //当页面是设备加工物料表体时，删除按钮不禁用
                  if (
                    this.$route.path ===
                    '/production_management/equipment_process_task'
                  ) {
                    this.listElTabs.pages[index].tableData.map((item) => {
                      item.deleteable = false;
                      return item;
                    });
                  }

                  this.listElTabs.pages[index].tableSelectData = [];
                }
              });
            }
            if (flag !== 1) {
              this.tableIdList = [];
              this.tableData.forEach((tItem) => {
                if (this.tableIdList.findIndex((l) => l === tItem.id) < 0)
                  this.tableIdList.push(tItem.id);
              });
            }
          } else {
            this.$notifyError(`获取${this.tableErrTip}详情失败!`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        })
        .finally(() => {
          this.goTableForm();
        });
    },
    //删除table数据行
    async deleteTableForm(rows, flag) {
      let param = [];
      if (rows) {
        param = [{ id: rows.id }];
      } else {
        this.tableSelectData.forEach((tItem) => {
          param.push({ id: tItem.id });
        });
      }
      await this.deleteTableDetails(param)
        .then((res) => {
          if (res.data.code === 200 && res.status === 200) {
            this.$message.success('删除成功');
            this.handleQueryData();
            if (flag) this.tabRemove();
          } else {
            // 操作成功回调
            this.$notifyError('删除失败!', res.data.msg);
          }
        })
        .catch((response) => {
          this.$notifyError('删除失败', '异常信息：' + response);
        });
    },
    // 表头/表单 审核
    async auditTableForm(rows, flag) {
      let params = [];
      if (!rows) rows = this.tableSelectData;
      if (rows.length === 0) return;
      this.tableLoading = true;
      rows.forEach((item) => params.push({ id: item.id }));
      await this.audit(params)
        .then((response) => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success('审核成功');
            this.handleQueryData();
            if (flag) this.editTableForm(rows[0]);
          } else {
            this.$notifyError('审核失败', response.msg);
          }
        })
        .catch((response) => {
          this.$notifyError('审核失败', '异常信息：' + response);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 表头/表单 反审核
    async antiAuditTableForm(rows, flag) {
      let params = [];
      if (!rows) rows = this.tableSelectData;
      if (rows.length === 0) return;
      this.tableLoading = true;
      rows.forEach((item) => params.push({ id: item.id }));
      this.antiAudit(params)
        .then((response) => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success('反审核成功');
            this.handleQueryData();
            if (flag) this.editTableForm(rows[0]);
          } else {
            this.$notifyError('反审核失败', response.msg);
          }
        })
        .catch((response) => {
          this.$notifyError('反审核失败', '异常信息：' + response);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 表头/表单 禁用
    async disableTableForm(rows, flag) {
      let params = [];
      if (!rows) rows = this.tableSelectData;
      rows.forEach((item) => params.push({ id: item.id }));
      if (rows.length === 0) return;
      this.tableLoading = true;
      await this.disable(params)
        .then((response) => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success('禁用成功');
            this.handleQueryData();
            if (flag) this.editTableForm(rows[0]);
          } else {
            this.$notifyError('禁用失败', response.msg);
          }
        })
        .catch((response) => {
          this.$notifyError('禁用失败', '异常信息：' + response);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 表头/表单 反禁用
    async antiDisableTableForm(rows, flag) {
      let params = [];
      if (!rows) rows = this.tableSelectData;
      rows.forEach((item) => params.push({ id: item.id }));
      if (rows.length === 0) return;
      this.tableLoading = true;
      await this.antiDisable(params)
        .then((response) => {
          response = response.data;
          if (response.code === 200) {
            this.$message.success('反禁用成功');
            this.handleQueryData();
            if (flag) this.editTableForm(rows[0]);
          } else {
            this.$notifyError('反禁用失败', response.msg);
          }
        })
        .catch((response) => {
          this.$notifyError('反禁用失败', '异常信息：' + response);
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    // 列表选择
    onListSelectChange(selection, index) {
      this.listElTabs.pages[index].tableSelectData = selection;
    },
    // 编辑列表
    listRowDoubleClick(row, index) {
      this.$emit('initListDetail', index, { ...row }, this.listPageShow);
    },
    // 表体编辑栏
    listPageShow(index, show) {
      console.log(index);
      console.log(show);
      this.$nextTick(() => {
        this.listElTabs.pages[index].show = show;
      });
    },
    // 列表操作栏编辑
    listBarClick(target, index) {
      switch (target) {
        case 'list-add':
          this.$emit('initListDetail', index);
          this.$nextTick(() => {
            this.listElTabs.pages[index].show = true;
          });
          break;
        case 'list-delete':
          this.listDelRow(null, index);
          break;
        default:
          this.$emit(
            'listBarClick',
            target,
            index,
            this.listElTabs.pages[index]
          );
          break;
      }
    },
    // 关闭窗口
    listFormClose(ref, index) {
      this.listElTabs.pages[index].show = false;
      this.$nextTick(() => {
        this.$emit('initListDetail', index);
        this.$refs[ref][0].$refs['idForm'].resetFields();
      });
    },
    // 确认
    async listFormConfirm(ref, index) {
      this.$refs[ref][0].$refs['idForm'].validate(async (valid) => {
        if (valid) {
          let request = null;
          let mess = '';
          if (this.formList[index].form.data.id) {
            request = this.formList[index].update;
            mess = '更新';
          } else {
            request = this.formList[index].add;
            mess = '新增';
          }
          this.$emit(
            'beforeListFormCommit',
            this.formList[index].form.data,
            index,
            mess
          );
          await request(this.formList[index].form.data)
            .then((response) => {
              response = response.data;
              if (response.code === 200) {
                this.$message.success(`${mess}成功`);
                this.listFormClose(ref, index);
                this.editTableForm(this.tableDetailForm.idForm.data);
              } else {
                this.$notifyError(`${mess}失败`, response.msg);
              }
            })
            .catch((response) => {
              this.$notifyError(`${mess}失败`, '异常信息：' + response);
            });
        } else {
          this.$message.error('*为必填项');
        }
      });
    },
    // 行删除
    async listDelRow(row, index) {
      let params = [];
      if (row) {
        params.push(row);
      } else {
        if (this.listElTabs.pages[index].tableSelectData.length > 0)
          this.listElTabs.pages[index].tableSelectData.forEach((tItem) => {
            params.push(tItem);
          });
        else {
          this.$message.warning('请选择你要删除的数据!');
          return;
        }
      }
      await this.formList[index]
        .delete(params)
        .then((res) => {
          if (res.data.code === 200 && res.status === 200) {
            this.$message.success(
              this.formList[index].tableErrTip + '表体删除成功'
            );
            this.editTableForm(this.tableDetailForm.idForm.data);
          } else {
            // 操作成功回调
            this.$notifyError(
              this.formList[index].tableErrTip + '表体删除失败!',
              res.data.msg
            );
          }
        })
        .catch((response) => {
          this.$notifyError(
            this.formList[index].tableErrTip + '表体删除失败',
            '异常信息：' + response
          );
        });
    },
  },
};
</script>

<style lang="scss" module>
.treeTable {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.containerBar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 5px;
}

.containerMain {
  margin-left: 10px;
  flex-grow: 1;
  overflow: auto;
}

.elPageCenter {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.elPagination {
  margin: 10px 0;
}

.fadeInRight {
  margin-left: 27px;
}

.formBar {
  margin: 5px 0 15px 0;
}
</style>
//修改组件样式
<style lang="less" scoped>
::v-deep .el-tabs__header {
  margin: 0 0 6px 0;
}

::v-deep .el-tabs__content {
  margin-left: -27px;
}

.form-list {
  ::v-deep .el-tabs__content {
    margin-left: 0;
  }
}

.main-tree {
  ::v-deep .id-tree-main {
    height: calc(~'100vh - 150px');
  }

  ::v-deep .id-el-tree {
    height: calc(~'100vh - 190px') !important;
  }
}

.diaTitle {
  border-bottom: 1px solid #c4c4c4;
  height: 60px;
  margin: -20px -20px -10px -20px;
  padding-left: 25px;
  padding-top: 19px;
}

.diaTitleText {
  font-size: 16px;
  line-height: 22px;
  font-weight: bolder;
  font-family: 微软雅黑, serif;
}

.diaFooter {
  margin-top: -30px;

  .el-button {
    margin-right: 16px;
  }
}

@import '../id-form/idFormColumnAuto';
@import '../id-form/idDiaFormColumn';
@import '../../styles/tabStyle';
</style>

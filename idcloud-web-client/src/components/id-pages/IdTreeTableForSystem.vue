<template>
  <!--
  此界面针对 系统管理 界面进行改良的
  为何有这个界面？这个界面相当于半成品（迫于无奈才出现的产品），只有tree和table两个主要控件。
  1.因为系统管理的编辑Form界面过于复杂，form中组件复杂度很高，难以只用model的方式展示，特殊条件也多。
  2.系统管理界面数据都是单行删除删除，界面与平常的不太一样。
  所以暂时做一个通用的 tree，table界面，配合已经完成的diaForm系列进行修改。
  -->
  <div class="container">
    <!--此处draggable留有疑问-->
    <id-tree
      ref="idTree"
      v-loading="treeLoading"
      :treeData="treeData"
      :highlight-current="highlightCurrent"
      :draggable="tableName === '企业'"
      :idConfig="idTreeActionBar"
      @nodeClick="nodeSelectFunc"
      @nodeDrop="nodeDropFunc"
      v-bind="$attrs"
    ></id-tree>
    <div class="container-main">
      <div class="container-bar">
        <id-action-bar :idConfig="actionBarConfig" @click="actionBarClick">
        </id-action-bar>
        <id-query
          ref="idQuery"
          :default-value="searchColumn"
          :options="tableColumns"
          @query="query"
        >
        </id-query>
      </div>
      <div class="container-table">
        <id-table
          v-loading="tableLoading"
          border
          :height="tableHeight"
          :columns="tableColumns"
          :table-data="tableData"
          @selection-change="onSelectChange"
          @row-dblclick="editNodeFunc"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <template v-slot:action="{ row, column, index }">
            <slot name="moreAction" :row="row" :column="column" :index="index">
            </slot>
            <!--此处disabled留有疑问-->
            <el-button
              :disabled="
                !deleteFormAuthority ||
                  userInfo.orgId === row.id ||
                  userInfo.id === row.id
              "
              type="danger"
              plain
              size="mini"
              @click="delNodeFunc(row)"
              >删除
            </el-button>
          </template>
        </id-table>
        <div class="el-page-center">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-bind="page"
            layout="total,  prev, pager, next, sizes, jumper"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IdTree from "../id-tree/index";
import { configBase } from "../id-tree/idTreeConfig";
import IdActionBar from "../id-action-bar/index";
import IdTable from "../id-table/IdTable";
import IdQuery from "../id-query";
import { getTypeList } from "@/api/systemManagement/org";
import resizeTableHeightMixins from "@/mixins/resizeTableHeightMixins";

export default {
  name: "IdTreeTableForSystem",
  components: {
    IdTree,
    IdActionBar,
    IdTable,
    IdQuery
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo;
    }
  },
  mixins: [resizeTableHeightMixins],
  data() {
    return {
      // 树形目录组件相关参数---------------------
      treeLoading: false,
      treeSelectData: {}, //树形目录当前选中数据
      idTreeActionBar: configBase, //树形操作栏配置
      highlightCurrent: true, //选中是否高亮行
      treeData: [], //树形目录数据

      //操作栏相关配置----------------------------
      // actionBarConfig: [
      //   new IdButtonConfig("button-add", "添加", "add", { type: "primary" }),
      //   new idDropdownConfig("禁用", [
      //     {
      //       text: "禁用",
      //       target: "disable",
      //     },
      //     {
      //       text: "反禁用",
      //       target: "unDisable",
      //     },
      //   ]),
      //   new IdButtonConfig("button-fresh", "刷新", "fresh", {
      //     styleTwo: true,
      //     beforeIf: true,
      //     beforeClass: "el-icon-refresh-right",
      //   }),
      // ],
      //查询相关参数------------------------------
      searchColumn: "", //搜索条件
      filterData: {}, // 过滤查询的条件
      //表格相关参数options-----------------------
      tableLoading: false,
      // tableColumns: [
      //   {
      //     tag: "el-table-column",
      //     label: "企业名称",
      //     prop: "name",
      //     width: 240,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "企业代码",
      //     prop: "number",
      //     width: 95,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column-status-name",
      //     label: "状态",
      //     prop: "statusName",
      //     width: 80,
      //     comp: "Select",
      //     options: [
      //       {
      //         label: "试用",
      //         value: "0",
      //         authority: new authority(),
      //       },
      //       {
      //         label: "正常",
      //         value: "1",
      //         authority: new authority(),
      //       },
      //       {
      //         label: "过期",
      //         value: "2",
      //         authority: new authority(),
      //       },
      //       {
      //         label: "禁用",
      //         value: "3",
      //         authority: new authority(),
      //       },
      //     ],
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "过期时间",
      //     prop: "expireTime",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "Datetime",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "注册时间",
      //     prop: "createTime",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "Datetime",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "社会信用统一代码",
      //     prop: "unifiedSocialCreditCode",
      //     width: 190,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "所属行业",
      //     prop: "businessTypeName",
      //     width: 140,
      //     showOverflowTooltip: true,
      //     comp: "SelectExpand",
      //     url: getTypeList,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "联系电话",
      //     prop: "contact",
      //     width: 130,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "联系邮箱",
      //     prop: "email",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "企业地址",
      //     prop: "simpleAddress",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "详细地址",
      //     prop: "address",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "备注",
      //     prop: "description",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   //此列只有列权限
      //   // {
      //   //   tag: "el-table-column-template",
      //   //   fixed: "right",
      //   //   label: "操作",
      //   //   align: "center",
      //   //   width: 140,
      //   //   component: {
      //   //     tag: "id-action-bar",
      //   //     actionButtonSize: "mini",
      //   //     idConfig: [
      //   //       new IdButtonConfig("row-edit", "编辑", "rowEdit", { plain: true, type: "primary" }),
      //   //       new IdButtonConfig("row-delete", "删除", "rowDelete", { plain: true, type: "danger" }),
      //   //     ],
      //   //   },
      //   // },
      //   //该列的权限分为行权限和列权限  所以单纯列权限是无法实现的
      // ], //表格列配置
      allTableData: [], //全部数据（当前端自动分页时，所有数据都保存在此，根据这个数据获取分页数据）
      tableData: [], //表格数据
      tableSelectData: [], //表格当前选中数据
      page: {
        background: true,
        pageSizes: [10, 20, 30, 50, 100],
        currentPage: 1,
        pageSize: 10,
        total: 10
      },
      //权限相关
      editFormAuthority: false,
      queryTableAuthority: false,
      detailFormAuthority: false,
      deleteFormAuthority: false,

      //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
      pageQuest: false
    };
  },
  props: {
    authorityName: {
      type: String,
      default: ""
    },
    treeName: {
      type: String,
      default: ""
    },
    tableName: {
      type: String,
      default: ""
    },
    // treeParams:{type:Object},
    getTreeList: { type: Function },
    dropTreeItem: { type: Function },
    getTableByTree: { type: Function },
    deleteTable: { type: Function },
    suspendTable: { type: Function },
    deSuspendTable: { type: Function },
    getTableDetail: { type: Function },
    actionBarConfig: { type: Array },
    tableColumns: { type: Array },
    isPage: { type: Boolean, default: false }, //是否前台自动分页
    isAutoClickTree: { type: Boolean, default: true } //是否自动点击树的第一个选项 =》 系统管理专用
  },
  created() {
    const tIndex = this.tableColumns.findIndex(tItem => tItem.comp);
    this.searchColumn = this.tableColumns[tIndex].prop; //设置idQuery的选择项的默认值

    if (this.authorityName) {
      this.detailFormAuthority =
        this.$store.state.user.accessButton.findIndex(
          item => item === `${this.authorityName}_detail`
        ) >= 0;

      this.deleteFormAuthority =
        this.$store.state.user.accessButton.findIndex(
          item => item === `${this.authorityName}_delete`
        ) >= 0;

      this.editFormAuthority =
        this.$store.state.user.accessButton.findIndex(
          item => item === `${this.authorityName}_edit`
        ) >= 0;

      this.queryTableAuthority =
        this.$store.state.user.accessButton.findIndex(
          item => item === `${this.authorityName}_query`
        ) >= 0;
    }
    this.findOrgListFunc();
  },
  methods: {
    /* 获取企业树形列表 */
    async findOrgListFunc() {
      this.treeLoading = true;
      let params = {
        orgId: this.$store.state.user.userInfo.orgId
      };
      this.$emit("beforeGetTreeList", params);
      await this.getTreeList(params)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            //根据层级来限定
            this.$emit("afterGetTreeList", res.data.data);
            //对于设备管理的树形目录的特别处理
            res.data.data = res.data.data.filter(item =>
              item.ctrType ? item.ctrType !== 4 : true
            );
            // 生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true
            };
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, "id");
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, "pid");
            this.treeData = this.$utils.toTreeDataFunc(data);
          } else {
            this.$notifyError(`获取${this.treeName}列表失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          this.treeLoading = false;
          if (!this.isAutoClickTree) {
            this.$emit("getTreeListFinally");
            return;
          }
          this.$nextTick(() => {
            let isFirstSelect = false;
            if (this.treeSelectData.id !== undefined) {
              const nodeAll = document.querySelectorAll(".el-tree-node__label");
              let that = this;
              [].forEach.call(nodeAll, function(div) {
                if (div.innerText === that.treeSelectData.name) {
                  div.click();
                  isFirstSelect = true;
                }
              });
            }
            if (!isFirstSelect) {
              if (document.querySelector(".el-tree-node__content"))
                document.querySelector(".el-tree-node__content").click();
            }
          });
        });
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
    //拖拽事件
    async nodeDropFunc(draggingNode, dropNode, dropType, ev) {
      // console.log(draggingNode)
      // console.log(dropNode)
      // console.log(dropType)
      // console.log(ev)
      this.treeLoading = true;
      let param = {};
      if (dropType === "inner")
        param = { source: draggingNode.data.id, target: dropNode.data.id };
      else
        param = {
          source: draggingNode.data.id,
          target: dropNode.parent.data.length > 1 ? 0 : dropNode.parent.data.id
        };
      await this.dropTreeItem(param)
        .then(res => {
          this.treeSelectData = {};
          this.tableData = [];
          this.tableSelectData = [];
          if (res.status === 200 && res.data.code === 200) {
            this.$message.success("移动成功!");
            this.treeLoading = false;
          } else {
            this.$notifyError("移动失败!", res.data.msg);
            this.findOrgListFunc();
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    /* 获取企业节点列表 */
    async getOrgListByOrgFunc() {
      this.tableLoading = true;
      this.filterData.orgId = this.treeSelectData.id;
      if (!this.isPage) {
        this.filterData.current_page = this.page.currentPage;
        this.filterData.page_size = this.page.pageSize;
      }
      this.$emit("alterFilter", this.filterData, this.treeSelectData.id);
      await this.getTableByTree(this.filterData)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            if (this.isPage) {
              this.$emit("afterGetTableNoPage", res.data.data);
              this.allTableData = res.data.data;
              this.tableData = this.allTableData.slice(0, this.page.pageSize);
              this.page.total = this.allTableData.length;
            } else {
              this.$emit("afterGetTablePage", res.data.data.records);
              this.tableData = res.data.data.records;
              this.page.total = res.data.data.total;
            }
          } else {
            this.$notifyError("获取企业列表失败", res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          this.tableLoading = false;
          this.pageQuest = false;
          this.filterData = {};
        });
    },
    //操作栏点击
    actionBarClick(target) {
      switch (target) {
        case "add":
          this.addNodeFunc();
          break;
        case "disable":
          this.suspendOrgFunc();
          break;
        case "unDisable":
          this.deSuspendOrgFunc();
          break;
        case "fresh":
          this.findOrgListFunc();
          break;
      }
    },
    //新增table数据行
    addNodeFunc() {
      this.$emit("tableAdd", this.treeSelectData);
    },
    //删除table数据行
    delNodeFunc(row) {
      this.$emit("beforeTableDelete", this.tableSelectData);
      let param = { id: row.id };
      this.$confirm("此操作将永久删除该条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await this.deleteTable(param)
            .then(res => {
              if (res.status === 200 && res.data.code === 200) {
                this.$message.success("删除成功!");
                this.findOrgListFunc();
              } else {
                // 操作成功回调
                this.$notifyError("删除失败!", res.data.msg);
              }
            })
            .catch(() => {
              this.$notifyError("网络请求失败!", "");
            });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //多行操作时的操作校验 （1.是否有操作数据 2.是否有操作权限）
    checkRows() {
      if (this.tableSelectData.length <= 0) {
        this.$message.warning("请选择一行你要操作的数据!");
        return false;
      }
      if (this.$store.state.user.userInfo.type !== 99) {
        let isReturn = false;
        this.tableSelectData.forEach(item => {
          if (this.$refs.idTree.$refs.elTree.getNode(item.pid) === null) {
            this.$message.warning("你没有操作数据的权限!");
            isReturn = true;
          }
        });
        if (isReturn) return false;
      }
      return true;
    },
    //禁用
    async suspendOrgFunc() {
      if (!this.checkRows()) return;
      let param = [];
      //此处需要整合
      this.tableSelectData.forEach(item => param.push(item.id));
      await this.suspendTable(param)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.$message.success("禁用成功!");
            this.handleQueryData();
          } else {
            this.$notifyError("禁用失败!", res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    //反禁用
    async deSuspendOrgFunc() {
      if (!this.checkRows()) return;
      let param = [];
      //此处需要整合
      this.tableSelectData.forEach(item => param.push(item.id));
      await this.deSuspendTable(param)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.$message.success("反禁用成功!");
            this.handleQueryData();
          } else {
            this.$notifyError("反禁用失败!", res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    //处理idQuery组件出来的查询参数
    query(data) {
      for (let name in data) {
        if (data[name] instanceof Array) {
          this.filterData[name + "Start"] = data[name][0];
          this.filterData[name + "End"] = data[name][1];
        } else {
          this.filterData[name] = data[name];
        }
      }
      if (!this.pageQuest) this.page.currentPage = 1;
      this.getOrgListByOrgFunc();
    },
    //记录 当前选择的数据行
    onSelectChange(selection) {
      this.tableSelectData = selection;
    },
    //修改 节点
    async editNodeFunc(row) {
      //弹窗下的特殊处理
      if (!this.getTableDetail && this.tableName !== "角色") {
        this.$emit("id-row-dblclick", row);
        return;
      }
      //此处需要整合
      if (!this.detailFormAuthority) {
        this.$message.warning(`你没有查看${this.tableName}信息的权限!`);
        return;
      }
      //角色管理的特别处理
      if (this.tableName === "角色") {
        this.$emit("getTableDetail", row, this.editFormAuthority);
        return;
      }
      // const param = {
      //   id: row.id,
      // };
      const param = {
        企业: {
          orgId: row.id
        },
        账户: {
          userId: row.id
        }
      };
      await this.getTableDetail(param[this.tableName])
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            this.$emit(
              "tableEdit",
              res.data.data,
              this.editFormAuthority,
              this.treeSelectData
            ); //需要加入编辑权限
          } else {
            this.$notifyError(`获取${this.tableName}详情失败!`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        });
    },
    //当前页的数据数量改变时
    handleSizeChange(pageSize) {
      this.pageQuest = true;
      this.page.pageSize = pageSize;
      if (this.isPage) this.dataPage();
      else this.handleQueryData();
    },
    //当前页修改  当前页跳转到某一页（向前或者向后都行）
    handleCurrentChange(currentPage) {
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
        this.$refs.idQuery.queryClick("one");
      } else {
        this.$refs.idQuery.queryClick("more");
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: row;
  margin-top: 6px;

  .id-tree {
    margin-left: -28px;
  }

  .container-main {
    margin-left: 10px;
    flex-grow: 1;
    width: 0;

    .container-bar {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 5px;
      /*align-items: flex-start;*/
    }

    .container-table {
      height: calc(~"100vh - 170px");

      .id-table {
        width: 100%;
        //直接给el-tree样式中定义高度 =》 导致el-table内部各种样式高度都不匹配
        /*height: calc(~"100vh - 220px");*/
      }

      .el-page-center {
        display: flex;
        flex-direction: column;
        align-items: center;

        .el-pagination {
          margin: 10px 0;
        }
      }
    }
  }
}
</style>

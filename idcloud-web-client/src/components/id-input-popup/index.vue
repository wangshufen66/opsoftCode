<template>
  <div ref="div" style="display: inline-block">
    <el-tooltip :value="tooltipShow" :content="number" v-bind="tooltip">
      <div @click="tooltipChange">
        <el-input v-if="$route.path!=='/box8303_adapter/box8303_list'" style="width: 100%" v-model="name" :disabled="disabled" v-bind="input">
          <i slot="suffix" class="el-input__icon el-icon-search" style="color: #aaa4a0;font-weight: bolder" @click.stop="openDiaTable"></i>
        </el-input>
        <el-input v-if="$route.path==='/box8303_adapter/box8303_list'" style="width: 100%" v-model="number" :disabled="disabled" v-bind="input">
          <i slot="suffix" class="el-input__icon el-icon-search" style="color: #aaa4a0;font-weight: bolder" @click.stop="openDiaTable"></i>
        </el-input>
      </div>
    </el-tooltip>

    <el-dialog v-model="diaShow" :visible.sync="diaShow" append-to-body top="10vh" width="75%" @closed="diaClose">
      <div :class="$style.container" :id="diaTitle">
        <id-tree v-if="isTree" ref="idTree" v-loading="treeLoading" :treeData="treeData" :highlight-current="highlightCurrent" :idConfig="idTreeActionBar" @nodeClick="nodeSelectFunc"></id-tree>
        <div :class="$style.main">
          <div :class="$style.header">
            <id-action-bar :idConfig="actionBarConfig" @click="actionBarClick">
            </id-action-bar>
            <id-query ref="idQuery" index="diaQuery" :default-value="searchColumn" :options="tableColumns" @query="query">
            </id-query>
          </div>
          <id-table v-loading="tableLoading" border :height="(tableHeight / 4) * 3" :selection="isTableSelection" :highlight-current-row="!isTableSelection" :columns="tableColumns" :table-data="tableData" @selection-change="onSelectChange" @row-dblclick="diaConfirm" @row-click="onRowClick">
          </id-table>
          <div :class="$style.page">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" v-bind="page" layout="total,  prev, pager, next, sizes, jumper">
            </el-pagination>
          </div>
        </div>
      </div>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ diaTitle }}(双击选择)</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="diaClose">取消</el-button>
        <el-button type="primary" @click="diaConfirm('')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
@import '../../styles/diaForm.less';

::v-deep .id-tree {
  > .id-tree-main {
    height: calc(~'100vh - 250px');

    > .id-el-tree {
      height: calc(~'100vh - 290px');
    }
  }
}

::v-deep .el-icon-circle-close {
  display: none;
}

::v-deep .el-icon-circle-check {
  display: none;
}
</style>
<style lang="scss" module>
.container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: -20px;
}

.main {
  margin-left: 10px;
  overflow: auto;
  flex-grow: 1;
  width: 0;
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.page {
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
<script>
import IdTree from '../id-tree/index';
import { configBase } from '../id-tree/idTreeConfig';
import IdButtonConfig from '../id-button/IdButtonConfig';
import IdActionBar from '../id-action-bar/index';
import IdTable from '../id-table/IdTable';
import IdQuery from '../id-query';
import resizeTableHeightMixins from '@/mixins/resizeTableHeightMixins';

export default {
  name: 'id-input-popup',
  components: {
    IdTree,
    IdActionBar,
    IdTable,
    IdQuery,
  },
  props: {
    id: { type: String | Number },
    number: { type: String },
    name: { type: String },
    getTableList: { type: Function, required: true }, //
    getTreeList: { type: Function },
    isTree: { type: Boolean, default: true }, //是否有树
    isPage: { type: Boolean, default: false }, //是否前台自动分页
    isTableSelection: { type: Boolean, default: false }, //是否table多选
    diaTitle: { type: String, default: '数据点' }, // 开放参数
    tableColumns: { type: Array, required: true }, //表格列配置
    disabled: { type: Boolean, default: false },
    controlTooltipShow: { type: Boolean, default: true }, //通过开启关闭来控制tooltipShow的显示
  },
  mixins: [resizeTableHeightMixins],
  watch: {
    controlTooltipShow: function (newValue) {
      if (newValue) {
      } else {
        this.tooltipShow = false;
      }
    },
  },
  data() {
    return {
      // el-tooltip相关参数---------------------
      tooltip: {
        manual: true,
        placement: 'top',
      }, // 可开放参数
      tooltipShow: false, //不可修改参数
      // el-input相关参数-----------------------
      input: {
        readonly: true,
      }, // 可开放参数
      //弹窗相关参数-----------------------------
      diaShow: false, //不可修改参
      // 树形目录组件相关参数---------------------
      treeLoading: false,
      treeSelectData: {}, //树形目录当前选中数据
      idTreeActionBar: configBase, //树形操作栏配置
      highlightCurrent: true, //选中是否高亮行
      treeData: [], //树形目录数据
      //操作栏相关配置----------------------------
      actionBarConfig: [
        {
          //未封装控件
          tag: 'el-checkbox',
          classKey: 'showAll',
          label: '显示所有',
          target: 'showAll',
          vModel: false,
          styleTwo: true,
          //导致权限也没有生效
          authority: {
            idLoad: false,
            idIf: true,
            idDisable: false,
            idShow: true,
          },
        },
        new IdButtonConfig('button-fresh', '刷新', 'fresh', {
          styleTwo: true,
          beforeIf: true,
          beforeClass: 'el-icon-refresh-right',
        }),
      ],
      //查询相关参数------------------------------
      searchColumn: '', //搜索条件
      filterData: {}, // 过滤查询的条件
      //表格相关参数options-----------------------
      tableLoading: false,
      // tableColumns: [
      //   {
      //     tag: "el-table-column",
      //     label: "设备代码",
      //     prop: "number",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "设备名称",
      //     prop: "name",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "设备分组",
      //     prop: "groupName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "设备类别",
      //     prop: "typeName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "规格",
      //     prop: "specifications",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "型号",
      //     prop: "model",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "生产厂商",
      //     prop: "manufacturerName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "供应厂商",
      //     prop: "supplierName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "部门",
      //     prop: "departmentName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "位置",
      //     prop: "warehouseName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "负责人",
      //     prop: "personName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "制单人",
      //     prop: "docMakerName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "制单时间",
      //     prop: "createTime",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "Datetime",
      //   },
      // ], //表格列配置
      allTableData: [], //全部数据（当前端自动分页时，所有数据都保存在此，根据这个数据获取分页数据）
      tableData: [], //表格数据
      tableSelectData: [], //表格当前选中数据
      tableSelectRow: {}, //单选选中的数据
      //分页相关参数
      page: {
        background: true,
        pageSizes: [10, 20, 30, 50, 100],
        currentPage: 1,
        pageSize: 10,
        total: 10,
      },

      //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
      pageQuest: false,
    };
  },
  //防止注册失败
  beforeCreate() {
    this.$options.components.IdQuery = require('../id-query').default;
  },
  created() {
    this.searchColumn = this.tableColumns[0].prop; //设置idQuery的选择项的默认值
    if (this.actionBarConfig[0].tag === 'el-checkbox') {
      if (!this.isTree) this.actionBarConfig.splice(0, 1);
    }
  },
  destroyed() {
    this.tooltipShow = false;
  },
  methods: {
    //开除弹窗
    openDiaTable() {
      if (!this.disabled) {
        if (this.isTree) {
          this.getTreeData();
        } else {
          this.getTableData();
          this.diaShow = true;
        }
      }
    },
    //是否给出提醒
    tooltipChange() {
      if (this.number && this.name) {
        this.tooltipShow = !this.tooltipShow;
      }
    },
    //关闭弹窗
    diaClose() {
      this.diaShow = false;
    },
    //确认弹窗
    diaConfirm(row) {
      if (row) {
        console.log('123', row);
        this.$emit('confirm', row);
      } else {
        if (this.isTableSelection) {
          this.$emit('confirm', this.tableSelectData);
        } else {
          this.$emit('confirm', this.tableSelectRow);
        }
      }
      this.diaClose();
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
    //操作栏点击
    actionBarClick(target, value) {
      switch (target) {
        case 'fresh':
          if (this.isTree) this.getTreeData();
          else this.handleQueryData();
          break;
        case 'showAll':
          [this.actionBarConfig[0].vModel] = value;
          this.handleQueryData();
          break;
      }
    },
    /* 获取弹窗树形目录 */
    async getTreeData() {
      this.treeLoading = true;
      let params = {
        orgId: this.$store.state.user.userInfo.orgId,
      };
      this.$emit('beforeGetTreeList', params);
      await this.getTreeList(params)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            //根据层级来限定
            this.$emit('afterGetTreeList', res.data.data);
            // 生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true,
            };
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, 'id');
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, 'pid');
            this.treeData = this.$utils.toTreeDataFunc(data);
          } else {
            this.$notifyError(`获取弹窗树形目录失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        })
        .finally(() => {
          this.treeLoading = false;
          this.diaShow = true;
          this.$nextTick(() => {
            let isFirstSelect = false;
            if (this.treeSelectData.id) {
              const dia = document.getElementById(this.diaTitle);
              const nodeAll = dia.querySelectorAll('.el-tree-node__label');
              let that = this;
              [].forEach.call(nodeAll, function (div) {
                if (div.innerText === that.treeSelectData.name) {
                  div.click();
                  isFirstSelect = true;
                }
              });
            }
            if (!isFirstSelect) {
              const dia = document.getElementById(this.diaTitle);
              if (dia.querySelector('.el-tree-node__content'))
                dia.querySelector('.el-tree-node__content').click();
            }
          });
        });
    },
    //处理idQuery组件出来的查询参数
    query(data) {
      for (let name in data) {
        if (data[name] instanceof Array) {
          this.filterData[name + 'Start'] = data[name][0];
          this.filterData[name + 'End'] = data[name][1];
        } else {
          this.filterData[name] = data[name];
        }
      }
      if (!this.pageQuest) this.page.currentPage = 1;
      this.getTableData();
    },
    //获取表格数据
    async getTableData() {
      this.tableLoading = true;
      this.filterData.orgId = this.$store.state.user.userInfo.orgId;
      this.filterData.groupId = this.treeSelectData.id;
      this.filterData.showAll = this.actionBarConfig[0].vModel;
      if (!this.isPage) {
        this.filterData.current_page = this.page.currentPage;
        this.filterData.page_size = this.page.pageSize;
      }
      this.$emit('beforeGetTableList', this.filterData, this.treeSelectData.id);
      await this.getTableList(this.filterData)
        .then((res) => {
          console.log(res);
          // debugger;
          if (res.status === 200 && res.data.code === 200) {
            if (this.isPage) {
              this.$emit('afterGetTableNoPage', res.data.data);
              const resData = res.data.data;
              this.allTableData = resData.records ? resData.records : resData;
              this.allTableData = this.allTableData || [];
              this.tableData = this.allTableData.slice(0, this.page.pageSize);
              this.page.total = this.allTableData.length;
            } else {
              this.$emit('afterGetTablePage', res.data.data.records);
              this.tableData = res.data.data.records;
              this.page.total = res.data.data.total;
            }
          } else {
            this.$notifyError('获取弹窗表格数据失败', res.data.msg);
          }
        })
        .catch((pap) => {
          console.log(pap);
          this.$notifyError('网络请求失败!', '');
        })
        .finally(() => {
          this.tableLoading = false;
          this.pageQuest = false;
          this.filterData = {};
        });
    },
    //记录 当前选择的数据行 多选
    onSelectChange(selection) {
      this.tableSelectData = selection;
    },
    //记录 当前选择的数据行 单选
    onRowClick(row) {
      this.tableSelectRow = row;
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
        this.$refs.idQuery.queryClick('one');
      } else {
        this.$refs.idQuery.queryClick('more');
      }
    },
  },
};
</script>

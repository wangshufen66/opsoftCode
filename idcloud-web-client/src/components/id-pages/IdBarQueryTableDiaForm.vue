<template>
  <div class="container">
    <div class="container-bar">
      <id-action-bar ref="idBar" :idConfig="actionBarConfig" @click="actionBarClick">
      </id-action-bar>
      <id-query ref="idQuery" index="query" :default-value="searchColumn" :options="tableColumns" @query="queryData" v-bind="$attrs">
      </id-query>
    </div>
    <div class="container-table">
      <id-table v-loading="tableLoading" border :height="tableHeight" custom-action :columns="tableColumns" :table-data="tableData" @id-row-column-switch-refresh="handleQueryData" @selection-change="onSelectChange" @row-dblclick="editNodeFunc" v-bind="$attrs" v-on="$listeners">
        <template v-slot:action="{ row, column, index }">
          <slot name="moreAction" :row="row" :column="column" :index="index">
          </slot>
          <!--此处disabled留有疑问-->
          <el-button :disabled="row.deleteable===0" type="danger" plain size="mini" @click="delNodeFunc(row)">删除
          </el-button>
        </template>
      </id-table>
      <div class="el-page-center">
        <el-pagination @size-change="sizeChange" @current-change="currentChange" v-bind="page" layout="total,  prev, pager, next, sizes, jumper">
        </el-pagination>
      </div>
    </div>

    <!--此处需要优化到diaForm中-->
    <el-dialog :visible.sync="diaForm.show" @closed="diaCloseFunc(diaForm.ref)">
      <id-form :ref="diaForm.ref" class="more-query-form" :id-form="tableDetailForm" v-bind="diaForm" :label-width="formLabelWidth"></id-form>
      <div slot="title" class="diaTitle">
        <span class="diaTitleText">{{ tableErrTip }}</span>
      </div>
      <div slot="footer" class="diaFooter">
        <el-button @click="diaCloseFunc(diaForm.ref)">取消</el-button>
        <el-button type="primary" @click="diaSaveFunc(diaForm.ref)">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import IdActionBar from '../id-action-bar/index';
import IdTable from '../id-table/IdTable';
import IdQuery from '../id-query';
import IdForm from '../id-form/index';
import resizeTableHeightMixins from '@/mixins/resizeTableHeightMixins';

// 测试数据
// import IdButtonConfig from "../id-button/IdButtonConfig";
// import {getList,getDetail,add, batchDel, update} from "@/api/environmentMonitor/environmentFee";

export default {
  name: 'IdBarQueryTableDiaForm',
  components: {
    IdActionBar,
    IdTable,
    IdQuery,
    IdForm,
  },
  computed: {},
  mixins: [resizeTableHeightMixins],
  data() {
    return {
      //操作栏相关配置----------------------------

      // actionBarConfig: [
      //   new IdButtonConfig("button-add", "添加", "add", {type: "primary"}),
      //   new IdButtonConfig("button-fresh", "刷新", "fresh", {
      //     styleTwo: true,
      //     beforeIf: true,
      //     beforeClass: "el-icon-refresh-right",
      //   }),
      // ],//测试操作栏配置

      //查询相关参数------------------------------
      searchColumn: '', //搜索条件
      filterData: {}, // 过滤查询的条件
      //表格相关参数options-----------------------
      tableLoading: false,
      // tableColumns: [
      //   {
      //     tag: "el-table-column",
      //     label: "收费类型",
      //     prop: "name",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "收费单位",
      //     prop: "unit",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "收费金额",
      //     prop: "priceUnit",
      //     width: 180,
      //     showOverflowTooltip: true,
      //     comp: "Number",
      //   },
      //   {
      //     tag: "el-table-column-switch",
      //     label: "是否启用",
      //     prop: "isEffective",
      //     width: 110,
      //     showOverflowTooltip: true,
      //     comp: "Checkbox",
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "备注",
      //     prop: "note",
      //     width: 540,
      //     showOverflowTooltip: true,
      //     comp: "String",
      //   },
      // ], //测试表格列配置
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
      //弹窗相关陈述
      diaForm: {
        show: false,
        ref: 'detailForm',
        size: 'default',
      },

      //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
      pageQuest: false,
    };
  },
  props: {
    getTable: { type: Function },
    deleteTable: { type: Function },
    getDetail: { type: Function },
    addDetail: { type: Function },
    updateDetail: { type: Function },
    actionBarConfig: { type: Array },
    tableColumns: { type: Array },
    tableDetailForm: { type: Object },
    isPage: { type: Boolean, default: false }, //是否前台自动分页
    tableErrTip: { type: String, default: '' },
    formLabelWidth: { type: String, required: true },
  },
  created() {
    const tIndex = this.tableColumns.findIndex((tItem) => tItem.comp);
    this.searchColumn = this.tableColumns[tIndex].prop; //设置idQuery的选择项的默认值
  },
  mounted() {
    this.handleQueryData();
  },
  methods: {
    //获取table数据
    async getTableList() {
      this.tableLoading = true;
      this.filterData.orgId = this.$store.state.user.userInfo.orgId;
      if (!this.isPage) {
        this.filterData.current_page = this.page.currentPage;
        this.filterData.page_size = this.page.pageSize;
      }
      if (this.$refs.idBar.$children[0].vModel) {
        if (this.$refs.idBar.$children[0].vModel.length === 1)
          this.filterData.factory = this.$refs.idBar.$children[0].vModel[0];
        else if (this.$refs.idBar.$children[0].vModel.length === 2)
          this.filterData.shop = this.$refs.idBar.$children[0].vModel[1];
      }
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
          this.filterData = {};
          this.pageQuest = false;
          this.tableSelectData = [];
        });
    },
    //操作栏点击
    actionBarClick(target) {
      switch (target) {
        case 'add':
          this.addDetailDiaForm();
          break;
        case 'delete':
          this.delNodeFunc();
          break;
        case 'fresh':
          this.handleQueryData();
          break;
        default:
          this.$emit('actionBarClick', target);
          break;
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
    //修改节点
    async editNodeFunc(row) {
      await this.getDetail(row.id)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            this.$emit('editTableDetail', res.data.data);
          } else {
            this.$notifyError(`获取${this.tableErrTip}详情失败!`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        })
        .finally(() => {
          this.$nextTick(() => {
            this.diaForm.show = true;
          });
        });
    },
    //记录 当前选择的数据行
    onSelectChange(selection) {
      this.tableSelectData = selection;
    },
    // 关闭弹窗窗口
    diaCloseFunc(ref) {
      this.diaForm.show = false;
      this.$nextTick(() => {
        this.$emit('initTableDetail');
        this.$refs[ref].$refs['idForm'].resetFields();
      });
    },
    // 数据校验=》保存或者更新数据
    diaSaveFunc(ref) {
      this.$refs[ref].$refs['idForm'].validate((valid) => {
        if (valid) {
          this.addOrUpdateDetail();
        } else {
          this.$message.error('*为必填项');
        }
      });
    },
    // detail保存或者更新数据(提交到后台) =》更新表格
    async addOrUpdateDetail() {
      let submit = null;
      if (this.tableDetailForm.data.id) submit = this.updateDetail;
      else submit = this.addDetail;
      // this.$emit('beforeSubmit', this.tableDetailForm.data);
      await submit(this.tableDetailForm.data).then((res) => {
        if (res.data.code === 200 && res.status === 200) {
          this.$message.success('提交成功!');
          this.diaForm.show = false;
          this.handleQueryData();
        } else {
          this.$notifyError('提交失败!', res.data.msg);
        }
      });
    },
    // 新增detail（弹窗） =》 弹窗保存/取消
    addDetailDiaForm() {
      this.diaForm.show = true;
    },
    //删除table数据行
    async delNodeFunc(row) {
      let param = [];
      if (row) {
        param = [{ id: row.id }];
      } else {
        this.tableSelectData.forEach((tItem) => {
          param.push({
            id: tItem.id,
          });
        });
      }
      await this.deleteTable(param)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            this.$message.success('删除成功!');
            this.handleQueryData();
          } else {
            // 操作成功回调
            this.$notifyError('删除失败!', res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.container {
  margin-top: 6px;

  .container-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    /*align-items: flex-start;*/
  }

  .el-page-center {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-pagination {
      margin: 10px 0;
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
}

@import '../id-form/idFormColumn';
</style>

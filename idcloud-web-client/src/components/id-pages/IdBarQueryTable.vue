<template>
  <div class="container">
    <div class="container-bar">
      <id-action-bar ref="idBar" :idConfig="actionBarConfig" @click="actionBarClick">
      </id-action-bar>
      <id-query
        ref="idQuery"
        :default-value="searchColumn"
        :options="tableColumns"
        @query="queryData"
        v-bind="$attrs"
      >
      </id-query>
    </div>
    <div class="container-table">
      <id-table
        v-loading="tableLoading"
        border
        :selection="false"
        :height="tableHeight"
        :columns="tableColumns"
        :table-data="tableData"
      >
      </id-table>
      <div class="el-page-center">
        <el-pagination
          @size-change="sizeChange"
          @current-change="currentChange"
          v-bind="page"
          layout="total,  prev, pager, next, sizes, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import IdActionBar from "../id-action-bar/index";
  import IdTable from "../id-table/IdTable";
  import IdQuery from "../id-query";
  import resizeTableHeightMixins from "@/mixins/resizeTableHeightMixins";
  import IdButtonConfig from "../id-button/IdButtonConfig";
  // 测试数据
  // import {getContainerList} from "@/api/productionManagement/productionPlan";
  // import {getMonitorWarningList} from "@/api/device-watch/warningLogs";

  export default {
    name: "IdBarQueryTable",
    components: {
      IdActionBar,
      IdTable,
      IdQuery,
    },
    computed: {},
    mixins: [resizeTableHeightMixins],
    data() {
      return {
        //操作栏相关配置----------------------------
        actionBarConfig: [
          {
            tag: "id-cascader",
            classKey: "id-cascader",
            target: "cascader",
            props: {
              expandTrigger: 'hover',
              checkStrictly: true,
            },
            clearable: true,
            showAllLevels: false,
            options: [
              // {
              //   value: '工厂',
              //   label: '工厂',
              //   children: [
              //     {
              //       value: '0',
              //       label: '工厂0',
              //     }, {
              //       value: '1',
              //       label: '工厂1',
              //     }
              //   ]
              // },
            ],
          },
          new IdButtonConfig("button-fresh", "刷新", "fresh", {
            styleTwo: true,
            beforeIf: true,
            beforeClass: "el-icon-refresh-right",
          }),
        ],

        //查询相关参数------------------------------
        searchColumn: "", //搜索条件
        filterData: {}, // 过滤查询的条件

        //表格相关参数options-----------------------
        tableLoading: false,
        // tableColumns: [
        //   {
        //     tag: "el-table-column",
        //     label: "设备代码",
        //     prop: "deviceNumber",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "String",
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "设备名称",
        //     prop: "deviceName",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "String",
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "故障代码",
        //     prop: "code",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "String",
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "故障详情",
        //     prop: "content",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "String",
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "故障持续时间",
        //     prop: "duration",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "String",
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "故障开始时间",
        //     prop: "startTime",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "Datetime",
        //   },
        //   {
        //     tag: "el-table-column",
        //     label: "故障结束时间",
        //     prop: "endTime",
        //     width: 180,
        //     showOverflowTooltip: true,
        //     comp: "Datetime",
        //   },
        // ], //表格列配置
        allTableData: [],//全部数据（当前端自动分页时，所有数据都保存在此，根据这个数据获取分页数据）
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

        //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
        pageQuest: false,
      };
    },
    props: {
      getTable: {type: Function,},
      getCascaderList: {type: Function,},
      // actionBarConfig: {type: Array},
      tableColumns: {type: Array},
      isPage: {type: Boolean, default: false},//是否前台自动分页
      tableErrTip: {type: String, default: ''},
    },
    created() {
      const tIndex = this.tableColumns.findIndex((tItem) => tItem.comp);
      this.searchColumn = this.tableColumns[tIndex].prop;//设置idQuery的选择项的默认值
      if (this.getCascaderList)
        this.getCascaderOpitions();
      else {
        this.actionBarConfig.splice(0, 1);
        this.getTableList();
      }
    },
    methods: {
      //获取cascader的数据
      getCascaderOpitions() {
        const param1 = {
          orgId: this.$store.state.user.userInfo.orgId,
          ctrType: 1,
        };
        const param2 = {
          orgId: this.$store.state.user.userInfo.orgId,
          ctrType: 2,
        };
        let promiseArray = [
          //列表请求
          this.getCascaderList(param1),
          this.getCascaderList(param2),
        ];
        Promise.all(promiseArray)
          .then(response => {
            let [res1, res2] = response;
            res1.data.data.list.forEach((item) => {
              this.actionBarConfig[0].options.push({
                value: item.id,
                label: item.ctrName,
                children: [],
              })
            });
            res2.data.data.list.forEach((item) => {
              const oIndex = this.actionBarConfig[0].options.findIndex((oItem) => {
                return oItem.value === String(item.ctrParent);
              });
              if (oIndex >= 0)
                this.actionBarConfig[0].options[oIndex].children.push({
                  value: item.id,
                  label: item.ctrName,
                })
            });
          })
          .catch(() => {
            this.$notifyError("网络请求失败!", "");
          })
          .finally(() => {
            this.$refs.idBar.$children[0].setVModel([this.actionBarConfig[0].options[0].value]);
            this.getTableList();
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
        if (this.$refs.idBar) {
          if (this.$refs.idBar.$children[0].vModel) {
            if (this.$refs.idBar.$children[0].vModel.length === 1)
              this.filterData.factory = this.$refs.idBar.$children[0].vModel[0];
            else if (this.$refs.idBar.$children[0].vModel.length === 2)
              this.filterData.shop = this.$refs.idBar.$children[0].vModel[1];
          }
        }

        await this.getTable(this.filterData)
          .then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              if (this.isPage) {
                this.$emit("afterGetTableNoPage", res.data.data.list);
                this.allTableData = res.data.data.list;
                this.tableData = this.allTableData.slice(0, this.page.pageSize);
                this.page.total = this.allTableData.length;
              } else {
                this.$emit("afterGetTablePage", res.data.data);
                this.tableData = res.data.data.list;
                this.page.total = res.data.data.total;
              }
            } else {
              this.$notifyError(`获取${this.tableErrTip}列表失败`, res.data.msg);
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
          case "fresh":
            this.handleQueryData();
            break;
          case "cascader":
            this.handleQueryData();
            break;
        }
      },
      //处理idQuery组件出来的查询参数
      queryData(data) {
        for (let name in data) {
          if (data[name] instanceof Array) {
            this.filterData[name + "Start"] = data[name][0];
            this.filterData[name + "End"] = data[name][1];
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
        if (this.isPage)
          this.dataPage();
        else
          this.handleQueryData();
      },
      //当前页修改  当前页跳转到某一页（向前或者向后都行）
      currentChange(currentPage) {
        this.pageQuest = true;
        this.page.currentPage = currentPage;
        if (this.isPage)
          this.dataPage();
        else
          this.handleQueryData();
      },
      //前台自动分页
      dataPage() {
        this.tableData = this.allTableData.slice(
          (this.page.currentPage - 1) * this.page.pageSize,
          this.page.currentPage * this.page.pageSize,
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
      }
    },
  }
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
  }
</style>

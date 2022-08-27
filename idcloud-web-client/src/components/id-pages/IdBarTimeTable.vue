<template>
  <div class="container">
    <div class="container-bar">
      <id-action-bar ref="idBar" :idConfig="actionBarConfig" @click="actionBarClick">
      </id-action-bar>
      <div class="container-query">
        <id-radio ref="idRadio" v-bind="idRadio" @change="queryChange">
        </id-radio>
        <el-date-picker class="id-date-picker" v-model="datePicker.vModel" v-bind="datePicker" @change="queryChange">
        </el-date-picker>
        <el-button v-bind="excelDownLoad" @click="excelTemplateDownload">
        </el-button>
      </div>
    </div>
    <div class="container-table">
      <id-table ref="table" v-loading="tableLoading" :index="false" border :selection="false" :height="tableHeight" :columns="tableColumns" :table-data="tableData" v-bind="$attrs" v-on="$listeners">
      </id-table>
      <div class="el-page-center">
        <el-pagination @size-change="sizeChange" @current-change="currentChange" v-bind="page" layout="total,  prev, pager, next, sizes, jumper">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import IdActionBar from '../id-action-bar/index';
import IdTable from '../id-table/IdTable';
import resizeTableHeightMixins from '@/mixins/resizeTableHeightMixins';
import { getContainerList } from '@/api/productionManagement/productionPlan';
import IdButtonConfig from '../id-button/IdButtonConfig';
import IdRadio from '../id-radio/index';
import moment from 'moment';
import authority from '../authority';

export default {
  name: 'IdBarTimeTable',
  components: {
    IdActionBar,
    IdTable,
    IdRadio,
  },
  computed: {},
  mixins: [resizeTableHeightMixins],
  data() {
    return {
      //操作栏相关配置----------------------------
      actionBarConfig: [
        {
          tag: 'id-cascader',
          classKey: 'id-cascader',
          target: 'cascader',
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
        new IdButtonConfig('button-fresh', '刷新', 'fresh', {
          styleTwo: true,
          beforeIf: true,
          beforeClass: 'el-icon-refresh-right',
        }),
      ],

      //查询相关参数------------------------------
      //查询组件1 radio组件
      idRadio: {
        size: 'small',
        defaultValue: '今日',
        textColor: '#409eff',
        fill: '#ffffff',
        options: [
          {
            label: '今日',
            authority: new authority(),
          },
          {
            label: '昨日',
            authority: new authority(),
          },
          {
            label: '本周',
            authority: new authority(),
          },
          {
            label: '本月',
            authority: new authority(),
          },
        ],
      },
      //查询组件2 radio组件
      datePicker: {
        vModel: [],
        size: 'small',
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        pickerOptions: {
          disabledDate(date) {
            const now = new Date(Date.now());
            const tomorrow = now.setDate(now.getDate() + 1);
            return date && date.valueOf() > tomorrow;
          },
        },
      },
      //最终汇总的参数
      filterData: {},

      //下载excel相关
      excelDownLoad: {
        type: 'primary',
        icon: 'el-icon-download',
        circle: true,
        size: 'mini',
      },

      //表格相关参数options-----------------------
      tableLoading: false,
      // tableColumns: [
      //   {
      //     tag: "el-table-column",
      //     label: "设备代码",
      //     prop: "deviceNumber",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "设备名称",
      //     prop: "deviceName",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "故障代码",
      //     prop: "code",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "故障详情",
      //     prop: "content",
      //     width: 180,
      //     showOverflowTooltip: true,
      //
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "故障持续时间",
      //     prop: "duration",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "故障开始时间",
      //     prop: "startTime",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      //   {
      //     tag: "el-table-column",
      //     label: "故障结束时间",
      //     prop: "endTime",
      //     width: 180,
      //     showOverflowTooltip: true,
      //   },
      // ], //表格列配置
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

      selectTableHeight: true,

      //参数 =》 用来判断 是分页的请求还是查询的请求(这不是一个好的解决方案)
      pageQuest: false,
    };
  },
  props: {
    getTable: { type: Function },
    // actionBarConfig: {type: Array},
    tableColumns: { type: Array },
    isPage: { type: Boolean, default: false }, //是否前台自动分页
    tableErrTip: { type: String, default: '' },
    getExcelTemplate: { type: Function },
    excelName: { type: String, default: 'excel' },
  },
  created() {
    this.getCascaderOpitions();
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
        getContainerList(param1),
        getContainerList(param2),
      ];
      Promise.all(promiseArray)
        .then((response) => {
          let [res1, res2] = response;
          res1.data.data.list.forEach((item) => {
            this.actionBarConfig[0].options.push({
              value: item.id,
              label: item.ctrName,
              children: [],
            });
          });
          res2.data.data.list.forEach((item) => {
            const oIndex = this.actionBarConfig[0].options.findIndex(
              (oItem) => {
                return oItem.value === String(item.ctrParent);
              }
            );
            if (oIndex >= 0)
              this.actionBarConfig[0].options[oIndex].children.push({
                value: item.id,
                label: item.ctrName,
              });
          });
        })
        .catch(() => {
          this.$notifyError('网络请求失败!', '');
        })
        .finally(() => {
          if (this.actionBarConfig[0].options.length > 0)
            this.$refs.idBar.$children[0].setVModel([
              this.actionBarConfig[0].options[0].value,
            ]);
          this.queryChange();
        });
    },
    //获取table数据
    async getTableList() {
      this.filterData.orgId = this.$store.state.user.userInfo.orgId;
      if (!this.isPage) {
        this.filterData.current_page = this.page.currentPage;
        this.filterData.page_size = this.page.pageSize;
      }
      if (this.$refs.idBar.$children[0].vModel) {
        if (this.$refs.idBar.$children[0].vModel.length === 1)
          this.filterData.containerId = this.$refs.idBar.$children[0].vModel[0];
        else if (this.$refs.idBar.$children[0].vModel.length === 2)
          this.filterData.containerId = this.$refs.idBar.$children[0].vModel[1];
      } else return;
      this.tableLoading = true;
      await this.getTable(this.filterData)
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            if (this.isPage) {
              this.$emit('afterGetTableNoPage', res.data.data);
              this.allTableData = res.data.data;
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
          this.$refs.table.$children[0].doLayout();
          this.filterData = {};
          this.pageQuest = false;
          this.tableLoading = false;
        });
    },
    //操作栏点击
    actionBarClick(target) {
      switch (target) {
        case 'fresh':
          this.queryChange();
          break;
        case 'cascader':
          this.queryChange();
          break;
      }
    },
    //当前页的数据数量改变时
    sizeChange(pageSize) {
      this.pageQuest = true;
      this.page.pageSize = pageSize;
      if (this.isPage) this.dataPage();
      else this.queryChange();
    },
    //当前页修改  当前页跳转到某一页（向前或者向后都行）
    currentChange(currentPage) {
      this.pageQuest = true;
      this.page.currentPage = currentPage;
      if (this.isPage) this.dataPage();
      else this.queryChange();
    },
    //前台自动分页
    dataPage() {
      this.tableData = this.allTableData.slice(
        (this.page.currentPage - 1) * this.page.pageSize,
        this.page.currentPage * this.page.pageSize
      );
      this.pageQuest = false;
    },
    //查询参数修改
    queryChange(value) {
      if (!this.pageQuest) this.page.currentPage = 1;
      if (!value) {
        value = this.$refs.idRadio.vModel;
      }
      const that = this;
      if (typeof value === 'string') {
        const tomorrowNow = new Date(Date.now());
        const tomorrow = tomorrowNow.setDate(tomorrowNow.getDate() + 1);
        const now = new Date(Date.now());
        this.datePicker.vModel = [];
        const timeRage = {
          今日: function () {
            that.datePicker.vModel = [now, tomorrow];
          },
          昨日: function () {
            const yesterdayNow = new Date(Date.now());
            that.datePicker.vModel = [
              yesterdayNow.setDate(yesterdayNow.getDate() - 1),
              now,
            ];
          },
          本周: function () {
            const weekday = now.getDay() || 7;
            const weekNow = new Date(Date.now());
            that.datePicker.vModel = [
              weekNow.setDate(weekNow.getDate() - weekday + 1),
              tomorrow,
            ];
          },
          本月: function () {
            that.datePicker.vModel = [
              moment(now).format('YYYY-MM-01 00:00:00'),
              tomorrow,
            ];
          },
        };
        timeRage[value]();
        this.filterData.startTime = moment(this.datePicker.vModel[0]).format(
          'YYYY-MM-DD 00:00:00'
        );
        this.filterData.endTime = moment(this.datePicker.vModel[1]).format(
          'YYYY-MM-DD 00:00:00'
        );
      } else {
        this.$refs.idRadio.setVModelEmpty();
        this.filterData.startTime = moment(value[0]).format(
          'YYYY-MM-DD 00:00:00'
        );
        this.filterData.endTime = moment(value[1]).format(
          'YYYY-MM-DD 00:00:00'
        );
      }
      this.$emit('transfilterData', this.filterData);
      this.getTableList();
    },
    //excel导出
    async excelTemplateDownload() {
      const params = {
        orgId: this.$store.state.user.userInfo.orgId,
        startTime: moment(this.datePicker.vModel[0]).format(
          'YYYY-MM-DD 00:00:00'
        ),
        endTime: moment(this.datePicker.vModel[1]).format(
          'YYYY-MM-DD 00:00:00'
        ),
      };
      if (this.$refs.idBar.$children[0].vModel) {
        if (this.$refs.idBar.$children[0].vModel.length === 1)
          params.containerId = this.$refs.idBar.$children[0].vModel[0];
        else if (this.$refs.idBar.$children[0].vModel.length === 2)
          params.containerId = this.$refs.idBar.$children[0].vModel[1];
        else {
          return;
        }
      } else {
        return;
      }
      this.$message.success('正在请求下载，请稍等...');
      let res = await Promise.resolve(this.getExcelTemplate(params));
      if (res.data) {
        const filename = `${this.excelName}${moment(
          this.datePicker.vModel[0]
        ).format('YYYY-MM-DD')}至${moment(this.datePicker.vModel[1]).format(
          'YYYY-MM-DD'
        )}.xlsx`;
        let blob = new Blob([res.data], {
          type: res.data.type,
        });
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrBlob(blob, filename);
        } else {
          let link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          var evt = document.createEvent('MouseEvents');
          evt.initEvent('click', false, false);
          link.dispatchEvent(evt);
          document.body.removeChild(link);
        }
      } else {
        this.$notifyError('下载失败!', '');
      }
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

  .id-radio {
    margin-right: 6px;
  }

  /deep/ .el-radio-button__inner,
  .el-radio-group {
    vertical-align: 0;
  }

  /deep/ .el-radio-button__inner {
    border: 0;
    font-size: 14px;
  }

  .id-date-picker {
    margin-right: 6px;
    width: 400px;
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

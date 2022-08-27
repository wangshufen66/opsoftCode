<template>
  <div id="containerSystemLog">
    <div class="title-wrapper">
      <!--      <Select ref="titleSelect" class="title-select"  v-model="selectResult" multiple @on-change="selectChange">-->
      <!--        <Option v-for="item in tableColumns" :disabled="selectResult.length>2&&!selectResult.includes(item.prop)" :value="item.prop" :key="item.prop">{{ item.label }}</Option>-->
      <!--      </Select>-->
      <div class="switch-wrapper">
        <el-cascader
          ref="cascaderHandle"
          v-if="false"
          size="small"
          class="switch-org"
          placeholder="切换组织"
          :options="switchOrgOptions"
          :props="{ checkStrictly: true }"
          v-model="orgSelected"
          clearable
          :show-all-levels="false"
          @change="orgSelectChange"
          @visible-change="orgSelectFinish"
        ></el-cascader>
      </div>
      <div class="filter-wrapper">
        <span
          slot="reference"
          @click="handleGetMoreSelectOpts"
          style="margin-right: 20px;cursor: pointer"
        >
          {{extraSelectionText}}
          <i
            :class="haveExtraSelection?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
          ></i>
        </span>
        <el-popover
          class="have-extra-selection"
          placement="right"
          trigger="manual"
          v-model="haveExtraSelection"
        >
          <el-select
            class="title-select"
            v-model="selectResult"
            size="small"
            placeholder="请选择"
            @change="selectChange"
          >
            <el-option
              v-for="item in tableSelectColumns"
              :key="item.prop"
              :label="item.label"
              :value="item.prop"
            />
          </el-select>
          <!--      <el-input class="title-input" placeholder="input" v-model="inputResult" size="medium"/>-->
          <el-select
            clearable
            v-if="selectResult === 'logTypeLabel'"
            class="title-select"
            v-model="logType"
            size="small"
            placeholder="请选择"
          >
            <el-option
              v-for="item in logTypeColumn"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--      <el-form v-else-if="selectResult === 'ipAddress'" :model="formData" :rules="rules">-->
          <!--        <el-form-item prop="ipAddress">-->
          <!--          <el-input clearable class="title-input" v-model="formData.inputResult" size="medium" placeholder="请输入"/>-->
          <!--        </el-form-item>-->
          <!--      </el-form>-->

          <el-input
            v-else-if="selectResult === 'ipAddress'"
            clearable
            class="title-input"
            v-model="inputResult"
            size="small"
            placeholder="请输入"
          />
          <el-input
            v-else
            clearable
            class="title-input"
            placeholder="请输入"
            v-model="inputResult"
            size="small"
          />
          <el-button
            class="searchBtn"
            circle
            type="primary"
            size="small"
            style="margin: 0 0 0.3rem 0.3rem;"
            @click="pressButton"
            icon="el-icon-search"
          ></el-button>
          <el-button
            v-if="this.$store.state.user.accessButton.indexOf('sys_log_export')!==-1"
            class="searchBtn"
            circle
            type="primary"
            size="small"
            style="margin: 0 0 0.3rem 0.3rem;"
            @click="downloadLogs"
            icon="el-icon-download"
          ></el-button>
          <div class="time-select-wrapper">
            <!-- <el-datePicker
              type="datetime"
              :transfer="true"
              v-model="startTime"
              :picker-options="pickerOptions"
              placeholder="开始时间"
              size="small"
              style="width: 150px"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
            <span>至</span>
            <el-datePicker
              type="datetime"
              :transfer="true"
              v-model="endTime"
              :picker-options="pickerOptions"
              placeholder="结束时间"
              size="small"
              style="width: 150px"
              value-format="yyyy-MM-dd HH:mm:ss"
            />-->
            <el-date-picker
              size="small"
              v-model="selectTime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              align="right"
            ></el-date-picker>
          </div>
        </el-popover>

        <el-select
          class="title-select"
          v-model="selectResult"
          size="small"
          placeholder="请选择"
          @change="selectChange"
        >
          <el-option
            v-for="item in tableSelectColumns"
            :key="item.prop"
            :label="item.label"
            :value="item.prop"
          />
        </el-select>
        <!--      <el-input class="title-input" placeholder="input" v-model="inputResult" size="medium"/>-->
        <el-select
          clearable
          v-if="selectResult === 'logTypeLabel'"
          class="title-select"
          v-model="logType"
          size="small"
          placeholder="请选择"
        >
          <el-option
            v-for="item in logTypeColumn"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!--      <el-form v-else-if="selectResult === 'ipAddress'" :model="formData" :rules="rules">-->
        <!--        <el-form-item prop="ipAddress">-->
        <!--          <el-input clearable class="title-input" v-model="formData.inputResult" size="medium" placeholder="请输入"/>-->
        <!--        </el-form-item>-->
        <!--      </el-form>-->

        <el-input
          v-else-if="selectResult === 'ipAddress'"
          clearable
          class="title-input"
          v-model="inputResult"
          size="small"
          placeholder="请输入"
        />
        <el-input
          v-else
          clearable
          class="title-input"
          placeholder="请输入"
          v-model="inputResult"
          size="small"
        />
        <!-- <div class="time-select-wrapper">
          <el-datePicker
            type="datetime"
            :transfer="true"
            v-model="startTime"
            :picker-options="pickerOptions"
            placeholder="开始时间"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
          <span style="margin: 0 0.5rem">至</span>
          <el-datePicker
            type="datetime"
            :transfer="true"
            v-model="endTime"
            :picker-options="pickerOptions"
            placeholder="结束时间"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </div>-->
        <el-button
          class="searchBtn"
          circle
          type="primary"
          size="mini"
          style="margin: 0 0 0 0.3rem;"
          @click="pressButton"
          icon="el-icon-search"
        ></el-button>
        <el-button
          v-if="this.$store.state.user.accessButton.indexOf('sys_log_export')!==-1"
          class="searchBtn"
          circle
          type="primary"
          size="mini"
          style="margin: 0 0 0 0.3rem;"
          @click="downloadLogs"
          icon="el-icon-download"
        ></el-button>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
        v-loading="tableLoading"
        :data="tableData"
        height="75vh"
        resizable
        border
        ref="gridTable"
        :header-cell-style="setTableRowStyle"
        :row-class-name="tableRowClassName"
      >
        <el-table-column align="center" type="index" width="45"></el-table-column>

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item
                class="form-item"
                :key="i"
                v-for="(n,i) in tableColumnIn"
                :label="n.label"
              >
                <span class="span-style">{{props.row[n.prop]}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          :key="item.label"
          v-for="(item) in tableColumnOut"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
        />
      </el-table>
    </div>
    <div class="page-wrapper">
      <el-pagination
        class="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageConfig.currentPage"
        :page-sizes="pageConfig.pageSizeOpts"
        :page-size="pageConfig.pageSize"
        :layout="pageConfig.layout"
        :total="pageConfig.totalSize"
      />
    </div>
    <a id="a_id" style="display:hidden"></a>
  </div>
</template>

<script>
import {
  getLogList,
  getOrgList,
  exportLogFiles,
} from "@/api/systemManagement/sysLog";

export default {
  name: "system_log",
  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.tableInOrOut();
      this.getDefaultSelect();
      this.getSelectOpts();
      this.initTable();
      // this.findOrgListFunc();
    },
    initTable() {
      this.search("drawTable");
    },
    drawTable(param) {
      this.getTableData(param);
    },

    async apiOrgList(param) {
      try {
        let res = await Promise.resolve(getOrgList(param));
        if (res.data.code !== 200) {
          this.$notify.error({
            title: "获取组织信息失败",
            message: res.data.msg,
          });
        } else {
        }
      } catch (e) {
        this.$notify.error({
          title: "访问接口失败",
          message: e,
        });
      }
    },

    async getTableData(param) {
      this.tableLoading = true;
      try {
        let res = await Promise.resolve(getLogList(param));
        if (res.data.code !== 200) {
          this.$notify.error({
            title: "获取系统日志失败",
            message: res.data.msg,
          });
        } else {
          //设置总页数
          this.pageConfig.totalSize = res.data.data.total;
          this.dataSource = res.data.data.records;
          this.tableGetPresentData();
        }
      } catch (e) {
        const errorMsg = "异常信息：" + e;
        this.$notify.error({ title: "失败", message: errorMsg });
      } finally {
        this.tableLoading = false;
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.requestCode !== 200) {
        return "error-row";
      } else {
        if (row.logType === 0) {
          return "action-row";
        } else if (row.logType === 1) {
          return "login-row";
        } else if (row.logType === 2) {
          return "cloud-box-row";
        } else if (row.logType === 3) {
          return "third-part-row";
        }
      }
      return "";
    },

    tableGetPresentData() {
      this.tableData = this.dataSource.map((item, index) => {
        switch (item.logType) {
          case 0:
            item.logTypeLabel = "操作日志";
            break;
          case 1:
            item.logTypeLabel = "登录日志";
            break;
          case 2:
            item.logTypeLabel = "云盒日志";
            break;
          case 3:
            item.logTypeLabel = "第三方接口日志";
            break;
          default:
            item.logTypeLabel = "";
        }
        if (item.requestTime === null) {
          item.requestTimeLabel = "";
        } else {
          item.requestTimeLabel = item.requestTime + " ms";
        }

        item.requestCode === 200
          ? (item.requestCodeLabel = "成功")
          : (item.requestCodeLabel = "失败");

        return item;
      });
    },
    orgSelectChange(item) {
      this.$refs.cascaderHandle.dropDownVisible = false;
      if (item.length === 0) {
        this.pressButton();
      } else {
        this.pressButton(this.orgSelected);
      }
    },
    orgSelectFinish(value) {},
    findOrgListFunc() {
      // this.containerInfosData = {}
      // this.enterpriseData = []
      // this.orgSaveObj.show = false
      // this.treeParams.text = '加载中...'
      getOrgList().then((res) => {
        if (res.status === 200 && res.data.code === 200) {
          //根据层级来限定
          // res.data.data.forEach(item=>{
          //
          // })
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
          this.switchOrgOptions = this.$utils.toTreeDataFunc(data);
          this.handleSwitchData(this.switchOrgOptions);
        } else {
          // 操作成功回调
          this.$notify({
            title: "获取企业列表失败",
            dangerouslyUseHTMLString: true,
            message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
            type: "error",
          });
        }
      });
      // .finally(() => {
      //   if (this.treeData.length <= 0) {
      //     // this.treeParams.text = '暂无数据'
      //   } else {
      //     // this.treeParams.nodeId = 1
      //     // this.containerInfosData = this.$refs.refElTree.$refs.nativeTreeMap.getNode(this.treeData[0].id).data
      //     // this.getOrgListByOrgFunc()
      //   }
      // });
    },

    handleSwitchData(data) {
      data.map((item) => {
        item.value = { id: item.id, level: item.level };
        item.label = item.name;
        if (item.children !== undefined && item.children !== []) {
          this.handleSwitchData(item.children);
        }
      });
    },

    getSelectOpts() {
      if (this.$store.state.user.userInfo.type === 0)
        this.tableSelectColumns = this.tableColumns.filter(
          (item) =>
            item.type !== "dateTime" &&
            item.prop !== "logContent" &&
            item.prop !== "requestTimeLabel" &&
            item.prop !== "requestCodeLabel" &&
            item.prop !== "loggedUsername" &&
            item.prop !== "loggedAccount"
        );
      else
        this.tableSelectColumns = this.tableColumns.filter(
          (item) =>
            item.type !== "dateTime" &&
            item.prop !== "logContent" &&
            item.prop !== "requestTimeLabel" &&
            item.prop !== "requestCodeLabel"
        );
    },
    getDefaultSelect() {
      // 先写一个简单的，这里先传一个值，将来玩复杂的就传数组
      // this.selectResult = ['logTypeLabel']
      this.selectResult = "logTypeLabel";
      // this.logType = '0'
    },
    tableInOrOut() {
      this.tableColumnIn = this.tableColumns.filter(
        (item) => item.position === "in"
      );
      this.tableColumnOut = this.tableColumns.filter(
        (item) => item.position === "out"
      );
    },
    handleSizeChange(val) {
      this.pageConfig.pageSize = val;
      this.$nextTick(() => {
        this.$refs.gridTable.bodyWrapper.scrollTop = 0;
      });
      this.search("drawTable");
    },
    handleCurrentChange(val) {
      this.pageConfig.currentPage = val;
      this.$nextTick(() => {
        this.$refs.gridTable.bodyWrapper.scrollTop = 0;
      });
      this.search("drawTable");
    },
    selectChange(val) {
      this.inputResult = "";
      // if (val.length === 1){
      //   this.$refs.titleSelect.$el.style.width = '160px'
      // }
      // if (val.length === 2){
      //   this.$refs.titleSelect.$el.style.width = '250px'
      // }
      // if (val.length === 3){
      //   this.$refs.titleSelect.$el.style.width = '340px'
      // }
      // console.log(val)
    },
    handleGetMoreSelectOpts() {
      this.haveExtraSelection = !this.haveExtraSelection;
      if (this.haveExtraSelection === true) {
        this.extraSelectionText = "关闭筛选条件";
      } else {
        this.extraSelectionText = "更多筛选条件";
      }
    },
    pressButton() {
      //写法粗糙  记得修改
      // if (
      //   this.startTime !== "" &&
      //   (this.endTime === "" || this.endTime === null)
      // ) {
      //   this.$message({
      //     message: "请选择你的结束时间",
      //     type: "warning"
      //   });
      //   return;
      // }
      // if (
      //   (this.startTime === "" || this.startTime === null) &&
      //   this.endTime !== ""
      // ) {
      //   this.$message({
      //     message: "请选择你的开始时间",
      //     type: "warning"
      //   });
      //   return;
      // }

      this.pageConfig.currentPage = 1;
      this.search("drawTable");
    },
    // 下载logs
    downloadLogs() {
      this.search("downloadLogs");
    },
    async handleDownloadLogs(param) {
      let _param = param;
      delete _param["current_page"];
      delete _param["page_size"];
      if (_param.occurredTimeStart === undefined) {
        this.$message({
          message: "请选择时间范围",
          type: "warning",
        });
      } else {
        try {
          let res = await Promise.resolve(exportLogFiles(_param));
          let blob = new Blob([res.data], {
            type: "application/vnd.ms-excel",
          });
          let link = document.getElementById("a_id");
          link.href = URL.createObjectURL(blob);
          link.download = `系统日志_${_param.occurredTimeStart}~${_param.occurredTimeEnd}.xlsx`;
          link.click();
        } catch (e) {
          this.$notify.error({
            title: "下载失败",
            message: e,
          });
        }
      }
    },
    search(type) {
      let param = {};
      try {
        //input 属性过滤
        let selectResult = this.selectResult;
        if (selectResult === "logTypeLabel") {
          selectResult = "logType";
          param.logType = this.logType;
        } else if (selectResult === "ipAddress" && this.inputResult !== "") {
          const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
          if (reg.test(this.inputResult)) {
            param.ipAddress = this.inputResult;
          } else {
            throw new Error("IP格式非法");
          }
        } else {
          param[this.selectResult] = this.inputResult;
        }

        //其余添加的属性写在这里
        // if (this.startTime !== "")
        //   param.occurredTimeStart = datetimeStdStrFormateToDatetime(
        //     this.startTime
        //   );
        // if (this.endTime !== "")
        //   param.occurredTimeEnd = datetimeStdStrFormateToDatetime(this.endTime);
        if (this.selectTime !== [] && this.selectTime !== null) {
          param.occurredTimeStart = this.selectTime[0];
          param.occurredTimeEnd = this.selectTime[1];
        }
        param.page_size = this.pageConfig.pageSize;
        param.current_page = this.pageConfig.currentPage;

        if (this.orgSelected !== "" && this.orgSelected.length !== 0) {
          if (this.orgSelected[this.orgSelected.length - 1].level >= 1) {
            param.orgId = this.orgSelected[this.orgSelected.length - 1].id;
          }
        }

        //去除对象中为空的属性
        let arr = Object.values(param);
        let list = [];
        arr.forEach((item, index) => {
          if (item === "") {
            let delV = Object.keys(param)[index];
            list.push(delV);
          }
        });
        list.forEach((item, index) => {
          delete param[item];
        });
        if (type === "drawTable") {
          this.drawTable(param);
        }
        if (type === "downloadLogs") {
          this.handleDownloadLogs(param);
        }
      } catch (e) {
        this.$message({
          message: e,
          type: "error",
          offset: 10,
        });
      }
    },
    setTableRowStyle() {
      return "background: #F8F8F9; color:#606266";
    },
  },
  data() {
    let ipValid = (rule, value, callback) => {
      const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback(new Error("请输入正确IP"));
      }
    };
    return {
      tableLoading: false,
      // 切换企业 绑定数据
      orgSelected: "",
      switchOrgOptions: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
          ],
        },
      ],
      // 是否由更多筛选条件
      haveExtraSelection: false,
      extraSelectionText: "更多筛选条件",
      wasSwitchChanged: false,
      pageConfig: {
        currentPage: 1,
        pageSizeOpts: [20, 40, 100, 200],
        pageSize: 20,
        totalSize: 0,
        layout: "total, prev, pager, next, sizes",
      },
      tableData: [],
      //日志表格数据
      dataSource: [],
      tableColumns: [
        {
          prop: "logTypeLabel",
          label: "日志类型",
          // width: '180',
          position: "out",
          type: "select",
        },
        {
          prop: "ipAddress",
          label: "IP地址",
          // width: '180',
          position: "out",
          type: "text",
        },
        {
          prop: "logContent",
          label: "日志内容",
          // width: '180',
          position: "out",
          type: "text",
        },
        {
          prop: "logMenu",
          label: "所属菜单",
          // width: '180',
          position: "in",
          type: "text",
        },
        {
          prop: "logModule",
          label: "所属模块",
          // width: '180',
          position: "in",
          type: "text",
        },
        {
          prop: "loggedAccount",
          label: "操作人账号",
          // width: '180',
          position: "in",
          type: "text",
        },
        {
          prop: "loggedUsername",
          label: "操作人名称",
          // width: '180',
          position: "out",
          type: "text",
        },
        {
          prop: "requestTimeLabel",
          label: "请求耗时",
          // width: '180',
          position: "out",
          type: "text",
        },
        {
          prop: "occurredTime",
          label: "操作时间",
          // width: '180',
          position: "out",
          type: "dateTime",
        },
        {
          prop: "requestCodeLabel",
          label: "请求状态",
          // width: '180',
          position: "in",
          type: "text",
        },
      ],
      tableSelectColumns: [],
      tableColumnOut: [],
      tableColumnIn: [],
      logTypeColumn: [
        {
          label: "操作日志",
          value: "0",
        },
        {
          label: "登录日志",
          value: "1",
        },
        // {
        //   label: "云盒日志",
        //   value: "2"
        // },
        // {
        //   label: "第三方接口日志",
        //   value: "3"
        // }
      ],

      logTypeSelect: [],
      inputResult: "",
      //目前写死的玩法，仅供日志类型选择
      logType: "",
      selectResult: "",
      startTime: "",
      endTime: "",
      // 范围 [startTime,endTime]
      selectTime: [],

      pickerOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            value() {
              return new Date();
            },
            onClick: (picker) => {},
          },
          {
            text: "昨天",
            value() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              return date;
            },
            onClick: (picker) => {},
          },
          {
            text: "一周前",
            value() {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              return date;
            },
            onClick: (picker) => {},
          },
        ],
      },
      //在这里控制输入框的可见性以及绑定数据，下面分别时选择器，时间选择器
      inputsVisible: {},
      selectVisible: {},

      datePickerVisible: {},
    };
  },
};
</script>

<style lang="less">
#containerSystemLog {
  .ivu-select-selection {
    height: 36px;
  }

  .ivu-select-multiple .ivu-tag {
    margin: 5px 4px 3px 0;
  }

  .ivu-input {
    height: 36px;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  /*.el-form-item__content{*/
  /*  line-height: 32px;*/
  /*}*/

  .el-form-item__error {
    left: -250px;
    top: 25%;
  }

  .el-table .login-row {
    background: #f0f9eb;
  }

  .el-table .action-row {
    background: white;
  }

  .el-table .third-part-row {
    background: oldlace;
  }

  .el-table .cloud-box-row {
    background: #dbf3ff;
  }

  .el-table .error-row {
    background: #ffdde2;
  }
}
</style>
<style lang="less" scoped>
::v-deep {
  .el-popover {
    right: 10px;
  }
  .el-scrollbar__wrap {
    overflow: hidden;
  }
}
.title-wrapper {
  margin: 16px 0 10px 0;
  display: flex;
  justify-content: space-between;
  ::v-deep {
    // .el-popover .el-popper {
    // }
    .el-cascader {
      .el-input__inner {
        background-color: #409eff;
        color: #fff;
      }
      .el-input__inner::placeholder {
        color: #fff;
      }
      .el-icon-arrow-down:before {
        color: #fff;
      }
      .el-icon-circle-close {
        color: #fff;
      }
    }
  }
  .switch-org {
    width: 160px;
  }

  .filter-wrapper {
    display: flex;
    margin-right: 1rem;
    span {
      line-height: 32px;
    }
    .title-select {
      width: 160px;
      margin-left: 2px;
    }

    .title-input {
      width: 180px;
      margin-left: 4px;
      margin-right: 4px;
    }

    .time-select-wrapper {
      margin: 0 2px;
      display: flex;
      span {
        margin: 0 2px;
      }
    }
  }
  .searchBtn {
    width: 32px;
    margin-right: 0.3rem;
  }
}

.form-item {
  margin: 0 3rem;
}

.pagination {
  margin-top: 1rem;
  text-align: center;
  margin-bottom: 2px;
}
</style>

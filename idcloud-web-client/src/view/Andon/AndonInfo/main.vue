<template>
  <div class="container" v-if="intent === 'table'">
    <div class="table-header-wrapper">
      <div class="table-header-left-wrapper">
        <div class="option-button-container">
          <el-button type="primary" size="small" @click="handleGoAddForm">添加</el-button>

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

          <Dropdown class="option-dropdown">
            <el-button class="option-button" size="small">
              <span>禁用</span>
              <i class="ivu-icon ivu-icon-ios-arrow-down"></i>
            </el-button>
            <DropdownMenu slot="list">
              <DropdownItem class="dropdown-line-wrapper">
                <div style="width: 100%" @click="handleTableHeadDisableClick" class="dropdown-line">禁用</div>
              </DropdownItem>
              <DropdownItem class="dropdown-line-wrapper">
                <div @click="handleTableHeadEnableClick" class="dropdown-line">反禁用</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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
          <el-option v-for="i in item.options" :key="i.value" :label="i.label" :value="i.value" />
        </el-select>
        <el-input
          v-else
          style="width: 180px; margin: 0 0.5rem 0 0.2rem"
          clearable
          size="small"
          placeholder="请输入"
          v-model.trim="search.input"
        ></el-input>
        <el-button @click="clickSearch" type="primary" size="small" icon="el-icon-search" circle></el-button>
      </div>
    </div>
    <div class="table-wrapper">
      <el-table
        v-loading="table.loading"
        height="75vh"
        :data="table.data"
        :header-cell-style="setTableRowStyle"
        border
        @row-dblclick="handleRowDbClick"
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
        <el-table-column fixed="right" header-align="center" label="操作" width="150px">
          <template slot-scope="scope">
            <div style="display: flex; justify-content: center;">
              <el-button
                plain
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                plain
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
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
  <form-view
    v-else-if="intent === 'form'"
    :formRow="form.row"
    :rowId="form.row.id"
    :formIntent="form.intent"
  ></form-view>
</template>

<script>
import {
  tableColumn,
  pickerOptions,
  fetchTable,
  batchDelAndonInfo,
  batchAuditAndonInfo,
  batchAntiAuditAndonInfo,
  batchDisableAndonInfo,
  batchAntiDisableAndonInfo,
} from "./public";
import formView from "./form";
export default {
  name: "andon_info",
  components: { formView },
  mixins: [],
  props: {},
  data() {
    return {
      activeTab: "andonInfo",
      // 'table' || 'form'
      intent: "table",
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
      form: {
        // add || edit
        intent: "",
        row: {},
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.column = tableColumn;
    this.search.select = this.column[0].desc;
    this.pickerOptions = pickerOptions;
  },
  activated() {
    this.initData();
  },
  beforeDestroy() {},
  methods: {
    handleClickRefresh() {
      this.clickSearch();
    },
    handleTableSelect(selection) {
      this.table.selectRows = selection;
    },
    handleTableSelectAll(selection) {
      this.handleTableSelect(selection);
    },
    handleRowDbClick(row) {
      this.handleEdit(1, row);
    },
    handleEdit(index, row) {
      this.form.intent = "edit";
      this.form.row = row;
      this.intent = "form";
    },
    handleDelete(index, row) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            let res = await Promise.resolve(batchDelAndonInfo([row.id]));
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
    },
    // 初始化数据
    async initData() {
      try {
        let param = {
          current_page: 1,
          page_size: this.page.size,
          orgId: this.orgId,
        };
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
    // 添加点击事件
    handleGoAddForm() {
      this.form.intent = "add";
      this.form.row = {};
      this.intent = "form";
    },
    // 表头编辑点击事件
    handleMultiEditClick() {
      if (this.table.selectRows.length == 0) {
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
        this.handleEdit(1, this.table.selectRows[0]);
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
              let res = await Promise.resolve(batchDelAndonInfo(param));
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
      if (this.table.selectRows.length == 0) {
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
          let res = await Promise.resolve(batchAuditAndonInfo(param));
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
          let res = await Promise.resolve(batchAntiAuditAndonInfo(param));
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
    // 禁用
    async handleTableHeadDisableClick() {
      if (this.table.selectRows.length == 0) {
        this.$message({
          message: "请至少选择一条数据禁用",
          type: "warning",
        });
      } else {
        try {
          let param = [];
          this.table.selectRows.forEach((i) => {
            param.push(i.id);
          });
          let res = await Promise.resolve(batchDisableAndonInfo(param));
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
    // 反禁用
    async handleTableHeadEnableClick() {
      if (this.table.selectRows.length == 0) {
        this.$message({
          message: "请至少选择一条数据反禁用",
          type: "warning",
        });
      } else {
        try {
          let param = [];
          this.table.selectRows.forEach((i) => {
            param.push(i.id);
          });
          let res = await Promise.resolve(batchAntiDisableAndonInfo(param));
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
    async getTableData() {
      try {
        let param = {
          current_page: this.page.current,
          page_size: this.page.size,
          orgId: this.orgId,
        };
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
      console.log(val);

      this.page.current = val;
      this.getTableData();
    },
    sizeChange(val) {
      this.page.current = 1;
      this.page.size = val;
      this.getTableData();
    },
    setTableRowStyle() {
      return "background: #F8F8F9; color:#606266";
    },
  },
};
</script>

<style lang="less" scoped>
@import "./style/tableHeadStyle.less";
@import "./style/style.less";
@import "../../../styles/tabStyle.less";
</style>

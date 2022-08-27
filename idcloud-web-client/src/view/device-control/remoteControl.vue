<template>
  <div class="container">
    <div class="title-wrapper">
      <div style="display: flex;">
        <div class="switch-wrapper" @click="changePageType">
          <img v-if="rootDom.type" src="@/assets/images/environmentMonitor/icon-list.png" />
          <img v-else src="@/assets/images/environmentMonitor/icon-card.png" />
        </div>
        <div
          @click="handleClickRefresh"
          style="height: 34px; line-height: 34px; margin-left: 1rem; cursor: pointer; font-size: 14px;"
        >
          <i class="el-icon-refresh-right"></i>
          <span style="margin-left: 4px;">刷新</span>
        </div>
      </div>
      <div class="search-wrapper">
        <el-select style="width: 120px" value-key="key" size="small" v-model="search.select">
          <el-option
            v-for="(item,index) in search.column"
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
        <el-input
          v-else
          style="width: 160px; margin: 0 0.5rem 0 0.2rem"
          clearable
          size="small"
          placeholder="请输入"
          v-model.trim="search.input"
        ></el-input>
        <el-button @click="clickSearch" type="primary" size="small" icon="el-icon-search" circle></el-button>
      </div>
    </div>
    <div v-if="rootDom.type" class="list-wrapper">
      <el-table
        v-loading="table.loading"
        height="76vh"
        :header-cell-style="setTableRowStyle"
        :data="table.data"
        style="width: 100%"
        border
      >
        <el-table-column align="center" type="index" width="45"></el-table-column>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="template-container">
              <div class="template-header">
                <span style="margin-right: 6px">全选开关:</span>
                <el-switch
                  @change="t =>{switchChange(t,props.row,'parent')}"
                  v-model="props.row.allCheck"
                  active-value="1"
                  inactive-value="0"
                  :disabled="props.row.list === null"
                ></el-switch>
              </div>
              <div class="template-body">
                <div v-for="(i,d) in props.row.list" :key="d" class="body-inner">
                  <span>{{i.name}}:</span>
                  <el-switch
                    @change="t =>{switchChange(t,i,'child')}"
                    v-model="i.value"
                    active-value="1"
                    inactive-value="0"
                  ></el-switch>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item,index) in table.column"
          :key="index"
          :label="item.title"
          :prop="item.key"
        ></el-table-column>
      </el-table>
    </div>
    <div v-else class="card-wrapper">
      <el-card class="the-card" v-for="(item,index) in table.data" :key="index">
        <div class="card-head-wrapper">
          <div class="the-div">
            <span>云盒代码：</span>
            <span>{{item.name}}</span>
          </div>
          <div class="the-div">
            <span>云盒型号：</span>
            <span>{{item.brandName}}</span>
          </div>
        </div>
        <div class="card-body-wrapper">
          <div class="card-allcheck-wrapper">
            <span style="margin-right: 6px">全选开关:</span>
            <el-switch
              @change="t =>{switchChange(t,item,'parent')}"
              v-model="item.allCheck"
              active-value="1"
              inactive-value="0"
              :disabled="item.list === null"
            ></el-switch>
          </div>
          <div class="card-controller-wrapper">
            <div v-for="(i,d) in item.list" :key="d" class="body-inner">
              <span>{{i.name}}:</span>
              <el-switch
                @change="t =>{switchChange(t,i,'child')}"
                v-model="i.value"
                active-value="1"
                inactive-value="0"
              ></el-switch>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>
<style lang="less" scoped>
.container {
  .title-wrapper {
    display: flex;
    justify-content: space-between;
    line-height: 33px;
    margin: 12px 0 12px 0;
    .switch-wrapper {
      width: 22px;
      line-height: 33px;
      height: 33px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;
    }
  }
  .list-wrapper {
    .template-container {
      .template-header {
        span {
          font-size: 16px;
          font-weight: 400;
          color: #1890ff;
        }
      }
      .template-body {
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        .body-inner {
          display: flex;
          justify-content: center;
          line-height: 20px;
          span {
            display: block;
            height: 20px;
            margin: auto 8px auto 0;
          }
          width: 240px;
          text-align: center;
        }
      }
    }
  }
  .card-wrapper {
    display: flex;
    flex-wrap: wrap;
    .the-card {
      width: 24.4%;
      margin-right: 0.6%;
      margin-bottom: 6px;
      min-width: 300px;
      .card-head-wrapper {
        display: flex;
        justify-content: space-between;
        padding-bottom: 12px;
        border-bottom: 1px solid #f3f3f3;
        span {
          font-size: 14px;
          font-weight: 400;
        }
        span:nth-child(1) {
          font-weight: 600;
          color: #3a3a3a;
        }
        span:nth-child(2) {
          color: #333333;
        }
      }
      .card-body-wrapper {
        margin-top: 12px;
        .card-allcheck-wrapper {
          margin-bottom: 18px;
          span {
            font-size: 16px;
            font-weight: 400;
            color: #1890ff;
          }
        }
        .card-controller-wrapper {
          display: flex;
          flex-wrap: wrap;
          .body-inner {
            display: flex;
            justify-content: center;
            line-height: 20px;
            width: 50%;
            text-align: center;
            margin-bottom: 12px;
            span {
              display: block;
              height: 20px;
              margin: auto 8px auto 0;
            }
          }
        }
      }
    }
  }
}
</style>
<script>
import { getList, useControl } from "@/api/device-control/remote-control";
export default {
  name: "remote-control",
  data() {
    return {
      rootDom: {
        // card: false , list: true  ; default: list
        type: true,
      },
      table: {
        loading: false,
        data: [],
        column: [
          {
            title: "云盒代码",
            key: "name",
          },
          {
            title: "云盒型号",
            key: "brandName",
          },
          {
            title: "创建时间",
            key: "createTime",
          },
          {
            title: "更新时间",
            key: "updateTime",
          },
        ],
      },
      page: {
        current: 1,
        total: 0,
        size: 10,
        sizes: [5, 10, 20, 50, 100],
      },
      search: {
        column: [
          {
            title: "云盒代码",
            desc: { key: "name", type: "text" },
          },
          {
            title: "云盒型号",
            desc: { key: "brandName", type: "text" },
          },
          {
            title: "创建时间",
            desc: { key: "createTime", type: "dateTime" },
          },
          {
            title: "更新时间",
            desc: { key: "updateTime", type: "dateTime" },
          },
        ],
        select: { key: "brandName", type: "text" },
        pickerOptions: {
          disabledDate(date) {
            return date && date.valueOf() > Date.now();
          },
        },
        input: "",
      },
      orgId: this.$store.state.user.userInfo.orgId,
    };
  },
  mounted() {
    this.initListData();
  },
  methods: {
    handleClickRefresh() {
      this.clickSearch();
    },
    async clickSearch() {
      try {
        const param = {
          orgId: this.orgId,
        };
        if (this.search.input !== null && this.search.input !== "") {
          if (this.search.select.type === "dateTime") {
            switch (this.search.select.key) {
              case "createTime":
                param.createTimeStart = this.search.input[0];
                param.createTimeEnd = this.search.input[1];
                break;
              case "updateTime":
                param.updateTimeStart = this.search.input[0];
                param.updateTimeEnd = this.search.input[1];
                break;
              default:
                break;
            }
          } else {
            param[this.search.select.key] = this.search.input;
          }
        }
        let res = await this.getListData(param);
        this.table.data = res.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async getListData(param) {
      try {
        this.table.loading = true;
        let res = await Promise.resolve(getList(param));
        let returnList = res;
        if (res.data.code === 200) {
          returnList.data.data.forEach((i) => {
            i.allCheck = i.allCheck + "";
            if (i.list !== null) {
              i.list.forEach((k) => {
                if (k.value == null) {
                  k.value = 0;
                }
              });
            }
          });
          return returnList;
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "warning",
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.table.loading = false;
      }
    },
    async initListData() {
      try {
        const param = {
          orgId: this.orgId,
          // current_page: 1,
          // page_size: this.page.size
        };
        let res = await this.getListData(param);
        this.table.data = res.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    switchChange(value, item, type) {
      this.$confirm("确定要进行此操作吗？请谨慎操作！", "设备控制开关操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        confirmButtonClass: "background-red",
      })
        // 确定的操作
        .then(async () => {
          try {
            let param = "";
            let _item = item;
            if (type == "parent") {
              if (_item.list !== null) {
                _item.list.forEach((i) => {
                  i.value = value + "";
                });
              }
              param = _item;
            } else {
              let parent = "";
              let x = "";
              const d = this.table.data;
              d.forEach((i) => {
                if (i.box8302Id == item.box8302Id) {
                  parent = JSON.parse(JSON.stringify(i));
                  if (parent.list !== null) {
                    parent.list.forEach((k) => {
                      if (k.id == item.id) {
                        k.value = value + "";
                        x = k;
                      }
                    });
                  }
                }
              });
              if (x !== "") {
                // parent.list = [x];
              }
              param = parent;
            }

            if (param !== "") {
              let res = await Promise.resolve(useControl(param));
              console.log(res);
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: res.data.msg,
                  type: "success",
                });
              } else {
                this.$notify.error({
                  title: "失败",
                  message: res.data.msg,
                });
              }
              await this.initListData();
            }
          } catch (e) {
            console.log(e);
          }
        })
        // 取消的操作
        .catch(() => {
          if (type === "parent") {
            this.table.data.forEach((i) => {
              // 外层使用name 作为唯一识别
              if (i.name == item.name) {
                value == "1" ? (i.allCheck = "0") : (i.allCheck = "1");
                return;
              }
            });
          } else {
            this.table.data.forEach((i) => {
              //   内层使用id 作为唯一识别
              i.list.forEach((k) => {
                if (k.id == item.id) {
                  value == "1" ? (k.value = "0") : (k.value = "1");
                }
              });
            });
          }
        });
    },
    changePageType() {
      this.rootDom.type = !this.rootDom.type;
    },
    setTableRowStyle() {
      return "background: #F8F8F9; color:#606266";
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep {
  .el-card__body {
    padding: 12px;
  }
}
</style>

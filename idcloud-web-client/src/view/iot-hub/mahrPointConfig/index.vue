<template>
  <div id="mahr-point-config-container"
       style="display: flex;flex-direction: row;margin-left:-27px">
    <id-tree
      class="main-tree"
      ref="idTree"
      v-loading="treeLoading"
      :treeData="treeData"
      :highlight-current="highlightCurrent"
      :default-expand-all="false"
      :idConfig="treeActionBar"
      @nodeClick="nodeSelectFunc"
    ></id-tree>
    <div class="right-area-container"
         style="margin-left: 10px;flex-grow: 1;">
      <div class="parent-wrapper" v-if="formIntent === 'parent'">
        <div class="parent-header-wrapper">
          <span>{{containerInfosData.name}}</span>
          <div style="display: flex">
            <el-button
              v-if="formIntent === 'parent'"
              @click="goAddInfoPoint"
              size="small"
              type="primary"
            >添加
            </el-button>
            <div
              @click="findGroupListFunc"
              style="height: 32px; line-height: 32px; margin-left: 8px; cursor: pointer; font-size: 14px; color: #266DEB;"
            >
              <i class="el-icon-refresh-right">刷新</i>
            </div>
          </div>
        </div>
        <div class="parent-body-wrapper">
          <el-card
            v-for="(item,index) in containerInfosData.mahrPointList"
            :key="index"
            class="body-card"
          >
            <div class="body-card-inner">
              <span>{{item.pointCodeName}}</span>
              <span>{{item.value}} {{item.unit}}</span>
            </div>
          </el-card>
        </div>
      </div>
      <div class="else-wrapper" v-else-if="formIntent === 'child' || formIntent === 'add'">
        <div class="else-header-wrapper">
          <span v-if="formIntent === 'child'">{{containerInfosData.pointCodeName}}</span>
          <div v-else class="new-point-wrapper">
            <el-button
              @click="formIntent = 'parent'"
              class="transparent-btn"
              size="small"
              icon="el-icon-arrow-left"
            ></el-button>
            <span>新建数据点</span>
          </div>
          <div class="btn-wrapper" style="display: flex">
            <el-button-group v-if="formIntent === 'child'">
              <el-button
                @click="goEditInfoPoint"
                size="small"
                type="primary"
              >保存
              </el-button>
              <el-button
                style="border: 1px solid #409EFF;"
                @click="goDelInfoPoint"
                size="small"
              >删除
              </el-button>
            </el-button-group>
            <el-button v-else size="small" type="primary" @click="goSaveInfoPoint">保存</el-button>
            <div
              @click="findGroupListFunc"
              style="height: 32px; line-height: 32px; margin-left: 8px; cursor: pointer; font-size: 14px; color: #266DEB;"
            >
              <i class="el-icon-refresh-right">刷新</i>
            </div>
          </div>
        </div>
        <el-form
          label-position="right"
          class="else-form"
          ref="theForm"
          label-width="100px"
          :rules="formRule"
          :model="formValidate"
        >
          <div v-for="item in formColumn" :key="item.key" class="form-inner">
            <el-form-item
              v-if="item.key !== 'mark'"
              :label="item.title"
              label-width
              :prop="item.key"
              class="form-item"
            >
              <el-input
                v-if="item.type === 'text'&&formIntent === 'add'"
                class="input"
                v-model="formValidate[item.key]"
              ></el-input>
              <el-input
                v-else-if="item.type === 'text'&&formIntent === 'child'&&item.key!=='name'"
                class="input"
                v-model="formValidate[item.key]"
              ></el-input>
              <el-input
                v-else-if="item.key ==='number' && formIntent === 'child'"
                class="input"
                v-model="formValidate[item.key]"
                disabled
              ></el-input>
              <el-input
                class="input"
                v-else-if="item.type === 'disabled'"
                disabled
                v-model="formValidate[item.key]"
              ></el-input>
              <el-input
                v-else-if="item.key ==='name' && formIntent === 'child'"
                class="input"
                v-model="formValidate[item.key]"
                disabled
              ></el-input>
              <el-select
                v-else-if="item.type === 'select'"
                class="input"
                v-model="formValidate[item.key]"
              >
                <el-option
                  v-for="i in item.options"
                  :key="i.key"
                  :label="i.label"
                  :value="i.value"
                ></el-option>
              </el-select>
              <el-input
                class="input"
                v-else-if="item.key === 'number' && formIntent === 'add'"
                readonly
                v-model="formValidate[item.key]"
              >
                <el-button
                  @click="dialogSelectClick(item)"
                  style="width: 40px"
                  icon="el-icon-more"
                  slot="append"
                ></el-button>
              </el-input>
              <div v-else-if="item.type === 'number'" class="input-num-wrapper">
                <el-input-number
                  :min="0"
                  class="input input-num"
                  :controls="false"
                  v-model="formValidate[item.key]"
                ></el-input-number>
              </div>

              <el-date-picker
                v-else-if="item.type === 'dateTime'"
                v-model="formValidate[item.key]"
                type="datetime"
                class="input"
                placeholder
                disabled
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              class="text-area-wrapper"
              :label="item.title"
              label-width
              :prop="item.key"
              v-else
            >
              <el-input
                type="textarea"
                v-if="item.type === 'textarea'"
                class="textarea"
                v-model="formValidate[item.key]"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      @open="tableFormOpenCallback"
      top="60px"
      @closed="tableFormCloseCallback"
      :title="tableDialogTitle"
      :visible.sync="tableInFormShow"
    >
      <div class="table-search-wrapper">
        <el-select
          class="search-select-style"
          size="small"
          v-model="tableInFormSelected"
          placeholder="请选择"
        >
          <el-option
            v-for="item in formTableColumn"
            v-show="item.type === 'text'"
            :key="item.key"
            :label="item.title"
            :value="item.key"
          ></el-option>
        </el-select>
        <el-input clearable class="search-input-style" size="small" v-model="tableInFormInput"></el-input>
        <el-button
          @click="handleTableInFormSearch"
          class="search-btn-style"
          type="primary"
          icon="el-icon-search"
          circle
        ></el-button>
      </div>

      <!--<el-table @row-dblclick="handleFormTableDbClick" :data="formTableData">-->
      <!--<el-table-column-->
      <!--v-for="(item,index) in formTableColumn"-->
      <!--:key="index"-->
      <!--:property="item.key"-->
      <!--:label="item.title"-->
      <!--&gt;</el-table-column>-->
      <!--</el-table>-->
      <Table border
             id="i-view-table"
             :columns="formTableColumn"
             :data="formTableData"
             @on-row-dblclick="handleFormTableDbClick"
      >
      </Table>
      <div class="pagination-style">
        <el-pagination
          @current-change="handleTableInFormChangePage"
          :current-page="tableInFormCurrentPage"
          background
          layout="total,prev, pager, next"
          :total="tableInFormTotal"
        ></el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getList,
    addOne,
    deleteOne,
    updateOne,
    getInfoPoint,
  } from "@/api/iot-hub/mahrPointConfig";
  import infoPointColumns from "../infoPointColumns";
  import IdTree from "@/components/id-tree/index";
  import {configBase} from "@/components/id-tree/idTreeConfig";

  export default {
    name: "mahr_infopoints_config",
    components: {IdTree},
    watch: {
      formIntent(n) {
        if (n === "add") {
          this.formValidate = {
            escapeOff: "",
            escapeOn: "",
            hisCodeId: 0,
            mark: "",
            name: "",
            number: "",
            sort: 0,
            style: "",
            collectTime: "",
            unit: "",
          };
          this.formColumn = [
            {
              title: "数据点代码",
              key: "number",
              width: "250",
              type: "dialogTable",
            },
            {
              title: "数据点描述",
              key: "name",
              width: "250",
              type: "text",
            },
            {
              title: "排序",
              key: "sort",
              width: "250",
              type: "number",
            },
            {
              title: "字段ID",
              key: "hisCodeId",
              width: "250",
              type: "number",
            },
            {
              title: "显示单位",
              key: "unit",
              width: "250",
              type: "disabled",
            },
            {
              title: "显示样式",
              key: "style",
              width: "250",
              type: "select",
              options: [
                {
                  label: "默认",
                  value: "1",
                },
                {
                  label: "电表",
                  value: "2",
                },
                {
                  label: "水表",
                  value: "3",
                },
                {
                  label: "气表 ",
                  value: "4",
                },
                {
                  label: "温度",
                  value: "5",
                },
                {
                  label: "湿度",
                  value: "6",
                },
                {
                  label: "燃气",
                  value: "7",
                },
              ],
            },
            {
              title: "备注信息",
              key: "mark",
              width: "250",
              type: "textarea",
            },
          ];
        } else {
          this.formColumn = [
            {
              title: "数据点代码",
              key: "number",
              width: "250",
              type: "dialogTable",
            },
            {
              title: "数据点描述",
              key: "name",
              width: "250",
              type: "text",
            },
            {
              title: "排序",
              key: "sort",
              width: "250",
              type: "number",
            },
            {
              title: "字段ID",
              key: "hisCodeId",
              width: "250",
              type: "number",
            },
            {
              title: "显示单位",
              key: "unit",
              width: "250",
              type: "disabled",
            },
            {
              title: "显示样式",
              key: "style",
              width: "250",
              type: "select",
              options: [
                {
                  label: "默认",
                  value: "1",
                },
                {
                  label: "电表",
                  value: "2",
                },
                {
                  label: "水表",
                  value: "3",
                },
                {
                  label: "气表 ",
                  value: "4",
                },
                {
                  label: "温度",
                  value: "5",
                },
                {
                  label: "湿度",
                  value: "6",
                },
                {
                  label: "燃气",
                  value: "7",
                },
              ],
            },
            {
              title: "采集时间",
              key: "collectTime",
              width: "250",
              type: "dateTime",
            },
            {
              title: "",
              key: "s1",
              type: "space",
            },
            {
              title: "",
              key: "s2",
              type: "space",
            },
            {
              title: "备注信息",
              key: "mark",
              width: "250",
              type: "textarea",
            },
          ];
        }
      },
    },
    data() {
      return {
        nearestParentData: "",

        mahrRowSelected: "",
        connRowSelected: "",
        tableDialogTitle: "选择量具品牌",
        // 通过什么打开了表格弹窗
        tableOpenInfo: "",
        formTableData: [],
        tableInFormTotal: 0,
        tableInFormCurrentPage: 1,
        tableInFormShow: false,
        // 搜索框设置默认值
        tableInFormSelected: "number",
        tableInFormInput: "",
        formTableColumn: "",

        formColumn: [
          {
            title: "数据点代码",
            key: "number",
            width: "250",
            type: "dialogTable",
          },
          {
            title: "数据点描述",
            key: "name",
            width: "250",
            type: "text",
          },
          {
            title: "排序",
            key: "sort",
            width: "250",
            type: "number",
          },
          {
            title: "字段ID",
            key: "hisCodeId",
            width: "250",
            type: "number",
          },
          {
            title: "显示单位",
            key: "unit",
            width: "250",
            type: "text",
          },
          {
            title: "显示样式",
            key: "style",
            width: "250",
            type: "select",
            options: [
              {
                label: "默认",
                value: "1",
              },
              {
                label: "电表",
                value: "2",
              },
              {
                label: "水表",
                value: "3",
              },
              {
                label: "气表 ",
                value: "4",
              },
              {
                label: "温度",
                value: "5",
              },
              {
                label: "湿度",
                value: "6",
              },
              {
                label: "燃气",
                value: "7",
              },
            ],
          },
          {
            title: "采集时间",
            key: "collectTime",
            width: "250",
            type: "dateTime",
          },
          {
            title: "备注信息",
            key: "mark",
            width: "250",
            type: "textarea",
          },
        ],
        formValidate: {
          escapeOff: "",
          escapeOn: "",
          hisCodeId: 0,
          mark: "",
          name: "",
          number: "",
          sort: 0,
          style: "",
          collectTime: "",
          unit: "",
        },
        formRule: {
          number: [{required: true, message: "此项不能为空", trigger: "blur"}],
          name: [{required: true, message: "此项不能为空", trigger: "blur"}],
          sort: [{required: true, message: "此项不能为空", trigger: "blur"}],
          hisCodeId: [
            {required: true, message: "此项不能为空", trigger: "blur"},
          ],
        },
        // parent / add / child / ''
        formIntent: "",

        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configBase, //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据
        containerInfosData: {}, //树形目录当前选中数据
        orgId: this.$store.state.user.userInfo.orgId,
      };
    },
    created() {
    },
    mounted() {
      this.findGroupListFunc();
    },
    methods: {
      dialogSelectClick(item) {
        this.tableInFormShow = true;
        this.tableOpenInfo = item;
      },
      handleTableInFormChangePage(page) {
        this.tableInFormCurrentPage = page;
        this.tableFormOpenCallback();
      },
      handleTableInFormSearch() {
        let param = {
          orgId: this.orgId,
          current_page: this.tableInFormCurrentPage,
          page_size: 10,
        };
        if (this.tableInFormInput !== "") {
          param[this.tableInFormSelected] = this.tableInFormInput;
        }

        this.getTableInFormData(param);
      },
      tableFormCloseCallback() {
        this.tableInFormCurrentPage = 1;
      },
      tableFormOpenCallback() {
        const param = {
          orgId: this.orgId,
          current_page: this.tableInFormCurrentPage,
          page_size: 10,
        };
        this.getTableInFormData(param);
      },
      async getTableInFormData(param) {
        try {
          this.tableDialogTitle = "选择数据点";
          this.formTableColumn = infoPointColumns;
          let res = await Promise.resolve(getInfoPoint(param));

          if (res.data.code === 200) {
            this.formTableData = res.data.data.records;
            this.tableInFormTotal = res.data.data.total;
          } else {
            this.$notify({
              title: "错误",
              message: res.data.msg,
              type: "error",
            });
          }
        } catch (e) {
          this.$notify({
            title: "错误",
            message: e,
            type: "error",
          });
        }
      },
      handleFormTableDbClick(row) {
        this.tableSelectedRow = row;
        this.formValidate.number = row.number;
        this.formValidate.name = row.name;
        this.formValidate.unit = row.unitName;
        this.tableInFormShow = false;
      },

      goAddInfoPoint() {
        this.formIntent = "add";
      },
      goSaveInfoPoint() {
        try {
          this.$refs.theForm.validate(async (valid) => {
            if (valid) {
              const param = {
                orgId: this.orgId,
                mahrId: this.containerInfosData.mahrId,
                ...this.formValidate,
                pointCodeId: this.tableSelectedRow.id,
              };
              delete param.collectTime;
              let res = await Promise.resolve(addOne(param));
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: res.data.msg,
                  type: "success",
                });
                await this.findGroupListFunc();
                this.formIntent = "parent";
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "warning",
                });
              }
            } else {
              this.$message({
                message: "请根据表单提示完成表单",
                type: "warning",
              });
              return false;
            }
          });
        } catch (e) {
          this.$notify({
            title: "错误",
            message: e,
            type: "error",
          });
        }
      },
      goEditInfoPoint() {
        try {
          this.$refs.theForm.validate(async (valid) => {
            if (valid) {
              const param = {
                orgId: this.orgId,
                mahrId: this.containerInfosData.mahrId,
                ...this.formValidate,
                id: this.containerInfosData.id,
              };
              delete param.collectTime;
              let res = await Promise.resolve(updateOne(param));
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: res.data.msg,
                  type: "success",
                });

                await this.findGroupListFunc();
                this.formIntent = "child";
              } else {
                this.$notify({
                  title: "失败",
                  message: res.data.msg,
                  type: "warning",
                });
              }
            } else {
              this.$message({
                message: "请根据表单提示完成表单",
                type: "warning",
              });
              return false;
            }
          });
        } catch (e) {
          this.$notify({
            title: "错误",
            message: e,
            type: "error",
          });
        }
      },
      async goDelInfoPoint() {
        try {
          let res = await Promise.resolve(
            deleteOne([this.containerInfosData.id])
          );
          if (res.data.code === 200) {
            this.$notify({
              title: "成功",
              message: res.data.msg,
              type: "success",
            });
            this.findGroupListFunc();
            this.containerInfosData = this.nearestParentData;
            this.formIntent = "parent";
          } else {
            this.$notify({
              title: "失败",
              message: res.data.msg,
              type: "warning",
            });
          }
        } catch (e) {
          this.$notify({
            title: "失败",
            message: e,
            type: "warning",
          });
        }
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        await getList({orgId: this.$store.state.user.userInfo.orgId})
          .then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              const _d = res.data.data;
              let _treeData = [];
              _d.forEach((item) => {
                if (item.list !== null) {
                  item.list.forEach((i) => {
                    i.originName = i.name;
                    i.number = i.pointCodeNumber;
                    i.name = i.pointCodeName;
                    i.treeType = "child";
                  });
                }
                item.children = item.list;
                item.treeType = "parent";
                _treeData.push(item);
                this.treeData = _treeData;
              });
            } else {
              this.$notifyError("获取失败", res.data.msg);
            }
          }).catch((e) => {
            this.$notifyError("失败", e);
          }).finally(() => {
            if (this.treeData.length > 0) {
              this.$nextTick(() => {
                if (document.querySelector('.el-tree-node__content') !== null)
                  document.querySelector('.el-tree-node__content').click();
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
          this.formIntent = "";
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          if (data.treeType === "child") {
            this.formIntent = "child";
            this.formValidate = {
              escapeOff: data.escapeOff,
              escapeOn: data.escapeOn,
              hisCodeId: data.hisCodeId,
              mark: data.mark,
              name: data.name,
              number: data.number,
              sort: data.sort,
              style: data.style,
              collectTime: data.collectTime,
              unit: data.unit,
            };
            // this.formValidate = {
            //   escapeOff: this.containerInfosData.escapeOff,
            //   escapeOn: this.containerInfosData.escapeOn,
            //   hisCodeId: this.containerInfosData.hisCodeId,
            //   mark: this.containerInfosData.mark,
            //   name: this.containerInfosData.name,
            //   number: this.containerInfosData.number,
            //   sort: this.containerInfosData.sort,
            //   style: this.containerInfosData.style,
            //   value: this.containerInfosData.value,
            //   unit: this.containerInfosData.unit
            // };
          } else if (data.treeType === "parent") {
            this.nearestParentData = data;
            this.nearsetParentNode = node;
            this.formIntent = "parent";
          }
        }
      },
    },
  };
</script>
<style lang="less" scoped>
  ::v-deep {

    .el-icon-more {
      position: relative;
      right: 7px;
    }
  }

  .input-num-wrapper {
    ::v-deep {
      .el-input__inner {
        text-align: right;
      }
    }
  }

  #mahr-point-config-container {
    .right-area-container {
      .parent-wrapper {
        .parent-header-wrapper {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;

          span {
            font-size: 24px;
            font-weight: 500;
            color: #4f4f4f;
            line-height: 33px;
          }
        }

        .parent-body-wrapper {
          margin: 2rem 0 0 0;
          width: 100%;
          display: flex;
          flex-wrap: wrap;

          .body-card {
            margin-right: 1%;
            width: 32%;
            height: 72px;
            margin-bottom: 1rem;

            .body-card-inner {
              display: flex;
              justify-content: space-between;

              span:nth-child(1) {
                font-size: 20px;
                font-weight: 400;
                color: #595959;
                line-height: 28px;
              }

              span:nth-child(2) {
                font-size: 20px;
                font-weight: 500;
                text-align: right;
                color: #000000;
                line-height: 28px;
                letter-spacing: 0px;
              }
            }
          }
        }
      }

      .else-wrapper {
        .else-header-wrapper {
          display: flex;
          justify-content: space-between;
          margin: 1rem 0 2rem 0;

          span {
            height: 32px;
            font-size: 24px;
            font-weight: 500;
            color: #4f4f4f;
            line-height: 32px;
            margin: auto 0;
          }

          .new-point-wrapper {
            line-height: 36px;

            .transparent-btn {
              margin-right: 1rem;
              position: relative;
              top: 1px;
              border: 1px transparent;
              padding: 0 0;

              ::v-deep {
                .el-icon-arrow-left {
                  font-size: 24px;
                }
              }
            }
          }
        }

        .else-form {
          display: flex;
          flex-wrap: wrap;

          .form-inner {
            width: 33%;

            .form-item {
              // display: flex;
              width: 100%;

              .input {
                width: 60%;
              }
            }
          }
        }
      }
    }
  }

  .text-area-wrapper {
    display: flex;
    width: 300%;

    ::v-deep .el-form-item__content {
      width: 86.5%;
      margin-left: 0 !important;
    }

    .textarea {
      width: 100%;
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

  #i-view-table {
    /deep/ .ivu-icon-ios-arrow-down {
      display: none
    }

    //特殊处理
  }
</style>

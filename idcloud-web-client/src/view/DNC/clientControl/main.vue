<template>
  <div class="container"
       style="display: flex;flex-direction: row;margin-left:-27px">
    <id-tree
      class="main-tree"
      ref="idTree"
      v-loading="treeLoading"
      :treeData="treeData"
      :highlight-current="highlightCurrent"
      :idConfig="treeActionBar"
      @nodeClick="nodeSelectFunc"
    ></id-tree>
    <div style="margin-left: 10px;flex-grow: 1;width: 0">
      <div class="table-header-wrapper">
        <div class="table-header-left-wrapper">
          <div class="option-button-container">
            <div
              @click="findGroupListFunc"
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
            <el-option
              v-for="i in item.options"
              :key="i.value"
              :label="i.label"
              :value="i.value"
            />
          </el-select>
          <el-input
            v-else
            style="width: 180px; margin: 0 0.5rem 0 0.2rem"
            clearable
            size="small"
            placeholder="请输入"
            v-model.trim="search.input"
          ></el-input>
          <el-button
            @click="clickSearch"
            type="primary"
            size="small"
            icon="el-icon-search"
            circle
          ></el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table
          v-loading="table.loading"
          height="75vh"
          :data="table.data"
          :header-cell-style="setTableRowStyle"
          border
        >
          <el-table-column align="center" type="index" width="45"></el-table-column>

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
  </div>
</template>

<script>
  import {tableColumn, pickerOptions, fetchTable, cncColumn} from "./public";
  import {
    getGroupList,
    delGroup,
    getGroupDetail,
  } from "@/api/factoryModel/group";
  import {getTree, getTableList} from "@/api/DNC/clientControl";
  import IdTree from "@/components/id-tree/index";
  import {configBase} from "@/components/id-tree/idTreeConfig";

  export default {
    name: "client_control",
    components: {IdTree},
    mixins: [],
    props: {},
    data() {
      return {
        orgId: this.$store.state.user.userInfo.orgId,
        column: [],
        table: {
          data: [],
          loading: false,
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

        //树形列表相关
        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configBase, //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据
        containerInfosData: {}, //树形目录当前选中数据
      };
    },
    computed: {},
    watch: {},
    created() {
    },
    mounted() {
      this.column = cncColumn;
      this.search.select = this.column[0].desc;
      this.pickerOptions = pickerOptions;
    },
    activated() {
      this.findGroupListFunc();
    },
    beforeDestroy() {
    },
    methods: {
      // 点击搜索事件
      clickSearch() {
        this.page.current = 1;
        this.getTableData();
      },
      // 初始化数据
      async initData() {
        try {
          let param = {
            current_page: 1,
            page_size: this.page.size,
            orgId: this.orgId,
          };
          if (this.containerInfosData.cncBrandId !== undefined)
            param.cncBrandId = this.containerInfosData.cncBrandId;
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
      async getTableData() {
        try {
          let param = {
            current_page: this.page.current,
            page_size: this.page.size,
            orgId: this.orgId,
          };
          if (this.containerInfosData.cncBrandId !== undefined)
            param.cncBrandId = this.containerInfosData.cncBrandId;
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
        this.page.current = val;
        this.getTableData();
      },
      sizeChange(val) {
        this.page.current = 1;
        this.page.size = val;
        this.getTableData();
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        await getTree({orgId: this.orgId}).then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            let data = [
              {
                name: res.data.data[0].name,
                id: 0,
                level: 0,
                children: [],
                expand: true,
              },
            ];
            res.data.data[0].list.forEach((i, index) => {
              data[0].children.push({
                expand: true,
                id: index + 1,
                cncBrandId: i.cncBrandId,
                name: i.name,
              });
            });
            this.treeData = data;
          } else {
            this.$notifyError("获取树形列表失败", res.data.msg);
          }
        }).finally(() => {
          if (this.treeData.length > 0) {
            this.$nextTick(() => {
              let isFirstSelect = false;
              if (this.containerInfosData.id !== undefined) {
                const nodeAll = document.querySelectorAll('.node-unselected');
                let that = this;
                [].forEach.call(nodeAll, function (div) {
                  if (div.firstElementChild.title === that.containerInfosData.name) {
                    div.click();
                    isFirstSelect = true;
                  }
                });
              }
              if (!isFirstSelect) {
                if (document.querySelector('.el-tree-node__content') !== null)
                  document.querySelector('.el-tree-node__content').click();
              }
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
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          this.initData();
        }
      },
      setTableRowStyle() {
        return "background: #F8F8F9; color:#606266";
      },
    },
  };
</script>

<style lang="less" scoped>
  @import "../tableHeadStyle.less";
  @import "../style.less";
</style>

<template>
  <!--column设置fixed的时候在所有列列宽不够时，就会多出一列BUG列（请用最后一列的宽度——设到最大，进行补足）-->
  <el-table
    class="id-table"
    :data="tableData"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-table-column
      v-if="index"
      label="#"
      fixed="left"
      align="center"
      width="55"
      type="index"
      :resizable="false"
    >
    </el-table-column>
    <el-table-column
      v-if="selection"
      fixed="left"
      align="center"
      width="45"
      type="selection"
      :resizable="false"
    >
    </el-table-column>
    <!--:key="item.prop"-->
    <component
      v-for="item in columns"
      :key="item.prop"
      :is="item.tag"
      v-bind="item"
      v-on="$listeners"
    >
    </component>
    <el-table-column
      v-if="customAction"
      label="操作"
      fixed="right"
      align="center"
      :width="customWidth"
      :resizable="false"
    >
      <template v-slot:default="{ row, column, index }">
        <slot name="action" :row="row" :column="column" :index="index"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="less" scoped>
.id-table {
  /*overflow: auto;*/
  //el-table 样式修复——————————————————————————————
  /deep/ .el-table__header-wrapper {
    .has-gutter {
      .gutter {
        display: block !important;
      }
    }
  }

  ::v-deep th {
    background-color: #f7f7f8;
  }

  //直接给el-tree样式中定义高度 导致的问题
  /*/deep/ .el-table__fixed {*/
  /*height: 100% !important;*/
  /*}*/

  /*/deep/ .el-table__fixed-right {*/
  /*height: 100% !important;*/
  /*}*/

  /*/deep/ .el-table__body-wrapper {*/
  /*height: calc(~"100% - 48px");*/
  /*}*/

  //-------------------------------------------------
  /deep/ .el-table-column--selection {
    text-align: center;
  }

  //样式处理
  /deep/ .id-el-dropdown {
    .id-el-dropdown-button {
      border: 1px solid #c6e2ff;
    }
  }
}
</style>
<script>
import ElTableColumnTemplate from "./ElTableColumnTemplate";
import ElTableColumnStatusName from "./ElTableColumnStatusName";
import ElTableColumnColumn from "./ElTableColumnColumn";
import ElTableColumnRoleList from "./ElTableColumnRoleList";
import ElTableColumnButton from "./ElTableColumnButton";
import ElTableColumnSwitch from "./ElTableColumnSwitch";

export default {
  name: "id-table",
  components: {
    ElTableColumnTemplate,
    ElTableColumnStatusName,
    ElTableColumnColumn,
    ElTableColumnRoleList,
    ElTableColumnButton,
    ElTableColumnSwitch
  },
  props: {
    tableData: {
      type: Array,
      default() {
        return [
          // {
          //   id: 1,
          //   date: "2016-05-02",
          //   name: "王小虎",
          //   province: "上海",
          //   city: "普陀区",
          //   address: "上海市普陀区金沙江路 1518 弄",
          //   zip: 200333,
          // },
          // {
          //   id: 2,
          //   date: "2016-05-04",
          //   name: "王小虎",
          //   province: "上海",
          //   city: "普陀区",
          //   address: "上海市普陀区金沙江路 1517 弄",
          //   zip: 200333,
          // },
          // {
          //   id: 3,
          //   date: "2016-05-01",
          //   name: "王小虎",
          //   province: "上海",
          //   city: "普陀区",
          //   address: "上海市普陀区金沙江路 1519 弄",
          //   zip: 200333,
          // },
          // {
          //   id: 4,
          //   date: "2016-05-03",
          //   name: "王小虎",
          //   province: "上海",
          //   city: "普陀区",
          //   address: "上海市普陀区金沙江路 1516 弄",
          //   zip: 200333,
          // },
        ];
      }
    },
    columns: {
      type: Array,
      default() {
        return [
          // {
          //   tag: "el-table-column",
          //   // fixed: 'left',
          //   type: "index",
          //   label: "#",
          //   width: 35,
          // },
          // {
          //   tag: "el-table-column",
          //   // fixed: true,
          //   type: "selection",
          //   width: 45,
          // },
          // {
          //   tag: "el-table-column-template",
          //   // label: "",
          //   width: 50,
          //   type: "expand",
          //   component: {
          //     tag: "template-el-form",
          //   },
          // },
          // {
          //   tag: "el-table-column",
          //   prop: "date",
          //   sortable: true,
          //   label: "日期",
          //   width: 150,
          // },
          // {
          //   tag: "el-table-column-template",
          //   prop: "name",
          //   label: "姓名",
          //   width: 120,
          //   sortable: true,
          //   component: {
          //     tag: "el-tag",
          //   },
          // },
          // {
          //   tag: "el-table-column",
          //   prop: "city",
          //   label: "市区",
          //   width: 120,
          // },
          // {
          //   tag: "el-table-column",
          //   prop: "zip",
          //   label: "邮编",
          //   width: "120",
          //   formatter: function formatter(row, column) {
          //     //格式转换
          //     return row.zip.toFixed(3);
          //   },
          // },
          // {
          //   tag: "el-table-column",
          //   prop: "zip",
          //   label: "邮编",
          //   width: "120",
          //   formatter: function formatter(row, column) {
          //     //格式转换
          //     return row.zip.toFixed(3);
          //   },
          // },
          // {
          //   tag: "el-table-column-template",
          //   fixed: "right",
          //   label: "操作",
          //   width: 140,
          //   component: {
          //     tag: "id-action-bar",
          //     idConfig: [
          //       {
          //         tag: "id-dropdown",
          //         text: "操作",
          //         styleOne: false,
          //         type: "primary",
          //         plain: true,
          //         authority: {
          //           idLoad: false,
          //           idIf: true,
          //           idDisable: false,
          //           idShow: true,
          //         },
          //         childButton: [
          //           {
          //             text: "编辑",
          //             target: "edit",
          //             authority: {
          //               idLoad: false,
          //               idIf: true,
          //               idDisable: false,
          //               idShow: true,
          //             },
          //           },
          //           {
          //             text: "其他",
          //             target: "other",
          //             authority: {
          //               idLoad: false,
          //               idIf: true,
          //               idDisable: false,
          //               idShow: true,
          //             },
          //           },
          //         ],
          //       },
          //       {
          //         tag: "id-button",
          //         classKey: "cut",
          //         text: "删除",
          //         type: "danger",
          //         plain: true,
          //         target: "cut",
          //         authority: {
          //           idLoad: false,
          //           idIf: true,
          //           idDisable: false,
          //           idShow: true,
          //         },
          //       },
          //     ],
          //     actionButtonSize: "mini",
          //   },
          // },
        ];
      }
    },
    index: { type: Boolean, default: true },
    selection: { type: Boolean, default: true },
    customAction: { type: Boolean, default: false },
    customWidth: { type: String, default: "90px" }
  }
};
</script>

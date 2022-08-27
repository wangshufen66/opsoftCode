<template>
  <div class="id-tree">
    <div
      class="side"
      @click="
        actionHandle(isMain ? treeSideRetract.target : treeSideUnfold.target)
      "
      style="border-bottom-left-radius: 10px; border-top-left-radius: 10px"
    >
      <!--
      :style="
        isMain
          ? {
              'border-bottom-left-radius': '10px',
              'border-top-left-radius': '10px',
            }
          : { 'border-radius': '10px' }
      "
      -->
      {{ isMain ? treeSideRetract.text : treeSideUnfold.text }}
      <i :class="isMain ? treeSideRetract.i : treeSideUnfold.i"></i>
      <transition name="side">
        <div v-show="!isMain">
          {{ treeSelectData[props.label] }}
        </div>
      </transition>
    </div>
    <transition name="main">
      <div class="id-tree-main" v-show="isMain">
        <id-action-bar
          v-show="isAction"
          :idConfig="idConfig"
          @click="actionHandle"
        ></id-action-bar>
        <el-input
          v-show="!isAction"
          class="id-el-input"
          placeholder="按回车进行筛选"
          v-model="filterText"
          @keyup.enter.native="callTreeFilterFunc"
        >
          <!--@focus="clickOtherPlace"
          @blur="clickOtherPlace"-->
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="
              isAction = true;
              filterText = '';
            "
          >
          </i>
        </el-input>
        <el-tree
          class="id-el-tree"
          ref="elTree"
          :data="treeData"
          :highlight-current="highlightCurrent"
          :draggable="draggable"
          :nodeKey="nodeKey"
          :emptyText="emptyText"
          :expandOnClickNode="expandOnClickNode"
          :defaultExpandAll="defaultExpandAll"
          :currentNodeKey="currentNodeKey"
          :props="props"
          :filter-node-method="filterNode"
          @node-click="nodeSelectFunc"
          @node-drop="nodeDropFunc"
        >
          <!--@node-contextmenu="rightClickFunc"-->
        </el-tree>
        <!--<el-menu id="tree-menu" class="id-el-menu" v-show="menuVisible">-->
          <!--<el-menu-item-->
            <!--v-for="(item, index) in idConfig"-->
            <!--v-show="item.target !== 'treeSearch'"-->
            <!--:key="index"-->
            <!--class="menu_item"-->
            <!--v-text="item.title"-->
            <!--@click="actionHandle(item.target)"-->
          <!--&gt;</el-menu-item>-->
        <!--</el-menu>-->
      </div>
    </transition>
  </div>
</template>
<style lang="less" scoped>
  //树的样式 没有特别地方不做样式抽离
  .id-tree {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: flex-start;
    //按钮展开
    .side {
      width: 28px;
      border: 1px #c4c4c4 solid;
      padding: 14px 5px 14px 5px;
      cursor: pointer;
      background-color: white;
      /*border-bottom-left-radius: 10px;*/
      /*border-top-left-radius: 10px;*/
      word-break: break-all;
    }

    //树形目录主体
    .id-tree-main {
      border: 1px #c4c4c4 solid;
      padding-top: 1px; //样式修复处理
      width: 202px;
      height: calc(~"100vh - 130px");

      //工具栏样式的特殊处理
      .action-bar {
        height: 35px;
        margin-left: 0;
        justify-content: flex-start;
        background-color: white;
        align-items: center;

        /deep/ .id-button-after-icon {
          font-size: 18px;
          font-weight: bold;
        }

        /deep/ .icon-button-space {
          margin-left: 13px;
        }
      }

      //搜索框样式处理
      .el-input {
        height: 35px;

        /deep/ .el-input__inner {
          border: 0;
          height: 35px;
          line-height: 35px;
        }

        /deep/ .el-input__icon {
          font-size: 18px;
          font-weight: bold;
          color: #606266;
          line-height: 35px;
        }
      }

      //树样式处理
      .id-el-tree {
        width: 200px;
        padding-top: 8px;
        border-top: 1px #c4c4c4 solid;
        height: calc(~"100vh - 170px");
        overflow: auto;

        /deep/ .el-tree-node__label {
          font-size: 12px;
        }

        /deep/ .el-tree-node__content {
          width: 300px;
        }

        /deep/ .el-tree-node {
          width: 300px;
        }

        /deep/ .el-tree-node:focus > .el-tree-node__content {
          background-color: transparent;
        }
      }

      .el-tree--highlight-current {
        /deep/ .el-tree-node.is-current > .el-tree-node__content {
          background-color: #e5f6fe;
          border-left: 1px skyblue solid;
        }
      }

      //滑动工具条优化
      /deep/ ::-webkit-scrollbar {
        display: none;
      }
    }

    //滑动工具条优化
    .id-tree-main:hover {
      /deep/ ::-webkit-scrollbar {
        display: inline-block;
        border-radius: 5px;
        width: 3px;
        height: 5px;
      }

      /deep/ ::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
      }

      /deep/ ::-webkit-scrollbar-track {
        background-color: #f3f3f3;
      }
    }

    //邮件菜单栏
    .id-el-menu {
      position: absolute;
      border: 1px solid lightskyblue;
      cursor: auto;
      border-radius: 10px;
      text-align: center;
      width: auto;
      z-index: 9999;

      .menu_item {
        border-radius: 10px;
        width: auto;
      }
    }

    //树的动画效果
    .main-enter-active,
    .main-leave-active {
      transition: all 0.5s ease;
      opacity: 1;
      width: 200px;

      .action-bar {
        opacity: 0;
      }

      .id-el-tree {
        opacity: 0;
      }
    }

    .main-enter,
    .main-leave-to {
      width: 0;

      .action-bar {
        opacity: 0;
      }

      .id-el-tree {
        width: 0;
      }
    }

    //侧栏动画效果
    .side-enter-active,
    .side-leave-active {
      transition: all 1.5s ease;
      height: auto;
      opacity: 1;
    }

    .side-enter,
    .side-leave-to {
      transition: all 0.5s ease;
      height: 0;
      opacity: 0;
    }
  }
</style>
<script>
  import IdActionBar from "../id-action-bar/index";
  import IdButtonConfig from "../id-button/IdButtonConfig";

  export default {
    name: "id-tree",
    components: {IdActionBar},
    created() {
      let that = this;
      this.execute = {
        treeSearch: function () {
          that.isAction = false;
        },
        unfold: function () {
          that.isMain = true;
        },
        retract: function () {
          if (that.treeSelectData !== "") that.isMain = false;
        },
        treeOpen: function () {
          that.openAll();
        },
        treeClose: function () {
          that.closeAll();
        },
        treeAdd: function () {
          that.$emit("treeAdd");
        },
        treeDelete: function () {
          that.$emit("treeDelete");
        },
        treeEdit: function () {
          that.$emit("treeEdit");
        },
        treeRefresh: function () {
          that.$emit("treeRefresh");
        },
      };
      // document.addEventListener("click", this.clickOtherPlace);
    },
    beforeDestroy() {
      // document.removeEventListener("click", this.clickOtherPlace);
    },
    props: {
      //配置层
      nodeKey: {type: String, default: "id"},
      emptyText: {type: String, default: "暂无数据"},
      expandOnClickNode: {type: Boolean, default: false},
      defaultExpandAll:{type: Boolean, default:true},
      currentNodeKey: {type: Number, default:1},
      props: {
        type: Object,
        default() {
          return {
            label: "name",
          };
        },
      },//树形目录的配置=>对照element ui的api看
      //特别配置来源 =》 希望treeConfig中内容可以不用配置，单纯用以下特别配置即可完成要求
      highlightCurrent: {type: Boolean, default: false},//特别配置  =》选中行是否高亮
      draggable: {type: Boolean, default: false}, //特别配置  =》是否能拖拽
      idConfig: {
        type: Array,
        default() {
          return [
            new IdButtonConfig("tree-open", "", "treeOpen", {
              tag: "id-button",
              styleTwo: true,
              afterIf: true,
              afterClass: "el-icon-caret-bottom",
              title: "全部展开",
            }),
            new IdButtonConfig("tree-open", "", "treeClose", {
              tag: "id-button",
              styleTwo: true,
              afterIf: true,
              afterClass: "el-icon-caret-top",
              title: "全部收起",
            }),
            new IdButtonConfig("tree-add", "", "treeAdd", {
              tag: "id-button",
              styleTwo: true,
              afterIf: true,
              title: "新增",
              afterClass: "el-icon-plus",
            }),
            new IdButtonConfig("tree-delete", "", "treeDelete", {
              tag: "id-button",
              styleTwo: true,
              afterIf: true,
              afterClass: "el-icon-minus",
              title: "删除",
            }),
            new IdButtonConfig("tree-edit", "", "treeEdit", {
              tag: "id-button",
              styleTwo: true,
              afterIf: true,
              afterClass: "el-icon-edit",
              title: "编辑",
            }),
            new IdButtonConfig("tree-search", "", "treeSearch", {
              tag: "id-button",
              styleTwo: true,
              afterIf: true,
              afterClass: "el-icon-search",
              title: "搜索",
            }),
          ];
        },
      }, //树形目录操作栏的配置
      //数据层
      treeData: {
        type: Array,
        default: [],
      }, //数据
    },
    data() {
      return {
        filterText: "", //过滤框数据
        isAction: true, //树形目录操作栏是否处于查询状态
        // menuVisible: false, //右键菜单是否显显示
        execute: {}, //右键菜单执行方法
        treeSelectData: "", //树形菜单选中数据
        isMain: true, //右侧展开缩小对树形目录的控制
        //左侧缩放操作栏的配置——暂时不提供修改
        treeSideUnfold: {
          text: "展开",
          i: "el-icon-circle-plus-outline",
          target: "unfold",
        }, //左侧栏配置1——展开
        treeSideRetract: {
          text: "收缩",
          i: "el-icon-remove-outline",
          target: "retract",
        }, //左侧栏配置2——收缩
      };
    },
    methods: {
      // 筛选节点
      callTreeFilterFunc() {
        this.$refs.elTree.filter(this.filterText);
      },
      //取消菜单栏方法
      // clickOtherPlace() {
      //   this.menuVisible = false;
      // },
      // 对树节点进行筛选时执行的方法
      filterNode(value, data, node) {
        if (!value) {
          return true;
        }
        return data[this.props.label].indexOf(value) !== -1;
      },
      // 节点被点击时的回调
      nodeSelectFunc(data, node, vcom) {
        this.treeSelectData = data;
        // this.clickOtherPlace();
        this.$emit("nodeClick", data, node, vcom);
      },
      // 当节点被鼠标右键点击时会触发该事件
      // rightClickFunc(event, data, node, vcom) {
      //   this.clickOtherPlace();
      //   this.menuVisible = true;
      //   let menu = document.querySelector("#tree-menu");
      //   menu.style.display = "position";
      //   menu.style.left = event.clientX + 10 + "px";
      //   menu.style.top = event.clientY + "px";
      //   this.$refs.elTree.setCurrentKey(data.id);
      // },
      //拖拽结果
      nodeDropFunc(draggingNode, dropNode, dropType, ev) {
        // this.clickOtherPlace();
        this.$emit("nodeDrop", draggingNode, dropNode, dropType, ev);
      },
      //所有工具條操作的汇聚
      actionHandle(target) {
        // if (!this.execute[target]()) {
        this.execute[target]();
        // }
      },
      //全部展开
      openAll() {
        let nodeList = this.$refs.elTree.store._getAllNodes();
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].expanded = true;
        }
      },
      //全部关闭
      closeAll() {
        let nodeList = this.$refs.elTree.store._getAllNodes();
        for (let i = 0; i < nodeList.length; i++) {
          nodeList[i].expanded = false;
        }
      },
    },
  };
</script>

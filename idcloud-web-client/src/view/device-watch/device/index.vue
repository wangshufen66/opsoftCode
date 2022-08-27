<template>
  <div id="cloudbox-point-config-container" style="display: flex;
    flex-direction: row;margin-left:-27px">
    <id-tree
      class="main-tree"
      ref="idTree"
      v-loading="treeLoading"
      :treeData="treeData"
      :highlight-current="highlightCurrent"
      :default-expand-all="false"
      :idConfig="treeActionBar"
      @nodeClick="nodeSelectFunc"
      @treeRefresh="findGroupListFunc"
    ></id-tree>
    <div style="margin-left: 10px;flex-grow: 1;">
      <factory
        v-if="containerInfosData.ctrType === 1"
        :treeData="containerInfosData"
        :treeNode="selectedTreeNode"
      ></factory>
      <department
        :treeData="containerInfosData"
        :treeNode="selectedTreeNode"
        v-else-if="containerInfosData.ctrType === 2"
      ></department>
      <device
        :treeData="containerInfosData"
        :treeNode="selectedTreeNode"
        v-else-if="containerInfosData.ctrType === 3"
      ></device>
      <info-point
        :treeData="containerInfosData"
        :treeNode="selectedTreeNode"
        v-else-if="containerInfosData.ctrType === 4"
      ></info-point>
    </div>
  </div>
</template>

<script>
  import apiMixin from "./apiMixins";
  import device from "./pages/device";
  import factory from "./pages/factory";
  import infoPoint from "./pages/infoPoint";
  import department from "./pages/department";
  import IdTree from "@/components/id-tree/index";
  import IdButtonConfig from "@/components/id-button/IdButtonConfig";

  export default {
    name: "device_monitor",
    components: {device, factory, infoPoint, department, IdTree},
    mixins: [apiMixin],
    data() {
      return {
        // 树形目录组件相关参数---------------------
        treeLoading: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: [
          new IdButtonConfig("tree-open", "", "treeOpen", {
            tag: "id-button",
            styleTwo: true,
            afterIf: true,
            afterClass: "el-icon-caret-bottom",
            title: "全部展开",
          }),
          new IdButtonConfig("tree-close", "", "treeClose", {
            tag: "id-button",
            styleTwo: true,
            afterIf: true,
            afterClass: "el-icon-caret-top",
            title: "全部收起",
          }),
          new IdButtonConfig("tree-refresh", "", "treeRefresh", {
            tag: "id-button",
            styleTwo: true,
            afterIf: true,
            afterClass: "el-icon-refresh-right",
            title: "刷新",
          }),
          new IdButtonConfig("tree-search", "", "treeSearch", {
            tag: "id-button",
            styleTwo: true,
            afterIf: true,
            afterClass: "el-icon-search",
            title: "搜索",
          }),
        ], //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据

        selectedTreeNode: "",
        // 按钮权限
        containerInfosData: {}, //树形目录当前选中数据,
      };
    },
    created() {},
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.findGroupListFunc();
      },
      saveContainer() {
        this.$refs.theForm.validate(async valid => {
          if (valid) {
            let param = {
              orgId: this.$store.state.user.userInfo.orgId,
              ...this.formValidate,
              pointContainerList: []
            };
            if (this.containerInfosData.ctrType === 4) {
              this.tableDialog.cloudboxTableSelectionConfirmedSetted.forEach(
                i => {
                  param.pointContainerList.push({
                    deviceType: 1,
                    collectId: i.cinfoId,
                    devicePointType: 2,
                    pointId: i.id
                  });
                }
              );
              this.tableDialog.plcTableSelectionConfirmedSetted.forEach(i => {
                param.pointContainerList.push({
                  deviceType: 3,
                  collectId: i.plcId,
                  devicePointType: 4,
                  pointId: i.id
                });
              });
              this.tableDialog.cncTableSelectionConfirmedSetted.forEach(i => {
                param.pointContainerList.push({
                  deviceType: 5,
                  collectId: i.cncId,
                  devicePointType: 6,
                  pointId: i.id
                });
              });
            } else {
              this.tableDialog.cloudboxTableSelectionConfirmedSetted.forEach(
                i => {
                  param.pointContainerList.push({
                    deviceType: 1,
                    collectId: i.id
                  });
                }
              );
              this.tableDialog.plcTableSelectionConfirmedSetted.forEach(i => {
                param.pointContainerList.push({
                  deviceType: 3,
                  collectId: i.id
                });
              });
              this.tableDialog.cncTableSelectionConfirmedSetted.forEach(i => {
                param.pointContainerList.push({
                  deviceType: 5,
                  collectId: i.id
                });
              });
            }

            await saveContainer(param)
              .then(res => {
                this.$notify({
                  title: "保存成功",
                  type: "success"
                });
                this.getDetail(this.containerInfosData);
              })
              .catch(e => {
                this.$notify.error({
                  title: "失败",
                  message: e
                });
              });
          }
        });
      },
      /* 获取分组树形列表 */
      async findGroupListFunc() {
        this.treeLoading=true;
        await this.getTreeData({orgId: this.$store.state.user.userInfo.orgId})
          .then(res => {
            if (res.status === 200 && res.data.code === 200) {
              // //根据层级来限定
              res.data.data.map(i => {
                i.name = i.ctrName;
              });
              let data = {
                rawdata: res.data.data,
                children: [],
                parent: [],
                expand: true
              };
              data.children = this.$utils.toTreeChildrenFunc(res.data.data, "id");
              data.parent = this.$utils.toTreeParentFunc(res.data.data, "ctrParent");
              this.treeData = this.$utils.toTreeDataFunc(data);
            } else {
              // 操作成功回调
              this.$notifyError("获取失败",res.data.msg);
            }
          }).catch(e => {
            this.$notifyError("失败", e);
          }).finally(() => {
            this.treeLoading=false;
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
        if (this.treeSelectData === data) {
          this.highlightCurrent = false;
          this.treeSelectData = {};
          this.containerInfosData = {};
        } else {
          this.highlightCurrent = true;
          this.treeSelectData = data;
          this.containerInfosData = data;
          this.selectedTreeNode = node;
        }
      }
    }
  };
</script>

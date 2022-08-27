<template>
  <div style="display: flex;flex-direction: row;margin-left:-27px">
    <id-tree
      class="main-tree"
      ref="idTree"
      v-loading="treeload"
      :treeData="treeData"
      :highlight-current="highlightCurrent"
      :idConfig="treeActionBar"
      @nodeClick="nodeSelectFunc"
    ></id-tree>
    <div style="margin-left: 10px;flex-grow: 1;width: 0">
        <el-row style="margin-bottom: 10px">
          <el-col :span="8" align="left">
            <el-button class="option-button" type="primary" size="small"
                       @click="saveFunc">保存
            </el-button>
            <div
              @click="findOrgListFunc"
              style="height: 32px; line-height: 32px; margin-left: 12px; cursor: pointer;display: inline"
              class="table-head-refresh-icon"
            >
              <i class="el-icon-refresh-right"></i>
              <span style="margin-left: 4px;">刷新</span>
            </div>
          </el-col>
        </el-row>
        <el-cascader-panel
          class="elCascaderPanel"
          ref="elCascaderPanel"
          v-model="selectData"
          v-loading="businessLoading"
          :style="{height:clientHeight-170+'px'}"
          :props="{ checkStrictly: false,emitPath:true ,multiple:true}"
          :options="enterpriseData">
        </el-cascader-panel>
    </div>
  </div>
</template>

<script>
  import {
    getOrgList
  } from '@/api/systemManagement/org'
  import {
    getAllSelectableAuthority,
    getOrgSelectedAuthority,
    editOrgAuthorityScope
  } from '@/api/systemManagement/orgAuthority'
  import IdTree from "@/components/id-tree/index";
  import {configBase} from "@/components/id-tree/idTreeConfig";

  export default {
    name: 'business_management',
    components: {IdTree},
    computed: {
      userInfo() {
        return this.$store.state.user.userInfo;
      }
    },
    data() {
      return {
        // 树形目录组件相关参数---------------------
        treeload: false,
        treeSelectData: {}, //树形目录当前选中数据
        treeActionBar: configBase, //树形操作栏配置
        highlightCurrent: true,//选中是否高亮行
        treeData: [], //树形目录数据
        containerInfosData: {}, //树形目录当前选中数据
        //其他组件
        businessLoading: false,//加载状态
        enterpriseData: [],//右侧数据
        selectData: [],//右侧当前选中数据
        clientHeight: 0,//组件高度
      }
    },
    created() {
      this.getClientHeight()
    },
    mounted() {
      this.findOrgListFunc()
    },
    methods: {
      getClientHeight() {
        // const _this = this
        this.clientHeight = `${document.documentElement.clientHeight}`
        // window.onresize = () => {
        //   _this.clientHeight = `${document.documentElement.clientHeight}`
        // }
      },
      //保存事件
      saveFunc() {
        const dataFlat = this.selectData.flat(1);
        const dataSet = new Set(dataFlat);
        console.log(dataSet);
        const param = {
          authorityList: [...dataSet].map((item) => {
            return {
              id: item
            }
          }),
          orgId: this.containerInfosData.id
        };
        editOrgAuthorityScope(param).then(res => {
          if (res.data.code === 200) {
            this.$Notice.success({
              title: '修改组织权限成功',
            });
            this.getOrgListByOrgFunc();
          } else {
            // 操作成功回调
            this.$notify({
              title: '操作失败',
              dangerouslyUseHTMLString: true,
              message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res.data.msg}</span>
                      </div>`,
              type: 'error'
            })
          }
        })
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
          this.getOrgListByOrgFunc();
        }
      },
      /* 获取企业树形列表 */
      async findOrgListFunc() {
        this.treeload = true;
        await getOrgList().then(res => {
          if (res.status === 200 && res.data.code === 200) {
            // 生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true
            }
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, 'id');
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(res.data.data, 'pid');
            this.treeData = this.$utils.toTreeDataFunc(data);
          } else {
            // 操作成功回调
            this.$notifyError("获取树形列表失败", res.data.msg);
          }
        }).finally(() => {
          this.treeload = false;
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
        })
      },
      /* 获取企业节点列表 */
      getOrgListByOrgFunc() {
        this.businessLoading = true;
        let param = {
          orgId: this.containerInfosData.id
        }
        Promise.all([getAllSelectableAuthority(param), getOrgSelectedAuthority(param)])
          .then(res => {
            let allAuthData = [];
            if (res[0].status === 200 && res[0].data.code === 200) {
              if (res[0].data.data.length > 0) {
                res[0].data.data.forEach(item => {
                  item.value = item.id;
                  item.label = item.name;
                });
                this.enterpriseData = this.getTreeDataFunc(res[0].data.data);
                allAuthData = res[0].data.data;
              }
            } else {
              // 操作成功回调
              this.$notify({
                title: '获取组织权限列表失败',
                dangerouslyUseHTMLString: true,
                message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res[0].data.msg}</span>
                      </div>`,
                type: 'error'
              })
            }
            if (res[1].status === 200 && res[1].data.code === 200) {
              if (res[1].data.data.length > 0) {
                res[1].data.data.forEach(item => {
                  item.label = item.name;
                  item.key = item.number;
                });
                const sedAuthData = res[1].data.data;
                this.selectData = [];
                // 遍历数组，校验选中状态 node_checked 0 未选 1 半选 2 全选
                if (sedAuthData.length > 0 && allAuthData.length > 0) {
                  allAuthData.forEach(treeItem => {
                    sedAuthData.forEach(sedItem => {
                      if (treeItem.id === sedItem.id) {
                        // if (sedItem.node_checked === 2) {
                        // console.log(treeItem)
                        // console.log(allAuthData.findIndex(item=>item.pNumber===treeItem.number))
                        if (allAuthData.findIndex(item => item.pNumber === treeItem.number) < 0) {
                          // treeItem.checked = true//此处无用
                          if (allAuthData.findIndex(item => item.number === treeItem.pNumber) < 0) {
                            this.selectData.push([treeItem.id]);
                          } else {
                            const pData = allAuthData[allAuthData.findIndex(item => item.number === treeItem.pNumber)];
                            if (allAuthData.findIndex(item => item.number === pData.pNumber) >= 0) {
                              const ppData = allAuthData[allAuthData.findIndex(item => item.number === pData.pNumber)];
                              if (allAuthData.findIndex(item => item.number === ppData.pNumber) >= 0) {
                                const pppData = allAuthData[allAuthData.findIndex(item => item.number === ppData.pNumber)];
                                this.selectData.push([pppData.id, ppData.id, pData.id, treeItem.id]);
                              } else
                                this.selectData.push([ppData.id, pData.id, treeItem.id]);
                            } else {
                              this.selectData.push([pData.id, treeItem.id]);
                            }
                          }
                        }
                      }
                    })
                  })
                  // console.log(this.selectData)
                }
              }
            } else {
              // 操作成功回调
              this.$notify({
                title: '获取已选组织权限列表失败',
                dangerouslyUseHTMLString: true,
                message: `<div style="display: flex;flex-direction: column;justify-content: left;">
                        <span style="color:orange;">原因：${res[1].data.msg}</span>
                      </div>`,
                type: 'error'
              })
            }
            this.businessLoading = false
          })
      },
      //转化成树形目录
      getTreeDataFunc(data) {
        let allData = {
          rawdata: data,
          children: [],
          parent: [],
          expand: true
        }
        allData.children = this.$utils.toTreeChildrenFunc(data, 'number')
        allData.parent = this.$utils.toTreeParentFunc(data, 'pNumber')
        return this.$utils.toTreeDataFunc(allData)
      },
    }
  }
</script>

<style lang='less' scoped>
  @import "../systemManageStyle.less";

  .elCascaderPanel {
    /deep/ .el-cascader-menu__wrap {
      height: 100%;
    }

    /deep/ .el-scrollbar__thumb {
      /*width: 0;*/
    }

    /deep/ .el-cascader-node.in-active-path {
      font-weight: normal;
    }

    /deep/ .el-cascader-node.is-active {
      font-weight: normal;
    }

    /deep/ .el-cascader-node.is-selectable.in-checked-path {
      font-weight: normal;
    }
  }
</style>

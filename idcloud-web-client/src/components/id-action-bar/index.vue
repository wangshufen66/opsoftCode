<template>
  <div class="action-bar flex-row-align-all-center">
    <!--版本日期2020-08-27  第一版
    优点  1.权限配置分离，可专注于写配置，且配置完成后不用修改，只需要配置权限即可。
    存在的问题，1.不够灵活配置，无法快速新增新的按钮(需要现在IdActionBar中先写上按钮)；
               2.初始化工具条需要配置权限，权限无法灵活生成，必须要把所有权限添加上才行；
               3.调整顺序的绑定也不够灵活,用的是flex中order来控制 按钮显示顺序 但是必须定下谁是第一个
               4.配置的代码是死的，写到data的，一定程度上要需要条件下调整同一个按钮的时候无法调整 -->
    <!--版本日期2020-08-28 第二版 v-for写法 权限和配置不分离（权限是配置的一部分） (el-checkbox原生未封装)-->
    <component
      v-for="(item, index) in idConfig"
      :key="index"
      :is="item.tag"
      :class="[
        item.styleTwo ? 'icon-button-space' : 'button-space',
        item.classKey,
      ]"
      :size="actionButtonSize"
      v-model="item.vModel"
      v-bind="item"
      @click="isClick(item.idDisable,item.target === undefined ? $event : item.target)"
      @change="change($event, item.target)"
    ></component>
  </div>
</template>
<style lang="less" scoped>
  //工具条基本布局
  .flex-row-align-all-center {
    display: flex;
    flex-direction: row;
    align-content: center;
    align-items: center;
  }

  //按钮间隔
  .button-space {
    margin-left: 4px;
  }

  //图标按钮间隔
  .icon-button-space {
    margin-left: 8px;
  }

  //特殊处理
  .action-bar {
    margin-left: -4px; //特殊处理=>来取消第一个按钮的间隔=》无论那个按钮在第一个都不影响样式
  }

  //el-chock 样式显示所有
  .showAll {
    /*margin-left: 6px;*/
    /*margin-right: 6px;*/
    //样式调整
    margin-bottom: 1px;

    /deep/ .el-checkbox__inner {
      margin-bottom: 1px;
    }

    //去除el-checkbox的样式
    /deep/ .el-checkbox__label {
      margin-left: 4px; //左侧图标和字的间隔
      padding-left: 0;
      font-size: 14px; //字大小
    }
  }
</style>
<script>
  import IdButton from "../id-button/index";
  import IdGroupButton from "../id-group-button";
  import IdDropdown from "../id-dropdown";
  import IdSelect from "../id-select/IdSelect";
  import IdRadio from "../id-radio/index";
  import IdGroupSelect from "../id-select/IdGroupSelect";
  import IdCascader from "../id-cascader";
  import IdExcel from "../id-excel/index";

  export default {
    name: "id-action-bar",
    components: {
      IdButton,
      IdGroupButton,
      IdDropdown,
      IdSelect,
      IdRadio,
      IdGroupSelect,
      IdCascader,
      IdExcel,
    },
    data() {
      return {};
    },
    props: {
      //大小相关
      actionButtonSize: {
        type: String,
        default() {
          return "small";
        },
      },
      //工具条配置  此处配置是基础配置  不带class 相对简单清晰化
      idConfig: {
        type: Array,
        default() {
          return [
            {
              tag: "id-button",
              classKey: "add",
              text: "添加",
              type: "primary",
              target: "add",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              tag: "id-button",
              classKey: "cut",
              text: "删除",
              styleOne: true,
              target: "cut",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              tag: "id-button",
              classKey: "reset",
              text: "重置",
              styleOne: true,
              target: "reset",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              tag: "id-group-button",
              classKey: "edit",
              childButton: [
                {
                  text: "编辑",
                  target: "edit",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  text: "删除",
                  target: "cut",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
            },
            {
              tag: "id-group-button",
              classKey: "sheet",
              childButton: [
                {
                  text: "上页",
                  target: "previous",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  text: "下页",
                  target: "next",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
            },
            {
              tag: "id-group-button",
              classKey: "create",
              childButton: [
                {
                  text: "新建",
                  target: "create",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  text: "复制",
                  target: "copy",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
            },
            {
              tag: "id-dropdown",
              text: "审核",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              childButton: [
                {
                  text: "审核",
                  target: "audit",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  text: "反审核",
                  target: "unAudit",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
            },
            {
              tag: "id-dropdown",
              text: "禁用",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
              childButton: [
                {
                  text: "禁用",
                  target: "disable",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  text: "反禁用",
                  target: "unDisable",
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
            },
            {
              //未封装控件
              tag: "el-checkbox",
              classKey: "showAll",
              label: "显示所有",
              target: "showAll",
              vModel: false,
              styleTwo: true,
              //导致权限也没有生效
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              tag: "id-button",
              classKey: "listSet",
              text: "显示字段设置",
              target: "listSet",
              styleTwo: true,
              beforeIf: true,
              beforeClass: "el-icon-setting",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
            {
              tag: "id-button",
              classKey: "refresh",
              text: "刷新",
              target: "refresh",
              styleTwo: true,
              beforeIf: true,
              beforeClass: "el-icon-refresh-right",
              authority: {
                idLoad: false,
                idIf: true,
                idDisable: false,
                idShow: true,
              },
            },
          ];
        },
      },
    },
    created() {
      // this.$ELEMENT.size = 'mini';//element UI 提供的修改组件 统一大小
      // console.log('创建完成');
    },
    destroyed() {
      // console.log('销毁完成');
    },
    methods: {
      change(value, target) {
        this.click(target, value);
      },
      //奇怪的bug
      isClick(idDisable,key){
        if(!idDisable)
          this.click(key);
      },
      //...value  动态参数  =》一个数组
      click(key, ...value) {
        // console.log(key);
        // console.log(value);
        this.$emit("click", key, value);
      },
    },
  };
</script>

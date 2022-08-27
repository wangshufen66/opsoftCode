<template>
  <div style="width: 560px">
    <div class="id-query flex-row-align-center" ref="id-query">
      <id-select :class="singleCondition.classKey" v-model="singleCondition.value" v-loading="singleCondition.authority.idLoad" v-if="singleCondition.authority.idIf" v-show="singleCondition.authority.idShow" :disabled="singleCondition.authority.idDisable" :size="size" v-bind="singleCondition" @change="singleConditionChange"></id-select>
      <component :is="singleValue.tag" class="id-component margin-left-space" :size="size" v-loading="singleValue.idLoad" :disabled="singleValue.idDisable" v-bind="singleValue" v-model="singleValue.value" v-on="singleValue.event">
      </component>
      <id-button class="margin-left-space" :size="size" circle afterIf afterClass="el-icon-search" v-bind="singleQuery" @click="queryClick('one')"></id-button>
      <id-button :size="size" id="id-more-query" v-bind="moreQuery" @click="moreQueryClick"></id-button>
    </div>
    <div class="id-filter-condition">
      <id-button :size="size" styleTwo v-bind="clearValue" @click="clearAllValue"></id-button>
      <el-tag class="id-tag" :size="size" v-for="tag in filterConditions" :key="tag.number" type="info" closable v-bind="tag" @close="clearOneValue(tag)">
        {{ tag.name }}
      </el-tag>
    </div>
    <transition name="query-form">
      <div class="id-form-query" v-show="idForm.vShow">
        <id-form ref="moreQueryForm" class="more-query-form" :idForm="idForm" :size="size" :label-width="idQueryFormLabelWidth"></id-form>
        <div class="flex-column-justify-end">
          <id-button :size="size" v-bind="clearCondition" @click="clearAllCondition"></id-button>
          <id-dropdown :size="size" v-bind="moreCondition" @click="addOneCondition"></id-dropdown>
          <id-button :size="size" v-bind="clearValue" @click="clearAllValue"></id-button>
          <id-button :size="size" text="过滤" v-bind="singleQuery" @click="queryClick('more')"></id-button>
        </div>
      </div>
    </transition>
  </div>
</template>
<style lang="less" scoped>
@import '../id-form/idFormColumn';
//特殊样式抽离
.flex-row-align-center {
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
}

//特殊样式抽离
.flex-column-justify-end {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}

//组件的深入改造
.id-query {
  .margin-left-space {
    margin-left: 5px;
  }

  .id-select {
    width: 160px;

    /deep/ .el-input__inner {
      font-size: 13px;
    }
  }

  .id-component {
    width: 330px;

    /deep/ .el-input__inner {
      font-size: 13px;
    }
  }

  .query {
    font-size: 12px;
  }
}

.id-filter-condition {
  overflow: auto;
  white-space: nowrap;

  /deep/ .id-button {
    font-size: 10px;
    padding: 0;
  }

  /deep/ .id-tag {
    font-size: 10px;
    height: 16px;
    line-height: 16px;
    margin-left: 10px;
    padding-top: 0;
    padding-bottom: 0;
  }
}

.id-form-query {
  border-radius: 10px;
  border: 1px #efefef solid;
  box-shadow: 0 0 9px 3px #efefef;
  display: block;
  background-color: white;
  padding: 10px 20px 10px 10px;
  width: 480px;
  margin-top: -18px;
  z-index: 1500;
  position: absolute;

  .id-more-condition {
    margin-left: 5px;
  }

  .query {
    margin-left: 5px;
  }

  .clear-filter {
    margin-left: 5px;
  }
}

//动画效果
.query-form-enter-active,
.query-form-leave-active {
  transition: all 0.5s linear;
}

.query-form-enter,
.query-form-leave-to {
  opacity: 0;
}

.query-form-enter-to,
.query-form-leave {
  opacity: 1;
}
</style>
<script>
import IdSelect from '../id-select/IdSelect';
import IdButton from '../id-button/index';
import IdButtonConfig from '../id-button/IdButtonConfig';
import IdForm from '../id-form/index';
import IdDropdown from '../id-dropdown';
import authority from '../authority';
import valueComparison from './valueComparison';
import componentComparison from './componentComparison';
import { datetimeStdStrFormateToDatetime } from '@/utils/dateUtils';
import IdSelectExpand from '../id-select/IdSelectExpand';

//控件问题：很多应该提示报错的地方我都没写 可能需要补上。
export default {
  name: 'id-query',
  components: {
    IdSelect,
    IdButton,
    IdForm,
    IdDropdown,
    IdSelectExpand,
  },
  props: {
    idQueryFormLabelWidth: {
      type: String,
      default: '80px',
    },
    multiple: {
      type: Boolean,
      default: false,
    }, //是否是多选模式
    defaultValue: {
      type: String,
      default: '',
    }, //单条件查询=》条件默认值
    options: {
      type: Array,
      default() {
        return [];
      },
    }, //单条件查询=》条件列表(原始数据)
  },
  data() {
    return {
      size: 'mini', //组件大小
      singleValue: {}, // 单查询 动态查询值组件
      singleCondition: {
        // value: "name",
        value: '',
        classKey: 'selectSimpleColumn',
        label: '选择条件',
        // options: [
        //   {
        //     value: "name",
        //     label: "名称",
        //     comp: "string",
        //     authority: new authority(),
        //   },
        //   {
        //     value: "num",
        //     label: "数量",
        //     comp: "number",
        //     authority: new authority(),
        //   },
        //   {
        //     value: "person",
        //     label: "制单人",
        //     comp: "select",
        //     authority: new authority(),
        //   },
        //   {
        //     value: "status",
        //     label: "社会信用统一状态",
        //     comp: "checkbox",
        //     authority: new authority(),
        //   },
        //   {
        //     value: "createTime",
        //     label: "创建时间",
        //     comp: "datetime",
        //     authority: new authority(),
        //   },
        // ],
        options: [],
        placeholder: '请选择',
        authority: new authority(),
      }, //单查询 查询条件组件 comp代表的是这个选择项需要渲染出来的组件
      singleQuery: new IdButtonConfig('query', '', 'query', {
        type: 'primary',
      }), //搜索按钮（click时区分单\多查询）
      moreQuery: new IdButtonConfig('more', '更多', 'more', {
        styleTwo: true,
      }), //展开多条件按钮
      idForm: {
        vShow: false,
        data: {},
        rules: {},
        component: [],
      }, //多条件查询表单
      filterConditions: [
        //{name: '标签一',number:'one'} 结构
      ], // 多条件查询的【查询条件】与【查询值】的展示行
      clearCondition: new IdButtonConfig(
        'clear-condition',
        '清除条件',
        'clearCondition',
        { styleOne: true }
      ), // 清除多条件查询的【查询条件】
      clearValue: new IdButtonConfig(
        'clear-filter',
        '清除过滤',
        'clearFilter',
        { styleOne: true }
      ), // 清除多条件查询的【查询值】
      moreCondition: {
        classKey: 'id-more-condition',
        text: '更多条件',
        trigger: 'click',
        childButton: [],
      }, //多条件表单  加上表单行按钮
      secondOptions: [], //将options中的字段中select带有number name转化为id后的条件值
    };
  },
  computed: {
    //单个往idForm添加初始化值
    initFormValue() {
      return function (multiple, type) {
        return valueComparison.valueComparison[multiple + type];
      };
    },
    //往idForm添加初始化的组件——基本处理  利用计算属性 增加方法的缓存
    initFormInitComp() {
      return function (multiple, type) {
        return componentComparison.componentComparison[multiple + type];
      };
    },
    //单条件查询的【查询值】组件的配置model 跟 多条件查询的【查询值】组件的配置model 不一样
    //所有【部分组件】需要特殊处理=》来适应单个处理框情况
    moreToSingleValueComp() {
      return function (comp, options) {
        const moreToSingle = {
          'el-checkbox': function () {
            comp = {
              value: '0',
              tag: 'id-select',
              placeholder: '请选择',
              authority: new authority(),
              options: [
                {
                  value: '1',
                  label: '是',
                  authority: new authority(),
                },
                {
                  value: '0',
                  label: '否',
                  authority: new authority(),
                },
              ],
            };
          },
          'id-checkbox-group': function () {
            comp = {
              value: [],
              tag: 'id-select',
              placeholder: '请选择',
              authority: new authority(),
              multiple: true,
              options: [
                {
                  value: '1',
                  label: '是',
                  authority: new authority(),
                },
                {
                  value: '0',
                  label: '否',
                  authority: new authority(),
                },
              ],
            };
          },
          'id-select': function () {
            comp.options = options;
          },
        };
        if (moreToSingle.hasOwnProperty(comp.tag))
          comp = moreToSingle[comp.tag]();
      };
    },
  },
  //初始化处理
  created() {
    // 单查询的条件组件初始化
    this.singleCondition.value = this.defaultValue;
    this.singleCondition.options = [];
    //处理值的初始化
    this.secondOptions = [];
    this.options.forEach((item) => {
      // debugger;
      if (item.comp) {
        //存在comp说明需要在idQuery中生成组件
        let alterProp = item.prop;
        //id-select id-select-expand 控件的值 分为 id number name  需要把对应的number name转化为id
        if (item.comp.startsWith('Select')) {
          if (alterProp.endsWith('Name'))
            alterProp = alterProp.substr(0, alterProp.length - 4);
          else if (alterProp.endsWith('Number'))
            alterProp = alterProp.substr(0, alterProp.length - 5);
        }
        //因为id-select-expand控件单查询和多查询之间的交互有问题 所以会过滤掉带url的id-select-expand
        if (item.comp !== 'SelectExpand' && !item.url) {
          this.singleCondition.options.push({
            value: alterProp,
            label: item.label,
            comp: item.comp,
            authority: new authority(),
            getList: item.url,
            options: item.options,
          });
        }
        //处理过后的值 放入secondOptions中方便调用
        this.secondOptions.push({
          ...item,
          prop: alterProp,
        });
      }
    });
    this.initConfig();
  },
  methods: {
    //基本查询  搜索条件修改时
    singleConditionChange(val) {
      const targetOption =
        this.singleCondition.options[
          this.singleCondition.options.findIndex((item) => item.value === val)
        ];
      //基本组件应用
      let comp = JSON.parse(
        JSON.stringify(this.initFormInitComp(this.multiple, targetOption.comp))
      );
      //部分组件特殊处理初始化值来适应单个处理框情况
      comp.value = this.initFormValue(this.multiple, targetOption.comp);
      //多查询的组件model修改为单查询的组件model
      this.moreToSingleValueComp(comp, targetOption.options);
      this.singleValue = comp;
      // 暂时取消
      // 组件简化处理 在多条件查询中 提供到特定时间点的查询  在单条件查询 只提供到日期的查询
      // if (this.singleValue.tag === "el-date-picker") {
      //   this.singleValue.type = "daterange";
      // }
      //singleValue值的初始化
      this.singleValue.value = this.idForm.data[this.singleCondition.value];
    },
    //往idForm添加初始化的组件——特殊化处理
    initFormComp(multiple, type, label, classKey) {
      let comp = JSON.parse(
        JSON.stringify(this.initFormInitComp(multiple, type))
      );
      comp.classKey = classKey;
      comp.label = label;
      // id-select-expand 和 id-select的特殊处理
      // id-select-expand 特殊处理  需要获取到 选择的options 需要地址去获取到 options
      // id-select需要传递进来的options值
      if (comp.tag === 'id-select-expand') {
        comp.event = {
          querySelectItems: function (val) {
            comp.selectItems = val;
          },
        };
        comp.getList =
          this.secondOptions[
            this.secondOptions.findIndex((item) => item.prop === classKey)
          ].url;
      } else if (comp.tag === 'id-select') {
        comp.options =
          this.secondOptions[
            this.secondOptions.findIndex((item) => item.prop === classKey)
          ].options;
      }
      return comp;
    },
    //取消一个过滤条件
    clearOneValue(tag) {
      this.filterConditions.splice(this.filterConditions.indexOf(tag), 1);
      console.log(this.$refs['moreQueryForm'].$refs['idForm']);
      const formIndex = this.$refs['moreQueryForm'].$refs[
        'idForm'
      ].$children.findIndex((item) => item.labelFor === tag.number);
      this.$refs['moreQueryForm'].$refs['idForm'].$children[
        formIndex
      ].resetField();
      if (this.singleCondition.value === tag.number)
        this.singleValue.value = this.idForm.data[this.singleCondition.value];
      this.$emit('queryFilterData', this.filterConditions);
    },
    //清除所有过滤条件
    clearAllCondition() {
      this.clearAllValue();
      this.initConfig();
      this.singleValue.idDisable = !this.singleValue.idDisable;
    },
    //初始化iQuery配置
    initConfig() {
      let data = {};
      let initComp = {};
      this.moreCondition.childButton = [];
      for (const item of this.secondOptions) {
        data[item.prop] = this.initFormValue(this.multiple, item.comp);
        if (this.defaultValue) {
          //是否存在单选框的默认值，有默认值则给展开的过滤表单默认添加一个初始组件
          if (item.prop === this.defaultValue) {
            initComp = this.initFormComp(
              this.multiple,
              item.comp,
              item.label,
              item.prop
            );
            continue;
          }
        }
        this.moreCondition.childButton.push({
          text: item.label,
          target: item.prop,
          idLoad: false,
          idIf: true,
          idShow: true,
          idDisable: false,
        });
      }
      this.idForm.data = data;
      this.idForm.component = [];
      this.idForm.component.push(initComp);
      this.singleConditionChange(this.defaultValue);
    },
    //清除所有过滤条件的值
    clearAllValue() {
      this.filterConditions = [];
      this.$refs['moreQueryForm'].$children[0].resetFields();
      this.singleValue.value = this.idForm.data[this.singleCondition.value];
      this.$emit('queryFilterData', this.filterConditions);
    },
    //新增一個过滤条件
    addOneCondition(target) {
      const optionsIndex = this.secondOptions.findIndex(
        (item) => item.prop === target
      );
      const childrenIndex = this.moreCondition.childButton.findIndex(
        (item) => item.target === target
      );
      if (optionsIndex >= 0 && childrenIndex >= 0) {
        const optionsItem = this.secondOptions[optionsIndex];
        const comp = this.initFormComp(
          this.multiple,
          optionsItem.comp,
          optionsItem.label,
          optionsItem.prop
        );
        this.idForm.component.push(comp);
        this.idForm.data[optionsItem.prop] = this.initFormValue(
          this.multiple,
          optionsItem.comp
        );
        this.moreCondition.childButton.splice(childrenIndex, 1);
      }
    },
    //过滤查询  more=>idform的过滤  one=>简单过滤
    queryClick(type) {
      //more是多条件查询   one是单条件查询
      if (type === 'more') {
        //过滤的tag条设置
        this.filterConditions = []; //过滤框的初始化
        for (const value in this.idForm.data) {
          const compIndex = this.idForm.component.findIndex(
            (item) => item.classKey === value
          ); //当前的value对应组件的位置
          if (compIndex < 0) continue;
          const comp = this.idForm.component[compIndex]; //当前的value对应的组件
          const compValue = this.idForm.data[value]; //当前的value
          let name = '';
          if (this.multiple) {
            //多选模式下
            if (typeof compValue[0] === 'number') {
              const compSelectItems = comp.selectItems;
              for (const id of compValue) {
                name +=
                  ' ' +
                  compSelectItems[
                    compSelectItems.findIndex((item) => item.value === id)
                  ].label;
              }
              name = name.substr(1, name.length);
            } else if (typeof compValue[0] === 'string') {
              for (const label of compValue) {
                name += ' ' + label;
              }
              name = name.substr(1, name.length);
            } else {
              for (const label of compValue) {
                name += ' 至 ' + datetimeStdStrFormateToDatetime(label);
              }
              name = name.substr(3, name.length);
            }
          } else {
            //单选模式
            if (comp.tag === 'el-input' || comp.tag === 'el-input-number') {
              name = compValue;
            } else if (comp.tag === 'el-checkbox') {
              name = compValue ? '是' : '否';
            } else if (comp.tag === 'el-date-picker') {
              for (const label of compValue) {
                name += ' 至 ' + datetimeStdStrFormateToDatetime(label);
              }
              name = name.substr(3, name.length);
            } else if (comp.tag === 'id-select') {
              if (
                comp.options.findIndex((item) => item.value === compValue) >= 0
              ) {
                name =
                  comp.options[
                    comp.options.findIndex((item) => item.value === compValue)
                  ].label;
              }
            } else {
              if (comp.selectItems) {
                const compSelectItems = [comp.selectItems];
                name =
                  compSelectItems[
                    compSelectItems.findIndex(
                      (item) => item.value === compValue
                    )
                  ].label;
              }
            }
          }
          if (name) {
            this.filterConditions.push({
              name: comp.label + ' : ' + name,
              number: value,
            });
          }
        }
        this.singleValue.value = this.idForm.data[this.singleCondition.value];
        //查询
        this.$emit('query', this.idForm.data);
        this.$nextTick(() => {
          this.moreQueryClick();
        });
      } else {
        //此处暂时只测试了单选
        if (this.filterConditions.length === 0) {
          //普通单查询
          let simpleQuery = {};
          simpleQuery[this.singleCondition.value] = this.singleValue.value;
          this.$emit('query', simpleQuery);
        } else {
          //当有过滤条件时，则普通单查询转化为多条件查询
          //需要 1.将值写入到 el-tag的 查询条件中
          //     2.将值写入到多条件查询的id-form中 => id-form可能不存在该查询条件列 则需要自动添加
          // le-tag 处理 =》 1.是否存在 =》 存在就替换   不存在就添加
          const conditionIndex = this.filterConditions.findIndex(
            (item) => item.number === this.singleCondition.value
          );
          if (conditionIndex >= 0) {
            let newName = this.filterConditions[conditionIndex].name.split(':');
            if (!this.singleValue.value) {
              this.clearOneValue(this.filterConditions[conditionIndex]);
            } else {
              this.filterConditions[conditionIndex].name =
                newName[0] + ':' + this.singleValue.value;
            }
          } else {
            //此处同样  防止往filterConditions推入空值
            if (this.singleValue.value) {
              this.filterConditions.push({
                name:
                  this.singleCondition.options[
                    this.singleCondition.options.findIndex(
                      (item) => item.value === this.singleCondition.value
                    )
                  ].label +
                  ':' +
                  this.singleValue.value,
                number: this.singleCondition.value,
              });
            }
          }
          // idForm组件是否存在  不存在就添加组件
          if (
            this.idForm.component.findIndex(
              (item) => item.classKey === this.singleCondition.value
            ) < 0
          )
            this.addOneCondition(this.singleCondition.value);
          //更新组件值
          this.idForm.data[this.singleCondition.value] = this.singleValue.value;
          this.$emit('query', this.idForm.data);
        }
      }
    },
    //更多过滤触发方法
    moreQueryClick() {
      this.idForm.vShow = !this.idForm.vShow;
      this.singleCondition.authority.setIdDisable(
        !this.singleCondition.authority.getIdDisable()
      );
      this.singleValue.idDisable = !this.singleValue.idDisable;
    },
  },
};
</script>

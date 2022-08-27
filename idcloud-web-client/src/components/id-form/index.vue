<template>
  <!--有一个缺点   el-form-item少个特定指定class-->
  <el-form ref="idForm" class="id-form" :model="idForm.data" :rules="idForm.rules" :label-width="labelWidth" :size="size" v-on="$listeners" v-bind="$attrs">
    <el-form-item v-for="(item, index) in idForm.component" :key="index" class="id-el-form-item" :style="[
        spanGridRowStart(item.gridRowStart),
        spanGridColumnStart(item.gridColumnStart),
      ]" v-if="item.idIf" v-show="item.idShow" :label="item.label" :prop="item.classKey">
      <component :is="item.tag" :key="item.classKey" class="id-component" :class="[item.classKey]" style="width: 100%" v-loading="item.idLoad" :disabled="item.idDisable" v-bind="item" v-model="idForm.data[item.classKey]" v-on="item.event">
      </component>
    </el-form-item>
  </el-form>
</template>
<script>
import IdSelect from '../id-select/IdSelect';
import IdCheckboxGroup from '../id-checkbox-group';
import IdSelectExpand from '../id-select/IdSelectExpand';
import IdInputPopup from '../id-input-popup/index';

export default {
  name: 'id-form',
  components: {
    IdSelect,
    IdCheckboxGroup,
    IdSelectExpand,
    IdInputPopup,
  },
  props: {
    idForm: {
      type: Object,
      default() {
        return {
          data: {
            name: '',
            password: '',
            note: '',
            num: 0,
            person: '',
            isUsed: false,
            time: '',
            timeRange: [],
            date: '',
            dateRange: [],
            dateTime: '',
            dateTimeRange: [],
            select: '',
            cascader: '',
          },
          rules: {
            name: [
              { required: true, message: '名称不能为空', trigger: 'blur' },
            ],
            password: [
              { required: true, message: '密码不能为空', trigger: 'blur' },
            ],
            num: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
            person: [
              { required: true, message: '负责人不能为空', trigger: 'blur' },
            ],
            isUsed: [
              { required: true, message: '是否启用不能为空', trigger: 'blur' },
            ],
            time: [
              { required: true, message: '时间不能为空', trigger: 'blur' },
            ],
            timeRange: [],
            date: [],
            dateRange: [],
            dateTime: [],
            dateTimeRange: [],
            select: [],
            cascader: [],
          },
          component: [
            {
              classKey: 'note',
              label: '备注',
              tag: 'el-input',
              placeholder: '请输入',
              type: 'textarea',
              rows: 3, //需要人员自己调整
              gridRowStart: 2,
              gridColumnStart: 2,
              maxlength: 250,
              showWordLimit: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'password',
              label: '密码',
              tag: 'el-input',
              placeholder: '请输入',
              type: 'password',
              showPassword: true,
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'name',
              label: '名称',
              tag: 'el-input',
              placeholder: '请输入',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'num',
              label: '数量',
              tag: 'el-input-number',
              placeholder: '请输入',
              controlsPosition: 'right',
              min: 0,
              max: 10,
              step: 0.01,
              // precision:3,//精度
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'person',
              label: '负责人',
              tag: 'el-input',
              placeholder: '请选择',
              readonly: true,
              suffixIcon: 'el-icon-zoom-in',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'isUsed',
              label: '是否启用',
              tag: 'el-checkbox',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'time',
              label: '时间',
              tag: 'el-time-picker',
              placeholder: '请选择',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'timeRange',
              label: '时间范围',
              tag: 'el-time-picker',
              isRange: true,
              rangeSeparator: '-',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间',
              placeholder: '选择时间范围',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'date',
              label: '日期',
              tag: 'el-date-picker',
              type: 'date',
              placeholder: '请选择',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'dateRange',
              label: '日期范围',
              tag: 'el-date-picker',
              type: 'daterange',
              rangeSeparator: '-',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间',
              placeholder: '选择时间范围',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'dateTimeRange',
              label: '日期时间范围',
              tag: 'el-date-picker',
              type: 'datetimerange',
              gridRowStart: 1,
              gridColumnStart: 1,
              rangeSeparator: '-',
              startPlaceholder: '开始时间',
              endPlaceholder: '结束时间',
              placeholder: '选择时间范围',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'dateTime',
              label: '日期时间',
              tag: 'el-date-picker',
              type: 'datetime',
              placeholder: '请选择',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'select',
              label: '选择状态',
              tag: 'id-select',
              options: [
                {
                  value: '选项1',
                  label: '黄金糕',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: '选项2',
                  label: '双皮奶',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: '选项3',
                  label: '蚵仔煎',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
                {
                  value: '选项4',
                  label: '龙须面',
                  authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                  },
                },
              ],
              placeholder: '请选择',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
            {
              classKey: 'cascader',
              label: '级联选择器',
              tag: 'el-cascader',
              options: [
                {
                  value: 'zhinan',
                  label: '指南',
                  children: [
                    {
                      value: 'shejiyuanze',
                      label: '设计原则',
                      children: [
                        {
                          value: 'yizhi',
                          label: '一致',
                          disabled: true,
                        },
                        {
                          value: 'fankui',
                          label: '反馈',
                        },
                        {
                          value: 'xiaolv',
                          label: '效率',
                        },
                        {
                          value: 'kekong',
                          label: '可控',
                        },
                      ],
                    },
                    {
                      value: 'daohang',
                      label: '导航',
                      children: [
                        {
                          value: 'cexiangdaohang',
                          label: '侧向导航',
                        },
                        {
                          value: 'dingbudaohang',
                          label: '顶部导航',
                        },
                      ],
                    },
                  ],
                },
              ],
              placeholder: '请选择',
              idLoad: false,
              idIf: true,
              idDisable: false,
              idShow: true,
            },
          ],
        };
      },
    },
    //标签长度相关
    labelWidth: {
      type: String,
      default() {
        return '120px';
      },
    },
    //控件大小相关
    size: {
      type: String,
      default() {
        return 'small';
      },
    },
  },
  computed: {
    spanGridRowStart() {
      return function (gridRowStart) {
        if (gridRowStart > 1)
          return {
            gridRowStart: 'span ' + gridRowStart,
          };
        else
          return {
            gridRowStart: 'span 1',
          };
      };
    },
    spanGridColumnStart() {
      return function (gridColumnStart) {
        const screenWidth = document.documentElement.clientWidth;
        if (screenWidth > 1200 && gridColumnStart > 1 && gridColumnStart < 4)
          return {
            gridColumnStart: 'span ' + gridColumnStart,
          };
        else if (
          screenWidth > 900 &&
          screenWidth < 1200 &&
          gridColumnStart > 1 &&
          gridColumnStart < 3
        )
          return {
            gridColumnStart: 'span ' + gridColumnStart,
          };
        else
          return {
            gridColumnStart: 'span 1',
          };
      };
    },
  },
  //防止注册失败
  beforeCreate() {
    this.$options.components.IdInputPopup =
      require('../id-input-popup/index').default;
  },
  methods: {},
};
</script>

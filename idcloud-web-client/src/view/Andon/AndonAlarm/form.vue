<template>
  <div class="form-container">
    <div class="form-head">
      <span>查看详情</span>
      <div class="button-wrapper">
        <el-button size="small" @click="handleClickFormCancel">取消</el-button>
      </div>
    </div>
    <el-form label-position="right" class="grid-form-style" ref="theForm" label-width="100px" :rules="formRule" :model="formValidate" v-loading="loading.form">
      <div v-for="item in formColumn" :key="item.key" :class="item.islong?'form-inner-long':'form-inner'">
        <el-form-item :label="item.title" :label-width="item.islong == true? '90px':'90px'" :prop="item.key" class="form-item">
          <el-input size="small" v-if="item.type === 'text'" class="input" v-model="formValidate[item.key]"></el-input>
          <div v-else-if="item.type ==='number'" class="input-num-wrapper">
            <el-input-number :min="0" class="input input-num" :controls="false" v-model="formValidate[item.key]" size="small"></el-input-number>
          </div>
          <el-cascader v-else-if="item.type === 'cascader'" class="input" :placeholder="item.placeholder" v-model="formValidate[item.key]" :options="item.options" clearable filterable size="small" />
          <el-input class="input" v-else-if="item.type === 'disabled'" disabled size="small" v-model="formValidate[item.key]"></el-input>
          <el-date-picker v-else-if="item.type === 'dateTime'" v-model="formValidate[item.key]" type="datetime" size="small" class="input" placeholder></el-date-picker>
          <el-select v-else-if="item.type === 'select'" class="input" size="small" v-model="formValidate[item.key]">
            <el-option v-for="i in item.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>
          <div v-else-if="item.type === 'select-readonly'">
            <span style="color: #F67049" v-if="formValidate[item.key] == 0">未处理</span>
            <span style="color: #45C376" v-else-if="formValidate[item.key] == 1">处理中</span>
            <span style="color: #45C376" v-else-if="formValidate[item.key] == 2">已处理</span>
            <span style="color: #F67049" v-else-if="formValidate[item.key] == 3">已取消</span>
          </div>
          <!-- <el-select
            v-else-if="item.type === 'select-readonly'"
            class="input"
            size="small"
            v-model="formValidate[item.key]"
          >
            <el-option v-for="i in item.options" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>-->
          <div class="picture" v-else-if="item.type === 'picture'">
            <div @mouseover="picMouseOver" @mouseout="picMouseOut" @click="changePictureDialog.v = true" ref="hintDiv" v-text="item.hintText" class="hint-div"></div>
            <el-image @mouseover="picMouseOver" @mouseout="picMouseOut" style="width: 300px; height: 150px; border-radius: 4px;" :src="item.url" :preview-src-list="item.srcList">
              <div style="cursor: pointer;width: 70%" @click="changePictureDialog.v = true" slot="error" class="image-slot">
                <i style="font-size: 128px" class="el-icon-picture-outline"></i>
                <span style="font-size: 16px">点击上传</span>
              </div>
            </el-image>
          </div>
          <el-input type="textarea" class="input" v-else-if="item.type === 'textarea'" maxlength="200" show-word-limit readonly v-model="formValidate[item.key]"></el-input>
          <el-input class="input" v-else-if="item.type === 'readonly'" readonly size="small" v-model="formValidate[item.key]"></el-input>
          <el-input class="input" v-else-if="item.type === 'dialogTable'" readonly size="small" v-model="formValidate[item.key]">
            <el-button @click="setTrigger(item.key)" style="width: 40px;background-color: #e6f7ff; height: 34px;position: relative; top: 2px;" icon="el-icon-more" slot="append"></el-button>
          </el-input>
          <div v-else-if="item.type === 'space'"></div>
        </el-form-item>
      </div>
    </el-form>

    <el-dialog @open="tableDialogOpen" top="60px" @closed="tableDialogClose" :title="tableDialog.title" :visible.sync="tableDialog.v">
      <div class="table-search-wrapper">
        <el-select class="search-select-style" size="small" v-model="tableDialog.searchSelected" placeholder="请选择">
          <el-option v-for="item in tableDialog.tableColumn" v-show="item.type === 'text'" :key="item.key" :label="item.title" :value="item.key"></el-option>
        </el-select>
        <el-input clearable class="search-input-style" size="small" v-model="tableDialog.searchInput"></el-input>
        <el-button @click="handleTableDialogSearch" class="search-btn-style" type="primary" icon="el-icon-search" circle></el-button>
      </div>

      <el-table highlight-current-row @current-change="handleCurrentChange" @row-dblclick="handleFormTableDbClick" :data="tableDialog.tableData" v-loading="tableDialog.tableLoading" @select="handleSelect" @select-all="handleSelectAll" @selection-change="handleSelectionChange" ref="dialogTable">
        <el-table-column v-if="tableDialog.hasMultiSelection" type="selection" width="55"></el-table-column>
        <el-table-column v-for="(item,index) in tableDialog.tableColumn" :key="index" :property="item.key" :label="item.title" :width="item.width"></el-table-column>
      </el-table>
      <div class="pagination-style">
        <el-pagination @current-change="handleTableDialogPageChange" :current-page="tableDialog.currentPage" background layout="total,prev, pager, next" :total="tableDialog.total"></el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleTableDialogCancel">取 消</el-button>
        <el-button :disabled="tableDialog.confirmDisabled" type="primary" @click="handleTableDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 数据点信息 弹窗 -->
    <el-dialog custom-class="the-dialog" width="480px" :title="infoDialog.title" :visible.sync="infoDialog.v">
      <el-form :model="infoDialog.formValidate" :rules="infoDialog.rules" ref="infoForm" label-width="100px">
        <el-form-item label="信息点代码" prop="number">
          <el-input disabled style="width: 300px" v-model="infoDialog.formValidate.number"></el-input>
        </el-form-item>
        <el-form-item label="信息点名称" prop="name">
          <el-input disabled style="width: 300px" v-model="infoDialog.formValidate.name"></el-input>
        </el-form-item>
        <el-form-item label="信息点描述" prop="warningDescribe">
          <el-input style="width: 300px" v-model="infoDialog.formValidate.warningDescribe"></el-input>
        </el-form-item>
        <el-form-item label="预警点颜色" prop="warningColor">
          <el-select style="width: 300px" v-model="infoDialog.formValidate.warningColor" placeholder="请选择">
            <el-option label="黄色" :value="1"></el-option>
            <el-option label="红色" :value="2"></el-option>
            <el-option label="蓝色" :value="3"></el-option>
            <el-option label="绿色" :value="4"></el-option>
            <el-option label="白色" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="personName">
          <el-input style="width: 300px" readonly v-model="infoDialog.formValidate.personName">
            <el-button @click="setTrigger('personName')" style="width: 40px" icon="el-icon-more" slot="append"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="postParamCancel">取 消</el-button>
        <el-button :loading="loading.formBottom" type="primary" size="small" @click="postParamConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  formColumn,
  fetchForm,
  formTableColumn,
  fetchInfoPointData,
  addAndonInfo,
  updateAndonInfo,
  updateCloudboxInfoPoint,
} from './public';
import { getWorkerList } from '@/api/deviceMaintenance/ticketPlan';
import { getX8302boxList } from '@/api/iot-hub/x8302boxList';
export default {
  name: 'andon_warning',
  components: {},
  mixins: [],
  props: {
    formIntent: {
      type: String,
      default() {
        return '';
      },
    },
    formRow: {
      type: Object,
      default() {
        return {};
      },
    },
    rowId: {
      type: Number,
      default() {
        return -1;
      },
    },
  },
  data() {
    return {
      orgId: this.$store.state.user.userInfo.orgId,
      changePictureDialog: {
        v: false,
      },
      loading: {
        button: false,
        form: false,
        table: false,
        formBottom: false,
      },
      intent: '',
      rowIdCp: '',
      formColumn: [],
      formValidate: {
        number: '',
        name: '',
        mark: '',
        box8302Number: '',
        box8302BrandNumber: '',
        operationName: '',
        note: '',
        docMakerName: '',
        auditPersonName: '',
        createTime: '',
        auditTime: '',
      },
      formRule: {},
      tableDialog: {
        title: '',
        width: '1000px',
        v: false,
        trigger: '',
        searchInput: '',
        searchSelected: '',
        tableColumn: [],
        tableData: [],
        tableSelected: '',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pageCount: 0,
        tableLoading: false,
        confirmDisabled: true,
        searchTrigger: false,
        hasMultiSelection: false,
      },
      pushForm: {
        cloudbox: {
          id: '',
          model: '',
        },
        person: {
          id: '',
        },
        personId: '',
      },
      table: {
        data: [],
        column: [],
      },
      infoDialog: {
        title: '修改数据点信息',
        v: false,
        formValidate: {
          id: '',
          number: '',
          name: '',
          warningDescribe: '',
          warningColor: '',
          personName: '',
        },
        rules: {},
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.intent = this.formIntent;
    this.rowIdCp = this.rowId;
    this.formColumn = formColumn;
    this.table.column = formTableColumn;
    this.formValidate = { ...this.formRow };
    this.pushForm.cloudbox.id = this.formRow.box8302Id;
    this.pushForm.person.id = this.formRow.operationPersonId;
  },
  beforeDestroy() {},
  methods: {
    handleEdit(index, row) {
      this.infoDialog.formValidate = { ...row };
      this.infoDialog.v = true;
    },
    postParamCancel() {
      this.infoDialog.v = false;
      this.infoDialog.formValidate = {
        id: '',
        number: '',
        name: '',
        warningDescribe: '',
        warningColor: '',
        personName: '',
      };
    },
    async postParamConfirm() {
      try {
        let param = {
          ...this.infoDialog.formValidate,
          personId: this.pushForm.personId,
        };
        this.loading.formBottom = true;
        let res = await Promise.resolve(updateCloudboxInfoPoint(param));
        if (res.data.code == 200) {
          this.$notify({
            title: '成功',
            type: 'success',
            message: res.data.msg,
          });
        } else {
          this.$notify.error({
            title: '错误',
            message: res.data.msg,
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.loading.formBottom = false;
        this.getInfoPointData(this.pushForm.cloudbox.id);
        this.postParamCancel();
        return 1;
      }
    },

    async refreshFormData() {
      try {
        const param = {
          id: this.rowIdCp,
          orgId: this.orgId,
        };
        let res = await Promise.resolve(fetchForm(param));
        this.formValidate = { ...res.data.data };
      } catch (e) {
        console.log(e);
      }
    },
    handleClickFormCancel() {
      this.$parent.intent = 'table';
      // this.$parent.getTableData();
    },
    // form-start
    setTrigger(key) {
      this.tableDialog.trigger = key;
      this.tableDialog.v = true;
    },
    async tableDialogOpen() {
      try {
        let res = '';
        let param = {
          orgId: this.orgId,
          current_page: this.tableDialog.currentPage,
          page_size: this.tableDialog.pageSize,
        };
        if (this.tableDialog.searchInput !== '') {
          param[this.tableDialog.searchSelected] = this.tableDialog.searchInput;
        }
        this.tableDialog.tableLoading = true;
        switch (this.tableDialog.trigger) {
          // 负责人
          case 'operationName':
            this.tableDialog.confirmDisabled = true;
            this.tableDialog.hasMultiSelection = false;
            this.tableDialog.tableColumn = [
              {
                title: '员工代码',
                key: 'number',
                width: '250',
                type: 'text',
              },
              {
                title: '员工名称',
                key: 'name',
                width: '250',
                type: 'text',
              },
              {
                title: '员工属性',
                key: 'type',
                width: '250',
                type: 'select',
                selectOptions: [
                  {
                    value: '0',
                    label: '在职',
                  },
                  {
                    value: '1',
                    label: '试用',
                  },
                  {
                    value: '2',
                    label: '实习',
                  },
                  {
                    value: '3',
                    label: '退休',
                  },
                  {
                    value: '4',
                    label: '离职',
                  },
                  {
                    value: '5',
                    label: '离休',
                  },
                ],
                render: (h, params) => {
                  const selectionArray = [
                    {
                      value: '0',
                      label: '在职',
                    },
                    {
                      value: '1',
                      label: '试用',
                    },
                    {
                      value: '2',
                      label: '实习',
                    },
                    {
                      value: '3',
                      label: '退休',
                    },
                    {
                      value: '4',
                      label: '离职',
                    },
                    {
                      value: '5',
                      label: '离休',
                    },
                  ];
                  // 根据设置的选项集合，生成对应的下拉选项
                  let optionArray = [];
                  selectionArray.map((item) => {
                    optionArray.push(
                      h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label,
                        },
                        style: {
                          width: '80px',
                        },
                      })
                    );
                  });

                  return h(
                    'Select',
                    {
                      props: {
                        disabled: false,
                        size: 'small',
                        placeholder: '',
                        value: String(params.row['type']),
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      },
                    },
                    optionArray
                  );
                },
              },
              {
                title: '所属部门代码',
                key: 'departmentNumber',
                width: '250',
                type: 'text',
              },
              {
                title: '所属部门名称',
                key: 'departmentName',
                width: '250',
                type: 'text',
              },
              {
                title: '所属班组代码',
                key: 'teamNumber',
                width: '250',
                type: 'text',
              },
              {
                title: '所属班组名称',
                key: 'teamName',
                width: '250',
                type: 'text',
              },
              {
                title: '公司邮箱',
                key: 'email',
                width: '250',
                type: 'text',
              },
              {
                title: '家庭地址',
                key: 'address',
                width: '250',
                type: 'text',
              },
              {
                title: '联系电话',
                key: 'phone',
                width: '250',
                type: 'text',
              },
              {
                title: '备注',
                key: 'note',
                width: '320',
                type: 'text',
              },
              {
                title: '制单人代码',
                key: 'docMakerNumber',
                width: '120',
                type: 'text',
              },
              {
                title: '制单人姓名',
                key: 'docMakerName',
                width: '120',
                type: 'text',
              },
              {
                title: '创建时间',
                key: 'createTime',
                width: '220',
                type: 'datetime',
              },
              {
                title: '审核状态',
                key: 'auditStatus',
                width: '120',
                type: 'select',
                selectOptions: [
                  {
                    value: '0',
                    label: '未审核',
                  },
                  {
                    value: '1',
                    label: '审核',
                  },
                ],
                render: (h, params) => {
                  const selectionArray = [
                    {
                      value: '0',
                      label: '未审核',
                    },
                    {
                      value: '1',
                      label: '审核',
                    },
                  ];
                  // 根据设置的选项集合，生成对应的下拉选项
                  let optionArray = [];
                  selectionArray.map((item) => {
                    optionArray.push(
                      h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label,
                        },
                        style: {
                          width: '80px',
                        },
                      })
                    );
                  });

                  return h(
                    'Select',
                    {
                      props: {
                        disabled: false,
                        size: 'small',
                        placeholder: '',
                        value: String(params.row['auditStatus']),
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      },
                    },
                    optionArray
                  );
                },
              },
              {
                title: '审核人代码',
                key: 'auditPersonNumber',
                width: '120',
                type: 'text',
              },
              {
                title: '审核人姓名',
                key: 'auditPersonName',
                width: '120',
                type: 'text',
              },
              {
                title: '审核时间',
                key: 'auditTime',
                width: '120',
                type: 'datetime',
              },
              {
                title: '禁用状态',
                key: 'isDisable',
                width: '120',
                type: 'select',
                selectOptions: [
                  {
                    value: 'false',
                    label: '未禁用',
                  },
                  {
                    value: 'true',
                    label: '禁用',
                  },
                ],
                render: (h, params) => {
                  const selectionArray = [
                    {
                      value: 'false',
                      label: '未禁用',
                    },
                    {
                      value: 'true',
                      label: '禁用',
                    },
                  ];
                  // 根据设置的选项集合，生成对应的下拉选项
                  let optionArray = [];
                  selectionArray.map((item) => {
                    optionArray.push(
                      h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label,
                        },
                        style: {
                          width: '80px',
                        },
                      })
                    );
                  });
                  return h(
                    'Select',
                    {
                      props: {
                        disabled: false,
                        size: 'small',
                        value: String(params.row['isDisable']),
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      },
                    },
                    optionArray
                  );
                },
              },
              {
                title: '禁用人代码',
                key: 'disablePersonNumber',
                width: '120',
                type: 'text',
              },
              {
                title: '禁用人姓名',
                key: 'disablePersonName',
                width: '120',
                type: 'text',
              },
              {
                title: '禁用时间',
                key: 'disableTime',
                width: '220',
                type: 'datetime',
              },
              {
                title: '更新时间',
                key: 'updateTime',
                width: '220',
                type: 'datetime',
              },
            ];
            if (!this.tableDialog.searchTrigger) {
              this.tableDialog.searchSelected = this.tableDialog.tableColumn[0].key;
            } else {
              this.tableDialog.searchTrigger = false;
            }
            res = await Promise.resolve(getWorkerList(param));
            this.tableDialog.total = res.data.data.total;
            this.tableDialog.pageCount = res.data.data.pages;
            this.tableDialog.tableData = res.data.data.records;
            break;
          case 'personName':
            this.tableDialog.confirmDisabled = true;
            this.tableDialog.hasMultiSelection = false;
            this.tableDialog.tableColumn = [
              {
                title: '员工代码',
                key: 'number',
                width: '250',
                type: 'text',
              },
              {
                title: '员工名称',
                key: 'name',
                width: '250',
                type: 'text',
              },
              {
                title: '员工属性',
                key: 'type',
                width: '250',
                type: 'select',
                selectOptions: [
                  {
                    value: '0',
                    label: '在职',
                  },
                  {
                    value: '1',
                    label: '试用',
                  },
                  {
                    value: '2',
                    label: '实习',
                  },
                  {
                    value: '3',
                    label: '退休',
                  },
                  {
                    value: '4',
                    label: '离职',
                  },
                  {
                    value: '5',
                    label: '离休',
                  },
                ],
                render: (h, params) => {
                  const selectionArray = [
                    {
                      value: '0',
                      label: '在职',
                    },
                    {
                      value: '1',
                      label: '试用',
                    },
                    {
                      value: '2',
                      label: '实习',
                    },
                    {
                      value: '3',
                      label: '退休',
                    },
                    {
                      value: '4',
                      label: '离职',
                    },
                    {
                      value: '5',
                      label: '离休',
                    },
                  ];
                  // 根据设置的选项集合，生成对应的下拉选项
                  let optionArray = [];
                  selectionArray.map((item) => {
                    optionArray.push(
                      h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label,
                        },
                        style: {
                          width: '80px',
                        },
                      })
                    );
                  });

                  return h(
                    'Select',
                    {
                      props: {
                        disabled: false,
                        size: 'small',
                        placeholder: '',
                        value: String(params.row['type']),
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      },
                    },
                    optionArray
                  );
                },
              },
              {
                title: '所属部门代码',
                key: 'departmentNumber',
                width: '250',
                type: 'text',
              },
              {
                title: '所属部门名称',
                key: 'departmentName',
                width: '250',
                type: 'text',
              },
              {
                title: '所属班组代码',
                key: 'teamNumber',
                width: '250',
                type: 'text',
              },
              {
                title: '所属班组名称',
                key: 'teamName',
                width: '250',
                type: 'text',
              },
              {
                title: '公司邮箱',
                key: 'email',
                width: '250',
                type: 'text',
              },
              {
                title: '家庭地址',
                key: 'address',
                width: '250',
                type: 'text',
              },
              {
                title: '联系电话',
                key: 'phone',
                width: '250',
                type: 'text',
              },
              {
                title: '备注',
                key: 'note',
                width: '320',
                type: 'text',
              },
              {
                title: '制单人代码',
                key: 'docMakerNumber',
                width: '120',
                type: 'text',
              },
              {
                title: '制单人姓名',
                key: 'docMakerName',
                width: '120',
                type: 'text',
              },
              {
                title: '创建时间',
                key: 'createTime',
                width: '220',
                type: 'datetime',
              },
              {
                title: '审核状态',
                key: 'auditStatus',
                width: '120',
                type: 'select',
                selectOptions: [
                  {
                    value: '0',
                    label: '未审核',
                  },
                  {
                    value: '1',
                    label: '审核',
                  },
                ],
                render: (h, params) => {
                  const selectionArray = [
                    {
                      value: '0',
                      label: '未审核',
                    },
                    {
                      value: '1',
                      label: '审核',
                    },
                  ];
                  // 根据设置的选项集合，生成对应的下拉选项
                  let optionArray = [];
                  selectionArray.map((item) => {
                    optionArray.push(
                      h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label,
                        },
                        style: {
                          width: '80px',
                        },
                      })
                    );
                  });

                  return h(
                    'Select',
                    {
                      props: {
                        disabled: false,
                        size: 'small',
                        placeholder: '',
                        value: String(params.row['auditStatus']),
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      },
                    },
                    optionArray
                  );
                },
              },
              {
                title: '审核人代码',
                key: 'auditPersonNumber',
                width: '120',
                type: 'text',
              },
              {
                title: '审核人姓名',
                key: 'auditPersonName',
                width: '120',
                type: 'text',
              },
              {
                title: '审核时间',
                key: 'auditTime',
                width: '120',
                type: 'datetime',
              },
              {
                title: '禁用状态',
                key: 'isDisable',
                width: '120',
                type: 'select',
                selectOptions: [
                  {
                    value: 'false',
                    label: '未禁用',
                  },
                  {
                    value: 'true',
                    label: '禁用',
                  },
                ],
                render: (h, params) => {
                  const selectionArray = [
                    {
                      value: 'false',
                      label: '未禁用',
                    },
                    {
                      value: 'true',
                      label: '禁用',
                    },
                  ];
                  // 根据设置的选项集合，生成对应的下拉选项
                  let optionArray = [];
                  selectionArray.map((item) => {
                    optionArray.push(
                      h('Option', {
                        props: {
                          disabled: false,
                          value: item.value,
                          label: item.label,
                        },
                        style: {
                          width: '80px',
                        },
                      })
                    );
                  });
                  return h(
                    'Select',
                    {
                      props: {
                        disabled: false,
                        size: 'small',
                        value: String(params.row['isDisable']),
                      },
                      style: {
                        width: '80px',
                        pointerEvents: 'none',
                      },
                    },
                    optionArray
                  );
                },
              },
              {
                title: '禁用人代码',
                key: 'disablePersonNumber',
                width: '120',
                type: 'text',
              },
              {
                title: '禁用人姓名',
                key: 'disablePersonName',
                width: '120',
                type: 'text',
              },
              {
                title: '禁用时间',
                key: 'disableTime',
                width: '220',
                type: 'datetime',
              },
              {
                title: '更新时间',
                key: 'updateTime',
                width: '220',
                type: 'datetime',
              },
            ];
            if (!this.tableDialog.searchTrigger) {
              this.tableDialog.searchSelected = this.tableDialog.tableColumn[0].key;
            } else {
              this.tableDialog.searchTrigger = false;
            }
            res = await Promise.resolve(getWorkerList(param));
            this.tableDialog.total = res.data.data.total;
            this.tableDialog.pageCount = res.data.data.pages;
            this.tableDialog.tableData = res.data.data.records;
            break;
          case 'box8302Number':
            this.tableDialog.confirmDisabled = true;
            this.tableDialog.hasMultiSelection = false;
            this.tableDialog.tableColumn = [
              {
                title: '云盒代码',
                key: 'number',
                width: '250',
                type: 'text',
              },
              {
                title: '云盒型号',
                key: 'box8302BrandName',
                width: '250',
                type: 'text',
              },
              {
                title: '连接通道',
                key: 'connectionCompleteName',
                width: '300',
                type: 'text',
              },
              {
                title: '数据表名称',
                key: 'databaseTableName',
                width: '250',
                type: 'text',
              },
              {
                title: '站地址',
                key: 'stationAddress',
                width: '250',
                type: 'text',
              },
              {
                title: '备注信息',
                key: 'mark',
                width: '250',
                type: 'datetime',
              },
              {
                title: '更新时间',
                key: 'updateTime',
                width: '250',
                type: 'datetime',
              },
            ];
            if (!this.tableDialog.searchTrigger) {
              this.tableDialog.searchSelected = this.tableDialog.tableColumn[0].key;
            } else {
              this.tableDialog.searchTrigger = false;
            }
            res = await Promise.resolve(getX8302boxList(param));
            this.tableDialog.total = res.data.data.total;
            this.tableDialog.pageCount = res.data.data.pages;
            this.tableDialog.tableData = res.data.data.records;
            break;
          default:
            break;
        }
        this.tableDialog.tableLoading = false;
      } catch (e) {
        console.log(e);
      }
    },
    tableDialogClose() {
      this.tableDialog.currentPage = 1;
      this.tableDialog.confirmDisabled = true;
    },
    handleTableDialogSearch() {
      this.tableDialog.searchTrigger = true;
      this.tableDialog.currentPage = 1;
      this.tableDialogOpen();
    },
    handleCurrentChange(val) {
      this.tableDialog.tableSelected = val;
      this.tableDialog.confirmDisabled = false;
    },
    handleFormMulti() {
      switch (this.tableDialog.trigger) {
        // 负责人
        // 执行人
        case 'chargePersonNameList':
          let arr1 = [];
          this.pushForm.chargePersonList.forEach((i) => {
            i.forEach((k) => {
              arr1.push(k.name);
              // 生成提交用数据格式
              this.pushForm.execSubmitParam.push({
                personId: k.id,
                personNumber: k.number,
                personName: k.name,
                orgId: this.orgId,
              });
            });
          });
          this.pushForm.validate.chargePersonNameList = arr1.join(',');

          break;
        // 设备
        case 'equipmentNameList':
          let arr2 = [];
          this.pushForm.equipmentList.forEach((i) => {
            i.forEach((k) => {
              arr2.push(k.name);
              this.pushForm.equipmentSubmitParam.push({
                deviceId: k.id,
                deviceNumber: k.number,
                deviceName: k.name,
                orgId: this.orgId,
              });
            });
          });
          this.pushForm.validate.equipmentNameList = arr2.join(',');

          break;
        default:
          break;
      }
      this.handleTableDialogCancel();
    },
    handleFormTableDbClick() {
      const item = this.tableDialog.tableSelected;
      switch (this.tableDialog.trigger) {
        // 负责人
        case 'box8302Number':
          this.formValidate.box8302Number = item.number;
          this.formValidate.box8302BrandNumber = item.box8302BrandName;
          this.pushForm.cloudbox.id = item.id;
          this.handleTableDialogCancel();
          // 获取云盒对应数据点信息
          this.getInfoPointData(item.id);
          break;
        case 'operationName':
          this.formValidate.operationName = item.name;
          this.pushForm.person.id = item.id;
          this.handleTableDialogCancel();
          break;
        case 'personName':
          this.infoDialog.formValidate.personName = item.name;
          this.pushForm.personId = item.id;
          this.handleTableDialogCancel();
          break;
        default:
          break;
      }
    },
    handleSelectAll(val) {
      switch (this.tableDialog.trigger) {
        case 'chargePersonNameList':
          this.pushForm.chargePersonList[
            this.tableDialog.currentPage - 1
          ] = val;
          break;
        case 'equipmentNameList':
          this.pushForm.equipmentList[this.tableDialog.currentPage - 1] = val;
          break;
        default:
          break;
      }
    },
    handleSelect(val) {
      switch (this.tableDialog.trigger) {
        case 'chargePersonNameList':
          this.pushForm.chargePersonList[
            this.tableDialog.currentPage - 1
          ] = val;
          break;
        case 'equipmentNameList':
          this.pushForm.equipmentList[this.tableDialog.currentPage - 1] = val;
          break;
        default:
          break;
      }
    },
    handleSelectionChange(val) {},
    handleTableDialogPageChange(val) {
      this.tableDialog.currentPage = val;
      this.tableDialogOpen();
    },
    handleTableDialogConfirm() {
      this.handleFormTableDbClick();
    },
    handleTableDialogCancel() {
      this.tableDialog.v = false;
      this.tableDialogClose();
    },
    picMouseOver(n) {
      this.$refs.hintDiv[0].style.height = '40px';
    },
    picMouseOut(n) {
      this.$refs.hintDiv[0].style.height = '0';
    },
    clearFormValidate() {
      this.formValidate = {
        number: '',
        name: '',
        mark: '',
        box8302Number: '',
        box8302BrandNumber: '',
        operationName: '',
        note: '',
        docMakerName: '',
        auditPersonName: '',
        createTime: '',
        auditTime: '',
      };
    },
    // form-end
    setTableRowStyle() {
      return 'background: #F8F8F9; color:#606266';
    },
  },
};
</script>
<style lang="less">
.the-dialog {
  .el-icon-more {
    bottom: 0 !important;
  }
}
.form-container {
  .el-icon-more {
    position: relative;
    right: 7px;
    bottom: 4px;
  }
}
</style>
<style lang='less' scoped>
@import './style';
@import './style/style';
@import './dialogTableStyle.less';
.form-container {
  ::v-deep {
    .el-form-item__error {
      position: relative;
      font-size: 10px;
      bottom: 6px;
    }
    .strangeDialog {
      .el-form-item__error {
        left: 100px !important;
        position: relative;
        font-size: 10px;
      }
    }
  }
}

.the-dialog {
  ::v-deep {
    .el-icon-more {
      position: relative;
      right: 7px;
      bottom: 0 !important;
    }
  }
}
.input-num-wrapper {
  ::v-deep {
    .el-input__inner {
      text-align: right;
    }
  }
}
::v-deep {
  .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
    background-color: #1890ff;
    border-radius: 5px 5px 0 0;
    color: white;
  }

  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: none;
  }

  .el-tabs__nav-wrap .is-top {
    border-bottom: none;
    border-left: none;
    transition: 0ms;
  }

  .el-tabs__header {
    border-bottom: 1px solid #1890ff;
  }

  .el-tabs__item:hover {
    color: #4f4f4f;
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
</style>

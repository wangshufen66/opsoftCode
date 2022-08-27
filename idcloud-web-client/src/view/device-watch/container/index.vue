<style lang="less" scoped>
@import './dialogTableStyle.less';

::v-deep {
  .el-form-item__error {
    left: 100px;
  }

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

#cloudbox-point-config-container {
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
    // display: flex;
    // flex-wrap: wrap;
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

.pagination-style {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.input-num-wrapper {
  ::v-deep {
    .el-input__inner {
      text-align: right;
    }
  }
}

.name {
  text-overflow: ellipsis;
  overflow: hidden;
}

.addr {
  font-size: 12px;
  color: #b4b4b4;
}
</style>
<style lang="less">
#dialog-table {
  .table-select {
    width: 60px !important;
  }

  .el-select .el-input.is-disabled .el-input__inner {
    cursor: default;
  }

  .el-input__suffix {
    display: none;
  }

  .el-input.is-disabled .el-input__inner {
    background-color: #fff;
  }

  .el-input__inner {
    padding: 0 10px;
    text-align: center;
    color: #606266;
  }
}
</style>
<style>
.el-table .disabled-row {
  background: #f8f8f8;
}
</style>
<template>
  <div id="cloudbox-point-config-container" style="display: flex;flex-direction: row;margin-left:-27px">
    <id-tree class="main-tree" ref="idTree" v-loading="treeLoading" :treeData="treeData" :highlight-current="highlightCurrent" :default-expand-all="false" :idConfig="treeActionBar" @nodeClick="nodeSelectFunc" @treeAdd="addNodeFunc" @treeDelete="delNodeFunc"></id-tree>
    <div style="margin-left: 10px;flex-grow: 1;">
      <div class="else-header-wrapper">
        <span>{{ containerInfosData.name }}</span>
        <div class="btn-wrapper" style="display: flex">
          <el-button @click="saveContainer" size="small" type="primary">保存
          </el-button>
          <div @click="handleClickRefresh" style="height: 32px;line-height: 32px;margin-left: 8px;cursor: pointer;">
            <i class="el-icon-refresh-right"></i>
            <span style="margin-left: 4px; font-size: 14px">刷新</span>
          </div>
        </div>
      </div>
      <el-form label-position="right" class="grid-form-style" ref="theForm" label-width="100px" :rules="formRule" :model="formValidate">
        <div v-for="item in formColumn" :key="item.key" :class="item.islong ? 'form-inner-long' : 'form-inner'">
          <el-form-item v-if="containerInfosData.ctrType === 3 ||item.type !== 'diaTreeTable'" :label="item.title" label-width :prop="item.key" class="form-item">
            <el-input v-if="item.type === 'text'" class="input" v-model="formValidate[item.key]"></el-input>
            <div v-else-if="item.type === 'number'" class="input-num-wrapper">
              <el-input-number :min="0" class="input input-num" :controls="false" v-model="formValidate[item.key]"></el-input-number>
            </div>
            <el-cascader v-else-if="item.type === 'cascader'" class="input" :placeholder="item.placeholder" v-model="formValidate[item.key]" :options="item.options" clearable @change="cascaderChange" filterable />
            <el-input class="input" v-else-if="item.type === 'disabled'" disabled v-model="formValidate[item.key]"></el-input>
            <el-date-picker v-else-if="item.type === 'dateTime'" v-model="formValidate[item.key]" type="datetime" class="input" placeholder disabled></el-date-picker>
            <el-autocomplete class="input" v-else-if="item.type === 'autoComplete'" :debounce="1000" v-model.trim="formValidate[item.key]" :fetch-suggestions="querySearch" placeholder="街道-大楼名称-门牌号码" :trigger-on-focus="false" @select="getAnswer">
              <template slot-scope="{ item }">
                <div class="name">{{ item.name }}</div>
                <span class="addr">{{ item.address }}</span>
              </template>
            </el-autocomplete>
            <el-select v-else-if="item.type === 'select'" class="input" v-model="formValidate[item.key]">
              <el-option v-for="i in item.options" :key="i.key" :label="i.label" :value="i.value"></el-option>
            </el-select>
            <div class="picture" v-else-if="item.type === 'picture'">
              <div @mouseover="picMouseOver" @mouseout="picMouseOut" @click="changePictureDialog.v = true" ref="hintDiv" v-text="item.hintText" class="hint-div"></div>
              <el-image @mouseover="picMouseOver" @mouseout="picMouseOut" style="width: 300px; height: 150px; border-radius: 4px" :src="item.url" :preview-src-list="item.srcList">
                <div style="cursor: pointer; width: 70%" @click="changePictureDialog.v = true" slot="error" class="image-slot">
                  <i style="font-size: 128px" class="el-icon-picture-outline"></i>
                  <span style="font-size: 16px">点击上传</span>
                </div>
              </el-image>
            </div>
            <el-input type="textarea" class="input" v-else-if="item.type === 'textarea'" v-model="formValidate[item.key]"></el-input>
            <el-input class="input" v-else-if="item.type === 'dialogTable'" readonly v-model="formValidate[item.key]">
              <el-button @click="tableDialog.v = true" style="width: 40px" icon="el-icon-more" slot="append"></el-button>
            </el-input>
            <id-input-popup class="input" v-else-if="item.type === 'diaTreeTable'" style="display: inline-block" :id="formValidate.deviceId" :number="formValidate[item.key]" :name="formValidate.deviceName" :tableColumns="tableColumns" :getTreeList="getTreeList" :getTableList="getTableList" :controlTooltipShow="controlTooltipShow" diaTitle="设备档案" @confirm="confirm($event, 'form')" @beforeGetTableList="beforeGetTableList">
            </id-input-popup>
            <div v-else-if="item.type === 'space'"></div>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <el-dialog width="280px" :title="changePictureDialog.title" :visible.sync="changePictureDialog.v">
      <el-upload action style="width: 200px" class="avatar-uploader" :http-request="getChangePicFile" :before-upload="beforeAvatarUpload" :show-file-list="false">
        <img style="width: 240px; height: 135px" v-if="changePictureDialog.picFile !== ''" :src="changePictureDialog.picFile" class="avatar" />
        <i style="width: 230px" v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="
            (changePictureDialog.v = false),
              (changePictureDialog.picFile = ''),
              (changePictureDialog.rawFile = {})
          ">取 消</el-button>
        <el-button type="primary" size="small" @click="postPic">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 关联数据点/信息点 dialog -->
    <el-dialog @opened="tableDialogOpenCb" top="60px" :width="tableDialog.width" @closed="tableDialogCloseCb" :title="tableDialog.title" :visible.sync="tableDialog.v">
      <div v-show="!tableDialog.noParentInfoPoint">
        <el-radio-group size="small" v-model="tableDialog.tabSelected">
          <el-radio-button v-if="tableDialog.ifHasCloudboxTab" label="cloudbox">云盒
          </el-radio-button>
          <el-radio-button v-if="tableDialog.ifHasPLCTab" label="plc">PLC
          </el-radio-button>
          <el-radio-button v-if="tableDialog.ifHasCNCTab" label="cnc">CNC
          </el-radio-button>
          <el-radio-button v-if="tableDialog.ifHasBox8303Tab" label="box8303">云盒8303
          </el-radio-button>
        </el-radio-group>
      </div>
      <div v-show="!tableDialog.noParentInfoPoint">
        <!-- 现在分为4个Table -->
        <el-table id="dialog-table" ref="cloudboxTable" @select="cloudboxTableSelectCb" @select-all="cloudboxCancelAll" :data="table.cloudbox.show" v-loading="table.loading" v-show="tableDialog.tabSelected === 'cloudbox'" :row-class-name="tableRowClassName" highlight-current-row @current-change="handleCloudBoxCurrentChange">
          <!--  :highlight-current-row="containerInfosData.ctrType === 4"-->
          <!--<el-table-column-->
          <!--:selectable="checkboxCheck"-->
          <!--type="selection"-->
          <!--width="55"-->
          <!--&gt;</el-table-column>-->
          <el-table-column class="dialog-table-style" v-for="(item, index) in table.cloudbox.column" :key="index" :property="item.key" :label="item.title">
            <template slot-scope="scope">
              <el-select v-if="item.type === 'select'" class="table-select" disabled size="mini" v-model="scope.row[item.key]">
                <el-option v-for="i in item.renderOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table id="dialog-table" ref="plcTable" @select="plcTableSelectCb" @select-all="plcCancelAll" :data="table.plc.show" v-loading="table.loading" v-show="tableDialog.tabSelected === 'plc'" :row-class-name="tableRowClassName" :highlight-current-row="containerInfosData.ctrType === 4" @current-change="handlePlcCurrentChange">
          <el-table-column :selectable="checkboxCheck" type="selection" width="55" v-if="containerInfosData.ctrType !== 4"></el-table-column>
          <el-table-column class="dialog-table-style" v-for="(item, index) in table.plc.column" :key="index" :property="item.key" :label="item.title">
            <template slot-scope="scope">
              <el-select v-if="item.type === 'select'" class="table-select" disabled size="mini" v-model="scope.row[item.key]">
                <el-option v-for="i in item.renderOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- @select="cncTableSelectCb"
          @select-all="cncCancelAll" -->
        <el-table id="dialog-table" ref="cncTable" :data="table.cnc.show" v-loading="table.loading" v-show="tableDialog.tabSelected === 'cnc'" :row-class-name="tableRowClassName" highlight-current-row @current-change="handleCncCurrentChange">
          <!-- <el-table-column
            :selectable="checkboxCheck"
            type="selection"
            width="55"
          ></el-table-column> -->
          <el-table-column class="dialog-table-style" v-for="(item, index) in table.cnc.column" :key="index" :property="item.key" :label="item.title">
            <template slot-scope="scope">
              <el-select v-if="item.type === 'select'" class="table-select" disabled size="mini" v-model="scope.row[item.key]">
                <el-option v-for="i in item.renderOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table id="dialog-table" ref="box8303Table" @select="box8303TableSelectCb" @select-all="box8303CancelAll" :data="table.box8303.show" v-loading="table.loading" v-show="tableDialog.tabSelected === 'box8303'" :row-class-name="tableRowClassName" highlight-current-row @current-change="handleBox8303CurrentChange">
          <!--  :highlight-current-row="containerInfosData.ctrType === 4"-->
          <!--<el-table-column-->
          <!--:selectable="checkboxCheck"-->
          <!--type="selection"-->
          <!--width="55"-->
          <!--&gt;</el-table-column>-->
          <el-table-column class="dialog-table-style" v-for="(item, index) in table.box8303.column" :key="index" :property="item.key" :label="item.title">
            <template slot-scope="scope">
              <el-select v-if="item.type === 'select'" class="table-select" disabled size="mini" v-model="scope.row[item.key]">
                <el-option v-for="i in item.renderOptions" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
              <span v-else>{{ scope.row[item.key] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!tableDialog.noParentInfoPoint" class="pagination-style">
        <el-pagination @current-change="cloudboxTableChangePage" :current-page.sync="table.cloudbox.current" :page-size="8" v-show="tableDialog.tabSelected === 'cloudbox'" background layout="total,prev, pager, next" :total="table.cloudbox.total"></el-pagination>
        <el-pagination @current-change="plcTableChangePage" :current-page.sync="table.plc.current" :page-size="8" v-show="tableDialog.tabSelected === 'plc'" background layout="total,prev, pager, next" :total="table.plc.total"></el-pagination>
        <el-pagination @current-change="cncTableChangePage" :current-page.sync="table.cnc.current" :page-size="8" v-show="tableDialog.tabSelected === 'cnc'" background layout="total,prev, pager, next" :total="table.cnc.total"></el-pagination>
        <el-pagination @current-change="box8303TableChangePage" :current-page.sync="table.box8303.current" :page-size="8" v-show="tableDialog.tabSelected === 'box8303'" background layout="total,prev, pager, next" :total="table.box8303.total"></el-pagination>
      </div>
      <div v-show="tableDialog.noParentInfoPoint">
        <span>上层容器无关联信息点</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="tableDialogCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="tableDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加容器 dialog -->
    <el-dialog @open="addContainerDialogOpenCb" top="60px" :width="addContainerDialog.width" @closed="addContainerDialogCloseCb" :title="addContainerDialog.title" :visible.sync="addContainerDialog.v">
      <el-form :model="addContainerDialog.addContainerForm.formValidate" :rules="addContainerDialog.addContainerForm.rules" ref="addContainerForm" label-width="100px">
        <el-form-item label="容器代码" prop="ctrNumber">
          <el-input v-model="addContainerDialog.addContainerForm.formValidate.ctrNumber" maxlength="10" show-word-limit autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="容器名称" prop="ctrName">
          <el-input v-model="addContainerDialog.addContainerForm.formValidate.ctrName" maxlength="10" show-word-limit autocomplete="off" style="width: 250px"></el-input>
        </el-form-item>
        <el-form-item label="容器类型" prop="ctrType">
          <el-select style="width: 250px" v-model="addContainerDialog.addContainerForm.formValidate.ctrType">
            <el-option v-if="containerInfosData.ctrType === undefined" label="工厂" :value="1"></el-option>
            <el-option v-if="containerInfosData.ctrType === 1 ||containerInfosData.ctrType === undefined" label="车间" value="2"></el-option>
            <el-option v-if="containerInfosData.ctrType < 3 ||containerInfosData.ctrType === undefined" label="设备" :value="3"></el-option>
            <el-option label="信息点" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="addContainerDialog.addContainerForm.formValidate.ctrType === 3" label="关联设备" prop="deviceName">
          <id-input-popup style="width: 250px; display: inline-block" :id="addContainerDialog.addContainerForm.formValidate.deviceId" :number="
              addContainerDialog.addContainerForm.formValidate.deviceNumber
            " :name="addContainerDialog.addContainerForm.formValidate.deviceName" :tableColumns="tableColumns" :getTreeList="getTreeList" :getTableList="getTableList" diaTitle="设备档案" @confirm="confirm($event, 'dia')" @beforeGetTableList="beforeGetTableList">
          </id-input-popup>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="addContainerDialogCancel">取 消</el-button>
        <el-button type="primary" size="small" @click="addContainerDialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  findContainerList,
  getContainerDetail,
  saveContainer,
  delContainer,
  getDataPointList,
  uploadPic,
} from '@/api/basedata';
import imageConversion from 'image-conversion';
import apiMixin from './apiMixins';
import config from '@/config';
import IdInputPopup from '@/components/id-input-popup/index';
import axios from '@/libs/api.request';
import { getList as getDeviceList } from '@/api/deviceMaintenance/deviceArchive';
import {
  getUncheckColor,
  getCheckedColor,
  getUnenabledColor,
  getEnabledColor,
  getFirstColor,
} from '@/utils/colorUtils';
import IdTree from '@/components/id-tree/index';
import IdButtonConfig from '@/components/id-button/IdButtonConfig';

export default {
  name: 'container',
  components: { IdInputPopup, IdTree },
  mixins: [apiMixin],
  computed: {
    //表体弹窗树接口
    getTableList() {
      return getDeviceList;
    },
    //表体弹窗表格接口
    getTreeList() {
      return function (params) {
        return axios.request({
          url: `/group/getGroupList/type=22`,
          method: 'get',
          params: params,
        });
      };
    },
  },
  data() {
    return {
      controlTooltipShow: true, //控制tooltipShow的显示
      tableColumns: [
        {
          tag: 'el-table-column',
          label: '设备代码',
          prop: 'number',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备名称',
          prop: 'name',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备分组',
          prop: 'groupName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '设备类别',
          prop: 'typeName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '规格',
          prop: 'specifications',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '型号',
          prop: 'model',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '生产厂商',
          prop: 'manufacturerName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '供应厂商',
          prop: 'supplierName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '部门',
          prop: 'departmentName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '位置',
          prop: 'warehouseName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '负责人',
          prop: 'personName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '制单人',
          prop: 'docMakerName',
          width: 180,
          showOverflowTooltip: true,
          comp: 'String',
        },
        {
          tag: 'el-table-column',
          label: '制单时间',
          prop: 'createTime',
          width: 180,
          showOverflowTooltip: true,
          comp: 'Datetime',
        },
      ], //弹窗设置

      cloudboxCheckedList: [],
      box8303CheckedList: [],
      plcCheckedList: [],
      cncCheckedList: [],

      cloudboxPointCheckedList: [],
      box8303PointCheckedList: [],
      plcPointCheckedList: [],
      cncPointCheckedList: [],

      addContainerDialog: {
        title: '添加容器',
        v: false,
        width: '420px',
        addContainerForm: {
          formValidate: {
            ctrNumber: '',
            ctrName: '',
            ctrType: '',
            deviceId: 0,
            deviceName: '',
          },
          rules: {
            ctrNumber: [
              { required: true, message: '此项不能为空', trigger: 'blur' },
              {
                validator: (rule, value, callback) => {
                  this.checkCtrNumberValidate(rule, value, callback);
                },
                trigger: ['blur'],
              },
            ],
            ctrName: [
              { required: true, message: '此项不能为空', trigger: 'blur' },
            ],
            ctrType: [
              { required: true, message: '此项不能为空', trigger: 'blur' },
            ],
            deviceName: [
              { required: true, message: '此项不能为空', trigger: 'change' },
            ],
          },
        },
      },
      tableDialog: {
        title: '',
        width: '1000px',
        v: false,
        trigger: '',
        searchInput: '',
        searchSelected: '',
        tableColumn: [],
        tableData: [],

        cloudboxTableData: [],
        box8303TableData: [],
        plcTableData: [],
        cncTableData: [],

        currentPage: 1,
        total: 0,
        tabSelected: 'cloudbox',
        doNotOpenCb: false,
        ifHasCNCTab: false,
        ifHasPLCTab: false,
        ifHasCloudboxTab: false,
        ifHasBox8303Tab: false,
        dialogInfoPointInit: false,
        noParentInfoPoint: false,

        notAbleToSelect: false,
        // 选择

        cloudboxTableSelection: [],
        box8303TableSelection: [],
        plcTableSelection: [],
        cncTableSelection: [],

        cloudboxTableSelectionConfirmed: [],
        box8303TableSelectionConfirmed: [],
        plcTableSelectionConfirmed: [],
        cncTableSelectionConfirmed: [],

        tableSelection: [],
        tableSelectionConfirmed: [],

        infoPointArr: [],

        // 去重的提交用 选项 id(后改为对象) list
        cloudboxTableSelectionConfirmedSetted: [],
        box8303TableSelectionConfirmedSetted: [],
        plcTableSelectionConfirmedSetted: [],
        cncTableSelectionConfirmedSetted: [],
        onlyCanChooseOne: false,
        tableLoading: false,
      },
      changePictureDialog: {
        title: '上传容器图片',
        v: false,
        picFile: '',
        rawFile: {},
      },
      cardList: [],

      formColumn: [
        {
          title: '容器代码',
          key: 'ctrNumber',
          width: '250',
          type: 'disabled',
        },
        {
          title: '容器名称',
          key: 'ctrName',
          width: '250',
          type: 'text',
        },
        {
          title: '容器类型',
          key: 'ctrType',
          width: '250',
          type: 'select',
          options: [
            {
              label: '工厂',
              value: 1,
            },
            {
              label: '车间',
              value: 2,
            },
            {
              label: '设备',
              value: 3,
            },
            {
              label: '信息点',
              value: 4,
            },
          ],
        },

        {
          title: '关联数据点',
          key: 'infoPointStr',
          width: '250',
          type: 'dialogTable',
        },
        {
          title: '备注信息',
          key: 'mark',
          width: '250',
          type: 'textarea',
          islong: true,
        },
      ],
      formColumnOrigin: [
        {
          title: '容器代码',
          key: 'ctrNumber',
          width: '250',
          type: 'disabled',
        },
        {
          title: '容器名称',
          key: 'ctrName',
          width: '250',
          type: 'text',
        },
        {
          title: '容器类型',
          key: 'ctrType',
          width: '250',
          type: 'select',
          options: [
            {
              label: '工厂',
              value: 1,
            },
            {
              label: '车间',
              value: 2,
            },
            // {
            //   label: '设备',
            //   value: 3,
            // },
            // {
            //   label: '信息点',
            //   value: 4,
            // },
          ],
        },
        {
          title: '关联数据点',
          key: 'infoPointStr',
          width: '250',
          type: 'dialogTable',
        },
        {
          title: '关联设备',
          key: 'deviceNumber',
          width: '250',
          type: 'diaTreeTable',
        },
        {
          title: '备注信息',
          key: 'mark',
          width: '250',
          type: 'textarea',
          islong: true,
        },
      ],
      formColumn3: [
        {
          title: '容器代码',
          key: 'ctrNumber',
          width: '250',
          type: 'disabled',
        },
        {
          title: '容器名称',
          key: 'ctrName',
          width: '250',
          type: 'text',
        },
        {
          title: '容器类型',
          key: 'ctrType',
          width: '250',
          type: 'select',
          options: [
            // {
            //   label: '工厂',
            //   value: 1,
            // },
            // {
            //   label: '车间',
            //   value: 2,
            // },
            {
              label: '设备',
              value: 3,
            },
            // {
            //   label: '信息点',
            //   value: 4,
            // },
          ],
        },
        {
          title: '关联数据点',
          key: 'infoPointStr',
          width: '250',
          type: 'dialogTable',
        },
        {
          title: '关联设备',
          key: 'deviceNumber',
          width: '250',
          type: 'diaTreeTable',
        },
        {
          title: '备注信息',
          key: 'mark',
          width: '250',
          type: 'textarea',
          islong: true,
        },
      ],
      formColumn4: [
        {
          title: '容器代码',
          key: 'ctrNumber',
          width: '250',
          type: 'disabled',
        },
        {
          title: '容器名称',
          key: 'ctrName',
          width: '250',
          type: 'text',
        },
        {
          title: '容器类型',
          key: 'ctrType',
          width: '250',
          type: 'select',
          options: [
            // {
            //   label: '工厂',
            //   value: 1,
            // },
            // {
            //   label: '车间',
            //   value: 2,
            // },
            // {
            //   label: '设备',
            //   value: 3,
            // },
            {
              label: '信息点',
              value: 4,
            },
          ],
        },
        {
          title: '关联数据点',
          key: 'infoPointStr',
          width: '250',
          type: 'dialogTable',
        },
        {
          title: '偏差值',
          key: 'deviation',
          width: '250',
          type: 'number',
        },
        {
          title: '偏差值单位',
          key: 'deviationUnit',
          width: '250',
          type: 'select',
          options: [
            {
              label: '数值',
              value: 0,
            },
            {
              label: '%',
              value: 1,
            },
          ],
        },
        {
          title: '备注信息',
          key: 'mark',
          width: '250',
          type: 'textarea',
          islong: true,
        },
      ],
      formValidate: {
        createTime: '',
        ctrAddress: '',
        ctrCity: '',
        // ctrImg: "",
        ctrLat: '',
        ctrLng: '',
        ctrName: '',
        ctrNumber: '',
        ctrParent: '',
        ctrPrefecture: '',
        ctrProvince: '',
        ctrRelation: '',
        ctrSwitch: '',
        ctrType: '',
        // ctrVideo: "",
        id: '',
        isDelete: '',
        mark: '',
        orgId: '',
        pointContainerList: '',
        pointNameList: [],
        // 关联数据点，展示字段
        infoPointStr: '',
        updateTime: '',
        provinceCityDistrict: [],
        //新增字段
        deviceId: 0,
        deviation: '',
        deviationUnit: 0,
        deviceNumber: '',
        deviceName: '',
      },
      formRule: {
        ctrNumber: [
          { required: true, message: '此项不能为空', trigger: 'blur' },
        ],
        ctrName: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        ctrType: [{ required: true, message: '此项不能为空', trigger: 'blur' }],
        deviceName: [
          { required: true, message: '此项不能为空', trigger: 'change' },
        ],
      },

      formLevel: '',
      //新tree参数
      treeLoading: false,
      treeSelectData: {}, //树形目录当前选中数据
      treeActionBar: [
        new IdButtonConfig('tree-open', '', 'treeOpen', {
          tag: 'id-button',
          styleTwo: true,
          afterIf: true,
          afterClass: 'el-icon-caret-bottom',
          title: '全部展开',
        }),
        new IdButtonConfig('tree-close', '', 'treeClose', {
          tag: 'id-button',
          styleTwo: true,
          afterIf: true,
          afterClass: 'el-icon-caret-top',
          title: '全部收起',
        }),
        new IdButtonConfig('tree-add', '', 'treeAdd', {
          tag: 'id-button',
          styleTwo: true,
          afterIf: true,
          title: '新增',
          afterClass: 'el-icon-plus',
        }),
        new IdButtonConfig('tree-delete', '', 'treeDelete', {
          tag: 'id-button',
          styleTwo: true,
          afterIf: true,
          afterClass: 'el-icon-minus',
          title: '删除',
        }),
        new IdButtonConfig('tree-search', '', 'treeSearch', {
          tag: 'id-button',
          styleTwo: true,
          afterIf: true,
          afterClass: 'el-icon-search',
          title: '搜索',
        }),
      ], //树形操作栏配置
      highlightCurrent: true, //选中是否高亮行
      treeData: [], //树形目录数据
      containerInfosData: {}, //树形目录当前选中数据
      //新tree参数。。。。
      orgId: this.$store.state.user.userInfo.orgId,
      table: {
        loading: false,
        cloudbox: {
          selectedRow: '',
          column: [],
          raw: [],
          show: [],
          current: 1,
          total: 0,
          checked: [],
          confirmed: [],
        },
        plc: {
          selectedRow: '',
          column: [],
          raw: [],
          show: [],
          current: 1,
          total: 0,
          checked: [],
          confirmed: [],
        },
        cnc: {
          selectedRow: '',
          column: [],
          raw: [],
          show: [],
          current: 1,
          total: 0,
          checked: [],
          confirmed: [],
        },
        box8303: {
          selectedRow: '',
          column: [],
          raw: [],
          show: [],
          current: 1,
          total: 0,
          checked: [],
          confirmed: [],
        },
      },
      file: {
        file: {},
      },
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  watch: {
    'containerInfosData.ctrType': {
      async handler(n) {
        this.tableDialog.ifHasPLCTab = false;
        this.tableDialog.ifHasCNCTab = false;
        this.tableDialog.ifHasCloudboxTab = false;
        this.tableDialog.ifHasBox8303Tab = false;
        this.tableDialog.noParentInfoPoint = false;

        this.tableDialog.tabSelected = 'cloudbox';
        this.tableDialog.currentPage = 1;
        switch (n) {
          case 1:
            this.formColumn = this.formColumnOrigin;
            this.tableDialog.title = '工厂关联信息点';
            this.formColumn[3].title = '关联信息点';
            this.tableDialog.ifHasCloudboxTab = true;
            this.tableDialog.ifHasPLCTab = true;
            this.tableDialog.ifHasBox8303Tab = true;
            break;
          case 2:
            this.formColumn = this.formColumnOrigin;

            this.tableDialog.title = '车间关联信息点';
            this.formColumn[3].title = '关联信息点';
            this.tableDialog.ifHasCloudboxTab = true;
            this.tableDialog.ifHasPLCTab = true;
            this.tableDialog.ifHasBox8303Tab = true;
            break;
          case 3:
            this.formColumn = this.formColumn3;

            this.tableDialog.title = '设备关联信息点';
            this.formColumn[3].title = '关联信息点';
            this.tableDialog.ifHasCloudboxTab = true;
            this.tableDialog.ifHasPLCTab = true;
            this.tableDialog.ifHasCNCTab = true;
            this.tableDialog.ifHasBox8303Tab = true;
            break;
          case 4:
            this.formColumn = this.formColumn4;

            this.tableDialog.title = '信息点关联数据点';
            this.formColumn[3].title = '关联数据点';
            break;
          default:
            this.tableDialog.title = '关联数据点';
            this.formColumn[3].title = '关联信息点';
            break;
        }
      },
      immediate: true,
    },
    // 更换tab时，清除表格数据和表头，重置页数为1
    'tableDialog.tabSelected': {
      async handler(n) {
        if (!this.tableDialog.doNotOpenCb) {
          this.tableDialog.tableSelection = [];
          this.tableDialog.tableData = [];
          this.tableDialog.currentPage = 1;
        }

        switch (this.tableDialog.tabSelected) {
          case 'cloudbox':
            this.cloudboxShowCheck();
            break;
          case 'plc':
            this.plcShowCheck();
            break;
          case 'cnc':
            this.cncShowCheck();
            break;
          case 'box8303':
            this.box8303ShowCheck();
            break;
          default:
            break;
        }
      },
      immediate: false,
    },

    containerInfosData: {
      async handler(n) {
        // this.tableDialog.currentPage = 1;
        if (n.id !== undefined) {
          this.table.cloudbox.checked = [];
          this.table.plc.checked = [];
          this.table.cnc.checked = [];
          this.table.box8303.checked = [];
          this.changePictureDialog.rawFile = {};
          await this.getDetail(this.containerInfosData);
          await this.getCheckedItems();
        }
      },
    },
  },
  methods: {
    handleCloudBoxCurrentChange(val) {
      if (val) {
        if (val.isUse === 0) {
          this.table.cloudbox.selectedRow = val;
        } else {
          this.$refs.cloudboxTable.setCurrentRow(
            this.table.cloudbox.selectedRow
          );
          this.$message({
            message: '当前点已被占用',
            type: 'warning',
          });
        }
      }
    },
    handleBox8303CurrentChange(val) {
      if (val) {
        if (val.isUse === 0) {
          this.table.box8303.selectedRow = val;
        } else {
          this.$refs.box8303Table.setCurrentRow(this.table.box8303.selectedRow);
          this.$message({
            message: '当前点已被占用',
            type: 'warning',
          });
        }
      }
    },
    handleCncCurrentChange(val) {
      if (val) {
        if (val.isUse === 0) {
          this.table.cnc.selectedRow = val;
        } else {
          this.$refs.cncTable.setCurrentRow(this.table.cnc.selectedRow);
          this.$message({
            message: '当前点已被占用',
            type: 'warning',
          });
        }
      }
    },
    handlePlcCurrentChange(val) {
      if (val) {
        if (val.isUse === 0) {
          this.table.plc.selectedRow = val;
        } else {
          this.$refs.plcTable.setCurrentRow(this.table.plc.selectedRow);
          this.$message({
            message: '当前点已被占用',
            type: 'warning',
          });
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.isUse === 1) {
        return 'disabled-row';
      }
      return '';
    },

    //弹窗相关
    confirm(row, tag) {
      if (tag === 'dia') {
        this.addContainerDialog.addContainerForm.formValidate.deviceId = row.id;
        this.addContainerDialog.addContainerForm.formValidate.deviceName =
          row.name;
        this.addContainerDialog.addContainerForm.formValidate.deviceNumber =
          row.number;
      } else {
        this.formValidate.deviceId = row.id;
        this.formValidate.deviceName = row.name;
        this.formValidate.deviceNumber = row.number;
      }
    },
    beforeGetTableList(params) {
      params.unBind = true;
    },
    //-----------------------------------------------------------------
    checkCtrNumberValidate(rule, Value, callback) {
      const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
      if (!Value) callback(new Error('容器代码不得为空'));
      if (reg.test(Value)) callback(new Error('容器代码不得含有中文字符'));
      callback();
    },
    handleClickRefresh() {
      this.findGroupListFunc();
      this.getDetail(this.containerInfosData);
      this.getCheckedItems();
    },
    // 查询勾选项目
    async getCheckedItems() {
      this.table.cloudbox.checked = [];
      this.table.plc.checked = [];
      this.table.cnc.checked = [];
      this.table.box8303.checked = [];
      this.cloudboxCheckedList = [];
      this.plcCheckedList = [];
      this.cncCheckedList = [];
      this.box8303CheckedList = [];
      this.cloudboxPointCheckedList = [];
      this.plcPointCheckedList = [];
      this.cncPointCheckedList = [];
      this.box8303PointCheckedList = [];
      this.tableDialog.infoPointArr = [];
      const param = { orgId: this.orgId, id: this.containerInfosData.id };
      let res = await this.getCheckedInfoPoint(param);
      if (res.data.code === 200) {
        if (res.data.data.length === undefined || res.data.data.length === 0) {
          res.data.data = [];
          if (
            this.table.box8303.selectedRow.collectId &&
            this.table.box8303.selectedRow.pointId
          ) {
            this.table.box8303.selectedRow.collectId = '';
            this.table.box8303.selectedRow.pointId = 'null';
          }
        }
        res.data.data.forEach((i) => {
          if (i.devicePointType === null) {
            switch (i.deviceType) {
              case 1:
                this.cloudboxCheckedList.push(i);
                break;
              case 3:
                this.plcCheckedList.push(i);
                break;
              case 5:
                this.cncCheckedList.push(i);
                break;
              case 7:
                this.box8303CheckedList.push(i);
                break;
              default:
                break;
            }
          } else {
            switch (i.deviceType) {
              case 1:
                this.cloudboxPointCheckedList.push(i);
                // this.table.cloudbox.selectedRow = res.data.data[0]
                break;
              case 3:
                this.plcPointCheckedList.push(i);
                this.table.plc.selectedRow = res.data.data[0];
                this.table.plc.selectedRow.id =
                  this.table.plc.selectedRow.pointId;
                this.table.plc.selectedRow.plcId =
                  this.table.plc.selectedRow.collectId;
                break;
              case 5:
                this.cncPointCheckedList.push(i);
                this.table.cnc.selectedRow = res.data.data[0];
                this.table.cnc.selectedRow.id =
                  this.table.cnc.selectedRow.pointId;
                this.table.cnc.selectedRow.cncId =
                  this.table.cnc.selectedRow.collectId;
                break;
              case 7:
                this.box8303PointCheckedList.push(i);
                this.table.box8303.selectedRow = res.data.data[0];
                break;
              default:
                break;
            }
          }
        });
      }
      try {
        this.initCncTableCheck();
        this.initCloudboxTableCheck();
        this.initBox8303TableCheck();
        this.initPlcTableCheck();
      } catch (e) {
        console.log(e);
      }
    },
    // 添加容器,dialog
    addContainerDialogOpenCb() {},
    addContainerDialogCloseCb() {
      this.addContainerDialogCancel();
    },
    addContainerDialogCancel() {
      this.addContainerDialog.v = false;
      this.addContainerDialog.addContainerForm.formValidate = {
        ctrNumber: '',
        ctrName: '',
        ctrType: '',
        deviceNumber: '',
        deviceName: '',
      };
      this.$refs.addContainerForm.resetFields();
    },
    addContainerDialogConfirm() {
      this.$refs.addContainerForm.validate(async (valid) => {
        if (valid) {
          let param = {
            orgId: this.orgId,
            ctrParent: this.containerInfosData.id,
            ...this.addContainerDialog.addContainerForm.formValidate,
          };
          if (this.containerInfosData.ctrType === '4') {
            param.ctrParent = this.containerInfosData.ctrParent;
          }
          await saveContainer(param)
            .then(async (res) => {
              if (res.data.code === 200) {
                this.$notify({
                  title: '添加成功',
                  type: 'success',
                });
                // await this.findGroupListFunc();
              } else {
                this.$notify({
                  title: '添加失败',
                  message: res.data.msg,
                  type: 'error',
                });
              }
            })

            .catch((e) => {
              this.$notify.error({
                title: '失败',
                message: e,
              });
            })
            .finally(() => {
              this.addContainerDialog.v = false;
            });
        }
      });
    },
    cloudboxTableChangePage(val) {
      this.table.cloudbox.show = this.table.cloudbox.raw.slice(
        (val - 1) * 8,
        (val - 1) * 8 + 8
      );
      switch (this.tableDialog.tabSelected) {
        case 'cloudbox':
          this.cloudboxShowCheck();
          break;
        case 'plc':
          this.plcShowCheck();
          break;
        case 'cnc':
          this.cncShowCheck();
          break;
        case 'box8303':
          this.box8303ShowCheck();
          break;
        default:
          break;
      }
    },
    box8303TableChangePage(val) {
      this.table.box8303.show = this.table.box8303.raw.slice(
        (val - 1) * 8,
        (val - 1) * 8 + 8
      );
      switch (this.tableDialog.tabSelected) {
        case 'cloudbox':
          this.cloudboxShowCheck();
          break;
        case 'plc':
          this.plcShowCheck();
          break;
        case 'cnc':
          this.cncShowCheck();
          break;
        case 'box8303':
          this.box8303ShowCheck();
          break;
        default:
          break;
      }
    },
    plcTableChangePage(val) {
      this.table.plc.show = this.table.plc.raw.slice(
        (val - 1) * 8,
        (val - 1) * 8 + 8
      );
      switch (this.tableDialog.tabSelected) {
        case 'cloudbox':
          this.cloudboxShowCheck();
          break;
        case 'plc':
          this.plcShowCheck();
          break;
        case 'cnc':
          this.cncShowCheck();
          break;
        case 'box8303':
          this.box8303ShowCheck();
          break;
        default:
          break;
      }
    },
    cncTableChangePage(val) {
      this.table.cnc.show = this.table.cnc.raw.slice(
        (val - 1) * 8,
        (val - 1) * 8 + 8
      );
      switch (this.tableDialog.tabSelected) {
        case 'cloudbox':
          this.cloudboxShowCheck();
          break;
        case 'plc':
          this.plcShowCheck();
          break;
        case 'cnc':
          this.cncShowCheck();
          break;
        case 'box8303':
          this.box8303ShowCheck();
          break;
        default:
          break;
      }
    },
    // 关联数据点 信息点 table dialog
    async tableDialogOpenCb() {
      // alert('44');
      // 获取动态tab
      if (
        this.containerInfosData.ctrType === 4 &&
        this.tableDialog.dialogInfoPointInit === false
      ) {
        this.tableDialog.dialogInfoPointInit = true;
        let ret = await this.getTabs({
          ctrParent: this.containerInfosData.ctrParent,
          orgId: this.orgId,
        });
        if (ret.data.data.length === 0 || ret.data.data.length === undefined) {
          this.tableDialog.noParentInfoPoint = true;
          return;
        } else {
          this.tableDialog.doNotOpenCb = true;
          ret.data.data.reverse().forEach((i) => {
            switch (i) {
              case 1:
                this.tableDialog.ifHasCloudboxTab = true;
                this.tableDialog.tabSelected = 'cloudbox';
                break;
              case 3:
                this.tableDialog.ifHasPLCTab = true;
                this.tableDialog.tabSelected = 'plc';
                break;
              case 5:
                this.tableDialog.ifHasCNCTab = true;
                this.tableDialog.tabSelected = 'cnc';
                break;
              case 7:
                this.tableDialog.ifHasBox8303Tab = true;
                this.tableDialog.tabSelected = 'box8303';
                break;
              default:
                break;
            }
          });
        }
        this.tableDialog.doNotOpenCb = false;
      }
      switch (this.tableDialog.tabSelected) {
        case 'cloudbox':
          this.cloudboxShowCheck();
          break;
        case 'plc':
          this.plcShowCheck();
          break;
        case 'cnc':
          this.cncShowCheck();
          break;
        case 'box8303':
          this.box8303ShowCheck();
          break;
        default:
          break;
      }
      switch (this.tableDialog.tabSelected) {
        case 'cloudbox':
          this.cloudboxShowCheck();
          break;
        case 'plc':
          this.plcShowCheck();
          break;
        case 'cnc':
          this.cncShowCheck();
          break;
        case 'box8303':
          this.box8303ShowCheck();
          break;
        default:
          break;
      }
    },
    tableDialogCloseCb() {
      this.tableDialogCancel();
    },
    tableDialogCancel() {
      this.table.cloudbox.current = 1;
      this.table.box8303.current = 1;
      this.table.plc.current = 1;
      this.table.cnc.current = 1;
      this.tableDialog.currentPage = 1;
      this.tableDialog.tableSelection = [];
      this.tableDialog.dialogInfoPointInit = false;

      this.tableDialog.v = false;
    },
    async tableDialogConfirm() {
      await this.saveSelection();
      await this.saveContainer();
      this.tableDialog.v = false;
    },
    saveSelection() {
      const plcChecked = this.unique(this.table.plc.checked);
      const cncChecked = this.unique(this.table.cnc.checked);
      const cloudboxChecked = this.unique(this.table.cloudbox.checked);
      const box8303Checked = this.unique(this.table.box8303.checked);
      let cloudboxPv = [];
      let box8303Pv = [];
      let plcPv = [];
      let cncPv = [];
      let cloudboxPointPv = [];
      let box8303PointPv = [];
      let plcPointPv = [];
      let cncPointPv = [];
      this.cloudboxCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          cloudboxPv.push(i);
        }
      });
      this.plcCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          plcPv.push(i);
        }
      });
      this.cncCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          cncPv.push(i);
        }
      });
      this.box8303CheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          box8303Pv.push(i);
        }
      });

      this.cloudboxPointCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          cloudboxPointPv.push(i);
        }
      });
      this.plcPointCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          plcPointPv.push(i);
        }
      });
      this.cncPointCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          cncPointPv.push(i);
        }
      });
      this.box8303PointCheckedList.forEach((i) => {
        if (i.prevChecked === true) {
          box8303PointPv.push(i);
        }
      });

      this.cloudboxCheckedList = [];
      this.plcCheckedList = [];
      this.cncCheckedList = [];
      this.box8303CheckedList = [];

      this.cloudboxPointCheckedList = [];
      this.plcPointCheckedList = [];
      this.cncPointCheckedList = [];
      this.box8303PointCheckedList = [];

      cloudboxPv.forEach((i) => {
        this.cloudboxCheckedList.push(i);
      });
      plcPv.forEach((i) => {
        this.plcCheckedList.push(i);
      });
      cncPv.forEach((i) => {
        this.cncCheckedList.push(i);
      });
      box8303Pv.forEach((i) => {
        this.box8303CheckedList.push(i);
      });

      cloudboxPointPv.forEach((i) => {
        this.cloudboxPointCheckedList.push(i);
      });
      plcPointPv.forEach((i) => {
        this.plcPointCheckedList.push(i);
      });
      cncPointPv.forEach((i) => {
        this.cncPointCheckedList.push(i);
      });
      box8303PointPv.forEach((i) => {
        this.box8303PointCheckedList.push(i);
      });

      if (this.containerInfosData.ctrType < 4) {
        plcChecked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.plcCheckedList.push({
              uid: i.id,
              collectId: i.id,
              number: i.number,
            });
          }
        });
      } else {
        plcChecked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.plcPointCheckedList.push({
              pointId: i.id,
              uid: i.id,
              collectId: i.plcId,
              number: i.number,
            });
          }
        });
      }
      if (this.containerInfosData.ctrType < 4) {
        cncChecked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.cncCheckedList.push({
              uid: i.id,
              collectId: i.id,
              number: i.number,
            });
          }
        });
      } else {
        cncChecked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.cncPointCheckedList.push({
              uid: i.id,
              pointId: i.id,
              collectId: i.cncId,
              number: i.number,
            });
          }
        });
      }

      if (this.containerInfosData.ctrType < 4) {
        cloudboxChecked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.cloudboxCheckedList.push({
              collectId: i.id,
              uid: i.id,
              number: i.cinfoName,
            });
          }
        });
      } else {
        cloudboxChecked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.cloudboxPointCheckedList.push({
              pointId: i.id,
              uid: i.id,
              collectId: i.cinfoId,
              number: i.cinfoName,
              name: i.attrName,
            });
          }
        });
      }

      if (this.containerInfosData.ctrType < 4) {
        box8303Checked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.box8303CheckedList.push({
              collectId: i.id,
              uid: i.id,
              number: i.cinfoName,
            });
          }
        });
      } else {
        box8303Checked.forEach((i) => {
          if (i.prevChecked === false || i.prevChecked === undefined) {
            this.box8303PointCheckedList.push({
              pointId: i.id,
              uid: i.id,
              collectId: i.cinfoId,
              number: i.cinfoName,
              name: i.attrName,
            });
          }
        });
      }

      this.cloudboxCheckedList = this.unique(this.cloudboxCheckedList);
      this.box8303CheckedList = this.unique(this.box8303CheckedList);
      this.plcCheckedList = this.unique(this.plcCheckedList);
      this.cncCheckedList = this.unique(this.cncCheckedList);

      this.cloudboxPointCheckedList = this.unique(
        this.cloudboxPointCheckedList
      );
      this.box8303PointCheckedList = this.unique(this.box8303PointCheckedList);
      this.plcPointCheckedList = this.unique(this.plcPointCheckedList);
      this.cncPointCheckedList = this.unique(this.cncPointCheckedList);

      let infoPointArr = [];
      this.plcCheckedList.forEach((i) => {
        infoPointArr.push(i.number);
      });
      this.cncCheckedList.forEach((i) => {
        infoPointArr.push(i.number);
      });
      this.cloudboxCheckedList.forEach((i) => {
        infoPointArr.push(i.number);
      });
      this.box8303CheckedList.forEach((i) => {
        infoPointArr.push(i.number);
      });

      this.cloudboxPointCheckedList.forEach((i) => {
        infoPointArr.push(i.name);
      });
      this.box8303PointCheckedList.forEach((i) => {
        infoPointArr.push(i.name);
      });
      this.plcPointCheckedList.forEach((i) => {
        infoPointArr.push(i.name);
      });
      this.cncPointCheckedList.forEach((i) => {
        infoPointArr.push(i.name);
      });
      this.formValidate.infoPointStr = infoPointArr.join(',');
    },

    handleFormTableDbClick() {},
    handleTableInFormSearch() {},
    async handleTableInFormChangePage(page) {
      this.tableDialog.tableData = [];
      this.tableDialog.currentPage = page;
    },

    plcCancelAll() {
      this.$refs.plcTable.clearSelection();
    },
    cloudboxCancelAll() {
      this.$refs.cloudboxTable.clearSelection();
    },
    box8303CancelAll() {
      this.$refs.box8303Table.clearSelection();
    },
    cncCancelAll() {
      this.$refs.cncTable.clearSelection();
    },

    cloudboxTableSelectCb(selection, row) {
      if (this.table.cloudbox.checked.length === 0) {
        this.table.cloudbox.checked.push(row);
      } else {
        this.table.cloudbox.checked.forEach((i, index) => {
          if (i.id === row.id) {
            this.table.cloudbox.checked.splice(index, 1);
            return;
          } else {
            this.table.cloudbox.checked.push(row);
          }
        });
      }
    },
    box8303TableSelectCb(selection, row) {
      if (this.table.box8303.checked.length === 0) {
        this.table.box8303.checked.push(row);
      } else {
        this.table.box8303.checked.forEach((i, index) => {
          if (i.id === row.id) {
            this.table.box8303.checked.splice(index, 1);
            return;
          } else {
            this.table.box8303.checked.push(row);
          }
        });
      }
    },

    plcTableSelectCb(selection, row) {
      if (this.table.plc.checked.length === 0) {
        this.table.plc.checked.push(row);
      } else {
        this.table.plc.checked.forEach((i, index) => {
          if (i.id === row.id) {
            this.table.plc.checked.splice(index, 1);
            return;
          } else {
            this.table.plc.checked.push(row);
          }
        });
      }
    },
    cncTableSelectCb(selection, row) {
      if (this.table.cnc.checked.length === 0) {
        this.table.cnc.checked.push(row);
      } else {
        this.table.cnc.checked.forEach((i, index) => {
          if (i.id === row.id) {
            this.table.cnc.checked.splice(index, 1);
            return;
          } else {
            this.table.cnc.checked.push(row);
          }
        });
      }
    },

    tableSelectCb(selection, row) {
      if (row !== undefined) {
        // 第一次选择，总是push进入
        if (this.tableDialog.tableSelection.length === 0) {
          this.tableDialog.tableSelection.push(row);
        } else {
          // 如果数组中存在元素，则判定是否和选择元素相同，如果相同则去除，如果不相同，则push
          this.tableDialog.tableSelection.forEach((i, index) => {
            if (i.id === row.id) {
              this.tableDialog.tableSelection.splice(index, 1);
              return;
            } else {
              this.tableDialog.tableSelection.push(row);
            }
          });
        }
        if (this.tableDialog.onlyCanChooseOne) {
          this.tableDialog.tableData.map((i) => {
            if (i.id === this.tableDialog.tableSelection[0].id) {
              i.tableSelected = true;
            }
          });
          // 如果选择数组长度大于1 则禁掉除本身以外的所有选项
          this.tableDialog.notAbleToSelect =
            this.tableDialog.tableSelection.length >= 1;
        } else {
          // 如果可以关联多个
          this.tableDialog.tableData.map((i) => {
            this.tableDialog.tableSelection.forEach((k) => {
              if (i.id === k.id) {
                i.tableSelected = true;
              }
            });
          });
        }
      }
    },

    initCncTableCheck() {
      this.table.cnc.raw.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.cncCheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              k.number = item.number;
              k.name = item.name;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.cnc.checked.push(item);
            } else {
              // k.number = item.number;
              // k.name = item.name;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.cncPointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              k.number = item.number;
              k.name = item.name;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.cnc.checked.push(item);
            } else {
              // k.number = item.number;
              // k.name = item.name;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        }
      });
    },
    initPlcTableCheck() {
      if (this.containerInfosData.ctrType < 4) {
        this.plcCheckedList.forEach((k) => {
          this.table.plc.raw.forEach((item) => {
            if (k.collectId === item.id) {
              k.prevChecked = true;
              k.number = item.number;
              k.name = item.name;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.plc.checked.push(item);
            } else {
              // k.number = item.number;
              // k.name = item.name;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        });
      }

      if (this.containerInfosData.ctrType === 4) {
        this.plcPointCheckedList.forEach((k) => {
          this.table.plc.raw.forEach((item) => {
            if (k.pointId === item.id) {
              k.number = item.number;
              k.name = item.name;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.plc.checked.push(item);
            } else {
              // k.number = item.number;
              // k.name = item.name;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        });
      }
    },
    initCloudboxTableCheck() {
      this.table.cloudbox.raw.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.cloudboxCheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              k.number = item.cinfoName;
              k.name = item.attrName;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.cloudbox.checked.push(item);
            } else {
              // k.number = item.cinfoName;
              // k.name = item.attrName;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.cloudboxPointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              k.number = item.cinfoName;
              k.name = item.attrName;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.cloudbox.checked.push(item);
            } else {
              // k.number = item.cinfoName;
              // k.name = item.attrName;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        }
      });
    },
    initBox8303TableCheck() {
      this.table.box8303.raw.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.box8303CheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              k.number = item.cinfoName;
              k.name = item.attrName;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.box8303.checked.push(item);
            } else {
              // k.number = item.cinfoName;
              // k.name = item.attrName;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.box8303PointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              k.number = item.cinfoName;
              k.name = item.attrName;
              // k.id = item.id;
              item.prevChecked = true;
              k.prevChecked = true;
              this.table.box8303.checked.push(item);
            } else {
              // k.number = item.cinfoName;
              // k.name = item.attrName;
              // k.id = item.id;
              // // item.prevChecked = false;
              // // k.prevChecked = false;
            }
          });
        }
      });
    },

    cloudboxShowCheck() {
      this.$nextTick(() => {
        this.$refs.cloudboxTable.clearSelection();
      });
      this.table.cloudbox.show.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.cloudboxCheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              this.$nextTick(() => {
                this.$refs.cloudboxTable.toggleRowSelection(item);
              });
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.cloudboxPointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              item.isUse = 0;
              this.$nextTick(() => {
                this.$refs.cloudboxTable.toggleRowSelection(item);
              });
            }
          });
        }
      });
    },
    box8303ShowCheck() {
      this.$nextTick(() => {
        this.$refs.box8303Table.clearSelection();
      });
      this.table.box8303.show.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.box8303CheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              this.$nextTick(() => {
                this.$refs.box8303Table.toggleRowSelection(item);
              });
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.box8303PointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              item.isUse = 0;
              this.$nextTick(() => {
                this.$refs.box8303Table.toggleRowSelection(item);
              });
            }
          });
        }
      });
    },
    plcShowCheck() {
      this.$nextTick(() => {
        this.$refs.plcTable.clearSelection();
      });
      this.table.plc.show.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.plcCheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              item.isUse = 0;
              this.$nextTick(() => {
                this.$refs.plcTable.toggleRowSelection(item);
                this.$refs.plcTable.setCurrentRow(item);
                this.table.plc.selectedRow = item;
              });
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.plcPointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              item.isUse = 0;
              this.$nextTick(() => {
                this.$refs.plcTable.toggleRowSelection(item);
                this.$refs.plcTable.setCurrentRow(item);
                this.table.plc.selectedRow = item;
              });
            }
          });
        }
      });
    },
    cncShowCheck() {
      this.$nextTick(() => {
        this.$refs.cncTable.clearSelection();
      });
      this.table.cnc.show.forEach((item) => {
        if (this.containerInfosData.ctrType < 4) {
          this.cncCheckedList.forEach((k) => {
            if (k.collectId === item.id) {
              item.isUse = 0;
              this.$nextTick(() => {
                this.$refs.cncTable.toggleRowSelection(item);
                this.$refs.cncTable.setCurrentRow(item);
                this.table.cnc.selectedRow = item;
              });
            }
          });
        } else if (this.containerInfosData.ctrType === 4) {
          this.cncPointCheckedList.forEach((k) => {
            if (k.pointId === item.id) {
              item.isUse = 0;
              this.$nextTick(() => {
                this.$refs.cncTable.toggleRowSelection(item);
                this.$refs.cncTable.setCurrentRow(item);
                this.table.cnc.selectedRow = item;
              });
            }
          });
        }
      });
    },
    initTableCheck() {
      this.$nextTick(() => {
        this.$refs.plcTable.clearSelection();
      });
      this.tableDialog.tableData.forEach((item, index) => {
        if (this.containerInfosData.ctrType < 4) {
          switch (this.tableDialog.tabSelected) {
            case 'cloudbox':
              this.cloudboxCheckedList.forEach((k) => {
                if (k.collectId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            case 'box8303':
              this.box8303CheckedList.forEach((k) => {
                if (k.collectId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            case 'plc':
              this.plcCheckedList.forEach((k) => {
                if (k.collectId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            case 'cnc':
              this.cncCheckedList.forEach((k) => {
                if (k.collectId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            default:
              break;
          }
        } else if (this.containerInfosData.ctrType === 4) {
          switch (this.tableDialog.tabSelected) {
            case 'cloudbox':
              this.cloudboxPointCheckedList.forEach((k) => {
                if (k.pointId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            case 'box8303':
              this.box8303PointCheckedList.forEach((k) => {
                if (k.pointId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            case 'plc':
              this.plcPointCheckedList.forEach((k) => {
                if (k.pointId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            case 'cnc':
              this.cncPointCheckedList.forEach((k) => {
                if (k.pointId === item.id) {
                  item.isUse = 0;
                  this.$nextTick(
                    this.$refs.dialogTable.toggleRowSelection(item)
                  );
                }
              });
              break;
            default:
              break;
          }
        }
      });
    },

    checkboxCheck(row, index) {
      if (this.tableDialog.notAbleToSelect) return row.tableSelected === true;
      return row.isUse === 0;
    },
    async postPic() {
      try {
        let res = await Promise.resolve(
          uploadPic(this.changePictureDialog.rawFile, 'picture')
        );
        if (res.data.code === 200) {
          this.formValidate.ctrImg = `${config.baseUrl.fdfsAddress}/${res.data.data.address}`;
          await this.saveContainer();
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.changePictureDialog.v = false;
      }
    },
    getChangePicFile(f) {},
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      //如果图片小于0.5m则上传原图，否则压缩到400k
      const isLt05M = file.size / 1024 / 1024 < 0.5;
      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        return false;
      } else {
        return new Promise((resolve) => {
          if (isLt05M) {
            this.changePictureDialog.picFile = URL.createObjectURL(file);
            this.changePictureDialog.rawFile = file;
          } else {
            imageConversion.compressAccurately(file, 400).then((res) => {
              const files = new window.File([res], 'compressed', {
                type: res.type,
              });
              this.changePictureDialog.picFile = URL.createObjectURL(files);
              this.changePictureDialog.rawFile = files;
            });
          }
        }).catch((e) => {
          console.log(e);
        });
      }
    },
    picMouseOver(n) {
      this.$refs.hintDiv[0].style.height = '40px';
    },
    picMouseOut(n) {
      this.$refs.hintDiv[0].style.height = '0';
    },
    clearNE() {
      //清除原有经纬度信息
      this.formValidate.ctrLng = '';
      this.formValidate.ctrLat = '';
    },
    querySearch(str, callback) {
      this.clearNE();
      const url = 'https://restapi.amap.com/v3/assistant/inputtips';
      const key = '593a113247c4ba8949221df3acbdc499';
      const addressInfo = str;
      const city = this.formValidate.ctrCity;

      this.$http
        .get(`${url}?key=${key}&keywords=${addressInfo}&city=${city}`)
        .then((res) => {
          let returnArray = res.data.tips.map((item) => {
            item.key = item.name;
            item.value = item.name;
            item.fullAddress = item.district + item.address;
            item.wholeLink = item.address + ' (' + item.name + ')';
            return item;
          });
          callback(returnArray);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getAnswer(item) {
      let locationArr = item.location.split(',');
      this.formValidate.ctrLng = locationArr[0];
      this.formValidate.ctrLat = locationArr[1];
    },

    getGeoXY() {
      const url = 'https://restapi.amap.com/v3/geocode/geo';
      const key = '593a113247c4ba8949221df3acbdc499';
      this.$http
        .get(`${url}?key=${key}&address=${this.fullAddress}`)
        .then((res) => {
          let locationArr = res.data.geocodes[0].location.split(',');
          this.formValidate.ctrLng = locationArr[0];
          this.formValidate.ctrLat = locationArr[1];
        });
    },
    cascaderChange(n) {},
    clearFormValidate() {
      this.formValidate = {
        createTime: '',
        ctrAddress: '',
        ctrCity: '',
        // ctrImg: "",
        ctrLat: '',
        ctrLng: '',
        ctrName: '',
        ctrNumber: '',
        ctrParent: '',
        ctrPrefecture: '',
        ctrProvince: '',
        ctrRelation: '',
        ctrSwitch: '',
        ctrType: '',
        // ctrVideo: "",
        id: '',
        isDelete: '',
        mark: '',
        orgId: '',
        pointContainerList: '',
        pointNameList: [],
        updateTime: '',
        provinceCityDistrict: [],
        deviation: '',
        deviationUnit: 0,
        //新增字段
        deviceId: 0,
        deviceNumber: '',
        deviceName: '',
      };
    },
    init() {
      this.findGroupListFunc();
    },
    addNodeFunc() {
      this.addContainerDialog.v = true;
    },
    delNodeFunc() {
      if (this.containerInfosData.id) {
        this.$confirm('确定删除该节点吗吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async (res) => {
          const param = { orgId: this.orgId, id: this.containerInfosData.id };
          await delContainer(param)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message.success('删除成功');
                this.findGroupListFunc();
              }
            })
            .catch((e) => {
              this.$notifyError('失败', e);
            });
        });
      }
    },
    saveContainer() {
      // debugger
      this.$refs.theForm.validate(async (valid) => {
        if (valid) {
          let param = {
            orgId: this.orgId,
            ...this.formValidate,
            pointContainerList: [],
          };
          if (this.formValidate.deviationUnit === 1) {
            param.deviation = param.deviation + '%';
          }
          if (this.containerInfosData.ctrType === 4) {
            if (this.table.cloudbox.selectedRow.id) {
              param.pointContainerList = [
                {
                  deviceType: 1,
                  pointId: this.table.cloudbox.selectedRow.id,
                  devicePointType: 2,
                  collectId: this.table.cloudbox.selectedRow.box8302Id,
                },
              ];
            }else if (this.table.plc.selectedRow.id) {
              param.pointContainerList = [
                {
                  deviceType: 3,
                  pointId: this.table.plc.selectedRow.id,
                  devicePointType: 4,
                  collectId: this.table.plc.selectedRow.plcId,
                },
              ];
            }else if (this.table.cnc.selectedRow.id) {
              param.pointContainerList = [
                {
                  deviceType: 5,
                  pointId: this.table.cnc.selectedRow.id,
                  devicePointType: 6,
                  collectId: this.table.cnc.selectedRow.cncId,
                },
              ];
            }else if (
              this.table.box8303.selectedRow.pointId &&
              this.table.box8303.selectedRow.collectId
            ) {
              param.pointContainerList = [
                {
                  deviceType: 7,
                  pointId: this.table.box8303.selectedRow.pointId,
                  devicePointType: 8,
                  collectId: this.table.box8303.selectedRow.collectId,
                },
              ];
            } else if (this.table.box8303.selectedRow.pointId == 'null') {
              param.pointContainerList = [];
            } else {
              param.pointContainerList = [
                {
                  deviceType: 7,
                  pointId: this.table.box8303.selectedRow.id,
                  devicePointType: 8,
                  collectId: this.table.box8303.selectedRow.box8303Id,
                },
              ];
            }
          } else {
            if (this.table.cloudbox.selectedRow.id) {
              param.pointContainerList = [
                {
                  deviceType: 1,
                  collectId: this.table.cloudbox.selectedRow.id,
                },
              ];
            }
            if (this.table.box8303.selectedRow.id) {
              param.pointContainerList = [
                {
                  deviceType: 7,
                  collectId: this.table.box8303.selectedRow.id,
                },
              ];
            }
            this.table.plc.checked.forEach((i) => {
              param.pointContainerList.push({
                deviceType: 3,
                collectId: i.id,
              });
            });
            if (this.table.cnc.selectedRow.id) {
              param.pointContainerList = [
                {
                  deviceType: 5,
                  collectId: this.table.cnc.selectedRow.id,
                },
              ];
            }
          }

          await saveContainer(param)
            .then(async (res) => {
              this.$notify({
                title: res.data.msg,
                type: res.data.code === 200 ? 'success' : 'warning',
              });

              await this.getDetail(this.containerInfosData);
              await this.getCheckedItems();
              // await this.findGroupListFunc();
              this.table.cloudbox.current = 1;
              this.table.box8303.current = 1;
              this.table.plc.current = 1;
              this.table.cnc.current = 1;
            })
            .catch((e) => {
              // this.$notify.error({
              //   title: "失败",
              //   message: e
              // });
            });
        }
      });
    },
    /* 获取分组树形列表 */
    async findGroupListFunc() {
      await findContainerList({ orgId: this.$store.state.user.userInfo.orgId })
        .then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            // //根据层级来限定
            res.data.data.map((i) => {
              i.name = i.ctrName;
            });
            // 生成树形图结构数据
            let data = {
              rawdata: res.data.data,
              children: [],
              parent: [],
              expand: true,
            };
            // data.children
            data.children = this.$utils.toTreeChildrenFunc(res.data.data, 'id');
            // data.parent
            data.parent = this.$utils.toTreeParentFunc(
              res.data.data,
              'ctrParent'
            );
            this.treeData = this.$utils.toTreeDataFunc(data);
          } else {
            this.$notifyError('获取失败', res.data.msg);
          }
        })
        .catch((e) => {
          this.$notifyError('失败', e);
        })
        .finally(() => {
          if (this.treeData.length > 0) {
            this.$nextTick(() => {
              if (document.querySelector('.el-tree-node__content') !== null)
                document.querySelector('.el-tree-node__content').click();
            });
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
        this.tableDialog.cncTableSelectionConfirmedSetted = [];
        this.tableDialog.cloudboxTableSelectionConfirmedSetted = [];
        this.tableDialog.box8303TableSelectionConfirmedSetted = [];
        this.tableDialog.plcTableSelectionConfirmedSetted = [];
      }
    },
    async getDetail(d) {
      this.controlTooltipShow = false;
      let res = await Promise.resolve(
        getContainerDetail({ id: parseInt(d.id), orgId: this.orgId })
      );
      this.controlTooltipShow = true;
      res.data.data.deviationUnit = 0;
      if (res.data.data.deviation) {
        const deviationArr = res.data.data.deviation.split('%');
        res.data.data.deviation = deviationArr[0];
        deviationArr[1] === undefined
          ? (res.data.data.deviationUnit = 0)
          : (res.data.data.deviationUnit = 1);
      }
      this.formValidate = {
        ...res.data.data,
      };
      if (res.data.data.pointNameList !== null) {
        this.formValidate.infoPointStr = res.data.data.pointNameList.join(', ');
      }
      if (this.containerInfosData.ctrType !== 4) {
        // this.formColumn[6].url = res.data.data.ctrImg;
        // this.formColumn[6].srcList[0] = res.data.data.ctrImg;
      }

      this.formValidate.provinceCityDistrict = [
        res.data.data.ctrProvince,
        res.data.data.ctrCity,
        res.data.data.ctrPrefecture,
      ];
      if (this.containerInfosData.ctrType === 4) {
        this.table.cloudbox.column = [
          {
            title: '数据点代码',
            key: 'number',
            type: 'text',
          },
          {
            title: '数据点名称',
            key: 'name',
            type: 'text',
          },
          {
            title: '所属信息',
            key: 'box8302Name',
            type: 'text',
          },
        ];
        this.table.plc.column = [
          {
            title: '数据点代码',
            key: 'number',
            type: 'text',
          },
          {
            title: '数据点名称',
            key: 'name',
            type: 'text',
          },
          {
            title: '所属信息',
            key: 'plcName',
            type: 'text',
          },
        ];
        this.table.cnc.column = [
          {
            title: '数据点代码',
            key: 'number',
            type: 'text',
          },
          {
            title: '数据点名称',
            key: 'name',
            type: 'text',
          },
          {
            title: '所属信息',
            key: 'cncName',
            type: 'text',
          },
        ];
        this.table.box8303.column = [
          {
            title: '数据点代码',
            key: 'number',
            type: 'text',
          },
          {
            title: '数据点名称',
            key: 'name',
            type: 'text',
          },
          {
            title: '所属信息',
            key: 'box8302Name',
            type: 'text',
          },
        ];
      } else {
        // 获取表头
        this.table.cloudbox.column = [
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
        ].filter((i) => {
          return i.type !== 'datetime' && i.title !== '云盒状态';
        });
        this.table.plc.column = [
          {
            title: 'PLC代码',
            key: 'number',
            width: '250',
            type: 'text',
          },
          {
            title: 'PLC品牌',
            key: 'plcBrandName',
            width: '250',
            type: 'text',
          },
          {
            title: 'PLC型号',
            key: 'plcModel',
            width: '250',
            type: 'text',
          },
          {
            title: 'IP',
            key: 'ip',
            width: '250',
            type: 'text',
          },
          {
            title: '连接通道',
            key: 'connectionCompleteName',
            width: '250',
            type: 'text',
          },
          {
            title: '备注信息',
            key: 'mark',
            width: '250',
            type: 'text',
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: '250',
            type: 'datetime',
          },
          {
            title: '修改时间',
            key: 'updateTime',
            width: '250',
            type: 'datetime',
          },
        ].filter((i) => {
          return i.type !== 'datetime' && i.key !== 'mark';
        });
        this.table.cnc.column = [
          {
            title: '机床代码',
            key: 'number',
            width: '250',
            type: 'text',
          },
          {
            title: '机床型号',
            key: 'machineModel',
            width: '250',
            type: 'text',
          },
          {
            title: '数控系统品牌',
            key: 'cncBrandName',
            width: '250',
            type: 'text',
          },
          {
            title: '数控系统型号',
            key: 'cncModel',
            width: '250',
            type: 'text',
          },
          {
            title: 'IP地址',
            key: 'ip',
            width: '150',
            type: 'text',
          },
          {
            title: '端口号',
            key: 'port',
            width: '100',
            type: 'text',
          },
          {
            title: '连接通道',
            key: 'connectionCompleteName',
            width: '250',
            type: 'text',
          },
          {
            title: '数据表名称',
            key: 'databaseTableName',
            width: '250',
            type: 'text',
          },
          {
            title: '备注信息',
            key: 'mark',
            width: '250',
            type: 'text',
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: '250',
            type: 'datetime',
          },
          {
            title: '修改时间',
            key: 'updateTime',
            width: '250',
            type: 'datetime',
          },
        ].filter((i) => {
          return i.type !== 'datetime' && i.key !== 'mark';
        });
        this.table.box8303.column = [
          {
            title: '云盒代码',
            key: 'number',
            width: '250',
            type: 'text',
          },
          {
            title: '云盒型号',
            key: 'box8303BrandName',
            width: '250',
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
        ].filter((i) => {
          return i.type !== 'datetime' && i.title !== '云盒状态';
        });
      }

      // 获取 cloudbox plc cnc box8303 表格数据 ctrType !==4
      if (this.containerInfosData.ctrType !== 4) {
        const param = {
          orgId: this.orgId,
        };
        let cloudboxRes = await this.getCloudboxList(param);
        let plcRes = await this.getPlcList(param);
        let cncRes = await this.getCncList(param);
        let box8303Res = await this.getBox8303List(param);
        this.table.cloudbox.raw = cloudboxRes.data.data;
        this.table.plc.raw = plcRes.data.data;
        this.table.cnc.raw = cncRes.data.data;
        this.table.box8303.raw = box8303Res.data.data;

        this.table.cloudbox.show = this.table.cloudbox.raw
          ? this.table.cloudbox.raw.slice(0, 8)
          : [];
        this.table.plc.show = this.table.plc.raw
          ? this.table.plc.raw.slice(0, 8)
          : [];
        this.table.cnc.show = this.table.cnc.raw
          ? this.table.cnc.raw.slice(0, 8)
          : [];
        this.table.box8303.show = this.table.box8303.raw
          ? this.table.box8303.raw.slice(0, 8)
          : [];

        this.table.cloudbox.total = cloudboxRes.data.data
          ? cloudboxRes.data.data.length
          : 0;
        this.table.plc.total = plcRes.data.data ? plcRes.data.data.length : 0;
        this.table.cnc.total = cncRes.data.data ? cncRes.data.data.length : 0;
        this.table.box8303.total = box8303Res.data.data
          ? box8303Res.data.data.length
          : 0;
      } else if (this.containerInfosData.ctrType === 4) {
        let cloudboxRes = await this.getType4List({
          orgId: this.orgId,
          ctrParent: this.containerInfosData.ctrParent,
          deviceType: 1,
        });
        let plcRes = await this.getType4List({
          orgId: this.orgId,
          ctrParent: this.containerInfosData.ctrParent,
          deviceType: 3,
        });
        let cncRes = await this.getType4List({
          orgId: this.orgId,
          ctrParent: this.containerInfosData.ctrParent,
          deviceType: 5,
        });
        let box8303Res = await this.getType4List({
          orgId: this.orgId,
          ctrParent: this.containerInfosData.ctrParent,
          deviceType: 7,
        });

        this.table.cloudbox.raw = cloudboxRes.data.data;
        this.table.plc.raw = plcRes.data.data;
        this.table.cnc.raw = cncRes.data.data;
        this.table.box8303.raw = box8303Res.data.data;

        if (this.table.cloudbox.raw === null) this.table.cloudbox.raw = [];
        if (this.table.plc.raw === null) this.table.plc.raw = [];
        if (this.table.cnc.raw === null) this.table.cnc.raw = [];
        if (this.table.box8303.raw === null) this.table.box8303.raw = [];

        this.table.cloudbox.show = this.table.cloudbox.raw.slice(0, 8);
        this.table.plc.show = this.table.plc.raw.slice(0, 8);
        this.table.cnc.show = this.table.cnc.raw.slice(0, 8);
        this.table.box8303.show = this.table.box8303.raw.slice(0, 8);

        this.table.cloudbox.total = this.table.cloudbox.raw.length;
        this.table.plc.total = this.table.plc.raw.length;
        this.table.cnc.total = this.table.cnc.raw.length;
        this.table.box8303.total = this.table.box8303.raw.length;
      }
    },
  },
};
</script>



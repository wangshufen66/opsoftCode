<!--注意：启用《后台分页》功能下，无需担心后台有没有回调分页总数，因为【分页组件】只需要有<数据总数total>和<当前页最多显示行数pageSize>
就会自动计算所需分页-->
<template>
  <!--表格-->
  <div id="table-el-container" class="table-el-container">
    <!--用于执行下载文件功能的标签-->
    <a id="a_id" href="#" />
    <!--表格对话框-->
    <table-modal
      ref="tableModal"
      :show="tableModalConfig.tableModalShow"
      :inner-show="tableModalConfig.tableModelInnerShow"
      :is-show-search="tableModalConfig.tableModalShowSearch"
      :title="tableModalConfig.tableModelTitle"
      :inner-title="tableModalConfig.tableModelInnerTitle"
      :inner-message="tableModalConfig.tableModelInnerMessage"
      :table-uni-key="tableUniKey"
      :cancel-label="tableModalConfig.tableModalCancelLabel"
      :confirm-label="tableModalConfig.tableModalConfirmLabel"
      :modal-show="tableModalConfig.tableModelModalShow"
      @deleteRow="handleTableModalDeleteRow"
      @innerConfirm="handleTableModalInnerConfirm"
      @innerCancel="handleTableModalInnerCancel"
      @confirm="handleTableModalConfirm"
      @cancel="handleTableModalCancel"
    />

    <!--字段列隐藏/显示复选对话框-->
    <el-dialog title="字段设置（显示/隐藏）" :visible.sync="dialogTableColumnsVisible" width="605px">
      <!--<el-checkbox-->
      <!--:indeterminate="dialogTableColumnsIsIndeterminate"-->
      <!--v-model="dialogTableColumnsCheckAll"-->
      <!--@change="handleDialogTableColumnsCheckAllChange"-->
      <!--&gt;全选-->
      <!--</el-checkbox>-->
      <!--<div style="margin: 15px 0;"></div>-->
      <!--<el-checkbox-group-->
      <!--v-model="dialogTableColumnsCheckedVal"-->
      <!--@change="handleDialogTableColumnsCheckedChange"-->
      <!--&gt;-->
      <!--<div style="display: flex;flex-direction: row;flex-wrap: wrap;">-->
      <!--<el-checkbox-->
      <!--style="width: 200px;font-size: 1.2rem;"-->
      <!--v-for="col in dialogTableColumnsMember"-->
      <!--:label="col"-->
      <!--:key="col"-->
      <!--&gt;-->
      <!--<span style="font-size: 1rem;">{{col}}</span>-->
      <!--</el-checkbox>-->
      <!--</div>-->
      <!--</el-checkbox-group>-->
      <Table
        ref="fieldTable"
        :height="tableHeight"
        :columns="fieldColumns"
        border
        draggable
        :data="dialogTableColumnsMember"
        @on-drag-drop="handleDialogTableColumnsDragDrop"
        @on-selection-change="handleDialogTableColumnsSelectChange"
      >
        <template slot-scope="{ row, column ,index }" slot="width">
          <InputNumber
            v-model="row.width"
            :min="0"
            :max="99999"
            :step="1"
            @on-change="bodyOnBlur(row,column,index)"
          />
        </template>
      </Table>
      <div slot="footer" class="dialog-footer">
        <el-button type="error" @click="handleDialogTableColumnsCancel">取消</el-button>
        <!--应用整个系统-->
        <el-button
          type="primary"
          :disabled="fieldSelection.length===0"
          @click="handleDialogTableColumnsSystemConfirm"
          style="margin-left: 1rem"
        >应用</el-button>
        <!--<el-button-->
          <!--v-if="false"-->
          <!--type="warning"-->
          <!--@click="handleDialogTableColumnsUserConfirm"-->
          <!--style="margin-left: 1rem"-->
        <!--&gt;仅应用当前用户</el-button>-->
      </div>
    </el-dialog>

    <div class="table-header-wrapper">
      <!--功能按钮 操作栏-->
      <div class="table-header-left-wrapper">
        <div class="option-button-container">
          <!--<el-button class="option-button" type="primary" size="small" @click="handleSubmitNewData">-->
          <!--提交-添加-->
          <!--</el-button>-->
          <!--<el-button class="option-button" type="primary" size="small" @click="handleSubmitEditData">-->
          <!--提交-修改-->
          <!--</el-button>-->
          <!--<el-button class="option-button" type="primary" size="small" @click="handleSubmitDeleteData">-->
          <!--提交-移除-->
          <!--</el-button>-->
          <el-upload
            v-if="hasUploadButton"
            ref="uploadList"
            :show-file-list="false"
            accept="application/pdf"
            multiple
            :limit="1"
            action="string"
            :http-request="uploadSectionFile"
            :on-success="handleDefaultBackgroundAvatarSuccess"
            :before-upload="beforeDefaultBackgroundAvatarUpload"
          >
            <!--@click="treeAddOne" :data="actionParams" :action="uploadDocUrl" -->
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
          <el-button
            v-if="hasAddButton"
            :disabled="disabledAddButton"
            type="primary"
            size="small"
            @click="handleGoAddForm"
          >{{addText}}</el-button>
          <el-dropdown v-if="hasAddBatchButton">
            <el-button v-if="hasAddBatchButton" size="small"  type="primary">
              添加
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="drop-down-style" @click="handleAddOne">添加</div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div @click="handleAddBatch" class="drop-down-style">批量添加</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--前台移除-->
          <Poptip
            v-if="hasRemoveRowsButton"
            :confirm="false"
            :transfer="true"
            placement="top"
            :disabled="!deleteRowsPopVisible"
          >
            <span slot="title">提示</span>
            <span slot="content">
              请至少勾选
              <i class="el-icon-success" style="color:#409eff"></i>一行数据
            </span>
            <el-button
              class="option-button"
              type="primary"
              size="small"
              @click="handleDeleteRows"
            >移除</el-button>
          </Poptip>
          <!--直接提交数据到后台进行删除-->
          <Poptip
            v-if="hasDeleteRowsButton"
            :confirm="false"
            :transfer="true"
            placement="top"
            :disabled="!deleteRowsPopVisible"
          >
            <span slot="title">提示</span>
            <span slot="content">
              请至少勾选
              <i class="el-icon-success" style="color:#409eff"></i>一行数据
            </span>
            <el-button
              class="option-button"
              type="primary"
              size="small"
              @click="handleSubmitToDeleteRows"
            >删除</el-button>
          </Poptip>
          <!--<el-button class="option-button" type="primary" size="small" @click="handleDeleteRows">-->
          <!--移除-->
          <!--</el-button>-->
          <!--class="option-excel-export"-->
          <!--Excel导出（导出当前勾选的数据）-->
          <Poptip
            v-if="hasExcelExportButton"
            :confirm="false"
            :transfer="true"
            placement="top"
            :disabled="!excelExportRowsPopVisible"
          >
            <span slot="title">提示</span>
            <span slot="content">
              请至少勾选
              <i class="el-icon-success" style="color:#409eff"></i>一行数据
            </span>
            <el-button
              class="option-button"
              type="primary"
              size="small"
              @click="handleExcelExport"
            >Excel导出</el-button>
          </Poptip>
          <!--方式1：通过 原始 input 标签 实现的 excel 导入并转换成json数据-->
          <!--可行性：第二次导入文件时，@change 事件不再执行了；解决方案是——在外部父组件中，每次导入文件操作全部完成后，通过 v-if 和 定时器 结合，快速重新渲染画面才能解决此问题-->
          <!--此访问所遇问题的具体解决方案，请查看此目录下的 README.md 文件-->
          <!--<a class="option-excel-import" href="javascript:;">-->
          <!--<span>Excel导入</span>-->
          <!--<input ref="excelFileInput" type="file" :value="excelImportFile" id="excelImport" accept=".xls" @change="handleExcelImport"/>-->
          <!--</a>-->


          <!--提交 下拉菜单-->
          <el-dropdown
            v-if="hasSubmitDropdownMenu"
            placement="bottom"
            @command="handleDropdownSubmit"
          >
            <el-button style="margin-left: 0.2rem;height: 1.99rem;" type="primary" size="small">
              提交
              <i class="el-icon-arrow-down"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="submitAdd">提交-添加</el-dropdown-item>
              <el-dropdown-item command="submitEdit">提交-修改</el-dropdown-item>
              <el-dropdown-item command="submitDelete">提交-移除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <!--&lt;!&ndash;提交 弹出框，模仿菜单样式&ndash;&gt;-->
          <!--<el-popover-->
          <!--placement="bottom-start"-->
          <!--width="0"-->
          <!--trigger="click">-->
          <!--<div style="width: 100%;display: flex;flex-direction: column;justify-content: flex-start;">-->
          <!--&lt;!&ndash;选项按钮&ndash;&gt;-->
          <!--<el-button style="margin-left: 0.66rem;text-align: left;"type="text" size="small" @click="handleSubmitNewData">-->
          <!--提交-添加-->
          <!--</el-button>-->
          <!--<el-button style="margin-bottom: 0.2rem;text-align: left;" type="text" size="small" @click="handleSubmitEditData">-->
          <!--提交-修改-->
          <!--</el-button>-->
          <!--<el-button style="margin-bottom: 0.2rem;text-align: left;" type="text" size="small" @click="handleSubmitDeleteData">-->
          <!--提交-移除-->
          <!--</el-button>-->
          <!--</div>-->

          <!--&lt;!&ndash;提交按钮&ndash;&gt;-->
          <!--<el-button slot="reference" class="option-button" type="primary" size="small">-->
          <!--提交 <i class="el-icon-arrow-down"></i>-->
          <!--</el-button>-->
          <!--</el-popover>-->

          <!--Excel导出（导出当前勾选的数据）-->
          <Poptip
            v-if="hasSeeSelectedRowsButton"
            :confirm="false"
            :transfer="true"
            placement="top"
            :disabled="!seeSelectedRowsPopVisible"
          >
            <span slot="title">提示</span>
            <span slot="content">
              当前没有勾选
              <i class="el-icon-success" style="color:#409eff"></i>行
            </span>
            <el-button
              class="option-button"
              type="primary"
              size="small"
              @click="handleSeeSelectedRows"
            >查阅勾选行</el-button>
          </Poptip>

          <!--Excel导出（导出当前勾选的数据）-->
          <Poptip
            v-if="hasCancelAllSelectedRowsButton"
            :confirm="false"
            :transfer="true"
            placement="top"
            :disabled="!cancelAllSelectedRowsPopVisible"
          >
            <span slot="title">提示</span>
            <span slot="content">
              当前没有勾选
              <i class="el-icon-success" style="color:#409eff"></i>行
            </span>
            <el-button
              class="option-button"
              type="primary"
              size="small"
              @click="handleCancelAllSelectedRows"
            >取消所有勾选</el-button>
          </Poptip>

          <el-button-group v-if="hasHeadEditAccess||hasHeadDelAccess" class="el-btn-group-style">
            <el-button
              v-if="hasHeadEditAccess"
              :disabled="!enableTableHeadEdit"
              @click="handleMultiEditClick"
              size="small"
              class="el-btn-style"
            >{{editText}}</el-button>
            <el-button
              v-if="hasHeadDelAccess"
              :disabled="!enableTableHeadDel"
              @click="handleMultiDelClick"
              size="small"
              class="el-btn-style"
            >删除</el-button>
          </el-button-group>

          <Dropdown
            v-if="!(hasAuditAccess===false&&hasAntiAuditAccess===false)"
            class="option-dropdown"
          >
            <el-button class="option-button" size="small">
              <span>审核</span>
              <i class="ivu-icon ivu-icon-ios-arrow-down"></i>
            </el-button>
            <DropdownMenu slot="list">
              <DropdownItem v-if="hasAuditAccess" class="dropdown-line-wrapper">
                <div style="width: 100%" @click="handleAuditClick" class="dropdown-line">审核</div>
              </DropdownItem>
              <DropdownItem v-if="hasAntiAuditAccess" class="dropdown-line-wrapper">
                <div @click="handleAntiAuditClick" class="dropdown-line">反审核</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <Dropdown
            v-if="!(hasDisableAccess===false&&hasAntiDisableAccess===false)"
            class="option-dropdown"
          >
            <el-button class="option-button" size="small">
              <span>禁用</span>
              <i class="ivu-icon ivu-icon-ios-arrow-down"></i>
            </el-button>
            <DropdownMenu slot="list">
              <DropdownItem v-if="hasDisableAccess" class="dropdown-line-wrapper">
                <div style="width: 100%"  @click="handleTableHeadDisableClick" class="dropdown-line">禁用</div>
              </DropdownItem>
              <DropdownItem v-if="hasAntiDisableAccess" class="dropdown-line-wrapper">
                <div @click="handleTableHeadEnableClick" class="dropdown-line">反禁用</div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          <div v-if="hasShowAllBtn" class="show-all">
            <el-checkbox @change="handleTableHeadShowAll" class="show-all-check"></el-checkbox>
            <span>显示所有</span>
          </div>
          <div
            v-if="hasConfigTableHeadBtn"
            @click="handleTableColumnsSetting"
            class="header-icon-wrapper"
          >
            <i v-if="showTableColumnsSetting" class="el-icon-setting column-setting"></i>
            <span>显示字段设置</span>
          </div>
          <slot name="options"></slot>
          <div
            v-if="hasRefreshButton"
            @click="handleClickRefresh"
            v-loading="tableRefreshLoading"
            style="margin-left: 12px; cursor: pointer;"
            class="header-icon-wrapper"
          >
            <i class="el-icon-refresh-right"></i>
            <span style="margin-left: 4px;">刷新</span>
          </div>
        </div>
      </div>
      <div class="table-header-right-wrapper">
        <!--搜索-->
        <div v-if="hasSearch" class="options-search-container">
          <!--:style="hasServerExcelImportButton?'width: 460px':'width:520px'"-->
          <!-- 搜索输入栏 -->

          <div v-if="hasSearchText" class="option-row">
            <el-popover
              class="have-extra-selection"
              placement="right"
              trigger="manual"
              v-model="haveExtraSelection"
            >
              <span
                v-if="hasSearchTypeSelect || hasSearchDateTimeRange"
                class="opts-span"
                slot="reference"
                @click="handleGetMoreSelectOpts"
                style="width: 200px;line-height: 32px;margin:auto 12px auto 0;cursor: pointer"
              >
                {{extraSelectionText}}
                <i
                  :class="haveExtraSelection?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"
                ></i>
                <!-- style="transform: rotateZ(-90deg);" -->
              </span>
              <div class="more-opts-wrapper">
                <div class="more-opts-first-line">
                  <div>
                    <Select
                      v-model="searchTextContentConfig.value"
                      style="width: 120px;margin-right: 8px"
                      :placeholder="searchTextContentConfig.placeholder"
                    >
                      <Option
                        v-for="(item, index) in searchColumnSelections"
                        :key="index"
                        :value="item.key"
                      >{{ item.title }}</Option>
                    </Select>
                    <Input
                      v-model="tableConfig.search"
                      clearable
                      :placeholder="tableConfig.searchPlaceholder"
                      class="option-input"
                      style="width: 180px;"
                      @on-enter="handleSearchEnter"
                    />
                    <el-button
                      ref="searchButton"
                      type="primary"
                      circle
                      icon="el-icon-search"
                      size="mini"
                      style="width: 28px; margin-left: 8px;margin-top: 2px"
                      @click="handleSearchEnter"
                    ></el-button>
                  </div>
                </div>
                <div v-if="hasSearchTypeSelect">
                  <Select
                    v-model="searchTypeConfig.value"
                    style="width: 120px;margin-right: 8px"
                    :placeholder="searchTypeConfig.placeholder"
                    @on-change="handleSearchTypeSelectChange"
                  >
                    <Option
                      v-for="(item, index) in searchTypeColumnSelections"
                      :key="index"
                      :value="item.key"
                    >{{ item.title }}</Option>
                  </Select>
                  <Select
                    v-model="searchTypeContentConfig.value"
                    style="width: 217px;"
                    clearable
                    @on-change="searchTypeChange"
                    :placeholder="searchTypeContentConfig.placeholder"
                  >
                    <Option
                      v-for="(item, index) in searchTypeContentColumnSelections"
                      :key="index"
                      :value="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </div>
                <div v-if="hasSearchDateTimeRange">
                  <Select
                    v-model="searchDateConfig.value"
                    style="width: 120px;margin-right: 8px"
                    :placeholder="searchDateConfig.placeholder"
                  >
                    <Option
                      v-for="(item, index) in searchDateColumnSelections"
                      :key="index"
                      :value="item.key"
                    >{{ item.title }}</Option>
                  </Select>
                  <DatePicker
                    v-if="searchDateTimeRangeConfig.hasStartDatetime"
                    clearable
                    v-model="searchDateTimeRangeConfig.startDateTime"
                    :type="searchDateTimeRangeConfig.inputType"
                    format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="searchDateTimeRangeConfig.startPlaceholder"
                    style="width:215px"
                  ></DatePicker>
                </div>
                <div v-if="hasSearchDateTimeRange">
                  <span
                    v-if="searchDateTimeRangeConfig.hasStartDatetime && searchDateTimeRangeConfig.hasEndDatetime"
                    style="margin-top: 10px;margin-left: 52px;margin-right: 62px;"
                  >至</span>
                  <DatePicker
                    class="left-data-picker"
                    v-if="searchDateTimeRangeConfig.hasEndDatetime"
                    clearable
                    v-model="searchDateTimeRangeConfig.endDateTime"
                    :type="searchDateTimeRangeConfig.inputType"
                    format="yyyy-MM-dd HH:mm:ss"
                    :placeholder="searchDateTimeRangeConfig.endPlaceholder"
                    style="width:215px"
                  ></DatePicker>
                </div>
              </div>
            </el-popover>
            <Select
              v-if="hasSearchSelect"
              v-model="searchTextContentConfig.value"
              style="width: 120px"
              :placeholder="searchTextContentConfig.placeholder"
            >
              <!--style="width: 8rem"-->
              <Option
                v-for="(item, index) in searchColumnSelections"
                :key="index"
                :value="item.key"
              >{{ item.title }}</Option>
            </Select>
            <Input
              v-if="hasSearchContent"
              v-model="tableConfig.search"
              clearable
              :placeholder="tableConfig.searchPlaceholder"
              class="option-input"
              style="width:180px"
              @on-enter="handleSearchEnter"
            />
            <!--:style="hasServerExcelImportButton?'width: 8rem':'width: 13rem'"-->
            <el-button
              class="search-btn"
              ref="searchButton"
              type="primary"
              circle
              icon="el-icon-search"
              size="mini"
              @click="handleSearchEnter"
            ></el-button>
          </div>

          <!-- <div
          v-if="hasSearchTypeSelect"
          v-show="!searchInitHinden"
          :class="{'option-row':true,'search-show':searchIsDown, 'search-hide':!searchIsDown}"
        >
          <el-switch v-model="searchTypeSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>-->
          <!-- </div> -->

          <!-- <div
          v-if="hasSearchDateTimeRange"
          v-show="!searchInitHinden"
          :class="{'option-row':true,'search-show':searchIsDown, 'search-hide':!searchIsDown}"
          >-->
          <!-- <Select
            v-model="searchDateConfig.value"
            style="width: 6rem;"
            transfer
            :placeholder="searchDateConfig.placeholder"
          >
            <Option
              v-for="(item, index) in searchDateColumnSelections"
              :key="index"
              :value="item.key"
            >{{ item.title }}</Option>
          </Select>
          <DatePicker
            v-if="searchDateTimeRangeConfig.hasStartDatetime"
            :transfer="true"
            :clearable="false"
            :disabled="!searchDateSwitch || searchDateTimeRangeConfig.disabled"
            v-model="searchDateTimeRangeConfig.startDateTime"
            :type="searchDateTimeRangeConfig.inputType"
            :format="searchDateTimeRangeConfig.datetimeFormat"
            :placeholder="searchDateTimeRangeConfig.startPlaceholder"
            :style="{width:searchDateTimeRangeConfig.width}"
          ></DatePicker>
          <span
            v-if="searchDateTimeRangeConfig.hasStartDatetime && searchDateTimeRangeConfig.hasEndDatetime"
            style="margin-top: 8px;margin-left: 8px;margin-right: 8px;"
          >至</span>
          <DatePicker
            v-if="searchDateTimeRangeConfig.hasEndDatetime"
            :transfer="true"
            :clearable="false"
            :disabled="!searchDateSwitch || searchDateTimeRangeConfig.disabled"
            v-model="searchDateTimeRangeConfig.endDateTime"
            :type="searchDateTimeRangeConfig.inputType"
            :format="searchDateTimeRangeConfig.datetimeFormat"
            :placeholder="searchDateTimeRangeConfig.endPlaceholder"
            :style="{width:searchDateTimeRangeConfig.width}"
          ></DatePicker>-->

          <!-- <el-switch v-model="searchDateSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
          <!-- </div> -->

          <!-- <div
          v-if="hasSearchTypeSelect || hasSearchDateTimeRange"
          class="option-row up-down-arrow-container"
          style="margin-left: 14rem;"
          @click="()=>{searchInitHinden=false;searchIsDown=!searchIsDown}"
        >
          <i
            :class="{'el-icon-d-arrow-left':true, 'down-arrow':!searchIsDown, 'up-arrow':searchIsDown}"
          ></i>
          <i
            :class="{'el-icon-d-arrow-left':true, 'down-arrow':!searchIsDown, 'up-arrow':searchIsDown}"
          ></i>
          <i
            :class="{'el-icon-d-arrow-left':true, 'down-arrow':!searchIsDown, 'up-arrow':searchIsDown}"
          ></i>
        </div>
          </div>-->
          <!--  <slot name="searchtool"></slot> -->
        </div>
        <div class="import-export-wrapper">
          <!--后台Excel导入功能-->
          <Dropdown v-if="hasServerExcelImportButton" transfer>
            <el-button class="search-btn" icon="el-icon-upload2" type="primary" size="mini" circle>
              <!--<i class="ivu-icon ivu-icon-ios-download-outline"></i>-->
              <!--&lt;!&ndash;<span>导入</span>&ndash;&gt;-->
              <!--<i class="ivu-icon ivu-icon-ios-arrow-down"></i>-->
            </el-button>
            <DropdownMenu slot="list">
              <div>
                <!--不带子项-->
                <DropdownItem>
                  <!--javascript:void(0)-->
                  <a href="#" @click="handleServerExcelTemplateDownload">下载模板</a>
                </DropdownItem>
                <!--不带子项-->
                <DropdownItem>
                  <el-upload
                    ref="elUploadServerExcelImport"
                    class="upload-demo"
                    accept=".xlsx"
                    :action="serverExcelImportUrl"
                    multiple
                    :http-request="uploadFunc"
                    :show-file-list="false"
                    :file-list="serverExcelImportFileList"
                    :on-progress="handleOnServerExcelImporting"
                    :on-error="handleOnServerExcelImportError"
                    :on-success="handleOnServerExcelImportSuccess"
                  >
                    <a href="#">导入数据</a>
                    <!--<el-button size="small" type="primary">导入</el-button>-->
                    <!--<div slot="tip" class="el-upload__tip">仅支持Excel文件</div>-->
                  </el-upload>
                </DropdownItem>
              </div>
              <div v-for="(item,index) of serverExcelImportConfig" :key="index">
                <!--不带子项-->
                <DropdownItem v-if="!item.hasOwnProperty('childItems')">
                  <!--javascript:void(0)-->
                  <a :href="item.href" @click="item.onItemClick(item)">{{ item.title }}</a>
                </DropdownItem>
                <!--带有子项-->
                <Dropdown v-if="item.hasOwnProperty('childItems')" placement="right-start">
                  <DropdownItem>
                    {{ item.title }}
                    <Icon type="ios-arrow-forward"></Icon>
                  </DropdownItem>
                  <DropdownMenu slot="list">
                    <DropdownItem v-for="(childItem,index) of item.childItems" :key="index">
                      <a
                        :href="item.href"
                        @click="childItem.onItemClick(childItem)"
                      >{{ childItem.title }}</a>
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </DropdownMenu>
          </Dropdown>
          <div v-else style="width: 15px"></div>
        </div>
      </div>
    </div>
    <!--表格-->
    <div class="table-container">
      <!--:border="tableHasBorder"-->
      <Table
        ref="table"
        :width="tableWidth"
        :height="tableHeight"
        :transfer="true"
        border
        :sortable="false"
        :row-class-name="isCustomRowClass?customRowClassName:rowClassName"
        :highlight-row="highlightRow"
        @on-row-click="handleTableRowClick"
        @on-row-dblclick="handleTableRowDbclick"
        @on-select="handleTableSelectRow"
        @on-select-cancel="handleTableSelectRowCancel"
        @on-select-all="handleTableSelectRowAll"
        @on-select-all-cancel="handleTableSelectRowAllCancel"
        @on-selection-change="handleTableSelectRowChange"
        :loading="tableConfig.loading"
        :columns="tableConfig.columns"
        :data="tableConfig.pageData"
        :span-method="handleSpan"
      >
        <template slot-scope="{ row }" slot="action">
          <slot name="extraButton" :row="row"></slot>
          <el-button
            v-if="!row.hasOwnProperty('showRowEdit') || (row.hasOwnProperty('showRowEdit') && row['showRowEdit'])"
            :disabled="!(!row.hasOwnProperty('disabledRowEdit') || (row.hasOwnProperty('disabledRowEdit') && row['disabledRowEdit']))"
            style="margin-left: 8px"
            type="primary"
            size="mini"
            plain
            @click="handleEditRow(row)"
          >{{!row.hasOwnProperty('addButtonName')?editText:row['addButtonName']}}</el-button>
          <!--transfer：是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果-->
          <Poptip
            v-if="tableConfig.showRowDeleteButton"
            confirm
            :transfer="true"
            title="您确定要移除这条数据吗?"
            @on-ok="handleDeleteRow(row)"
          >
            <el-button style="margin-left: 3px" type="danger" size="mini" plain>移除</el-button>
          </Poptip>
          <Poptip
            v-if="!row.hasOwnProperty('showRowDelete') || (row.hasOwnProperty('showRowDelete') && row['showRowDelete'])"
            :disabled="!(!row.hasOwnProperty('disabledRowDelete') || (row.hasOwnProperty('disabledRowDelete') && row['disabledRowDelete']))"
            confirm
            :transfer="true"
            title="您确定要“直接删除”这条数据吗?"
            @on-ok="handleSubmitToDeleteRow(row)"
          >
            <el-button
              :disabled="!(!row.hasOwnProperty('disabledRowDelete') || (row.hasOwnProperty('disabledRowDelete') && row['disabledRowDelete']))"
              style="margin-left: 8px"
              type="danger"
              size="mini"
              plain
            >删除</el-button>
          </Poptip>
          <!--<el-button type="error" size="small" @click="handleDeleteRow(row)">-->
          <!--删除-->
          <!--</el-button>-->
        </template>
      </Table>
    </div>

    <!-- 分页 -->
    <div align="center">
      <Page
        class="common-page-style page-container"
        v-if="hasPageBar"
        :total="serverPage?tableConfig.countTotal:tableConfig.filterData.length"
        :show-total="tableConfig.showTotal"
        :current="tableConfig.curPage"
        transfer
        show-sizer
        :show-elevator="tableConfig.showPageInput"
        align="center"
        :page-size="tableConfig.pageSize"
        :page-size-opts="tableConfig.pageSizeOpts"
        @on-change="changeCurrentPage"
        @on-page-size-change="changPageSize"
      />
    </div>
    <br />
  </div>
</template>

<script>
// import XLSX from 'xlsx'
// import FileSaver from 'file-saver'
import { noRepeatForObjectArray } from "@/utils/index";
import { getFilterArray } from "@/utils/filterUtils";
import TableModal from "../table-modal/index";

export default {
  name: "table-el",
  components: { TableModal },
  props: {
    handleSpan: {
      type: Function,
      default() {
        return () => {};
      },
    },
    hasRefreshButton: {
      type: Boolean,
      default: true,
    },
    //是否有头部编辑按钮权限
    hasHeadEditAccess: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //头部按钮的编辑字体
    editText: {
      type: String,
      default() {
        return "编辑";
      },
    },
    hasHeadDelAccess: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasOriginEditBtn: {
      type: Boolean,
      default() {
        return true;
      },
    },
    tableHeadCol: {
      type: Array,
      default() {
        return [];
      },
    },
    // 表头按钮权限
    // 编辑删除为禁用 审核禁用为去除
    // 是否启用 表头编辑
    enableTableHeadEdit: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否启用 表头删除
    enableTableHeadDel: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否有审核
    hasAuditAccess: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否有反审核
    hasAntiAuditAccess: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否有禁用
    hasDisableAccess: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否有反禁用
    hasAntiDisableAccess: {
      type: Boolean,
      default() {
        return true;
      },
    },

    hasConfigTableHeadBtn: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasShowAllBtn: {
      type: Boolean,
      default() {
        return true;
      },
    },

    tableWidth: {
      type: String,
      default() {
        return "100%";
      },
    },
    tableHeight: {
      type: String,
      default() {
        return "610";
      },
    },
    tableHasBorder: {
      type: Boolean,
      default() {
        return true;
      },
    },
    isCustomRowClass: {
      type: Boolean,
      default() {
        return false;
      },
    },
    customRowClassName: {
      type: Function,
      default() {
        return () => {};
      },
    },
    showTableColumnsSetting: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasSearch: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasSearchText: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasSearchContent: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasSearchSelect: {
      type: Boolean,
      default() {
        return true;
      },
    },
    hasSearchTypeSelect: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // searchTypeConfig: {
    //   type: Object,
    //   default() {
    //     return {
    //       value: '',
    //       placeholder: '',
    //       selections: [
    //         // {
    //         //   key: '',
    //         //   title: ''
    //         // }
    //       ]
    //     }
    //   }
    // },
    hasSearchDateTimeRange: {
      type: Boolean,
      default() {
        return false;
      },
    },
    searchDateTimeRangeConfig: {
      type: Object,
      default() {
        return {
          inputType: "datetime",
          hasStartDatetime: true,
          hasEndDatetime: true,
          startDateTime: "",
          endDateTime: "",
          width: "0",
          datetimeFormat: "MM-dd HH:mm",
          disabled: false,
          label: "时间范围", // VueI18n 多语言库中的key值
          startPlaceholder: '请输入', // VueI18n 多语言库中的key值
          endPlaceholder: '请输入', // VueI18n 多语言库中的key值
        };
      },
    },
    // 表格标记：可以为此组件设置唯一标识，可以满足一些特殊需求，比如每个页签下存放一个表格，通过此标记识别不同页签下的表格
    tableTag: {
      type: String,
      default() {
        return "";
      },
    },
    // 作为表格数据唯一识别的字段名（即 属性 key）
    tableUniKey: {
      type: String,
      default() {
        return "id";
      },
    },
    // 从 vuex 中获取记录数据的 一级 属性Key
    vuexFirstKey: {
      type: String,
      default() {
        return "";
      },
    },
    // 从 vuex 中获记录数据的 二级 属性Key
    vuexSecondKey: {
      type: String,
      default() {
        return "";
      },
    },
    // 是否单选
    highlightRow: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否含有 勾选 列
    hasSelectColumn: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否含有 操作 列
    hasActionColumn: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //是否显示 上传 按钮
    hasUploadButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否显示 添加 按钮
    hasAddButton: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 是否禁用 添加 按钮
    disabledAddButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //是否修改 添加 按钮的文字
    addText: {
      type: String,
      default() {
        return "添加";
      },
    },
    //是否有批量添加的按钮
    hasAddBatchButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否显示 <前台多行移除> 按钮
    hasRemoveRowsButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否显示 <后台多行删除>（直接将勾选行提交到后台进行删除操作） 按钮
    hasDeleteRowsButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否显示 <Excel导出> 按钮
    hasExcelExportButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否显示<后台Excel导入>
    hasServerExcelImportButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // <后台Excel导入>的文件上传地址
    serverExcelImportUrl: {
      type: String,
      default() {
        // 此地址是element-ui官方API的案例服务器地址
        return "https://jsonplaceholder.typicode.com/posts/";
      },
    },
    // <后台Excel导入>配置参数
    serverExcelImportConfig: {
      type: Array,
      default() {
        return [
          // {
          //   key: '00',
          //   title: '菜单名称1',
          //   href: '#',
          //   onItemClick:(item)=>{console.log(JSON.stringify(item))}
          // },
          // {
          //   key: '02',
          //   title: '菜单名称2',
          //   href: '#',
          //   childItems: [{
          //     key: '10',
          //     title: '1月',
          //     onItemClick:(item)=>{console.log(JSON.stringify(item))},
          //   }]
          // },
        ];
      },
    },
    // 是否显示 <提交下拉菜单> 按钮
    hasSubmitDropdownMenu: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 查阅勾选行 按钮
    hasSeeSelectedRowsButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 取消所有勾选记录 按钮
    hasCancelAllSelectedRowsButton: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 开关：新增行 或 编辑行的高亮功能
    lightNewOrEditRowEnable: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否开启双击行跳转编辑功能
    dbclickRowEdit: {
      type: Boolean,
      default() {
        return true;
      },
    },
    // 分页方式：false = 前端分页，true=后台分页（需要自己绑定分页函数，自己实现分页功能）
    serverPage: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // 是否开启半后台分页模式
    halfServerPage: {
      type: Boolean,
      default() {
        return false;
      },
    },
    // TODO: 《半后台分页模式》 暂时不开发，较为复杂，后续再研究
    // todo: halfServerPage=true 《半后台分页模式下》：一次性请求的页数
    onceRequestPages: {
      type: Number,
      default() {
        return 2;
      },
    },
    // 记录所有的数据的列字段，包括不用显示的列字段（有些字段无需显示，但需要与后台进行交互）
    // 目前 type 只需要分为 string（字符串）、number（数值）两种类型即可
    columnsStd: {
      type: Array,
      default() {
        // [
        //   {
        //     key: 'id', // 字段属性名
        //     type: 'string' // 字段属性对应的数值类型
        //   },
        //   {
        //     key: 'name',
        //     type: 'string'
        //   },
        //   {
        //     key: 'age',
        //     type: 'number'
        //   },
        // ],
        return [];
      },
    },
    actionColumnWidth: {
      type: Number,
      default() {
        return 152;
      },
    },
    // 注意：这里的 tableConfig.columns 和 tableConfig.data 两个属性值，夫组件中请不要直接通过 =等号 直接赋值，
    // 请调用这里的 drawTableData(columns, tableData) 进行绘制表格，因为这里涉及到操作栏的功能设置，
    // 调用方式请查看 drawTableData(columns, tableData) 函数
    tableConfig: {
      type: Object,
      default() {
        return {
          loading: false,
          tableName: "", // 表格名称，在导出成Excel时，会使用该名称作为文件名
          columns: [
            // {
            //   title: '姓名',
            //   key: 'name'
            // },
            // {
            //   title: '年龄',
            //   key: 'age'
            // },
            // {
            //   title: '地址',
            //   key: 'address'
            // },
            // {
            //   title: "操作",
            //   key: "action",
            //   slot: "action",
            //   width: 220,
            //   align: "center"
            // }
          ],
          pageData: [], // 根据当前页最大行数进行分页计算所得的 当前页显示数据
          filterData: [], // 根据当前搜索内容进行过滤的表格数据
          // 表格的原始数据
          data: [
            // {
            //   name: '王小明1',
            //   age: 18,
            //   address: '北京市朝阳区芍药居'
            // }
          ],
          curPage: 1,
          pageSize: 8, // 每页最多显示行数`
          pageSizeOpts: [2, 4, 6, 8],
          countTotal: 0, // 数据总数，《后台分页功能》下会使用此变量显示总数
          search: "", // 输入的搜索名称
          searchPlaceholder: "请输入", // 搜索输入栏的提示
          // 单选搜索下拉框的选项集合的参考（组件内部会依据此外部组件传递来的参数进行筛选出合理的选择项）：
          // 1、如果设为空，则默认使用收集当前所有的列属性作为搜索下拉框的选项集合，即 支持对表格的所有列进行搜索
          // 2、如果设置列字段对象数组，则将根据此变量作为搜索下拉框的选项集合（前提是columns中存在的里属性对象，这里会对此变量进行匹配验证）
          selectSearchColumnSelections: [],
          // 单选搜索下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
          selectSearchColumn: "",
          // 单选下拉框的未选择任何内容时的提示内容
          selectSearchColumnPlaceholder: "请选择",
          showTotal: true, // 是否显示 总数
          showPageInput: true, // 是否显示页码跳转输入框
          showRowDeleteButton: false, // 是否显示《行移除》按钮
        };
      },
    },
    hasPageBar: {
      type: Boolean,
      default() {
        return true;
      },
    },
  },
  // beforeDestroy() {
  //   this.haveExtraSelection = false;
  // },
  activated() {},
  deactivated() {
    this.haveExtraSelection = false;
  },
  data() {
    return {
      //alter cdh add 20200714
      fieldColumns: [
        {
          type: "index",
          width: 40,
          align: "center",
        },
        {
          type: "selection",
          width: 40,
          align: "center",
        },
        {
          title: "字段代码",
          key: "key",
          width: 180,
          tooltip: true,
        },
        {
          title: "字段名称",
          key: "title",
          width: 180,
          tooltip: true,
        },
        {
          title: "宽度",
          slot: "width",
          width: 120,
          tooltip: true,
        },
      ], //字段设置
      fieldSelection: [], //已经选中的行

      // // 时间筛选功能修复
      // pickerOptions: {
      //   disabledDate(date) {
      //     return date && date.valueOf() > Date.now() + 86400000;
      //   },
      // },

      extraSelectionText: "更多筛选条件",
      hasOriginRow: true,
      haveExtraSelection: false,
      timerComm: "",
      searchInitHinden: true,
      searchIsDown: false,
      // ======start========表格对话框==============================================
      tableModalConfig: {
        tableModalShow: false,
        tableModalShowSearch: false,
        tableModelTitle: "查阅",
        tableModelInnerShow: false,
        tableModelInnerTitle: "提交",
        tableModelInnerMessage: "确定要提交数据吗？", // 表格对话框的内层对话框显示信息内容
        tableModalCancelLabel: "取消",
        tableModalConfirmLabel: "确定",
        tableModelModalShow: true,
      },
      // ======end========表格对话框==============================================
      // 对话框的操作指令类型，用于弹出对话框让用户确认操作信息后，点击对话框中的确定按钮后，可以根据操作指令类型进行判定当前的对应操作
      // 对话框操作指令类型：当作枚举使用
      modalOptionTypes: {
        deleteRows: "deleteRows",
        submitNewRows: "submitNewRows", // 将暂存前台的 添加数据 提交到后台进行删除
        submitEditRows: "submitEditRows", // 将暂存前台的 编辑数据 提交到后台进行删除
        submitDeleteRows: "submitDeleteRows", // 将暂存前台的 移除数据 提交到后台进行删除
        submitToDeleteRows: "submitToDeleteRows", // 直接将勾选的多行数据提交到后台进行删除，此模式不会在前台暂存数据
        excelExportSelectedRows: "excelExportSelectedRows", // Excel 导出当前勾选的数据
        seeSelectedRowsOption: "seeSelectedRowsOption", // 查阅当前所有勾选行的操作
        customOption: "customOption", // 自定义操作
      },
      // 当前对话框的操作指令类型，用于弹出对话框让用户确认操作信息后，点击对话框中的确定按钮后，可以根据操作指令类型进行判定当前的对应操作
      //  对比值 就是上面的 modalOptionTypes 对象中的属性值
      curModalOptionType: "",
      // 当前导入的 Excel 文件记录
      excelImportFile: "",
      // halfServerPage=true 《半后台分页模式下》：每次请求的数据，会按页码追加存储到此变量中
      // 案例：{page_1:[], page_2:[],...}
      serverPageData: {},
      // 修改的但是没有提交到后台的数据，会单独保存到此属性中
      editData: [],
      // 删除但是没有提交到后台的数据，会单独追加保存在此属性中
      deleteData: [],
      // 添加但是没有提交到后台的数据，会单独追加保存在此属性中
      newAddData: [],
      // Excel 导入的数据 会单独在此属性中保存一份
      // 也会追加合并到 tableConfig.data 中
      excelImportData: [],
      // 顶部操作栏 <移除>操作按钮的提示对话框 显示/隐藏
      deleteRowsPopVisible: false,
      // 顶部操作栏 <Excel导出 所有勾选行>操作按钮的提示对话框 显示/隐藏
      excelExportRowsPopVisible: false,
      // 顶部操作栏 <查阅勾选行>操作按钮的提示对话框 显示/隐藏
      seeSelectedRowsPopVisible: false,
      // 顶部操作栏 <取消所有勾选行>操作按钮的提示对话框 显示/隐藏
      cancelAllSelectedRowsPopVisible: false,
      // 列搜索下拉框选项集合
      searchColumnSelections: [],
      // 类型搜索栏，对应表格列的内容下拉选项
      searchTypeContentColumnSelections: [],
      // 类型搜索栏，对应表格列的选项下拉框集合
      searchTypeColumnSelections: [],
      // 日期搜索，对应表格列的下拉框集合
      searchDateColumnSelections: [],
      serverExcelImportFileList: [
        // {
        //   name: 'food.xlsx',
        //   url: ''
        // }
      ],
      searchTextContentConfig: {
        value: "",
        placeholder: "",
      },
      searchTypeContentConfig: {
        value: "",
        placeholder: "",
        // selections: [
        //   // {
        //   //   value: '',
        //   //   label: ''
        //   // }
        // ]
      },
      // 控制类型搜索栏是否启用的开关值
      searchTypeSwitch: false,
      searchTypeConfig: {
        value: "",
        placeholder: "",
        selections: [
          // {
          //   key: '',
          //   title: ''
          // }
        ],
      },
      // 控制日期搜索栏是否启用的开关值
      searchDateSwitch: false,
      searchDateConfig: {
        value: "",
        placeholder: "",
        selections: [
          // {
          //   key: '',
          //   title: ''
          // }
        ],
      },
      // 表格字段列的显示控制复选对话框
      // dialogTableColumnsIsIndeterminate: true,
      dialogTableColumnsVisible: false,
      // dialogTableColumnsCheckAll: false,
      // dialogTableColumnsCheckedVal: [],
      dialogTableColumnsMember: [],
      tableRefreshLoading: false,
    };
  },
  methods: {
    // 点击刷新的事件
    handleClickRefresh() {
      // this.$event.$on(
      //   "tableRefreshEv",
      //   (val) => (
      //     (this.tableRefreshLoading = val)
      //   )
      // );
      this.$emit(
        "requestTablePageData",
        this.tableTag,
        this.tableConfig.curPage,
        this.tableConfig.pageSize,
        null,
        true
      );
    },
    //上传PDF文件
    uploadSectionFile(data) {
      this.$emit("uploadSectionFile", data);
    },
    //成功后刷新
    handleDefaultBackgroundAvatarSuccess(res, file) {
      this.$emit("handleDefaultBackgroundAvatarSuccess", res, file);
    },
    //文件校验
    beforeDefaultBackgroundAvatarUpload(file) {
      this.$emit("beforeDefaultBackgroundAvatarUpload", file);
    },
    // --- 表头按钮事件
    // 表头添加一个
    handleAddOne() {
      this.$emit("handleAddOne");
    },
    // 表头批量添加
    handleAddBatch() {
      this.$emit("handleAddBatch");
    },

    // 表头点击编辑
    handleMultiEditClick() {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        if (
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ].length > 1
        ) {
          this.$message({
            message: "所选超过1个，不可编辑",
            type: "warning",
          });
        } else if (
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ].length === 0
        ) {
          this.$message({
            message: "请选择一条数据",
            type: "warning",
          });
        } else {
          this.$emit(
            "handleTableHeadEdit",
            this.$store.state[this.vuexFirstKey].tableSelectedRows[
              this.vuexSecondKey
            ]
          );
        }
      } else {
        this.$emit("handleTableHeadEdit");
      }
    },
    // 表头删除
    handleMultiDelClick() {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        if (
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ].length === 0
        ) {
          this.$message({
            message: "请选择一条数据",
            type: "warning",
          });
        } else {
          this.$emit(
            "handleTableHeadDel",
            this.$store.state[this.vuexFirstKey].tableSelectedRows[
              this.vuexSecondKey
            ]
          );
        }
      } else {
        this.$emit("handleTableHeadDel");
      }
    },
    // 表头审核
    handleAuditClick() {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        if (
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ].length > 0
        ) {
          this.$emit(
            "handleTableHeadAudit",
            this.$store.state[this.vuexFirstKey].tableSelectedRows[
              this.vuexSecondKey
            ]
          );
        } else {
          this.$message({
            message: "请选择你要审核的数据",
            type: "warning",
          });
        }
      } else {
        this.$emit("handleTableHeadAudit");
      }
    },

    // 表头反审核
    handleAntiAuditClick() {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        if (
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ].length > 0
        ) {
          this.$emit(
            "handleTableHeadAntiAudit",
            this.$store.state[this.vuexFirstKey].tableSelectedRows[
              this.vuexSecondKey
            ]
          );
        } else {
          this.$message({
            message: "请选择你要反审核的数据",
            type: "warning",
          });
        }
      } else {
        this.$emit("handleTableHeadAntiAudit");
      }
    },
    // 表头禁用
    handleTableHeadDisableClick() {
      if (
        this.$store.state[this.vuexFirstKey].tableSelectedRows[
          this.vuexSecondKey
        ].length > 0
      ) {
        this.$emit(
          "handleTableHeadDisable",
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ]
        );
      } else {
        this.$message({
          message: "请选择你要禁用的数据",
          type: "warning",
        });
      }
    },
    // 表头反禁用
    handleTableHeadEnableClick() {
      if (
        this.$store.state[this.vuexFirstKey].tableSelectedRows[
          this.vuexSecondKey
        ].length > 0
      ) {
        this.$emit(
          "handleTableHeadEnable",
          this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ]
        );
      } else {
        this.$message({
          message: "请选择你要反禁用的数据",
          type: "warning",
        });
      }
    },
    // 表头显示所有
    handleTableHeadShowAll(value) {
      this.$emit("handleTableHeadShowAll", value);
    },
    // ---
    // 下载后台Excel导入的模板
    handleServerExcelTemplateDownload() {
      this.$emit("onServerExcelTemplateDownloadClick");
    },

    // 覆盖默认上传方法
    uploadFunc(ev) {
      this.$emit("excelUploadFunc", ev);
    },

    // 后台Excel导入文件 正在上传 事件
    handleOnServerExcelImporting(event, file, fileList) {
      console.log("上传中");
      this.$emit("onServerExcelImporting", event, file, fileList);
    },

    // 后台Excel导入文件 上传失败出错 事件
    handleOnServerExcelImportError(err, file, fileList) {
      console.log("上传出错：" + err);
      this.$emit("onServerExcelImportError", err, file, fileList);
    },

    // 后台Excel导入文件 上传成功 事件
    handleOnServerExcelImportSuccess(response, file, fileList) {
      console.log("上传成功");

      // 延迟清理上传的文件记录，让画面更顺滑
      this.timerComm = setInterval(() => {
        this.$refs["elUploadServerExcelImport"].clearFiles();
        clearInterval(this.timerComm);
        this.timerComm = null;
      }, 2000);
      // this.$refs['elUploadServerExcelImport'].clearFiles()
      this.$emit("onServerExcelImportSuccess", response, file, fileList);
    },

    // 表格行样式
    rowClassName(row, index) {
      if (
        this.$store.state
          .hasOwnProperty(this.vuexFirstKey)
          .hasOwnProperty("tableNewRowId") &&
        this.$store.state
          .hasOwnProperty(this.vuexFirstKey)
          .hasOwnProperty("tableEditRowId")
      ) {
        // 从 vuex state 中获取新增数据的ID、修改数据的ID
        const newRowId = this.$store.state[this.vuexFirstKey].tableNewRowId[
          this.vuexSecondKey
        ];
        const editRowId = this.$store.state[this.vuexFirstKey].tableEditRowId[
          this.vuexSecondKey
        ];
        //  设置相应的行样式
        if (row[this.tableUniKey] === newRowId) {
          // 突出显示新增行
          return "table-row-new";
        } else if (row[this.tableUniKey] === editRowId) {
          // 突出显示修改行
          return "table-row-edit";
        }
      }
      return "";
      // if (!this.isCustomRowClass) {
      //   if (this.$store.state.hasOwnProperty(this.vuexFirstKey).hasOwnProperty('tableNewRowId')
      //     && this.$store.state.hasOwnProperty(this.vuexFirstKey).hasOwnProperty('tableEditRowId')) {
      //     // 从 vuex state 中获取新增数据的ID、修改数据的ID
      //     const newRowId = this.$store.state[this.vuexFirstKey].tableNewRowId[this.vuexSecondKey]
      //     const editRowId = this.$store.state[this.vuexFirstKey].tableEditRowId[this.vuexSecondKey]
      //     //  设置相应的行样式
      //     if (row[this.tableUniKey] === newRowId) { // 突出显示新增行
      //       return 'table-row-new'
      //     } else if (row[this.tableUniKey] === editRowId) {  // 突出显示修改行
      //       return 'table-row-edit'
      //     }
      //   }
      //   return ''
      // }else {
      //   // 提供给父组件实现自定义行样式
      //   return this.$emit('customClassName',row, index)
      // }
    },

    // ======start========表格对话框==============================================

    /**
     * 显示表格对话框，让用户对要操作的大量数据进行最后的检阅
     * @param modalOptionType 当前对话框的操作指令类型，用于弹出对话框让用户确认操作信息后，点击对话框中的确定按钮后，可以根据操作指令类型进行判定当前的对应操作
     * */
    showTableModel(
      modalOptionType,
      title,
      cancelLabel,
      confirmLabel,
      tableColumns,
      tableData
    ) {
      // 当前对话框的操作指令类型，用于弹出对话框让用户确认操作信息后，点击对话框中的确定按钮后，可以根据操作指令类型进行判定当前的对应操作
      this.curModalOptionType = modalOptionType;

      this.tableModalConfig.tableModelTitle = title;
      this.tableModalConfig.tableModalShow = true;
      this.tableModalConfig.tableModalCancelLabel = cancelLabel;
      this.tableModalConfig.tableModalConfirmLabel = confirmLabel;
      const tableModalColumns = [...this.getTableColumnsByFilter(tableColumns)];
      const tableModalData = [...tableData];
      // console.log(JSON.stringify(tableModalColumns))
      // console.log('****************************************************************************')
      // console.log(JSON.stringify(tableModalData))
      // console.log('****************************************************************************')

      // 调用子组件 tableModal 执行重绘表格数据
      this.$refs["tableModal"].drawTableData(tableModalColumns, tableModalData);
    },

    // 表格对话框的 行移除 事件
    handleTableModalDeleteRow(row) {
      // switch (this.curModalOptionType) {
      //   case this.modalOptionTypes.excelExportSelectedRows: // Excel导出 当前勾选的数据
      //     // 从 vuex 勾选行记录中移除 这里要取消勾选的记录
      //     break
      //   default:
      //     break
      // }
    },

    // 表格对话框内层对话框 确定按钮 点击事件
    handleTableModalInnerConfirm(tableColumns, tableData) {
      switch (this.curModalOptionType) {
        case this.modalOptionTypes.submitNewRows: // 提交 添加数据
          // console.log('提交添加数据')
          this.$emit("submitNewData", this.newAddData, (success) => {
            if (success) {
              // 操作成功，则关闭对话框
              // 关闭表格内层对话框
              this.tableModalConfig.tableModelInnerShow = false;
              // 关闭表格对话框
              this.tableModalConfig.tableModalShow = false;
            }
          });
          break;
        case this.modalOptionTypes.submitEditRows: // 提交 修改数据
          // console.log('提交修改数据')
          this.$emit("submitEditData", this.editData, (success) => {
            if (success) {
              // 操作成功，则关闭对话框
              // 关闭表格内层对话框
              this.tableModalConfig.tableModelInnerShow = false;
              // 关闭表格对话框
              this.tableModalConfig.tableModalShow = false;
            }
          });
          break;
        case this.modalOptionTypes.submitDeleteRows: // 提交 移除数据
          // console.log('提交移除数据')
          this.$emit("submitDeleteData", this.deleteData, (success) => {
            if (success) {
              // 操作成功，则关闭对话框
              // 关闭表格内层对话框
              this.tableModalConfig.tableModelInnerShow = false;
              // 关闭表格对话框
              this.tableModalConfig.tableModalShow = false;
            }
          });
          break;
        case this.modalOptionTypes.submitDeleteRows: // 提交 移除数据
          // console.log('直接提交当前勾选的数据到后台，删除数据')
          this.$emit("submitToDeleteRows", tableData, (success) => {
            if (success) {
              // 操作成功，则关闭对话框
              // 关闭表格内层对话框
              this.tableModalConfig.tableModelInnerShow = false;
              // 关闭表格对话框
              this.tableModalConfig.tableModalShow = false;
            }
          });
          break;
        case this.modalOptionTypes.customOption: // 自定义操作
          // 传递到父组件中
          this.$emit(
            "tableModalCustomOptionInnerConfirm",
            tableColumns,
            tableData
          );
          break;
        default:
          break;
      }
    },

    // 表格对话框内层对话框 取消按钮 点击事件
    handleTableModalInnerCancel() {
      // 关闭表格内层对话框
      this.tableModalConfig.tableModelInnerShow = false;
    },

    // 后台分页时， 请求后台表格数据
    requestTablePageData(tableTag, curPage, pageSize) {
      // 后台分页，父组件 实现函数 requestTablePageData(tableTap, curPage, pageSize) 根据当前页 this.tableConfig.curPage 请求后台数据数据
      this.$emit(
        "requestTablePageData",
        tableTag,
        curPage,
        pageSize,
        (responseTableData) => {
          // 父组件将请求到的数据回调过来
          // TODO:根据从后台查询到的最新数据，将对当前本地的勾选数据进行更新处理，尽量保证本地保存的勾选数据是最新的
          this.updateSelectedRowsToVuex(responseTableData, []);
        }
      );
    },

    // 表格对话框 确定按钮 点击事件
    handleTableModalConfirm(tableColumns, tableData) {
      switch (this.curModalOptionType) {
        case this.modalOptionTypes.deleteRows:
          // 批量移除当前的勾选行
          this.deleteSelectRows();
          // 关闭表格对话框
          this.tableModalConfig.tableModalShow = false;
          break;
        case this.modalOptionTypes.seeSelectedRowsOption: // 查阅当前所有勾选行
          // 将当前所有数据重新记录到vuex勾选记录中
          this.$store.dispatch(
            `set_SelectedRows_${this.vuexSecondKey}`,
            tableData
          );
          // 关闭表格对话框
          this.tableModalConfig.tableModelInnerShow = false;
          this.tableModalConfig.tableModalShow = false;
          // 请求后台数据，刷新表格
          this.requestTablePageData(
            this.tableTag,
            this.tableConfig.curPage,
            this.tableConfig.pageSize
          );
          break;
        case this.modalOptionTypes.customOption: // 自定义操作
          // 传递到父组件中
          this.$emit("tableModalCustomOptionConfirm", tableColumns, tableData);
          break;
        default:
          // 显示表格对话框的内层对话框，对操作用户进行最终询问确认（是否检查完毕，决定提交数据）
          this.tableModalConfig.tableModelInnerShow = true;

          break;
      }
      // 显示表格对话框的内层对话框，对操作用户进行最终询问确认（是否检查完毕，决定提交数据）
      //this.tableModalConfig.tableModelInnerShow = true
    },

    // 表格对话框 取消按钮 点击事件
    handleTableModalCancel() {
      // 关闭表格对话框
      this.tableModalConfig.tableModalShow = false;
    },
    // ======end========表格对话框==============================================

    // // 对外界父组件传递的搜索下拉框选项变量进行验证筛选
    // validateSelectSearchColumnSelections(tableColumns) {
    //   // this.tableConfig.selectSearchColumnSelections = [
    //   //   {
    //   //     title: '名称',
    //   //     key: 'wp_name'
    //   //   },
    //   // ]
    //
    //   this.searchColumnSelections = []  // 先清空搜索类型下拉框的选项集合绑定变量
    //   // 复制一个数组出来进行遍历操作
    //   for (const item of this.tableConfig.selectSearchColumnSelections) {
    //     const findIndex = tableColumns.findIndex(col => col.key === item.key)
    //     if (findIndex !== -1) { // 若找到了，则加入搜索类型下拉框的选项集合绑定变量中
    //       this.searchColumnSelections.push(item)
    //     }
    //   }
    //   this.searchTypeColumnSelections = []
    //   for (const item of this.searchTypeConfig.selections) {
    //     const findIndex = tableColumns.findIndex(col => col.key === item.key)
    //     if (findIndex !== -1) { // 若找到了，则加入搜索类型下拉框的选项集合绑定变量中
    //       this.searchColumnSelections.push(item)
    //     }
    //   }
    // },

    // 对表格查询下拉列表的选项集合进行处理，依据的是传入的表格中用于显示的列属性对象
    // 这里为了适用异步请求，将 表格中用于显示的列属性对象 作为参数传递
    dealTableColumnsByFilterForSearchType(tableColumns) {
      // console.log('columns：'+ JSON.stringify(tableColumns))
      // 对外界父组件传递的搜索下拉框选项变量进行验证筛选
      // this.validateSelectSearchColumnSelections(tableColumns)
      // console.log('搜索选项：'+JSON.stringify(this.tableConfig.selectSearchColumnSelections))
      if (this.tableConfig.selectSearchColumnSelections.length > 0)
        tableColumns = this.tableConfig.selectSearchColumnSelections;
      //add cdh 20200507   让搜索框设置生效

      // 如果外界父组件没有对 this.selectSearchColumnSelections 进行相应赋值，
      // 或者验证筛选后，仍然没有任何属性成员，那么默认对表格所有列属性都支持搜索
      if (
        !this.searchColumnSelections ||
        this.searchColumnSelections.length < 1
      ) {
        const tableColumnsTmp = [...tableColumns];
        this.searchColumnSelections = tableColumnsTmp.filter(
          (col) =>
            col.key !== "index" &&
            col.key !== "selection" &&
            col.key !== "action" &&
            col.type === "text"
        );
        // 设置默认选择第一项
        if (
          this.searchColumnSelections &&
          this.searchColumnSelections.length > 0
        ) {
          this.searchTextContentConfig.value = this.searchColumnSelections[0].key;
        }
      }
      if (
        !this.searchTypeColumnSelections ||
        this.searchTypeColumnSelections.length < 1
      ) {
        const tableColumnsTmp = [...tableColumns];
        this.searchTypeColumnSelections = tableColumnsTmp.filter(
          (col) =>
            col.key !== "index" &&
            col.key !== "selection" &&
            col.key !== "action" &&
            col.type === "select"
        );
        // 设置默认选择第一项
        if (
          this.searchTypeColumnSelections &&
          this.searchTypeColumnSelections.length > 0
        ) {
          this.searchTypeConfig.value = this.searchTypeColumnSelections[0].key;
          // 对应的搜索类型内容选择项也设置好
          this.setSearchTypeContentColumnSelectionsDefault(
            this.searchTypeConfig.value
          );
        }
      }
      // searchDateColumnSelections
      if (
        !this.searchDateColumnSelections ||
        this.searchDateColumnSelections.length < 1
      ) {
        const tableColumnsTmp = [...tableColumns];
        this.searchDateColumnSelections = tableColumnsTmp.filter(
          (col) =>
            col.key !== "index" &&
            col.key !== "selection" &&
            col.key !== "action" &&
            col.type === "datetime"
        );
        // 设置默认选择第一项
        if (
          this.searchDateColumnSelections &&
          this.searchDateColumnSelections.length > 0
        ) {
          this.searchDateConfig.value = this.searchDateColumnSelections[0].key;
        }
      }
    },

    // 获取经过统一过滤处理的表格列对象
    getTableColumnsByFilter(tableColums) {
      const tableColumnsTmp = [...tableColums];
      return tableColumnsTmp.filter(
        (col) =>
          col.key !== "index" && col.key !== "selection" && col.key !== "action"
      );
    },

    /**
     * 清空当前所有操作变量的记录
     * (比如 在将数据都提交到后台后，进行清空)
     * */
    clearAllOptionRememberData() {
      // 修改的但是没有提交到后台的数据，会单独保存到此属性中
      this.editData = [];
      // 删除但是没有提交到后台的数据，会单独追加保存在此属性中
      this.deleteData = [];
      // 添加但是没有提交到后台的数据，会单独追加保存在此属性中
      this.newAddData = [];
      // Excel 导入的数据 会单独在此属性中保存一份
      // 也会追加合并到 tableConfig.data 中
      this.excelImportData = [];
    },

    /**
     * 清空当前添加操作变量的记录
     * (比如 在将数据都提交到后台后，进行清空)
     * */
    clearNewRememberData() {
      this.newAddData = [];
    },

    /**
     * 清空当前删除操作变量的记录
     * (比如 在将数据都提交到后台后，进行清空)
     * */
    clearDeleteRememberData() {
      this.deleteData = [];
    },

    /**
     * 清空当前删除操作变量的记录
     * (比如 在将数据都提交到后台后，进行清空)
     * */
    clearEditRememberData() {
      this.editData = [];
    },

    /**
     * 清空当前Excel导入数据操作变量的记录
     * (比如 在将数据都提交到后台后，进行清空)
     * */
    clearExcelImportRememberData() {
      this.excelImportData = [];
    },

    // 提交下拉框的选项事件
    handleDropdownSubmit(dropdownItemName) {
      switch (dropdownItemName) {
        case "submitAdd":
          this.handleSubmitNewData();
          break;
        case "submitEdit":
          this.handleSubmitEditData();
          break;
        case "submitDelete":
          this.handleSubmitDeleteData();
          break;
      }
    },

    // 提交添加按钮 点击事件：提交当前添加的数据
    handleSubmitNewData() {
      // TODO:通过表格对话框提示 展示要提交的 所有添加数据
      this.showTableModel(
        this.modalOptionTypes.submitNewRows,
        "提交-添加",
        "取消",
        "确定",
        this.tableConfig.columns,
        this.newAddData
      );

      // console.log('提交添加数据')
      // this.$emit('submitNewData', this.newAddData)
    },

    // 提交移除按钮 点击事件：提交当前移除的数据
    handleSubmitEditData() {
      // TODO:通过表格对话框提示 展示要提交的 所有修改数据
      this.showTableModel(
        this.modalOptionTypes.submitEditRows,
        "提交-修改",
        "取消",
        "确定",
        this.tableConfig.columns,
        this.editData
      );

      // console.log('提交修改数据')
      // this.$emit('submitEditData', this.editData)
    },

    // 提交移除按钮 点击事件：提交当前移除的数据
    handleSubmitDeleteData() {
      // TODO:通过表格对话框提示 展示要提交的 所有删除数据
      this.showTableModel(
        this.modalOptionTypes.submitDeleteRows,
        "提交-移除",
        "取消",
        "确定",
        this.tableConfig.columns,
        this.deleteData
      );

      // console.log('提交删除数据')
      // this.$emit('submitDeleteData', this.deleteData)
    },

    // 添加按钮 点击事件(让父组件实现 跳转到表单添加页面)
    handleGoAddForm() {
      // 传递到父组件,参数是此表格的标识，当要使此标识有意义需要靠 父组件 事先绑定好有意义的值
      // (让父组件实现 跳转到表单添加页面)
      this.$emit("goAddForm", this.tableTag);
      this.haveExtraSelection = false;
    },

    // TODO:获取所有勾选的数据
    getAllSelectData() {
      let dataFilter = this.tableConfig.data.filter(
        (item, index) => item._checked
      );
      return dataFilter;
    },

    // 获取所有未勾选的数据
    getAllUnselectData() {
      let dataFilter = this.tableConfig.data.filter(
        (item, index) => !item._checked
      );
      return dataFilter;
    },

    // 把删除的数据记录到变量中
    rememberDeleteRows(deleteRows) {
      let deleteDataTmp = [...this.deleteData, ...deleteRows];
      // 对数据进行属性完整性处理：必须保证数组中的每个对象的属性是一致的
      deleteDataTmp = this.tableDataColFit(deleteDataTmp);
      // console.log('deleteDataTmp=' + JSON.stringify(deleteDataTmp))
      this.deleteData = [];
      this.deleteData = [
        ...noRepeatForObjectArray(deleteDataTmp, this.tableUniKey, true),
      ];
      // console.log(JSON.stringify(this.deleteData))
    },

    // 批量移除勾选行
    deleteSelectRows() {
      let selectRows = this.getAllSelectData();
      // console.log(JSON.stringify(selectRows))

      // ** splice(index,len,[item]) 注释：该方法会改变原始数组。
      // *** index——开始索引
      // *** len——涉及的范围长度
      // *** [item]——替换的内容，此参数省略，即 splice(index,len),则执行数组移除功能
      // **** 移除案例：arr.splice(1,1)
      // **** 替换案例：arr.splice(1,1,'ttt')
      // 开始索引 = 与当前勾选项 id 相等的项的索引
      // 要移除的成员数量 = 1

      selectRows.map((row, index) => {
        // 1、将当前勾选的数据 从数据源变量中 移除
        this.tableConfig.data.splice(
          this.tableConfig.data.findIndex(
            (item) => item[this.tableUniKey] === row[this.tableUniKey]
          ),
          1
        );
        // 2、将当前勾选的数据 从添加数据记录变量中 移除
        this.newAddData.splice(
          this.newAddData.findIndex(
            (item) => item[this.tableUniKey] === row[this.tableUniKey]
          ),
          1
        );
      });
      // 将当前勾选的数据都记录到数据移除存储变量中
      this.rememberDeleteRows(selectRows);

      // 重新渲染表格组件
      this.drawTableData(this.tableConfig.columns, this.tableConfig.data);

      // console.log(JSON.stringify(this.deleteData))
    },

    // 前台多行移除按钮 点击事件：将表格数据从数据源变量中移除，并转移存储前台移除数据存储变量中，后面点击提交按钮后，将一并提交到后台进行处理
    handleDeleteRows() {
      const selectRows = this.getAllSelectData();
      if (!selectRows || selectRows.length < 1) {
        // console.log('没有选择行')
        this.deleteRowsPopVisible = true;
        return;
      }
      // TODO:通过表格对话框提示 展示当前所有勾选的数据，然后进行前台批量删除（非提交到后台）
      this.showTableModel(
        this.modalOptionTypes.deleteRows,
        "确定要移除以下数据吗",
        "取消",
        "确定",
        this.tableConfig.columns,
        selectRows
      );

      // // 批量移除当前的勾选行
      // this.deleteSelectRows()
    },

    // TODO:多行直接提交后台进行删除(暂未开发)
    handleSubmitToDeleteRows() {
      const selectRows = this.getAllSelectData();
      if (!selectRows || selectRows.length < 1) {
        // console.log('没有选择行')
        this.deleteRowsPopVisible = true;
        return;
      }

      // TODO:通过表格对话框提示 展示当前所有勾选的数据，然后进行前台批量删除（非提交到后台）
      this.showTableModel(
        selectRows,
        "确定要移除以下数据吗",
        "取消",
        "确定",
        this.tableConfig.columns,
        selectRows
      );
    },

    // // （方案废弃）
    // // 通过 IView 的 Table 组件自带的 Excel 导出功能进行实现
    // // 废弃原因：官方资料给出，部分浏览器中会出现导出中文乱码，暂无解决方案
    // exportExcelByIViewTable() {
    //   this.$refs['table'].exportCsv({
    //     filename: this.tableConfig.tableName,
    //     columns: this.tableConfig.columns.filter((col, index) => col.key !== 'action'), // 过滤掉操作列字段
    //     data: this.tableConfig.data
    //   })
    // },

    // 获取所有勾选行数据
    getAllSelectedRows() {
      return [
        ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
          this.vuexSecondKey
        ],
      ];
    },

    // 查阅勾选行：通过表格对话框，显示当前所有的勾选行数据
    handleSeeSelectedRows() {
      // 先从记录中获取当前所有勾选行
      let vxSelRows = [
        ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
          this.vuexSecondKey
        ],
      ];
      if (!vxSelRows || vxSelRows.length < 1) {
        this.seeSelectedRowsPopVisible = true;
      } else {
        this.seeSelectedRowsPopVisible = false;
        // 通过表格对话框提示 展示勾选数据
        this.showTableModel(
          this.modalOptionTypes.seeSelectedRowsOption,
          "以下是当前所有勾选数据，可以进行移除操作",
          "取消",
          "确定",
          this.tableConfig.columns,
          vxSelRows
        );
      }
    },

    // 取消所有勾选行记录
    handleCancelAllSelectedRows() {
      // 先从记录中获取当前所有勾选行，并追加当前勾选的行
      let vxSelRows = [
        ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
          this.vuexSecondKey
        ],
      ];
      if (!vxSelRows || vxSelRows.length < 1) {
        this.cancelAllSelectedRowsPopVisible = true;
      } else {
        this.cancelAllSelectedRowsPopVisible = false;
        // 清除所有勾选行记录
        this.clearVuexSelectedRowsRemember();
        // 请求后台数据，刷新表格
        this.requestTablePageData(
          this.tableTag,
          this.tableConfig.curPage,
          this.tableConfig.pageSize
        );
        // 提示
        this.$message({
          message: "已取消所有勾选行",
          type: "success",
        });
      }
    },

    // Excel 导出
    handleExcelExport() {
      // 传递到父组件
      this.$emit("excelExport", (result) => {
        if (result) {
          // 若父组件中 回调结果为 true ,则执行这里默认的导出方式
          // 先从记录中获取当前所有勾选行，并追加当前勾选的行
          let vxSelRows = [
            ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
              this.vuexSecondKey
            ],
          ];
          if (!vxSelRows || vxSelRows.length < 1) {
            // 显示提示框
            this.excelExportRowsPopVisible = true;
            // console.log('没有勾选行')
          } else {
            // 不显示提示框
            this.excelExportRowsPopVisible = false;

            // TODO:通过表格对话框提示 展示要提交的 所有添加数据
            this.showTableModel(
              this.modalOptionTypes.excelExportSelectedRows,
              "Excel导出",
              "取消",
              "导出",
              this.tableConfig.columns,
              vxSelRows
            );

            // this.excelExport(vxSelRows)
          }
        } else {
          // 若父组件中 回调结果为 false ,则无作为，让 父组件自己实现功能
        }
      });
    },

    // // 清空 <input type="file"> 的文件记录
    // excelFileClear() {
    //   let file = document.getElementById("excelImport");
    //   // for IE, Opera, Safari, Chrome
    //   if (file.outerHTML) {
    //     file.outerHTML = file.outerHTML;
    //     // console.log(1)
    //     // alert(1);
    //   } else { // FF(包括3.5)
    //     file.value = "";
    //     // console.log(2)
    //     // alert(2);
    //   }
    //
    // },

    // 分析处理导入进来的数据：将导入进来的数据根据 <tableUniKey 唯一字段>, 从中提取出 <修改数据>、<添加数据>
    extractExcelImportData(importData) {
      // console.log(JSON.stringify(importData))
      // ** 首先进行去重处理
      let importDataTmp = [
        ...noRepeatForObjectArray(importData, this.tableUniKey, true),
      ];
      // ** 再根据  <tableUniKey 唯一字段> 提取出 <修改数据>、<添加数据>
      // 提取< 添加数据>：id为空的均是添加数据
      let addNewData = [
        ...importDataTmp.filter((item) => !item[this.tableUniKey]),
      ];
      // console.log(JSON.stringify(addNewData))
      // 提取<修改数据>：id不为空的，且当前数据源变量中存在的
      let editData = [
        ...importDataTmp.filter(
          (item) =>
            item[this.tableUniKey] &&
            this.tableConfig.data.findIndex(
              (item) => item[this.tableUniKey] === item[this.tableUniKey]
            ) !== -1
        ),
      ];
      // console.log(JSON.stringify(editData))

      return {
        addNewData,
        editData,
      };
    },

    // TODO:表格数据变量中的属性一致性处理：必须保证数组中的每个对象的属性是一致的
    // 补全缺少的属性，但是不会对多余的属性进行移除和修改等任何操作
    tableDataColFit(tableData) {
      // console.log('tableData = =' + JSON.stringify(tableData))
      let dataTmp = [...tableData];
      // console.log('tableDataColFit=' + JSON.stringify(dataTmp))
      dataTmp.map((item, index) => {
        let tableDataColKeys = Object.keys(item);
        this.columnsStd.map((col) => {
          if (
            tableDataColKeys.findIndex((colKey) => colKey === col.key) === -1
          ) {
            // 如果当前的表格数据中不存在标准列模板中的当前列key，那么为其添加，
            // 默认值根据当前列设置的type（数值类型）进行判定，目前 只有 number 、 string 两种类型
            if (col.type === "number") {
              item[col.key] = 0;
            } else {
              // col.type === 'string'
              item[col.key] = "";
            }
          }
        });
      });
      return dataTmp;
    },

    // 修改表格数据源
    editTableDataSource(editRows) {
      editRows.map((row, index) => {
        // 从数据源中根据设定好的唯一判定属性key，查询相同项的索引值，并对其进行替换
        const findIndex = this.tableConfig.data.findIndex(
          (item) => item[this.tableUniKey] === row[this.tableUniKey]
        );
        if (findIndex !== -1) {
          // 若找到了相同项，则替换
          this.tableConfig.data[findIndex] = row;
        }
      });
    },

    // 记录批量添加的数据
    rememberNewRows(newData) {
      // 先组合
      let newAddDataTmp = [...this.newAddData, ...newData];
      // 对数据进行属性完整性处理：必须保证数组中的每个对象的属性是一致的
      newAddDataTmp = this.tableDataColFit(newAddDataTmp);
      // 再去重后重新记录到变量中
      this.newAddData = [];
      this.newAddData = [
        ...noRepeatForObjectArray(newAddDataTmp, this.tableUniKey, true),
      ];
    },

    // 记录批量编辑的数据
    rememberEditRows(editData) {
      // 先组合
      let editDataTmp = [...this.editData, ...editData];
      // 对数据进行属性完整性处理：必须保证数组中的每个对象的属性是一致的
      editDataTmp = this.tableDataColFit(editDataTmp);
      // 再去重后重新记录到变量中
      this.editData = [];
      this.editData = [
        ...noRepeatForObjectArray(editDataTmp, this.tableUniKey, true),
      ];
      // 最后会根据修改的数据，修改数据源变量中的数据
      this.editTableDataSource(this.editData);
    },

    // 记录批量导入的Excel数据
    rememberExcelImportRows(importData) {
      // 先组合
      let importDataTmp = [...this.excelImportData, ...importData];
      // 对数据进行属性完整性处理：必须保证数组中的每个对象的属性是一致的
      importDataTmp = this.tableDataColFit(importDataTmp);
      // 再去重后重新记录到变量中
      this.excelImportData = [];
      this.excelImportData = [
        ...noRepeatForObjectArray(importDataTmp, this.tableUniKey, true),
      ];
    },

    // TODO:处理 Excel 导入进来的数据(待优化，根据数据的 id 进行判定 <修改/添加> 数据)
    dealExcelImportData(importData) {
      // 分析处理导入进来的数据：将导入进来的数据根据 <tableUniKey 唯一字段> 进行分离出 <修改数据>、<添加数据>
      let { addNewData, editData } = this.extractExcelImportData(importData);

      // 将 Excel 导入进来的数据 单独追加保存到 专用于存储添加数据的变量中
      // 记录批量添加的数据
      this.rememberNewRows(addNewData);
      // 记录批量编辑的数据
      this.rememberEditRows(editData);
      // 将 Excel 导入进来的数据 单独追加保存到 专用于存储 Excel 导入数据的变量中
      // 记录批量导入的Excel数据
      this.rememberExcelImportRows(importData);
      // 将当前处理好的<编辑数据><添加数据>与原数据进行合并，重新绘制表格
      let tableDataTmp = [
        ...this.tableConfig.data,
        ...this.editData,
        ...this.newAddData,
      ];
      // 调用分页函数，重新加载数据（此函数中有去重功能，所以传递进来的参数无需去重）
      this.drawTableData(this.tableConfig.columns, tableDataTmp);

      // 提示
      this.$message({
        message: "导入成功",
        type: "success",
      });

      // ** 以下两部操作是针对 Excel导入方案1 的——<input type="file" @change="xxx"> 的 现在通过 el-upload 完美实现 Excel 导入功能 **
      // 清空 <input type="file"> 的文件记录
      // this.excelFileClear()
      // 回调给 父组件 告知导入成功
      // this.$emit('onExcelImportToTableSuccess')
    },

    // // <input type="file"> 的 onchange 绑定事件：Excel 导入
    // handleExcelImport() {
    //   console.log('执行了onchange')
    //   // //每次导入前，都清理下 <input type="file"> 标签的输入值，否则，下次导入文件将不执行 onchange 事件，也就不会进入此绑定函数了
    //   // this.$refs['excelFileInput'].value = ''
    //
    //   // 传递到父组件
    //   this.$emit('excelImport', (result) => {
    //     // console.log('进入 handleExcelImport=》excelImport 事件函数')
    //     if (result) { // 若父组件中 回调结果为 true ,则执行这里默认的导入方式
    //       // console.log('进入 handleExcelImport=》excelImport 事件函数：' + result)
    //       // 此函数传递的 'excelImport' 是 用于接收文件的 <input type="file" id="excelImport"> 标签中的 id 值
    //       excelImport('excelImport').then(response => {
    //         // 处理 Excel 导入进来的数据
    //         this.dealExcelImportData(response)
    //       }).catch(response => {
    //         // Excel 数据导入失败
    //         console.log(`导入失败：${JSON.stringify(response)}`)
    //       })
    //     } else { // 若父组件中 回调结果为 false ,则无作为，让 父组件自己实现功能
    //       // console.log('进入 handleExcelImport=》excelImport 事件函数：' + result)
    //     }
    //   })
    // },

    // TODO:验证导入进来的数据列属性与当前的是否匹配
    excelImportDataValidate(importData) {
      // this.columnsStd
      // console.log(JSON.stringify(this.columnsStd))
      // console.log(JSON.stringify(importData))

      // 导入进来的数据的列可以少，但不能多
      // （少属性--[没关系]：如果Excel中的某列的值为空，则解析出来的当前的json对象会缺少该属性，所以少了没关系，后面的数据操作会补全，这里不作为验证条件）
      // （多属性--[不通过]：但是，如果多出来的属性一定是用户添加的，有可能会有用意，所以不能自动给他移除，而是认为无法匹配，不进行导入操作）

      // 先将导入数据 与 当前标准列模板进行 匹配验证，验证有没有多余的属性，
      // 若有多余的，则认为不匹配，不通过验证
      for (const item of importData) {
        for (const rowKey of Object.keys(item)) {
          for (const col of this.columnsStd) {
            if (col.key !== rowKey) {
              // 一旦找到一个多余属性，则直接返回false，不通过验证
              // console.log('找到不匹配的key：' + rowKey)
              return false;
            }
          }
        }
      }

      return true;

      // 注意： 不能企图用map进行遍历判定跳出循环，map是用来返回一个新数组的，不支持中途跳出，要想强制跳出只能通过 throw 异常，显然这种操作是不合理的
      // importData.forEach(item=>{
      //   Object.keys(item).forEach(rowKey=>{
      //     this.columnsStd.forEach(col=>{
      //       if (col.key !== rowKey) { // 一旦找到一个多余属性，则直接返回false，不通过验证
      //         console.log('找到不匹配的key：' + rowKey)
      //         return false
      //       }
      //     })
      //   })
      // })

      // // 然后对导入的数据进行一致性处理（补全缺少的属性）
      // let importDataTmp = [...this.tableDataColFit(importData)]
    },


    // TODO:通过《半后台分页模式》绘制表格
    // 开启《半后台分页模式》的条件：this.serverPage = true；this.halfServerPage = true;即 需要同时开启 《后台分页模式》和《半后台分页模式》
    // TODO：优化后台分页逻辑——半后台分页（根据设定一次性请求的数据页数，预先一次性请求大量数据，这样就无需每次切换页码都要请求当页数据，
    //  TODO: 直到切换的页码超出当前已请求的页数，才继续重新按设定好的页码进行请求后台数据）
    drawTableByHalfServerPage(pageSize, callback) {
      // 此函数的功能，必须同时开启以下两个开关，设置为true，才会执行，因为有相关的函数也会依据此变量值，适应相应的模式
      if (this.serverPage && this.halfServerPage) {
        // ** 根据当前预定值，计算一次性请求的数据量
        const requestCount = this.onceRequestPages * pageSize;
      }
    },

    // 适合《前台分页》、《后台分页》模式下调用
    // 绘制表格数据 (此函数提供给 父组件 进行调用，此组件中初始化时，不会调用此函数)
    // 即 父组件 初始化时，需要在获取到数据后，主动调用此函数，否则初始化时，表格不会显示数据
    // 调用方法案例：父组件使用时，需要给此组件设置ref<table-el ref="tableEl">, 然后如此调用子组件中的函数，this.$refs['tableEl'].drawTableData(columns, tableData)
    drawTableData(columns, tableData) {
      // console.log('后台分页开关：' + this.serverPage)
      // console.log('当前数据总数：' + this.tableConfig.countTotal)
      if (!columns) {
        // 列参数若为空，直接清理数据
        this.tableConfig.columns = [];
        this.tableConfig.data = [];
        return;
      }
      let isInit = false;
      if (!this.tableConfig.columns || this.tableConfig.columns.length < 1) {
        isInit = true;
      }

      this.tableConfig.columns = [];
      this.tableConfig.data = [];
      // 过滤掉不允许存在的列
      // let columnsTmp = columns.filter((col,index)=>{return (col.key !== 'selection' && col.key !== 'action')})
      // 先去重，再过滤掉不允许存在的列
      let noRepeatColumns = this.getTableColumnsByFilter(
        noRepeatForObjectArray(columns, "key", true)
      );
      let visibleColumns = this.getTableVisibleColumns(noRepeatColumns);
      // 为每个内容列都设置 resizable = true，即开启允许用户拖拽列宽
      visibleColumns.map((item) => {
        item["resizable"] = true;
      });
      let columnsTmp = [...visibleColumns];
      const selColumn = this.hasSelectColumn
        ? [
            {
              title: "",
              key: "selection",
              type: "selection",
              width: 40,
              align: "center",
              fixed: "left",
            },
          ]
        : [];
      const selAction = this.hasActionColumn
        ? [
            {
              title: "操作",
              key: "action",
              slot: "action",
              width: this.actionColumnWidth,
              align: "center",
              fixed: "right",
            },
          ]
        : [];
      this.tableConfig.columns = [
        {
          title: "",
          key: "index",
          type: "index",
          width: 40,
          align: "left",
          fixed: "left",
        },
        ...selColumn,
        ...columnsTmp,
        ...selAction,
      ];
      // 为数据中加入一些功能所需的参数
      let tableDataTmp = [];
      // 先将数据进行去重操作
      let noRepeatTableData = noRepeatForObjectArray(
        tableData,
        this.tableUniKey,
        true
      );
      // console.log(JSON.stringify(noRepeatTableData))
      // 再通过对已去重的数据进行相应处理
      noRepeatTableData.map((data, index) => {
        // 过滤掉不允许存在的属性
        tableDataTmp.push({
          _checked: false, // 勾选功能
          _disabled: false, // 是否禁用勾选功能
          ...data,
        });
      });
      // console.log(JSON.stringify(tableDataTmp))
      // 对表格进行属性一致性处理
      tableDataTmp = this.tableDataColFit(tableDataTmp);
      this.tableConfig.data = [...tableDataTmp];
      // console.log(JSON.stringify(this.tableConfig.data))

      if (isInit) {
        // 初始时，设置下拉框默认选择的内容
        this.tableConfig.selectSearchColumn = this.getTableColumnsByFilter(
          this.tableConfig.columns
        )[0].key;
      }

      // 将准备好的列属性对象，传入搜索类型处理函数，依据它来检验筛选有效的列属性作为搜索项
      // 因为要避免外界父组件传递的列属性有这里不存在或不匹配的情况发生，所以这里做了检验筛选
      this.dealTableColumnsByFilterForSearchType([...this.tableConfig.columns]);

      // 与 vuex 勾选行 数据记录 进行对比查找，根据 id 查找相同项，将与记录中对于的勾选行 设置为勾选状态
      this.setSelectedRowsByVuex();

      // console.log('this.serverPage=' + this.serverPage)
      // 根据分页方式，执行相应的分页逻辑
      if (this.serverPage) {
        // 后台分页算法
        this.serverPageDataLogic();
      } else {
        // 执行前台分页算法
        this.pageDataLogic();
      }
    },

    // 根据本地记录获取需要显示的字段列（如果本地存储记录不为空，过滤掉本地没有存储的字段；本地记录为空，则显示所有字段列）
    getTableVisibleColumns(columns) {
      const columnsTmp = [...columns];
      let visibleColumns = [];
      // 暂且只获取对整个系统有效的数据，后期在根据实际情况，看是否需要加入针对登录用户的
      const localColumnsStr = localStorage.getItem(
        `${this.vuexFirstKey}_${this.vuexSecondKey}_tableColumns`
      );
      if (!localColumnsStr) {
        // 记录为空，则默认显示所有字段列
        visibleColumns = [...columnsTmp];
      } else {
        // 否则进行过滤
        const systemColumnsArray = localColumnsStr.split(",");
        for (const col of columnsTmp) {
          for (const item of systemColumnsArray) {
            if (col["title"] === item) {
              visibleColumns.push(col);
            }
          }
        }
      }

      return visibleColumns;
    },

    // 与 vuex 勾选行 数据记录 进行对比查找，根据 id 查找相同项，将与记录中对于的勾选行 设置为勾选状态
    setSelectedRowsByVuex() {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        // 先从记录中获取当前所有勾选行
        let vxSelRows = [
          ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ],
        ];
        // 与当前数据进行查找对比，将与记录中对于的勾选行 设置为勾选状态
        let tableDataTmp = [...this.tableConfig.data];
        tableDataTmp.map((row) => {
          const findIndex = vxSelRows.findIndex(
            (selRow) => selRow[this.tableUniKey] === row[this.tableUniKey]
          );
          if (findIndex !== -1) {
            // 找到与记录中的相同项，设置为勾选状态的数据
            row._checked = true;
          }
        });

        this.tableConfig.data = [];
        this.tableConfig.data = [...tableDataTmp];
      }
    },

    // 后台分页算法
    serverPageDataLogic() {
      // 后台分页，那么请求的必定时当前页数据，所以直接传递到当前页数据变量中即可
      this.tableConfig.pageData = [...this.tableConfig.data]; // 清空 表格当前页数据数组
      // 后台分页，那么请求到的数据也一定是根据当前搜索内容所得的数据，所以也直接传递即可
      this.tableConfig.filterData = [...this.tableConfig.data];
    },

    // 分页算法
    pageDataLogic() {
      // 根据当前 pageSize 分配当前页数据
      this.tableConfig.pageData = []; // 清空 表格当前页数据数组

      // 根据搜索内容进行处理的 过滤算法
      this.tableConfig.filterData = getFilterArray(
        this.tableConfig.data,
        this.tableConfig.selectSearchColumn,
        this.tableConfig.search
      );

      //** 分页算法
      // 当前页的开始行索引 = （当前页码 - 1）* 当前页最大行数
      const startIndex =
        (this.tableConfig.curPage - 1) * this.tableConfig.pageSize;
      // 当前页的结束行索引 = 当前页码 * 当前页最大行数 - 1
      let endIndex = this.tableConfig.curPage * this.tableConfig.pageSize - 1;
      // 如果计算所得的结束行索引 超出 表格数据的剩余数量，即最后一页的剩余行数 不足 当前页最大行数，
      // 则 结束行的索引 = 表格数据的总长度 - 1
      endIndex =
        endIndex > this.tableConfig.filterData.length - 1
          ? this.tableConfig.filterData.length - 1
          : endIndex;

      for (let i = startIndex; i <= endIndex; i++) {
        // 根据上面定好的行索引，将表格数据数组 分配到 表格当前页数据数组 中
        this.tableConfig.pageData.push(this.tableConfig.filterData[i]);
      }
    },

    // 搜索栏回车事件
    handleSearchEnter() {
      const result =
        Number(new Date(this.searchDateTimeRangeConfig.startDateTime)) -
        Number(new Date(this.searchDateTimeRangeConfig.endDateTime));
      if (
        result < 0 ||
        this.searchDateTimeRangeConfig.endDateTime === "" ||
        this.searchDateTimeRangeConfig.startDateTime === ""
      ) {
        // if (this.haveExtraSelection === true) {
        //   this.handleGetMoreSelectOpts();
        // }
        // 根据分页方式，执行相应的分页逻辑
        if (this.serverPage) {
          // 每次通过过滤条件进行刷新的数据表，需要重置当前页为首页，否则会出现数据源和页码不配的问题
          this.tableConfig.curPage = 1;
          // 请求后台数据，刷新表格
          this.requestTablePageData(
            this.tableTag,
            this.tableConfig.curPage,
            this.tableConfig.pageSize
          );
        } else {
          // 执行前台分页算法
          this.pageDataLogic();
        }
      } else if (result === 0) {
        this.$message({
          message: "请选择一个时间段",
          type: "warning",
        });
      } else {
        this.$message({
          message: "查询时，开始时间不得大于结束时间",
          type: "warning",
        });
      }
    },

    // 更新当前 vuex 记录的勾选行数据
    /**
     * @param updateRowsSource 这只是最新的行数据，不一定是勾选行，只是以此来对照查询，记录中有则改，没有，则不改
     * @param deleteRows 这只是已删除的数据，不一定是勾选行，只是以此来对照查询，记录中有，则移除，没有，则不管
     * */
    updateSelectedRowsToVuex(updateRows, deleteRows) {
      if (
        (!updateRows && !deleteRows) ||
        (updateRows.length < 1 && deleteRows.length < 1)
      ) {
        return;
      }
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        // 先从记录中获取当前所有勾选行
        let vxSelRows = [
          ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ],
        ];
        let updateRowsTmp = []; // 从本地记录中找到的勾选行的最新数据
        // 将传入的行数据（这里传入的参数只是最新数据），与记录中的数据进行对比，找到 id 一致的，则进行替换更新
        updateRows.map((upRow) => {
          // 记录项找到的勾选行更新数据
          const findIndex = vxSelRows.findIndex(
            (row) => row[this.tableUniKey] === upRow[this.tableUniKey]
          );
          if (findIndex !== -1) {
            // 找到相同项，把对于的最新数据收集起来
            updateRowsTmp.push(upRow);
          }
        });

        // 对记录进行更新操作
        if (updateRowsTmp && updateRowsTmp.length > 0) {
          // 先从记录中移除
          this.removeRememberSelectedRowsToVuex(updateRowsTmp);
          // 再重新追加到记录中
          this.rememberSelectedRowsToVuex(updateRowsTmp);
        }
      }
      // 移除操作：直接调用用移除记录函数即可(函数中会自动判定是否存在数据，存在的才会移除，不存在记录中的，不会理会)
      if (deleteRows && deleteRows.length > 0) {
        this.removeRememberSelectedRowsToVuex(deleteRows);
      }
    },

    // 记录当前勾选行数据到 vuex 中
    rememberSelectedRowsToVuex(rows) {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        // 先从记录中获取当前所有勾选行，并追加当前勾选的行
        let vxSelRows = [
          ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ],
          ...rows,
        ];
        // 进行数据去重
        vxSelRows = [
          ...noRepeatForObjectArray(vxSelRows, this.tableUniKey, true),
        ];
        // 将新的勾选行数据重新存储到记录中
        this.$store.dispatch(
          `set_SelectedRows_${this.vuexSecondKey}`,
          vxSelRows
        );
      }
    },

    // 从记录当前勾选行数据的 vuex 变量中 移除当前取消勾选的行
    removeRememberSelectedRowsToVuex(rows) {
      if (this.$store.state[this.vuexFirstKey] !== undefined) {
        // 先从记录中获取当前所有勾选行，并追加当前勾选的行
        let vxSelRows = [
          ...this.$store.state[this.vuexFirstKey].tableSelectedRows[
            this.vuexSecondKey
          ],
        ];
        let vxSelRowsTmp = [...vxSelRows];
        // 从记录中进行查找 ID 相同的项，进行移除
        for (const csRow of rows) {
          vxSelRowsTmp.map((row, index) => {
            if (row[this.tableUniKey] === csRow[this.tableUniKey]) {
              // 移除
              vxSelRows.splice(
                vxSelRows.findIndex(
                  (item) => item[this.tableUniKey] === csRow[this.tableUniKey]
                ),
                1
              );
              // console.log('当前取消勾选的行：' + JSON.stringify(csRow[this.tableUniKey]))
            }
          });
        }
        // console.log('移除取消勾选行后的记录：' + JSON.stringify(vxSelRows))
        // 将新的勾选行数据重新存储到记录中
        this.$store.dispatch(
          `set_SelectedRows_${this.vuexSecondKey}`,
          vxSelRows
        );
      }
    },

    // 清除所有勾选行记录
    clearVuexSelectedRowsRemember() {
      // 将空数组重新存储到记录中
      this.$store.dispatch(`set_SelectedRows_${this.vuexSecondKey}`, []);
    },

    // 表格行单击事件
    handleTableRowClick(row, index) {
      if (this.lightNewOrEditRowEnable) {
        // 单击到突显颜色显示的行时，取消突显显示的样式
        // 只要清除掉 vuex 记录中相应的 ID 记录值即可
        // 从 vuex state 中获取新增数据的ID、修改数据的ID
        const newRowId = this.$store.state[this.vuexFirstKey].tableNewRowId[
          this.vuexSecondKey
        ];
        const editRowId = this.$store.state[this.vuexFirstKey].tableEditRowId[
          this.vuexSecondKey
        ];

        let storeKey = this.vuexSecondKey;
        storeKey = storeKey.replace(storeKey[0], storeKey[0].toUpperCase()); // 首字母转大写
        if (row[this.tableUniKey] === newRowId) {
          // 清除 新增数据的ID 记录
          // 把修改的数据ID记录到vuex中
          this.$store.dispatch(`set_${storeKey}TableNewRowId`, "");
        } else if (row[this.tableUniKey] === editRowId) {
          // 清除 修改数据的ID 记录
          this.$store.dispatch(`set_${storeKey}TableEditRowId`, "");
        }
      }
      this.$emit("onRowClick", row, index);
    },

    // 表格行双击
    handleTableRowDbclick(row, index) {
      // 双击启动编辑功能
      if (this.dbclickRowEdit) {
        this.handleEditRow(row);
      }
      // 运行子组件自定义操作
      this.$emit("handleTableRowDbclick", row, index);
    },
    /**
     * 表格勾选操作：在多选模式下有效，选中某一项时触发
     * @param selection 已选项数据
     */
    handleTableSelectRowChange(selection) {
      this.$emit("handleTableSelectRowChange", selection);
    },
    /**
     * 表格勾选操作：在多选模式下有效，选中某一项时触发
     * @param selection 已选项数据
     * @param row 刚选择的项数据
     */
    handleTableSelectRow(selection, row) {
      // 更改勾选值
      let selectedRow = {};
      this.tableConfig.data.map((item, index) => {
        if (item[this.tableUniKey] === row[this.tableUniKey]) {
          item._checked = true;
          selectedRow = { ...item };
        }
      });
      // console.log('当前勾选行：' + JSON.stringify(selectedRow))
      // 记录当前勾选行数据到 vuex 中
      this.rememberSelectedRowsToVuex([selectedRow]);
    },

    /**
     * 表格勾选操作：在多选模式下有效，取消选中某一项时触发
     * @param selection 已选项数据
     * @param row 刚选择的项数据
     */
    handleTableSelectRowCancel(selection, row) {
      // 更改勾选值
      let cancelRow = {};
      this.tableConfig.data.map((item, index) => {
        if (item[this.tableUniKey] === row[this.tableUniKey]) {
          item._checked = false;
          cancelRow = { ...item };
        }
      });
      // console.log('当前取消勾选的行：' + JSON.stringify(cancelRow))
      // 从记录当前勾选行数据的 vuex 变量中 移除当前取消勾选的行
      this.removeRememberSelectedRowsToVuex([cancelRow]);
    },

    /**
     * 表格勾选操作：在多选模式下有效，点击全选时触发
     * @param selection 已选项数据
     */
    handleTableSelectRowAll(selection) {
      // 更改勾选值(对比当前页勾选项)
      this.tableConfig.data.map((item, index) => {
        selection.map((row, index) => {
          if (item[this.tableUniKey] === row[this.tableUniKey]) {
            row._checked = true;
            item._checked = true;
          }
        });
      });

      // 记录当前勾选行数据到 vuex 中
      this.rememberSelectedRowsToVuex(selection);
    },

    /**
     * 表格勾选操作：在多选模式下有效，点击取消全选时触发
     * @param selection 已选项数据（）
     * 将当前全选行数据记录到临时变量中,为了弥补 IVIEW Table的取消全选事件的不足：on-select-all-cancel(selection) 的 selection 是已选项数据
     * 所以每次激活 on-select-all-cancel(selection) 时，selection 是已选项数据 必然都是 空数组[]， 此参数毫无意义
     * on-select-all-cancel(selection) 中的 selection 应该是当前被取消全选的行数据，或者是在取消全选之前的 选择行数据
     * IVIEW Table 组件的此事件 设计有问题，对于 selection 我们只能暂时自己解决，自己根据需求，来进行相应的处理，不要管 selection 参数了
     */
    handleTableSelectRowAllCancel(selection) {
      // 更改勾选值(对比当前页勾选项)
      this.tableConfig.data.map((item, index) => {
        this.tableConfig.pageData.map((row, index) => {
          if (item[this.tableUniKey] === row[this.tableUniKey]) {
            row._checked = false;
            item._checked = false;
          }
        });
      });

      // 从记录当前勾选行数据的 vuex 变量中 移除当前取消勾选的行
      this.removeRememberSelectedRowsToVuex(this.tableConfig.pageData);
    },

    // 行编辑 按钮点击事件
    handleEditRow(row) {
      // 仅对当前行开启行编辑功能时有效
      if (
        !row.hasOwnProperty("disabledRowEdit") ||
        (row.hasOwnProperty("disabledRowEdit") && row["disabledRowEdit"])
      ) {
        // console.log(JSON.stringify(row))
        // 将当前行数据传递到 父组件 函数中
        this.haveExtraSelection = false;
        this.$emit("editRow", this.tableTag, row);
      }
    },

    // 移除指定行
    deleteSelectRow(row) {
      // 将要移除的数据存储到 存储移除数据的变量中
      this.rememberDeleteRows([row]);
      // 赋值原始数据
      let tableDataTmp = [...this.tableConfig.data];
      // 移除对应数据
      tableDataTmp.splice(
        tableDataTmp.findIndex(
          (item) => item[this.tableUniKey] === row[this.tableUniKey]
        ),
        1
      );
      // 重新渲染表格
      this.drawTableData(this.tableConfig.columns, tableDataTmp);
    },

    // 行删除 按钮点击事件
    handleDeleteRow(row) {
      // ** splice(index,len,[item]) 注释：该方法会改变原始数组。
      // *** index——开始索引
      // *** len——涉及的范围长度
      // *** [item]——替换的内容，此参数省略，即 splice(index,len),则执行数组移除功能
      // **** 移除案例：arr.splice(1,1)
      // **** 替换案例：arr.splice(1,1,'ttt')
      // 开始索引 = inputCount 当前数量输入值
      // 要移除的成员数量 = 当前差值的绝对值

      // 移除指定行
      this.deleteSelectRow(row);
    },

    // TODO:行直接删除，即 直接提交到后台进行删除数据
    handleSubmitToDeleteRow(row) {
      this.$emit(
        "submitToDeleteRow",
        this.tableTag,
        row,
        (requestTableData) => {
          // 删除数据后，会对表格进行重新请求后台数据，刷新表格，所以要对本地的勾选数据记录进行更新（如果删除的是勾选数据，那么就要从记录中移除）
          this.updateSelectedRowsToVuex(requestTableData, [row]);
        }
      );
    },

    // 当前页切换事件
    changeCurrentPage(curPage) {
      this.tableConfig.curPage = curPage;

      // 根据分页方式，执行相应的分页逻辑
      if (this.serverPage) {
        // 请求后台数据，刷新表格
        this.requestTablePageData(
          this.tableTag,
          this.tableConfig.curPage,
          this.tableConfig.pageSize
        );
      } else {
        // 执行前台分页算法
        this.pageDataLogic();
      }
    },

    // 每页最大行数改变事件
    changPageSize(pageSize) {
      // this.tableConfig.pageData
      // this.tableConfig.data
      // console.log(JSON.stringify(pageSize))
      // console.log(JSON.stringify(this.tableConfig.pageSize))

      // 改变当前记录的pageSize
      this.tableConfig.pageSize = pageSize;

      // 根据分页方式，执行相应的分页逻辑
      if (this.serverPage) {
        // 请求后台数据，刷新表格
        this.requestTablePageData(
          this.tableTag,
          this.tableConfig.curPage,
          this.tableConfig.pageSize
        );
      } else {
        // 执行前台分页算法
        this.pageDataLogic();
      }
    },

    // 内层Dialog 确定按钮
    handleInnerConfirm() {
      // 将当前表格中的最终数据回调到 父组件中
      this.$emit(
        "innerConfirm",
        this.tableConfig.columns,
        this.tableConfig.data
      );
    },

    // 内层Dialog 取消按钮
    handleInnerCancel() {
      this.$emit("innerCancel");
    },

    // 确定按钮
    handleConfirm() {
      this.$emit("confirm");
    },

    // 取消按钮
    handleCancel() {
      this.$emit("cancel");
    },

    // 类型搜索栏的列类型下拉框切换事件
    handleSearchTypeSelectChange(curOptionVal) {
      // 当切换选项是，需要改变类型搜索栏的内容下拉框中的集合，因为每个列对应的搜索类型集合是不同的
      this.setSearchTypeContentColumnSelectionsDefault(curOptionVal);
    },

    // 设置类型搜索栏的类型内容下拉选项的内容和默认项
    setSearchTypeContentColumnSelectionsDefault(curOptionVal) {
      this.searchTypeContentColumnSelections = [];
      let curOptionColumns = this.tableConfig.columns.filter(
        (col) =>
          col.key !== "index" &&
          col.key !== "selection" &&
          col.key !== "action" &&
          col.type === "select" &&
          col.key === curOptionVal
      );
      if (curOptionColumns && curOptionColumns.length > 0) {
        this.searchTypeContentColumnSelections =
          curOptionColumns[0].selectOptions;
        // 设置默认选择第一项
        // this.searchTypeContentConfig.value = this.searchTypeContentColumnSelections[0].value;
      }
    },

    // 表格字段列显示/隐藏设置按钮
    handleTableColumnsSetting() {
      // 弹出字段列设置对话框
      this.showDialogTableColumns();
    },

    // 弹出字段列设置对话框
    showDialogTableColumns() {
      this.dialogTableColumnsVisible = true;
      // 初始化字段列对话框的一些参数
      this.initDialogTableColumnsParams();
    },
    // 原来的本地存储版本修改为后台存储版本
    // 初始化字段列对话框的一些参数
    initDialogTableColumnsParams() {
      this.dialogTableColumnsMember = [];
      // 设置已勾选的（即当前已显示的）
      // 暂且只获取对整个系统有效的数据，后期在根据实际情况，看是否需要加入针对登录用户的
      let nameArr = [];
      this.tableHeadCol.forEach((item, index) => {
        nameArr.push(item.title);
      });
      // const nameStr = nameArr.join(",");
      // const localColumnsStr = localStorage.getItem(
      //   `${this.vuexFirstKey}_${this.vuexSecondKey}_tableColumns`
      // );
      // const localColumnsStr = nameStr;
      // // console.log(localColumnsStr);

      // vuex中读取所有
      const columnsAll = this.$store.state[this.vuexFirstKey][
        `${this.vuexSecondKey}ColumnsOrigin`
      ].columns.sort((a, b) => {
        return a.sortNum - b.sortNum;
      });

      let noRepeatColumns = this.getTableColumnsByFilter(
        noRepeatForObjectArray(columnsAll, "key", true)
      );
      // let columnsTmp = [...noRepeatColumns];
      // let checkMemberTmp = [];
      // columnsTmp.map(item => {
      //   checkMemberTmp.push(item["title"]);
      // });
      // this.dialogTableColumnsMember = [...checkMemberTmp];
      let fieldSelctionRow = this.$store.state[this.vuexFirstKey][
        `${this.vuexSecondKey}Columns`
      ].columns;

      this.fieldSelection = fieldSelctionRow;

      noRepeatColumns.forEach((item) => {
        item._checked = false;
        fieldSelctionRow.forEach((itemSelect) => {
          if (itemSelect.key === item.key) item._checked = true;
        });
      });

      this.dialogTableColumnsMember = [...noRepeatColumns];

      // if (!!localColumnsStr) {
      //   // 记录为空，则默认显示所有字段列
      //   this.dialogTableColumnsCheckAll = false;
      //   this.dialogTableColumnsCheckedVal = [...localColumnsStr.split(",")];
      // } else {
      //   // 若记录为空，说明从未设置，那么一定所有字段都显示的，所以设置全选
      //   this.dialogTableColumnsCheckAll = true;
      //   this.dialogTableColumnsCheckedVal = [...this.dialogTableColumnsMember];
      // }
    },

    // // 表格字段列显示/隐藏复选对话框的改变事件
    // handleDialogTableColumnsCheckAllChange(value) {
    //   this.dialogTableColumnsCheckedVal = value
    //     ? this.dialogTableColumnsMember
    //     : [];
    //   this.dialogTableColumnsIsIndeterminate = false;
    // },
    //
    // handleDialogTableColumnsCheckedChange(value) {
    //   let checkedCount = value.length;
    //   this.dialogTableColumnsCheckAll =
    //     checkedCount === this.dialogTableColumnsMember.length;
    //   this.dialogTableColumnsIsIndeterminate =
    //     checkedCount > 0 && checkedCount < this.dialogTableColumnsMember.length;
    // },
    //表格单元格失去焦点事件
    bodyOnBlur(row, column, index) {
      // console.log(row)
      // console.log(column)
      // console.log(index)
      const columnName = column.slot;
      this.dialogTableColumnsMember[index][columnName] = row[columnName];
    },

    handleDialogTableColumnsSelectChange(selection) {
      this.fieldSelection = selection;
    },

    handleDialogTableColumnsDragDrop(index1, index2) {
      if (index1 === index2) return;
      // console.log("原始位置:"+index1);//原始位置
      // console.log("目标位置:"+index2);//目标位置
      if (parseInt(index1) > parseInt(index2)) {
        this.dialogTableColumnsMember.splice(
          index2,
          0,
          this.dialogTableColumnsMember[index1]
        );
        this.dialogTableColumnsMember.splice(parseInt(index1) + 1, 1);
      } else {
        this.dialogTableColumnsMember.splice(
          parseInt(index2) + 1,
          0,
          this.dialogTableColumnsMember[index1]
        );
        this.dialogTableColumnsMember.splice(parseInt(index1), 1);
      }
      this.dialogTableColumnsMember.forEach((item) => {
        item._checked = false;
        this.fieldSelection.forEach((checkItem) => {
          if (checkItem.key === item.key) item._checked = true;
        });
      });
    },

    handleDialogTableColumnsCancel() {
      this.dialogTableColumnsVisible = false;
    },

    // 将表格字段列应用到整个系统
    handleDialogTableColumnsSystemConfirm() {
      // 以当前窗体为key记录到localStorage
      // localStorage.setItem(
      //   `${this.vuexFirstKey}_${this.vuexSecondKey}_tableColumns`,
      //   this.dialogTableColumnsCheckedVal
      // );
      // console.log(JSON.stringify(localStorage.getItem(`${this.vuexFirstKey}_${this.vuexSecondKey}_tableColumns`).split(',')))
      // console.log(this.dialogTableColumnsCheckedVal);
      // this.$emit("handleChangeTableHeadCol", this.dialogTableColumnsCheckedVal);

      this.dialogTableColumnsMember.forEach((item) => {
        item.checkbox = false;
        this.fieldSelection.forEach((checkItem) => {
          if (checkItem.key === item.key) item.checkbox = true;
        });
      });

      this.$emit("handleChangeTableHeadCol", this.dialogTableColumnsMember);
      // this.$message({
      //   message: "设置成功",
      //   type: "success"
      // });

      this.dialogTableColumnsVisible = false;

      // const columnsAll = this.$store.state[this.vuexFirstKey][
      //   `${this.vuexSecondKey}Columns`
      // ].columns;
      // // 重新渲染表格组件
      // this.drawTableData(columnsAll, this.tableConfig.data);
    },

    // 将表格字段列应用到当前用户
    // handleDialogTableColumnsUserConfirm() {
    //   // console.log(JSON.stringify(localStorage.getItem(this.dialogTableColumnsCheckedVal)))
    //   // console.log('当前登录用户信息：' + JSON.stringify(this.$store.state.user.userInfo))
    //   const userId = this.$store.state.user.userInfo["user_uid"];
    //   const userAccount = this.$store.state.user.userInfo["user_account"];
    //
    //   // 以当前登录用户和窗体为key记录到localStorage
    //   localStorage.setItem(
    //     `${userId}_${userAccount}_${this.vuexFirstKey}_${this.vuexSecondKey}_tableColumns`,
    //     this.dialogTableColumnsCheckedVal
    //   );
    //   // console.log(JSON.stringify(localStorage.getItem(`${userId}_${userAccount}_${this.vuexFirstKey}_${this.vuexSecondKey}_tableColumns`).split(',')))
    // },
    // TODO 在父组件tab切换时要调用这里子组件的清理筛选条件 和 关闭弹窗的方法，否则会出现切换了tab但是弹窗未关闭的问题
    handleGetMoreSelectOpts() {
      this.haveExtraSelection = !this.haveExtraSelection;
      if (this.haveExtraSelection === true) {
        this.extraSelectionText = "关闭筛选条件";
        this.hasOriginRow = false;
        this.searchDateSwitch = true;
      } else {
        this.extraSelectionText = "更多筛选条件";
        this.hasOriginRow = true;
        this.searchDateSwitch = false;
        // this.searchTypeContentConfig.value = "";
        // this.searchTypeSwitch = false;
      }
    },
    searchTypeChange(data) {
      console.log(data);
      if (
        this.searchTypeContentConfig.value !== "" &&
        this.searchTypeContentConfig.value !== undefined
      ) {
        this.searchTypeSwitch = true;
      } else {
        this.searchTypeSwitch = false;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.table-container {
  ::v-deep i {
    display: none;
    width: 0;
    padding: 0 0;
    margin: 0 0;
  }

  ::v-deep .ivu-select-selected-value {
    text-align: center;
    padding: 0 0;
  }

  ::v-deep .el-checkbox {
    text-align: center;
  }
}
</style>
<style lang="less">
// .left-data-picker {
//   .ivu-select-dropdown {
//     left: 195px !important;
//   }
// }

#table-el-container {
  element.style {
    position: initial !important;
    will-change: top, left;
    top: -124px;
    left: -54px;
    z-index: 999;
  }

  // 行数据新增的样式(新增一条数据，表单提交到后台后，这里会以此样式进行突出显示)
  .ivu-table .table-row-new td {
    background-color: #fdcb6e;
    /*color: #fff;*/
    animation: table-row-new-light 1s infinite linear;
  }

  @keyframes table-row-new-light {
    0% {
      background-color: #fdcb6e88;
    }
    50% {
      background-color: #fdcb6eff;
    }
    100% {
      background-color: #fdcb6e88;
    }
  }

  // 行数据修改的样式(修改一条数据，表单提交到后台后，这里会以此样式进行突出显示)
  .ivu-table .table-row-edit td {
    background-color: #7bed9f;
    /*color: #fff;*/
    animation: table-row-edit-light 1s infinite linear;
  }

  @keyframes table-row-edit-light {
    0% {
      background-color: #7bed9f88;
    }
    50% {
      background-color: #7bed9fff;
    }
    100% {
      background-color: #7bed9f88;
    }
  }

  .ivu-select-selection {
    height: 32px;
  }
}
</style>
<style lang='less' scoped>
::v-deep {
  .ivu-select-selection {
    margin-left: 2px;
  }

  .ivu-input {
    margin-left: 2px;
  }

  .el-dropdown-menu__item {
    padding: 0 0;
  }
}

.drop-down-style {
  padding: 0 20px;
}

.more-opts-wrapper {
  display: flex;
  flex-direction: column;

  div {
    // z-index: 99;
    margin: 1px 0;
  }

  .more-opts-first-line {
    display: flex;
    justify-content: space-between;
  }
}

.search-btn {
  // position: relative;
  /*margin: 0.1rem 0.3rem 0.3rem 0.7rem;*/
  margin-left: 8px;
  margin-top: 2px;
  width: 28px;
  height: 28px;
  // left: 800px;
}

.table-el-container {
  /*功能按钮操作栏*/

  .table-header-wrapper {
    display: flex;
    /*justify-content: space-between;*/
    /*height: 32px;*/
    margin-bottom: 10px;
    flex-wrap: nowrap;

    .table-header-left-wrapper {
      ::v-deep {
        .ivu-dropdown-item {
          padding: 0 0;
        }
      }

      .option-button-container {
        position: relative;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: left;
        margin-bottom: 0.2rem;

        .el-btn-group-style {
          display: flex;
          /*height: 32px;*/
          /*flex-wrap: nowrap;*/
          margin-left: 6px;

          ::v-deep {
            .el-button:nth-of-type(1) {
              border: 1px solid #1890ff;
              border-right: 1px solid transparent;
            }

            .el-button:nth-of-type(2) {
              border: 1px solid #1890ff;
              border-left: 1px solid transparent;
            }

            .el-button:nth-of-type(2)::before {
              content: "";
              z-index: 2;
              position: absolute;
              width: 1px;
              height: 16px;
              top: 25%;
              left: -1px;
              bottom: 0;
              background-color: #1890ff;
            }
          }

          .el-btn-style {
            color: #1890ff;
          }
        }

        .option-dropdown {
          ::v-deep {
            .el-button {
              /*padding: 0 2px 0 10px;*/
              padding-right: 2px;
              padding-left: 10px;
              border: 1px solid #1890ff;
            }
          }

          .option-button {
            /*height: 32px;*/

            * {
              color: #1890ff;
              margin: 0 2px;
            }

            i:nth-child(1) {
              font-size: 18px;
            }

            span {
              font-size: 12px;
            }
          }

          .dropdown-line-wrapper {
            .dropdown-line {
              line-height: 28px;
              height: 28px;
              text-align: center;
              color: #1890ff;
            }
          }
        }

        .show-all {
          display: flex;
          flex-wrap: nowrap;
          height: 32px;
          line-height: 32px;
          margin: 0 0 0 8px;

          span {
            margin-left: 6px;
          }
        }
        /*.show-all::after {*/
          /*content: "";*/
          /*z-index: 2;*/
          /*position: absolute;*/
          /*width: 0.8px;*/
          /*height: 16px;*/
          /*top: 25%;*/
          /*right: 169px;*/
          /*background-color: #dcdfe6;*/
        /*}*/

        /*.header-icon-wrapper::after {*/
          /*content: "";*/
          /*z-index: 2;*/
          /*position: absolute;*/
          /*width: 1px;*/
          /*height: 16px;*/
          /*top: 25%;*/
          /*right: 52px;*/
          /*background-color: #dcdfe6;*/
        /*}*/

        .header-icon-wrapper {
          white-space: nowrap;
          cursor: pointer;
          line-height: 32px;
          margin-left: 12px;
          span {
            margin-left: 6px;
          }
        }

        .option-button {
          margin-left: 4px;
          // margin-bottom: 0.2rem;
          /*height: 32px;*/
        }

        .option-excel-export {
          margin-left: 0.2rem;
          width: 4.6rem;
          padding-left: 0.6rem;
        }

        /*input 标签 type="file" 时的样式*/

        .option-excel-import {
          margin-left: 0.2rem;
          /*position: relative;*/
          display: inline-block;
          background: #409eff;
          border: 1px none #99d3f5;
          border-radius: 4px;
          padding: 1px 12px 5px 5px;
          overflow: hidden;
          color: #fff;
          text-decoration: none;
          text-indent: 0;
          line-height: 20px;

          span {
            position: relative;
            color: #fff;
            top: 0.29rem;
            left: 0.2rem;
          }

          input {
            position: absolute;
            font-size: 0.1rem;
            z-index: 9;
            height: 2rem;
            width: 4.4rem;
            left: 9.4rem;
            top: 0;
            opacity: 0;
          }
        }

        .option-excel-import:hover {
          background: #66b1ff;
          border-color: #78c3f3;
          color: #004974;
          text-decoration: none;
        }
      }
    }

    .table-header-right-wrapper {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      justify-content: flex-end;
      flex-grow:1;
      /*flex-direction: row;*/
      /*justify-content: flex-end;*/

      .option-input {
        margin-left: 8px;
      }

      .options-search-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-end;
        /*width: 460px;*/
        // margin-bottom: 0.2rem;
        position: relative;
        /*right: 1rem;*/

        .option-row {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          justify-content: flex-end;
          // margin: 0.1rem 0;
        }
      }

      /*.import-export-wrapper {*/
      /*::v-deep {*/
      /*.el-button {*/
      /*border: 1px solid #1890ff;*/
      /*}*/

      /*.el-button--mini,*/
      /*.el-button--mini.is-round {*/
      /*padding: 2px 1px;*/
      /*}*/
      /*}*/

      /*.option-button {*/
      /*width: 4.8rem;*/
      /*height: 32px;*/

      /** {*/
      /*color: #1890ff;*/
      /*margin: 0 2px;*/
      /*}*/

      /*i:nth-child(1) {*/
      /*font-size: 18px;*/
      /*}*/

      /*span {*/
      /*font-size: 12px;*/
      /*}*/
      /*}*/
      /*}*/
    }

    /*搜索功能栏*/
  }

  /*表格栏*/

  .table-container {
    overflow: auto;

    .column-setting {
      font-size: 1.5rem;
      cursor: pointer;
      color: #353b48;
    }

    .column-setting:hover {
      color: #00a8ff;
    }
  }

  /*分页功能栏*/

  .page-container {
    margin-top: 1rem;
  }
}
</style>
<style lang="less" scoped>
.search-show {
  animation: search-show-animation 0.2s linear;
  animation-fill-mode: forwards;
}

@keyframes search-show-animation {
  0% {
    visibility: visible;
    opacity: 0;
    height: 0rem;
    /*transform: scale(0);*/
  }
  100% {
    opacity: 1;
    height: 2rem;
    /*transform: scale(1);*/
  }
}

.search-hide {
  animation: search-hide-animation 0.2s linear;
  animation-fill-mode: forwards;
}

@keyframes search-hide-animation {
  0% {
    opacity: 1;
    height: 2rem;
    /*transform: scale(0);*/
  }
  100% {
    visibility: hidden;
    opacity: 0;
    height: 0rem;
    /*transform: scale(1);*/
  }
}

.up-down-arrow-container {
  display: flex;
  flex-direction: row;

  .down-arrow {
    transform: rotateZ(-90deg);
    cursor: pointer;
  }

  .up-arrow {
    transform: rotateZ(90deg);
    cursor: pointer;
  }
}

.up-down-arrow-container:hover {
  color: #00a8ff;
}
</style>

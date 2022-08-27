<template>
  <el-dialog id="tm-container" :visible.sync="show" :show-close="false" :close-on-press-escape="false"
             :modal="modalShow"
             :close-on-click-modal="false" width="80%">
    <!--=========内层Dialog===start====-->
    <el-dialog :visible.sync="innerShow" :show-close="false" :close-on-press-escape="false"
               :close-on-click-modal="false" append-to-body width="30%">
      <div slot="title" style="color:#f60;text-align:center">
        <Icon type="ios-happy" style="font-size: 1rem;margin-bottom:0.3rem;margin-right: 1rem"></Icon>
        <span style="font-size: 1rem;">{{ innerTitle }}</span>
      </div>
      <div class="message-container">
        {{ innerMessage }}
      </div>
      <div slot="footer" class="dialog-footer">
        <Button type="error" @click="handleInnerCancel">取消</Button>
        <Button type="primary" @click="handleInnerConfirm" style="margin-left: 1rem">确定</Button>
      </div>
    </el-dialog>
    <!--=========内层Dialog===end====-->
    <div slot="title" style="text-align:center;
    border-bottom:1px solid #c4c4c4;
  height: 60px;
  margin:-20px -20px -10px -20px;
  padding-left: 25px;
  padding-top:19px;">
      <!--<Icon type="ios-eye" style="font-size: 1rem;margin-bottom:0.3rem;margin-right: 1rem"></Icon>-->
      <span style="font-size: 16px;
  line-height:22px;
  font-weight: bolder;
  font-family: 微软雅黑,serif;">{{ title }}</span>
    </div>
    <!--表格-->
    <div class="table-container">
      <!--搜索-->
      <div class="div-options">
        <!-- 搜索输入栏 -->
        <Select v-if="isShowSearch && hasSearchInputSelect" class="select-column optionSelect"
                v-model="tableConfig.selectSearchColumn"
                :placeholder="tableConfig.selectSearchColumnPlaceholder">
          <Option v-for="(item, index) in tableConfig.searchColumnSelections" v-if="item.key !== 'action'" :key="index"
                  :value="item.key">{{ item.title }}
          </Option>
        </Select>
        <Select v-if="isShowSearch && hasSearchTypeSelect" class="select-column optionSelect"
                v-model="searchTypeConfig.value"
                :placeholder="searchTypeConfig.placeholder">
          <Option
            v-for="(item, index) in searchTypeConfig.selections"
            :key="index"
            :value="item.key">{{ item.title }}
          </Option>
        </Select>
        <Input v-if="isShowSearch && hasSearchInput" v-model="tableConfig.search" clearable
               :placeholder="tableConfig.searchPlaceholder"
               class="optionInput" @on-enter="handleSearchEnter"/>

        <Button v-if="isShowSearch && hasSearchButton" class="optionButton" type="primary" shape="circle"
                icon="ios-search"
                @click="handleSearchEnter"/>

        <el-button v-if="hasSelectClearButton" type="warning" class="clearButton" size="mini" round
                   @click="handleClearSelected">清空所有勾选
        </el-button>
      </div>


      <!--表格-->
      <Table border :loading="tableConfig.loading" :columns="tableConfig.columns" :data="tableConfig.pageData"
             :highlight-row="tableHighlightRow"
             @on-current-change="handleTableOnCurrentHighlightRowChange"
             @on-row-dblclick="handleTableOnRowDbclick"
             @on-select="handleTableSelectRow"
             @on-select-cancel="handleTableSelectRowCancel"
             @on-select-all="handleTableSelectRowAll"
             @on-select-all-cancel="handleTableSelectRowAllCancel"
             style="width:100%;height:100%;">
        <template slot-scope="{ row }" slot="action">
          <Button type="error" size="small" :disabled="false" @click="deleteRow(row)">
            移除
          </Button>
        </template>
      </Table>
      <!-- 分页 -->
      <Page style="margin-top:10px;"
            :total="serverPage?tableConfig.countTotal:tableConfig.filterData.length"
            :show-total="true"
            :current="tableConfig.curPage" show-sizer
            align="center"
            :show-elevator="serverPage"
            :page-size="tableConfig.pageSize"
            :page-size-opts="tableConfig.pageSizeOpts"
            class="common-page-style"
            @on-change="changeCurrentPage" @on-page-size-change="changPageSize"/>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="error" @click="handleCancel">{{ cancelLabel }}</el-button>
      <el-button type="primary" @click="handleConfirm" style="margin-left: 1rem">{{ confirmLabel }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {noRepeatForObjectArray} from '@/utils/index'
  import {getFilterArray} from "@/utils/filterUtils"

  export default {
    name: "table-modal",
    props: {
      // 是否显示搜索栏位
      isShowSearch: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 后台分页开关，开启后，每次点击查询、页码跳转，都将回调给父组件，调用父组件中写好的请求后台数据功能
      serverPage: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 表格标记：可以为此组件设置唯一标识，可以满足一些特殊需求，比如每个页签下存放一个表格，通过此标记识别不同页签下的表格
      tableTag: {
        type: String,
        default() {
          return ''
        }
      },
      show: {
        type: Boolean,
        default() {
          return false
        }
      },
      modalShow: {
        type: Boolean,
        default() {
          return true
        }
      },
      innerShow: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 是否开启点击行高亮功能，开启后每点击一行都会激活 handleTableOnCurrentHighlightRowChange() 函数
      tableHighlightRow: {
        type: Boolean,
        default() {
          return false
        }
      },
      title: {
        type: String,
        default() {
          return '查阅'
        }
      },
      innerTitle: {
        type: String,
        default() {
          return '提交'
        }
      },
      innerMessage: {
        type: String,
        default() {
          return '确定要提交数据吗？'
        }
      },
      // 作为表格数据唯一识别的字段名（即 属性 key）
      tableUniKey: {
        type: String,
        default() {
          return 'id'
        }
      },
      // 搜索输入文本框
      hasSearchInput: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 搜索输入文本框的字段下拉选择框
      hasSearchInputSelect: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 类型输入框 是否显示
      hasSearchTypeSelect: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 搜索按钮的显示
      hasSearchButton: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 类型输入框配置属性
      searchTypeConfig: {
        type: Object,
        default() {
          return {
            value: '',
            placeholder: '',
            selections: [
              {
                key: '',
                title: ''
              }
            ]
          }
        }
      },
      // 清空勾选 按钮
      hasSelectClearButton: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 是否含有 操作 列
      hasActionColumn: {
        type: Boolean,
        default() {
          return true
        }
      },
      // 是否含有 勾选 列
      hasSelectColumn: {
        type: Boolean,
        default() {
          return false
        }
      },
      cancelLabel: {
        type: String,
        default() {
          return '取消'
        }
      },
      confirmLabel: {
        type: String,
        default() {
          return '确定'
        }
      },
    },
    data() {
      return {
        // 当前勾选状态的所有数据
        selectedRows: [],
        // 开启多行勾选列功能时，记录每次显示对话框初始勾选行的 id数组
        // 数组中的成员必须与 tableUniKey 对应，即 tableData[n][tableUniKey]
        idArray: [],
        isInit: true,
        tableConfig: {
          loading: false,
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
          countTotal: 0,  // 数据总行数，后台分页时使用
          curPage: 1,
          pageSize: 8, // 每页最多显示行数`
          pageSizeOpts: [2, 4, 6, 8, 50],
          search: '', // 输入的搜索名称
          searchPlaceholder: '请输入', // 搜索输入栏的提示
          // 单选下拉框的选择内容，决定搜索栏位的搜索内容对应的 列名 key
          selectSearchColumn: '',
          searchColumnSelections: [
            // {
            //   key: '1',
            //   title: 'name'
            // }
          ], // 搜索栏边上的类型下拉框
          // 单选下拉框的未选择任何内容时的提示内容
          selectSearchColumnPlaceholder: '请选择'
        }
      }
    },
    mounted() {
      // // 下拉框默认选择的内容
      // this.tableConfig.selectSearchColumn = this.tableConfig.columns[0].key

      // 绘制表格数据
      // this.drawTableData()

      // // 执行分页算法
      // this.pageDataLogic()
    },
    methods: {
      // 绘制表格数据
      drawTableData(columns, tableData) {
        // let isInit = false
        // if (!this.tableConfig.columns || this.tableConfig.columns.length < 1) {
        //   isInit = true
        // }

        // 为每个内容列都设置 resizable = true，即开启允许用户拖拽列宽
        columns.map(item => {
          item['resizable'] = true
        })

        this.tableConfig.columns = []
        this.tableConfig.data = []
        const selColumn = this.hasSelectColumn ? [{
          title: "",
          key: 'selection',
          type: 'selection',
          width: 40,
          align: 'center',
          fixed: 'left'
        }] : []
        const selAction = this.hasActionColumn ? [{
          title: "操作",
          key: "action",
          slot: "action",
          width: 80,
          align: "center",
          fixed: 'right'
        }] : []

        // 列配置项
        this.tableConfig.columns = [
          {
            title: "",
            key: 'index',
            type: 'index',
            width: 40,
            align: 'center',
            fixed: 'left'
          },
          ...selColumn,
          ...columns.filter(col => col.key !== 'index' && col.key !== 'selection' && col.key !== 'action'),
          ...selAction
        ]

        this.tableConfig.data = [...tableData]

        // 与 勾选行 数据记录 进行对比查找，根据 id 查找相同项，将与记录中对于的勾选行 设置为勾选状态
        this.setSelectedRows()

        // 根据分页方式，执行相应的分页逻辑
        if (this.serverPage) {
          // 后台分页算法
          this.serverPageDataLogic()
        } else {
          // 执行分页算法
          this.pageDataLogic()
        }
      },

      // 与 vuex 勾选行 数据记录 进行对比查找，根据 id 查找相同项，将与记录中对于的勾选行 设置为勾选状态
      setSelectedRows() {
        // 设置默认勾选行
        this.setInitSelectedRows()
        // 先从记录中获取当前所有勾选行
        let vxSelRows = [...this.selectedRows]
        // 与当前数据进行查找对比，将与记录中对于的勾选行 设置为勾选状态
        let tableDataTmp = [...this.tableConfig.data]
        tableDataTmp.map(row => {
          const findIndex = vxSelRows.findIndex(selRow => selRow[this.tableUniKey] === row[this.tableUniKey])
          if (findIndex !== -1) {
            // 找到与记录中的相同项，设置为勾选状态的数据
            row._checked = true
          }
        })

        this.tableConfig.data = []
        this.tableConfig.data = [...tableDataTmp]
      },

      // 设置默认勾选行
      setInitSelectedRows() {
        // console.log('设置默认勾选行' + JSON.stringify(this.idArray))
        // console.log('设置默认勾选行' + JSON.stringify(this.tableUniKey))
        // console.log('设置默认勾选行' + JSON.stringify(this.tableConfig.data))
        // if (!this.idArray) {
        //   return
        // }
        // const selRows =this.tableConfig.data.filter(row=>this.idArray.findIndex(item=>String(item)===row[this.tableUniKey]) !== -1)
        let selRows = []
        this.tableConfig.data.map(row => {
          const findIndex = this.idArray.findIndex(idItem => String(idItem) === String(row[this.tableUniKey]))
          if (findIndex !== -1) {
            // 找到与记录中的相同项，设置为勾选状态的数据
            selRows.push(row)
          }
        })

        // 只进行追加和去重，这里不会对选择行记录进行移除，为了保证每次切换页码时，能够设置父组件中传入的勾选项
        const newSelRows = [...this.selectedRows, ...selRows]
        this.selectedRows = [...noRepeatForObjectArray(newSelRows, this.tableUniKey, false)]
        // console.log('设置默认勾选行' + JSON.stringify(this.selectedRows))
      },

      // 后台分页算法
      serverPageDataLogic() {
        // 后台分页，那么请求的必定时当前页数据，所以直接传递到当前页数据变量中即可
        this.tableConfig.pageData = [...this.tableConfig.data]  // 清空 表格当前页数据数组
        // 后台分页，那么请求到的数据也一定是根据当前搜索内容所得的数据，所以也直接传递即可
        this.tableConfig.filterData = [...this.tableConfig.data]

      },

      // 分页算法
      pageDataLogic() {
        // 根据当前 pageSize 分配当前页数据
        this.tableConfig.pageData = []  // 清空 表格当前页数据数组

        // 根据搜索内容进行处理的 过滤算法
        this.tableConfig.filterData = [...getFilterArray(this.tableConfig.data, this.tableConfig.selectSearchColumn, this.tableConfig.search)]

        //** 分页算法
        // 当前页的开始行索引 = （当前页码 - 1）* 当前页最大行数
        const startIndex = (this.tableConfig.curPage - 1) * this.tableConfig.pageSize
        // 当前页的结束行索引 = 当前页码 * 当前页最大行数 - 1
        let endIndex = this.tableConfig.curPage * this.tableConfig.pageSize - 1
        // console.log(`endIndex=${endIndex}`)
        // 如果计算所得的结束行索引 超出 表格数据的剩余数量，即最后一页的剩余行数 不足 当前页最大行数，
        // 则 结束行的索引 = 表格数据的总长度 - 1
        endIndex = endIndex > (this.tableConfig.filterData.length - 1) ? (this.tableConfig.filterData.length - 1) : endIndex

        // console.log('========================================')
        // console.log(`startIndex=${startIndex}`)
        // console.log(`endIndex=${endIndex}`)
        // console.log(`this.tableConfig.filterData=${JSON.stringify(this.tableConfig.filterData)}`)
        // console.log('========================================')

        for (let i = startIndex; i <= endIndex; i++) {
          // 根据上面定好的行索引，将表格数据数组 分配到 表格当前页数据数组 中
          this.tableConfig.pageData.push(this.tableConfig.filterData[i])
        }
      },

      // 搜索栏回车事件
      handleSearchEnter() {
        // 根据分页方式，执行相应的分页逻辑
        if (this.serverPage) {
          // 请求后台数据，刷新表格
          this.requestTablePageData(this.tableTag, this.tableConfig.curPage, this.tableConfig.pageSize)
        } else {
          // 执行分页算法
          this.pageDataLogic()
        }
      },

      // 后台分页时， 请求后台表格数据
      requestTablePageData(tableTag, curPage, pageSize) {
        // 后台分页，父组件 实现函数 requestTablePageData(tableTap, curPage, pageSize) 根据当前页 this.tableConfig.curPage 请求后台数据数据
        this.$emit('requestTablePageData', tableTag, curPage, pageSize, this.tableConfig.search, this.tableConfig.selectSearchColumn)
      },

      // 移除行数据
      removeRow(row) {
        let tableData = [...this.tableConfig.data]
        let tableDataTmp = [...tableData]
        // 从记录中进行查找 ID 相同的项，进行移除
        for (const tableRow of tableDataTmp) {
          if (tableRow[this.tableUniKey] === row[this.tableUniKey]) {
            // 移除
            tableData.splice(tableData.findIndex(item => item[this.tableUniKey] === row[this.tableUniKey]), 1)
            // console.log('当前移除的行：' + JSON.stringify(row[this.tableUniKey]))
          }
        }

        this.drawTableData(this.tableConfig.columns, tableData)
      },

      // 行删除按钮点击事件
      deleteRow(row) {
        this.removeRow(row)
        this.$emit('deleteRow', row)
      },

      // 开启 highlight-row 后有效，当表格的当前行发生变化的时候会触发
      handleTableOnCurrentHighlightRowChange(currentRow, oldCurrentRow) {
        this.$emit('OnCurrentHighlightRowChange', currentRow, oldCurrentRow)
      },

      // 双击某一行事件
      handleTableOnRowDbclick(curRow, index) {
        this.$emit('OnRowDbclick', curRow, index)
      },

      // 当前页切换事件
      changeCurrentPage(curPage) {
        this.tableConfig.curPage = curPage
        // 根据分页方式，执行相应的分页逻辑
        if (this.serverPage) {
          // 请求后台数据，刷新表格
          this.requestTablePageData(this.tableTag, this.tableConfig.curPage, this.tableConfig.pageSize)
        } else {
          // 执行分页算法
          this.pageDataLogic()
        }
      },

      // 每页最大行数改变事件
      changPageSize(pageSize) {
        // this.tableConfig.pageData
        // this.tableConfig.data
        // console.log(JSON.stringify(pageSize))
        // console.log(JSON.stringify(this.tableConfig.pageSize))

        // 改变当前记录的pageSize
        this.tableConfig.pageSize = pageSize

        // 根据分页方式，执行相应的分页逻辑
        if (this.serverPage) {
          // 请求后台数据，刷新表格
          this.requestTablePageData(this.tableTag, this.tableConfig.curPage, this.tableConfig.pageSize)
        } else {
          // 执行分页算法
          this.pageDataLogic()
        }
      },

      // 内层Dialog 确定按钮
      handleInnerConfirm() {
        // 将当前表格中的最终数据回调到 父组件中
        this.$emit('innerConfirm', this.tableConfig.columns, this.tableConfig.data, this.selectedRows)
      },

      // 内层Dialog 取消按钮
      handleInnerCancel() {
        this.$emit('innerCancel')
      },

      // 确定按钮
      handleConfirm() {
        this.$emit('confirm', this.tableConfig.columns, this.tableConfig.data, this.selectedRows)
      },

      // 取消按钮
      handleCancel() {
        this.$emit('cancel')
        this.dealSthWhenClose()
      },

      // 对话框关闭时的操作
      dealSthWhenClose() {
        this.tableConfig.curPage = 1
        this.clearSelectedRowsRemember()
      },

      /**
       * 表格勾选操作：在多选模式下有效，选中某一项时触发
       * @param selection 已选项数据
       * @param row 刚选择的项数据
       */
      handleTableSelectRow(selection, row) {
        // 更改勾选值
        let selectedRow = {}
        this.tableConfig.data.map((item, index) => {
          if (item[this.tableUniKey] === row[this.tableUniKey]) {
            item._checked = true
            selectedRow = {...item}
          }
        })

        // console.log('当前勾选行：' + JSON.stringify(selectedRow))
        // 记录当前勾选行数据到 vuex 中
        this.rememberSelectedRows([selectedRow])
      },

      /**
       * 表格勾选操作：在多选模式下有效，取消选中某一项时触发
       * @param selection 已选项数据
       * @param row 刚选择的项数据
       */
      handleTableSelectRowCancel(selection, row) {
        // 更改勾选值
        let cancelRow = {}
        this.tableConfig.data.map((item, index) => {
          if (item[this.tableUniKey] === row[this.tableUniKey]) {
            item._checked = false
            cancelRow = {...item}
          }
        })
        // console.log('当前取消勾选的行：' + JSON.stringify(cancelRow))
        // 从记录当前勾选行数据的 vuex 变量中 移除当前取消勾选的行
        this.removeRememberSelectedRows([cancelRow])
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
              row._checked = true
              item._checked = true
            }
          })
        })

        // 记录当前勾选行数据
        this.rememberSelectedRows(selection)
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
              row._checked = false
              item._checked = false
            }
          })
        })

        // 从记录当前勾选行数据变量中 移除当前取消勾选的行
        this.removeRememberSelectedRows(this.tableConfig.pageData)
      },

      // 记录当前勾选行数据
      rememberSelectedRows(rows) {
        // 先从记录中获取当前所有勾选行，并追加当前勾选的行
        let vxSelRows = [...this.selectedRows, ...rows]
        // 进行数据去重
        vxSelRows = [...noRepeatForObjectArray(vxSelRows, this.tableUniKey, true)]
        // 将新的勾选行数据重新存储到记录中
        this.selectedRows = [...vxSelRows]
      },

      // 从记录当前勾选行数据变量中 移除当前取消勾选的行
      removeRememberSelectedRows(rows) {
        // 先从记录中获取当前所有勾选行，并追加当前勾选的行
        let vxSelRows = [...this.selectedRows]
        let vxSelRowsTmp = [...vxSelRows]
        // 从记录中进行查找 ID 相同的项，进行移除
        for (const csRow of rows) {
          vxSelRowsTmp.map((row, index) => {
            if (row[this.tableUniKey] === csRow[this.tableUniKey]) {
              // 移除
              vxSelRows.splice(vxSelRows.findIndex(item => item[this.tableUniKey] === csRow[this.tableUniKey]), 1)
              // console.log('当前取消勾选的行：' + JSON.stringify(csRow[this.tableUniKey]))
            }
          })
        }
        // console.log('移除取消勾选行后的记录：' + JSON.stringify(vxSelRows))
        // 将新的勾选行数据重新存储到记录中
        this.selectedRows = [...vxSelRows]
      },

      // 清除所有勾选行记录
      clearSelectedRowsRemember() {
        // 将空数组重新存储到记录中
        this.selectedRows = []
      },

      // 设置初始勾选行的 idArray(提供给父组件调用)
      setInitSelectedIdArray(idArray) {
        this.idArray = idArray
      },

      // 清空勾选 按钮事件
      handleClearSelected() {
        this.idArray = []
        this.clearSelectedRowsRemember()
        // 请求后台数据，刷新表格
        this.requestTablePageData(this.tableTag, this.tableConfig.curPage, this.tableConfig.pageSize)
      }

    }
  }
</script>

<style lang='less' scoped>
  @optionItemMargin: 0.2rem;

  #tm-container {
    .table-container {
      .div-options {
        display: flex;
        flex-direction: row;
        justify-content: left;
        flex-wrap: wrap;
        margin-bottom: 0.8rem;

        .optionInput {
          flex: 16%;
          max-width: 16%;
          margin-right: @optionItemMargin;
        }

        .optionSelect {
          flex: 16%;
          max-width: 16%;
          margin-right: @optionItemMargin;
        }

        .optionButton {
          margin-right: @optionItemMargin;
        }

        .clearButton {
          margin-right: @optionItemMargin;
          margin-bottom: @optionItemMargin;
        }

        // 对不同尺寸的屏幕设定不同的布局，实现多屏自适应
        @media screen and (max-width: 800px) {
          .optionInput {
            flex: 100%;
            max-width: 100%;
            margin-right: @optionItemMargin;
            margin-bottom: @optionItemMargin;
          }

          .optionSelect {
            flex: 60%;
            max-width: 60%;
            margin-right: @optionItemMargin;
            margin-bottom: @optionItemMargin;
          }

          .optionButton {
            margin-right: @optionItemMargin;
            margin-bottom: @optionItemMargin;
          }

          .clearButton {
            margin-right: @optionItemMargin;
            margin-bottom: @optionItemMargin;
          }
        }
      }
    }
  }

</style>

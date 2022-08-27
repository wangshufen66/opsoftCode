<!--
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @LastEditors: jsjzh
 * @Date: 2019-02-13 14:50:02
 * @LastEditTime: 2019-03-06 18:17:03
 * @Description: 组件列表头部的展示框集
 -->
<template>
  <div class="default-framework-container">
    <!--上面的根据宽度占比[过滤选择]组件的方式 更改为 通过组件名称过滤选择-->
    <!--<div v-show="false" class="select-col-box">-->
    <!--<div class="box-row" v-for="(row, rowIndex) in box" :key="rowIndex">-->
    <!--<div-->
    <!--class="col-item"-->
    <!--:class="{ active: col.active }"-->
    <!--:style="previewColStyle({ width: col.placeholderCol, height: col.height }, 100, 1)"-->
    <!--v-for="(col, colIndex) in row.col"-->
    <!--:key="colIndex"-->
    <!--@click="handleClickBoxCol(col)"-->
    <!--&gt;{{col.placeholderCol}}</div>-->
    <!--</div>-->
    <!--</div>-->
    <!--TODO:新过滤功能——根据组件名称过滤-->
    <div class="filter-container">
      <div class="demo-input-suffix" style="display: flex;justify-content: flex-end;">
        <el-input
          v-model="filterComponentNameInput"
          placeholder="请输入内容">
          <i slot="prefix" class="el-input__icon el-icon-search"/>
        </el-input>
        <el-button
          v-waves
          style="float: right;margin-left: 2rem;border-radius: 5rem;width: 108px;text-align: center;"
          @click="refreshComponentListData"
        >刷新
        </el-button>
      </div>
    </div>

    <!--组件列表-->
    <div class="components-container">
      <div
        v-for="(component, componentIndex) in getFilterComponents(filterComponentNameInput)"
        :key="componentIndex"
        class="components-row"
      >
        <div class="components-infos-box">
          <div>名称：{{ component.label }}</div>
          <!--<div>height: {{component.height}}</div>-->
          <!--<div>col: {{component.col}}</div>-->
        </div>
        <div class="preview-box">
          <div
            :style="previewColStyle({ width: component.col, height: component.height }, 100, 3, 24,{backgroundImage: component.previewImage ? `url(${component.previewImage})` : null})"
            class="preview"
            draggable="true"
            @dragstart="handleDragCol($event, component)"
            @dragend="hanDragColEnd($event, component)"
          />
        </div>
        <!--废弃下面的输入功能-->
        <!--<div class="components-controller-bar">-->
        <!--<el-input size="mini" :placeholder="component.label" v-model="component.title"/>-->
        <!--</div>-->
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves'
import colStyle from './mixins/methods/col-style'
import { mixinData } from '@/utils'
import { chartType } from '@/global/chartType'
// getcomponentinfo getreportcomponentinfo
import { queryComponentList } from '@/api/chartConfig'

export default {
  name: 'ChartsWindow',
  directives: { waves },
  mixins: [colStyle],
  data() {
    return {
      chartType: chartType(),
      filterComponentNameInput: '',
      box: [
        {
          col: [
            { active: false, height: 30, placeholderCol: 4.8 },
            { active: false, height: 30, placeholderCol: 4.8 },
            { active: false, height: 30, placeholderCol: 4.8 },
            { active: false, height: 30, placeholderCol: 4.8 },
            { active: false, height: 30, placeholderCol: 4.8 }
          ]
        },
        {
          col: [
            { active: false, height: 50, placeholderCol: 16 },
            { active: false, height: 50, placeholderCol: 8 }
          ]
        },
        {
          col: [
            { active: false, height: 50, placeholderCol: 12 },
            { active: false, height: 50, placeholderCol: 12 }
          ]
        },
        {
          col: [
            { active: false, height: 50, placeholderCol: 8 },
            { active: false, height: 50, placeholderCol: 8 },
            { active: false, height: 50, placeholderCol: 8 }
          ]
        },
        { col: [{ active: false, height: 50, placeholderCol: 24 }] }
      ],
      initComponentDatas: [],
      componentDatas: []
    }
  },
  mounted() {
    // const data = { title: '' }
    queryComponentList().then(res => {
      res = res.data
      // 接收服务端的组件数据
      const data = this.receiveServerComponentsData(res)
      // console.log(JSON.stringify(res))

      this.componentDatas = data.map(component => mixinData(component, data))
      this.initComponentDatas = data.map(component =>
        mixinData(component, data)
      )
    })
  },
  methods: {
    // 组件列表过滤功能函数
    getFilterComponents(search) {
      // console.log(JSON.stringify(this.componentDatas))
      // let search = this.filterComponentNameInput;
      let searchVal = []// 搜索后的数据
      if (search) {
        searchVal = this.componentDatas.filter(function(item) {
          return Object.keys(item).some(function(key) {
            // 搜索所有的内容
            // return String(item[key]).toLowerCase().indexOf(search) > -1;
            // 只搜索问题内容（某一个key）（这里按组件名搜索）
            return String(item['label']).toLowerCase().indexOf(search.toLowerCase()) > -1
          })
        })
        return searchVal
      } else { // 未输入内容，则搜索所有内容
        return this.componentDatas
      }
    },
    // TODO:待开发刷新功能
    refreshComponentListData() {

    },
    handleDragCol(event, col) {
      col.title = col.title || col.label
      this.$emit('drag-col-start', event, col)
    },
    hanDragColEnd(event, col) {
      this.$emit('drag-col-end', event, col)
    },
    handleChangeSelectComponent(event, component) {
      const previewImage = component.types.find(
        type => type.value === component.selectValue
      ).previewImage
      if (previewImage) {
        component.previewImage = previewImage
      }
    },
    handleClickComType(col) {
      this.componentDatas = this.initComponentDatas.filter(
        item => item.col === col.placeholderCol
      )
    },
    handleClickBoxCol(col) {
      this.box.forEach(row => {
        row.col.forEach(col => {
          col.active = false
        })
      })
      col.active = true
      this.handleClickComType(col)
    },
    // 将服务端的组件列表参数 转换成 这里用于配置的参数
    serverComponentsDataToConfig(cmpList) {
      const cmpDatas = []
      cmpList.forEach((item, index) => {
        const cmpItem = {
          'refreshSec': item.cmpRefSec,
          'componentType': item.cmpType,
          'label': item.cmpName,
          'componentKey': item.id,
          'componentName': '', // 这是对应VUE组件的后缀名称(预览中 绘制组件 的关键)
          'api': item.cmpImpRoute,
          'method': 'get',
          'dataKey': '',
          'col': 24,
          'height': 250,
          'previewImage': ''
        }

        cmpItem.componentName = this.chartType[item.cmpType].name // 这是对应VUE组件的后缀名称(预览中 绘制组件 的关键)
        cmpItem.previewImage = this.chartType[item.cmpType].previewImage

        // 加入集合
        cmpDatas.push(cmpItem)
      })

      return cmpDatas
    },

    // 接收处理服务端的组件列表参数
    receiveServerComponentsData(res) {
      // 接收到模板布局数据
      if (res.errno !== 0) { // 访问失败
        // this.openNotificationError(res.errmsg)
        return []
      } else { // 访问成功
        if (res.data.kbComponentList == null || res.data.kbComponentList.length < 1) {
          // this.openNotificationWarning("没有查询到任何组件")
          return []
        } else {
          // 将服务端的组件列表参数 转换成 这里用于配置的参数
          return this.serverComponentsDataToConfig(res.data.kbComponentList)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../CustomReport/css/variable";

.default-framework-container {
  @include default-flex;
  flex-wrap: wrap;
  flex-flow: column;
  height: 100%;
  padding: 2rem 1rem;

  .select-col-box {
    @include default-flex;
    @include flex-full;
    flex-wrap: wrap;
    padding: 1rem 6rem;
    .box-row {
      @include default-flex;
      @include flex-full;
      margin: 0.5rem 0;
      .col-item {
        @include default-col-style;
        @include default-col-layout;
        @include cur-p;
        &.active {
          @include default-col-border;
          border-color: $active-color-1;
          color: $active-color-1;
        }
      }
    }
  }

  .components-container {
    @include default-flex;
    width: 100%;
    flex: 1;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: column;
    padding: 0.5rem;
    overflow: auto;
    & .components-row {
      @include default-flex;
      @include default-col-radius;
      @include boxShadow;

      /*边框内发光效果*/
      border: 1px none $deep-color-2;
      box-shadow: 2px 0px 8px 1px #bbcbf8 inset;

      flex-flow: wrap;
      padding: 1rem;
      width: 100%;
      min-height: 200px;
      margin: 1rem 0;
      & .components-infos-box {
        width: 100%;
      }
      & .preview-box {
        @include default-flex;
        width: 100%;
        & .preview {
          @include cur-all;
          @include default-background-img;
        }
      }
    }
    & .components-controller-bar {
      flex: 1;
    }
  }
}
</style>


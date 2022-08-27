<!--
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @LastEditors: jsjzh
 * @Date: 2019-02-22 09:31:45
 * @LastEditTime: 2019-03-06 18:16:35
 * @Description: 左侧添加布局的框
 -->
<template>
  <div class="layout-editor-container">
    <div class="editor-box">
      <div class="editor-infos-box">
        <div class="infos">
          <span class="limit">limit-total: 24</span>
          <span class="real">real-total: {{ PAGE_realTotal }}</span>
        </div>
        <div class="controller-btn">
          <!--TODO:高度值：从选择值方式 更改为 灵活输入方式-->
          <!--<el-radio-group v-model="inputsHeight" @change="handleChangeColHeight" size="mini">-->
          <!--<el-radio-button :label="100"/>-->
          <!--<el-radio-button :label="250"/>-->
          <!--</el-radio-group>-->
          <el-input
            :maxlength="3"
            :minlength="1"
            :max="heightMax"
            :min="heightMin"
            v-model="inputsHeight"
            type="number"
            placeholder="请输入高度值"
            @change="handleChangeInputHeight"
          />
          <i class="el-icon-more" title="average-layout" @click="handleAverage"/>
          <i class="el-icon-remove" title="remove-layout" @click="handleRemove"/>
          <i class="el-icon-circle-plus" title="add-layout" @click="handleAdd"/>
        </div>
      </div>
      <div class="editor-infos-box suggest">4.8 的组件高度建议为 100，其他组件为 250，该比例显示最为正确</div>
      <div class="editor-inputs-box">
        <div v-for="(ipt, iptIndex) in inputs" :key="iptIndex" class="input-item-box">
          <el-input
            :maxlength="3"
            :minlength="1"
            :max="24"
            :min="1"
            v-model="ipt.value"
            size="mini"
          />
        </div>
      </div>
    </div>
    <div
      class="layout-preview-box"
      draggable="true"
      @dragstart="handleDragRow($event, inputs)"
      @dragend="hanDragRowEnd($event, inputs)"
    >
      <div
        v-for="(ipt, iptIndex) in inputs"
        :key="iptIndex"
        :style="previewColStyle({ width: ipt.value, height: ipt.height })"
        class="preview-item"
      >{{ ipt.value }}</div>
    </div>
    <div class="suggest-layout-box">
      <div class="suggest-layout-title">suggest-layouts</div>
      <div
        v-for="(suggestLayout, suggestLayoutIndex) in suggestLayouts"
        :key="suggestLayoutIndex"
        class="suggest-layout-row"
        draggable="true"
        @dragstart="handleDragRow($event, suggestLayout.cols)"
        @dragend="hanDragRowEnd($event, suggestLayout.cols)"
      >
        <div
          v-for="(col, colIndex) in suggestLayout.cols"
          :style="previewColStyle({ width: col.value, height: col.height })"
          :key="colIndex"
          class="suggest-layout-item"
        >{{ col.value }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import colStyle from '../ChartsWindow/mixins/methods/col-style'

export default {
  name: 'ReportLayoutsWindow',
  mixins: [colStyle],
  data() {
    return {
      inputsHeight: 250,
      heightMax: 2050,
      heightMin: 10,
      inputs: [{ height: 250, value: 24 }],
      suggestLayouts: [
        {
          cols: [
            { height: 100, value: 4.8 },
            { height: 100, value: 4.8 },
            { height: 100, value: 4.8 },
            { height: 100, value: 4.8 },
            { height: 100, value: 4.8 }
          ]
        },
        { cols: [{ height: 250, value: 16 }, { height: 250, value: 8 }] },
        { cols: [{ height: 250, value: 12 }, { height: 250, value: 12 }] },
        {
          cols: [
            { height: 250, value: 8 },
            { height: 250, value: 8 },
            { height: 250, value: 8 }
          ]
        },
        { cols: [{ height: 250, value: 24 }] }
      ]
    }
  },
  computed: {
    PAGE_realTotal() {
      return this.inputs.reduce((pre, curr) => pre + +curr.value, 0)
    }
  },
  methods: {
    handleChangeInputHeight: function() {
      if (this.inputsHeight > this.heightMax) {
        this.inputsHeight = this.heightMax
      } else if (this.inputsHeight < this.heightMin) {
        this.inputsHeight = this.heightMin
      }
      // 让拖拽组件随之改变高度
      this.inputs.forEach(input => (input.height = this.inputsHeight))
    },
    handleDragRow(event, row) {
      this.$emit('drag-row-start', event, row)
    },
    hanDragRowEnd(event, row) {
      this.$emit('drag-row-end', event, row)
    },
    handleChangeColHeight(height) {
      this.inputs.forEach(input => (input.height = height))
    },
    handleAverage() {
      const averageCol = 24 / this.inputs.length
      this.inputs.forEach(input => (input.value = averageCol))
    },
    handleRemove() {
      if (this.inputs.length === 1) {
        this.$msg('1_至少需要一列布局')
        return
      }

      do {
        this.inputs.splice(this.inputs.length - 1, 1)
      } while (24 % this.inputs.length && this.inputs.length >= 1)

      this.handleAverage()
    },
    handleAdd() {
      if (this.inputs.length === 24) {
        this.$msg('1_至多只能有二十四列布局')
        return
      }

      do {
        this.inputs.push({ value: 0, height: this.inputsHeight })
      } while (24 % this.inputs.length && this.inputs.length <= 24)

      this.handleAverage()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../CustomReport/css/variable.scss";

.layout-editor-container {
  @include default-flex;
  flex-wrap: wrap;
  flex-flow: column;
  height: 100%;
  padding: 2rem 1rem;
  & .editor-box {
    @include default-flex;
    @include flex-full;
    flex-wrap: wrap;
    height: 130px;
    & .editor-infos-box {
      @include default-flex;
      @include flex-full;
      justify-content: space-between;
      &.suggest {
        color: $success-color;
      }
      & .infos {
        @include default-flex;
        justify-content: space-around;
        flex: 1;
        & .limit {
          color: $danger-color;
        }
      }
      & .controller-btn {
        @include default-flex;
        @include cur-p;
        @include btn-icon;
        justify-content: space-between;
        flex: 1;
      }
    }
    & .editor-inputs-box {
      @include default-flex;
      @include flex-full;
      justify-content: space-around;
      flex-wrap: wrap;
      & .input-item-box {
        width: 50px;
      }
    }
  }
  & .layout-preview-box {
    @include default-flex;
    @include cur-all;
    @include flex-full;
    height: 100px;
    & .preview-item {
      @include default-col-style;
      @include default-col-layout;
    }
  }
  & .suggest-layout-box {
    @include default-flex;
    @include flex-full;
    flex-wrap: wrap;
    overflow: auto;
    flex: 1;
    & .suggest-layout-title {
      margin-top: 1rem;
      @include btn-icon;
    }
    & .suggest-layout-row {
      @include default-flex;
      @include cur-all;
      @include flex-full;
      margin: 1rem 0;
      & .suggest-layout-item {
        @include default-col-style;
        @include default-col-layout;
      }
    }
  }
}
</style>

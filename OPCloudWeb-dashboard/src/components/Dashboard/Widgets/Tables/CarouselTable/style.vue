<template>
  <div>
    <div v-show="tab === 1">
      <!-- 基础设置 -->
      <basic-settings :activeElement="activeElement" />

      <div class="panel-item-new">
        <div @click="isShowHead = !isShowHead" class="panel-item-title">设置项<i :class="isShowHead ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" class="panel-title-arrow"></i></div>
        <div v-show="isShowHead" class="pane l-item-new-set">

          <div class="panel-row">
            <div class="panel-label">奇数行背景色</div>
            <div class="panel-colormsg">{{ activeElement.oddRowBGC }}</div>
            <div class="panel-colorpick">
              <el-color-picker v-model="activeElement.oddRowBGC" show-alpha size="small" />
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">偶数行背景色</div>
            <div class="panel-colormsg">{{ activeElement.evenRowBGC }}</div>
            <div class="panel-colorpick">
              <el-color-picker v-model="activeElement.evenRowBGC" show-alpha size="small" />
            </div>
          </div>

          <div v-show="activeElement.showTh" class="panel-row">
            <div class="panel-label">表头高度</div>
            <div class="panel-value">
              <input v-model="activeElement.thHeight" type="number">
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">轮播时间</div>
            <div>
              <input v-model="activeElement.autoToolTipTime"> ms
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">每列占比</div>
            <div class="panel-value panel-basicTable-tbPercent-cont">
              <span class="panel-basicTable-inp-span" v-for="(item, index) in activeElement.tbPercent" :key="index">
                <input class="panel-basicTable-inp" v-model.number="activeElement.tbPercent[index]">{{index === activeElement.tbPercent.length - 1 ? '' : ' ： '}}
              </span>
            </div>
          </div>
          <div class="panel-row">
            <div class="panel-label">边的宽度</div>
            <div class="panel-value">
              <input v-model="activeElement.borderWidth" type="number" min="0">
            </div>
          </div>
        </div>
      </div>

      <div class="panel-item-new">
        <div @click="isShowTable = !isShowTable" class="panel-item-title">表格<i :class="isShowTable ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" class="panel-title-arrow"></i></div>
        <div v-show="isShowTable" class="panel-item-new-set">

          <!-- <div class="panel-row">
            <div class="panel-label">对齐方式</div>
            <div class="panel-value">
              <el-radio-group class="panel-radio-cont" v-model="activeElement.tbAlign" size="small">
                <el-radio label="left">居左</el-radio>
                <el-radio label="center">居中</el-radio>
                <el-radio label="right">居右</el-radio>
              </el-radio-group>
              <div class="panel-setcolor-item radioscont">
              </div>
            </div>
          </div> -->

          <!-- <div class="panel-row">
            <div class="panel-label">边的颜色</div>
            <div class="panel-colormsg">{{ activeElement.borderColor }}</div>
            <div class="panel-colorpick">
              <el-color-picker v-model="activeElement.borderColor" show-alpha size="small" />
            </div>
          </div> -->
        </div>
      </div>
    </div>
    <div v-show="tab === 2">
      <data-settings :activeElement="activeElement" />
    </div>
    <div v-show="tab === 3">
      <div class="panel-row">
        <div class="panel-label">行数</div>
        <div>
          <input v-model="activeElement.dataLength" type="number" min="1">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BasicSettings from '../../CommonModule/BasicSettings';
import axios from 'axios';
import DataSettings from '../../CommonModule/DataSettings';

export default {
  name: 'CarouselTableStyle',
  components: {
    BasicSettings,
    DataSettings,
  },
  props: ['activeElement', 'tab'],
  data() {
    return {
      isShowHead: true,
      isShowNum: true,
      isShowTable: true,
      dataJSON: JSON.stringify(this.activeElement.dataJSON, null, 2),
      selectStatus: '1',
    };
  },
  methods: {
    addthNumBgColor() {
      let params = {
        property: 'seriesColors',
        data: '#0000ff',
      };
      this.$vpd.commit('ADD_COLOR', params);
    },
    delthNumBgColor(index) {
      let params = {
        property: 'seriesColors',
        data: {
          index: index,
        },
      };
      this.$vpd.commit('DELETE_COLOR', params);
    },
    handleBind() {
      // console.log("取到的值是"+this.selectStatus);
    },
    refreshAPIurl() {
      // API 拉取数据
      let url = this.activeElement.dataAPI;
      axios({
        type: 'get',
        headers: { 'Content-Type': 'application/json' },
        url: url,
      }).then((res) => {
        let data = res.data.data;
        let JSONData = {
          status: 0,
          msg: '',
          data: {
            categories: [],
            series: [],
          },
        };
        for (let i in data) {
          JSONData.data.categories.push(data[i].unit);
          JSONData.data.series.push(data[i].schedule);
        }
        this.$vpd.commit('UPDATE_STATIC_DATA', JSONData);
      });
    },
    inpTime(e) {
      let time = e.target.value;
      let param = {
        name: 'dataAPITime',
        value: time,
      };
      this.$vpd.commit('UPDATE_WIDGET', param);
      // this.refreshData()
    },
    jsonOnMounted(edit) {
      // console.log(edit);
    },
    jsonOnCodeChange(value, event) {
      this.$vpd.commit('UPDATE_STATIC_DATA', JSON.parse(value));
    },
  },
};
</script>
<style scoped>
.panel-basicTable-tbPercent-cont {
  width: 200px;
  display: inline-block;
}
.panel-basicTable-inp-span {
  display: inline-block;
  width: 46px;
}
.panel-basicTable-inp {
  width: 30px;
}
</style>

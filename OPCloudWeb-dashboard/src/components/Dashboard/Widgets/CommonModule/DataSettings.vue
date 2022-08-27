<template>
  <div>
    <div class="panel-item-new">
      <div class="panel-item-title">数据源</div>
      <div class="data-group">
        <div class="radiowrap">
          <div class="data-csv-cont">
            <div>
              <div>
                <el-input type="textarea" :rows="4" placeholder="请输入SQL查询语句" v-model="activeElement.sqlQuery">
                </el-input>
              </div>
              <div style="margin-top:20px;">
                <el-button type="primary" @click="getChartData">获取数据</el-button>
              </div>
              <div style="margin-top:20px;">
                <el-button type="primary" @click="onSetTableColumn">表格列设置</el-button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="columnSettingVisible" title="表格列设置" width="30%">
      <div style="margin: 15px 0;font-size:16px;font-weight:bold">
        请勾选要显示的列
      </div>
      <el-checkbox-group v-model="activeValue">
        <!-- 每一列，去设置对应列的属性 -->
        <div class="column-list" v-for="(item,i) in this.diaSetData" :key="i">
          <el-checkbox :label="item.label">
            <div class="column-item-list">
              <div class="column-item">
                列的字段名称：{{item.prop}}
              </div>

              <!-- <div class="column-item">
                列的显示名称：<el-input style="width:60%" v-model="item.label"></el-input>
              </div> -->
              <!-- <div class="column-item">
                列的宽度：<el-input style="width:60%" v-model="item.width"></el-input>
              </div> -->
            </div>
          </el-checkbox>
        </div>
      </el-checkbox-group>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onClose">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import JsonEditor from './MonacoEditor';
import axios from 'axios';
import vpd from '@/components/Dashboard/Designer/mixins/vpd';
import { getSqlData } from '@/api/dashboard';
export default {
  name: 'WidgetDataSettings',
  components: {
    JsonEditor,
  },
  mixins: [vpd],
  props: ['activeElement'],
  data() {
    return {
      columnSettingVisible: false, //表格设置列弹窗
      activeValue: [], //选中的列
      resultdata: [],
      diaSetData: [],
      hash: this.$route.params.hash,
      // materialList: [],
      csvLoading: true,
      csvTableLoading: false,
      seriesCharts: ['LinesAreaChart', 'RadarChart'], // 取值标签为复选框的图表
    };
  },
  watch: {
    'activeElement.csvHash': function () {},
  },
  computed: {
    dataOrigin() {
      return this.activeElement.dataOrigin;
    },
    csvHash() {
      return this.activeElement.csvHash;
    },
    localData() {
      return JSON.stringify(this.activeElement.staticData, null, 2);
    },
    linkages() {
      return this.$vpd.state.widgets.map(
        (val) =>
          val.linkEnable && val.linkIsMain && { uuid: val.uuid, name: val.name }
      );
    },
  },
  mounted() {
    // this.getMaterialList();
  },
  methods: {
    onClose() {
      this.columnSettingVisible = false;
    },

    onSubmit() {
      console.log(this.activeValue);
      this.activeElement.tbPercent = [];
      for (let n = 0; n < this.activeValue.length + 1; n++) {
        this.activeElement.tbPercent.push(100);
      }
      console.log(this.activeElement.tbPercent);
      this.activeElement.staticData.data = [];
      var newArray3 = [];
      for (let i = 0; i < this.resultdata.length; i++) {
        var newObject = {};
        for (let j = 0; j < this.activeValue.length; j++) {
          newObject[this.activeValue[j]] = this.resultdata[i][
            this.activeValue[j]
          ];
        }
        newArray3.push(newObject);
      }
      for (var key in newArray3) {
        this.activeElement.staticData.data.push(Object.values(newArray3[key]));
      }
      this.activeElement.staticData.header = this.activeValue;
      this.columnSettingVisible = false;
    },
    getChartData() {
      let param = {
        sql: this.activeElement.sqlQuery,
      };
      console.log(param);
      getSqlData(param).then((response) => {
        this.resultdata = response.data;
        this.handleArr(this.resultdata);
      });
    },
    handleArr(newArrey) {
      this.activeElement.staticData.header = [];
      this.activeElement.staticData.data = [];
      this.activeElement.staticData.header = Object.keys(newArrey[0]);
      this.activeElement.tbPercent = [];
      for (
        let n = 0;
        n < this.activeElement.staticData.header.length + 1;
        n++
      ) {
        this.activeElement.tbPercent.push(100);
      }
      for (var key in newArrey) {
        this.activeElement.staticData.data.push(Object.values(newArrey[key]));
      }
    },

    onSetTableColumn() {
      console.log(this.diaSetData);
      this.diaSetData = [];
      Object.keys(this.resultdata[0]).forEach((key) => {
        const newColumn = {
          prop: '',
          label: '',
          width: 'auto',
        };
        // 默认设置成一致 设置列时再修改
        newColumn.prop = newColumn.label = key;
        this.diaSetData.push(newColumn);
      });
      this.columnSettingVisible = true;
    },

    changeJsonCode(value, event) {
      this.$vpd.commit('UPDATE_STATIC_DATA', JSON.parse(value));
    },
    changeTimer(e) {
      const param = {
        name: 'dataRefreshTime',
        value: e.target.value,
      };
      this.$vpd.commit('UPDATE_ACTIVE_ELEMENT', param);
    },

    // getMaterialList() {
    //   axios({
    //     type: 'get',
    //     url: process.env.BASE_API + '/material/titleList',
    //   }).then((res) => {
    //     this.materialList = res.data.data;
    //     this.csvLoading = false;
    //     this.isExistCsv();
    //   });
    // },

    // changeCsvType(id) {
    //   let csvId = this.activeElement.csvHash;
    //   this.getCsvHeader(csvId);
    // },
    // getCsvHeader(csvId) {
    //   let items = this.materialList.filter((item) => {
    //     return item.hash === csvId;
    //   });
    //   let param = {
    //     name: 'csvHeader',
    //     value: items[0].title,
    //   };
    //   this.$vpd.commit('UPDATE_ACTIVE_ELEMENT', param);
    // },
    // isExistCsv() {
    //   if (this.activeElement.csvHash) {
    //     let isExist = this.materialList.find((item) => {
    //       // 判断组件绑定的表格是否还存在
    //       return item.hash === this.activeElement.csvHash;
    //     });
    //     if (!isExist) {
    //       const param = [
    //         {
    //           name: 'csvHash',
    //           value: '该表格已删除',
    //         },
    //         {
    //           name: 'csvSeries',
    //           value: '',
    //         },
    //         {
    //           name: 'csvNum',
    //           value:
    //             Object.prototype.toString.call(this.activeElement.csvNum) ===
    //             '[object Array]'
    //               ? []
    //               : '',
    //         },
    //         {
    //           name: 'csvHeader',
    //           value: [],
    //         },
    //       ];
    //       this.$vpd.commit('UPDATE_DATAS', param);
    //     }
    //   }
    // },
  },
};
</script>
<style>
.column-list {
  display: flex;
  align-items: center;
}
.column-list .column-item-list {
  display: flex;
  align-items: center;
}
.column-list .column-item {
  width: 350px;
}
.api-p {
  font-size: 14px;
}
.panel-wrap .api-btn {
  padding: 0 6px;
}
.el-radio__label {
  font-size: 13px;
}
</style>
<style scoped>
.data-group {
  padding: 0;
}
.data-radio-cont,
.data-group .radioscont {
  padding: 0 15px;
}
.el-select-dropdown__item.selected {
  border: none;
}
.panel-csv-table-cont {
  padding: 10px 20px;
  font-size: 13px;
  color: #606266;
}
.panel-csv-table {
  margin-bottom: 10px;
}
.panel-csv-table th {
  height: 42px;
}
.panel-csv-td {
  text-align: center;
  height: 36px;
}
.form-input:focus,
input:focus[type='text'],
input:focus[type='date'],
textarea:focus {
  box-shadow: none;
}
.panel-csv-table-th1,
.panel-csv-table-td1 {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.data-csv-cont {
  margin: 10px 0 20px;
}
</style>

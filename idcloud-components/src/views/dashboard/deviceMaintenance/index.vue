<template>
  <div class="container">
    <dashboard-header title="设备维保看板"></dashboard-header>
    <div class="main">
      <!-- 上 -->
      <div class="top-content">
        <div class="today-order">
          <div class="order-name">今日工单</div>
          <div class="todayTask">
            <div class="today-item">
              <div class="repair-order">{{ cardLeft.checkNum }}</div>
              <div class="today-name">维修工单</div>
            </div>

            <div class="today-item">
              <div class="check-order">{{ cardLeft.maintenanceNum }}</div>
              <div class="today-name">点检工单</div>
            </div>

            <div class="today-item">
              <div class="maintenance-order">{{ cardLeft.repairNum }}</div>
              <div class="today-name">保养工单</div>
            </div>
          </div>
        </div>
        <div class="order-completion">
          <div class="order-name">工单完成率</div>
          <div class="todayTask">
            <div class="today-item">
              <div class="tip" id="chartOne"></div>
              <div class="today-name">维修工单</div>
            </div>

            <div class="today-item">
              <div class="tip" id="chartTwo"></div>
              <div class="today-name">点检工单</div>
            </div>

            <div class="today-item">
              <div class="tip" id="chartThree"></div>
              <div class="today-name">保养工单</div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="div-table off">
          <a-table
            size="middle"
            :columns="leftBottom.columns"
            :data-source="leftBottom.data"
            :loading="leftBottom.loading"
            rowKey="id"
            :pagination="false"
          ></a-table>
        </div>

        <div class="div-table off">
          <a-table
            size="middle"
            :columns="centerBottom.columns"
            :data-source="centerBottom.data"
            :loading="centerBottom.loading"
            rowKey="id"
            :pagination="false"
          ></a-table>
        </div>

        <div class="div-table off">
          <a-table
            size="middle"
            :columns="rightBottom.columns"
            :data-source="rightBottom.data"
            :loading="rightBottom.loading"
            rowKey="id"
            :pagination="false"
          ></a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import dashboardHeader from '@/components/dashboardHeader/index.vue';
const echarts = require('echarts');

export default defineComponent({
  name: 'index',
  components: {
    dashboardHeader,
  },
  props: ['orgId', 'url'],
  setup(props) {
    const state = reactive({
      taskUrl: '',
      taskPercentUrl: '',
      taskListUrl: '',
      // taskMTUrl: '',

      leftBottom: {
        columns: [
          {
            title: '设备',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '部位',
            dataIndex: 'partName',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '内容及要求',
            dataIndex: 'content',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '工单状态',
            dataIndex: 'status',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '负责人',
            dataIndex: 'chargePersonName',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
        ],
        data: [],
        oData: [],
        loading: false,
        timer: 10000,
        showNumber: 8,
      },

      centerBottom: {
        columns: [
          {
            title: '今日点检工单',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '部位',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '内容及要求',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '工单状态',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '负责人',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
        ],
        data: [],
        oData: [],
        loading: false,
        timer: 10000,
        showNumber: 8,
      },

      rightBottom: {
        columns: [
          {
            title: '今日保养工单',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '部位',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '内容及要求',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '工单状态',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
          {
            title: '负责人',
            dataIndex: 'number',
            algin: 'center',
            ellipsis: true,
            width: 'auto',
          },
        ],
        data: [],
        oData: [],
        loading: false,
        timer: 10000,
        showNumber: 8,
      },
      cardLeft: {
        checkNum: 0, //点检数量
        maintenanceNum: '', //保养数量
        repairNum: '', //维修数量
      },
      cardRight: {
        checkPercent: '', //（点检完成率）
        maintenancePercent: '', //保养完成率
        repairPercent: '', //维修完成率）
      },
    });

    state.taskUrl = `${props.url}/idcloud/dashboard/deviceMaintenance/deviceMaintenanceTodayTask?orgId=${props.orgId}`;
    state.taskPercentUrl = `${props.url}/idcloud/dashboard/deviceMaintenance/deviceMaintenanceTodayTaskPercent?orgId=${props.orgId}`;
    state.taskListUrl = `${props.url}/idcloud/dashboard/deviceMaintenance/deviceMaintenanceTodayTaskList?orgId=${props.orgId}`;
    //今日工单
    async function getTodayTask() {
      const resp = await fetch(state.taskUrl);
      const res = await resp.json();
      state.cardLeft.checkNum = res.data.checkNum;
      state.cardLeft.maintenanceNum = res.data.maintenanceNum;
      state.cardLeft.repairNum = res.data.repairNum;
    }
    //工单完成率
    async function getTodayTaskPercent() {
      const resp = await fetch(state.taskPercentUrl);
      const res = await resp.json();
      state.cardRight.checkPercent = res.data.checkPercent;
      state.cardRight.maintenancePercent = res.data.maintenancePercent;
      state.cardRight.repairPercent = res.data.repairPercent;
      drawIndex('#chartOne', state.cardRight.checkPercent);
      drawIndex('#chartTwo', state.cardRight.maintenancePercent);
      drawIndex('#chartThree', state.cardRight.repairPercent);
    }
    //工单列表
    async function getTodayTaskList() {
      state.leftBottom.loading = true;
      state.rightBottom.loading = true;
      state.centerBottom.loading = true;
      const resp = await fetch(state.taskListUrl);

      const res = await resp.json();

      state.leftBottom.oData = res.data;
      state.leftBottom.data = res.data;
      // this.leftBottom.data = res.data.slice(0, this.leftBottom.showNumber);
      state.leftBottom.loading = false;
      timeoutRepair();
    }

    getTodayTask();
    getTodayTaskPercent();
    getTodayTaskList();
    function getDraw(val: any) {
      return {
        series: [
          {
            type: 'gauge',
            min: 0,
            max: 100,

            // 坐标轴线
            axisLine: {
              // 仪表盘轴线(轮廓线)相关配置。
              show: true, // 是否显示仪表盘轴线(轮廓线),默认 true。
              // 属性lineStyle控制线条样式
              // distance: 50,
              lineStyle: {
                opacity: [0.15],
                width: 30,
                color: [
                  [0.09, '#1e90ff'],
                  [0.8, '#1e90ff'],
                  [1, '#1e90ff'],
                ],
              },
            },
            pointer: {
              show: true,
              width: 5,
              length: '60%',
              itemStyle: {
                color: '#fff',
                distance: 60,
                // shadowBlur: 10,
              },
            },
            axisTick: {
              // 坐标轴小标记
              distance: -30,
              lineStyle: {
                color: 'auto',
              },
            },
            splitLine: {
              // 分隔线
              distance: -30,

              // length: 5,
              lineStyle: {
                width: 3,
                color: 'auto',
              },
            },
            //刻度标签
            axisLabel: {
              color: '#fff',
              distance: 30,
              fontSize: 10,
              opacity: [0.8],
            },
            detail: {
              fontSize: 15,
              valueAnimation: true,
              formatter: '{value} %',
              color: '#fff',
            },
            data: [
              {
                value: val,
              },
            ],
          },
        ],
      };
    }

    //维修工单图 封装方法
    function drawIndex(dom: string, val: any) {
      const chart0 = document.querySelector(dom);
      const myChart1 = echarts.init(chart0);

      var option1 = getDraw(val);
      myChart1.setOption(option1);
    }

    function timeoutRepair() {
      setTimeout(() => {
        if (state.leftBottom.showNumber >= state.cardLeft.checkNum) {
          state.leftBottom.showNumber = 8;
          getTodayTask();
        } else {
          state.leftBottom.showNumber += 8;
          state.leftBottom.data = state.leftBottom.oData.slice(
            state.leftBottom.showNumber - 8,
            state.leftBottom.showNumber
          );
          timeoutRepair();
        }
      }, state.leftBottom.timer);
    }
    return {
      ...state,
    };
  },
});
</script>
<style lang="scss" scoped>
.div-table {
  width: 100%;
  height: 100%;
  margin: 10px;
  background-image: url("../../../assets/dashboardCardBackground/cardBackground.png");
  background-size: 100% 99%;
  background-repeat: no-repeat;
  overflow: auto;
  padding: 10px;

  ::v-deep(.ant-table) {
    background: transparent;
    color: #6a9fd0;
  }

  ::v-deep(.ant-table-placeholder) {
    background: transparent;
    border: 0;
  }

  ::v-deep(.ant-empty-description) {
    color: #ffffff;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: transparent;
    border-bottom: 1px solid #4f98e9;
    border-top: 1px solid #4f98e9;
    color: #ffffff;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #4f98e9;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #4f98e9;
  }

  ::v-deep(.ant-table-thead) {
    background: #1a2562;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: #172455;
  }

  ::v-deep(.ant-table-tbody > tr > td) {
    border: 0;
  }

  ::v-deep(.ant-table-tbody
      > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
    > td {
    background: #27327c;
  }
}

.off {
  ::v-deep(.ant-table) {
    color: #aec8ff;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: rgba(102, 124, 174, 0.3);
    border-bottom: 1px solid #667cae;
    border-top: 1px solid #667cae;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #667cae;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #667cae;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: rgba(102, 124, 174, 0.3);
  }
}
.main-content {
  // width: 200px;
  display: flex;
  padding: 10px 10px;
  // justify-content: flex-start;
  justify-content: space-around;
}
.top-content {
  // width: 1840px;
  // padding: 0 5px;
  display: flex;
  justify-content: space-around;
}
.order-name {
  margin: 20px 0 0 20px;
  font-size: 18px;
}
.today-name {
  text-align: center;
  font-size: 22px;
  margin-top: 10px;
}
.tip {
  width: 13vw;
  height: 18vh;
  display: flex;
  position: relative;
  padding: 0px;
  margin: 0px;
  border-width: 0px;
  cursor: default;
}
.todayTask {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  .repair-order {
    background-image: url("./assets/repair.png");
    width: 13vw;
    height: 18vh;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 90px;
  }
  .check-order {
    background-image: url("./assets/check.png");
    width: 13vw;
    height: 18vh;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 90px;
  }
  .maintenance-order {
    background-image: url("./assets/maintenance.png");
    width: 13vw;
    height: 18vh;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 90px;
  }
  .itemTask {
    width: 25%;
    height: 130px;
    border: 1px solid #4f98e9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name {
      width: 110px;
      height: 30px;
      background-color: green;
      text-align: center;
      line-height: 30px;
    }
    .number {
      margin-top: 15px;
      font-size: 30px;
    }
    // .completion-name {
    // }
  }
}

.today-order,
.order-completion {
  width: 48%;
  height: 400px;
  border: 1px solid #4f98e9;
}
.container {
  background-color: #16153e;
  height: 100vh;
  width: 100vw;
}

.main {
  // display: flex;
  padding: 0 1%;
  height: 86.8vh;
  width: 100%;
  // grid-template-columns: 33.5%;
  // column-gap: 1%;
  // grid-auto-rows: 30% 48%;
  // row-gap: 2.5%;
  color: #fff;
}

.div-table {
  width: 100%;
  height: 100%;
  background-image: url("../../../assets/dashboardCardBackground/cardBackground.png");
  background-size: 100% 99%;
  background-repeat: no-repeat;
  overflow: auto;
  padding: 10px;

  ::v-deep(.ant-table) {
    background: transparent;
    color: #6a9fd0;
  }

  ::v-deep(.ant-table-placeholder) {
    background: transparent;
    border: 0;
  }

  ::v-deep(.ant-empty-description) {
    color: #ffffff;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: transparent;
    border-bottom: 1px solid #4f98e9;
    border-top: 1px solid #4f98e9;
    color: #ffffff;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #4f98e9;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #4f98e9;
  }

  ::v-deep(.ant-table-thead) {
    background: #1a2562;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: #172455;
  }

  ::v-deep(.ant-table-tbody > tr > td) {
    border: 0;
  }

  ::v-deep(.ant-table-tbody
      > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected))
    > td {
    background: #27327c;
  }
}

.run {
  ::v-deep(.ant-table) {
    color: #4de7b4;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: rgba(79, 187, 151, 0.3);
    border-bottom: 1px solid #4fbb97;
    border-top: 1px solid #4fbb97;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #4fbb97;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #4fbb97;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: rgba(79, 187, 151, 0.3);
  }
}

.adjust {
  ::v-deep(.ant-table) {
    color: #ffc026;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: rgba(225, 160, 0, 0.2);
    border-bottom: 1px solid #e1a000;
    border-top: 1px solid #e1a000;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #e1a000;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #e1a000;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: rgba(225, 160, 0, 0.2);
  }
}

.error {
  ::v-deep(.ant-table) {
    color: #f06953;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: rgba(199, 91, 73, 0.3);
    border-bottom: 1px solid #c75b49;
    border-top: 1px solid #c75b49;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #c75b49;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #c75b49;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: rgba(199, 91, 73, 0.3);
  }
}

.off {
  ::v-deep(.ant-table) {
    color: #aec8ff;
  }

  ::v-deep(.ant-table-thead > tr > th) {
    background: rgba(102, 124, 174, 0.3);
    border-bottom: 1px solid #667cae;
    border-top: 1px solid #667cae;
  }

  ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
    border-left: 1px solid #667cae;
  }

  ::v-deep(.ant-table-thead > tr > th:last-child) {
    border-right: 1px solid #667cae;
  }

  ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
    background: rgba(102, 124, 174, 0.3);
  }
}

@mixin backgroud() {
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;

  .title {
    font-size: 3em;
    font-weight: 500;
  }

  .content {
    font-size: 6em;
    font-weight: bolder;
    color: white;
  }
}
</style>

<template>
  <div class="container">
    <dashboard-header title="设备运行监控"></dashboard-header>
    <div class="main">
      <div class="div-table run">
        <a-table
          size="middle"
          :columns="leftTop.columns"
          :data-source="leftTop.data"
          :loading="leftTop.loading"
          rowKey="id"
          :pagination="false"
        ></a-table>
      </div>
      <div class="backgroud-image-run">
        <span class="title">运行</span>
        <span class="content">{{ card.run }}</span>
      </div>
      <div class="backgroud-image-adjust">
        <span class="title">待机</span>
        <span class="content">{{ card.adjust }}</span>
      </div>
      <div class="div-table adjust">
        <a-table
          size="middle"
          :columns="rightTop.columns"
          :data-source="rightTop.data"
          :loading="rightTop.loading"
          rowKey="id"
          :pagination="false"
        ></a-table>
      </div>
      <div class="div-table error">
        <a-table
          size="middle"
          :columns="leftBottom.columns"
          :data-source="leftBottom.data"
          :loading="leftBottom.loading"
          rowKey="id"
          :pagination="false"
        ></a-table>
      </div>
      <div class="backgroud-image-error">
        <span class="title">故障</span>
        <span class="content">{{ card.error }}</span>
      </div>
      <div class="backgroud-image-off">
        <span class="title">离线</span>
        <span class="content">{{ card.off }}</span>
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
</template>
<style lang="scss" scoped>
.container {
  background-color: #16153e;
  height: 100vh;
  width: 100vw;
}

.main {
  display: grid;
  padding: 0 1%;
  height: 86.8vh;
  width: 100%;
  grid-template-columns: 33.5% 15% 15% 33.5%;
  column-gap: 1%;
  grid-auto-rows: 48% 48%;
  row-gap: 2.5%;
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

.backgroud-image-run {
  @include backgroud;
  background-image: url("./assets/cardRun.png");
  margin-top: 20%;

  .title {
    color: #48ab8e;
  }
}

.backgroud-image-adjust {
  @include backgroud;
  background-image: url("./assets/cardAdjust.png");
  margin-top: 20%;

  .title {
    color: #e09f01;
  }
}

.backgroud-image-off {
  @include backgroud;
  background-image: url("./assets/cardOff.png");
  margin-bottom: 20%;

  .title {
    color: #697fb1;
  }
}

.backgroud-image-error {
  @include backgroud;
  background-image: url("./assets/cardError.png");
  margin-bottom: 20%;

  .title {
    color: #c65b49;
  }
}
</style>
<script lang="ts">
import { defineComponent } from 'vue';
import dashboardHeader from '@/components/dashboardHeader/index.vue';

export default defineComponent({
  name: 'index',
  components: {
    dashboardHeader,
  },
  props: ['orgId', 'url'],
  data() {
    return {
      leftTop: {
        columns: [
          {
            title: '设备编号',
            dataIndex: 'number',
            align: 'center',
            ellipsis: true,
            width: 80,
          },
          {
            title: '设备名称',
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '运行时长',
            dataIndex: 'duration',
            align: 'center',
            ellipsis: true,
            width: 120,
          },
          {
            title: '运行开始时间',
            dataIndex: 'time',
            align: 'center',
            ellipsis: true,
          },
        ],
        data: [],
        oData: [],
        loading: false,
        timer: 10000,
        showNumber: 8,
      },

      rightTop: {
        columns: [
          {
            title: '设备编号',
            dataIndex: 'number',
            align: 'center',
            ellipsis: true,
            width: 80,
          },
          {
            title: '设备名称',
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '待机时长',
            dataIndex: 'duration',
            align: 'center',
            ellipsis: true,
            width: 120,
          },
          {
            title: '待机开始时间',
            dataIndex: 'time',
            align: 'center',
            ellipsis: true,
          },
        ],
        data: [],
        oData: [],
        loading: false,
        timer: 10000,
        showNumber: 8,
      },

      leftBottom: {
        columns: [
          {
            title: '设备编号',
            dataIndex: 'number',
            align: 'center',
            ellipsis: true,
            width: 80,
          },
          {
            title: '设备名称',
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '故障时长',
            dataIndex: 'duration',
            align: 'center',
            ellipsis: true,
            width: 120,
          },
          {
            title: '故障开始时间',
            dataIndex: 'time',
            align: 'center',
            ellipsis: true,
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
            title: '设备编号',
            dataIndex: 'number',
            align: 'center',
            ellipsis: true,
            width: 80,
          },
          {
            title: '设备名称',
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
          },
          {
            title: '离线时长',
            dataIndex: 'duration',
            align: 'center',
            ellipsis: true,
            width: 120,
          },
          {
            title: '离线开始时间',
            dataIndex: 'time',
            align: 'center',
            ellipsis: true,
          },
        ],
        data: [],
        oData: [],
        loading: false,
        timer: 10000,
        showNumber: 8,
      },

      card: {
        run: 0,
        error: 0,
        adjust: 0,
        off: 0,
      },

      requestUrl: '',
    };
  },
  created() {
    this.requestUrl = `${this.url}/idcloud/dashboard/standard/getDeviceOperationList?orgId=${this.orgId}`;
    console.log(this.requestUrl);
    this.getTableData('1');
    this.getTableData('3');
    this.getTableData('4');
    this.getTableData('0');
  },
  //     运行状态：
  // 0：离线      灰色    #B2B3B8
  // 1：运行      绿色    #42b983
  // 2：待机      蓝色    #2994e7
  // 3：调机      橙色    #d9650f
  // 4：故障      红色    #DB0B15
  methods: {
    async getTableData(status: string) {
      if (status === '0') {
        this.rightBottom.loading = true;
      } else if (status === '1') {
        this.leftTop.loading = true;
      } else if (status === '3') {
        this.rightTop.loading = true;
      } else if (status === '4') {
        this.leftBottom.loading = true;
      }
      const resp = await fetch(this.requestUrl + '&status=' + status);
      const res = await resp.json();
      if (status === '0') {
        this.rightBottom.oData = res.data;
        this.rightBottom.data = res.data.slice(0, this.rightBottom.showNumber);
        this.rightBottom.loading = false;
        this.card.off = res.data.length;
        this.timeoutOff();
      } else if (status === '1') {
        this.leftTop.oData = res.data;
        this.leftTop.data = res.data.slice(0, this.leftTop.showNumber);
        this.leftTop.loading = false;
        this.card.run = res.data.length;
        this.timeoutRun();
      } else if (status === '3') {
        this.rightTop.oData = res.data;
        this.rightTop.data = res.data.slice(0, this.rightTop.showNumber);
        this.rightTop.loading = false;
        this.card.adjust = res.data.length;
        this.timeoutAdjust();
      } else if (status === '4') {
        this.leftBottom.oData = res.data;
        this.leftBottom.data = res.data.slice(0, this.leftBottom.showNumber);
        this.leftBottom.loading = false;
        this.card.error = res.data.length;
        this.timeoutError();
      }
    },
    timeoutRun() {
      setTimeout(() => {
        if (this.leftTop.showNumber >= this.card.run) {
          this.leftTop.showNumber = 8;
          this.getTableData('1');
        } else {
          this.leftTop.showNumber += 8;
          this.leftTop.data = this.leftTop.oData.slice(
            this.leftTop.showNumber - 8,
            this.leftTop.showNumber
          );
          this.timeoutRun();
        }
      }, this.leftTop.timer);
    },
    timeoutAdjust() {
      setTimeout(() => {
        if (this.rightTop.showNumber >= this.card.adjust) {
          this.rightTop.showNumber = 8;
          this.getTableData('3');
        } else {
          this.rightTop.showNumber += 8;
          this.rightTop.data = this.rightTop.oData.slice(
            this.rightTop.showNumber - 8,
            this.rightTop.showNumber
          );
          this.timeoutAdjust();
        }
      }, this.rightTop.timer);
    },
    timeoutError() {
      setTimeout(() => {
        if (this.leftBottom.showNumber >= this.card.error) {
          this.leftBottom.showNumber = 8;
          this.getTableData('4');
        } else {
          this.leftBottom.showNumber += 8;
          this.leftBottom.data = this.leftBottom.oData.slice(
            this.leftBottom.showNumber - 8,
            this.leftBottom.showNumber
          );
          this.timeoutError();
        }
      }, this.leftBottom.timer);
    },
    timeoutOff() {
      setTimeout(() => {
        if (this.rightBottom.showNumber >= this.card.off) {
          this.rightBottom.showNumber = 8;
          this.getTableData('0');
        } else {
          this.rightBottom.showNumber += 8;
          this.rightBottom.data = this.rightBottom.oData.slice(
            this.rightBottom.showNumber - 8,
            this.rightBottom.showNumber
          );
          this.timeoutOff();
        }
      }, this.rightBottom.timer);
    },
  },
});
</script>

<template>
  <div class="container" v-title data-title="超限预警">
    <!-- 8vh -->
    <div class="title-wrapper">
      <div class="time-wrapper">
        <current-time
          :hasDropdown="true"
          :titleButtonText="titleBtnText"
          :titleMenuList="titleMenuList"
          @handleClickTitleMenu="handleClickTitleMenu"
          class="time-style"
        ></current-time>
      </div>
      <div class="t-wrapper">
        <img src="./assets/logo.png" />
        <span>超限预警</span>
      </div>
      <div class="btn-wrapper">
        <div class="btn-style"></div>
      </div>
    </div>
    <!-- 0.2vh -->
    <div class="line-wrapper">
      <img src="./assets/left.png" />
      <img src="./assets/right.png" />
    </div>
    <!-- 90vh -->
    <div class="card-wrapper">
      <a-table style="width: 100%" :pagination="false" :columns="columns" :data-source="cardList"> </a-table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import currentTime from "@/components/time/index.vue";

export default defineComponent({
  name: "Home",
  components: {
    currentTime,
  },
  data() {
    return {
      columns: [
        {
          title: "设备代码",
          dataIndex: "deviceNumber",
          key: "deviceNumber",
        },
        {
          title: "设备名称",
          dataIndex: "deviceName",
          key: "deviceName",
        },
        {
          title: "点名称",
          dataIndex: "pointName",
          key: "pointName",
        },
        {
          title: "预警详情",
          dataIndex: "content",
          key: "content",
        },
        {
          title: "预警开始时间",
          dataIndex: "startTime",
          key: "startTime",
        },
      ],
      // host: 'http://192.168.1.254:7060',
      host: "https://apitest.idcloud.group",
      refreshTime: 10000,
      cardList: [],
      pageSize: 14,
      orgId: 1,
      currentPage: 1,
      total: 0,
      maxPage: 0,
      requestFinished: false,
      titleBtnText: "",
      titleMenuList: [] as any,
      shopId: "",
    };
  },
  async mounted() {
    const query: any = this.$route.query;
    // 默认请求地址和orgId
    this.orgId = query.orgId ?? 1;
    this.host = query.url ?? "https://apitest.idcloud.group";
    this.pageSize = query.pagesize ?? 14

    this.getContainerTree();
    this.requestFinished = false;
    const res = await this.fetchData();
    this.requestFinished = true;
    this.receiveData(res);
  },
  watch: {
    requestFinished(n) {
      if (n) {
        this.timeoutRequest();
      }
    },
  },
  methods: {
    async handleClickTitleMenu(val: any) {
      val.id == -1 ? (this.shopId = "") : (this.shopId = val.id);
      this.titleBtnText = val.label;
      this.currentPage = 1;
      const res = await this.fetchData();
      this.receiveData(res);
    },
    // /container/getContainerPcAnalysisList
    async getContainerTree() {
      this.titleMenuList = [];
      let url = `${this.host}/idcloud/dashboard/standard/getContainerPcAnalysisList?orgId=${this.orgId}&noDevice=true`;
      const resp = await fetch(url);
      const res = await resp.json();
      res.data.forEach(
        (i: { ctrType: number; id: number; ctrName: string }) => {
          if (i.ctrType == 1) {
            i.id = -1;
            this.titleBtnText = i.ctrName;
          }
        }
      );
      res.data.forEach((i: { ctrName: any; id: any }) => {
        this.titleMenuList.push({
          label: i.ctrName,
          id: i.id,
        });
      });
    },
    timeoutRequest() {
      setTimeout(async () => {
        this.currentPage =
          this.currentPage >= this.maxPage ? 1 : this.currentPage + 1;

        this.requestFinished = false;
        const res = await this.fetchData();
        this.requestFinished = true;
        this.receiveData(res);
      }, this.refreshTime);
    },
    receiveData(res: { data: { total: number; list: never[] } }) {
      try {
        this.total = res.data.total;
        this.maxPage = Math.ceil(this.total / this.pageSize);
        this.cardList = res.data.list;
      } catch (e) {
        console.log(e);
      }
    },
    //     运行状态：
    // 0：离线      灰色    #B2B3B8
    // 1：运行      绿色    #42b983
    // 2：待机      蓝色    #2994e7
    // 3：调机      橙色    #d9650f
    // 4：故障      红色    #DB0B15
    async fetchData() {
      try {
        let url = `${this.host}/idcloud/dashboardData/getTransfiniteList?orgId=${this.orgId}&dashboard=1&current_page=${this.currentPage}&page_size=${this.pageSize}`;
        if (this.shopId) {
          url = url + "&shopId=" + this.shopId;
        }
        const resp = await fetch(url);
        const res = await resp.json();
        this.cardList = [];

        return res;
      } catch (e) {
        console.log(e);
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.container{overflow: hidden;}
::v-deep(.ant-table) {
        background: transparent;
        color: #ffffff;
        font-size: 18px;
    }

    ::v-deep(.ant-table-thead > tr > th) {
        background: transparent;
        color: #6a9fd0;
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

    ::v-deep(.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)) > td {
        background: #27327c;
    }

    ::v-deep(.ant-table-placeholder) {
        background: transparent;
        border: 0;
    }

    ::v-deep(.ant-empty-description) {
        color: #ffffff;
    }

::-webkit-scrollbar {
  background-color: lightgray;
  width: 0;
  height: 0;
  background-clip: padding-box;
}
.container {
  width: 100vw;
  height: 100vh;
  background-image: url("./assets/background.png");
  background-size: 100% 100%;
  background-repeat: repeat;
  .title-wrapper {
    display: flex;
    height: 8vh;
    .time-wrapper {
      width: 33%;

      .time-style {
        margin-top: 2vh;
        margin-left: 2.25vw;
      }
    }

    .t-wrapper {
      width: 34%;
      height: 8vh;
      background-image: url("./assets/title.png");
      background-size: 100% 100%;
      background-repeat: no-repeat;
      display: flex;
      justify-content: center;
      color: #fff;
      img {
        width: 6vh;
        height: 5vh;
        margin-top: 1vh;
      }
      span {
        margin-top: 1vh;
        margin-left: 1vw;
        font-size: 32px;
        font-family: MicrosoftYaHei, MicrosoftYaHei-Bold;
        font-weight: 700;
      }
    }

    .btn-wrapper {
      height: 8vh;
      color: #b0d5ff;
      font-size: 24px;
      font-family: MicrosoftYaHei;
      text-align: right;
      width: 33%;
      .btn-style {
        margin-top: 1vh;
        margin-right: 1.75vw;
        .btn {
          margin-right: 16px;
        }
      }
    }
  }

  .line-wrapper {
    height: 0.1vh;
    display: flex;
    justify-content: space-between;
    img {
      height: 0.2vh;
    }
    margin-bottom: 3.8vh;
  }

  .card-wrapper {
    padding: 0 2.5vw;
  }
}
</style>

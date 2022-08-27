<template>
  <div class="container" v-title data-title="千机卡片看板">
    <!-- 8vh -->
    <div class="title-wrapper">
      <div class="time-wrapper">
        <current-time :hasDropdown="true" :titleButtonText="titleBtnText" :titleMenuList="titleMenuList" @handleClickTitleMenu="handleClickTitleMenu" class="time-style"></current-time>
      </div>
      <div class="t-wrapper">
        <img src="./assets/logo.png" />
        <span>设备实时监控</span>
      </div>
      <div class="btn-wrapper">
        <div class="btn-style">
          <a-button class="btn" style="
              background-color: #42b983;
              border-color: transparent;
              color: #fff;
            ">运行</a-button>
          <a-button class="btn" style="
              background-color: #2994e7;
              border-color: transparent;
              color: #fff;
            ">待机</a-button>
          <a-button class="btn" style="
              background-color: #d9650f;
              border-color: transparent;
              color: #fff;
            ">调机</a-button>
          <a-button class="btn" style="
              background-color: #db0b15;
              border-color: transparent;
              color: #fff;
            ">故障</a-button>
          <a-button class="btn" style="
              background-color: #b2b3b8;
              border-color: transparent;
              color: #fff;
            ">离线</a-button>
        </div>
      </div>
    </div>
    <!-- 0.2vh -->
    <div class="line-wrapper">
      <img src="./assets/left.png" />
      <img src="./assets/right.png" />
    </div>
    <!-- 90vh -->
    <div class="card-wrapper">
      <div v-for="(i, index) in cardList" :key="index" class="card-self">
        <div class="card-col">
          <span>设备：{{ i.deviceName }}</span>
        </div>
        <div class="card-col">
          <span>设备状态：</span>
          <span v-if="i.showData.text == '-'">-</span>
          <a-button v-else :style="{ backgroundColor: i.showData.color }" style="border-color: transparent; color: #fff">{{ i.showData.text }}</a-button>
        </div>
        <div v-for="(k, kndex) in i.showData.children" :key="kndex" class="card-col">
          <span>{{ k.ctrName }}：{{ k.pointValue }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import currentTime from '@/components/time/index.vue';

export default defineComponent({
  name: 'Home',
  components: {
    currentTime,
  },
  data() {
    return {
      // host: 'http://192.168.1.254:7060',
      host: 'https://apitest.idcloud.group',
      refreshTime: 10000,
      cardList: [],
      pageSize: 24,
      orgId: 54,
      currentPage: 1,
      total: 0,
      maxPage: 0,
      requestFinished: false,
      titleBtnText: '',
      titleMenuList: [] as any,
      shopId: '',
    };
  },
  async mounted() {
    const query: any = this.$route.query;
    // 默认请求地址和orgId
    this.orgId = query.orgId ?? 54;
    this.host = query.url ?? 'https://apitest.idcloud.group';

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
      val.id == -1 ? (this.shopId = '') : (this.shopId = val.id);
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
    receiveData(res: { data: { total: number; records: never[] } }) {
      try {
        this.total = res.data.total;
        this.maxPage = Math.ceil(this.total / this.pageSize);
        this.cardList = res.data.records;
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
        let url = `${this.host}/idcloud/dashboard/standard/getEquipmentData?orgId=${this.orgId}&current_page=${this.currentPage}&page_size=${this.pageSize}`;
        if (this.shopId) {
          url = url + '&shopId=' + this.shopId;
        }
        const resp = await fetch(url);
        const res = await resp.json();
        res.data.records.forEach(
          (i: {
            showData: { color: string; text: string; children: any[] };
            children: any[];
          }) => {
            i.showData = {
              color: '#ffffff',
              text: '-',
              children: [],
            };
            i.children.forEach((k) => {
              if (k.ctrName === '运行状态') {
                switch (k.pointValue) {
                  case 0:
                    i.showData.text = '离线';
                    i.showData.color = '#B2B3B8';
                    break;
                  case 1:
                    i.showData.text = '运行';
                    i.showData.color = '#42b983';
                    break;
                  case 2:
                    i.showData.text = '待机';
                    i.showData.color = '#2994e7';
                    break;
                  case 3:
                    i.showData.text = '调机';
                    i.showData.color = '#d9650f';
                    break;
                  case 4:
                    i.showData.text = '故障';
                    i.showData.color = '#DB0B15';
                    break;
                  default:
                    break;
                }
              } else {
                i.showData.children.push(k);
              }
            });
          }
        );
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
::-webkit-scrollbar {
  background-color: lightgray;
  width: 0;
  height: 0;
  background-clip: padding-box;
}
.container {
  width: 100vw;
  height: 100vh;
  background-image: url('./assets/background.png');
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
      background-image: url('./assets/title.png');
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
    display: grid;
    grid-template-columns: repeat(6, 15vw);
    grid-template-rows: repeat(4, 20vh);
    column-gap: 1vw;
    row-gap: 1vw;
    .card-self {
      overflow-y: scroll;
      height: 20vh;
      background-image: url('./assets/card.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      color: #fff;
      font-size: 20px;
      font-family: MicrosoftYaHei;
      padding: 4% 8%;
      .card-col {
        margin-bottom: 1vh;
      }
    }
  }
}
</style>

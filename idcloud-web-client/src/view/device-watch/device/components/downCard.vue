<template>
  <el-card class="down-card">
    <div class="card-inner">
      <div class="left-col">
        <img src="../assets/cardDep.png" />
      </div>
      <div class="right-col">
        <span class="right-title">{{cardData.ctrName}}</span>
        <div style="margin-top: 0.8rem">
          <img src="../assets/cardDevice.png" />
          <span>设备总数：</span>
          <span>{{cardData.childCount}}台</span>
        </div>
        <div>
          <img src="../assets/cardHumi.png" />
          <span>湿度：</span>
          <span>{{showData.humidity}}%</span>
        </div>
        <div>
          <img src="../assets/cardTemp.png" />
          <span>温度：</span>
          <span>{{showData.temperature}}℃</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "downCard",
  props: {
    cardData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      showData: {
        temperature: 0,
        electronic: 0,
        humidity: 0,
        water: 0
      }
    };
  },
  watch: {
    cardData: {
      handler(n) {
        n.children.forEach(i => {
          switch (i.ctrName) {
            case "温度":
              this.showData.temperature = i.pointValue;
              break;
            case "湿度":
              this.showData.humidity = i.pointValue;
              break;
            case "用电量":
              this.showData.electronic =
                i.pointValue === null ? 0 : i.pointValue;
              break;
            case "用水量":
              this.showData.water = i.pointValue === null ? 0 : i.pointValue;
              break;
            default:
              break;
          }
        });
      },
      immediate: true
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.down-card {
  img {
    object-fit: contain;
  }
  .card-inner {
    padding: 0 0 0 20px;
    display: flex;
    justify-content: space-between;
    .left-col {
      width: 30%;
      margin: auto 30px auto 0;
      img {
        width: 80px;
        height: 80px;
      }
    }
    .right-col {
      width: 50%;
      margin-top: 12px;
      .right-title {
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;

        color: #4f4f4f;
      }
      span {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #7f7f7f;
        position: relative;
        bottom: 4px;
      }
      span:nth-child(2) {
        margin-left: 5px;
      }
      span:nth-child(3) {
        margin: 0;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #2b7fe4;
      }
      img {
        width: 18px;
        height: 20px;
      }
      div {
        margin: 6px 0;
      }
      div:nth-child(4) {
        img {
          position: relative;
          right: 2px;
        }
      }
    }
  }
}
</style>

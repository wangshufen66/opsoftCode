<template>
  <el-card class="main-card">
    <div class="center">
      <img :src="picData"/>
    </div>
    <div class="center top8px name-wrapper">
      <span>{{ cardData.ctrName }}</span>
      <span v-if="cardData.pointUnit !== null">({{ cardData.pointUnit }})</span>
    </div>
    <div class="center top8px value-wrapper">
      <span :style="{color:cardDataDupl.color?cardDataDupl.color:'#2b7fe4'}">{{ cardDataDupl.pointValue }}</span>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "topCard",
    props: {
      cardData: {
        type: Object,
        default() {
          return {};
        },
      },

    },
    data() {
      return {
        picData: "",
        cardDataDupl: {},
        iconList: {
          "运行状态": require("../assets/pointStatus.png"),
          "今日产量": require("../assets/pointYield.png"),
          "进给值": require("../assets/pointJJZ.png"),
          "进给倍率": require("../assets/pointJJBL.png"),
          "主轴转速": require("../assets/pointZZZS.png"),
          "主轴倍率": require("../assets/pointZZBL.png"),
        },
      };
    },
    watch: {
      cardData: {
        handler(n) {
          this.cardDataDupl = this.cardData;
          // console.log(n);
          switch (n.style) {
            case "1":
              //运行状态特殊调整
              if (n.ctrName === "运行状态") {
                //环境监测颜色key-value  需要优化
                const status = {
                  0: {name: "离线", color: '#B0B0B0',},
                  1: {name: "运行", color: '#6BC855',},
                  2: {name: "待机", color: '#2F7FE3',},
                  3: {name: "调机", color: '#FAA819',},
                  4: {name: "故障", color: '#F9605A',},
                };
                if (status.hasOwnProperty(this.cardDataDupl.pointValue))
                  this.cardDataDupl.color = status[this.cardDataDupl.pointValue].color;
                this.cardDataDupl.pointValue = status[this.cardDataDupl.pointValue].name;
              } else if (n.ctrName.indexOf("产量") > -1) {
                //产量的特殊转换 =》 需要注意
                n.ctrName = "今日产量";
              }
              if (this.iconList.hasOwnProperty(n.ctrName))
                this.picData = this.iconList[n.ctrName];
              else
                this.picData = require("../assets/default.png");
              break;
            case "2":
              this.picData = require("../assets/electronicUsage.png");
              if (n.pointValue === null) {
                this.cardDataDupl.pointValue = 0;
              }
              break;
            case "3":
              this.picData = require("../assets/water.png");
              if (n.pointValue === null) {
                this.cardDataDupl.pointValue = 0;
              }
              break;
            case "4":
              this.picData = require("../assets/air.png");
              if (n.pointValue === null) {
                this.cardDataDupl.pointValue = 0;
              }
              break;
            case "5":
              this.picData = require("../assets/temp.png");
              break;
            case "6":
              this.picData = require("../assets/humi.png");
              break;
            case "7":
              this.picData = require("../assets/gas.png");
              if (n.pointValue === null) {
                this.cardDataDupl.pointValue = 0;
              }
              break;

            default:
              this.picData = require("../assets/default.png");
              break;
          }
        },
        immediate: true,
      },
    },
    methods: {},
  };
</script>

<style lang="less" scoped>
  .main-card {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    white-space: nowrap;

    img {
      width: 50px;
      height: 50px;
      margin: 15px 0;
      object-fit: contain;
    }

    .name-wrapper {
      font-size: 18px;
      font-weight: 400;
      color: #4f4f4f;
    }

    .value-wrapper {
      font-size: 25px;
      font-weight: 600;
      /*color: #2b7fe4;*/
    }
  }

  .center {
    display: flex;
    justify-content: center;
  }

  .top2px {
    margin-top: 2px;
  }

  .top4px {
    margin-top: 4px;
  }

  .top8px {
    margin-top: 8px;
  }
</style>

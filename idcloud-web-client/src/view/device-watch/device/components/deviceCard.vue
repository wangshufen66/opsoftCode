<template>
  <div>
    <el-card class="down-card">
      <div class="card-inner">
        <div class="left-col">
          <img src="@/assets/deviceMonitor/all.png"/>
        </div>
        <div class="right-col">
          <span class="right-title">{{ cardData.ctrName }}</span>
          <div>
            <span>设备代码：</span>
            <span>{{ cardData.ctrNumber }}</span>
          </div>
          <!-- 运行状态：
              1：运行      绿色    #6BC855
              2：待机      蓝色    #2F7FE3
              3：调机      橙色    #FAA819
              4：故障      红色    #F9605A
              0：离线      灰色    #B0B0B0 -->
          <div v-if="showData.status">
            <span>运行状态：</span>
            <span style="color: #b0b0b0" v-if="showData.status === '0'">离线</span>
            <span style="color: #6bc855" v-else-if="showData.status === '1'"
            >运行</span>
            <span style="color: #2f7fe3" v-else-if="showData.status === '2'"
            >待机</span>
            <span style="color: #faa819" v-else-if="showData.status === '3'"
            >调机</span>
            <span style="color: #f9605a" v-else-if="showData.status === '4'"
            >故障</span>
            <!--空载状态-->
            <!--<span style="color: #000000" v-else-if="showData.status === '5'"-->
            <!--&gt;空载</span>-->
            <span style="color: #b0b0b0" v-else>-</span>
          </div>
          <div v-if="showData.warning">
            <span>预警状态：</span>
            <span
              @click="handleClickWarning"
              style="cursor: pointer; white-space: nowrap"
              :style="showData.warning ? 'color: #70b603' : 'color: #d9001b'"
            >{{ showData.warning ? "无预警" : "预警" }}</span
            >
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.cardData.children.forEach((i) => {
        switch (i.ctrName) {
          case "运行状态":
            this.showData.status = i.pointValue + "";
            break;
          case "预警状态":
            this.showData.warning = i.pointValue + "";
            break;
          default:
            break;
        }
      });
    },
    name: "deviceCard",
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
        showData: {
          status: "",
        },
      };
    },
    methods: {
      handleClickWarning() {
        this.$emit("handleClickWarning", this.cardData.ctrRelation);
      },
    },
  };
</script>

<style lang="less" scoped>
  .down-card {
    img {
      object-fit: contain;
    }

    .card-inner {
      padding: 0 10px;
      display: flex;
      height: 140px;
      justify-content: space-between;

      .left-col {
        width: 20%;
        margin: auto 40px auto 0;

        img {
          width: 70px;
          height: 70px;
        }
      }

      .right-col {
        width: 80%;
        margin: auto 0;

        .right-title {
          font-size: 14px;
          color: #4f4f4f;
          font-weight: 600;
        }

        span {
          font-size: 13px;
          color: #7f7f7f;
          position: relative;
          bottom: 4px;
        }

        span:nth-child(2) {
          margin-left: 5px;
          color: #000000;
        }

        span:nth-child(3) {
          margin: 0;
          font-size: 14px;
          font-weight: 500;
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

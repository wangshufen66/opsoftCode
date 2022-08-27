<template>
    <div>
        <div class="dashboard-header">
            <div class="header-img">
                <img src="@/assets/logo.png" alt="ID Cloud">
            </div>
            <div class="header-title">
            <span class="title">
                {{title}}
            </span>
            </div>
            <div class="time">
            <span>
                {{currentTime}}
            </span>
            </div>
        </div>
        <div class="line-wrapper">
            <img src="@/assets/dashboardHeader/title-left.png"/>
            <img src="@/assets/dashboardHeader/title-right.png"/>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .dashboard-header {
        background-color: #16153e;
        width: 100%;
        height: 9vh;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 40px;

        .title {
            color: white;
            font-weight: bolder;
            font-size: 2rem;
        }

        .time {
            color: #a3c5ef;
            font-size: 1.2rem;
            text-align: right;
        }

        > div {
            width: 32%;
        }
    }

    .header-title {
        height: 9vh;
        background-image: url("../../assets/dashboardHeader/title.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .header-img {
        > img {
            width: auto;
            height: 30px;
        }
    }

    .line-wrapper {
        height: 0.2vh;
        display: flex;
        justify-content: space-between;
        img {
            height: 0.2vh;
        }
        margin-bottom: 3.8vh;
    }
</style>
<script lang="ts">
  import moment from "moment";
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "index",
    data() {
      return {
        currentTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        intervalHandler: 0
      };
    },
    props: {
      title: { type: String, default: "看板" }
    },
    created() {
      this.intervalHandler = setInterval(() => {
        this.currentTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      }, 1000);
    },
    unmounted() {
      clearInterval(this.intervalHandler);
    }
  });
</script>



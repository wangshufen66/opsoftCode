<template>
  <el-card class="shop-card"
           :body-style="{
           backgroundImage:'url('+require('../../../../assets/deviceMonitor/miniCardBackground.png')+')',
           backgroundRepeat:'no-repeat',
           backgroundPosition:'90% 100%',
           }">
    <div class="title"
          style="font-size: 18px;
                 font-weight:600;
                 width: 100%;
                 white-space: nowrap;
                 overflow: hidden;
                 text-overflow: ellipsis;"
    >{{cardData.name}}</div>
    <div style="display: grid;
                grid-template-columns: 50% 50%;
                grid-column-gap: 15px;
                height: 120px;
                width: 100%;
                margin-top: 20px;">
      <div>
        <img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>
        <!--<i class="el-icon-s-platform" style="margin-right: 5px"></i>-->
        <span style="margin-right: 5px;vertical-align:0.3rem">设备总数:</span>
        <span :style="{color:colorList[0].color}" style="vertical-align:0.3rem">{{cardData.all}}台</span>
      </div>
      <div>
        <img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>
        <span style="margin-right: 5px;vertical-align:0.3rem">运行:</span>
        <span :style="{color:colorList[1].color}" style="vertical-align:0.3rem">{{cardData.run}}台</span>
      </div>
      <div>
        <img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>
        <span style="margin-right: 5px;vertical-align:0.3rem">离线:</span>
        <span :style="{color:colorList[2].color}" style="vertical-align:0.3rem">{{cardData.off}}台</span>
      </div>
      <div>
        <img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>
        <span style="margin-right: 5px;vertical-align:0.3rem">待机:</span>
        <span :style="{color:colorList[3].color}" style="vertical-align:0.3rem">{{cardData.wait}}台</span>
      </div>
      <div>
        <img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>
        <span style="margin-right: 5px;vertical-align:0.3rem">故障:</span>
        <span :style="{color:colorList[4].color}" style="vertical-align:0.3rem">{{cardData.break}}台</span>
      </div>
      <div>
        <img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>
        <span style="margin-right: 5px;vertical-align:0.3rem">调机:</span>
        <span :style="{color:colorList[5].color}" style="vertical-align:0.3rem">{{cardData.tune}}台</span>
      </div>
      <!--空载状态 =》 车间/下方/卡片-->
      <!--<div>-->
        <!--<img src="@/assets/deviceMonitor/factoryDeviceIcon.png"/>-->
        <!--<span style="margin-right: 5px;vertical-align:0.3rem">空载:</span>-->
        <!--<span :style="{color:'#000000'}" style="vertical-align:0.3rem">{{cardData.empty}}台</span>-->
      <!--</div>-->
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "shopCard",
    props: {
      cardData: {
        type: Object,
        default() {
          return {};
        }
      },
      colorList: {
        type: Array,
        default() {
          return [];
        }
      },
    },
  }
</script>

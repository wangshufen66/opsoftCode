<template>
  <view class="page">
    <scroll-view scroll-y class="d-position-bottom" :style="{ height: this.scrollHeight + 'px' }">
      <view id="detail-form" class="detail-form" ref="detailForm">
        <view class="form-inner">
          <text class="form-label">工单代码</text>
          <text class="form-title">{{detailData.number}}</text>
        </view>
        <view class="form-inner">
          <text class="form-label">工单类型</text>
          <text class="form-child">{{detailData.typeName}}</text>
        </view>
        <view class="form-inner">
          <text class="form-label">负责人员</text>
          <text class="form-child">{{detailData.chargePersonName}}</text>
        </view>
        <view class="form-inner">
          <text class="form-label">工单内容</text>
          <text class="form-child">{{detailData.content}}</text>
        </view>
        <view class="form-inner">
          <text class="form-label">备注信息</text>
          <text class="form-child">{{detailData.note}}</text>
        </view>
      </view>
      <view class="switch-wrapper">
        <uni-segmented-control
          class="switch-item"
          :current="current.value"
          :values="current.items"
          @clickItem="handleChangeSwitch"
        ></uni-segmented-control>
      </view>
      <scroll-view
        v-if="current.value === 0"
        scroll-y
        style="margin-bottom: 40px;"
        :style="{height: tableHeight + 'px'}"
      >
        <view v-if="noRecord" style="width: 100%; text-align: center; margin-top: 100px;">暂无汇报记录</view>
        <view
          v-for="(item, index) in reportList"
          @click="handleClickBlock(item)"
          :key="index"
          class="scroll-block"
        >
          <view class="icon-wrapper">
            <image
              style="width: 44px; height: 44px;"
              :style="detailData.status == 3?'filter: grayscale(100%)':''"
              :src="dataImg"
            />
          </view>
          <view class="content-wrapper">
            <view class="ticket-title">
              <text>汇报时间：</text>
              <text>{{item.createTime}}</text>
            </view>
            <view class="ticket-brief">
              <text>执行结果：</text>
              <text>{{item.content.substr(0,12)}}</text>
              <text v-if="item.content.length>12">...</text>
            </view>
          </view>
          <view class="arrow-wrapper">
            <uni-icons type="arrowright" size="16" style="color: gray;"></uni-icons>
          </view>
        </view>
      </scroll-view>
      <scroll-view
        v-else
        scroll-y
        style="margin-bottom: 40px;"
        :style="{height: tableHeight + 'px'}"
      >
        <view v-if="noDeviceList" style="width: 100%; text-align: center; margin-top: 100px;">暂无设备记录</view>
        <view class="table-block" v-for="(item, index) in deviceList" :key="index">
          <view style="margin-left: 20px; display: flex;">
            <view class="table-number">{{item.deviceNumber.substr(0,20)}}</view>
            <view class="table-number" v-if="item.deviceNumber.length>20">...</view>
          </view>

          <view style="margin-right: 20px; display: flex;">
            <view class="table-name">{{item.deviceName.substr(0,10)}}</view>
            <view class="table-name" v-if="item.deviceName.length>10">...</view>
          </view>
        </view>
      </scroll-view>
      <view v-if="detailData.status == 2" @click="handleClickGoReport" class="bottom-btn">
        去汇报
        <uni-icons type="paperplane-filled" size="16" style="color: white;margin-left: 6px;"></uni-icons>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getReportTicketDetail } from "@/api/ticketReport.js";
export default {
  components: {},
  onReady() {
    const query = uni.createSelectorQuery().in(this);
    query
      .select("#detail-form")
      .boundingClientRect(data => {
        this.tableHeight = this.scrollHeight - data.height - 8 - 10 - 30 - 40;
        if (this.tableHeight < 200) this.tableHeight = 200;
      })
      .exec();
  },
  onShow() {
    this.initFormData();
  },
  data() {
    return {
      tableHeight: 0,
      detailData: "",
      reportList: [],
      deviceList: [],
      page: {
        current: 1,
        size: 20
      },
      current: {
        value: 0,
        items: ["汇报记录", "设备列表"]
      },
      dataImg: "",
      noRecord: false,
      noDeviceList: false
    };
  },
  methods: {
    loadMore() {},
    async initFormData() {
      this.noDeviceList = false;
      this.noRecord = false;
      this.detailData = this.$store.state.reportTicket.ticketDetail;
      uni.setNavigationBarTitle({
        title: this.detailData.status == 2 ? "汇报工单详情" : "结案工单详情"
      });
      switch (this.detailData.type) {
        case 1:
          this.detailData.typeName = "维修";
          this.dataImg = "../../../static/ticketReport/weixiu.png";
          break;
        case 2:
          this.detailData.typeName = "点检";
          this.dataImg = "../../../static/ticketReport/dianjian.png";
          break;
        case 3:
          this.detailData.typeName = "保养";
          this.dataImg = "../../../static/ticketReport/baoyang.png";
          break;
        case 4:
          this.detailData.typeName = "润滑";
          this.dataImg = "../../../static/ticketReport/runhua.png";
          break;
        default:
          break;
      }

      try {
        uni.showLoading({
          mask: true
        });
        let res = await Promise.resolve(
          getReportTicketDetail(
            {
              orgId: 1
            },
            this.detailData.id
          )
        );
        uni.hideLoading();
        if (res[1].data.code) {
          this.reportList = res[1].data.data.reportList;
          this.deviceList = res[1].data.data.deviceList;
          if (this.reportList.length === 0) {
            this.noRecord = true;
          }
          if (this.deviceList.length === 0) {
            this.noDeviceList = true;
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    handleClickBlock(item) {
      this.$store.dispatch("setTicketTriggerType", {
        trigger: "block",
        type: "readonly"
      });
      this.$store.dispatch("setTicketTriggerBlockItem", item);
      uni.navigateTo({
        url: "/pages/home/deviceMaintainence/inputTicket"
      });
    },
    handleChangeSwitch(index) {
      this.current.value = index.currentIndex;
    },
    handleClickGoReport() {
      uni.navigateTo({
        url: "/pages/home/deviceMaintainence/inputTicket"
      });
      this.$store.dispatch("setTicketTriggerType", {
        trigger: "buttom",
        type: this.detailData.status == 2 ? "input" : "readonly"
      });
      this.$store.dispatch("setTicketTriggerBlockItem", {});
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-form {
  margin-bottom: 8px;
  padding: 0 20px;
}

.form-inner {
  margin-bottom: 2px;
}

.form-label {
  font-size: 13px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  color: #212121;
  margin-right: 12px;
}

.form-title {
  font-size: 13px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 700;
  color: #212121;
}

.form-child {
  font-size: 13px;
  font-weight: 400;
  color: #6b6b6b;
}

.switch-wrapper {
  height: 30px;
  margin: 0 0 10px 0;
  display: flex;
  justify-content: center;
  width: 100%;
}

.switch-item {
  width: 90%;
  height: 30px;
}

.icon-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 85px;
  width: 15%;
  height: 100%;
  padding-left: 5%;
}

.content-wrapper {
  width: 65%;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.ticket-title {
  font-size: 13px;
  font-family: PingFangSC, PingFangSC-Medium;
  font-weight: 500;
  color: black;
}

.ticket-brief {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}

.arrow-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 55px;
  width: 10%;
  padding-right: 5%;
}

.scroll-block {
  display: flex;
  width: 100%;
  height: 55px;
  border-bottom: 1px solid #f0f0f0;
}

.table-block {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 45px;
  border-bottom: 1px solid #f0f0f0;
}

.table-number {
  font-size: 13px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #212121;
  line-height: 45px;
}

.table-name {
  font-size: 13px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #a3a3a3;
  line-height: 45px;
}

.bottom-btn {
  position: fixed;
  bottom: 0;
  background-color: #2f7fe3;
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: white;
  text-align: center;
  font-size: 16px;
}

.switch-button-wrapper {
  ::v-deep {
    .uni-button:after {
      border-radius: 0;
    }
  }
}
</style>

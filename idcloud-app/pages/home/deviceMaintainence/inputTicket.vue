<template>
  <view class="page">
    <scroll-view
      scroll-y
      style="margin-bottom: 40px;"
      :style="{height: this.scrollHeight - 40 + 'px'}"
    >
      <view class="detail-form">
        <view class="form-inner">
          <text class="form-label">工单代码</text>
          <text class="form-title">{{ticketData.number}}</text>
        </view>
        <view class="form-inner">
          <text class="form-label">工单内容</text>
          <text class="form-child">{{ticketData.content}}</text>
        </view>
        <view class="form-inner-date">
          <text class="form-label">实际开始时间</text>
          <biaofunDatetimePicker
            :defaultValue="date.startTime"
            :disabled="triggerType.type === 'readonly'"
            :placeholder="triggerType.type === 'readonly'? '-': '请选择时间' "
            @change="(data)=>{afterTimePicked(data, 'startTime')}"
          ></biaofunDatetimePicker>
        </view>
        <view class="form-inner-date">
          <text class="form-label">实际结束时间</text>
          <biaofunDatetimePicker
            :defaultValue="date.endTime"
            :disabled="triggerType.type === 'readonly'"
            :placeholder="triggerType.type === 'readonly'? '-': '请选择时间' "
            @change="(data)=>{afterTimePicked(data, 'endTime')}"
          ></biaofunDatetimePicker>
        </view>
        <view v-if="ticketData.downStatus == 1" class="form-inner-date">
          <text class="form-label">停机开始时间</text>
          <biaofunDatetimePicker
            :defaultValue="date.offlineStartTime"
            :disabled="triggerType.type === 'readonly'"
            :placeholder="triggerType.type === 'readonly'? '-': '请选择时间' "
            @change="(data)=>{afterTimePicked(data, 'offlineStartTime')}"
          ></biaofunDatetimePicker>
        </view>
        <view v-if="ticketData.downStatus == 1" class="form-inner-date">
          <text class="form-label">停机结束时间</text>
          <biaofunDatetimePicker
            :defaultValue="date.offlineEndTime"
            :disabled="triggerType.type === 'readonly'"
            :placeholder="triggerType.type === 'readonly'? '-': '请选择时间' "
            @change="(data)=>{afterTimePicked(data, 'offlineEndTime')}"
          ></biaofunDatetimePicker>
        </view>

        <view class="form-inner">
          <text class="form-label">执行结果</text>
          <textarea
            :disabled="triggerType.type === 'readonly'"
            style="border: 1px solid #EDEDED; height: 100px; width: 100%;"
            placeholder-style="font-size: 13px; margin: 4px;"
            v-model="execResult"
            placeholder="请输入执行结果"
          />
        </view>

        <view class="form-inner">
          <text
            style="margin: 4px 0;"
            class="form-label"
            v-text="triggerType.type == 'readonly'? '图片': '上传图片'"
          ></text>
          <view @click="triggerType.type == 'readonly'?'': uploadAvatar()" class="u-img">
            <image mode="aspectFit" :src="defaultPic" @error="imgError" />
          </view>
        </view>
      </view>
    </scroll-view>
    <view v-if="triggerType.type === 'input' " @click="handleAddReport" class="bottom-btn">
      提交汇报
      <uni-icons type="checkmarkempty" size="18" style="color: white;margin-left: 6px;"></uni-icons>
    </view>
  </view>
</template>

<script>
import { getUserInfo } from "@/api/auth.js";
import baseUrl from "@/common/js/baseUrl.js";
import init from "@/common/js/authInit.js";
import biaofunDatetimePicker from "@/components/biaofun-datetime-picker/biaofun-datetime-picker";
import { getBlockDetail, saveReport } from "@/api/ticketReport.js";
export default {
  components: {
    biaofunDatetimePicker
  },
  onReady() {
    this.initFormData();
  },
  data() {
    return {
      ticketData: this.$store.state.reportTicket.ticketDetail,
      detailData: "",
      triggerType: "",
      execResult: "",
      defaultPic: "../../../static/uploadPlaceholder.png",
      date: {
        startTime: "",
        startTimeValue: "",
        endTime: "",
        endTimeValue: "",
        offlineStartTime: "",
        offlineStartTimeValue: "",
        offlineEndTime: "",
        offlineEndTimeValue: ""
      },
      fdfsId: ""
    };
  },
  methods: {
    async initFormData() {
      this.detailData = this.$store.state.reportTicket.blockItem;
      this.triggerType = this.$store.state.reportTicket.triggerType;
      try {
        let res = await Promise.resolve(
          getBlockDetail({ reportId: this.detailData.id })
        );
        this.defaultPic = res[1].data.data.imgUrl;
      } catch (e) {
        console.log(e);
      }
      this.execResult = this.detailData.content;
      this.date = {
        startTime: this.detailData.workStartTime,
        endTime: this.detailData.workEndTime,
        offlineStartTime: this.detailData.stopTimeStart,
        offlineEndTime: this.detailData.stopTimeEnd
      };
      uni.setNavigationBarTitle({
        title:
          this.triggerType.type == "readonly" ? "汇报记录内容" : "填写汇报内容"
      });
    },
    afterTimePicked(data, descr) {
      const date = data.fmt1 + " " + data.hh + ":" + data.mm + ":" + "00";
	  console.log(date);
      switch (descr) {
        case "startTime":
          this.date.startTime = date;
          this.date.startTimeValue = data.dt.valueOf() / 1000;
          break;
        case "endTime":
          this.date.endTime = date;
          this.date.endTimeValue = data.dt.valueOf() / 1000;
          break;
        case "offlineStartTime":
          this.date.offlineStartTime = date;
          this.date.offlineStartTimeValue = data.dt.valueOf() / 1000;
          break;
        case "offlineEndTime":
          this.date.offlineEndTime = date;
          this.date.offlineEndTimeValue = data.dt.valueOf() / 1000;
          break;
        default:
          break;
      }
    },
    handleAddReport() {
		console.log(this.date.startTime);
      if (this.date.startTime == "" || this.date.startTime == undefined) {
        uni.showToast({
          icon: "none",
          title: "请填写实际开始时间"
        });
      } else if (this.date.endTime == "" || this.date.endTime == undefined) {
        uni.showToast({
          icon: "none",
          title: "请填写实际结束时间"
        });
      } else if (this.ticketData.downStatus == 1) {
        if (
          this.date.offlineStartTime == "" ||
          this.date.offlineStartTime == undefined
        ) {
          uni.showToast({
            icon: "none",
            title: "请填写停机开始时间"
          });
        } else if (
          this.date.offlineEndTime == "" ||
          this.date.offlineEndTime == undefined
        ) {
          uni.showToast({
            icon: "none",
            title: "请填写停机结束时间"
          });
        } else if (this.execResult == "" || this.execResult == undefined) {
          uni.showToast({
            icon: "none",
            title: "请填写执行结果"
          });
        } else if (this.fdfsId == "" || this.fdfsId == undefined) {
          uni.showToast({
            icon: "none",
            title: "请上传图片"
          });
        } else {
          if (this.date.startTimeValue > this.date.endTimeValue) {
            uni.showToast({
              icon: "none",
              title: "实际开始时间不得大于实际结束时间"
            });
          } else if (
            this.date.offlineStartTimeValue > this.date.offlineEndTimeValue
          ) {
            uni.showToast({
              icon: "none",
              title: "停机开始时间不得大于停机结束时间"
            });
          } else {
            this.postReport();
          }
        }
      } else if (this.execResult == "" || this.execResult == undefined) {
        uni.showToast({
          icon: "none",
          title: "请填写执行结果"
        });
      } else if (this.fdfsId == "" || this.fdfsId == undefined) {
        uni.showToast({
          icon: "none",
          title: "请上传图片"
        });
      } else {
        if (this.date.startTimeValue > this.date.endTimeValue) {
          uni.showToast({
            icon: "none",
            title: "开始时间不得大于结束时间"
          });
        } else {
          this.postReport();
        }
      }
    },
    async postReport() {
      const param = [
        {
          workOrderId: this.ticketData.id,
          workOrderNumber: this.ticketData.number,
          content: this.execResult,
          workStartTime: this.date.startTime,
          workEndTime: this.date.endTime,
          stopTimeStart: this.date.offlineStartTime,
          stopTimeEnd: this.date.offlineEndTime,
          fdfsId: this.fdfsId
        }
      ];
      try {
        let res = await Promise.resolve(saveReport(param));
        if (res[1].data.code === 200) {
          uni.showToast({
            icon: "success",
            title: "汇报成功"
          });
          setTimeout(() => {
            uni.navigateBack({});
          }, 1000);
        } else {
          uni.showToast({
            icon: "none",
            title: "汇报失败"
          });
        }
      } catch (e) {
        console.log(e);
      }
    },
    uploadAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        success: async data => {
          const _token = await init.token().token;
          uni.showLoading({
            mask: true
          });
          uni.uploadFile({
            url: baseUrl + "/file/upload",
            filePath: data.tempFiles[0].path,
            name: "file",
            header: {
              Authorization: "Bearer " + _token
            },
            success: async res => {
              uni.hideLoading();
              const r = JSON.parse(res.data);
              const path = r.data.path;
              const id = r.data.id;
              const code = r.code;
              if (code === 200) {
                (this.fdfsId = id), (this.defaultPic = path);
              } else {
                uni.showToast({
                  icon: "none",
                  title: "上传失败"
                });
              }
            },
            fail: res => {
              uni.hideLoading();
              uni.showToast({
                icon: "none",
                title: "上传失败"
              });
            }
          });
        }
      });
    },
    imgError() {
      this.defaultPic = "../../../static/uploadPlaceholder.png";
    }
  }
};
</script>

<style lang="scss" scoped>
// ::v-deep {
//   .uni-textarea-textarea {
//     padding: 4px;
//     font-size: 14px;
//   }
// }
.detail-form {
  margin-bottom: 8px;
  padding: 0 20px;
}

.form-inner {
  margin-bottom: 2px;
}

.form-inner-date {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
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
.u-img {
  display: flex;
  justify-content: center;
  width: 100%;
}
image {
  width: 260px;
  height: 140px;
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
</style>

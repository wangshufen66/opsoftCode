<template>
  <div @click="cardClicked" id="mini-card-container">
    <el-card v-loading="miniCardData.loading" ref="mainCard" class="main-card">
      <div class="main-container">
        <div class="checkbox-wrapper">
          <el-checkbox
            style="display: none"
            :disabled="checkboxDisabled"
            v-if="hasCheckBox"
            @change="checkBoxChange"
            class="check-box"
            v-model="checked"
          ></el-checkbox>
        </div>
        <div class="minicard-inner">
          <div ref="leftCol" class="left-column">
            <img :src="miniCardData.icon" />
          </div>
          <div ref="rightCol" class="right-column">
            <div class="number-wrapper">
              <animated-number
                ref="animatedNumber"
                v-show="!isAnimateComplete"
                class="number-style"
                :value="miniCardData.number"
                :formatValue="numberPrintRule"
                :duration="700"
                :complete="animateComplete"
              />
              <div
                v-show="isAnimateComplete"
                ref="staticNumber"
                class="number-style"
              >{{formattedNum}}</div>
              <div v-if="miniCardData.unit" class="unit-style">{{miniCardData.unit}}</div>
            </div>
            <div class="title-wrapper">
              <p>{{miniCardData.title}}</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import AnimatedNumber from "animated-number-vue";

export default {
  name: "sysAdmin",
  components: {
    AnimatedNumber
  },
  props: {
    miniCardData: {
      type: Object,
      default() {
        return {
          id: "",
          borderColor: "transparent",
          title: "",
          icon: "",
          unit: "",
          number: 0,
          loading: false
        };
      }
    },
    //是否格式化数字
    hasFormatNumber: {
      type: Boolean,
      default() {
        return true;
      }
    },
    animateFixCount: {
      type: Number,
      default() {
        return 0;
      }
    },
    hasCheckBox: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isLongVersion: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isDisabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isChecked: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      formattedNum: "",
      isAnimateComplete: false,
      checked: false,
      checkboxDisabled: false
    };
  },
  watch: {
    checked(n) {
      if (this.hasCheckBox) {
        if (n) {
          this.$refs.mainCard.$el.style["border-top"] = "1px solid";
          this.$refs.mainCard.$el.style["border-right"] = "1px solid";
          this.$refs.mainCard.$el.style["border-left"] = "1px solid";
          this.$refs.mainCard.$el.style["border-top-color"] =
            "rgba(0, 0, 180, 0.6)";
          this.$refs.mainCard.$el.style["border-right-color"] =
            "rgba(0, 0, 180, 0.6)";
          this.$refs.mainCard.$el.style["border-left-color"] =
            "rgba(0, 0, 180, 0.6)";
        } else {
          this.$refs.mainCard.$el.style["border-top"] = "1px transparent";
          this.$refs.mainCard.$el.style["border-right"] = "1px transparent";
          this.$refs.mainCard.$el.style["border-left"] = "1px transparent";
          this.$refs.mainCard.$el.style["border-top-color"] =
            "rgba(0, 0, 180, 0.6)";
          this.$refs.mainCard.$el.style["border-right-color"] =
            "rgba(0, 0, 180, 0.6)";
          this.$refs.mainCard.$el.style["border-left-color"] =
            "rgba(0, 0, 180, 0.6)";
        }
        this.checkBoxChange();
      }else {
        this.checkId();
      }
    },
    isDisabled: {
      handler(n) {
        this.checkboxDisabled = !!n;
      },
      immediate: true
    },
    isChecked: {
      handler(n) {
        this.checked = n;
      },
      immediate: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getBorderColor();
      this.getNumberPosition();
      this.isLongVersionOrNot();
    },
    isClickable() {
      if (this.hasCheckBox) {
        this.$refs.mainCard.$el.style.cursor = "pointer";
        if (this.isDisabled) {
          this.$refs.mainCard.$el.style.cursor = "default";
        }
      }
    },
    numberPrintRule(value) {
      return value.toFixed(this.animateFixCount);
    },
    animateComplete() {
      this.isAnimateComplete = true;
      this.formattedNum = this.numberFormat(this.miniCardData.number);
    },
    getBorderColor() {
      this.$refs.mainCard.$el.style[
        "border-bottom-color"
      ] = this.miniCardData.borderColor;
    },
    getNumberPosition() {
      // 数字很大或很小的时候，card布局会出错，所以判断数字大小来移动数字框
      const number = this.miniCardData.number;
      if (number > 999999) {
        this.$refs.animatedNumber.$el.style.right = "0.625rem";
        this.$refs.staticNumber.style.right = "0.625rem";
      }
      if (number > 9999999) {
        this.$refs.animatedNumber.$el.style.right = "1.25rem";
        this.$refs.staticNumber.style.right = "1.25rem";
      }
    },
    isLongVersionOrNot() {
      if (this.isLongVersion) {
        this.$refs.mainCard.$el.style.width = "20rem";
        this.$refs.rightCol.style.right = "1.875rem";
        this.$refs.leftCol.style.left = "3.125rem";
      }
    },
    cardClicked() {
      if (this.isDisabled) {
        this.$message.warning("最多选择6个");
      } else {
        this.checked = !this.checked;
      }
    },
    checkBoxChange() {
      this.$emit("checkBoxChange", this.checked, this.miniCardData.id);
    },
    checkId(){
      this.$emit("checkId", this.miniCardData.id ,this.checked);
    },
    //格式化字符串，使得3位加逗号  number 是字符串
    numberFormat(data) {
      const number = String(data);
      let returnNum = "";
      const numArr = number.split(".");
      switch (numArr.length) {
        case 1:
          returnNum = this.hasFormatNumber
            ? (number || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")
            : number;
          break;
        case 2:
          const formattedNum =
            (numArr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") +
            "." +
            numArr[1];
          returnNum = this.hasFormatNumber ? formattedNum : number;
          break;
      }
      return returnNum;
    }
  }
};
</script>

<style lang="less" scoped>
::v-deep .el-card__body {
  height: calc(~'100% - 42rem/16');
}
.main-card {
  width: 95%;
  min-width: 240px;
  // width: 260rem/16;
  height: 140rem/16;
  border-bottom-right-radius: 8rem/16;
  border-bottom-left-radius: 8rem/16;
  border-bottom: 12rem/16 solid;
  border-bottom-color: transparent;
  border-top: 1px transparent;
  border-right: 1px transparent;
  border-left: 1px transparent;
  border-top-color: rgba(0, 0, 180, 0.6);
  border-right-color: rgba(0, 0, 180, 0.6);
  border-left-color: rgba(0, 0, 180, 0.6);
  cursor: default;
}
.main-container {
  height: 100%;
  .checkbox-wrapper {
    display: flex;
    justify-content: flex-end;
    height: 21rem/16;
    .check-box {
      position: relative;
    }
  }
  .minicard-inner {
    display: flex;
    justify-content: space-around;
    // justify-content: center;
    .left-column {
      position: relative;
      // left: 50rem/16;
      display: flex;
      width: 40%;
      flex-direction: column;
      justify-content: flex-end;
      img {
        position: relative;
        left: 14rem/16;
        width: 60rem/16;
        height: 60rem/16;
      }
    }
    .right-column {
      position: relative;
      // right: 30rem/16;
      width: 60%;
      .number-wrapper {
        display: flex;
        justify-content: center;
        .number-style {
          position: relative;
          // right: 50rem/16;
          color: #1c1c1c;
          font-weight: 500;
          font-size: 34rem/16;
        }
        .unit-style {
          position: relative;
          left: 4rem/16;
          color: #1c1c1c;
          font-weight: 500;
          font-size: 34rem/16;
        }
      }
      .title-wrapper {
        display: flex;
        justify-content: center;
        position: relative;
        p {
          position: relative;
          top: 6rem/16;
          color: #515a6e;
          font-weight: 400;
          font-size: 16rem/16;
        }
      }
    }
  }
}
</style>

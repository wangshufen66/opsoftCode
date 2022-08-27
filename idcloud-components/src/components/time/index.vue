<template>
  <div class="time-container">
    {{ currentTime }}
    <a-dropdown v-if="hasDropdown" overlayClassName="dropdown">
      <template #overlay>
        <a-menu class="menu-style" @click="handleMenuClick">
          <a-menu-item
            v-for="item in titleMenuList"
            :key="JSON.stringify(item)"
            >{{ item.label }}</a-menu-item
          >
        </a-menu>
      </template>

      <a-button v-if="hasTitleButton" class="btn-style" type="primary"
        ><span class="text-span"><BarsOutlined /> {{ titleButtonText }}</span>
      </a-button>
    </a-dropdown>
  </div>
</template>
<style lang="scss" scoped>
// ::v-deep {
//   .ant-dropdown-menu-item:hover {
//     background-color: #4d93ff;
//   }
// }
// .menu-style {
// background: linear-gradient(
//   180deg,
//   rgba(3, 97, 169, 0.5),
//   rgba(37, 125, 230, 0.5)
// );
// border: 1px solid #75b7ff;
// }
.time-container {
  color: #b0d5ff;
  font-size: 24px;
  font-family: MicrosoftYaHei;
}
.btn-style {
  margin-left: 20px;
  background-color: rgba(52, 100, 174, 0.5);
  border-radius: 5px;
  border: 1px solid #75b7ff;
  height: 37px;
}
.text-span {
  color: #fff;
  font-size: 18px;
  font-family: MicrosoftYaHei;
  line-height: 37px;
}
</style>

<script lang="ts">
import moment from "moment";
import { defineComponent } from "vue";
import { BarsOutlined } from "@ant-design/icons-vue";
export default defineComponent({
  name: "currentTime",
  components: { BarsOutlined },
  props: {
    hasTitleButton: {
      type: Boolean,
      default() {
        return true;
      },
    },
    titleButtonText: {
      type: String,
      default() {
        return "";
      },
    },
    titleMenuList: {
      type: Array,
      default() {
        return [];
      },
    },
    hasDropdown: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      currentTime: moment(moment.now()).format("YYYY-MM-DD HH:mm:ss"),
      intervalHandler: 0,
    };
  },
  mounted() {
    this.intervalHandler = setInterval(() => {
      this.currentTime = moment(moment.now()).format("YYYY-MM-DD HH:mm:ss");
    }, 1000);
  },
  unmounted() {
    clearInterval(this.intervalHandler);
  },

  methods: {
    handleMenuClick(val: any) {
      this.$emit("handleClickTitleMenu", JSON.parse(val.key));
    },
  },
});
</script>

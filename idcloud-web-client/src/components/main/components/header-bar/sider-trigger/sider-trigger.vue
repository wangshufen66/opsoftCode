<template>
  <a
    @click="handleChange"
    type="text"
    :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"
  >
    <i :class="icon"></i>
  </a>
</template>
<script>
export default {
  name: "siderTrigger",
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: "navicon-round",
    },
  },
  methods: {
    handleChange() {
      this.$emit("on-change", !this.collapsed);
    },
  },
};
</script>
<style lang="less">
@import "./sider-trigger.less";
</style>

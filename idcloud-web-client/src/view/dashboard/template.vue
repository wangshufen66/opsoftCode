<template>
  <div class="frame-container" v-loading="loading">
    <iframe
      id="template"
      ref="template"
      style="width: 100%; height: 100%; margin-top: 12px"
      :src="link"
      frameborder="0"
      @load="frameLoaded"
    ></iframe>
  </div>
</template>

<script>
import { getAuthority } from "@/api/mainPage/mounted";
import config from '@/config';
export default {
  data() {
    return {
      // 提交时将这个改为false
      // islocal: false,
      // urls: {
      //   localUrl: "http://localhost:9001",
      //   devUrl: "https://ikbt.idcloud.group",
      //   prodUrl: "https://ikb.idcloud.group",
      // },
      goto: "/datav/template",
      loading: false,
    };
  },
  activated() {
    this.loading = true;
  },
  deactivated() {
    this.loading = false;
  },
  computed: {
    link() {
      const orgId = this.$store.state.user.userInfo.orgId;
      const token = this.$store.state.user.token;
      const kanbanUrl =
        process.env.NODE_ENV === "development"
          ?  config.kanbanUrl.devUrl
          : config.kanbanUrl.prodUrl;
      return `${kanbanUrl}/#/login?auth=true&token=${token}&userId=${orgId}&goto=${this.goto}`;
    },
  },
  methods: {
    frameLoaded() {
      this.loading = false;
    },
  },
};
</script>

<style>
.frame-container {
  width: 100%;
  height: 100%;
}
</style>

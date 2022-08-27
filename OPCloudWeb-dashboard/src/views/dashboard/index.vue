<template>
  <div v-if="hasRedirect"></div>
  <div v-else class="pg">
    <div class="pg-col">
      <el-button @click="handleClickBtn('/datav/project')">全部大屏</el-button>
      <el-button @click="handleClickBtn('/datav/template')">模板管理</el-button>
      <el-button
        type="danger"
        style="grid-column: 1 / span 2"
        @click="handleLogout('/datav/template')"
        >退出登录</el-button
      >
    </div>
  </div>
</template>

<script>
import { getToken, setToken, setUserId, removeToken } from "@/utils/auth";
export default {
  data() {
    return {
      hasRedirect: false,
    };
  },
  async mounted() {
    if (this.$route.query.auth) {
      this.hasRedirect = true;
      await this.$store.commit("SET_USER_ID", this.$route.query.userId);
      await this.$store.commit("SET_TOKEN", this.$route.query.token);
      await setToken(this.$route.query.token);
      await setUserId(this.$route.query.userId);
      // console.log(this.$route.query.goto);
      if (this.$route.query.goto == "/preview/") {
        this.$router.push({
          path: "/preview/" + this.$route.query.hash,
        });
      } else {
        this.$router.push({
          path: this.$route.query.goto,
        });
      }
    }
  },
  methods: {
    handleClickBtn(val) {
      this.$router.push({
        path: val,
      });
    },
    handleLogout() {
      this.$store.dispatch("logOut")
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .el-button {
    margin-left: 0;
  }
}
.pg {
  display: flex;
  justify-content: center;
  height: 100vh;
}
.pg-col {
  margin-top: 20vh;
  display: grid;
  column-gap: 10px;
  row-gap: 10px;
  grid-template-rows: repeat(2, 50px);
  grid-template-columns: repeat(2, 200px);
}
</style>

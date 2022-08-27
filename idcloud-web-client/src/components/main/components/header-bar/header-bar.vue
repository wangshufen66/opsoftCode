<template>
  <div class="header-bar">
    <sider-trigger
      :collapsed="collapsed"
      icon="el-icon-s-unfold"
      @on-change="handleCollpasedChange"
    ></sider-trigger>
    <custom-bread-crumb :list="breadCrumbList"></custom-bread-crumb>
    <div class="custom-content-con">
      <el-autocomplete
        size="small"
        v-model="search"
        value-key="title"
        value="name"
        :fetch-suggestions="querySearchMenu"
        placeholder="搜索菜单"
        suffix-icon="el-icon-search"
        :trigger-on-focus="false"
        @select="handleSelect"
      ></el-autocomplete>
      <user
        class="margin-left-20"
        :user-account="userAccount"
        @closeAllOpenedRouter="closeAllOpenedRouter"
      />
      <fullscreen class="margin-left-20"/>
    </div>
  </div>
</template>
<script>
import siderTrigger from "./sider-trigger/sider-trigger";
import customBreadCrumb from "./custom-bread-crumb/custom-bread-crumb";
import User from "../../components/user/user";
import Fullscreen from "../../components/fullscreen/fullscreen";

export default {
  name: "HeaderBar",
  components: {
    siderTrigger,
    customBreadCrumb,
    User,
    Fullscreen
  },
  props: {
    collapsed: Boolean,
  },
  data() {
    return {
      //搜索相关
      search: "",
      restaurants: [],
    };
  },
  computed: {
    breadCrumbList() {
      return this.$store.state.app.breadCrumbList;
    },
    userAccount() {
      return this.$store.state.user.userInfo.account;
    },
  },
  mounted() {
    this.restaurants = this.menuList();
  },
  methods: {
    handleCollpasedChange(state) {
      this.$emit("on-coll-change", state);
    },
    //搜索相关
    //获取搜索列表
    menuList() {
      const queryList = [];
      this.childMenuList(queryList,this.$store.getters.menuList);
      return queryList;
    },
    //递归循环 来完成对搜索列表的构建
    childMenuList(list,menu) {
      menu.forEach((item) => {
        if (item.hasOwnProperty("children")) {
          this.childMenuList(list,item.children);
        } else {
          item.title = item.meta.title;
          list.push(item);
        }
      });
    },
    //查询搜索列表
    querySearchMenu(queryString, cb) {
      let restaurants = this.restaurants;
      let results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    //单个菜单的title是否匹配搜索输入的字符串
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.meta.title.toLowerCase().indexOf(queryString.toLowerCase()) !==
          -1
        );
      };
    },
    //选择菜单后的跳转
    handleSelect(item) {
      // this.turnToPage(item.name);
      this.$emit("queryTurnPage", item.name);
    },
    closeAllOpenedRouter(){
      this.$emit('closeAllOpenedRouter');
    },
  },
};
</script>
<style lang="less" scoped>
@import "./header-bar.less";
</style>

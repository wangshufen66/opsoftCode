<template>
  <el-container class="main">
    <div
      v-if="device === 'mobile' && !collapsed"
      class="drawer-bg"
      @click="handleCollapsedChange(!collapsed)"
    ></div>
    <el-aside
      :width="!collapsed ? '180px' : device === 'mobile' ? '0px' : '64px'"
    >
      <side-menu
        accordion
        ref="sideMenu"
        :active-name="$route.name"
        :collapsed="collapsed"
        @on-select="turnToPage"
        :menu-list="accessMenuListRes"
      >
        <div class="logo-con">
          <img v-show="!collapsed" :src="maxLogo" alt="苏州欧软"/>
          <img v-show="collapsed" :src="minLogo" alt="苏州欧软"/>
        </div>
      </side-menu>
    </el-aside>
    <el-container>
      <el-header class="header-con">
        <header-bar
          :collapsed="collapsed"
          @on-coll-change="handleCollapsedChange"
          @queryTurnPage="turnToPage"
          @closeAllOpenedRouter="closeAllOpenedRouter"
        >
        </header-bar>
      </el-header>
      <el-main class="main-content-con">
        <el-container class="main-layout-con">
          <el-header class="tag-nav-wrapper">
            <tags-nav
              ref="tagsNav"
              :value="$route"
              @input="handleClick"
              :list="tagNavList"
              @on-close="handleCloseTag"
            />
          </el-header>
          <el-main class="content-wrapper">
            <!-- <keep-alive :include="cacheList">
              <router-view v-if="isRouterAlive" />
            </keep-alive>-->
            <!--<keep-alive :max="3">-->
            <keep-alive :max="15">
              <router-view></router-view>
            </keep-alive>
            <!--</keep-alive>-->
            <template>
              <el-backtop target=".content-wrapper" :right="60" :bottom="80">
                <div>
                  <i class="el-icon-arrow-up"></i>
                </div>
              </el-backtop>
            </template>
          </el-main>
        </el-container>
        <div class="robot-wrapper">
          <div v-show="showElement" ref="chatDialog" class="chat-dialog">
            <div ref="dialogHeader" class="dialog-header">
              <img class="dialog-avatar" src="@/assets/homeRobot/avatar.png"/>
              <div class="dialog-title">智能对话平台机器人</div>
            </div>
            <div
              v-show="showChat"
              id="dialogprimary"
              ref="dialogPrimary"
              class="dialog-primary"
            >
              <div
                v-for="(item, index) in testData"
                :key="index"
                :style="`justify-content: ${item.position}`"
                class="chatbox-wrapper"
              >
                <img
                  v-if="item.type === 'receive'"
                  src="@/assets/homeRobot/avatar2.png"
                />
                <div
                  :style="`background-color: ${item.backgroundColor}`"
                  class="chatbox-inner"
                >
                  <a
                    v-if="item.messageType == 'link-web'"
                    :style="`word-wrap:break-word;`"
                    :href="item.msg"
                    target="_blank"
                  >{{ item.msg }}</a
                  >
                  <company-location
                    :uid="index"
                    style="width: 150px; height: 150px"
                    v-else-if="item.messageType == 'link-ppt'"
                  ></company-location>
                  <p v-else :style="`color: ${item.color}`">{{ item.msg }}</p>
                  <p
                    style="margin: 6px 0 4px 0"
                    :style="`color: ${item.color}`"
                  >
                    {{ item.leading }}
                  </p>
                  <p
                    @click="handleClickHighlightOpts(i)"
                    style="color: #3098ff; cursor: pointer"
                    v-for="(i, index) in item.options"
                    :key="index"
                  >
                    {{ i }}
                  </p>
                  <p
                    style="
                      color: rgba(0, 0, 0, 0.4);
                      font-size: 12px;
                      margin-top: 4px;
                    "
                  >
                    {{ item.ending }}
                  </p>
                </div>
                <img
                  v-if="item.type === 'send'"
                  src="@/assets/homeRobot/user.png"
                />
              </div>
            </div>
            <el-form
              @submit.native.prevent
              @keydown.enter.native="sendChat"
              ref="dialogFooter"
              class="dialog-footer"
            >
              <el-input
                class="chat-input"
                v-model="chatInput"
                placeholder="请输入想要问的问题"
              ></el-input>
              <div @click="sendChat" class="send-btn">
                <img src="@/assets/homeRobot/input.png"/>
              </div>
            </el-form>
          </div>
          <div @click="handleTraggerClicked">
            <el-card class="support-wrapper">
              <img v-if="!isDialogOpen" src="@/assets/images/kefu.png"/>
              <img
                v-else
                style="width: 24px; height: 24px; margin: 6px"
                src="@/assets/images/killkefu.png"
              />
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>

    <get-location></get-location>
  </el-container>
</template>
<style lang="less" scoped>
  //机器人相关样式
  .robot-wrapper {
    z-index: 50;
    position: fixed;
    right: 55px;
    bottom: 56px;

    .chat-dialog {
      width: 370px;
      height: 560px;
      // transition: all 0.2s;
      border-radius: 5px;
      box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2);

      .dialog-header {
        display: flex;
        width: 100%;
        height: 12%;
        background-color: #2f7fe3;

        .dialog-avatar {
          position: relative;
          top: 15px;
          margin: 0 20px;
          width: 10%;
          height: 55%;
          border-radius: 50%;
          background-color: white;
        }

        .dialog-title {
          margin: auto 0;
          width: 40%;
          white-space: nowrap;
          color: white;
          font-size: 16px;
          font-weight: 500;
        }
      }

      .dialog-primary {
        width: 100%;
        // height: calc(100% - 64px - 56px);
        height: 78%;
        background-color: white;
        padding: 20px 10px;
        overflow-y: scroll;

        img {
          margin: auto 5px auto 5px;
          width: 36px;
          height: 36px;
        }

        .chatbox-wrapper {
          display: flex;
          width: 100%;
          margin: 0 0 20px 0;

          .chatbox-inner {
            max-width: 50%;
            background-color: aquamarine;
            padding: 6px;
            margin: 0 3px;
            border-radius: 5px;
            box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);

            p {
              font-size: 13px;
              color: black;
            }
          }
        }
      }

      .dialog-footer {
        display: flex;
        width: 100%;
        height: 10%;
        background-color: #f3f3f3;

        ::v-deep {
          .el-input__inner {
            border: 1px solid transparent;
            background-color: #f3f3f3;
            height: 100%;
          }
        }

        .chat-input {
          width: 75%;
          height: 100%;
        }

        .send-btn {
          width: 25%;
          text-align: center;
          cursor: pointer;

          img {
            position: relative;
            left: 20px;
            top: 18px;
            width: 24px;
            height: 20px;
          }
        }
      }
    }

    .trigger-btn-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;

      .trigger-icon {
        cursor: pointer;
        width: 100px;
        height: 100px;
      }

      i {
        font-size: 25px;
        transition: all 0.5s;
      }
    }
  }

  ::v-deep {
    .el-card__body {
      padding: 7px;
    }
  }

  .support-wrapper {
    position: fixed;
    width: 50px;
    height: 50px;
    bottom: 56px;
    right: 0;
    z-index: 10;
    background-color: white;
    cursor: pointer;

    img {
      width: 36px;
      height: 36px;
    }
  }
</style>
<style lang="less" scoped>
  @import "./main.less";
</style>

<script>
  import SideMenu from "./components/side-menu/side-menu";
  import HeaderBar from "./components/header-bar/header-bar";
  import TagsNav from "./components/tags-nav/tags-nav";
  import {mapMutations, mapActions, mapGetters} from "vuex";
  import {getNewTagList, routeEqual} from "@/libs/util";
  import routers from "@/router/routers";
  import minLogo from "@/assets/images/logo-min.png";
  import maxLogo from "@/assets/images/logo.png";
  import CompanyLocation from "@/components/CompanyLocation.vue";
  import getLocation from "@/components/getLocationData.vue";

  export default {
    name: "Main",
    components: {
      SideMenu,
      HeaderBar,
      TagsNav,
      CompanyLocation,
      getLocation,
    },
    data() {
      return {
        isRouterAlive: true, //刷新路由使用
        collapsed: false,
        minLogo,
        maxLogo,
        accessMenuListRes: [],

        agentId: "bda10aba-ce0f-45d2-889e-863b5abcdf08",
        activeIndex: "1",
        // 当前版本号
        isDialogOpen: false,
        showElement: false,
        showChat: true,
        hasDownloadDialog: false,
        isIn: false,
        chatInput: "",
        testData: [
          {
            type: "receive",
            leading: "",
            ending: "",
            options: "",
            messageType: "text",
            msg:
              "我是您最贴心的智能客服小欧 , 你可以尝试问我关于IDCloud, 欧软等问题 ~",
            backgroundColor: "#F3F3F3",
            color: "black",
            position: "flex-start",
          },
        ],
      };
    },
    computed: {
      ...mapGetters(["errorCount"]),
      tagNavList() {
        return this.$store.state.app.tagNavList;
      },
      tagRouter() {
        return this.$store.state.app.tagRouter;
      },
      cacheList() {
        const list = [
          "ParentView",
          ...(this.tagNavList.length
            ? this.tagNavList
              .filter((item) => !(item.meta && item.meta.notCache))
              .map((item) => item.name)
            : []),
        ];
        return list;
      },
      // 当前用户具有权限的所有菜单
      menuList() {
        return this.$store.getters.menuList;
      },
      // 当前用户具有权限的菜单英文名称数组
      accessMenu() {
        return this.$store.state.user.access;
      },
      local() {
        return this.$store.state.app.local;
      },
      hasReadErrorPage() {
        return this.$store.state.app.hasReadErrorPage;
      },
      device() {
        return this.$store.state.app.device;
      },
    },
    //屏幕自适应事件
    beforeMount() {
      window.addEventListener("resize", this.resizeHandler);
    },
    beforeDestroy() {
      window.removeEventListener("resize", this.resizeHandler);
    },
    //屏幕自适应事件
    methods: {
      //屏幕自适应判断宽度是否小于900
      isMobile() {
        const rect = document.body.getBoundingClientRect();
        return rect.width < 900;
      },
      //屏幕自适应处理宽度
      resizeHandler() {
        const isMobile = this.isMobile();
        this.$store.dispatch("toggleDevice", isMobile ? "mobile" : "desktop");
      },
      async requestChat(param) {
        let res = {};
        await this.$http
          .post(`https://deportal.mmais.com.cn/api/${this.agentId}/Dialog`, param)
          .then((response) => {
            res = response;
          })
          .catch((error) => {
            console.log(error);
          });
        return res;
      },
      chatHitGround() {
        this.$refs.dialogPrimary["scrollTop"] = this.$refs.dialogPrimary[
          "scrollHeight"
          ];
      },
      async sendChat() {
        const input = this.chatInput;
        let param = {
          actionAreaId: "default",
          channelId: "default",
          input: {
            query: {
              queryText: input,
            },
          },
          sessionMeta: {
            province: this.$store.state.publicParams.userLocation.province,
            city: this.$store.state.publicParams.userLocation.city,
            district: this.$store.state.publicParams.userLocation.district,
            lng: this.$store.state.publicParams.userLocation.lng,
            lat: this.$store.state.publicParams.userLocation.lat,
          },
        };
        if (this.$store.state.publicParams.chatbotSessionId !== "") {
          param.sessionId = this.$store.state.publicParams.chatbotSessionId;
        }

        this.testData.push({
          type: "send",
          leading: "",
          msg: input,
          ending: "",
          options: "",
          messageType: "text",
          backgroundColor: "#2F7FE3",
          color: "white",
          position: "flex-end",
        });
        this.chatInput = "";
        const res = await this.requestChat(param);
        let alreadyHasOptions = false;
        res.data.queryResult.responseText.forEach((element) => {
          const r = JSON.parse(element.content);
          if (r.Options.length > 0) {
            alreadyHasOptions = true;
          }
          this.testData.push({
            type: "receive",
            messageType: element.type,
            leading: r.LeadingMessage,
            ending: r.EndingMessage,
            options: r.Options,
            msg: r.Text,
            backgroundColor: "#F3F3F3",
            color: "black",
            position: "flex-start",
          });
        });
        if (res.data.webhookStatus && res.data.webhookStatus.statusCode == 200) {
          if (res.data.queryResult.actionName === "getWeather") {
            let m = "今天天气真不错";
            const tm = parseInt(res.data.queryResult.sessionMeta.feelsLike);
            if (tm > 28) {
              m = "哇 我要热死啦 ！快点把空调、冰淇淋安排上！！";
            }
            if (tm > 26 && tm <= 28) {
              m = "今天有点热呀！";
            }
            if (tm > 22 && tm <= 26) {
              m = "今天天气很舒适！";
            }
            if (tm > 15 && tm <= 22) {
              m = "记得添衣哦~";
            }
            if (tm > 9 && tm <= 15) {
              m = "已经被迫进入冬天的节奏了呢！";
            }
            if (tm <= 9) {
              m = "艾迪已经冻得不想说话了呢";
            }
            this.testData.push({
              type: "receive",
              messageType: "text",
              leading: "",
              ending: "",
              options: "",
              msg: m,
              backgroundColor: "#F3F3F3",
              color: "black",
              position: "flex-start",
            });
          }
        }
        if (!alreadyHasOptions) {
          if (res.data.queryResult.alternativeAnswers.length > 0) {
            let qs = [];
            res.data.queryResult.alternativeAnswers.forEach((i) => {
              qs.push(i["standardQuestion"]);
            });
            this.testData.push({
              type: "receive",
              messageType: "text",
              leading: "您是否还想了解",
              ending: "点击问题了解更多",
              options: qs,
              msg: "",
              backgroundColor: "#F3F3F3",
              color: "black",
              position: "flex-start",
            });
          }
        }

        if (res.status !== 200) {
          this.$message("网络似乎不太稳定, 没有收到回应");
          return;
        }
        this.$store.dispatch("setSessionId", res.data.sessionId);
      },
      handleClickHighlightOpts(i) {
        this.chatInput = i;
        this.sendChat();
      },
      handleTraggerClicked() {
        this.isDialogOpen = !this.isDialogOpen;
        !this.isDialogOpen
          ? (this.showElement = false)
          : (this.showElement = true);
      },
      ...mapMutations([
        "setBreadCrumb",
        "setTagNavList",
        "addTag",
        "setLocal",
        "setHomeRoute",
        "closeTag",
      ]),
      ...mapActions(["handleLogin"]),
      turnToPage(route) {
        let {name, params, query} = {};
        if (typeof route === "string") name = route;
        else {
          name = route.name;
          params = route.params;
          query = route.query;
        }
        if (name.indexOf("isTurnByHref_") > -1) {
          window.open(name.split("_")[1]);
          return;
        }
        if (name !== this.$router.currentRoute.name)
          this.$router.push({
            name,
            params,
            query,
          });
      },
      handleCollapsedChange(state) {
        this.collapsed = state;
        this.$store.commit("changeCollapsed", state);
      },
      handleCloseTag(res, type, route) {
        if (type !== "others") {
          if (type === "all") {
            this.turnToPage(this.$config.homeName);
          } else {
            if (routeEqual(this.$route, route)) {
              this.closeTag(route);
            }
          }
        }
        this.setTagNavList(res);
      },
      handleClick(item) {
        this.turnToPage(item);
      },
      //关闭导航栏上的所有标签界面
      closeAllOpenedRouter() {
        this.$refs.tagsNav.handleTagsOption("close-all");
      },
    },
    watch: {
      "testData.length"(n) {
        this.$nextTick(() => {
          this.chatHitGround();
        });
      },
      $route(newRoute) {
        const {name, query, params, meta} = newRoute;
        this.addTag({
          route: {
            name,
            query,
            params,
            meta,
          },
          type: "push",
        });
        this.setBreadCrumb(newRoute);
        this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
        this.$refs.sideMenu.updateOpenName(newRoute.name);
      },
    },
    mounted() {
      //切换组织相关
      this.orgId = this.$store.state.user.userInfo.orgId;
      this.orgName = this.$store.state.user.userInfo.orgName;
      this.accessMenuListRes = this.menuList;
      // @description 初始化设置面包屑导航和标签导航
      this.setTagNavList(); // 初始化获取localStorage的标签
      this.setHomeRoute(routers);
      const {name, params, query, meta} = this.$route;
      this.addTag({
        // 添加当前路由（首页路由）
        route: {
          name,
          params,
          query,
          meta,
        },
      });
      this.setBreadCrumb(this.$route);
      // 设置初始语言
      // this.setLocal(this.$i18n.locale);
      // 如果当前打开页面不在标签栏中，跳到homeName页
      if (!this.tagNavList.find((item) => item.name === this.$route.name)) {
        this.$router.push({
          name: this.$config.homeName,
        });
      }
      //自适应屏幕处理
      const isMobile = this.isMobile();
      if (isMobile) {
        this.$store.dispatch("toggleDevice", "mobile");
      }
    },
  };
</script>

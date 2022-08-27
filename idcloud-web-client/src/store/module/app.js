import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
} from "@/libs/util";
import router from "@/router";
import routers from "@/router/routers";
import config from "@/config";

const { homeName } = config;

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter((item) => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

export default {
  state: {
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead("local"),
    device: "desktop",
  },
  getters: {
    menuList: (state, getters, rootState) =>
      getMenuByRouter(routers, rootState.user.access),
  },
  mutations: {
    //提交是否是手机程序
    TOGGLE_DEVICE: (state, device) => {
      state.device = device;
    },
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setTagNavList(state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else {
        tagList = getTagNavListFromLocalstorage() || [];
      }
      // 如果有首页，且首页不是第一位，就将其换到第一位
      const homeTagIndex = tagList.findIndex((item) => item.name === homeName);
      if (homeTagIndex > 0) {
        const homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    closeTag(state, route) {
      const tag = state.tagNavList.filter((item) => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      closePage(state, route);
    },
    addTag(state, { route, type = "unshift" }) {
      const router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === "push") {
          state.tagNavList.push(router);
        } else {
          if (router.name === homeName) {
            state.tagNavList.unshift(router);
          } else {
            state.tagNavList.splice(1, 0, router);
          } // 向数组第二位加，第一位永远是首页
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    setLocal(state, lang) {
      localSave("local", lang);
      state.local = lang;
    },
  },
  actions: {
    toggleDevice({ commit }, device) {
      commit("TOGGLE_DEVICE", device);
    },
  },
};

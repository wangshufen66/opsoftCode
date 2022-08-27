import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  // 千机智能
  {
    path: "/dashboard/qianji/cardview",
    name: "dashboard-qianji-cardview",
    component: () =>
      import("../views/dashboard/qianji/cardview/index.vue")
  },
  // 超限预警
  {
    path: "/dashboard/common/overflowWarning",
    name: "dashboard-overflow-warning",
    component: () =>
      import("../views/dashboard/common/overflowWarning/index.vue")
  },
  // 设备运行统计
  {
    path: "/dashboard/common/deviceUsage",
    name: "dashboard-common-deviceUsage",
    component: () =>
      import("../views/dashboard/common/deviceUsage/index.vue")
  },
  // 设备实时监控
  {
    path: "/dashboard/common/realtimeMonitoring",
    name: "dashboard-common-realtimeMonitoring",
    component: () =>
      import("../views/dashboard/common/realtimeMonitoring/index.vue")
  },
  // 微信
  {
    path: "/wechat/official-account",
    name: "wechat-official-account",
    component: () =>
      import("../views/wechat/official-account/index.vue")
  },
  // 微信图表测试
  {
    path: "/wechat/chartsTest",
    name: "wechat-chart-test",
    component: () =>
      import("../views/wechat/chartsTest/index.vue")
  },
  // 质检看板
  {
    path: "/kanban/qualityControl",
    name: "quality-control-kanban",
    props: (route) => (
      {
        url: route.query.url,
        orgId: route.query.orgId,
      }
    ), //  => 布尔模式 =》 动态对象
    component: () =>
      import("../views/dashboard/qualityControl/index.vue")
  },
  // 设备运行监控
  {
    path: "/kanban/deviceRunMonitor",
    name: "deviceRunMonitor",
    props: (route) => (
      {
        url: route.query.url,
        orgId: route.query.orgId,
      }
    ), //  => 布尔模式 =》 动态对象
    component: () =>
      import("../views/dashboard/deviceRunMonitor/index.vue")
  },
  // 设备维保看板
  {
    path: "/kanban/deviceMaintenance",
    name: "deviceMaintenance",
    props: (route) => (
      {
        url: route.query.url,
        orgId: route.query.orgId,
      }
    ), //  => 布尔模式 =》 动态对象
    component: () =>
      import("../views/dashboard/deviceMaintenance/index.vue")
  },
  // 生产看板
  {
    path: "/kanban/production",
    name: "production",
    props: (route) => (
      {
        url: route.query.url,
        orgId: route.query.orgId,
      }
    ), //  => 布尔模式 =》 动态对象
    component: () =>
      import("../views/dashboard/production/index.vue")
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach

export default router;

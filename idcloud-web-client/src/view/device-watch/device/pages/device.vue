<template>
  <div class="device-container">
    <div class="up-wrapper">
      <div class="up-left">
        <div class="up-left-title-wrapper">
          <span>{{ treeData.ctrName }}</span>
          <div
            @click="handleClickRefresh"
            style="height: 42px; line-height: 42px; margin-left: 8px; cursor: pointer; font-size: 14px; color: #266DEB;"
          >
            刷新
          </div>
        </div>
        <div class="up-left-subtitle-wrapper">
          <div>
            <span>{{ treeData.ctrAddress }}</span>
          </div>
        </div>
        <div v-loading="topCard.loading" style="height: 100%">
          <div
            v-if="topCard.dataForShow.length === 0"
            class="up-left-img"
          ></div>
          <div v-else class="up-left-card-wrapper">
            <div
              v-for="item in topCard.dataForShow"
              :key="item.id"
              class="up-left-card-style"
            >
              <top-card :cardData="item"></top-card>
            </div>
          </div>
        </div>
      </div>
      <div class="up-right" style="width: 100%">
        <div
          style="display: flex; justify-content: center;flex-direction: column;position: relative;height: 100%"
        >
          <!--<el-image-->
          <!--class="el-image"-->
          <!--style="height: 300px;width: 480px"-->
          <!--:src="treeData.ctrImg"-->
          <!--:preview-src-list="[treeData.ctrImg]"-->
          <!--v-show="!picture.switch"-->
          <!--&gt;-->
          <!--<div slot="error" class="image-slot">-->
          <!--<img-->
          <!--style="height: 300px;width: 480px"-->
          <!--src="@/view/device-watch/device/assets/device.png"-->
          <!--alt=""-->
          <!--/>-->
          <!--</div>-->
          <!--</el-image>-->
          <!--<video-->
          <!--width="480"-->
          <!--v-show="picture.switch"-->
          <!--id="myPlayer"-->
          <!--ref="videoPlayer"-->
          <!--autoplay-->
          <!--:src="treeData.ctrVideo"-->
          <!--playsinline-->
          <!--webkit-playsinline-->
          <!--&gt;</video>-->
          <id-radio
            ref="idRadio"
            v-bind="idRadio"
            @change="queryChange"
            style="position: absolute;top:10px;right:0;z-index: 3000"
          ></id-radio>
          <div
            id="deviceStatus"
            style="width: 100%;height: 100%;margin-top: 10px"
          ></div>
        </div>
      </div>
    </div>
    <div style="margin-top: 22px" class="down-wrapper">
      <el-tabs v-model="tabValue" type="card">
        <el-tab-pane label="信息点" name="device">
          <el-table
            height="370px"
            :data="downCard.tableDataForShow"
            :header-cell-style="setTableRowStyle"
            border
          >
            <el-table-column
              align="center"
              type="index"
              width="45"
            ></el-table-column>

            <el-table-column
              v-for="item in downCard.tableColumn"
              :key="item.id"
              :prop="item.key"
              :label="item.title"
            ></el-table-column>
          </el-table>
          <div style="margin-top: 0.5rem" class="flex-center">
            <el-pagination
              @current-change="pageChange"
              :current-page.sync="page.current"
              :page-size="page.size"
              layout="total, prev, pager, next"
              :total="page.total"
            ></el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import apiMixin from "../apiMixins";
import topCard from "../components/topCard";
import downCard from "../components/downCard";
import deviceCard from "../components/deviceCard";
import "@/view/utils/ezuikit";
import { getEquipmentPieRateSlice } from "@/api/device-watch/device";
import authority from "@/components/authority";
import IdRadio from "@/components/id-radio/index";
import moment from "moment";
import echarts from "echarts";

export default {
  name: "deviceComp",
  mixins: [apiMixin],
  components: { topCard, downCard, deviceCard, IdRadio },
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
      }
    },
    treeNode: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      tabValue: "device",
      orgId: this.$store.state.user.userInfo.orgId,
      topCard: {
        loading: false,
        data: [],
        dataForShow: []
      },
      deviceChart: "", //饼状图
      deviceLeftOptions: {
        title: {
          text: "设备状态占比",
          left: "5%"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : ({d}%)"
        },
        xAxis: { show: false },
        yAxis: { show: false },
        legend: {
          orient: "vertical",
          right: "5%",
          bottom: "5%",
          data: ["故障状态", "运行状态", "离线状态", "调机状态", "待机状态"]
        },
        color: [
          "#e27e60",
          "#80dcaf",
          "#aaaaaa",
          "#f3c709",
          "#759dfd",
          "#E6FCE0"
        ],
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "65%",
            center: ["40%", "50%"],
            label: {
              show: true,
              formatter: "{b}{d}%",
              color: "#6D6D6D"
            },
            labelLine: {
              lineStyle: {
                color: "#6D6D6D"
              }
            },
            data: [
              { value: 0, name: "故障状态" },
              { value: 0, name: "运行状态" },
              { value: 0, name: "离线状态" },
              { value: 0, name: "调机状态" },
              { value: 0, name: "待机状态" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      }, //设备状态饼状图
      idRadio: {
        size: "mini",
        textColor: "#409eff",
        fill: "#ffffff",
        defaultValue: "今日",
        options: [
          {
            label: "今日",
            authority: new authority()
          },
          {
            label: "近7天",
            authority: new authority()
          },
          {
            label: "近30天",
            authority: new authority()
          }
        ]
      }, //饼状图 查询组件 radio组件
      status: {
        0: { name: "离线状态", color: "#B0B0B0" },
        1: { name: "运行状态", color: "#6BC855" },
        2: { name: "待机状态", color: "#2F7FE3" },
        3: { name: "调机状态", color: "#FAA819" },
        4: { name: "故障状态", color: "#F9605A" }
      },

      page: {
        current: 1,
        total: 0,
        size: 8
      },
      downCard: {
        loading: false,
        data: [],
        dataForShow: [],
        tableData: [],
        tableDataForShow: [],
        tableColumn: [
          { title: "信息点编码", key: "ctrNumber" },
          { title: "信息点名称", key: "ctrName" },
          { title: "数值", key: "pointValue" },
          { title: "单位", key: "pointUnit" },
          { title: "设定值", key: "setValue" },
          { title: "偏差值", key: "deviation" },
          { title: "采集时间", key: "collectTime" },
          { title: "备注", key: "mark" }
        ]
      },
      picture: {
        // false - pic   true - video
        switch: false,
        player: ""
      }
    };
  },
  watch: {
    treeData: {
      handler(n) {
        this.topCard.data = [];
        this.topCard.dataForShow = [];
        this.picture.switch = false;
        if (this.picture.player !== "") {
          this.picture.player.stop();
        }

        this.picture.player = "";
        this.getPointData();
        this.queryChange();
      },
      immediate: true
    }
  },
  beforeDestroy() {
    if (this.picture.player !== "") {
      this.picture.player.stop();
    }
    this.picture.player = "";
  },
  mounted() {
    this.queryChange();
  },
  methods: {
    handleClickRefresh() {
      this.page.current = 1;
      this.getPointData();
    },
    switchVideoPic() {
      if (this.picture.switch === true) {
        // this.picture.player.stop();
        this.picture.switch = false;
      } else {
        this.picture.switch = true;
        if (this.picture.player === "") {
          this.$nextTick(() => {
            let playerdom = this.$refs.videoPlayer;
            try {
              this.picture.player = new EZUIKit.EZUIPlayer(playerdom);
              this.picture.player.play();
            } catch (e) {}
          });
        } else {
          // this.picture.player.play();
        }
      }
    },
    pageChange(val) {
      this.downCard.tableDataForShow = this.downCard.tableData.slice(
        (val - 1) * 8,
        (val - 1) * 8 + 8
      );
      this.downCard.dataForShow = this.downCard.data.slice(
        (val - 1) * 8,
        (val - 1) * 8 + 8
      );
    },
    async getPointData() {
      const param = { orgId: this.orgId, id: this.treeData.id };
      this.topCard.loading = true;
      let res = await this.getInfoPointData(param);

      this.topCard.data = res.data.data;
      // TODO 这里限制只显示前4个，将来改可配置
      // this.topCard.dataForShow = this.topCard.data.slice(0, 4);
      this.topCard.dataForShow = this.topCard.data;

      this.downCard.data = res.data.data;
      this.downCard.tableData = res.data.data;
      this.page.total = this.downCard.tableData.length;
      this.downCard.tableDataForShow = this.downCard.tableData.slice(0, 8);
      // this.downCard.dataForShow = this.downCard.data.slice(0, 8);
      this.topCard.loading = false;
    },
    switchCardTable() {
      this.downStyle = !this.downStyle;
    },
    setTableRowStyle() {
      return "background: #F8F8F9; color:#606266";
    },
    queryChange() {
      const params = {
        orgId: this.$store.state.user.userInfo.orgId,
        id: this.treeData.id
      };
      const value = this.$refs.idRadio.vModel;
      const tomorrowNow = new Date(Date.now());
      const tomorrow = tomorrowNow.setDate(tomorrowNow.getDate() + 1);
      switch (value) {
        case "今日":
          const now = new Date(Date.now());
          params.startTime = moment(now).format("YYYY-MM-DD 00:00:00");
          params.endTime = moment(tomorrow).format("YYYY-MM-DD 00:00:00");
          break;
        case "近7天":
          const weekNow = new Date(Date.now());
          const week = weekNow.setDate(weekNow.getDate() - 7);
          params.startTime = moment(week).format("YYYY-MM-DD 00:00:00");
          params.endTime = moment(tomorrow).format("YYYY-MM-DD 00:00:00");
          break;
        case "近30天":
          const monthNow = new Date(Date.now());
          const month = monthNow.setDate(monthNow.getDate() - 30);
          params.startTime = moment(month).format("YYYY-MM-DD 00:00:00");
          params.endTime = moment(tomorrow).format("YYYY-MM-DD 00:00:00");
          break;
      }
      this.getDeviceStatusChart(params);
    },
    async getDeviceStatusChart(params) {
      this.deviceChart = echarts.init(document.getElementById("deviceStatus"));
      // 空载状态 =》 上方/右侧/表
      // this.deviceLeftOptions.legend.data = ['故障状态', '运行状态', '离线状态', '调机状态', '待机状态', '空载状态'];
      // this.deviceLeftOptions.series[0].data = [
      //   {value: 0, name: '故障状态'},
      //   {value: 0, name: '运行状态'},
      //   {value: 0, name: '离线状态'},
      //   {value: 0, name: '调机状态'},
      //   {value: 0, name: '待机状态'},
      //   {value: 0, name: '空载状态'},
      // ];
      this.deviceLeftOptions.legend.data = [
        "故障状态",
        "运行状态",
        "离线状态",
        "调机状态",
        "待机状态"
      ];
      this.deviceLeftOptions.series[0].data = [
        { value: 0, name: "故障状态" },
        { value: 0, name: "运行状态" },
        { value: 0, name: "离线状态" },
        { value: 0, name: "调机状态" },
        { value: 0, name: "待机状态" }
      ];
      await getEquipmentPieRateSlice(params)
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach(rItem => {
              const dIndex = this.deviceLeftOptions.series[0].data.findIndex(
                dItem => dItem.name.startsWith(this.status[rItem.name].name)
              );
              if (dIndex >= 0)
                this.deviceLeftOptions.series[0].data[dIndex].value =
                  rItem.percent;
            });
          } else {
            this.$notifyError(`获取设备状态占比图失败`, res.data.msg);
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          this.deviceChart.setOption(this.deviceLeftOptions);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>

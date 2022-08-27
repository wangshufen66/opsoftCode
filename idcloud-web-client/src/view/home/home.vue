<template>
  <div id="org-admin-container">
    <div class="head-line-wrapper">
      <div class="left-col">
        <div class="monitor-title">
          <span class="model-title">数据监测</span>
          <div class="model-more" @click="handleClickManageModule">
            管理模块
          </div>
        </div>
        <div class="head-grid-wrapper" v-loading="miniCardContainerLoading">
          <mini-card
            class="mini-card-style"
            v-for="item in homePageMiniCard"
            :key="item.title"
            :isLongVersion="true"
            :miniCardData="item"
          ></mini-card>
        </div>
      </div>
      <div class="right-col">
        <span class="model-title">企业信息</span>
        <div class="company-card-wrapper">
          <div>
            <div class="text-left">企业名称:</div>
            <div class="text-right">{{ org.enterpriseName }}</div>
          </div>
          <div>
            <div class="text-left">社会统一识别码:</div>
            <div class="text-right">{{ org.enterpriseSocialCreditCode }}</div>
          </div>
          <div>
            <div class="text-left">使用期限:</div>
            <div class="text-right">{{ org.expireTime }}</div>
          </div>
          <div>
            <div class="text-left">企业地址:</div>
            <div class="text-right">{{ org.enterpriseAddress }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="model-title second-line-title-wrapper">统计分析</div>
    <div v-loading="chartCardContainerLoading" class="chart-container">
      <div
        v-for="(item, index) in homePageCard"
        :key="item.title"
        class="container-card"
      >
        <div class="card-top">
          <h3>{{ item.title }}</h3>
          <div>
            <id-radio
              ref="idRadio"
              v-bind="item.idRadio"
              @change="queryChange($event, index)"
            ></id-radio>
            <id-button
              v-bind="idMore"
              @click="routerPush(item.target)"
            ></id-button>
          </div>
        </div>
        <div :id="'chart' + index" style="width: 100%;height: 95%"></div>
      </div>
    </div>

    <el-dialog
      :visible.sync="manageModuleDialogVisible"
      top="50px"
      width="68rem"
      @opened="miniCardDialogOpen"
      :show-close="false"
      :before-close="handleManageModuleDialogFin"
    >
      <span slot="title" class="manage-module-header">
        <span>管理模块</span>
        <div>
          <el-button @click="handleManageModuleDialogFin" size="small"
            >取 消</el-button
          >
          <el-button
            type="primary"
            :loading="miniCardSubmitBtnLoading"
            @click="handleManageModuleConfirm"
            size="small"
            >确 定</el-button
          >
        </div>
      </span>
      <div class="mini-card-dialog-container">
        <div
          v-for="item in miniCardInfo"
          :key="item.id"
          class="mini-card-dialog-inner"
        >
          <mini-card
            ref="dialogMiniCard"
            @checkBoxChange="dialogMiniCardSelectedChange"
            :isLongVersion="true"
            :isDisabled="item.disabled"
            :isChecked="item.checked"
            :hasCheckBox="true"
            :miniCardData="item"
          ></mini-card>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import miniCard from "../single-page/newHome/components/miniCard/index";
import IdRadio from "@/components/id-radio/index";
import IdButtonConfig from "@/components/id-button/IdButtonConfig";
import IdButton from "@/components/id-button/index";
import authority from "@/components/authority";
import { getUsualModuleList } from "@/api/mainPage/user";
import { getUserCollect, updateUserCollect } from "@/api/mainPage/orgAdmin";
import {
  getEquipmentRate,
  getFaultUnfinishedCount,
  getWarningUnfinishedCount,
  getOrgDetail,
  running,
  usage,
  err,
  finalMaterialPlanActualProduceNumChart,
  produceStatics
} from "@/api/mainPage/home";
import moment from "moment";
import echarts from "echarts";
import deviceStatusMixins from "@/mixins/deviceStatusMixins";

export default {
  name: "home",
  components: { miniCard, IdRadio, IdButton },
  mixins: [deviceStatusMixins],
  data() {
    return {
      orgId: this.$store.state.user.userInfo.orgId,
      usualId: "",
      miniCardContainerLoading: false,
      chartCardContainerLoading: false,
      miniCardSubmitBtnLoading: false,

      initUsualFlag: false,

      manageModuleDialogVisible: false,

      miniCardCollectionId: "",

      miniCardInfo: [
        {
          id: 2001,
          borderColor: "#2F6796",
          title: "设备总量",
          icon: require("@/assets/deviceMonitor/all.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2002,
          borderColor: "#58C34C",
          title: "运行设备数量",
          icon: require("@/assets/deviceMonitor/run.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2003,
          borderColor: "#83AAF8",
          title: "待机设备数量",
          icon: require("@/assets/deviceMonitor/wait.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2004,
          borderColor: "#A7A7A7",
          title: "离线设备数量",
          icon: require("@/assets/deviceMonitor/offline.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2005,
          borderColor: "#FAA819",
          title: "调机设备数量",
          icon: require("@/assets/deviceMonitor/adjust.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2006,
          borderColor: "#FF7E71",
          title: "故障设备数量",
          icon: require("@/assets/deviceMonitor/error.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2007,
          borderColor: "#FF7E71",
          title: "故障信息",
          icon: require("@/assets/homepage/orgAdminHeadPic/12.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        },
        {
          id: 2008,
          borderColor: "#FF4F50",
          title: "预警信息",
          icon: require("@/assets/homepage/orgAdminHeadPic/5.png"),
          unit: "",
          number: 0,
          loading: false,
          disabled: false,
          checked: false
        }
        // 空载状态 =》卡片
        // {
        //   id: 2009,
        //   borderColor: "#E6FCE0",
        //   title: "空载设备",
        //   icon: require("@/assets/deviceMonitor/empty.png"),
        //   unit: "",
        //   number: 0,
        //   loading: false,
        //   disabled: false,
        //   checked: false
        // },
      ],
      selectedMiniCard: [],
      homePageMiniCard: [],

      idMore: new IdButtonConfig("button-more", "更多", "more", {
        styleTwo: true
      }), //更多按钮
      homePageCard: [
        {
          title: "设备运行统计状态",
          idRadio: [],
          target: "data_analysis_device_running",
          chart: null,
          chartOptions: {
            title: {
              text: "设备状态",
              left: "left",
              show: false
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
          }
        },
        {
          title: "设备利用率",
          idRadio: [],
          target: "data_analysis_device_usage",
          chart: null,
          chartOptions: {
            title: {
              text: "车间利用率",
              left: "left",
              show: false
            },
            tooltip: {
              formatter: "{b}:{c}%"
            },
            color: ["#73ddb2", "#e6e6e6"],
            series: [
              {
                name: "业务指标",
                type: "gauge",
                radius: "80%",
                center: ["50%", "55%"], // 默认全局居中
                axisLine: {
                  lineStyle: {
                    width: 20,
                    color: [
                      [0, "#73ddb2"],
                      [1, "#e6e6e6"]
                    ]
                  }
                },
                axisLabel: {
                  show: true,
                  color: "#000000",
                  distance: -5
                },
                pointer: {
                  show: true,
                  length: "60%"
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: "#ffffff"
                  }
                },
                axisTick: {
                  show: true,
                  splitNumber: 10,
                  lineStyle: {
                    color: "#ffffff"
                  }
                },
                title: {
                  show: true,
                  offsetCenter: [0, "60%"]
                },
                detail: {
                  formatter: "{value}%",
                  // offsetCenter: ["0", "50%"],
                  fontSize: 25
                },
                data: [{ value: 0, name: "利用率" }]
              }
            ]
          }
        },
        {
          title: "设备加工排行",
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
          target: "data_analysis_material_produce",
          chart: null,
          chartOptions: {
            title: {
              text: "物料产量分析",
              left: "left",
              show: false
            },
            tooltip: {},
            dataZoom: [
              {
                type: "slider",
                height: 20,
                minValueSpan: 4,
                maxValueSpan: 4
              }
            ],
            dataset: {
              source: [
                ["物料1", 372],
                ["物料2", 412],
                ["物料3", 385],
                ["物料4", 352],
                ["物料5", 352],
                ["物料6", 520],
                ["物料7", 180]
              ]
            },
            xAxis: {
              type: "category",
              axisLabel: {
                interval: 0
              }
            },
            yAxis: {},
            color: ["#719df7", "#73ddb2"],
            series: [{ type: "bar", label: { show: true, position: "top" } }]
          }
        },
        {
          title: "故障报警次数",
          idRadio: [],
          target: "data_analysis_device_err",
          chart: null,
          chartOptions: {
            title: {
              text: "故障预警次数",
              left: "left",
              show: false
            },
            legend: {
              top: "0%"
            },
            tooltip: {},
            dataZoom: [
              {
                type: "slider",
                height: 20,
                minValueSpan: 4,
                maxValueSpan: 4
              }
            ],
            color: ["#f6c639", "#ea7e65", "#7ca5f8"],
            dataset: {
              source: [
                ["product", "最近24小时", "最近7天", "最近一个月"]
                // ['Z01', 10, 17, 93],
                // ['Z02', 20, 30, 40],
                // ['Z03', 10, 34, 60],
                // ['Z04', 5, 8, 10]
              ]
            },
            xAxis: { type: "category" },
            yAxis: {},
            series: [
              { type: "bar", label: { show: true, position: "top" } },
              { type: "bar", label: { show: true, position: "top" } },
              { type: "bar", label: { show: true, position: "top" } }
            ]
          }
        },
        {
          title: "物料产量排行",
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
          target: "data_analysis_material_capacity",
          chart: null,
          chartOptions: {
            title: {
              text: "物料产量分析",
              left: "left",
              show: false
            },
            tooltip: {},
            dataset: {
              source: [
                ["物料1", 372],
                ["物料2", 412],
                ["物料3", 385],
                ["物料4", 352],
                ["物料5", 352],
                ["物料6", 520],
                ["物料7", 180]
              ]
            },
            dataZoom: [
              {
                type: "slider",
                height: 20,
                minValueSpan: 4,
                maxValueSpan: 4
              }
            ],
            xAxis: {
              type: "category",
              axisLabel: {
                interval: 0
              }
            },
            yAxis: {},
            color: ["#719df7", "#73ddb2"],
            series: [{ type: "bar", label: { show: true, position: "top" } }]
          }
        }
      ],
      //企业详情
      org: {}
    };
  },
  created() {
    this.init();
  },
  watch: {
    selectedMiniCard: {
      handler(n) {
        if (n.length >= 6) {
          this.miniCardInfo.forEach(i => {
            if (this.selectedMiniCard.indexOf(i) === -1) {
              i.disabled = true;
            }
          });
        } else {
          this.miniCardInfo.forEach(i => {
            i.disabled = false;
          });
        }
      },
      immediate: true
    }
  },
  methods: {
    async init() {
      await this.apiUsualModuleList();
      await this.apiUserCollect();

      const tomorrowNow = new Date(Date.now());
      const tomorrow = moment(
        tomorrowNow.setDate(tomorrowNow.getDate() + 1)
      ).format("YYYY-MM-DD 00:00:00");
      const now = moment(new Date(Date.now())).format("YYYY-MM-DD 00:00:00");
      this.getMiniCardData();
      this.getBottomChart(now, tomorrow);
    },
    async apiUpdateUserCollection(param) {
      try {
        let res = await Promise.resolve(updateUserCollect(param));
        if (res.data.code === 200) {
          return 200;
        } else {
          return 500;
        }
      } catch (e) {}
    },
    async apiUserCollect() {
      try {
        const param = {
          type: 0
        };
        let res = await Promise.resolve(getUserCollect(param));
        const data = res.data.data;
        this.homePageMiniCard = [];
        this.miniCardCollectionId = data.id;
        JSON.parse(data.collect).forEach(item => {
          this.miniCardInfo.forEach(i => {
            if (i.id === item) {
              this.homePageMiniCard.push(i);
              i.checked = true;
            }
          });
        });
      } catch (e) {}
    },
    miniCardDialogOpen() {
      this.$refs.dialogMiniCard.forEach(i => {
        i.isClickable();
      });
      this.apiUserCollect();
    },
    handleClickManageModule() {
      this.manageModuleDialogVisible = true;
    },
    handleManageModuleDialogFin() {
      this.manageModuleDialogVisible = false;
    },
    async handleManageModuleConfirm() {
      this.miniCardSubmitBtnLoading = true;
      let guiltyArr = [];
      this.selectedMiniCard.forEach(item => {
        guiltyArr.push(item.id);
      });
      const param = {
        id: this.miniCardCollectionId,
        type: 0,
        collect: guiltyArr
      };
      let res = await this.apiUpdateUserCollection(param);
      if (res === 200) {
        this.$message.success("添加收藏成功");
      } else {
        this.$notifyError("添加失败");
      }
      this.apiUserCollect();
      this.handleManageModuleDialogFin();
      this.miniCardSubmitBtnLoading = false;
    },
    // 常用模块 api
    async apiUsualModuleList() {
      try {
        let res = await getUsualModuleList();
        if (res.data.code === 200) {
          if (res.data.data.id === null && this.initUsualFlag === false) {
            // 初始化
            this.initUsualFlag = true;
            const param = {
              type: 2,
              orgId: this.orgId,
              collect: [10100, 10200, 10300, 10400, 20100, 20200]
            };
            await this.apiUpdateUserCollection(param);

            this.apiUsualModuleList();
          } else {
            this.usualId = res.data.data.id;
          }
        } else {
          this.$notifyError("失败", res.data.msg);
        }
      } catch (e) {}
    },
    handleRouterChange(path, parentPath) {
      this.$router.push({ path: `/${parentPath}/${path}` });
    },
    dialogMiniCardSelectedChange(value, id) {
      if (value) {
        this.miniCardInfo.forEach(item => {
          if (item.id === id) {
            if (this.selectedMiniCard.length < 6) {
              this.selectedMiniCard.push(item);
            }
          }
        });
      } else {
        this.selectedMiniCard.forEach((item, index, arr) => {
          if (item.id === id) {
            this.selectedMiniCard.splice(index, 1);
          }
        });
      }
    },
    //获取数据监测 和 企业信息
    getMiniCardData() {
      const params = {
        orgId: this.$store.state.user.userInfo.orgId
      };
      //获取各类设备数量
      let all = 0; //设备总量
      Promise.resolve(getEquipmentRate(params)).then(res => {
        res.data.data.forEach(rItem => {
          const mIndex = this.miniCardInfo.findIndex(mItem =>
            mItem.title.startsWith(this.status[rItem.x].name + "设备")
          );
          if (mIndex >= 0) {
            all += rItem.y;
            this.miniCardInfo[mIndex].number = rItem.y;
          }
        });
        this.miniCardInfo[0].number = all; //设备总量
      });
      //故障信息
      Promise.resolve(getFaultUnfinishedCount(params)).then(res => {
        this.miniCardInfo[6].number = res.data.data ? res.data.data : 0;
      });
      //预警信息
      Promise.resolve(getWarningUnfinishedCount(params)).then(res => {
        this.miniCardInfo[7].number = res.data.data ? res.data.data : 0;
      });
      //获取企业详情
      Promise.resolve(getOrgDetail(params)).then(res => {
        this.org = res.data.data;
      });
    },
    getBottomChart(startTime, endTime) {
      this.chartCardContainerLoading = true;
      this.initDeviceChart(startTime, endTime);
      this.initDeviceUsageChart(startTime, endTime);
      this.initMaterialProduceChart(startTime, endTime);
      this.initDeviceErrorChart();
      this.initMaterialCapacityChart(startTime, endTime);
      this.chartCardContainerLoading = false;
    },
    async initDeviceChart(startTime, endTime) {
      // 空载状态 =》 设备运行统计数据
      // this.homePageCard[0].chartOptions.legend.data = ['故障状态', '运行状态', '离线状态', '调机状态', '待机状态', '空载状态'];
      // this.homePageCard[0].chartOptions.series[0].data = [
      //   {value: 0, name: '故障状态'},
      //   {value: 0, name: '运行状态'},
      //   {value: 0, name: '离线状态'},
      //   {value: 0, name: '调机状态'},
      //   {value: 0, name: '待机状态'},
      //   {value: 0, name: '空载状态'}
      // ];
      this.homePageCard[0].chartOptions.legend.data = [
        "故障状态",
        "运行状态",
        "离线状态",
        "调机状态",
        "待机状态"
      ];
      this.homePageCard[0].chartOptions.series[0].data = [
        { value: 0, name: "故障状态" },
        { value: 0, name: "运行状态" },
        { value: 0, name: "离线状态" },
        { value: 0, name: "调机状态" },
        { value: 0, name: "待机状态" }
      ];
      await running({
        orgId: this.$store.state.user.userInfo.orgId,
        startTime: startTime,
        endTime: endTime
      })
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            if (res.data.data.percent)
              res.data.data.percent.forEach(item => {
                const sIndex = this.homePageCard[0].chartOptions.series[0].data.findIndex(
                  sItem => sItem.name.startsWith(this.status[item.name].name)
                );
                this.homePageCard[0].chartOptions.series[0].data[sIndex].value =
                  item.percent;
              });
          } else {
            this.$notifyError(
              `获取${this.homePageCard[0].title}列表失败`,
              res.data.msg
            );
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          if (document.getElementById("chart0")) {
            this.homePageCard[0].chart = echarts.init(
              document.getElementById("chart0")
            );
            this.homePageCard[0].chart.setOption(
              this.homePageCard[0].chartOptions
            );
          }
        });
    },
    async initDeviceUsageChart(startTime, endTime) {
      this.homePageCard[1].chartOptions.series[0].data = [
        { value: 0, name: "利用率" }
      ];
      await usage({
        orgId: this.$store.state.user.userInfo.orgId,
        startTime: startTime,
        endTime: endTime
      })
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            if (res.data.data.percent) {
              this.homePageCard[1].chartOptions.series[0].data[0].value = res.data.data.percent.toFixed(
                2
              );
              this.homePageCard[1].chartOptions.series[0].data[0].name =
                res.data.data.name;
              this.homePageCard[1].chartOptions.series[0].axisLine.lineStyle.color[0][0] =
                res.data.data.percent.toFixed(2) / 100;
            }
          } else {
            this.$notifyError(
              `获取${this.homePageCard[1].title}列表失败`,
              res.data.msg
            );
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          if (document.getElementById("chart1")) {
            this.homePageCard[1].chart = echarts.init(
              document.getElementById("chart1")
            );
            this.homePageCard[1].chart.setOption(
              this.homePageCard[1].chartOptions
            );
          }
        });
    },
    async initMaterialProduceChart(startTime, endTime) {
      this.homePageCard[2].chartOptions.dataset.source = [];
      await produceStatics({
        orgId: this.$store.state.user.userInfo.orgId,
        containerId: 0,
        startTime: startTime,
        endTime: endTime
      })
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach(dItem => {
              // dItem.deviceMaterialProduceNumDetails.forEach((item) => {
              //   if (value === "今日") {
              //     this.homePageCard[2].chartOptions.dataset.source.push([
              //       item.deviceNumber,
              //       item.todayProduceNum
              //     ]);
              //   } else if (value === "近7天") {
              //     this.homePageCard[2].chartOptions.dataset.source.push([
              //       item.deviceNumber,
              //       item.thisMonthProduceNum
              //     ]);
              //   } else if (value === "近30天") {
              //     this.homePageCard[2].chartOptions.dataset.source.push([
              //       item.deviceNumber,
              //       item.thisMonthProduceNum
              //     ]);
              //   }
              // })
              if (this.homePageCard[2].chartOptions.dataset.source.length < 11)
                this.homePageCard[2].chartOptions.dataset.source.push([
                  dItem.containerNumber,
                  dItem.sum
                ]);
            });
            this.homePageCard[2].chartOptions.dataZoom[0].show =
              this.homePageCard[2].chartOptions.dataset.source.length > 5;
          } else {
            this.$notifyError(
              `获取${this.homePageCard[2].title}列表失败`,
              res.data.msg
            );
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          if (document.getElementById("chart2")) {
            this.homePageCard[2].chart = echarts.init(
              document.getElementById("chart2")
            );
            this.homePageCard[2].chart.setOption(
              this.homePageCard[2].chartOptions
            );
          }
        });
    },
    async initDeviceErrorChart() {
      this.homePageCard[3].chartOptions.dataset.source = [
        ["product", "最近24小时", "最近7天", "最近一个月"]
      ];
      await err({
        orgId: this.$store.state.user.userInfo.orgId,
        ctrType: 1
      })
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach(item => {
              this.homePageCard[3].chartOptions.dataset.source.push([
                item.deviceNumber,
                item.day,
                item.week,
                item.month
              ]);
            });
            this.homePageCard[3].chartOptions.dataZoom[0].show =
              this.homePageCard[3].chartOptions.dataset.source.length > 5;
          } else {
            this.$notifyError(
              `获取${this.homePageCard[3].title}列表失败`,
              res.data.msg
            );
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          if (document.getElementById("chart3")) {
            this.homePageCard[3].chart = echarts.init(
              document.getElementById("chart3")
            );
            this.homePageCard[3].chart.setOption(
              this.homePageCard[3].chartOptions
            );
          }
        });
    },
    async initMaterialCapacityChart(startTime, endTime) {
      this.homePageCard[4].chartOptions.dataset.source = [];
      await finalMaterialPlanActualProduceNumChart({
        orgId: this.$store.state.user.userInfo.orgId,
        startTime: startTime.split(" ")[0],
        endTime: endTime.split(" ")[0],
        deviceId: 0
      })
        .then(res => {
          if (res.status === 200 && res.data.code === 200) {
            res.data.data.forEach(dItem => {
              this.homePageCard[4].chartOptions.dataset.source.push([
                dItem.materialNumber,
                dItem.actualSum
              ]);
            });
            // this.homePageCard[4].chartOptions.dataset.source=[
            //   ['物料1', 372],
            //   ['物料2', 412],
            //   ['物料3', 385],
            //   ['物料4', 352],
            //   ['物料5', 352],
            //   ['物料6', 520],
            //   ['物料7', 180]
            // ];
            this.homePageCard[4].chartOptions.dataZoom[0].show =
              this.homePageCard[4].chartOptions.dataset.source.length > 5;
          } else {
            this.$notifyError(
              `获取${this.homePageCard[4].title}列表失败`,
              res.data.msg
            );
          }
        })
        .catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
        .finally(() => {
          if (document.getElementById("chart4")) {
            this.homePageCard[4].chart = echarts.init(
              document.getElementById("chart4")
            );
            this.homePageCard[4].chart.setOption(
              this.homePageCard[4].chartOptions
            );
          }
        });
    },
    queryChange(value, index) {
      const tomorrowNow = new Date(Date.now());
      const tomorrow = tomorrowNow.setDate(tomorrowNow.getDate() + 1);
      let startTime = null;
      const endTime = tomorrow;
      switch (value) {
        case "今日":
          const now = new Date(Date.now());
          startTime = now;
          break;
        case "近7天":
          const weekNow = new Date(Date.now());
          weekNow.setDate(weekNow.getDate() - 7);
          startTime = weekNow;
          break;
        case "近30天":
          const monthNow = new Date(Date.now());
          monthNow.setDate(monthNow.getDate() - 30);
          startTime = monthNow;
          break;
      }
      if (index === 4) {
        this.initMaterialCapacityChart(
          moment(startTime).format("YYYY-MM-DD 00:00:00"),
          moment(endTime).format("YYYY-MM-DD 00:00:00")
        );
      } else if (index === 2) {
        this.initMaterialProduceChart(
          moment(startTime).format("YYYY-MM-DD 00:00:00"),
          moment(endTime).format("YYYY-MM-DD 00:00:00")
        );
      }
    },
    routerPush(target) {
      this.$router.push({ name: target });
    }
  }
};
</script>

<style lang="less" scoped>
@import "home.less";
</style>

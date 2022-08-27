<template>
  <div class="device-container">
    <div class="up-wrapper">
      <div class="up-left">
        <div class="up-left-title-wrapper">
          <span>{{ treeData.ctrName }}</span>
          <div
            @click="handleClickRefresh"
            style="
              height: 42px;
              line-height: 42px;
              margin-left: 8px;
              cursor: pointer;
              font-size: 14px;
              color: #266deb;
            "
          >
            刷新
          </div>
        </div>
        <div class="up-left-subtitle-wrapper">
          <div>
            <span>{{ treeData.ctrAddress }}</span>
          </div>
        </div>
        <div class="up-left-content-wrapper" v-loading="topCard.loading">
          <div id="content" class="up-left-table">
          </div>
          <div class="up-left-card">
            <mini-card
              v-for="(item) in topCard.miniCard"
              :key="item.name"
              :miniCardData="item"
              @checkId="checkId"
            >
            </mini-card>
          </div>
        </div>
      </div>
    </div>
    <div class="down-wrapper">
      <div class="down-btn-wrapper">
        <img
          v-if="downStyle"
          @click="switchCardTable"
          src="@/view/device-watch/device/assets/switchToTable.png"
        />
        <img
          v-else
          @click="switchCardTable"
          src="@/view/device-watch/device/assets/switchToCard.png"
        />
      </div>
      <el-tabs v-model="tabValue" type="card">
        <el-tab-pane :label="elTabPaneLabel" name="device">
          <div v-if="downStyle" v-loading="downCardDevice.loading">
            <div
              v-if="downCardDevice.dataForShow.length === 0"
              class="placeholder-wrapper"
            >
              <img src="@/view/device-watch/device/assets/300-220.png"/>
              <span style="margin-left: 12px">暂无设备信息！</span>
            </div>
            <div v-else class="down-card-department-wrapper">
              <device-card
                v-for="item in downCardDevice.dataForShow"
                :key="item.id"
                :cardData="item"
                @handleClickWarning="handleClickWarning"
              ></device-card>
            </div>
          </div>
          <el-table
            height="370px"
            v-else
            :data="downCardDevice.tableDataForShow"
            :header-cell-style="setTableRowStyle"
            border
          >
            <el-table-column
              align="center"
              type="index"
              width="45"
            ></el-table-column>

            <el-table-column
              v-for="item in downCardDevice.tableColumn"
              :key="item.id"
              :prop="item.key"
              :label="item.title"
            >
              <template slot-scope="scope">
                <div @click="handleClickWarning(scope.row.relation)" v-if="item.key == 'warningStatus'">
                  <span
                    v-if="scope.row[item.key] == 0"
                    style="color: #70b603; cursor: pointer"
                  >无预警</span
                  >
                  <span
                    v-else-if="scope.row[item.key] == 1"
                    style="color: #d9001b; cursor: pointer"
                  >预警</span
                  >
                  <span v-else>-</span>
                </div>
                <span v-else>{{ scope.row[item.key] }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div
            v-if="downCardDevice.dataForShow.length > 0"
            style="margin-top: 0.5rem"
            class="flex-center"
          >
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
    <el-dialog title="预警记录" :visible.sync="showDialog">
      <el-table height="50vh" :data="warningRecord">
        <el-table-column
          property="number"
          label="故障代码"
          width="100"
        ></el-table-column>
        <el-table-column
          property="represent"
          label="故障描述"
        ></el-table-column>
        <el-table-column
          property="collectTime"
          label="预警时间"
          width="180"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import apiMixin from "../apiMixins";
  import downCard from "../components/downCard";
  import deviceCard from "../components/deviceCard";
  import "@/view/utils/ezuikit";
  import {getWarningLog} from "@/api/device-watch/warningLogs";
  import {
    getEquipmentRate,
    getWorkshopListByContainer,
  } from '@/api/device-watch/device';
  import echarts from 'echarts';
  import miniCard from "@/view/single-page/newHome/components/miniCard/index";
  import shopCard from "../components/shopCard";
  import deviceStatusMixins from "@/mixins/deviceStatusMixins";

  export default {
    name: "departComp",
    mixins: [apiMixin, deviceStatusMixins],
    components: {downCard, deviceCard, shopCard, miniCard},
    props: {
      treeData: {
        type: Object,
        default() {
          return {};
        },
      },
      treeNode: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {
        tabValue: "device",
        //   false = table true =  card
        downStyle: true,
        orgId: this.$store.state.user.userInfo.orgId,
        topCard: {
          loading: false,
          chart: null,
          eChartsOptions: {
            color: ['#72dcb1', '#e97d64', '#ababab', '#f5c538', '#73a0fa', '#E6FCE0'],
            grid: {
              left: '7%',
              right: '3%',
              bottom: '15%',
              top: '3%',
            },
            xAxis: [
              {
                type: 'category',
                // data: ['运行设备', '故障设备', '离线设备', '调机设备', '待机设备'],
                data: ['总设备'],
                show: false,
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                type: 'bar',
                name: '运行设备',
                data: [0],
                label: {
                  formatter: '{c}\n{a}',
                  show: true,
                  position: "bottom",
                  color: '#c2c2c2',
                }
              },
              {
                type: 'bar',
                name: '故障设备',
                data: [0],
                label: {
                  formatter: '{c}\n{a}',
                  show: true,
                  position: "bottom",
                  color: '#c2c2c2',
                }
              },
              {
                type: 'bar',
                name: '离线设备',
                data: [0],
                label: {
                  formatter: '{c}\n{a}',
                  show: true,
                  position: "bottom",
                  color: '#c2c2c2',
                }
              },
              {
                type: 'bar',
                name: '调机设备',
                data: [0],
                label: {
                  formatter: '{c}\n{a}',
                  show: true,
                  position: "bottom",
                  color: '#c2c2c2',
                }
              },
              {
                type: 'bar',
                name: '待机设备',
                data: [0],
                label: {
                  formatter: '{c}\n{a}',
                  show: true,
                  position: "bottom",
                  color: '#c2c2c2',
                }
              },
              // 空载状态 =》上方左侧柱状图
              // {
              //   type: 'bar',
              //   name: '空载设备',
              //   data: [0],
              //   label: {
              //     formatter: '{c}\n{a}',
              //     show: true,
              //     position: "bottom",
              //     color: '#c2c2c2',
              //   }
              // },
            ]
          },
          miniCard: [],
        },
        colorIconList: [
          {
            color: "#2F6796", icon: require("@/assets/deviceMonitor/all.png"),
          },
          {
            color: "#72dcb1", icon: require("@/assets/deviceMonitor/run.png"),
          },
          {
            color: "#e97d64", icon: require("@/assets/deviceMonitor/error.png"),
          },
          {
            color: "#aaaaaa", icon: require("@/assets/deviceMonitor/offline.png"),
          },
          {
            color: "#f5c538", icon: require("@/assets/deviceMonitor/adjust.png"),
          },
          {
            color: "#739ff9", icon: require("@/assets/deviceMonitor/wait.png"),
          },
          {
            color: "#E6FCE0", icon: require("@/assets/deviceMonitor/empty.png"),
          },
        ],
        page: {
          current: 1,
          total: 0,
          size: 8,
        },
        downCardDevice: {
          loading: false,
          data: [],
          dataForShow: [],
          tableData: [],
          tableDataForShow: [],
          tableColumn: [
            {title: "设备代码", key: "number"},
            {title: "设备名称", key: "name"},
            {title: "运行状态", key: "statusName"},
            {title: "预警状态", key: "warningStatus"},
            {title: "备注", key: "mark"},
          ],
        },
        picture: {
          // false - pic   true - video
          switch: false,
          player: "",
        },
        warningRecord: [],
        showDialog: false,

        elTabPaneLabel: '设备总量',
      };
    },
    watch: {
      treeData: {
        handler(n) {
          this.downStyle = true;
          this.topCard.data = [];
          this.topCard.dataForShow = [];
          this.picture.switch = false;
          if (this.picture.player !== "") {
            this.picture.player.stop();
          }
          this.picture.player = "";
          this.getPointData();
          this.getDevice();
          //调整标签
          this.elTabPaneLabel = '设备总量';
        },
        immediate: true,
      },
    },
    beforeDestroy() {
      if (this.picture.player !== "") {
        this.picture.player.stop();
      }
      this.picture.player = "";
    },
    methods: {
      async handleClickWarning(item) {
        try {
          let res = await Promise.resolve(
            getWarningLog(JSON.parse(item))
          );
          if (res.data.code === 200) {
            this.warningRecord = [];
            res.data.data.forEach((i, d) => {
              this.warningRecord.push({
                number: d + 1,
                represent: i.represent,
                collectTime: i.collectTime,
              });
            });
            this.showDialog = true;
          }
        } catch (e) {
          console.log(e);
        }
      },
      handleClickRefresh() {
        this.page.current = 1;
        this.getPointData();
        this.getDevice();
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
              } catch (e) {
              }
            });
          } else {
            // this.picture.player.play();
          }
        }
      },
      pageChange(val, init) {
        let a = -1;
        switch (this.elTabPaneLabel) {
          case "设备总量":
            a = -1;
            break;
          case "运行设备":
            a = 1;
            break;
          case "故障设备":
            a = 4;
            break;
          case "离线设备":
            a = 0;
            break;
          case "调机设备":
            a = 3;
            break;
          case "待机设备":
            a = 2;
            break;
        }
        if (init) this.page.current = 1;
        this.downCardDevice.tableDataForShow = this.downCardDevice.tableData.filter((tItem) => {
          if (a > -1) return tItem.status === a;
          else return true;
        }).slice(
          (val - 1) * 8,
          (val - 1) * 8 + 8
        );
        this.downCardDevice.dataForShow = this.downCardDevice.data.filter((dItem) => {
          const cItem = dItem.children.find((cItem) => cItem.ctrName === '运行状态');
          if (cItem) {
            cItem.pointValue = cItem.pointValue ? cItem.pointValue : 0;
            if (a > -1) return cItem.pointValue === a;
            else return true;
          } else
            return false;
        }).slice(
          (val - 1) * 8,
          (val - 1) * 8 + 8
        );
        this.page.total = this.downCardDevice.tableData.filter((tItem) => {
          if (a > -1) return tItem.status === a;
          else return true;
        }).length;
      },
      async getPointData() {
        const param = {orgId: this.orgId, id: this.treeData.id, type: "shop"};
        this.topCard.loading = true;
        let res = await getEquipmentRate(param);
        if (res.status === 200 && res.data.code === 200) {
          //统计表的设置
          this.topCard.chart = echarts.init(document.getElementById('content'));
          this.topCard.eChartsOptions.series.forEach((sItem, index) => {
            sItem.data[0] = 0;
            const dataIndex = res.data.data.findIndex(dItem =>
              sItem.name.startsWith(this.status[dItem.x].name));
            if (dataIndex >= 0)
              sItem.data[0] = res.data.data[dataIndex].y;
          });
          this.topCard.chart.setOption(this.topCard.eChartsOptions);
        } else {
          this.$notifyError("获取企业列表失败", res.data.msg);
        }
        //miniCard的配置
        this.topCard.miniCard = [];
        this.topCard.miniCard.push({
          id: 0,
          borderColor: this.colorIconList[0].color,
          title: "设备总量",
          icon: this.colorIconList[0].icon,
          unit: "",
          number: this.topCard.eChartsOptions.series.reduce((sum, curr) => {
            return sum + curr.data[0]
          }, 0),
          loading: false,
          disabled: false,
        });
        this.topCard.eChartsOptions.series.forEach((sItem, index) => {
          this.topCard.miniCard.push({
            id: index + 1,
            borderColor: this.colorIconList[index + 1].color,
            title: sItem.name,
            icon: this.colorIconList[index + 1].icon,
            unit: "",
            number: sItem.data[0],
            loading: false,
            disabled: false,
          });
        });
        this.topCard.loading = false;
      },
      async getDevice() {
        this.downCardDevice.tableData = [];
        const param = {orgId: this.orgId, id: this.treeData.id};
        this.downCardDevice.loading = true;
        let res = await this.getDeviceData(param);
        this.downCardDevice.loading = false;
        this.downCardDevice.data = res.data.data;
        res.data.data.forEach((i) => {
          let pushItem = {
            name: i.ctrName,
            number: i.ctrNumber,
            status: "",
            mark: i.mark,
          };
          if (i.children !== [] || i.children !== null) {
            i.children.forEach((k) => {
              pushItem.relation = k.ctrRelation
              switch (k.ctrName) {
                case "运行状态":
                  pushItem.status = k.pointValue;
                  break;
                case "预警状态":
                  pushItem.warningStatus = k.pointValue;
                  break;
                default:
                  break;
              }
            });
          }
          pushItem.statusName = this.status[pushItem.status ? pushItem.status : 0].name;//0相当于默认值 离线
          this.downCardDevice.tableData.push(pushItem);
        });
        this.pageChange(1);
        // this.downCardDevice.tableDataForShow = this.downCardDevice.tableData.slice(0, 8);
        // this.downCardDevice.dataForShow = this.downCardDevice.data.slice(0, 8);
      },
      switchCardTable() {
        this.downStyle = !this.downStyle;
      },
      setTableRowStyle() {
        return "background: #F8F8F9; color:#606266";
      },
      //miniCard的回传 =》 选中状态和ID
      checkId(id, checked) {
        const card = this.topCard.miniCard.find((mItem) => mItem.id === id);
        this.elTabPaneLabel = card.title;
        this.pageChange(1, true);
      },
    },
  };
</script>

<style lang="less" scoped>
  @import "./style.less";
</style>

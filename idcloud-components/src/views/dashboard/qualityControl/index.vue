<template>
    <div class="container">
        <dashboard-header title="质检看板">
        </dashboard-header>
        <div class="main">
            <div>
                <a-table
                        size="middle"
                        :columns="topColumns"
                        :data-source="topData"
                        rowKey="causeId"
                        :pagination="false"
                >
                </a-table>
            </div>
            <div>
                <div id="bad-proportion" ref="bad-proportion"></div>
            </div>
            <div>
                <div id="bad-statistics" ref="bad-statistics"></div>
            </div>
            <div>
                <a-table
                        size="middle"
                        :columns="bottomColumns"
                        :data-source="bottomData"
                        rowKey="id"
                        :pagination="false"
                >
                </a-table>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .container {
        background-color: #16153e;
        height: 100vh;
        width: 100vw;
    }

    .main {
        display: grid;
        padding: 0 1%;
        height: 86.8vh;
        width: 100%;
        grid-template-columns: 49.2% 49.2%;
        column-gap: 1.6%;
        grid-auto-rows: 48% 48%;
        row-gap: 2.5%;

        > div {
            width: 100%;
            height: 100%;
            background-image: url("../../../assets/dashboardCardBackground/cardBackground.png");
            background-size: 100% 99%;
            background-repeat: no-repeat;
            overflow: auto;
            padding: 10px;

            > div {
                width: 100%;
                height: 100%;
            }
        }
    }

    ::v-deep(.ant-table) {
        background: transparent;
        color: #6a9fd0;
    }

    ::v-deep(.ant-table-thead > tr > th) {
        background: transparent;
        color: #6a9fd0;
        border-bottom: 1px solid #4f98e9;
        border-top: 1px solid #4f98e9;
        color: #ffffff;
    }

    ::v-deep(.ant-table-thead > tr > th:nth-of-type(1)) {
        border-left: 1px solid #4f98e9;
    }

    ::v-deep(.ant-table-thead > tr > th:last-child) {
        border-right: 1px solid #4f98e9;
    }

    ::v-deep(.ant-table-thead) {
        background: #1a2562;
    }

    ::v-deep(.ant-table-tbody > tr:nth-of-type(even)) {
        background: #172455;
    }

    ::v-deep(.ant-table-tbody > tr > td) {
        border: 0;
    }

    ::v-deep(.ant-table-tbody > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)) > td {
        background: #27327c;
    }

    ::v-deep(.ant-table-placeholder) {
        background: transparent;
        border: 0;
    }

    ::v-deep(.ant-empty-description) {
        color: #ffffff;
    }

</style>
<script lang="ts">
  import { defineComponent } from "vue";
  import dashboardHeader from "@/components/dashboardHeader/index.vue";
  import moment from "moment";

  interface topItem {
    causeId: number
    causeName: string
    causeNumber: string
    groupId: number
    groupName: string
    groupNumber: string
    num: number
    proportion: string
  }

  interface topOptionItem {
    value: number
    name: string
  }

  export default defineComponent({
    name: "index",
    components: {
      dashboardHeader
    },
    props: ["orgId", "url"],
    data() {
      return {
        topColumns: [
          {
            title: "不良原因",
            dataIndex: "causeName",
            align: "center",
            ellipsis: true
          },
          {
            title: "不良类别",
            dataIndex: "groupName",
            align: "center",
            ellipsis: true
          },
          {
            title: "不良数量",
            dataIndex: "num",
            align: "center",
            ellipsis: true
          },
          {
            title: "占比",
            dataIndex: "proportion",
            align: "center",
            ellipsis: true
          }
        ],
        topData: [],
        topOData: [],
        topLoading: false,
        topTimer: 10000,
        topShowNumber: 8,
        topUrl: "",

        topOption: {
          title: {
            text: "不良占比分析",
            left: "left",
            textStyle: {
              color: "#c3f8fe"
            }
          },
          tooltip: {
            trigger: "item" as "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: "horizontal" as "horizontal",
            right: "0",
            textStyle: {
              color: "#ffffff"
            }
          },
          color: ["#7169d0", "#81a4e2", "#1cafc7", "#446cc6", "#323a8e", "#f5a156",
            "#C4F9FF", "#3C00DD", "#1FCCE0", "#8D5AE3", "#6BA1D2"],
          series: [
            {
              name: "访问来源",
              type: "pie" as "pie",
              radius: "80%",
              data: [
                // { value: 0, name: "装夹" },
                // { value: 0, name: "毛坯开裂" },
                // { value: 0, name: "精孔不良" },
                // { value: 0, name: "切割不全" },
                // { value: 0, name: "毛坯变形" },
                // { value: 0, name: "罗纹不良" }
              ] as Array<topOptionItem>,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              },
              label: {
                align: "center" as "center",
                formatter: "{b}:{c}\n({d}%)",
                color: "#ffffff"
              }
            }
          ]
        },

        bottomOption: {
          title: {
            text: "物料不良统计",
            left: "left",
            textStyle: {
              color: "#c3f8fe"
            }
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow"
            }
          },
          legend: {
            left: "right",
            textStyle: {
              color: "#ffffff"
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "value",
            axisLine: {
              show: true,
              lineStyle: {
                color: "#ffffff"
              }
            },
            axisTick: {
              lineStyle: {
                color: "#ffffff"
              }
            }
          },
          yAxis: {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#ffffff"
              }
            },
            axisTick: {
              lineStyle: {
                color: "#ffffff"
              }
            },
            // data: ["物料1", "物料2", "物料3", "物料4", "物料5", "物料6", "物料7"]
            data: [] as Array<any>
          },
          color: ["#7169d0", "#81a4e2", "#1cafc7", "#446cc6", "#323a8e", "#f5a156",
            "#C4F9FF", "#3C00DD", "#1FCCE0", "#8D5AE3", "#6BA1D2"],
          series: [
            // {
            //   name: "装夹",
            //   type: "bar",
            //   stack: "total",
            //   label: {
            //     show: true
            //   },
            //   emphasis: {
            //     focus: "series"
            //   },
            //   data: [11, 6, 13, 8, 15, 12, 11]
            // },
          ] as any
        },
        bottomOOData: [],
        bottomOTimer: 10000,
        bottomOUrl: "",
        bottomOShowNumber: 8,

        bottomColumns: [
          {
            title: "不良原因",
            dataIndex: "causeName",
            align: "center",
            ellipsis: true
          },
          {
            title: "不良类别",
            dataIndex: "groupName",
            align: "center",
            ellipsis: true
          },
          {
            title: "今日不良数量",
            dataIndex: "todayNum",
            align: "center",
            ellipsis: true
          },
          {
            title: "近一周不良数量",
            dataIndex: "recent7days",
            align: "center",
            ellipsis: true
          },
          {
            title: "近一月不良数量",
            dataIndex: "recent30days",
            align: "center",
            ellipsis: true
          }
        ],
        bottomData: [],
        bottomOData: [],
        bottomLoading: false,
        bottomTimer: 10000,
        bottomShowNumber: 8,
        bottomUrl: "",
      };
    },
    mounted() {
      this.topUrl = `${this.url}/idcloud/dashboard/quality/getCauseProportion?orgId=${this.orgId}`;
      this.getCauseProportionData();

      this.bottomOUrl = `${this.url}/idcloud/dashboard/quality/getBadMaterialCauseProportion?orgId=${this.orgId}`;
      this.getBadStatistics();

      this.bottomUrl = `${this.url}/idcloud/dashboard/quality/getBadMaterialNumStaticsByCause?orgId=${this.orgId}`;
      this.getBottomTableData();
    },
    methods: {
      async getCauseProportionData() {
        this.topLoading = true;
        const today = moment(new Date()).format("YYYY-MM-DD");
        const tomorrowNow = new Date();
        const tomorrow = moment(tomorrowNow.setDate(tomorrowNow.getDate() + 1)).format("YYYY-MM-DD");
        const resp = await fetch(this.topUrl + "&startTime=" + today + "&endTime=" + tomorrow);
        const res = await resp.json();
        this.topOData = res.data;
        this.topData = res.data.slice(0, this.topShowNumber);
        this.topOption.series[0].data = [] as Array<topOptionItem>;
        this.topData.forEach((item: topItem) => {
          item.proportion = item.proportion + "%";
          this.topOption.series[0].data.push({
            value: item.num,
            name: item.causeName
          });
        });
        const eCharts = require("echarts");
        const rightTopChart = eCharts.init(this.$refs["bad-proportion"] as HTMLCanvasElement);
        rightTopChart.setOption(this.topOption);
        this.topLoading = false;
        this.timeoutCauseProportion();
      },
      timeoutCauseProportion() {
        setTimeout(() => {
          if (this.topShowNumber >= this.topOData.length) {
            this.topShowNumber = 8;
            this.getCauseProportionData();
          } else {
            this.topShowNumber += 8;
            this.topData = this.topOData.slice(this.topShowNumber - 8, this.topShowNumber);
            this.timeoutCauseProportion();
          }
        }, this.topTimer);
      },
      async getBadStatistics() {
        const today = moment(new Date()).format("YYYY-MM-DD");
        const tomorrowNow = new Date();
        const tomorrow = moment(tomorrowNow.setDate(tomorrowNow.getDate() + 1)).format("YYYY-MM-DD");
        const resp = await fetch(this.bottomOUrl + "&startTime=" + today + "&endTime=" + tomorrow);
        const res = await resp.json();
        res.data.forEach((rItem: any) => {
          rItem.causeList.forEach((cItem: any) => {
            //Y轴
            const dIndex = this.bottomOption.yAxis.data.findIndex((dItem) => dItem === rItem.materialName);
            if (dIndex < 0)
              this.bottomOption.yAxis.data.push(rItem.materialName);

            const sIndex = this.bottomOption.series.findIndex((sItem: any) => sItem.name === cItem.causeName);
            if (sIndex >= 0) {
              this.bottomOption.series[sIndex].data.push(cItem.num);
            } else {
              const sI: any = {
                name: cItem.causeName,
                type: "bar",
                stack: "total",
                label: {
                  show: true
                },
                emphasis: {
                  focus: "series"
                },
                data: []
              };
              if (this.bottomOption.yAxis.data.length-1 > 0) {
                const count = this.bottomOption.yAxis.data.length;
                for (let i = 1; i <= count; i++) {
                  sI.data.push(0);
                }
              }
              sI.data.push(cItem.num);
              this.bottomOption.series.push(sI);
            }
          });
        });
        const eCharts = require("echarts");
        let leftBottomChart = eCharts.dispose(this.$refs["bad-statistics"] as HTMLCanvasElement);
        leftBottomChart = eCharts.init(this.$refs["bad-statistics"] as HTMLCanvasElement);
        leftBottomChart.setOption(this.bottomOption);
        this.timeoutBadStatistics();
      },
      timeoutBadStatistics() {
        setTimeout(() => {
          // if (this.bottomOShowNumber >= this.bottomOOData.length) {
          //   this.bottomOShowNumber = 8;
            this.getBadStatistics();
          // } else {
          //   this.bottomOShowNumber += 8;
          //   const dealData = this.bottomOOData.slice(this.topShowNumber - 8, this.topShowNumber);
          //   this.timeoutCauseProportion();
          // }
        }, this.bottomOTimer);
      },
      async getBottomTableData() {
        this.bottomLoading = true;
        const resp = await fetch(this.bottomUrl);
        const res = await resp.json();
        this.bottomOData = res.data;
        this.bottomData = res.data.slice(0, this.bottomShowNumber);
        this.bottomLoading = false;
        this.timeoutBottomTable();
      },
      timeoutBottomTable() {
        setTimeout(() => {
          if (this.bottomShowNumber >= this.bottomOData.length) {
            this.bottomShowNumber = 8;
            this.getBottomTableData();
          } else {
            this.bottomShowNumber += 8;
            this.bottomData = this.bottomOData.slice(this.bottomShowNumber - 8, this.bottomShowNumber);
            this.timeoutBottomTable();
          }
        }, this.bottomTimer);
      },
    }
  });
</script>



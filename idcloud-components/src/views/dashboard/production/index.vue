<template>
    <div class="container">
        <dashboard-header title="生产看板">
        </dashboard-header>
        <div class="main">
            <div>
                <div id="bad-proportion" ref="bad-proportion"></div>
            </div>
            <div>
                <a-table
                        size="middle"
                        :columns="topColumns"
                        :data-source="topData"
                        rowKey="materialNumber"
                        :pagination="false"
                >
                </a-table>
            </div>
            <div>
                <a-table
                        size="middle"
                        :columns="bottomColumns"
                        :data-source="bottomData"
                        rowKey="materialNumber"
                        :pagination="false"
                >
                </a-table>
            </div>
            <div>
                <div id="bad-statistics" ref="bad-statistics"></div>
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
            title: "物料",
            dataIndex: "materialName",
            align: "center",
            ellipsis: true
          },
          {
            title: "计划产量",
            dataIndex: "planSum",
            align: "center",
            ellipsis: true
          },
          {
            title: "实际产量",
            dataIndex: "actualSum",
            align: "center",
            ellipsis: true
          },
          {
            title: "不良数量",
            dataIndex: "badMaterialNum",
            align: "center",
            ellipsis: true
          },
          {
            title: "完成率",
            dataIndex: "finishRate",
            align: "center",
            ellipsis: true
          },
          {
            title: "良品率",
            dataIndex: "qualifyRate",
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
            text: "产量统计",
            left: "left",
            textStyle: {
              color: "#c3f8fe"
            }
          },
          tooltip: {
            trigger: "item" as "item",
            formatter: "{a} <br/>{b} : {c} "
          },
          legend: {
            orient: "horizontal" as "horizontal",
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
          color: ["#4e7cde", "#40c176"],
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
              show: true,
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
          series: [
            {
              name: "计划产量",
              type: "bar",
              label: {
                show: true,
                position: "right",
                color: "#ffffff"
              },
              data: []
            },
            {
              name: "实际产量",
              type: "bar",
              label: {
                show: true,
                position: "right",
                color: "#ffffff"
              },
              data: []
            }
          ] as any
        },

        bottomOption: {
          title: {
            text: "产量对比分析",
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
          color: ["#8378ea", "#4e7cde", "#1fcce0"],
          xAxis: [
            {
              type: "category",
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
              },
              // data: ["物料1", "物料2", "物料3", "物料4", "物料5", "物料6", "物料7"]
              data: [] as any
            }
          ],
          yAxis: [
            {
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
            }
          ],
          series: [
            {
              name: "今日产量",
              type: "bar",
              barGap: 0,
              label: {
                show: true,
                position: "top",
                color: "#ffffff"
              },
              emphasis: {
                focus: "series"
              },
              barWidth: "20%",
              data: []
            },
            {
              name: "昨日产量",
              type: "bar",
              label: {
                show: true,
                position: "top",
                color: "#ffffff"
              },
              emphasis: {
                focus: "series"
              },
              barWidth: "20%",
              data: []
            },
            {
              name: "近7日产量",
              type: "bar",
              label: {
                show: true,
                position: "top",
                color: "#ffffff"
              },
              emphasis: {
                focus: "series"
              },
              barWidth: "20%",
              barGap: "20%",
              data: []
            }
          ] as any
        },

        bottomColumns: [
          {
            title: "物料",
            dataIndex: "materialName",
            align: "center",
            ellipsis: true
          },
          {
            title: "今日计划产量",
            dataIndex: "planSum",
            align: "center",
            ellipsis: true
          },
          {
            title: "今日实际产量",
            dataIndex: "actualSum",
            align: "center",
            ellipsis: true
          },
          {
            title: "计划完成率",
            dataIndex: "finishRate",
            align: "center",
            ellipsis: true
          }
        ],
        bottomData: [],
        bottomOData: [],
        bottomLoading: false,
        bottomTimer: 10000,
        bottomShowNumber: 8,
        bottomUrl: ""
      };
    },
    mounted() {
      this.topUrl = `${this.url}/idcloud/dashboard/produce/getMaterialTable?orgId=${this.orgId}`;
      this.getOther();

      this.bottomUrl = `${this.url}/idcloud/dashboard/produce/getMaterialProduceNumCompareChart?orgId=${this.orgId}`;
      this.getBottomChartData();
    },
    methods: {
      async getOther() {
        this.topLoading = true;
        const today = moment(new Date()).format("YYYY-MM-DD");
        const tomorrowNow = new Date();
        const tomorrow = moment(tomorrowNow.setDate(tomorrowNow.getDate() + 1)).format("YYYY-MM-DD");
        const resp = await fetch(this.topUrl + "&startTime=" + today + "&endTime=" + tomorrow);
        const res = await resp.json();
        res.data.forEach((rItem: any) => {
          rItem.finishRate = rItem.finishRate + "%";
          rItem.qualifyRate = rItem.qualifyRate + "%";
        });
        this.topOData = res.data;
        this.topData = res.data.slice(0, this.topShowNumber);
        this.bottomData = this.topData;

        this.topOption.series[0].data = [] as Array<any>;
        this.topOption.yAxis.data = [] as Array<any>;
        this.topData.forEach((item: any) => {
          this.topOption.yAxis.data.push(item.materialName);
          this.topOption.series[0].data.push(item.planSum);
          this.topOption.series[1].data.push(item.actualSum);
        });

        const eCharts = require("echarts");
        const rightTopChart = eCharts.init(this.$refs["bad-proportion"] as HTMLCanvasElement);
        rightTopChart.setOption(this.topOption);
        this.topLoading = false;
        this.timeoutOther();
      },
      timeoutOther() {
        setTimeout(() => {
          if (this.topShowNumber >= this.topOData.length) {
            this.topShowNumber = 8;
            this.getOther();
          } else {
            this.topShowNumber += 8;
            this.topData = this.topOData.slice(this.topShowNumber - 8, this.topShowNumber);
            this.bottomData = this.topData;
            this.timeoutOther();
          }
        }, this.topTimer);
      },
      async getBottomChartData() {
        const resp = await fetch(this.bottomUrl);
        const res = await resp.json();
        const eCharts = require("echarts");
        const leftBottomChart = eCharts.init(this.$refs["bad-statistics"] as HTMLCanvasElement);
        this.bottomOption.xAxis[0].data=[];
        this.bottomOption.series= [
          {
            name: "今日产量",
            type: "bar",
            barGap: 0,
            label: {
              show: true,
              position: "top",
              color: "#ffffff"
            },
            emphasis: {
              focus: "series"
            },
            barWidth: "20%",
            data: []
          },
          {
            name: "昨日产量",
            type: "bar",
            label: {
              show: true,
              position: "top",
              color: "#ffffff"
            },
            emphasis: {
              focus: "series"
            },
            barWidth: "20%",
            data: []
          },
          {
            name: "近7日产量",
            type: "bar",
            label: {
              show: true,
              position: "top",
              color: "#ffffff"
            },
            emphasis: {
              focus: "series"
            },
            barWidth: "20%",
            barGap: "20%",
            data: []
          }
        ] as any;
        res.data.forEach((item: any) => {
          this.bottomOption.xAxis[0].data.push(item.materialName);
          this.bottomOption.series[0].data.push(item.todayNum);
          this.bottomOption.series[1].data.push(item.yesterdayNum);
          this.bottomOption.series[2].data.push(item.recent7daysNum);
        });
        leftBottomChart.setOption(this.bottomOption);
        this.timeoutBottomChart();
      },
      timeoutBottomChart() {
        setTimeout(() => {
          this.getBottomChartData();
        }, this.bottomTimer);
      }
    }
  });
</script>



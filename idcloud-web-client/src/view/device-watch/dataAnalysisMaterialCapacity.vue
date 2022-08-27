<template>
  <id-bar-time-chart-table
    ref="chartTable"
    isPage
    :index="false"
    :leftChartOptions="leftChartOptions"
    :rightChartOptions="rightChartOptions"
    :tableColumns="tableColumns"
    :tableName="'成品产量统计信息'"
    :idRadioComp="{exist:false}"
    :datePickerComp="{exist: false}"
    @beforeGetCascaderOpitions="beforeGetCascaderOpitions"
    :getTable="getTable"
    @afterGetTableNoPage="afterGetTableNoPage"
    @beforeGetTable="beforeGetTable"
  >
  </id-bar-time-chart-table>
</template>

<script>
  import IdBarTimeChartTable from "@/components/id-pages/IdBarTimeChartTable";
  import {
    finalMaterialPlanActualProduceNumChart,
    finalMaterialPlanActualProduceCompareDataByTime,
    finalMaterialProduceDataTable,
  } from "@/api/device-watch/dataAnalysis";
  import moment from 'moment'; // 日期格式化工具
  import day from '@/assets/dataAnalysis/day.png';
  import week from '@/assets/dataAnalysis/week.png';
  import month from '@/assets/dataAnalysis/month.png';

  export default {
    name: "dataAnalysisMaterialCapacity",
    components: {
      IdBarTimeChartTable
    },
    computed: {
      getTable() {
        return finalMaterialProduceDataTable;
      },
    },
    data() {
      return {
        tableColumns: [
          {
            tag: "el-table-column",
            label: "#",
            type: "index",
            align: "center",
            width: 40,
          },
          {
            tag: "el-table-column",
            label: "物料代码",
            prop: "materialNumber",
            width: 180,
            showOverflowTooltip: true,
          },
          {
            tag: "el-table-column",
            label: "物料名称",
            prop: "materialName",
            width: 180,
            showOverflowTooltip: true,
          },
        ],//表格列配置

        leftChartOptions: {
          title: {
            text: '计划产量和实际产量分析',
            left: 'left'
          },
          legend: {
            bottom: '0%',
          },
          tooltip: {},
          dataZoom: [
            {
              type: 'slider',
              minValueSpan: 4,
              maxValueSpan: 4,
              height: 20,
              bottom: '0%'
            }
          ],
          toolbox: {
            showTitle: true,
            top: '5%',
            right: '8%',
            emphasis: {
              iconStyle: {
                textPosition: 'top'
              }
            },
            feature: {
              myTool1: {
                show: true,
                title: "今日",
                icon: 'image://' + day,
                onclick: function () {
                }
              },
              myTool2: {
                show: true,
                title: "近7天",
                icon: 'image://' + week,
                onclick: function () {
                }
              },
              myTool3: {
                show: true,
                title: "近30天",
                icon: 'image://' + month,
                onclick: function () {
                }
              }
            }
          },
          dataset: {
            source: [
              ['product', '计划', '实际'],
              ['物料1', 100, 103],
              ['物料2', 120, 80],
              ['物料3', 50, 70],
              ['物料4', 180, 80]
            ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          color: ['#719df7', '#73ddb2'],
          series: [
            {type: 'bar', label: {show: true, position: 'top'}},
            {type: 'bar', label: {show: true, position: 'top'}}
          ]
        },
        rightChartOptions: {
          title: {
            text: '产量同比分析',
            left: 'left'
          },
          legend: {
            bottom: '0%',
          },
          tooltip: {},
          dataZoom: [
            {
              type: 'slider',
              minValueSpan: 4,
              maxValueSpan: 4,
              height: 20,
              bottom: '0%'
            }
          ],
          // toolbox: {
          //   showTitle: true,
          //   right: '8%',
          //   feature: {
          //     myTool1: {
          //       show: true,
          //       title: "今日",
          //       icon: 'path://M561.015467 73.181867c46.011733 84.650667 97.826133 146.8416 155.511466 186.504533 57.617067 39.662933 112.503467 67.857067 164.522667 84.514133 51.950933 16.657067 82.1248 30.173867 90.453333 40.482134a62.190933 62.190933 0 0 1 5.461334 71.543466c-12.629333 20.616533-32.290133 30.651733-58.9824 30.037334-29.354667 0-87.4496-21.230933-174.4896-63.556267-86.971733-42.325333-149.845333-92.842667-188.484267-151.552-38.7072-58.641067-59.392-88.610133-61.986133-89.975467-2.730667-1.365333-8.669867 4.7104-18.0224 18.0224-7.304533 10.6496-37.000533 44.6464-89.019734 101.9904-51.950933 57.344-115.780267 109.499733-191.488 156.535467-75.639467 46.967467-120.6272 57.480533-134.9632 31.470933-14.336-25.941333-21.162667-45.056-20.48-57.002666 1.297067-16.657067 6.621867-29.354667 15.9744-38.024534 9.284267-8.669867 25.668267-18.158933 48.9472-28.4672 23.3472-10.308267 58.1632-31.812267 104.516267-64.512 46.353067-32.631467 81.988267-64.512 107.042133-95.505066 24.9856-30.993067 46.626133-59.665067 64.989867-86.016 18.295467-26.282667 33.655467-49.152 46.011733-68.471467 12.288-19.319467 24.1664-32.494933 35.498667-39.5264 11.332267-6.9632 24.576-10.171733 40.004267-9.489067 25.258667 2.048 42.325333 10.513067 50.9952 25.531734s11.946667 26.146133 9.966933 33.450666c-2.048 7.3728-2.6624 11.332267-2.048 12.014934zM641.024 623.274667H228.9664a50.449067 50.449067 0 0 1-39.458133-17.476267 61.986133 61.986133 0 0 1-15.9744-41.028267 59.050667 59.050667 0 0 1 12.970666-40.004266c9.0112-10.990933 23.210667-16.520533 42.461867-16.520534h448.034133c55.978667 0 92.3648 6.826667 109.021867 20.48 16.657067 13.653333 25.668267 29.354667 26.965333 47.104 1.365333 17.6128-0.955733 35.089067-6.9632 52.4288-12.014933 32.699733-31.197867 67.857067-57.5488 105.540267-26.282667 37.614933-64.3072 83.831467-114.005333 138.4448-49.629867 54.6816-89.2928 90.794667-118.9888 108.544-29.627733 17.681067-52.292267 15.496533-67.9936-6.485333-15.701333-22.050133-22.528-39.7312-20.48-53.0432a61.0304 61.0304 0 0 1 11.4688-29.4912c7.031467-10.308267 27.8528-29.696 62.532267-58.026667s66.9696-61.44 96.938666-99.464533c30.037333-38.024533 48.196267-64.853333 54.613334-80.554667 6.280533-15.633067 8.465067-24.576 6.417066-26.965333-1.979733-2.321067-7.9872-3.4816-17.954133-3.4816zM416.9728 358.1952a49.493333 49.493333 0 0 1 17.544533-35.0208 53.0432 53.0432 0 0 1 39.458134-13.994667c10.717867 0.682667 21.845333 4.7104 33.518933 12.014934 11.6736 7.3728 24.507733 19.6608 38.5024 37.000533 13.994667 17.339733 24.849067 33.860267 32.494933 49.493333 7.645867 15.701333 10.990933 30.037333 10.0352 43.008-1.024 12.970667-7.714133 24.9856-20.002133 35.976534a51.6096 51.6096 0 0 1-42.530133 13.5168c-13.994667-1.365333-26.624-8.328533-38.024534-20.957867l-30.993066-47.035733-31.9488-45.056c-6.007467-12.629333-8.669867-22.254933-8.055467-28.945067z',
          //       onclick: function () {
          //       }
          //     },
          //     myTool2: {
          //       show: true,
          //       title: "近7天",
          //       icon: 'path://M322.1504 810.666667l273.066667-516.266667H317.883733c-54.0672 0-81.1008-25.6-81.1008-76.8 0-45.499733 27.0336-69.700267 81.066667-72.533333h392.533333c45.533867 2.833067 72.533333 28.433067 81.066667 76.8 0 17.066667-8.533333 41.233067-25.6 72.533333L497.083733 844.8a49.629867 49.629867 0 0 1-8.533333 12.8c-22.7328 45.499733-51.2 66.833067-85.333333 64-54.033067 0-83.899733-24.1664-89.565867-72.533333 0-5.700267 1.399467-12.8 4.232533-21.333334 0-5.700267 1.4336-11.3664 4.3008-17.066666z',
          //       onclick: function () {
          //       }
          //     },
          //     myTool3: {
          //       show: true,
          //       title: "近30天",
          //       icon: 'path://M3.471186 672.860565q-0.578531 9.227571-0.578531 14.463277 0 127.768588 58.981243 198.262599T227.941243 956.022599q120.855141 0 187.617627-83.163842t66.762486-233.957966q0-115.098757-41.451751-187.328362t-104.743051-72.316384a202.485876 202.485876 0 0 0-26.467797 3.44226 39.021921 39.021921 0 0 1-7.491977 1.157062l196.700565-301.588248h-459.932204V231.99096h214.895367L104.135593 454.725424l70.783277 76.539661A154.496723 154.496723 0 0 1 208.271186 509.975141a73.560226 73.560226 0 0 1 29.938983-6.913446q38.559096 0 56.985311 37.402034t18.426215 115.706215q0 74.832994-19.843616 115.388022t-56.696045 40.497175q-34.538305 0-52.067797-34.711864t-17.558418-104.453785v-14.463277H4.049718q0 5.235706-0.578532 14.43435z m830.192091 74.543729q-16.401356 57.274576-58.981243 57.274576-42.030282 0-58.691978-58.691977t-16.690621-238.268023q0-178.418983 16.690621-237.19774t58.691978-58.691977q42.579887 0 58.981243 57.274576t16.401356 238.557288q0.115706 182.468701-16.28565 239.743277zM961.547571 175.873446q-59.588701-107.896045-186.778757-107.896045t-186.749831 107.317514q-59.559774 107.346441-59.559774 337.572882 0 229.069379 59.559774 336.126553t186.778757 107.028249q127.276836 0 186.778757-107.028249T1021.107345 512.867797q0-229.069379-59.559774-336.994351z',
          //       onclick: function () {
          //       }
          //     }
          //   }
          // },
          dataset: {
            source: [
              ['product', '昨日', '今日'],
              ['物料1', 77, 17],
              ['物料2', 66, 47],
              ['物料3', 33, 34],
              ['物料4', 10, 88],
              ['物料5', 50, 93]
            ]
          },
          xAxis: {type: 'category'},
          yAxis: {},
          color: ['#719df7', '#73ddb2'],
          series: [
            {type: 'bar', label: {show: true, position: 'top'}},
            {type: 'bar', label: {show: true, position: 'top'}}
          ]
        },

        day: null,
        tomorrow: null,
        week: null,
        month: null,
      }
    },
    created() {
      this.day = moment(new Date()).format('YYYY-MM-DD');
      this.tomorrow = moment((new Date()).setDate((new Date()).getDate() + 1)).format('YYYY-MM-DD');
      const weekNow = new Date(Date.now());
      this.week = moment(weekNow.setDate(weekNow.getDate() - 7)).format('YYYY-MM-DD');
      const monthNow = new Date(Date.now());
      this.month = moment(monthNow.setDate(monthNow.getDate() - 30)).format('YYYY-MM-DD');
      let that = this;
      this.leftChartOptions.toolbox.feature.myTool1.onclick = function () {
        that.getLeftChart(that.day, that.tomorrow);
      };
      this.leftChartOptions.toolbox.feature.myTool2.onclick = function () {
        that.getLeftChart(that.week, that.tomorrow);
      };
      this.leftChartOptions.toolbox.feature.myTool3.onclick = function () {
        that.getLeftChart(that.month, that.tomorrow);
      };
      // this.rightChartOptions.toolbox.feature.myTool1.onclick = function () {
      //   that.getRightChart(that.day, that.tomorrow);
      // };
      // this.rightChartOptions.toolbox.feature.myTool2.onclick = function () {
      //   that.getRightChart(that.week, that.tomorrow);
      // };
      // this.rightChartOptions.toolbox.feature.myTool3.onclick = function () {
      //   that.getRightChart(that.month, that.tomorrow);
      // };
    },
    methods: {
      beforeGetCascaderOpitions(param) {
        param.noDevice = true;
      },
      beforeGetTable(filterData) {
        filterData.ctrType = undefined;
        filterData.startTime = this.month;
        filterData.endTime = this.tomorrow;
        this.leftChartOptions.dataset.source = [['product', '计划', '实际']];
        this.rightChartOptions.dataset.source = [['product', '昨日', '今日']];
        Promise.all([finalMaterialPlanActualProduceNumChart({
          ...filterData, startTime: this.day, endTime: this.tomorrow
        }),
          finalMaterialPlanActualProduceCompareDataByTime({
            ...filterData, startTime: this.day, endTime: this.tomorrow
          })])
          .then((res) => {
            res.forEach((item, index) => {
              if (item.status === 200 && item.data.code === 200) {
                if (index === 0) {
                  item.data.data.forEach((dItem) => {
                    this.leftChartOptions.dataset.source.push([
                      dItem.materialName,
                      dItem.planSum,
                      dItem.actualSum
                    ]);
                  });
                } else {
                  if (item.data.data.hasOwnProperty('昨日')) {
                    item.data.data['昨日'].forEach((dItem) => {
                      this.rightChartOptions.dataset.source.push([
                        dItem.materialName,
                        dItem.actualSum
                      ]);
                    });
                  }
                  if (item.data.data.hasOwnProperty('今日')) {
                    item.data.data['今日'].forEach((dItem) => {
                      const sIndex = this.rightChartOptions.dataset.source.findIndex((sItem) => sItem[0] === dItem.materialName);
                      if (sIndex >= 0) {
                        this.rightChartOptions.dataset.source[sIndex].push(dItem.actualSum);
                      } else {
                        this.rightChartOptions.dataset.source.push([
                          dItem.materialName,
                          0,
                          dItem.actualSum
                        ]);
                      }
                    });
                  }
                }
                this.leftChartOptions.dataZoom[0].show = this.leftChartOptions.dataset.source.length > 5;
                this.rightChartOptions.dataZoom[0].show = this.rightChartOptions.dataset.source.length > 5;
              } else {
                this.$notifyError(`获取柱状图失败`, res.data.msg);
              }
            });
            this.$nextTick(() => {
              this.$refs.chartTable.initLeftChart();
              this.$refs.chartTable.initRightChart();
            });
          }).catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
      },
      getLeftChart(startTime, endTime) {
        Promise.resolve(finalMaterialPlanActualProduceNumChart({
          orgId: this.$store.state.user.userInfo.orgId,
          deviceId: this.$refs.chartTable.actionBarConfig[0].options[0].value,
          startTime: startTime,
          endTime: endTime
        })).then((res) => {
          if (res.status === 200 && res.data.code === 200) {
            this.leftChartOptions.dataset.source = [['product', '计划', '实际']];
            res.data.data.forEach((dItem) => {
              this.leftChartOptions.dataset.source.push([
                dItem.materialName,
                dItem.planSum,
                dItem.actualSum
              ]);
            });
            this.$nextTick(() => {
              this.$refs.chartTable.initLeftChart();
            });
          } else {
            this.$notifyError(`获取详情失败`, res.data.msg);
          }
        }).catch(() => {
          this.$notifyError("网络请求失败!", "");
        })
      },
      // getRightChart(startTime, endTime) {
      //   Promise.resolve(finalMaterialPlanActualProduceCompareDataByTime({
      //     orgId: this.$store.state.user.userInfo.orgId,
      //     deviceId: this.$refs.chartTable.actionBarConfig[0].options[0].value,
      //     startTime: startTime,
      //     endTime: endTime
      //   })).then((res) => {
      //     if (res.status === 200 && res.data.code === 200) {
      //       this.rightChartOptions.dataset.source = [['product', '昨日', '今日']];
      //       if (res.data.data.hasOwnProperty('昨日')) {
      //         res.data.data['昨日'].forEach((dItem) => {
      //           this.rightChartOptions.dataset.source.push([
      //             dItem.materialName,
      //             dItem.num
      //           ]);
      //         });
      //       }
      //       if (res.data.data.hasOwnProperty('今日')) {
      //         res.data.data['今日'].forEach((dItem) => {
      //           const sIndex = this.rightChartOptions.dataset.source.findIndex((sItem) => sItem[0] === dItem.materialName);
      //           if (sIndex >= 0) {
      //             this.rightChartOptions.dataset.source[sIndex].push(dItem.num);
      //           }else {
      //             this.rightChartOptions.dataset.source.push([
      //               dItem.materialName,
      //               0,
      //               dItem.num
      //             ]);
      //           }
      //         });
      //       }
      //       this.$nextTick(() => {
      //         this.$refs.chartTable.initRightChart();
      //       });
      //     } else {
      //       this.$notifyError(`获取详情失败`, res.data.msg);
      //     }
      //   }).catch(() => {
      //     this.$notifyError("网络请求失败!", "");
      //   })
      // },
      afterGetTableNoPage(res) {
        this.tableColumns = [
          {
            tag: "el-table-column",
            label: "#",
            type: "index",
            align: "center",
            width: 40,
          },
          {
            tag: "el-table-column",
            label: "物料代码",
            prop: "materialNumber",
            width: 180,
            showOverflowTooltip: true,
          },
          {
            tag: "el-table-column",
            label: "物料名称",
            prop: "materialName",
            width: 180,
            showOverflowTooltip: true,
          },
        ];
        //网上抄的
        let startTime = new Date(Date.parse(this.month));
        let endTime = new Date(Date.parse(this.tomorrow));
        const dates = Math.abs((startTime.getTime() - endTime.getTime())) / (1000 * 60 * 60 * 24);
        //上面三句话 自己优化
        for (let a = 0; a < dates ; a++) {
          const day = moment((endTime).setDate(endTime.getDate() - 1)).format('YYYY-MM-DD');
          this.tableColumns.push({
            tag: "el-table-column-column",
            label: day,
            columns: [
              {
                label: '实际产量',
                prop: day + 'actualNum',
                width: 180,
                sortable: true,
                showOverflowTooltip: true,
              },
              {
                label: "计划产量",
                prop: day + 'planNum',
                width: 180,
                sortable: true,
                showOverflowTooltip: true,
              }
            ],
          });
          res.forEach((rItem) => {
            rItem[day + 'actualNum'] = 0;
            rItem[day + 'planNum'] = 0;
          });
        }
        res.forEach((rItem) => {
          rItem.finalMaterialProduceDateNumList.forEach((fItem) => {
            rItem[fItem.date + 'actualNum'] = fItem.actualNum;
            rItem[fItem.date + 'planNum'] = fItem.planNum;
          });
        });
        res.listTable = res;
      },
    }
  }
</script>


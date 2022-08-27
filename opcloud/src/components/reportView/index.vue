<template>
  <div class="report-view-wrap">
    <div class="search-wrap" v-if="panelCfg && panelCfg.searchConfig.length > 0">
      <template v-for="item in panelCfg.searchConfig" :key="item.key">
        <div class="report-search-item">
          <div class="title">{{ item.fieldDes }}</div>
          <div class="component">
            <!-- 文本 -->
            <template v-if="item.fieldType === 1">
              <el-input
                v-model="searchFormData[item.field]"
                :placeholder="`请输入${item.fieldDes}`"
                clearable
              ></el-input>
            </template>
            <!-- 日期 -->
            <template v-else-if="item.fieldType === 3">
              <el-date-picker
                v-model="searchFormData[item.field]"
                :type="item.filterType === 2 ? 'daterange' : 'date'"
                :placeholder="`请选择${item.fieldDes}`"
              ></el-date-picker>
            </template>
            <!-- 日期时间 -->
            <template v-else-if="item.fieldType === 4">
              <el-date-picker
                v-model="searchFormData[item.field]"
                :type="item.filterType === 2 ? 'datetimerange' : 'datetime'"
                :placeholder="`请选择${item.fieldDes}`"
              ></el-date-picker>
            </template>
            <!-- 时间 -->
            <template v-else-if="item.fieldType === 5">
              <el-time-picker
                v-model="searchFormData[item.field]"
                :placeholder="`请选择${item.fieldDes}`"
                :is-range="item.filterType === 2"
              ></el-time-picker>
            </template>
          </div>
        </div>
      </template>
      <div class="search-btn">
        <el-button type="primary" plain @click="onSearch">查询</el-button>
      </div>
    </div>
    <div class="chart-list-wrap" :style="chartListStyle">
      <template v-for="element in chartpageSetting.currentChartList" :key="element.chartId">
        <!-- 图表类型 -->
        <chart-view v-if="element.type === 'chart'" :componentCfg="element" @onMore="onChartMore"></chart-view>
        <container-view v-else-if="element.type === 'container'" :componentCfg="element"></container-view>
        <card-view v-else-if="element.type === 'card'" :componentCfg="element"></card-view>
        <table-view v-else-if="element.type === 'table'" :componentCfg="element"></table-view>
        <tree-view
          v-else-if="element.type === 'tree'"
          :componentCfg="element"
          @nodeChange="onSelectNodeChange"
        ></tree-view>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, inject, nextTick, provide, reactive, watchEffect } from 'vue';
import { useDesignChart } from '@/hooks/use-designChart';
import { useRoute, useRouter } from 'vue-router';
import { getEchartsDetail, getChartData } from '@/api/homeApi/index';
import chartView from './chart.vue';
import containerView from './container.vue';
import cardView from './card.vue';
import tableView from './tableView.vue';
import treeView from './treeView.vue';
import { getLinkageData } from '@/api/design';
import dayjs from 'dayjs';
import { ReloadProvide } from './type';

type ChartSate = {
  /**组件列表列表 */
  currentChartList: any[];
  /**报表页面ID */
  curchartDesignId: string | number | undefined;
  /**报表页面配置 */
  panelCfg: any,
}

export default {
  name: 'report-view',
  components: { chartView, containerView, cardView, tableView, treeView },
  setup() {

    const route = useRoute();
    const router = useRouter();

    const parent: any = inject('parent', {})

    provide<ReloadProvide>('reload', {
      reloadTreeRelData: reloadTreeRelData
    })

    const reportViewDom = '.report-view-wrap'

    // 树节点
    let treeNode = undefined;

    // 页面的总数居和配置
    const chartpageSetting: ChartSate = reactive({
      // 当前的组件列表
      currentChartList: [],
      // 当前组件设计器的id
      curchartDesignId: undefined,
      // 当前的页面配置
      panelCfg: undefined,
    });

    const searchFormData = reactive({});

    //列表配置项
    const tableOption = reactive({
      tableData: [],
      paging: false,
      total: 0,
      tableLoading: false,
    });
    const { renderAllCharts } = useDesignChart();

    const panelCfg = computed(() => {
      return chartpageSetting.panelCfg
    });

    const gridTemplateColumns = computed<string>(() => {
      return panelCfg.value && `repeat(${panelCfg.value.columns},1fr)`;
    });

    const gridTemplateRows = computed<string>(() => {
      return panelCfg.value && `repeat(${panelCfg.value.rows},1fr)`;
    });
    // 网格gap
    const gap = computed<string>(() => {
      return panelCfg.value && `${panelCfg.value.gap || 10}px`;
    });
    // 列表高度
    const listHeight = computed<string>(() => {
      return panelCfg.value && panelCfg.value.searchConfig.length > 0 && `calc(100% - 52px)` || '100%'
    })

    // 列表样式
    const chartListStyle = computed(() => {
      return {
        gridTemplateColumns: gridTemplateColumns.value,
        gridTemplateRows: gridTemplateRows.value,
        gap: gap.value,
        height: listHeight.value
      };
    });

    watchEffect(() => {
      if (route.query.pageId) {
        init();
      }
    })

    /**
     * 查询事件
     */
    function onSearch(): void {
      searchData(chartpageSetting.currentChartList)
    }

    function searchData(currentChartList: any, relKey?: string | number) {
      const requestList: Promise<any>[] = [];
      for (let j = 0; j < currentChartList.length; j++) {
        const element = currentChartList[j];
        if (element.type !== 'container') {
          if (element.type === 'table') {
            const config: any = settingTransform(element.selectModel);
            requestList.push(getTableData(config, element, relKey));
          } else if (element.type !== 'tree') {
            requestList.push(getPageData(element, relKey));
          }
        } else {
          element.children && element.children.forEach((child) => {
            requestList.push(getPageData(child, relKey));
          })
        }
      }
      Promise.all(requestList).then(() => {
        // 图表呈现
        renderAllChars()
      })
    }

    /**
     * 初始化页面数据
     */
    async function init(): Promise<void> {
      let params = {
        pageId: route.query.pageId,
      };
      const res = await getEchartsDetail(params);
      if (res.code != 200) return;
      const responseData = res.data
      if (responseData && responseData.chartDesign) {

        const chartConfig = responseData.chartDesign
        chartpageSetting.curchartDesignId = chartConfig.id;
        // 图表列表；页面配置
        const { currentChartList, panelCfg } = chartConfig.pageItem

        chartpageSetting.currentChartList = currentChartList;

        chartpageSetting.panelCfg = panelCfg;

        onSearch();
      }
    }

    /**
     * 获取每个图表的数据
     * @param element 图表配置
     */
    async function getPageData(element: any, relKey?: string | number): Promise<void> {
      // 当前组件元素
      const curElement = element;
      let params: any = {
        chartDesignId: chartpageSetting.curchartDesignId,
        chartId: element.chartId,
        paramList: []
      };
      const paramList: any[] = []
      Object.keys(searchFormData).forEach(key => {
        if (searchFormData[key]) {
          const field = panelCfg.value.searchConfig.find(f => f.field === key)
          const fieldType = field && [3, 4, 5].includes(field.fieldType) ? 'DATE' : undefined
          paramList.push({
            fieldType: fieldType,
            tableFieldName: key,
            values: Array.isArray(searchFormData[key]) ? searchFormData[key] : [searchFormData[key]]
          })
        }
      })
      if (relKey) {
        relKey && paramList.push(
          {
            tableFieldName: element.__config__.relField,
            values: [relKey]
          }
        )
      }
      paramList.length > 0 && (params.paramList = paramList);
      // 组件联动参数增加

      const res = await getChartData(params);
      if (res.code != 200) return;
      const responseData = res.data;
      // 图表数据处理
      if (curElement.type === 'chart') {
        //当前图表的类型
        const { dataSourceAttr, xAxisDataAttr, yAxisDataAttr } = curElement.__config__;
        if (!responseData) return
        // 遍历返回结果，设置各个属性的对应的数据data
        for (let i = 0; i < curElement.series.length; i++) {
          const serie = curElement.series[i]
          const serieData = responseData[serie.id]
          const seriesItem = curElement.series[i];
          seriesItem.data = [];
          // 坐标轴系图表
          if (curElement.isAxis) {
            const { xAxis, yAxis } = curElement
            const axisType = xAxis?.type === 'value' ? yAxis?.type : xAxis?.type
            const unValueAxisAttr = xAxis?.type === 'value' ? yAxisDataAttr : xAxisDataAttr;
            if (axisType === 'time') {
              seriesItem.data =
                unValueAxisAttr && dataSourceAttr && serieData.map((item) => [item[unValueAxisAttr], item[dataSourceAttr[i]]])
              if (xAxis?.type === 'value') {
                yAxis && (yAxis.data = undefined)
              } else {
                xAxis && (xAxis.data = undefined)
              }
            } else {
              if (serieData) {
                seriesItem.data =
                  dataSourceAttr && serieData && serieData.map((item) => item[dataSourceAttr[i]])
                // 设置类目轴的DATA
                if (xAxis?.type === 'value') {
                  yAxis && yAxisDataAttr && (yAxis.data = serieData.map((item) => item[yAxisDataAttr]))
                } else {
                  xAxis && xAxisDataAttr && (xAxis.data = serieData.map((item) => item[xAxisDataAttr]))
                }
              }
            }
          }
          // 饼图，仪表盘
          if (curElement.__config__.type === 'pie' || curElement.__config__.type === 'gauge') {
            let tempArr = Object.entries(serieData[0]);
            seriesItem.data = tempArr.map((item) => ({
              name: item[0],
              value: item[1],
            }));
          }
          // 雷达图数据设置
          if (curElement.__config__.type === 'radar') {
            for (let index = 0; index < serieData.length; index++) {
              const element = serieData[index];
              Object.keys(element).map((key) => {
                seriesItem.data.push(element[key]);
              });
            }
          }
        }
      } else if (curElement.type === 'table') {
        // 当前的表格的数据
        curElement.tableData = [];
        responseData &&
          Object.keys(responseData).forEach((key) => {
            // 某一个表格的数据
            const tableChildData = responseData[key];
            if (curElement.chartId == key) {
              curElement.tableData = tableChildData.map((item, i) => {
                return item;
              });
            }
          });
      }
    }

    /**
     * 获取表格数据
     */
    async function getTableData(config: any, element: any, relKey?: string | number) {
      config.pageRequest = { pageIndex: 1, pageSize: 200 };
      config.chartFilterFields = []
      Object.keys(searchFormData).forEach(key => {
        if (searchFormData[key]) {
          const field = panelCfg.value.searchConfig.find(f => f.field === key)
          const fieldType = field && [3, 4, 5].includes(field.fieldType) ? 'DATE' : undefined
          config.chartFilterFields.push(
            {
              fieldType,
              fieldName: key,
              fieldValue: Array.isArray(searchFormData[key]) ? searchFormData[key] : [searchFormData[key]]
            }
          )
        }
      })
      if (relKey) {
        relKey && config.chartFilterFields.push(
          {
            fieldName: element.__config__.relField,
            fieldValue: relKey
          }
        )
      }
      const res = await getLinkageData(config);
      if (res.code === 200) {
        element.__attr__.tableData = res.data.records || [];
      }
    }

    /**
     * 配置转换
     * @configList 关联配置
     */
    function settingTransform(configList: any[]) {
      const params = {
        masterFieldValue: undefined,
        masterRelatedFieldName: undefined,
        masterRelatedTableName: undefined,
        tableEntityList: [] as any[],
      };
      for (let i = 0; i < configList.length; i++) {
        const config = configList[i];
        const tableEntity: any = {
          displayedFields: [],
          relatedFieldsConfig: [],
          tableName: undefined,
        };
        config.fields &&
          tableEntity.displayedFields.push(
            ...config.fields
              .filter((f) => f.check === true)
              .map((m) => {
                return {
                  fieldName: m.fieldName,
                };
              })
          );
        const rellist = config.rellist;
        rellist &&
          tableEntity.relatedFieldsConfig.push(
            ...rellist.map((m) => {
              return {
                fieldName: m.field,
                foreignTableName: m.fField[0],
                foreignFieldName: m.fField[1],
                relatedType:
                  m.reltype === 'join' ? 0 : m.reltype === 'left join' ? 1 : 2,
              };
            })
          );
        i === 0 && (params.masterRelatedTableName = config.tableName);
        tableEntity.tableName = config.tableName;
        params.tableEntityList.push(tableEntity);
      }
      return params;
    }

    function onChartMore(e: any) {
      const detailParams = e;
      if (detailParams && detailParams.length > 0) {
        // 参数处理
        const searchData = {}
        Object.keys(searchFormData).forEach((key: string) => {
          const k = key.indexOf('#') > -1 ? key.split('#')[1] : key;
          if (Object.prototype.toString.call(searchFormData[key]) === '[object Date]') {
            searchData[k] = dayjs(searchFormData[key]).format('YYYY-MM-DD HH:mm:ss')
          } else if (Object.prototype.toString.call(searchFormData[key]) === '[object Array]') {
            if (Object.prototype.toString.call(searchFormData[key][0]) === '[object Date]') {
              searchData[k] = searchFormData[key].map(m => dayjs(m).format('YYYY-MM-DD HH:mm:ss'))
            } else {
              searchData[k] = searchFormData[key]
            }
          } else {
            searchData[k] = searchFormData[key]
          }
        })
        router.replace({
          path: "/application",
          query: {
            appid: detailParams[0],
            modelid: detailParams[1],
            pageId: detailParams[2],
            ...searchData
          }
        }).then(() => {
          const { getInfoByappid } = parent;
          getInfoByappid()
        })
      }
    }

    // tree node选中节点变更时触发的事件
    function onSelectNodeChange(current: any, node: any) {
      treeNode = node;
      // 获取联动组件，并刷新联动组件数据
      for (let i = 0; i < chartpageSetting.currentChartList.length; i++) {
        const element = chartpageSetting.currentChartList[i];
        if (current.chartId === element.relComponent) return
        if (element.relComponent === current.chartId) {
          getPageData(element);
          continue;
        }
        element.children && element.children.forEach((child) => {
          if (child.relComponent === current.chartId) {
            getPageData(child);
          }
        })
      }
    }

    // 刷新树形组件联动的数据
    function reloadTreeRelData(data: any) {
      const { chartId, node } = data;
      if (!chartId || !node.id) return;
      // 查询联动的组件
      const relComponetList: any = []
      const getRelComponent = (currentList: any[]) => {
        for (let i = 0; i < currentList.length; i++) {
          const elemnt = currentList[i]
          if (elemnt.chartId === chartId) continue;
          if (elemnt.__config__.relComponent && elemnt.__config__.relComponent === chartId) {
            relComponetList.push(elemnt)
            continue;
          }
          if (elemnt.children && elemnt.children.length > 0) {
            getRelComponent(elemnt.children)
          }
        }
      }
      getRelComponent(chartpageSetting.currentChartList)
      if (relComponetList.length > 0) {
        searchData(relComponetList, node.id)
      }
    }


    function renderAllChars() {
      nextTick(() => {
        renderAllCharts(reportViewDom, chartpageSetting.currentChartList);
      });
    }

    return {
      chartpageSetting,
      tableOption,
      panelCfg,
      searchFormData,
      chartListStyle,
      onSearch,
      onChartMore,
      onSelectNodeChange
    };
  },
};
</script>

<style lang="scss">
@import "@/styles/modules/designchart/chartshow.scss";
</style>

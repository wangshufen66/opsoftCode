<template>
  <el-form size="small" label-width="90px">
    <el-form-item label="标题">
      <el-input
        v-model.number="activeChart.__config__.label"
        clearable
        placeholder="请输入图表标题"
        @blur="refreshChart('')"
      />
    </el-form-item>
    <el-form-item label="集合">
      <template #label>
        <span class="add-serie">
          <i class="el-icon-circle-plus" @click="addDefaultSerie"></i>集合
        </span>
      </template>
      <el-select v-model="activeChartIndex" filterable placeholder="请选择轴类型">
        <el-option
          v-for="(serie, index) in activeChart.series"
          :value="index"
          :label="serie.name"
          :key="serie.id"
        >
          <span class="custom-option">
            {{ serie.name }}
            <i class="el-icon-remove" @click.stop="removeChart(index)"></i>
          </span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="类型">
      <el-select
        v-model="activeChart.series[activeChartIndex].type"
        placeholder="请选择图表类型"
        @change="onChartTypeChange"
      >
        <el-option
          :value="attr.value"
          :label="attr.label"
          v-for="attr in chartType"
          :key="attr.value"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="名称">
      <el-input
        v-model="activeChart.series[activeChartIndex].name"
        clearable
        placeholder="请输入图表名称"
        @blur="refreshChart('')"
      />
    </el-form-item>
    <div class="divider-wrap">布局</div>
    <el-row>
      <el-col :span="12">
        <el-form-item label="跨行">
          <el-input v-model.number="activeChart.__config__.rowSpan" @blur="onGirdSpanChange" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="跨列">
          <el-input v-model.number="activeChart.__config__.colSpan" @blur="refreshChart('')" />
        </el-form-item>
      </el-col>
    </el-row>
    <template v-if="activeChart.componentTag !== 'gaugechart'">
      <div class="divider-wrap">图表边距</div>
      <el-row v-if="activeChart.grid">
        <el-col :span="12">
          <el-form-item label="上边距">
            <el-input v-model.number="activeChart.grid.top" @blur="refreshChart('')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下边距">
            <el-input v-model.number="activeChart.grid.bottom" @blur="refreshChart('')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="左边距">
            <el-input v-model.number="activeChart.grid.left" @blur="refreshChart('')" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="右边距">
            <el-input v-model.number="activeChart.grid.right" @blur="refreshChart('')" />
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <!-- 数据源 -->
    <div class="divider-wrap">数据源</div>
    <el-form-item label="类型">
      <el-select v-model="activeChart.__config__.dataType[activeChartIndex]" placeholder="请选择轴类型">
        <el-option value="0" label="SQL语句"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SQL" v-show="activeChart.__config__.dataType[activeChartIndex] == '0'">
      <el-input
        type="textarea"
        :rows="4"
        placeholder="请输入SQL查询语句"
        v-model="activeChart.__config__.dataOrg[activeChartIndex]"
      ></el-input>
      <el-button type="primary" size="mini" @click="getChartData">获取数据结构</el-button>
    </el-form-item>
    <el-form-item label="值绑定">
      <el-select
        v-model="activeChart.__config__.dataSourceAttr[activeChartIndex]"
        placeholder="请选择值绑定的字段"
        @change="onSeriesDataChange"
      >
        <el-option :value="attr" :label="attr" v-for="attr in dataSourFiled" :key="attr"></el-option>
      </el-select>
    </el-form-item>
    <!-- 雷达图 -->
    <template v-if="activeChart.series[activeChartIndex].type == 'radar'">
      <div class="divider-wrap">维度设置</div>
      <div class="radar-list" v-for="(item, index) in activeChart.radar.indicator" :key="index">
        <div class="radar-item">
          <div class="item-left">
            <el-form-item label="名称">
              <el-input
                v-model="item.name"
                clearable
                placeholder="请输入维度名称"
                @blur="refreshChart('')"
              />
            </el-form-item>
            <el-form-item label="最大值">
              <el-input
                v-model="item.max"
                type="number"
                clearable
                placeholder="请输入维度最大值"
                @blur="refreshChart('')"
              />
            </el-form-item>
          </div>
          <div class="item-right">
            <el-button type="text" @click="removeRadar(item)">删除</el-button>
            <el-button type="text" @click="addRadar">添加</el-button>
          </div>
        </div>
      </div>
    </template>
    <!-- 饼图 -->
    <template v-if="activeChart.series[activeChartIndex].type === 'pie'">
      <el-row>
        <el-col :span="12">
          <el-form-item label="大小">
            <el-input
              v-model.number="activeChart.series[activeChartIndex].radius"
              @blur="refreshChart('')"
            >
              <template #suffix>%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="环形图">
            <el-switch
              v-model="activeChart.series[activeChartIndex].annular"
              @change="refreshChart('')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示占比">
            <el-switch
              v-model="activeChart.series[activeChartIndex].ratio"
              @change="refreshChart('')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </template>
    <!-- X坐标轴 -->
    <template v-if="activeChart.isAxis">
      <div class="divider-wrap">x轴</div>
      <el-form-item label="名称">
        <el-input
          v-model.number="activeChart.xAxis.name"
          clearable
          placeholder="请输入坐标轴名称(可空)"
          @blur="refreshChart('')"
        />
      </el-form-item>
      <el-form-item label="坐标轴类型">
        <el-select v-model="activeChart.xAxis.type" placeholder="请选择轴类型" @change="refreshChart('')">
          <el-option
            v-for="item in AxisType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <template
        v-if="
          activeChart.xAxis &&
          (activeChart.xAxis.type === 'category' ||
            activeChart.xAxis.type === 'time')
        "
      >
        <el-form-item label="绑定字段">
          <el-select
            v-model="activeChart.__config__.xAxisDataAttr"
            placeholder="请选择数据类型"
            @change="axisDataSourceChange()"
          >
            <el-option :value="attr" :label="attr" v-for="attr in dataSourFiled" :key="attr"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </template>
    <!-- Y坐标轴 -->
    <template v-if="activeChart.isAxis">
      <div class="divider-wrap">y轴</div>
      <el-form-item label="坐标轴名称">
        <el-input
          v-model.number="activeChart.yAxis.name"
          clearable
          placeholder="请输入坐标轴名称(可空)"
          @input="refreshChart('')"
        />
      </el-form-item>
      <el-form-item label="坐标轴类型">
        <el-select v-model="activeChart.yAxis.type" placeholder="请选择轴类型" @change="refreshChart('')">
          <el-option
            v-for="item in AxisType"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <template
        v-if="
          activeChart.yAxis &&
          (activeChart.yAxis.type === 'category' ||
            activeChart.yAxis.type === 'time')
        "
      >
        <el-form-item label="绑定字段">
          <el-select
            v-model="activeChart.__config__.yAxisDataAttr"
            placeholder="请选择数据类型"
            @change="axisDataSourceChange()"
          >
            <el-option :value="attr" :label="attr" v-for="attr in dataSourFiled" :key="attr"></el-option>
          </el-select>
        </el-form-item>
      </template>
    </template>
    <!-- 图例配置 -->
    <div class="divider-wrap">图例</div>
    <el-form-item label="显示">
      <el-switch v-model="activeChart.legend.show" @change="onLegendChange" />
    </el-form-item>
    <el-form-item label="位置">
      <el-select
        v-model="activeChart.legend.position"
        placeholder="请选图例显示位置"
        @change="refreshChart('')"
      >
        <el-option value="top" label="顶部"></el-option>
        <el-option value="bottom" label="底部"></el-option>
        <el-option value="left" label="左侧"></el-option>
        <el-option value="right" label="右侧"></el-option>
      </el-select>
    </el-form-item>
    <rel-component-setting></rel-component-setting>
    <detail-setting></detail-setting>
  </el-form>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from "vue";
import { useDesignChart, useActiveDesignChart } from "@/hooks/use-designChart";
import { messageAlert } from "@/shared/utils/utils";
import { AxisType, chartType } from "@/shared/const";
import { getDataBySql } from "@/api/homeApi";
import detailSetting from "./detailSet.vue";
import relComponentSetting from "./relComponentSet.vue";

export default defineComponent({
  components: { detailSetting, relComponentSetting },
  setup() {
    const { currentChartList } = useDesignChart();
    const { activeChart, refreshChart, addDefaultSerie, removeSerie } =
      useActiveDesignChart(currentChartList);

    const activeChartIndex = ref<number>(0);

    const dataSourFiled = computed<string[]>(() => {
      const { dataSource } = activeChart.value.__config__;
      const attrs: string[] = [];
      if (dataSource[activeChartIndex.value]) {
        const _dataSource = dataSource[activeChartIndex.value]
        if (Object.prototype.toString.apply(_dataSource) === "[object Array]") {
          Object.keys(_dataSource[0]).forEach((item) => {
            attrs.push(item);
          });
        } else if (
          Object.prototype.toString.apply(_dataSource) === "[object Object]"
        ) {
          Object.keys(_dataSource).forEach((item) => {
            attrs.push(item);
          });
        } else {
          throw "未知数据类型(echarts datasource bind!)";
        }
      }
      return attrs || [];
    });

    const relComponentList = computed(() => {
      return currentChartList.value.filter(
        (f) => f.chartId !== activeChart.value.chartId
      );
    });

    function removeChart(index: number): void {
      const { series } = activeChart.value;
      if (series.length === 1) {
        messageAlert("error", "必须包含一项图表!");
      } else {
        removeSerie(index);
      }
    }

    function onGirdSpanChange() {
      const { colSpan, rowSpan } = activeChart.value.__config__;
      if (
        colSpan &&
        colSpan > 0 &&
        colSpan <= 20 &&
        rowSpan &&
        rowSpan > 0 &&
        rowSpan <= 20
      ) {
        refreshChart("");
      } else {
        messageAlert("error", "跨行/跨列范围必须在1-20之间");
      }
    }

    // 获取图表数据源
    async function getChartData() {
      const { __config__ } = activeChart.value;
      if (!__config__.dataOrg[activeChartIndex.value].trim()) {
        messageAlert("error", "SQL不能为空!");
        return;
      }
      let para = {
        sql: __config__.dataOrg[activeChartIndex.value],
      };
      const res = await getDataBySql(para);
      if (res.code === 200 && res.data.length) {
        !__config__.dataSource && (__config__.dataSource = []);
        __config__.dataSource[activeChartIndex.value] = res.data;
        if (!activeChart.value.isAxis) {
          let tempArr: any = Object.entries(res.data[0]);
          let flag = tempArr.some((item) => /\d+/.test(item[1]));
          if (!flag) {
            messageAlert("error", "请确认SQL语句执行的结果包含数值类型");
            return;
          }
          activeChart.value.series[activeChartIndex.value].data = tempArr.map(
            (item) => ({
              name: item[0],
              value: item[1],
            })
          );
          activeChart.value.tooltip &&
            (activeChart.value.tooltip.trigger = "item");
          refreshChart("");
        }
        messageAlert("success", "获取成功");
      }
    }
    /**
     * 值字段绑定改变时
     */
    function onSeriesDataChange(e: string) {
      dataBind();
      refreshChart("");
    }

    function axisDataSourceChange() {
      dataBind();
      refreshChart("");
    }

    // 图表类型切换
    function onChartTypeChange(e: string) {
      if (e === "pie") {
        // activeChart.value.
      }
      refreshChart("");
    }

    // 删除一个维度
    function removeRadar(item) {
      if (activeChart.value.radar.indicator.length === 1) {
        messageAlert("warning", "至少保留一个维度");
        return;
      }
      activeChart.value.radar.indicator =
        activeChart.value.radar.indicator.filter((element) => {
          return item != element;
        });
      refreshChart("");
    }

    // 添加一个维度
    function addRadar() {
      activeChart.value.radar.indicator.push({ name: "维度名称", max: 2000 });
      refreshChart("");
    }

    function onLegendChange(): void {
      refreshChart("");
    }

    /**
     * 数据绑定
     */
    function dataBind() {
      // 坐标系图表
      if (activeChart.value.isAxis === true) {
        const { xAxis, yAxis } = activeChart.value;
        const { dataSource, dataSourceAttr, xAxisDataAttr, yAxisDataAttr } =
          activeChart.value.__config__;
        const currentDataSourceAttr =
          dataSourceAttr && dataSourceAttr[activeChartIndex.value];
        const currentxAxisDataAttr = xAxisDataAttr;
        const currentyAxisDataAttr = yAxisDataAttr;
        // 非值坐标轴绑定的属性
        const unValueAxisAttr =
          xAxis?.type === "value"
            ? currentyAxisDataAttr && currentyAxisDataAttr
            : currentxAxisDataAttr && currentxAxisDataAttr;
        // 非值坐标轴类型
        const axisType = xAxis?.type === "value" ? yAxis?.type : xAxis?.type;
        // 时间轴
        if (axisType === "time") {
          activeChart.value.series[activeChartIndex.value].data =
            unValueAxisAttr &&
            currentDataSourceAttr &&
            dataSource[activeChartIndex.value].map((item) => [
              item[unValueAxisAttr],
              item[currentDataSourceAttr],
            ]);
          if (xAxis?.type === "value") {
            yAxis && (yAxis.data = undefined);
          } else {
            xAxis && (xAxis.data = undefined);
          }
        } else {
          activeChart.value.series[activeChartIndex.value].data =
            currentDataSourceAttr &&
            dataSource[activeChartIndex.value].map((item) => item[currentDataSourceAttr]);
          // 设置类目轴的DATA
          if (xAxis?.type === "value") {
            yAxis &&
              currentyAxisDataAttr &&
              (yAxis.data = dataSource[activeChartIndex.value].map(
                (item) => item[currentyAxisDataAttr]
              ));
          } else {
            xAxis &&
              currentxAxisDataAttr &&
              (xAxis.data = dataSource[activeChartIndex.value].map(
                (item) => item[currentxAxisDataAttr]
              ));
          }
        }
      } else {
      }
    }

    return {
      activeChart,
      activeChartIndex,
      dataSourFiled,
      AxisType,
      chartType,
      relComponentList,
      refreshChart,
      addDefaultSerie,
      removeSerie,
      removeChart,
      onGirdSpanChange,
      getChartData,
      axisDataSourceChange,
      onChartTypeChange,
      removeRadar,
      addRadar,
      onLegendChange,
      onSeriesDataChange,
    };
  },
});
</script>

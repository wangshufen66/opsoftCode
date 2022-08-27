<template>
    <el-form size="small" label-width="90px">
        <el-form-item label="标题">
            <el-input
                v-model.number="activeChart.__config__.label"
                clearable
                placeholder="请输入图表标题"
            />
        </el-form-item>
        <el-row>
            <el-col :span="12">
                <el-form-item label="行索引">
                    <el-switch v-model="activeChart.__attr__.indexCol" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="行多选">
                    <el-switch v-model="activeChart.__attr__.selectionCol" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="分页">
                    <el-switch v-model="activeChart.__attr__.paging" />
                </el-form-item>
            </el-col>
        </el-row>
        <div class="divider-wrap">布局</div>
        <el-row>
            <el-col :span="12">
                <el-form-item label="跨行">
                    <el-input v-model.number="activeChart.__config__.rowSpan" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="跨列">
                    <el-input v-model.number="activeChart.__config__.colSpan" />
                </el-form-item>
            </el-col>
        </el-row>
        <div class="divider-wrap">数据源</div>
        <el-row>
            <el-col :span="12">
                <el-form-item label="数据源设置">
                    <el-button
                        :type="activeChart.selectModel && activeChart.selectModel.length > 0 ? 'success' : 'danger'"
                        plain
                        icon="el-icon-setting"
                        @click="dialogState.dataSourceVisible = true"
                    ></el-button>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="表格列设置">
                    <el-button
                        :type="activeChart.columnModel && activeChart.columnModel.length > 0 ? 'success' : 'danger'"
                        plain
                        icon="el-icon-setting"
                        @click="dialogState.columnSettingVisible = true"
                    ></el-button>
                </el-form-item>
            </el-col>
        </el-row>
        <rel-component-setting></rel-component-setting>
    </el-form>
    <!-- 数据源设置 -->
    <data-soure-setting
        v-model:visible="dialogState.dataSourceVisible"
        :setting="activeChart?.selectModel"
        @on-submit="onSubmitDataSoureSet"
    ></data-soure-setting>
    <column-setting
        v-model:visible="dialogState.columnSettingVisible"
        :columnSetting="activeChart?.columnModel"
    ></column-setting>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useDesignChart, useActiveDesignChart } from '@/use/useDesignChart';
import dataSoureSetting from '@/components/dataSoureSetting/index.vue';
import columnSetting from '@/components/commontable/columnSetting.vue';
import relComponentSetting from './relComponentSet.vue'

export default defineComponent({
    name: 'table-setting',
    components: { columnSetting, dataSoureSetting, relComponentSetting },
    setup() {
        const { currentChartList } = useDesignChart();
        const { activeChart } = useActiveDesignChart(currentChartList);

        // 弹窗状态
        const dialogState = reactive({
            columnSettingVisible: false,
            dataSourceVisible: false,
        });

        function onSubmitDataSoureSet(obj: any[]) {
            activeChart.value && (activeChart.value.selectModel = obj);
            // 生成列配置
            const columnSetting = columnTransform(activeChart.value?.selectModel);
            columnSetting &&
                columnSetting.length > 0 &&
                (activeChart.value.columnModel = columnSetting);
        }

        /**
         * 数据源配置转换成列
         * @configList 数据源配置
        */
        function columnTransform(configList: any[]) {
            const colums: any[] = [];
            for (let i = 0; i < configList.length; i++) {
                const config = configList[i];
                const filters = config.fields.filter((f) => f.check === true);
                colums.push(
                    ...filters.map((m) => {
                        return {
                            prop: `${config.tableName}__${m.fieldName}`.toLocaleUpperCase(),
                            label:
                                m.fieldRemark === 'id'
                                    ? `${config.tableRemark}__ID`
                                    : m.fieldRemark,
                            width: 150,
                            sortable: m.sortable,
                            check: false,
                            insearh: 0,
                        };
                    })
                );
            }
            return colums;
        }

        return {
            activeChart,
            dialogState,
            onSubmitDataSoureSet
        }
    }
})
</script>
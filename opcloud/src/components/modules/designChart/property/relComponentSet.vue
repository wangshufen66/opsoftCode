<!-- 组件联动设置 -->
<template>
    <div class="divider-wrap">联动设置</div>
    <el-form-item>
        <template #label>
            联动组件
            <el-tooltip placement="bottom" content="联动组件值变更，将刷新该组件的值">
                <i class="header-icon el-icon-info"></i>
            </el-tooltip>
        </template>
        <el-select v-model="activeChart.__config__.relComponent" placeholder="请选择联动组件" clearable>
            <el-option
                v-for="component in  relComponentList"
                :key="component.__config__.label"
                :value="component.chartId"
                :label="component.__config__.label"
            ></el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="关联字段">
        <el-cascader
            ref="cascaderRef"
            v-model="activeChart.__config__.relFieldList"
            :props="cascaderProps"
            @change="handleChange"
            separator="-"
        ></el-cascader>
    </el-form-item>
</template>

<script lang="ts">
import { getAppList, getFieldByPage, getModelByApp, getPageByModel } from '@/api/userApi';
import { useActiveDesignChart, useDesignChart } from '@/hooks/use-designChart';
import { ref, computed, defineComponent } from 'vue';

export default defineComponent({
    setup() {

        const { currentChartList } = useDesignChart();
        const { activeChart } = useActiveDesignChart(currentChartList);

        const cascaderRef = ref<any>(null)

        const relComponentList = computed(() => {
            return currentChartList.value.filter(f => f.chartId !== activeChart.value.chartId)
        })

        const cascaderProps = computed(() => {
            return {
                lazy: true,
                lazyLoad: async (node, resolve) => {
                    const { level, value } = node;
                    if (level === 0) {
                        const res = await getAppList()
                        if (res.code == 200) {
                            const nodes = res.data.map((m) => {
                                return {
                                    label: m.appName,
                                    value: m.id,
                                    leaf: level >= 3,
                                };
                            });
                            resolve(nodes);
                        }
                    } else if (level === 1) {
                        // 加载模块
                        const res = await getModelByApp({ appId: value })
                        if (res.code == 200) {
                            const nodes = res.data.map((m) => {
                                return {
                                    label: m.modelName,
                                    value: m.id,
                                    leaf: level >= 3,
                                };
                            });
                            resolve(nodes);
                        }
                    } else if (level === 2) {
                        // 加载页面
                        const res = await getPageByModel({ modelId: value })
                        if (res.code == 200) {
                            const nodes = res.data.map((m) => {
                                return {
                                    label: m.pageName,
                                    value: m.pageTableName,
                                    pageId: m.id,
                                    leaf: level >= 3,
                                };
                            });
                            resolve(nodes);
                        }
                    } else {
                        // 加载字段
                        const res = await getFieldByPage({ pageId: node.data.pageId })
                        if (res.code == 200) {
                            const nodes = res.data.map((m) => {
                                return {
                                    label: m.fieldRemark,
                                    value: m.fieldName,
                                    leaf: level >= 3,
                                };
                            });
                            resolve(nodes);
                        }
                    }
                },
            }
        })

        function handleChange(e: any) {
            if (cascaderRef.value) {
                activeChart.value.__config__.relField = `${e[2]}#${e[3]}`;
            }
        }

        return {
            cascaderRef,
            activeChart,
            relComponentList,
            cascaderProps,
            handleChange
        }
    }
})
</script>
<template>
    <div class="filter-wrap">
        <div class="filter-item" v-for="(item,index) in filterConfig" :key="item.field">
            <el-select
                v-model="item.filterName"
                clearable
                filterable
                placeholder="请设置过滤条件字段"
                @change="onFieldChange(item, $event)"
            >
                <el-option
                    v-for="field in fieldList"
                    :key="field.fieldName"
                    :value="field.fieldName"
                    :label="field.fieldRemark"
                ></el-option>
            </el-select>
            <el-select
                v-model="item.filterCompare"
                placeholder="请设置过滤条件类型"
                @change="onFilterCompare(item, $event)"
            >
                <template v-if="item.filterCompareType">
                    <el-option
                        v-for="filterType in filterCompare[item.filterCompareType]"
                        :value="filterType.value"
                        :label="filterType.label"
                    ></el-option>
                </template>
            </el-select>
            <!-- 过滤值设置 -->
            <template v-if="item.filterCompareType !== 'date'">
                <template v-if="item.valueType === 'select'">
                    <template v-if="item.filterCompareType === 'multiple'">
                        <el-select v-model="item.filterValue" multiple clearable filterable>
                            <el-option
                                v-for="option in item.filterValueOption"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                            ></el-option>
                        </el-select>
                    </template>
                    <template v-else>
                        <el-select v-model="item.filterValue[0]" clearable filterable>
                            <el-option
                                v-for="option in item.filterValueOption"
                                :key="option.value"
                                :value="option.value"
                                :label="option.label"
                            ></el-option>
                        </el-select>
                    </template>
                </template>
                <template v-else-if="item.valueType === 'number'">
                    <el-input-number v-model="item.filterValue[0]" clearable></el-input-number>
                </template>
                <template v-else-if="item.valueType === 'time'">
                    <el-time-picker v-model="item.filterValue[0]"></el-time-picker>
                </template>
                <template v-else>
                    <el-input v-model="item.filterValue[0]" clearable></el-input>
                </template>
            </template>
            <div class="oper-warp">
                <i class="el-icon-plus" @click="onAddFilter" title="添加过滤条件"></i>
                <i
                    class="el-icon-close"
                    v-if="filterConfig && filterConfig.length > 1"
                    @click="onRemoveFilter(index)"
                    title="删除过滤条件"
                ></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getMonthDateTime, getNowDayDateTime, getNowHourDateTime, getQuarterDateTime, getWeekDateTime, getYearDateTime } from '@/utils/date';
import useInitComponentData from "@/viewHooks/use-init-component";

const props = defineProps({
    /**字段列表 */
    fieldList: Array,
    /**字段配置 */
    fieldConfig: Array,
    /**配置 */
    filterConfig: Object,
})

// 组件数据初始化
const { selectInit } = useInitComponentData();

const filterCompare = {
    date: [
        { label: '一小时内', value: 'hour' },
        { label: '今天', value: 'day' },
        { label: '本周', value: 'week' },
        { label: '本月', value: 'month' },
        { label: '本季度', value: 'quarter' },
        { label: '本年', value: 'year' }
    ],
    value: [
        { label: '等于', value: '=' },
        { label: '小于等于', value: '<=' },
        { label: '大于等于', value: '>=' },
        { label: '大于', value: '>' },
        { label: '小于', value: '<' },
        { label: '不等于', value: '!=' },
    ],
    multiple: [
        { label: '包含', value: 'in' },
    ]
}

// 过滤字段切换
function onFieldChange(item: any, e: string | number): void {
    item.filterCompare = undefined
    item.filterCompareType = undefined
    item.filterValue = []
    const component: any = props.fieldConfig?.find(f => f.__vModel__ === e);
    if (component) {
        const componentTag = component.componentTag;
        if (['designMoreSelect', 'designMultiDatePicker', 'designCheckBox'].includes(componentTag)) {
            item.filterCompareType = 'multiple';
            item.valueType = 'select'
            // 获取值选项
            getSelectData(item, component);
        } else if (['designDatePicker', 'designDateRangePicker', 'designCheckBox'].includes(componentTag)) {
            item.filterCompareType = 'date';
        } else if (['designTimePicker'].includes(componentTag)) {
            item.filterCompareType = 'value';
            item.valueType = 'time';
        } else {
            item.filterCompareType = 'value';
            if (['designSelect', 'designSwitch', 'designRadio'].includes(componentTag)) {
                item.valueType = 'select';
                getSelectData(item, component);
            }
            else if (['designNumber'].includes(componentTag)) {
                item.valueType = 'number';
            } else {
                item.valueType = 'text';
            }
        }
        item.filterCompare = filterCompare[item.filterCompareType][0].value
    } else {
        const field: any = props.fieldList?.find(f => f.fieldName === e);
        if (field && field.fieldType === 'DATE') {
            item.filterCompareType = 'date';
            item.valueType = 'date';
        } else {
            item.filterValueOption = []
            item.valueType = 'text';
            item.filterCompareType = 'value';
        }
    }
}

// 条件类型切换
function onFilterCompare(item: any): void {
    if (item.filterCompareType === 'date') {
        switch (item.filterCompare) {
            case 'hour':
                item.filterValue = getNowHourDateTime();
                break;
            case 'day':
                item.filterValue = getNowDayDateTime()
                break;
            case 'week':
                item.filterValue = getWeekDateTime()
                break;
            case 'month':
                item.filterValue = getMonthDateTime()
                break;
            case 'quarter':
                item.filterValue = getQuarterDateTime()
                break;
            case 'year':
                item.filterValue = getYearDateTime()
                break;
        }
    }
}


function onAddFilter(): void {
    props.filterConfig && props.filterConfig.push({
        filterName: undefined,
        filterCompare: undefined,
        filterValue: [],
    });
}


function onRemoveFilter(index: string | number) {
    props.filterConfig && props.filterConfig.splice(index, 1);
}

function getSelectData(item: any, component: any) {
    if (component && component.__relTable__ && component.__relTable__.key) {
        // 动态数据
        selectInit(component).then(() => {
            item.filterValueOption = component.options
        });
    } else {
        // 静态数据
        if (component.componentTag === 'designSwitch') {
            const config: any = component.__config__;
            item.filterValueOption = [{ label: config.activeText, value: 1 }, { label: config.inactiveText, value: 0 }]
        } else {
            item.filterValueOption = component.options
        }
    }
}

</script>

<style lang="scss" scoped>
.filter-item {
    margin-bottom: 10px;
    padding-right: 20px;
    display: grid;
    grid-template-columns: 2fr 1fr 2fr 0.5fr;
    gap: 10px;
}
.oper-warp {
    display: flex;
    align-items: center;
    i {
        margin-right: 8px;
        cursor: pointer;
    }
}
</style>
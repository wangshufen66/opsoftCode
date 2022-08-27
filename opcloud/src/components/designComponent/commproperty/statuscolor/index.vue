<!-- 组件属性配置 — 字段字体颜色设置 -->
<template>
    <div class="divider-wrap">显示颜色设置</div>
    <el-row>
        <el-col :span="12">
            <el-form-item label="方式" label-width="60px">
                <el-select v-model="componentCfg.__style__.displayType" clearable>
                    <el-option :value="1" label="默认"></el-option>
                    <el-option :value="2" label="按条件"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="外观" label-width="60px">
                <el-select v-model="componentCfg.__style__.shape" clearable>
                    <el-option :value="1" label="默认"></el-option>
                    <el-option :value="2" label="圆点"></el-option>
                    <el-option :value="3" label="标签"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
    </el-row>
    <el-form-item label="颜色" label-width="60px" v-if="componentCfg.__style__.displayType === 1">
        <el-select v-model="componentCfg.__style__.defaultColor" clearable>
            <el-option value="primary" label="默认主题"></el-option>
            <el-option value="success" label="绿色"></el-option>
            <el-option value="warning" label="黄色"></el-option>
            <el-option value="error" label="红色"></el-option>
            <el-option value="info" label="灰色"></el-option>
        </el-select>
    </el-form-item>
    <template v-if="componentCfg.__style__.displayType === 2">
        <el-form-item :label-width="0">
            <div class="filter-item" v-for="(item,index) in componentCfg.__style__.colorCfg">
                <el-select
                    v-model="item.filterName"
                    clearable
                    filterable
                    placeholder="请设置条件字段"
                    @change="onFieldChange(item, $event)"
                >
                    <el-option
                        v-for="field in componentList"
                        :key="field.fieldName"
                        :value="field.fieldName"
                        :label="field.fieldRemark"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="item.filterCompare"
                    placeholder="请设置条件类型"
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

                <!-- <el-select v-model="item.fieldName" filterable clearable>
                    <el-option
                        v-for="component in componentList"
                        :key="component.componentId"
                        :value="component.__vModel__"
                        :label="component.__form__?.label"
                    ></el-option>
                </el-select>-->
                <el-select v-model="item.color" clearable>
                    <el-option value="primary" label="默认主题"></el-option>
                    <el-option value="success" label="绿色"></el-option>
                    <el-option value="warning" label="黄色"></el-option>
                    <el-option value="error" label="红色"></el-option>
                    <el-option value="info" label="灰色"></el-option>
                </el-select>
                <i class="el-icon-remove-outline" @click="onRemoveItem(index)" />
            </div>
        </el-form-item>
        <div style="margin-left: 20px">
            <el-button icon="el-icon-circle-plus-outline" type="text" @click="onAddFilter">添加条件</el-button>
        </div>
    </template>
</template>
  
<script lang="ts">
import { computed, inject, watch } from 'vue';
import { useDesign } from '@/hooks/use-design';

export default {
    name: 'PropertyStyle',
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const { currentComponentList } = useDesign();

        const componentList = computed(() => {
            return currentComponentList.value;
        });

        function onAddFilter() {
            props.componentCfg.__style__.colorCfg.push({
                key: `${+new Date()}`,
                fieldName: undefined,
                value: undefined,
                color: undefined
            })
        }

        function onRemoveItem(index) {
            index >= 0 && props.componentCfg.__style__.colorCfg.splice(index, 1);
        }

        return {
            componentList,
            onAddFilter,
            onRemoveItem
        };
    },
};
</script>
<style lang="scss" scoped>
.filter-item {
    display: grid;
    grid-template-columns: 1fr 0.4fr 10px;
    gap: 5px;
    margin-bottom: 5px;
    align-items: center;
}
</style>
  
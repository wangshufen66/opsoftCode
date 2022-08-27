<template>
    <div class="report-search-wrap" v-if="panelConf.searchConfig.length > 0">
        <template v-for="item in panelConf.searchConfig" :key="item.key">
            <div class="report-search-item">
                <div class="title">{{ item.fieldDes }}</div>
                <div class="component">
                    <!-- 文本 -->
                    <template v-if="item.fieldType === 1">
                        <el-input
                            v-model="formData[item.field]"
                            :placeholder="`请输入${item.fieldDes}`"
                            clearable
                        ></el-input>
                    </template>
                    <!-- 日期 -->
                    <template v-else-if="item.fieldType === 3">
                        <el-date-picker
                            v-model="formData[item.field]"
                            :type="item.filterType === 2 ? 'daterange' : 'date'"
                            :placeholder="`请选择${item.fieldDes}`"
                        ></el-date-picker>
                    </template>
                    <!-- 日期时间 -->
                    <template v-else-if="item.fieldType === 4">
                        <el-date-picker
                            v-model="formData[item.field]"
                            :type="item.filterType === 2 ? 'datetimerange' : 'datetime'"
                            :placeholder="`请选择${item.fieldDes}`"
                        ></el-date-picker>
                    </template>
                    <!-- 时间 -->
                    <template v-else-if="item.fieldType === 5">
                        <el-time-picker
                            v-model="formData[item.field]"
                            :placeholder="`请选择${item.fieldDes}`"
                            :is-range="item.filterType === 2"
                        ></el-time-picker>
                    </template>
                </div>
            </div>
        </template>
        <div class="search-btn">
            <el-button>查询</el-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesignChart } from '@/hooks/use-designChart';

export default defineComponent({
    setup(props) {

        const { panelConf } = useDesignChart();

        const formData = ref<any>({})

        return {
            panelConf,
            formData
        }
    }
})
</script>

<style lang="scss" scoped>
.report-search-wrap {
    display: flex;
    justify-content: flex-end;
    .report-search-item {
        display: flex;
        align-items: center;
        margin-right: 15px;
    }
    .title {
        width: 90px;
        text-align: right;
        padding-right: 10px;
    }
    .search-btn{
        line-height: 52px;
        padding-right: 10px;
    }
}
</style>
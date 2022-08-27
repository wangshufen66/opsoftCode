<template>
    <el-form size="small" label-width="90px">
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
        <div class="divider-wrap">网格属性</div>
        <el-row>
            <el-col :span="12">
                <el-form-item label="行数">
                    <el-input v-model.number="activeChart.rows" />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="跨列">
                    <el-input v-model.number="activeChart.columns" />
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="间隔">
                    <el-input v-model.number="activeChart.gap" placeholder="请输入间隔">
                        <template #append>px</template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useDesignChart, useActiveDesignChart } from '@/use/useDesignChart';

export default defineComponent({
    name: 'component',
    setup(props) {
        const { currentChartList } = useDesignChart();
        const { activeChart } = useActiveDesignChart(currentChartList);

        return { activeChart }
    }
})
</script>
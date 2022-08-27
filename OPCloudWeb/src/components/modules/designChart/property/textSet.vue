<template>
    <el-form size="small" label-width="80px">
        <el-form-item label="字体大小">
            <el-input v-model.number="activeChart.fontSize" placeholder="请设置圆角">
                <template #append>px</template>
            </el-input>
        </el-form-item>
        <el-form-item label="字体粗细">
            <el-select v-model="activeChart['font-weight']" placeholder="请选择">
                <el-option :value="400" label="400"></el-option>
                <el-option :value="500" label="500"></el-option>
                <el-option :value="600" label="600"></el-option>
            </el-select>
        </el-form-item>
        <el-row>
            <el-col :span="12">
                <el-form-item label="背景色">
                    <el-color-picker v-model="activeChart.backgroundColor" show-alpha></el-color-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="字体颜色">
                    <el-color-picker v-model="activeChart.color" show-alpha></el-color-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="数据类型">
            <el-select v-model="activeChart.dataType" placeholder="请选择图片呈现方式">
                <el-option value="static" label="静态"></el-option>
                <el-option value="model" label="卡片模型"></el-option>
            </el-select>
        </el-form-item>
        <!-- 静态路径 -->
        <template v-if="activeChart.dataType === 'static'">
            <el-form-item label="内容">
                <el-input v-model="activeChart.fieldValue" clearable placeholder="请设置显示的内容"></el-input>
            </el-form-item>
        </template>
        <!-- 数据模型 -->
        <template v-else>
            <el-form-item label="内容模型">
                <el-select v-model="activeChart.dataField" placeholder="请选择内容数据模型">
                    <el-option
                        v-for="field in activeChart.dataModel"
                        :key="field"
                        :value="field"
                        :label="field"
                    ></el-option>
                </el-select>
            </el-form-item>
        </template>
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
        <div class="divider-wrap">对齐方式</div>
        <el-row>
            <el-col :span="12">
                <el-form-item label="水平">
                    <el-select v-model="activeChart.horizontal" placeholder="水平排列方式">
                        <el-option value="flex-start" label="左边"></el-option>
                        <el-option value="center" label="居中"></el-option>
                        <el-option value="flex-end" label="右边"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="垂直">
                    <el-select v-model="activeChart.vertical" placeholder="水平排列方式">
                        <el-option value="flex-start" label="顶部"></el-option>
                        <el-option value="center" label="居中"></el-option>
                        <el-option value="flex-end" label="底部"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <div class="divider-wrap">格式化设置</div>
        <el-form-item label="转换类型">
            <el-select v-model="activeChart.format" clearable placeholder="请选择格式类型">
                <el-option value="bl" label="百分比"></el-option>
                <el-option value="thousands" label="千分位"></el-option>
                <el-option value="date" label="日期时间"></el-option>
            </el-select>
        </el-form-item>
        <template v-if="activeChart.format === 'date'">
            <el-form-item label="时间格式">
                <el-select v-model="activeChart.dateFormat" placeholder="请选择时间格式">
                    <el-option value="YYYY" label="YYYY"></el-option>
                    <el-option value="YYYY-MM" label="YYYY-MM"></el-option>
                    <el-option value="YYYY-MM-DD" label="YYYY-MM-DD"></el-option>
                    <el-option value="YYYY-MM-DD HH:mm:ss" label="YYYY-MM-DD HH:mm:ss"></el-option>
                    <el-option value="HH:mm" label="HH:mm"></el-option>
                    <el-option value="HH:mm:ss" label="HH:mm:ss"></el-option>
                </el-select>
            </el-form-item>
        </template>
        <el-form-item label="表达式">
            <el-input v-model.number="activeChart.express" placeholder="请设置表达式" clearable></el-input>
        </el-form-item>
    </el-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesignChart, useActiveDesignChart } from '@/use/useDesignChart';
import { messageAlert } from '@/utils/utils';

export default defineComponent({
    name: 'component',
    setup(props) {

        const { currentChartList } = useDesignChart();
        const { activeChart } = useActiveDesignChart(currentChartList);

        const uploadLoading = ref<boolean>(false)

        function beforeAvatarUpload(file) {
            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            const isLtMax = file.size / 1024 / 1024 < 500;

            if (!isJPG) {
                messageAlert('error', '上传图片只能是 JPG、jpeg、png 格式!')
            }
            if (!isLtMax) {
                messageAlert('error', '上传图片大小不能超过500kb!')
            }
            return isJPG && isLtMax;
        }

        function handleAvatarSuccess(response) {
            uploadLoading.value = false
            if (!response.data) {
                return;
            }
            const { filePath } = response.data;
            filePath && (activeChart.path = filePath)
        }

        function onProgress() {
            uploadLoading.value = true
        }

        function onError() {
            uploadLoading.value = false
        }

        return {
            activeChart,
            uploadLoading,
            beforeAvatarUpload,
            handleAvatarSuccess,
            onProgress,
            onError
        }
    }
})
</script>
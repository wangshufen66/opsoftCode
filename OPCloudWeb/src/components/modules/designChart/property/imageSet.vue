<template>
    <el-form size="small" label-width="90px">
        <el-form-item label="呈现方式">
            <el-select v-model="activeChart.fillType" placeholder="请选择图片呈现方式">
                <el-option value="fill" label="填充"></el-option>
                <el-option value="contain" label="等比缩放"></el-option>
                <el-option value="cover" label="等比剪切"></el-option>
                <el-option value="none" label="默认"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="圆角">
            <el-input v-model.number="activeChart.borderRadius" placeholder="请设置圆角">
                <template #append>px</template>
            </el-input>
        </el-form-item>
        <el-form-item label="数据类型">
            <el-select v-model="activeChart.dataType" placeholder="请选择图片呈现方式">
                <el-option value="path" label="静态"></el-option>
                <el-option value="model" label="卡片模型"></el-option>
            </el-select>
        </el-form-item>
        <!-- 静态路径 -->
        <template v-if="activeChart.dataType === 'path'">
            <el-form-item label="图片设置">
                <el-upload
                    action="/api/opcloud/file/upload"
                    :headers="uploadHeader"
                    :multiple="false"
                    :show-file-list="false"
                    :limit="1"
                    :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess"
                    :on-progress="onProgress"
                    :on-error="onError"
                >
                    <el-button size="small" type="primary" :loading="uploadLoading">点击上传</el-button>
                </el-upload>
            </el-form-item>
        </template>
        <!-- 数据模型 -->
        <template v-else>
            <el-form-item label="图片模型">
                <el-select v-model="activeChart.dataField" placeholder="请选择图片数据模型">
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
    </el-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useDesignChart, useActiveDesignChart } from '@/use/useDesignChart';
import { getToken, messageAlert } from '@/utils/utils';

export default defineComponent({
    name: 'component',
    setup(props) {

        const { currentChartList } = useDesignChart();
        const { activeChart } = useActiveDesignChart(currentChartList);

        const uploadLoading = ref<boolean>(false);
        const uploadHeader = ref<any>({})

        function beforeAvatarUpload(file) {
            const isJPG = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type);
            const isLtMax = file.size / 1024 / 1024 < 500;

            if (!isJPG) {
                messageAlert('error', '上传图片只能是 JPG、jpeg、png 格式!')
            }
            if (!isLtMax) {
                messageAlert('error', '上传图片大小不能超过500kb!')
            }
            let token = getToken("accessToken");
            uploadHeader.value.Authorization = `Bearer ${token}`;
            return isJPG && isLtMax;
        }

        function handleAvatarSuccess(response) {
            uploadLoading.value = false
            if (!response.data) {
                return;
            }
            const { filePath } = response.data;
            filePath && (activeChart.value.path = filePath)
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
            uploadHeader,
            beforeAvatarUpload,
            handleAvatarSuccess,
            onProgress,
            onError
        }
    }
})
</script>
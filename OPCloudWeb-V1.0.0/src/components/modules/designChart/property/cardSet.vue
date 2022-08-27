<template>
    <el-form size="small" label-width="90px">
        <el-row>
            <el-col :span="12">
                <el-form-item label="背景色">
                    <el-color-picker v-model="activeChart.backgroundColor" show-alpha></el-color-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="图片设置">
                    <el-upload
                        action="/api/opcloud/file/upload"
                        :headers="uploadHeader"
                        :multiple="false"
                        :show-file-list="false"
                        :before-upload="beforeAvatarUpload"
                        :on-success="handleAvatarSuccess"
                        :on-progress="onProgress"
                        :on-error="onError"
                    >
                        <el-button icon="el-icon-upload2" size="mini"></el-button>
                    </el-upload>
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
        <!-- 数据源 -->
        <div class="divider-wrap">数据源</div>
        <el-form-item label="类型">
            <el-select v-model="activeChart.__config__.dataType" placeholder="请选择轴类型">
                <el-option value="sql" label="SQL语句"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SQL" v-show="activeChart.__config__.dataType === 'sql'">
            <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入SQL查询语句"
                v-model="activeChart.__config__.dataSql"
            ></el-input>
            <el-button type="primary" size="mini" @click="getChartData">获取数据结构</el-button>
        </el-form-item>
        <rel-component-setting></rel-component-setting>
    </el-form>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import { useDesignChart, useActiveDesignChart } from '@/use/useDesignChart';
import { getToken, messageAlert } from '@/utils/utils';
import { getDataBySql } from '@/api/homeApi';
import relComponentSetting from './relComponentSet.vue'

export default defineComponent({
    components: { relComponentSetting },
    setup(props) {
        const { currentChartList } = useDesignChart();
        const { activeChart } = useActiveDesignChart(currentChartList);

        const uploadLoading = ref<boolean>(false);
        const uploadHeader = ref<any>({});

        const relComponentList = computed(() => {
            return currentChartList.value.filter(f => f.chartId !== activeChart.value.chartId)
        })

        // 获取图表数据源
        async function getChartData() {
            const { __config__ } = activeChart.value;
            if (!__config__.dataSql.trim()) {
                messageAlert('error', 'SQL不能为空!')
                return;
            }
            // const reg = /insert|drop|grant|alter|delete|update|chr|mid|master|truncate|char|declare/i.test(
            //     __config__.dataSql
            // );
            // if (reg) {
            //     messageAlert('error', '非法语句,请重新填写!')
            //     return;
            // }
            let para = {
                sql: __config__.dataSql
            };
            const res = await getDataBySql(para);
            if (res.code === 200 && res.data.length) {
                activeChart.value.dataSource = res.data;
                messageAlert('success', '获取成功')
            } else {
                messageAlert('error', '获取失败')
            }
        }

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
            filePath && (activeChart.value.backgroundImage = filePath)
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
            relComponentList,
            getChartData,
            beforeAvatarUpload,
            handleAvatarSuccess,
            onProgress,
            onError
        }
    }
})
</script>
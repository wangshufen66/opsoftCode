<template>
    <div class="divider-wrap">详情设置</div>
    <el-form-item label="显示">
        <el-switch v-model="activeChart.__config__.isDetail" />
    </el-form-item>
    <el-form-item label="详情页面">
        <el-cascader
            class="custom-cascader"
            v-model="activeChart.__config__.detailParams"
            :props="cascaderProps"
            separator="-"
        ></el-cascader>
    </el-form-item>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useActiveDesignChart } from '@/hooks/use-designChart';
import { getAppList, getModelByApp, getPageByModel } from '@/api/userApi';

export default defineComponent({
    setup() {
        const { activeChart } = useActiveDesignChart();


        const cascaderProps = reactive({
            lazy: true,
            lazyLoad: cascaderLazyLoad
        })

        /**
         * 获取字段属性配置
         */
        async function cascaderLazyLoad(node, resolve) {
            const { level, value } = node;
            if (level === 0) {
                const res = await getAppList()
                if (res.code == 200) {
                    const nodes = res.data.map((m) => {
                        return {
                            label: m.appName,
                            value: m.id,
                            leaf: level >= 2,
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
                            leaf: level >= 2,
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
                            value: m.id,
                            leaf: level >= 2,
                        };
                    });
                    resolve(nodes);
                }
            }
        }

        return {
            activeChart,
            cascaderProps,
        }
    }
})
</script>
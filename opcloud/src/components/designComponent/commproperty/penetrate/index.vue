<!-- 数据穿透设置 -->
<template>
    <template v-if="componentCfg.__config__.penetrate">
        <div class="divider-wrap">数据穿透</div>
        <el-form-item label="页面选择">
            <el-cascader
                class="custom-cascader"
                v-model="componentCfg.__config__.penetrate.page"
                :props="cascaderProps"
                separator="-"
                @change="onPageSelectChange"
            ></el-cascader>
        </el-form-item>
        <el-form-item label="显示类型">
            <el-select v-model="componentCfg.__config__.penetrate.type">
                <el-option :value="PenetratePageType.PAGE" label="列表"></el-option>
                <el-option :value="PenetratePageType.FORM" label="表单"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="携带ID">
            <el-switch v-model="componentCfg.__config__.penetrate.portId" />
        </el-form-item>
        <template v-if="componentCfg.__config__.penetrate.portId">
            <el-form-item label="ID关联字段">
                <el-select
                    v-model="componentCfg.__config__.penetrate.relIdField"
                    filterable
                    clearable
                >
                    <el-option
                        :value="item.fieldName"
                        :label="item.fieldRemark"
                        :key="item.fieldName"
                        v-for="item in pageFieldList"
                    ></el-option>
                </el-select>
            </el-form-item>
        </template>
        <div
            class="setting-item"
            v-for="(item, index) in componentCfg.__config__.penetrate.relCfg"
            :key="item.id"
        >
            <span class="close-btn" @click="onDeleteItem(index)">
                <i class="el-icon-remove-outline" />
            </span>
            <el-form-item label="关联表字段">
                <el-select v-model="item.relField" placeholder="设置表单字段对应关联表字段" filterable clearable>
                    <el-option
                        :value="field.fieldName"
                        :label="field.fieldRemark"
                        :key="field.fieldName"
                        v-for="field in pageFieldList"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="字段值">
                <el-select v-model="item.valueField" placeholder="默认当前组件值" filterable clearable>
                    <el-option
                        v-for="component in componentList"
                        :key="component.componentId"
                        :value="component.componentId"
                        :label="component.__form__.label"
                    ></el-option>
                </el-select>
            </el-form-item>
        </div>
        <div class="property-additem">
            <el-button
                class="btn-operate"
                icon="el-icon-circle-plus-outline"
                type="text"
                @click="onAddItem"
            >添加关联字段</el-button>
        </div>
    </template>
</template>

<script lang="ts">
import { defineComponent, reactive, watchEffect, watch, ref, computed } from 'vue';
import { useDesign } from '@/hooks/use-design';
import { PenetratePageType } from './../../enum';
import { getModelByApp, getPageByModel, getFieldByPage } from '@/api/userApi';

/**表字段 */
type PageField = {
    fieldName: string;
    fieldRemark: string;
}

export default defineComponent({
    name: 'PropertyPenetrate',
    props: {
        componentCfg: Object,
    },
    setup(props) {

        const { appList, currentComponentList } = useDesign()

        const cascaderProps = reactive({
            lazy: true,
            lazyLoad: (node, resolve) => { }
        })

        const pageFieldList = ref<PageField[]>([])

        const componentList = computed(() => {
            return currentComponentList.value.filter(f => f.componentId !== props.componentCfg.componentId)
        })

        watchEffect(() => {
            if (appList.value && appList.value.length > 0) {
                cascaderProps.lazyLoad = cascaderLazyLoad
            }
        })

        watch(() => props.componentCfg.componentId, () => {
            const penetrate = props.componentCfg.__config__.penetrate;
            penetrate && penetrate.page && onPageSelectChange(penetrate.page)
        })

        /**
         * 获取字段属性配置
         */
        async function cascaderLazyLoad(node, resolve) {
            const { level, value } = node;
            if (level === 0) {
                const nodes = appList.value && appList.value.map((m) => {
                    return {
                        label: m.appName,
                        value: m.id,
                        leaf: level >= 2,
                    };
                });
                resolve(nodes);
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

        function onPageSelectChange(e) {
            const pageId = e && e[2];
            pageId && getFieldByPage({ pageId }).then(res => {
                pageFieldList.value = [];
                if (res.code == 200) {
                    pageFieldList.value = res.data && res.data.map(m => {
                        return {
                            fieldName: m.fieldName,
                            fieldRemark: m.fieldRemark
                        }
                    })
                }
            })
        }

        function onDeleteItem(index: string | number | symbol) {
            const component = props.componentCfg;
            if (component) {
                component.__config__.penetrate.relCfg.splice(index, 1);
            }
        }

        function onAddItem() {
            const component = props.componentCfg;
            component?.__config__ &&
                component.__config__.penetrate.relCfg &&
                component.__config__.penetrate.relCfg.push({
                    id: `${+new Date()}`,
                    relField: undefined,
                    valueField: undefined,
                });
        }

        return {
            PenetratePageType,
            cascaderProps,
            pageFieldList,
            componentList,
            onPageSelectChange,
            onDeleteItem,
            onAddItem
        }
    }
})
</script>
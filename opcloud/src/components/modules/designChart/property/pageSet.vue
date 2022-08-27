<template>
    <!-- 页面整体布局表单属性 -->
    <el-form size="small" label-width="90px">
        <div class="divider-wrap">网格属性</div>
        <div class="form-items-wrap">
            <el-col :span="12">
                <el-form-item label="行数">
                    <el-input
                        v-model.number="panelConf.rows"
                        clearable
                        placeholder="请输入行数"
                        @blur="panelConfChange"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="列数">
                    <el-input
                        v-model.number="panelConf.columns"
                        clearable
                        placeholder="请输入列数"
                        @blur="panelConfChange"
                    />
                </el-form-item>
            </el-col>
        </div>
        <el-form-item label="间隔">
            <el-input v-model.number="panelConf.gap" clearable placeholder="请输入间隔">
                <template #append>px</template>
            </el-input>
        </el-form-item>
        <div class="divider-wrap">全局搜索配置</div>
        <draggable
            :list="panelConf.searchConfig"
            item-key="key"
            group="search-item-group"
            :sort="true"
            :animation="400"
        >
            <template #item="{ element, index }">
                <div class="search-item">
                    <span class="close-btn" @click="panelConf.searchConfig?.splice(index, 1)">
                        <i class="el-icon-remove-outline" />
                    </span>
                    <el-form-item label="搜索类型">
                        <el-select v-model="element.fieldType" placeholder="请选择搜索组件类型">
                            <el-option :value="1" label="文本"></el-option>
                            <!-- <el-option :value="2" label="下拉选择"></el-option> -->
                            <el-option :value="3" label="日期"></el-option>
                            <el-option :value="4" label="日期时间"></el-option>
                            <el-option :value="5" label="时间"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="组件文本">
                        <el-input v-model="element.fieldDes" placeholder="请设置搜索组件文本" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="绑定字段">
                        <el-cascader
                            v-model="element.fieldList"
                            :ref="`cascaderRef${index}`"
                            :props="getFieldProps(element)"
                            @change="handleChange(index, element, $event)"
                            separator="-"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="查询类型">
                        <el-select v-model="element.filterType" placeholder="请选择查询类型">
                            <el-option :value="1" label="等于"></el-option>
                            <el-option :value="2" label="范围"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
            </template>
        </draggable>

        <div style="margin-left: 20px">
            <el-button icon="el-icon-circle-plus-outline" type="text" @click="addSearchConfig">添加设置</el-button>
        </div>
    </el-form>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import draggable from 'vuedraggable';
import { getAppList, getFieldByPage, getModelByApp, getPageByModel } from '@/api/userApi';
import { useDesignChart } from '@/hooks/use-designChart';

export default defineComponent({
    components: { draggable },
    setup() {
        const { panelConf, renderAllCharts } = useDesignChart();

        const current = getCurrentInstance()

        function panelConfChange() {
            renderAllCharts();
        }

        function addSearchConfig() {
            panelConf.value.searchConfig &&
                panelConf.value.searchConfig.push({
                    key: `${+new Date()}`,
                    fieldText: '',
                    fieldList: [],
                    field: undefined,
                    fieldDes: undefined,
                    fieldType: undefined,
                    filterType: undefined
                })
        }

        /**
         * 获取字段属性配置
         */
        function getFieldProps(item) {
            const props = {
                lazy: true,
                key: item.id,
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
            };
            return props;
        }

        function handleChange(index: number, item: any, e: any) {
            const refs = current?.refs
            if (refs && refs[`cascaderRef${index}`]) {
                item.fieldText = refs[`cascaderRef${index}`].inputValue;
                item.field = `${e[2]}#${e[3]}`;
            }
        }

        return {
            panelConf,
            panelConfChange,
            addSearchConfig,
            getFieldProps,
            handleChange,
        }
    }
})
</script>
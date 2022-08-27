<template>
    <div class="search-form-wrap">
        <el-form
            class="search-form"
            :model="formData"
            :inline="formConf?.inline"
            size="mini"
            :label-width="`${formConf?.labelWidth}px`"
        >
            <template v-for="component in componentList" :key="component.componentId">
                <el-col :span="component?.__form__?.span">
                    <el-form-item
                        :label="(component?.__form__?.showLabel && component?.__form__?.label) || ''"
                        :prop="component.__vModel__"
                        :required="component?.__form__?.required"
                        :label-width="getLabelWidth(component)"
                    >
                        <component
                            :is="component.componentTag"
                            :model="formData"
                            :component="component"
                        ></component>
                    </el-form-item>
                </el-col>
            </template>
        </el-form>
        <!-- <div class="more-item" v-if="componentList.length > 4">
            <div class="more">
                <i class="el-icon-d-arrow-right"></i>更多
            </div>
        </div> -->
    </div>
</template>
  
<script lang="ts" setup>
import { ref, computed, getCurrentInstance, provide } from 'vue';
import type { PropType } from 'vue';
import type { ModuleFormProvide } from '@/use/useForm';
import type { DesignComponent } from '../designComponent';

const props = defineProps({
    formConf: Object,
    componentList: {
        type: Array as PropType<DesignComponent[]>,
        default: [],
    },
    formData: Object,
})

provide<ModuleFormProvide>('moduleForm', {
    formComponents: props.componentList,
});

const currentInstance = getCurrentInstance();

const emitter =
    currentInstance?.appContext.config.globalProperties.$emitter;

/**
 * 初始化搜索表单结构
 */
function initFormData() {
    // 如果未传递数据，则解析组件，生成Model结构
    if (props.formData) {
        props.componentList.map((component) => {
            const __vModel__ = component.__vModel__;
            if (__vModel__ && !(__vModel__ in props.formData)) {
                props.formData[__vModel__] = null;
            }
        });
    }
}


function getLabelWidth(component) {
    const width = component?.__form__?.labelWidth;
    if (width === 0 || !!width) {
        return `${width}px`;
    } else {
        return `${props.formConf?.labelWidth || 120}px`;
    }
}

initFormData();

</script>
  
<style lang="scss" scoped>
.search-form-wrap {
    transition: all ease-in-out 0.35s;
}
.search-form {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
}
.more-item {
    display: flex;
    color: $color-primary;
    align-items: center;
    justify-content: center;
    height: 1px;
    background: $color-primary;
    .more {
        background-color: #fff;
        padding: 0 12px;
    }
    i {
        margin-right: 5px;
        transform-origin: center;
        transform: rotate(-90deg);
    }
}
</style>
  
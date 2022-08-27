<template>
    <div class="process-flow">
        <div
            :id="flowId"
            :class="{ 'flow-empty': !(component?.nodeList && component?.nodeList.length > 0) }"
            :style="{ 'height': `${component?.__config__.height || 250}px` }"
        >
            <span v-if="!(component?.nodeList && component?.nodeList.length > 0)">当前订单未设置工序</span>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, PropType, defineComponent } from 'vue';
import { ProcessFlowComponent } from './IConfig';

export default defineComponent({
    name: 'designProcessFlow',
    props: {
        component: Object as PropType<ProcessFlowComponent>,
    },
    setup(props) {
        const flowId = ref<string>('');

        if (!props.component?.__config__.target) {
            props.component.__config__.target = `process-flow${+new Date()}`
            flowId.value = props.component?.__config__.target;
        } else {
            flowId.value = props.component?.__config__.target;
        }

        return {
            flowId
        }
    }
})
</script>

<style lang="scss" scoped>
.process-flow {
    overflow: hidden;
    background-color: #f7f7f7;
}
.flow-empty {
    background-color: #bbb;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
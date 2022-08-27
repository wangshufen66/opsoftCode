<template>
    <!-- 状态 -->
    <text-button v-if="row?.status === 0" type="error">待审核</text-button>
    <text-button v-if="row?.status === 1" type="success">已审核</text-button>
    <text-button v-if="row?.status === 2" type="error">等待</text-button>
    <text-button v-if="row?.status === 3" type="error">已退回</text-button>
    <text-button v-if="row?.status === 4" type="error">已退回</text-button>
    <text-button v-if="row?.executable === true" type="error" @click="onStart(row)">已退回</text-button>
    <text-button
        v-if="row?.startable === true"
        type="error"
        @click="onStart(row, startFlowLabel)"
    >{{ startFlowLabel }}</text-button>
    <text-button v-if="row?.executable === true" @click="onStart(row)">审核</text-button>
    <text-button
        v-if="row?.startable === false && row.status !== 4"
        type="error"
        @click="onDetail('detail', row)"
    >详情</text-button>
    <template v-for="(item, index) in buttonList">
        <text-button
            v-bind="item"
            v-if="isShow(row, item, index)"
            :key="index"
            @click="excuteBtnWorkOrder(item, row)"
        >{{ item.title }}</text-button>
    </template>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';

const props = defineProps({
    row: Object,
    formConf: Object,
    startFlowLabel: String
})

const emit = defineEmits(['onStart', 'onFlowDetail', 'onExcuteBtnWorkOrder'])

const buttonList = computed<any[]>(() => {
    return props.formConf && props.formConf.buttonList || []
})

function onStart(row: any, label?: string) {
    emit('onStart', row, label)
}

function isShow(formData, item, index) {
    if (item.eventCode == "IMPORT_WORK") {
        return true;
    }
    if (!formData.hasOwnProperty("workOrderStatus")) {
        return formData.buttonList ? formData.buttonList[index].show : false;
    }
    if (item.eventCode == "OTHER_WORK") {
        return formData.buttonList ? formData.buttonList[index].show : false;
    }
    if (formData.workOrderStatus == null) {
        return false;
    }
    if (item.eventCode == "START_WORK") {
        if (formData.workOrderStatus == "0") {
            return true;
        } else {
            return false;
        }
    }
    if (item.eventCode == "FINISH_WORK") {
        if (formData.workOrderStatus == "1") {
            return true;
        } else {
            return false;
        }
    }
    if (item.eventCode == "REPORT_WORK") {
        if (formData.workOrderStatus == "1") {
            return true;
        } else {
            return false;
        }
    }
}

function onDetail(type: string, row: any) {
    emit('onFlowDetail', type, row)
}



async function excuteBtnWorkOrder(item: any, data: any) {
    emit('onExcuteBtnWorkOrder', item, data)
}

</script>
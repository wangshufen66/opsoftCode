<template>
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="设备" name="device">
            <device-list @row-click="onConfirm_01" />
        </el-tab-pane>
        <el-tab-pane label="用户" name="employee">
            <employee-list @row-click="onConfirm_02" />
        </el-tab-pane>
    </el-tabs>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, getCurrentInstance } from "vue";
import BuzApi from "@/api/controller/employeeApi";
import CommonApi from "@/api/controller/commonApi";
import useHook from "@/views/v3/out/useHook";
import { messageAlert, confirmBox } from "@/utils/utils";

import deviceList from './deviceList.vue'
import employeeList from './employeeList.vue'

const emit = defineEmits(['row-click'])

const props = defineProps(['param'])

const onConfirm_01 = (rows) => {
    rows[0]._unitType = 'device'
    rowClick({ ...rows[0] })
}

const onConfirm_02 = (rows) => {
    rows[0]._unitType = 'employee'
    rowClick({ ...rows[0] })
}

let selectRows = reactive([]);
const rowClick = (row) => {
    selectRows = [row]
    emit('row-click', [row])
};

//对外暴露方法
const getResult = () => {
    console.log(selectRows)
    return {
        rows: selectRows,
    }
};

const activeName = ref('device')
const handleClick = (tab, event) => {
    console.log(tab, event)
}


defineExpose({
    getResult
})

</script>
<style lang="scss" scoped>
@import "@/styles/modules/page_list_new.scss";
</style>
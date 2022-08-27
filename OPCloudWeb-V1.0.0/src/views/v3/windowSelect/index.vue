<template>
    <h1>树形</h1>
    <div class="btn-wrap">
        <el-button @click.stop="dialog.show">部门树开窗</el-button>
        <el-button @click.stop="groupListDialog.show">班组开窗</el-button>
        <el-button @click.stop="deviceListDialog.show">设备类别</el-button>
        <el-button @click.stop="materialListDialog.show">物料</el-button>
        <el-button @click.stop="materialGroupListDialog.show">物料分组</el-button>
        <el-button @click.stop="badreasonListDialog.show">不良原因</el-button>
    </div>

    <h1>普通开窗</h1>
    <div class="btn-wrap">
        <el-button @click.stop="classListDialog.show">班次开窗</el-button>
        <el-button @click.stop="empolyeeListDialog.show">人员</el-button>
        <el-button @click.stop="customerListDialog.show">客户</el-button>
        <el-button @click.stop="materialCategoryListDialog.show">物料类别</el-button>
        <el-button @click.stop="prdprocessListDialog.show">工序任务下的工序开窗</el-button>
        <el-button @click.stop="processListDialog.show">工序</el-button>
        <el-button @click.stop="artRouteListDialog.show">工艺路线</el-button>
        <el-button @click.stop="factorymodelListDialog.show">加工单元</el-button>
        <el-button @click.stop="startrecordListDialog.show">汇报记录-开工单</el-button>
        <el-button @click.stop="badreasonListDialog.show">不良原因</el-button>
    </div>

    <el-dialog
        v-model="classListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <class-list style="height:600px" @row-click="classListDialog.onConfirm"></class-list>
    </el-dialog>
    <el-dialog
        v-model="groupListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <group-list style="height:600px" @row-click="groupListDialog.onConfirm"></group-list>
    </el-dialog>
    <el-dialog
        v-model="empolyeeListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <empolyee-list style="height:600px" @row-click="empolyeeListDialog.onConfirm"></empolyee-list>
    </el-dialog>
    <el-dialog
        v-model="customerListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <customer-list style="height:600px" @row-click="customerListDialog.onConfirm"></customer-list>
    </el-dialog>
    <el-dialog
        v-model="departmentListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <department-list style="height:600px" @row-click="departmentListDialog.onConfirm"></department-list>
    </el-dialog>
    <el-dialog
        v-model="deviceListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <device-list style="height:600px" @row-click="deviceListDialog.onConfirm"></device-list>
    </el-dialog>
    <el-dialog
        v-model="materialListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <material-select style="height:600px" @row-click="materialListDialog.onConfirm"></material-select>
    </el-dialog>

    <el-dialog
        v-model="materialGroupListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <material-group-select @row-click="materialGroupListDialog.onConfirm" style="height:600px"></material-group-select>
    </el-dialog>

    <el-dialog
        v-model="materialCategoryListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <materialCategory-list
            @row-click="materialCategoryListDialog.onConfirm"
            style="height:600px"
        ></materialCategory-list>
    </el-dialog>
    <el-dialog
        v-model="artRouteListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <artRoute-list @row-click="artRouteListDialog.onConfirm" style="height:600px"></artRoute-list>
    </el-dialog>
    <el-dialog
        v-model="processListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <process-list @row-click="processListDialog.onConfirm" style="height:600px"></process-list>
    </el-dialog>
    <el-dialog
        v-model="prdprocessListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <prdProcess-list @row-click="prdprocessListDialog.onConfirm" style="height:600px"></prdProcess-list>
    </el-dialog>
    <el-dialog
        v-model="factorymodelListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <facotrymodel-select @row-click="factorymodelListDialog.onConfirm" style="height:600px"></facotrymodel-select>
    </el-dialog>
    <el-dialog
        v-model="startrecordListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <startrecord-list @row-click="startrecordListDialog.onConfirm" style="height:600px"></startrecord-list>
    </el-dialog>
    <el-dialog
        v-model="badreasonListDialog.reactiveData.visible"
        :destroy-on-close="true"
        width="1200px"
    >
        <badreason-select @row-click="badreasonListDialog.onConfirm" style="height:600px"></badreason-select>
    </el-dialog>

    <el-dialog v-model="dialog.reactiveData.visible" :destroy-on-close="true" width="1200px">
        <dept-select @row-click="dialog.onConfirm" style="height:600px" />
    </el-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";

import useDialog from "@/views/v3/out/useDialog";
import classList from "./classList.vue"
import groupList from "./groupList.vue"
import customerList from "./customerList.vue"
import materialCategoryList from "./materialCategoryList.vue"
import materialSelect from "./materialSelect/index.vue"
import materialGroupSelect from "./materialGroupSelect/index.vue"
import prdProcessList from "./prdProcessList.vue"
import processList from "./processList.vue"
import empolyeeList from "./employeeList.vue"
import artRouteList from "./artRouteList.vue"
import departmentList from "./departmentList.vue"
import deviceList from "./deviceList.vue"

import startrecordList from "./startrecordList.vue"

import facotrymodelSelect from "./facotrymodelSelect/index.vue"
import badreasonSelect from "./badreasonSelect/index.vue"

import deptSelect from "./departmentSelect/index.vue"
import { json } from "d3-fetch";


const dialog = useDialog({
    _onConfirm: (_rows) => {
        dialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))
    }
})


const classListDialog = useDialog({
    _onConfirm: (_rows) => {
        classListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const groupListDialog = useDialog({
    _onConfirm: (_rows) => {
        groupListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const empolyeeListDialog = useDialog({
    _onConfirm: (_rows) => {
        empolyeeListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const customerListDialog = useDialog({
    _onConfirm: (_rows) => {
        customerListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const deviceListDialog = useDialog({
    _onConfirm: (_rows) => {
        deviceListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const departmentListDialog = useDialog({
    _onConfirm: (_rows) => {
        departmentListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const materialListDialog = useDialog({
    _onConfirm: (_rows) => {
        materialListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})

const materialGroupListDialog = useDialog({
    _onConfirm: (_rows) => {
        materialGroupListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})

const materialCategoryListDialog = useDialog({
    _onConfirm: (_rows) => {
        materialCategoryListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const processListDialog = useDialog({
    _onConfirm: (_rows) => {
        processListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const artRouteListDialog = useDialog({
    _onConfirm: (_rows) => {
        artRouteListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))
    }
})
const prdprocessListDialog = useDialog({
    _onConfirm: (_rows) => {
        prdprocessListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))
    }
})
const factorymodelListDialog = useDialog({
    _onConfirm: (_rows) => {
        factorymodelListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))
    }
})
const startrecordListDialog = useDialog({
    _onConfirm: (_rows) => {
        startrecordListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
const badreasonListDialog = useDialog({
    _onConfirm: (_rows) => {
        badreasonListDialog.reactiveData.visible = false;
        alert(JSON.stringify(_rows))

    }
})
</script>
<style lang="scss" scoped>
.btn-wrap {
    & > * {
        margin: 10px;
    }
}
</style>
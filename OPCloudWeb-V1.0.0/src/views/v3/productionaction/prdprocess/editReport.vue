<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <rotate-row title="任务信息">
                <el-col :span="8">
                    <el-form-item label="工序识别码" prop="processUniqueNbr">
                        <el-input v-model="pageData.formData.processUniqueNbr" disabled></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="工序名称" prop="processName">
                        <el-input
                            disabled
                            v-model="pageData.formData.processName"
                            @click.stop="openSelectDialogFunc.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品代码" prop="productNbr">
                        <el-input
                            disabled
                            v-model="pageData.formData.productNbr"
                            @click.stop="openSelectDialogFunc.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品名称" prop="productName">
                        <el-input
                            disabled
                            v-model="pageData.formData.productName"
                            @click.stop="openSelectDialogFunc.show"
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="开工单号" prop="startNbr">
                        <el-input
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.startNbr"
                            @click.stop="dialogstartNbr.show"
                        ></el-input>
                    </el-form-item>
                    <div class="fixedDialog">
                        <el-dialog
                            v-model="dialogstartNbr.reactiveData.visible"
                            :destroy-on-close="true"
                            width="1400px"
                        >
                            <template #title>
                                <dialog-title title="开工单号"></dialog-title>
                            </template>
                            <select-list-start-nbr
                                @row-click="dialogstartNbr.onConfirm"
                                ref="dialogstartNbr.innerRef"
                                :param="dialogstartNbr.reactiveData.param"
                                :_getTableList="_getTableList"
                            />
                        </el-dialog>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开工数量" prop="startQty">
                        <el-input
                            disabled
                            v-model="pageData.formData.startQty"
                            @click.stop="openSelectDialogFunc.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="已汇报合格数量" prop="alRdyQualifiedQty">
                        <el-input
                            disabled
                            v-model="pageData.formData.alRdyQualifiedQty"
                            @click.stop="openSelectDialogFunc.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="汇报信息">
                <el-col :span="8">
                    <el-form-item label="加工单元" prop="machiningUnitName">
                        <el-input
                            v-model="pageData.formData.machiningUnitName"
                            @click="dialogFacotry.show"
                            disabled
                        ></el-input>
                        <div class="fixedDialog">
                            <el-dialog
                                v-model="dialogFacotry.reactiveData.visible"
                                :destroy-on-close="true"
                                width="1400px"
                            >
                                <template #title>
                                    <dialog-title title="加工单元"></dialog-title>
                                </template>
                                <select-list-facotry
                                    @row-click="dialogFacotry.onConfirm"
                                    ref="dialogFacotry.innerRef"
                                    :param="dialogFacotry.reactiveData.param"
                                />
                            </el-dialog>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="加工人员" prop="employeeName">
                        <el-input v-model="pageData.formData.employeeName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班组" prop="shiftGroupName">
                        <el-input
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.shiftGroupName"
                            @click="dialogGroup.show"
                        ></el-input>
                        <div class="fixedDialog">
                            <el-dialog
                                v-model="dialogGroup.reactiveData.visible"
                                :destroy-on-close="true"
                                width="1400px"
                            >
                                <template #title>
                                    <dialog-title title="班组"></dialog-title>
                                </template>
                                <select-list-group
                                    @row-click="dialogGroup.onConfirm"
                                    ref="dialogGroup.innerRef"
                                    :param="dialogGroup.reactiveData.param"
                                />
                            </el-dialog>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班次" prop="shiftSliceName">
                        <el-input
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.shiftSliceName"
                            @click="dialogClass.show"
                        ></el-input>
                        <div class="fixedDialog">
                            <el-dialog
                                v-model="dialogClass.reactiveData.visible"
                                :destroy-on-close="true"
                                width="1400px"
                            >
                                <template #title>
                                    <dialog-title title="班次"></dialog-title>
                                </template>
                                <select-list-class
                                    @row-click="dialogClass.onConfirm"
                                    ref="dialogClass.innerRef"
                                    :param="dialogClass.reactiveData.param"
                                />
                            </el-dialog>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报数量" prop="reportQty">
                        <el-input v-model="pageData.formData.reportQty"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合格数量" prop="qualifiedQty">
                        <el-input v-model="pageData.formData.qualifiedQty" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" prop="beginTime">
                        <el-date-picker
                            v-model="pageData.formData.beginTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width: 100%;"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报时间" prop="reportTime">
                        <el-date-picker
                            v-model="pageData.formData.reportTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width: 100%;"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="不良数量" prop="unqualifiedQty">
                        <el-input v-model="pageData.formData.unqualifiedQty" disabled></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="不良原因">
                <el-tabs v-model="tabActiveName">
                    <el-tab-pane label="不良原因" name="badList">
                        <div class="table-tool-wrap">
                            <!-- <el-button @click="refreshCheckUnGoodQty()" type="primary" plain size="small">刷新</el-button> -->
                            <el-button
                                :disabled="showType == 0"
                                @click="subOpenDialogFunc.show(), isAdd = true"
                                type="primary"
                                plain
                                size="small"
                            >添加</el-button>
                        </div>
                        <div style="height: 300px">
                            <table-extend v-bind="tableOption">
                                <template #operatColumn v-if="showType == 1">
                                    <el-table-column label="操作" fixed="right">
                                        <template #default="scope">
                                            <text-button
                                                @click="subOpenDialogFunc.show(scope.row, scope.$index), isAdd = false"
                                            >编辑</text-button>
                                            <text-button @click="delSub(scope)">删除</text-button>
                                        </template>
                                    </el-table-column>
                                </template>
                            </table-extend>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </rotate-row>
        </el-form>

        <div class="fixedDialog">
            <el-dialog v-model="subOpenDialog.visible" :destroy-on-close="true" width="1400px">
                <template #title>
                    <dialog-title :title="`${isAdd ? '添加' : '编辑'}不良原因`"></dialog-title>
                </template>
                <sub-one ref="subOpenRef" :param="subOpenDialog.param" />

                <template #footer>
                    <el-button @click="subOpenDialogFunc.hide()">取消</el-button>
                    <el-button type="primary" @click="subOpenDialogFunc.onConfirm">确定</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import subOne from "./subOne.vue";
import BuzApi from "@/api/controller/prdReportApi";
import prdProcessApi from "@/api/controller/prdProcessApi";
import prdStartApi from "@/api/controller/prdStartApi";
import dayjs from 'dayjs'
import selectList from "./selectList.vue";
import RotateRow from "@/views/v3/components/rotateRow.vue";
import SelectListStartNbr from '@/views/v3/windowSelect/startrecordList.vue'
import SelectListGroup from '@/views/v3/windowSelect/groupList.vue'
import SelectListClass from '@/views/v3/windowSelect/classList.vue'
import SelectListFacotry from '@/views/v3/windowSelect/facotrymodelSelect/index.vue'
import useDialog from "@/views/v3/out/useDialog";
import usePageData from './usePageData'
import useSelectList from "./useSelectList";
import useSubmit from "./useSubmit";
import { getformData } from "@/api/flowable";


const props = defineProps(["param"]);
const _getTableList = prdStartApi.GetPageList
const isAdd = ref(false)

const formRules = reactive({
    machiningUnitName: [{ required: true, message: "该字段必填", trigger: "change" }],
    employeeName: [{ required: true, message: "该字段必填", trigger: "change" }],
    reportQty: [{ required: true, message: "该字段必填", trigger: "change" }],
    reportTime: [{ required: true, message: "该字段必填", trigger: "change" }],
});


const { showType, entity } = props.param
const { tableOption, pageData } = usePageData(props)
const { dialogGroup, dialogClass, dialogFacotry } = useSelectList(pageData)

// const getFormData = async () => {
//     if (props.param.id.length > 0) {
//         var res = await prdProcessApi.GetOne({
//             id: props.param.entity.id,
//         });
//         pageData.formData = res.data
//         pageData.formData.reportQty = ""
//         pageData.formData.qualifiedQty = ''
//         pageData.formData.unqualifiedQty = ''

//     }
// };

// getFormData()


const badReasonQty = computed(() => {
    if (tableOption.tableData.length > 0) {
        return tableOption.tableData.reduce((total, cur) => total + parseInt(cur.badReasonQty), 0)
    }
})

// getFormData()
const openSelectRef = ref(null);
const openSelectDialog = reactive({
    visible: false,
    param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    }
})

/**开工单号 */
const dialogstartNbr = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的
        var rows = []
        if (_rows) {
            rows = _rows
        } else {
            rows = dialogstartNbr.innerRef.value.getResult().rows
        }
        pageData.formData.startNbr = rows[0].startNbr
        pageData.formData.startQty = rows[0].startQty
        pageData.formData.alRdyQualifiedQty = rows[0].qualifiedQty
        pageData.formData.machiningUnitName = rows[0].machiningUnitName
        pageData.formData.machiningUnitId = rows[0].machiningUnitId
        pageData.formData.employeeName = rows[0].employeeName
        pageData.formData.processingEmpId = rows[0].processingEmpId
        pageData.formData.shiftGroupName = rows[0].shiftGroupName
        pageData.formData.shiftGroupId = rows[0].shiftGroupId
        dialogstartNbr.reactiveData.visible = false;
    }
})


const OpenSelectDialogFunc = function (dialog, dialogRef) {
    return {
        show: (row, index = 0) => {
            dialog.visible = true
        },
        hide: () => {
            dialog.visible = false
        },
        onConfirm: () => {
            var { rows, rowIndex } = dialogRef.value.getResult()
            dialog.visible = false;

            pageData.formData.name = rows[0].name + '_开窗回调'


        },
    }
}
const openSelectDialogFunc = OpenSelectDialogFunc(openSelectDialog, openSelectRef)



const subOpenRef = ref(null);
const subOpenDialog = reactive({
    visible: false,
    param: {
        entity: null,
        rowIndex: -1
    }
})
const SubOpenDialogFunc = function (dialog, dialogRef) {
    return {
        show: (row, index = 0) => {
            if (row) {
                dialog.param.entity = { ...row };
            }
            dialog.param.rowIndex = row ? index : -1
            dialog.visible = true
        },
        hide: () => {
            dialog.visible = false
        },
        onConfirm: () => {
            var { row, rowIndex } = dialogRef.value.getResult()
            var _defaultEntity = {
                ...row
            };
            if (rowIndex == -1) {
                tableOption.tableData.push(_defaultEntity)
            } else {
                tableOption.tableData[rowIndex] = _defaultEntity
            }
            dialog.visible = false;

        },
    }
}
const subOpenDialogFunc = SubOpenDialogFunc(subOpenDialog, subOpenRef)


const delSub = (scope) => {
    //先直接加一条数据
    //tableOption.tableData = res.data.receiveBadReasonList;
    var index = scope.$index;
    var arr = [...tableOption.tableData];
    arr.splice(index, 1);
    tableOption.tableData = arr;
};

const tabActiveName = ref("badList");
const { addPageRef, submit } = useSubmit(pageData, BuzApi, tableOption)

defineExpose({
    submit
})

</script>
<style style lang = 'scss' scoped >
@import "@/styles/modules/page_edit_new.scss";
.el-tabs {
    width: 100%;
}
</style>
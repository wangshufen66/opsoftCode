<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <rotate-row title="任务信息">
                <el-col :span="8">
                    <el-form-item label="工序识别码" prop="processUniqueNbr">
                        <!-- <el-input v-model="pageData.formData.processUniqueNbr"></el-input> -->

                        <el-input
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.processUniqueNbr"
                            @click="dialogPrdProcess.show"
                            readonly
                        ></el-input>
                        <div class="fixedDialog">
                            <el-dialog
                                v-model="dialogPrdProcess.reactiveData.visible"
                                :destroy-on-close="true"
                                width="1400px"
                            >
                                <template #title>
                                    <dialog-title title="工序识别码"></dialog-title>
                                </template>
                                <select-list-prd-process
                                    @row-click="dialogPrdProcess.onConfirm"
                                    ref="dialogPrdProcess.innerRef"
                                    :param="dialogPrdProcess.reactiveData.param"
                                />
                            </el-dialog>
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工序名称" prop="processName">
                        <el-input v-model="pageData.formData.processName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品代码" prop="productNbr">
                        <el-input v-model="pageData.formData.productNbr" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品名称" prop="productName">
                        <el-input v-model="pageData.formData.productName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开工单" prop="startNbr">
                        <el-input
                            suffix-icon="el-icon-search"
                            @click.stop="dialogstartNbr.show"
                            v-model="pageData.formData.startNbr"
                        ></el-input>
                        <div class="fixedDialog">
                            <el-dialog
                                v-model="dialogstartNbr.reactiveData.visible"
                                :destroy-on-close="true"
                                width="1400px"
                            >
                                <template #title>
                                    <dialog-title title="开工单"></dialog-title>
                                </template>
                                <select-list-start-nbr
                                    @row-click="dialogstartNbr.onConfirm"
                                    ref="dialogstartNbr.innerRef"
                                    :param="dialogstartNbr.reactiveData.param"
                                    :_getTableList="_getTableList"
                                    :processUniqueNbr="pageData.formData.processUniqueNbr"
                                />
                            </el-dialog>
                        </div>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="汇报信息">
                <el-col :span="8">
                    <el-form-item label="加工单元" prop="machiningUnitName">
                        <el-input
                            @click="dialogFacotry.show"
                            v-model="pageData.formData.machiningUnitName"
                            suffix-icon="el-icon-search"
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
                        <el-input
                            v-model="pageData.formData.employeeName"
                            @click="dialogEmployee.show"
                            suffix-icon="el-icon-search"
                        ></el-input>
                    </el-form-item>
                    <div class="fixedDialog">
                        <el-dialog
                            v-model="dialogEmployee.reactiveData.visible"
                            :destroy-on-close="true"
                            width="1400px"
                        >
                            <template #title>
                                <dialog-title title="加工人员"></dialog-title>
                            </template>
                            <select-list-employee
                                @row-click="dialogEmployee.onConfirm"
                                ref="dialogEmployee.innerRef"
                                :param="dialogEmployee.reactiveData.param"
                            />
                        </el-dialog>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班组" prop="shiftGroupName">
                        <el-input
                            v-model="pageData.formData.shiftGroupName"
                            @click="dialogGroup.show"
                            suffix-icon="el-icon-search"
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
                            v-model="pageData.formData.shiftSliceName"
                            @click="dialogClass.show"
                            suffix-icon="el-icon-search"
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
                            style="width:100%;"
                            v-model="pageData.formData.beginTime"
                            type="datetime"
                            placeholder="选择日期时间"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报时间" prop="reportTime">
                        <el-date-picker
                            style="width:100%;"
                            v-model="pageData.formData.reportTime"
                            type="datetime"
                            placeholder="选择日期时间"
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
                                <template #operatColumn>
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
import BuzApi from "@/api/controller/prdStartApi";
import prdReportApi from "@/api/controller/prdReportApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import RotateRow from "@/views/v3/components/rotateRow.vue";
import SelectListPrdProcess from '@/views/v3/windowSelect/prdProcessList.vue'
import useDialog from "@/views/v3/out/useDialog";
import SelectListStartNbr from '@/views/v3/windowSelect/startrecordList.vue'
import useSelectList from "../prdprocess/useSelectList";
import useSubmit from "../prdprocess/useSubmit";
import usePageData from "../prdprocess/usePageData";
import SelectListEmployee from '@/views/v3/windowSelect/employeeList.vue'
import SelectListGroup from '@/views/v3/windowSelect/groupList.vue'
import SelectListClass from '@/views/v3/windowSelect/classList.vue'
import SelectListFacotry from '@/views/v3/windowSelect/facotrymodelSelect/index.vue'

const props = defineProps(['param'])
const { tableOption } = usePageData(props)
const pageData = reactive({
    formData: {
        ...props.param.entity,
        reportTime: new Date(),
        qualifiedQty: "",
        reportQty: "",
        unqualifiedQty: "",
        reportBadReasonList: [],
        machiningUnitId: "",
        alRdyQualifiedQty: "",
    },
})
const _getTableList = BuzApi.GetPageList
const isAdd = ref(false)

pageData.formData.unqualifiedQty = computed(() => {
    if (tableOption.tableData.length > 0) {
        return tableOption.tableData.reduce(
            (total, cur) => total + parseInt(cur.badReasonQty),
            0
        );
    }
});

pageData.formData.qualifiedQty = computed(() => {
    if (pageData.formData.reportQty && pageData.formData.unqualifiedQty) {
        return pageData.formData.reportQty - pageData.formData.unqualifiedQty;
    }
});

pageData.formData.reportBadReasonList = computed(() => {
    return tableOption.tableData;
});

const formRules = computed(() => {
    return {
        startNbr: [{ required: pageData.formData.isStart == 1 ? true : false, message: "该字段必填", trigger: "change" }],
        processUniqueNbr: [{ required: true, message: "该字段必填", trigger: "change" }],
        machiningUnitName: [{ required: true, message: "该字段必填", trigger: "change" }],
        employeeName: [{ required: true, message: "该字段必填", trigger: "change" }],
        reportTime: [{ required: true, message: "该字段必填", trigger: "change" }],
        reportQty: [{ required: true, message: "该字段必填", trigger: "change" }],
    }
})


const { dialogGroup,
    dialogClass,
    dialogEmployee } = useSelectList(pageData, true)

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
        pageData.formData.machiningUnitName = rows[0].machiningUnitName
        pageData.formData.machiningUnitId = rows[0].machiningUnitId
        pageData.formData.employeeName = rows[0].employeeName
        pageData.formData.processingEmpId = rows[0].processingEmpId
        pageData.formData.shiftGroupName = rows[0].shiftGroupName
        pageData.formData.shiftGroupId = rows[0].shiftGroupId

        dialogstartNbr.reactiveData.visible = false;

    }
})



// const getFormData = async () => {
//     if (props.param.id.length > 0) {
//         var res = await BuzApi.GetOne({
//             id: props.param.entity.id,
//         });

//         pageData.formData = res.data
//         pageData.formData.checkTime = pageData.formData.checkTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
//         pageData.formData.checker = pageData.formData.checker || getStorage("nickName")
//         tableOption.tableData = res.data.memberList
//     }
// };

/**加工单元 */
const dialogFacotry = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        },
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的
        var rows = [];
        if (_rows) {
            rows = _rows;
        } else {
            rows = dialogFacotry.innerRef.value.getResult().rows;
        }
        pageData.formData.machiningUnitName = rows[0]._text;
        pageData.formData.machiningUnitId = rows[0]._value;
        dialogEmployee.reactiveData.visible = false;
    },
});


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

/**工序 */
const dialogPrdProcess = useDialog({
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
            rows = dialogPrdProcess.innerRef.value.getResult().rows
        }
        pageData.formData.processUniqueNbr = rows[0].processUniqueNbr
        pageData.formData.processName = rows[0].processName
        pageData.formData.processId = rows[0].id
        pageData.formData.productNbr = rows[0].productNbr
        pageData.formData.productName = rows[0].productName
        pageData.formData.couldStartQty = rows[0].couldStartQty
        pageData.formData.isStart = rows[0].isStart
        dialogPrdProcess.reactiveData.visible = false;
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
const { addPageRef, submit } = useSubmit(pageData, prdReportApi, tableOption)
const tabActiveName = ref("badList");

defineExpose({
    submit
})
// onMounted(() => {
//     getFormData();
// })
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
.el-tabs {
    width: 100%;
}
</style>

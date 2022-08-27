<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <rotate-row title="任务信息">
                <el-col :span="8">
                    <el-form-item label="工序识别码" prop="processId">
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
                    <el-form-item label="可开工数量" prop="couldStartQty">
                        <el-input v-model="pageData.formData.couldStartQty" disabled></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="开工信息">
                <el-col :span="8">
                    <el-form-item label="加工单元" prop="machiningUnitId">
                        <el-input
                            suffix-icon="el-icon-search"
                            @click="dialogFacotry.show"
                            v-model="pageData.formData.machiningUnitId"
                        ></el-input>
                    </el-form-item>
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
                </el-col>
                <el-col :span="8">
                    <el-form-item label="加工人员" prop="employeeName">
                        <el-input
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.employeeName"
                            @click="dialogEmployee.show"
                        ></el-input>
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
                    <el-form-item label="开工数量" prop="startQty">
                        <el-input v-model="pageData.formData.startQty"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开工时间" prop="startTime">
                        <!-- <el-input v-model="pageData.formData.no"></el-input> -->
                        <el-date-picker
                            width="100%"
                            v-model="pageData.formData.startTime"
                            type="datetime"
                            :default-value="new Date()"
                            style="width:100%;"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
            </rotate-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import subOne from "./subOne.vue";
import BuzApi from "@/api/controller/prdStartApi";
import { confirmBox, getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import RotateRow from "@/views/v3/components/rotateRow.vue";
import SelectListGroup from '@/views/v3/windowSelect/groupList.vue'
import SelectListClass from '@/views/v3/windowSelect/classList.vue'
import SelectListEmployee from '@/views/v3/windowSelect/employeeList.vue'
import SelectListPrdProcess from '@/views/v3/windowSelect/prdProcessList.vue'
import useDialog from "@/views/v3/out/useDialog";
import SelectListFacotry from '@/views/v3/windowSelect/facotrymodelSelect/index.vue'

const props = defineProps(['param'])

const formRules = reactive({
    processId: [{ required: true, message: "该字段必填", trigger: "change" }],
    machiningUnitId: [{ required: true, message: "该字段必填", trigger: "change" }],
    employeeName: [{ required: true, message: "该字段必填", trigger: "change" }],
    startTime: [{ required: true, message: "该字段必填", trigger: "change" }],
});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});


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
        dialogPrdProcess.reactiveData.visible = false;
    }
})

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
        pageData.formData.machiningUnitName = rows[0].machiningUnitName;
        pageData.formData.machiningUnitId = rows[0].id;
        dialogEmployee.reactiveData.visible = false;
    },
});

/**班次 */
const dialogClass = useDialog({
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
            rows = dialogClass.innerRef.value.getResult().rows
        }
        pageData.formData.shiftSliceName = rows[0].shiftSliceName
        pageData.formData.shiftSliceId = rows[0].id
        dialogClass.reactiveData.visible = false;
    }
})

/**加工人员开窗 */
const dialogEmployee = useDialog({
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
            rows = dialogEmployee.innerRef.value.getResult().rows
        }
        pageData.formData.employeeName = rows[0].employeeName
        pageData.formData.shiftGroupName = rows[0].shiftGroupName
        pageData.formData.shiftGroupId = rows[0].shiftGroupId
        pageData.formData.shiftSliceId = rows[0].shiftSliceId
        pageData.formData.shiftSliceName = rows[0].shiftSliceName
        pageData.formData.processingEmpId = rows[0].id
        dialogEmployee.reactiveData.visible = false;
    }
})


/**班组开窗 */
const dialogGroup = useDialog({
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
            rows = dialogGroup.innerRef.value.getResult().rows
        }
        pageData.formData.shiftGroupName = rows[0].shiftGroupName
        pageData.formData.shiftGroupId = rows[0].id
        dialogGroup.reactiveData.visible = false;
    }
})


const getFormData = async () => {
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.entity.id,
        });

        pageData.formData = res.data
    }
};

const tableOption = reactive({
    tableData: [],
    tableColums: [
        {
            "label": "名字",
            "prop": "name",
            "minWidth": 100
        },
        {
            "label": "手机号",
            "prop": "phone",
            "minWidth": 100
        }
    ],
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
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

    var index = scope.$index;
    var arr = [...tableOption.tableData];
    arr.splice(index, 1);
    tableOption.tableData = arr;
};

const addPageRef = ref<any>(null)

const submit = () => {
    return new Promise((resolve, reject) => {
        addPageRef.value.validate(async (valid: boolean) => {
            if (!valid) { return; }
            else {
                var postParam = { ...pageData.formData }
                postParam.memberList = tableOption.tableData
                var res = await BuzApi.SaveOrUpdate(postParam);
                if (res.code == 200) {
                    messageAlert('success', '保存成功')
                    resolve(true);
                } else {
                    messageAlert('error', res.msg)
                }
            }
        });
    })
};


const tabActiveName = ref("badList");

getFormData()

defineExpose({
    submit
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

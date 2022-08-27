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
                    <el-form-item label="前道工序" prop="preProcess">
                        <el-input v-model="pageData.formData.preProcess" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="计划开始时间" prop="planStartTime">
                        <el-input v-model="pageData.formData.planStartTime" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="计划结束时间" prop="planEndTime">
                        <el-input v-model="pageData.formData.planEndTime" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="实际开始时间" prop="actualStartTime">
                        <el-input v-model="pageData.formData.actualStartTime" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="实际结束时间" prop="actualEndTime">
                        <el-input v-model="pageData.formData.actualEndTime" disabled></el-input>
                    </el-form-item>
                </el-col>

                <!-- <el-col :span="8">
                    <el-form-item label="姓名" prop="title">
                        <el-input
                            v-model="pageData.formData.name"
                            @click.stop="openSelectDialogFunc.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="性别" prop="title">
                        <el-select
                            v-model="pageData.formData.sex"
                            placeholder="请选择"
                            clearable
                            style="width: 100%"
                        >
                            <el-option label="未知" :value="0"></el-option>
                            <el-option label="男" :value="1"></el-option>
                            <el-option label="女" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>-->
            </rotate-row>

            <rotate-row title="生产信息">
                <el-col :span="8">
                    <el-form-item label="计划数量" prop="planQty">
                        <el-input v-model="pageData.formData.planQty" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="可超收数量" prop="title">
                        <el-input v-model="pageData.formData.no" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报数量" prop="reportQty">
                        <el-input v-model="pageData.formData.reportQty" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合格数量" prop="qualifiedQty">
                        <el-input v-model="pageData.formData.qualifiedQty" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="不合格数量" prop="unqualifiedQty">
                        <el-input v-model="pageData.formData.unqualifiedQty" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="已开工数量" prop="startedQty">
                        <el-input v-model="pageData.formData.startedQty" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="已委外数量" prop="subedQty">
                        <el-input v-model="pageData.formData.subedQty" disabled></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="参数信息">
                <el-col :span="8">
                    <el-form-item label="是否开工" prop="isStart">
                        <el-switch active-color="#13ce66" v-model="isStart" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否质检" prop="isInspect">
                        <el-switch active-color="#13ce66" v-model="isInspect" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="是否委外" prop="isSubout">
                        <el-switch active-color="#13ce66" v-model="isSubout" :disabled="true" />
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="自动汇报" prop="isAutoReport">
                        <el-switch active-color="#13ce66" v-model="isAutoReport" :disabled="true" />
                    </el-form-item>
                </el-col>
            </rotate-row>
        </el-form>
        <div class="fixedDialog">
            <el-dialog
                v-model="subOpenDialog.visible"
                title="子项编辑"
                :destroy-on-close="true"
                width="1400px"
            >
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
import { reactive, ref, onMounted, computed, toRefs } from "vue";
import { useRoute, useRouter } from "vue-router";
import subOne from "./subOne.vue";
import BuzApi from "@/api/controller/prdProcessApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import RotateRow from "@/views/v3/components/rotateRow.vue";


const props = defineProps(['param'])

const formRules = reactive({
    status: [{ required: true, message: "该字段必填", trigger: "blur" }],
});


let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});

const getFormData = async () => {
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.entity.id,
        });
        pageData.formData = res.data
    }

};

const isStart = computed(() => pageData.formData.isStart == 1 ? true : false)
const isInspect = computed(() => pageData.formData.isInspect == 1 ? true : false)
const isSubout = computed(() => pageData.formData.isSubout == 1 ? true : false)
const isAutoReport = computed(() => pageData.formData.isAutoReport == 1 ? true : false)

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
    //先直接加一条数据
    //tableOption.tableData = res.data.receiveBadReasonList;
    var index = scope.$index;
    var arr = [...tableOption.tableData];
    arr.splice(index, 1);
    tableOption.tableData = arr;
};
const addPageRef = ref<any>(null)
const submit = () => {
    addPageRef.value.validate(async (valid: boolean) => {
        console.log(valid)
        if (!valid) return;
        return new Promise(async (resolve, reject) => {
            var postParam = { ...pageData.formData }
            postParam.memberList = tableOption.tableData
            var res = await BuzApi.SaveOrUpdate(postParam);

            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            } else {
                messageAlert('error', res.msg)
            }
        });
    })
};
const tabActiveName = ref("badList");

onMounted(() => {
    getFormData();
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <rotate-row title="任务信息">
                <el-col :span="8">
                    <el-form-item label="工序识别码" prop="title">
                        <el-input disabled v-model="pageData.formData.processUniqueNbr"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="工序名称" prop="title">
                        <el-input
                            v-model="pageData.formData.name"
                            @click.stop="openSelectDialogFunc.show"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="工序代码" prop="title">
                        <el-input
                            v-model="pageData.formData.name"
                            @click.stop="openSelectDialogFunc.show"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品名称" prop="title">
                        <el-input
                            v-model="pageData.formData.name"
                            @click.stop="openSelectDialogFunc.show"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开工单号" prop="title">
                        <el-input
                            v-model="pageData.formData.name"
                            @click.stop="openSelectDialogFunc.show"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开工数量" prop="title">
                        <el-input
                            v-model="pageData.formData.name"
                            @click.stop="openSelectDialogFunc.show"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="已汇报合格数量" prop="alRdyQualifiedQty">
                        <el-input
                            v-model="pageData.formData.alRdyQualifiedQty"
                            @click.stop="openSelectDialogFunc.show"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="汇报信息">
                <el-col :span="8">
                    <el-form-item label="加工单元" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="加工人员" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班组" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班次" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报数量" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="合格数量" prop="title">
                        <el-input v-model="pageData.formData.no" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开始时间" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报时间" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="不良数量" prop="title">
                        <el-input v-model="pageData.formData.no" disabled></el-input>
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
                                @click="subOpenDialogFunc.show()"
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
                                                @click="subOpenDialogFunc.show(scope.row, scope.$index)"
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
            <el-dialog
                v-model="openSelectDialog.visible"
                title="开窗选择"
                :destroy-on-close="true"
                width="1400px"
            >
                <select-list ref="openSelectRef" :param="openSelectDialog.param" />
                <template #footer>
                    <el-button @click="openSelectDialogFunc.hide()">取消</el-button>
                    <el-button type="primary" @click="openSelectDialogFunc.onConfirm">确定</el-button>
                </template>
            </el-dialog>
        </div>

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
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import subOne from "./subOne.vue";
import BuzApi from "@/api/controller/demoUserApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import selectList from "./selectList.vue";
import RotateRow from "@/views/v3/components/rotateRow.vue";

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    processId: [{ required: true, message: "该字段必填", trigger: "blur" }],
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
        pageData.formData.checkTime = pageData.formData.checkTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
        pageData.formData.checker = pageData.formData.checker || getStorage("nickName")
        tableOption.tableData = res.data.memberList
    }
};

const tableOption = reactive({
    tableData: [],
    tableColums: [
        {
            "label": "不良原因代码",
            "prop": "name",
            "minWidth": 100
        },
        {
            "label": "不良原因名称",
            "prop": "phone",
            "minWidth": 100
        },
        {
            "label": "不良数量",
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
.el-tabs {
    width: 100%;
}
</style>


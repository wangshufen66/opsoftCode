<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <el-row>
                <div class="area-title">
                    <div class="area-title-left">
                        <div class="area-title-left-icon"></div>
                    </div>
                    <div class="area-title-content">基本信息</div>
                    <div class="area-title-right"></div>
                </div>
            </el-row>

            <el-row>
                <el-col :span="8">
                    <el-form-item label="编号" prop="title">
                        <el-input v-model="pageData.formData.no"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
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
                </el-col>
            </el-row>

            <el-tabs v-model="tabActiveName">
                <el-tab-pane label="家庭成员（子表）" name="badList">
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
import useDialog from "@/views/v3/out/useDialog";
const props = defineProps(['param'])

const { showType, entity } = props.param

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
        pageData.formData.checkTime = pageData.formData.checkTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
        pageData.formData.checker = pageData.formData.checker || getStorage("nickName")
        tableOption.tableData = res.data.memberList
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
                userId: pageData.formData.id,
                id: null,
                name: '',
                phone: '',
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

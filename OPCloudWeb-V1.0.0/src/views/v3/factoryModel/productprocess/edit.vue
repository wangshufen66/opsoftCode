<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addpageRef" :rules="formRules" label-width="160px">
            <rotate-row title="工艺流程">
                <el-col :span="12">
                    <el-form-item label="工艺流程编码" prop="processRouteNbr">
                        <el-input v-model="pageData.formData.processRouteNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="工艺流程名称" prop="processRouteName">
                        <el-input v-model="pageData.formData.processRouteName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="产品名称" prop="materialName">
                        <el-input
                            @click.stop="dialog.show"
                            v-model="pageData.formData.materialName"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="是否可控制工序流转" prop="isControlOrder">
                        <el-switch :active-value="0" :inactive-value="1" v-model="pageData.formData.isControlOrder"></el-switch>
                    </el-form-item>
                </el-col>
            </rotate-row>
            <!-- 字表数据 -->
            <rotate-row title="工艺路线">
                <!-- 子表工艺路线新增 -->
                <div class="table-tool-wrap">
                    <el-button
                        :disabled="showType == 0"
                        @click="subOpenDialogFunc.show()"
                        type="primary"
                        plain
                        size="small"
                    >添加</el-button>
                </div>

                <div class="m-page-list-table" style="height:300px;width:1300px">
                    <table-extend v-bind="subOneTableOption" @rowDblClick="subOpenDialogFunc.show">
                        <template #col_isInspect="{ data }">
                            <span v-if="data.isInspect == '0'">否</span>
                            <span v-if="data.isInspect == '1'">是</span>
                        </template>
                        <template #col_isStart="{ data }">
                            <span v-if="data.isStart == '0'">否</span>
                            <span v-if="data.isStart == '1'">是</span>
                        </template>
                        <template #col_isAutoReport="{ data }">
                            <span v-if="data.isAutoReport == '0'">否</span>
                            <span v-if="data.isAutoReport == '1'">是</span>
                        </template>
                        <template #col_isSubout="{ data }">
                            <span v-if="data.isSubout == '0'">否</span>
                            <span v-if="data.isSubout == '1'">是</span>
                        </template>
                        <template #col_salaryType="{ data }">
                            <span v-if="data.salaryType == '10'">计时工资</span>
                            <span v-if="data.salaryType == '20'">计件工资</span>
                        </template>

                        <template #operatColumn>
                            <el-table-column label="操作" fixed="right" width="150">
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
            </rotate-row>
        </el-form>
    </div>
    <!-- 物料 -->
    <div class="fixedDialog">
        <el-dialog
            v-model="dialog.reactiveData.visible"
            title="开窗选择"
            :destroy-on-close="true"
            width="1200px"
        >
            <material-select
                style="height: 400px;"
                ref="dialog.innerRef"
                @row-click="dialog.onConfirm"
                :param="dialog.reactiveData.param"
            />
            <!-- @row-click="dialog.onConfirm" -->
            <template #footer>
                <el-button @click="dialog.hide()">取消</el-button>
                <el-button type="primary" @click.stop="dialog.onConfirm(null)">确定</el-button>
            </template>
        </el-dialog>
    </div>

    <!-- 子表弹框 -->
    <div class="fixedDialog">
        <el-dialog
            v-model="subOpenDialog.visible"
            title="工艺路线"
            :destroy-on-close="true"
            width="1400px"
            custom-class="dialog_body_padding_5"
        >
            <sub-one ref="subOpenRef" :param="subOpenDialog.param" />
            <template #footer>
                <el-button @click="subOpenDialogFunc.hide()">取消</el-button>
                <el-button type="primary" @click="subOpenDialogFunc.onConfirm">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/routeApi";
import { getStorage, messageAlert, confirmBox } from '@/utils/utils';
import subOne from "./subOne.vue";
import materialSelect from "@/views/v3/windowSelect/materialSelect/index.vue"
import useDialog from "@/views/v3/out/useDialog";
import RotateRow from "@/views/v3/components/rotateRow.vue";
import dayjs from 'dayjs'

const props = defineProps(['param'])
console.log("props", props)

const { showType, entity } = props.param

const formRules = reactive({
    processRouteNbr: [{ required: true, message: "请输入工艺流程编码", trigger: "blur" }],
    productName: [{ required: true, message: "请输入工艺流程名称", trigger: "blur" }],
    materialName: [{ required: true, message: "请选择产品名称", trigger: "blur" }],
    processRouteName: [{ required: true, message: "请输入工艺流程名称", trigger: "blur" }]
});

let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});

const tableOption = reactive({
    tableData: [],
    tableColums: [],
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});
//子表数据

const subOneTableOption = reactive({
    tableData: [],
    tableColums: [
        {
            label: "前道工序",
            prop: "preProcess",
            minWidth: 120,
        },
        {
            label: "工序代码",
            prop: "processNbr",
            minWidth: 100,
        },
        {
            label: "工序名称",
            prop: "processName",
            minWidth: 100,
        },
        {
            label: "报工系数",
            prop: "machiningCoefficient",
            minWidth: 120,
        },
        {
            label: "标准转换时间",
            prop: "standardTransformTime",
            minWidth: 150,
        },
        {
            label: "单位标准工时",
            prop: "standardTime",
            minWidth: 150,
        },
        {
            label: "是否必须开工",
            prop: "isStart",
            minWidth: 120,
        },

        {
            label: "是否自动汇报",
            prop: "isAutoReport",
            minWidth: 120,
        },
        {
            label: "是否可以委外",
            prop: "isSubout",
            minWidth: 120,
        },

        {
            label: "是否必须质检",
            prop: "isInspect",
            minWidth: 120,
        },
        {
            label: "薪资类型",
            prop: "salaryType",
            minWidth: 120,
        },

        {
            label: "单位工资",
            prop: "unitPrice",
            minWidth: 120,
        },
    ],
    paging: false,
    total: 0,
    tableLoading: false,
    border: false,
});
// 表单弹框显示控制
const editDialog = reactive({
    visible: false,
    param: {
        showType: 0, //1新增 0查看  2编辑
        id: "",
        entity: null,
    },
});

// 获取表单数据
const getFormData = async () => {
    if (props.param.id.length > 0) {
        var res = await BuzApi.GetOne({
            id: props.param.entity.id,
        });

        pageData.formData = res.data;
        pageData.formData.checkTime =
            pageData.formData.checkTime || dayjs().format("YYYY-MM-DD HH:mm:ss");
        pageData.formData.checker =
            pageData.formData.checker || getStorage("nickName");
        // 字表数据赋值,后端反的子表数据的字段是routeProcessList
        subOneTableOption.tableData = res.data.routeProcessList;
    }
};
// 开窗对象
const openSelectRef = ref<any>(null);
// 字表表单对象
const subOpenRef = ref<any>(null);
//物料开窗
const dialog = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
            name: ''
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的
        var rows = []
        if (_rows) {
            rows = _rows
        } else {
            rows = dialog.innerRef.value.getResult().rows
        }
        dialog.reactiveData.visible = false;
        pageData.formData.materialName = rows[0]._text
        pageData.formData.materialId = rows[0]._value
    }
})

// 控制子表的弹框显示
const subOpenDialog = reactive({
    visible: false,
    param: {
        entity: {},
        rowIndex: -1,
    },
});


const SubOpenDialogFunc = function (dialog, dialogRef) {

    return {
        show: (row, index) => {
            if (row) {
                dialog.param.entity = { ...row };
            }
            // 关联字段值
            dialog.param.entity.linkData = pageData.formData.planQty;

            dialog.param.rowIndex = row ? index : -1;
            dialog.visible = true;
        },
        hide: () => {
            dialog.visible = false;
        },
        onConfirm: () => {

            var { row, rowIndex } = dialogRef.value.getResult();
            var _defaultEntity = {
                userId: pageData.formData.id,
                id: null,
                name: "",
                phone: "",
                ...row,
            };
            if (rowIndex == -1) {
                subOneTableOption.tableData.push(_defaultEntity);
            } else {
                subOneTableOption.tableData[rowIndex] = _defaultEntity;
            }
            dialog.visible = false;
        },
    };
};
const subOpenDialogFunc = SubOpenDialogFunc(subOpenDialog, subOpenRef);
// 字表删除
const delSub = (scope) => {
    //先直接加一条数据
    confirmBox("删除数据", async () => {
        var index = scope.$index;
        var arr = [...subOneTableOption.tableData];
        arr.splice(index, 1);
        subOneTableOption.tableData = arr;
    });
};
const addpageRef = ref<any>(null);
function submit() {
    return new Promise(async (resolve, reject) => {
        addpageRef.value.validate(async (valid: boolean) => {
            if (!valid) return;
            //删除子表数据，先赋值，再把参数传到接口
            pageData.formData.routeProcessList = subOneTableOption.tableData
            var postParam = { ...pageData.formData }
            var res = await BuzApi.SaveOrUpdate(postParam);
            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            }

        });
    })
};
onMounted(() => {
    getFormData();
})
defineExpose({
    submit
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

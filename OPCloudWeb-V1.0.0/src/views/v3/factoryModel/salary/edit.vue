<template>
    <div class="m-page-edit">
        <el-form
            :model="pageData.formData"
            ref="addpageRef"
            :rules="formRules"
            label-width="110px"
            class="form"
        >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物料代码" prop="processId">
                        <el-input
                            fitlterable
                            clearable
                            suffix-icon="el-icon-search"
                            @click.stop="dialog.show"
                            v-model="pageData.formData.processId"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料名称" prop="materialName">
                        <el-input
                            filterable
                            v-model="pageData.formData.materialName"
                            clearable
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="工序代码" prop="processNbr">
                        <el-input
                            filterable
                            suffix-icon="el-icon-search"
                            @click.stop="dialogProcess.show"
                            v-model="pageData.formData.processNbr"
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="工序名称" prop="processName">
                        <el-input
                            filterable
                            v-model="pageData.formData.processName"
                            disabled
                            clearable
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="salaryType" label="计价方式">
                        <el-select
                            style="width:100%"
                            filterable
                            v-model="pageData.formData.salaryType"
                            clearable
                        >
                            <el-option :value="0" label="计时"></el-option>
                            <el-option :value="1" label="计件"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="单价/元" prop="unitPrice">
                         <el-input-number v-model="pageData.formData.unitPrice" :precision="2" :step="0.1" :max="10" :min="0" />
                        
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!-- 物料开窗 -->
        <div class="fixedDialog">
            <el-dialog
                v-model="dialog.reactiveData.visible"
                title="开窗选择"
                :destroy-on-close="true"
                width="1400px"
            >
                <material-select
                    style="height: 400px;"
                    ref="dialog.innerRef"
                    @row-click="dialog.onConfirm"
                    :param="dialog.reactiveData.param"
                />
                <template #footer>
                    <el-button @click="dialog.hide()">取消</el-button>
                    <el-button type="primary" @click.stop="dialog.onConfirm(null)">确定</el-button>
                </template>
            </el-dialog>
        </div>
        <!-- 工序开窗选择 -->
        <div class="fixedDialog">
            <el-dialog
                v-model="dialogProcess.reactiveData.visible"
                :destroy-on-close="true"
                width="1200px"
            >
                <process-list
                    style="height: 600px;"
                    @row-click="dialogProcess.onConfirm"
                    ref="dialogProcess.innerRef"
                    :param="dialogProcess.reactiveData.param"
                />
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import BuzApi from "@/api/controller/salaryApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'
import materialSelect from "@/views/v3/windowSelect/materialSelect/index.vue"
import useDialog from "@/views/v3/out/useDialog";
import processList from "../../windowSelect/processList.vue"

const props = defineProps(['param'])

const { showType, entity } = props.param

const formRules = reactive({
    // categoryNbr: [{ required: true, message: "请输入物料代码", trigger: "blur" }],
    //   categoryName: [{ required: true, message: "物料名称", trigger: "blur" }],
    processId: [{ required: true, message: "请选择物料代码", trigger: "blur" }],
    materialNbr: [{ required: true, message: "请选择物料代码", trigger: "blur" }],
    processNbr: [{ required: true, message: "请选择料工序代码", trigger: "blur" }],
    salaryType: [{ required: true, message: "请选择计价方式", trigger: "blur" }],


    unitPrice: [{ required: true, message: "请输入单元", trigger: "blur" }, { type: 'number', message: '输入的单元为数字形式' }, {
        pattern: /^[0-9]+(.[0-9]{0,2})?$/,
        message: "输入的单元必须为数字形式",
        trigger: "blur",
    },],

});
let pageData = reactive({
    formData: {
        ...props.param.entity
    }
});
// 物料开窗
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
        // pageData.formData.materialId = rows[0]._value
        pageData.formData.processId = rows[0]._value

    }
})
const dialogProcess = useDialog({

    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的
        dialogProcess.reactiveData.visible = false;
        pageData.formData.processNbr = _rows[0].processNbr
        pageData.formData.processName = _rows[0].processName
    }
})

const tableOption = reactive({
    tableData: [],
    tableColums: [],
    selectionCol: false,
    paging: false,
    total: 0,
    tableLoading: false,
    noTableRight: false,
});
const addpageRef = ref(null)

function submit() {

    return new Promise(async (resolve, reject) => {

        addpageRef.value.validate(async (valid: boolean) => {
            if (!valid) return;

            var postParam = { ...pageData.formData }
            // postParam.memberList = tableOption.tableData
            var res = await BuzApi.SaveOrUpdate(postParam);
            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            }
        });
    })
};

defineExpose({
    submit
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="formRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="物料代码" prop="materialNbr">
                        <el-input v-model="pageData.formData.materialNbr"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料名称" prop="materialName">
                        <el-input v-model="pageData.formData.materialName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="规格型号" prop="specification">
                        <el-input v-model="pageData.formData.specification"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料类别" prop="classifyName">
                        <el-input
                            clearable
                            suffix-icon="el-icon-search"
                            @click.stop="dialog.show"
                            v-model="pageData.formData.classifyName"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="物料属性" prop="attribute">
                        <el-input v-model="pageData.formData.attribute"></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="基本单位" prop="baseUnitName">
                        <el-input
                            placeholder="开窗"
                            v-model="pageData.formData.baseUnitName"
                            suffix-icon="el-icon-search"
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="分组名称" prop="treeGroupId">
                        <el-input
                            v-model="pageData.formData.treeGroupName"
                            @click.stop="dialog2.show"
                            suffix-icon="el-icon-search"
                        ></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="24">
                    <el-form-item label="备注" prop="title">
                        <el-input
                            v-model="pageData.formData.description"
                            type="textarea"
                            rows="3"
                            show-word-limit
                            maxlength="400"
                        ></el-input>
                    </el-form-item>
                </el-col>

                <!-- <el-col :span="24">
                    <el-form-item label="图片" prop="title">
                        <div style="height:200px;">
                            <img
                                src="http://192.168.42.18:3003/src/assets/images/blogo.png"
                                style="width:300px;height:200px"
                            />
                        </div>
                    </el-form-item>
                </el-col>-->
            </el-row>
        </el-form>
        <!-- <div>{{ JSON.stringify(EnumMap) }}</div>-->
        <!-- <div>{{ JSON.stringify(pageData.formData) }}</div> -->
    </div>
    <div class="fixedDialog">
        <el-dialog
            v-model="dialog.reactiveData.visible"
            title="开窗选择"
            :destroy-on-close="true"
            width="1400px"
        >
            <material-category-list
                height="400px"
                @row-click="dialog.onConfirm"
                ref="dialog.innerRef"
                :param="dialog.reactiveData.param"
            />
        </el-dialog>
    </div>

    <div class="fixedDialog">
        <el-dialog
            v-model="dialog2.reactiveData.visible"
            title="开窗选择"
            :destroy-on-close="true"
            width="1400px"
        >
            <group-select
                style="height:600px"
                @row-click="dialog2.onConfirm"
                ref="dialog.innerRef"
                :param="dialog2.reactiveData.param"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import BuzApi from "@/api/controller/materialApi";
import CommonApi from "@/api/controller/commonApi";
import { getStorage, messageAlert } from '@/utils/utils';
import dayjs from 'dayjs'

import groupSelect from "@/views/v3/windowSelect/materialGroupSelect/index.vue";
import materialCategoryList from "@/views/v3/windowSelect/materialCategoryList.vue";

import useDialog from "@/views/v3/out/useDialog";
import _Row from "element-plus/lib/components/row";

var EnumMap = {
    isDisabled: [{
        text: "启用",
        value: 0
    }, {
        text: "禁用",
        value: 1
    }]
}

const props = defineProps(['param'])

const { showType = 0, entity } = props.param

const formRef = ref<any>(null)
const formRules = reactive({
    materialNbr: [{ required: true, message: "该字段必填", trigger: "blur" }],
    materialName: [{ required: true, message: "该字段必填", trigger: "blur" }],
    isDisabled: [{ required: true, message: "该字段必填", trigger: "blur" }],
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
    }
};

const dialog = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        dialog.reactiveData.visible = false;
        pageData.formData.classifyId = _rows[0].id
        pageData.formData.classifyName = _rows[0].categoryName
    }
})

const dialog2 = useDialog({
    _param: {
        masterSearchForm: {
            //必须的搜索条件
        }
        //...其它自定义
    },
    _onConfirm: (_rows) => {
        dialog2.reactiveData.visible = false;
        pageData.formData.treeGroupId = _rows[0]._value
        pageData.formData.treeGroupName = _rows[0]._text
        pageData.formData.treeGroupCode = _rows[0].code
    }
})


const submit = () => {
    return new Promise(async (resolve, reject) => {
        formRef.value.validate(async (valid: boolean) => {
            console.log(valid)
            if (!valid) return;
            var postParam = { ...pageData.formData }
            var res = await BuzApi.SaveOrUpdate(postParam);
            if (res.code == 200) {
                messageAlert('success', '保存成功')
                resolve(true);
            } else {
                messageAlert('error', res.msg)
            }
        })
    });
};

defineExpose({
    submit
})
onMounted(() => {
    getFormData();
})
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

@import "@/styles/modules/page_edit_new.scss";

<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="名字" prop="name">
                        <el-input v-model="pageData.formData.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="pageData.formData.phone" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";

const props = defineProps(['param'])

console.log(props.param, '==_param====');

const formRules = reactive({
    'name': [{ required: true, message: "该字段必填", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        id: '',
        name: '',
        phone: '',
        ...props.param.entity
    }
});


var addPageRef = ref(null)
const getResult = async () => {
    return new Promise(async (resolve, reject) => {
        addPageRef.value.validate(async (valid: boolean) => {
            console.log(valid)
            if (valid) {
                return resolve({
                    row: { ...pageData.formData },
                    rowIndex: props.param.rowIndex
                })
            }
        });

    })

};

defineExpose({
    getResult
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

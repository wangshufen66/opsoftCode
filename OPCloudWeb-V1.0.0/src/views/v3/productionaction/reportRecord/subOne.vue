<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="不良原因" prop="badReasonName">
                        <el-input
                            suffix-icon="el-icon-search"
                            v-model="pageData.formData.badReasonName"
                            @click.stop="dialogBadReason.show"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="不良数量" prop="badReasonQty">
                        <el-input v-model="pageData.formData.badReasonQty" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="fixedDialog">
            <el-dialog
                v-model="dialogBadReason.reactiveData.visible"
                :destroy-on-close="true"
                width="1400px"
            >
                <template #title>
                    <dialog-title title="不良原因"></dialog-title>
                </template>
                <bad-reason-group-select
                    style="height: 400px;"
                    @row-click="dialogBadReason.onConfirm"
                    ref="dialogBadReason.innerRef"
                    :param="dialogBadReason.reactiveData.param"
                />
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import badReasonGroupSelect from "@/views/v3/windowSelect/badreasonSelect/index.vue";
import useDialog from "@/views/v3/out/useDialog";
import { reactive, ref, onMounted } from "vue";

const props = defineProps(['param'])


const formRules = reactive({
    'pageData.formData.qty': [{ required: true, message: "该字段必填", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        badReasonId: '',
        badReasonNbr: '',
        badReasonName: '',
        badReasonQty: '',
        ...props.param.entity
    }
});


const getResult = () => {
    return {
        row: { ...pageData.formData },
        rowIndex: props.param.rowIndex
    }
};

const dialogBadReason = useDialog({
    _onConfirm: (_rows) => {
        //rows有值时，为emit出来的
        var rows = []
        if (_rows) {
            rows = _rows
        } else {
            rows = dialogBadReason.innerRef.value.getResult().rows
        }
        dialogBadReason.reactiveData.visible = false;
        console.log(rows)

        pageData.formData.badReasonId = _rows[0].id
        pageData.formData.badReasonName = _rows[0].badReasonName
        pageData.formData.badReasonNbr = _rows[0].badReasonNbr
    }
})

defineExpose({
    getResult
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

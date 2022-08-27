<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="不良原因" prop="badReasonName">
                        <el-input
                            @click.stop=" dialogBadReason.badReason.visable=true"
                            v-model="pageData.formData.badReasonName"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="不良数量">
                        <el-input-number v-model="pageData.formData.badReasonQty" :min="0" :max="10"  />
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- 不良原因 -->
        </el-form>
        <div class="fixedDialog">
            <el-dialog
                v-model="dialogBadReason.badReason.visable"
                :destroy-on-close="true"
                width="1400px"
            >
                <badreason-select 
                style="height:400px"
                @row-click="BadReasonConfrim" />
            </el-dialog>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import useDialog from "@/views/v3/out/useDialog";
import badreasonSelect from "@/views/v3/windowSelect/badreasonSelect/index.vue"
// import badReasonGroupSelect from"@/views/v3/windowSelect/badReasonGroupSelect/index.vue"
const props = defineProps(['param'])


const formRules = reactive({
    'badReasonName': [{ required: true, message: "请选择不良原因", trigger: "blur" }],
    'badReasonQty': [{ required: true, message: "请输入不良数量", trigger: "blur" }],
});

let pageData = reactive({
    formData: {
        id: '',
        name: '',
        phone: '',
        ...props.param.entity
    }
});

const dialogBadReason = reactive({
    badReason: {
        visable: false,
        basReasonName: "",
        badReasonNbr: ""
    }
})
//返回子表数据
const getResult = () => {
    return {
        row: { ...pageData.formData },
        rowIndex: props.param.rowIndex
    }
};

function onSelectbadReason() {
    dialogBadReason.badReason.visable = true
}
function BadReasonConfrim(value) {
    //rows有值时，为emit出来的
    dialogBadReason.badReason.visable = false;
    pageData.formData.badReasonName = value[0].badReasonName
    pageData.formData.badReasonNbr = value[0].badReasonNbr
}
//向外抛出子表数据
defineExpose({
    getResult
})

</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

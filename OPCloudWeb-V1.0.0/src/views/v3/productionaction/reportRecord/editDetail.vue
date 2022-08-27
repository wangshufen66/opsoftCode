<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" label-width="120px">
            <rotate-row title="任务信息">
                <el-col :span="8">
                    <el-form-item label="工序识别码" prop="processUniqueNbr">
                        <el-input disabled v-model="pageData.formData.processUniqueNbr"></el-input>
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
                    <el-form-item label="开工单" prop="startNbr">
                        <el-input v-model="pageData.formData.startNbr" disabled></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>

            <rotate-row title="汇报信息">
                <el-col :span="8">
                    <el-form-item label="加工单元" prop="machiningUnitName">
                        <el-input disabled v-model="pageData.formData.machiningUnitName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="加工人员" prop="employeeName">
                        <el-input disabled v-model="pageData.formData.employeeName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班组" prop="shiftGroupName">
                        <el-input disabled v-model="pageData.formData.shiftGroupName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="班次" prop="shiftSliceName">
                        <el-input disabled v-model="pageData.formData.shiftSliceName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="开工数量" prop="startQty">
                        <el-input disabled v-model="pageData.formData.startQty"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报数量" prop="reportQty">
                        <el-input disabled v-model="pageData.formData.reportQty"></el-input>
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
                    <el-form-item label="开始时间" prop="beginTime">
                        <el-input
                            disabled
                            style="width:100%;"
                            v-model="pageData.formData.beginTime"
                        ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="汇报时间" prop="reportTime">
                        <el-input
                            style="width:100%;"
                            v-model="pageData.formData.reportTime"
                            disabled
                        ></el-input>
                    </el-form-item>
                </el-col>
            </rotate-row>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import RotateRow from "@/views/v3/components/rotateRow.vue";
import BuzApi from "@/api/controller/prdReportApi";


const props = defineProps(['param'])


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

getFormData()
</script>

<style scoped>
</style>
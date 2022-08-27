<template>
    <div class="m-page-edit">
        <el-form :model="pageData.formData" ref="addPageRef" :rules="formRules" label-width="120px">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="生产订单号" prop="title">
                        <el-input v-model="pageData.formData.icmoNbr" @click.stop disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="产品名称" prop="title">
                        <el-input v-model="pageData.formData.fproductName" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工序编码" prop="title">
                        <el-input v-model="pageData.formData.fprocessCode" disabled></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="工序名称" prop="title">
                        <el-input v-model="pageData.formData.fprocessName" disabled></el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="8">
                    <el-form-item label="委外计划数量" prop="title">
                        <el-input-number
                            v-model="pageData.formData.planOutQty"
                            :min="0"
                            precision="0"
                        ></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="单价" prop="title">
                        <el-input-number
                            v-model="pageData.formData.price"
                            :min="0.00"
                            precision="2"
                        ></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="金额" prop="title">
                        <el-input disabled v-model="pageData.formData.amount"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script lang="ts" >
import { reactive, ref, onMounted, watch } from "vue";
import orderList from "../ForSelectList/orderList.vue";
export default {
    components: {
        orderList
    },
    props: ['_param'],
    setup(props) {
        console.log(props._param);


        const formRules = reactive({
            'pageData.formData.qty': [{ required: true, message: "该字段必填", trigger: "blur" }],
        });

        let pageData = reactive({
            formData: {
                icmoNbr: '',

                fprocessName: '装配',
                fprocessCode: 'gx202111030001',
                srcProcessId: '379265433cb311ecacc7fa163e64281c',

                icmoNbr: 'BJHY3.981.981',
                fproductName: '装配图',
                fproductCode: 'wl202111030002',

                planOutQty: '',
                price: '',

                ...props._param.entity
            }
        });


        watch(() => pageData.formData.price, () => {//通过一个函数返回要监听的属性
            pageData.formData.amount = pageData.formData.price * pageData.formData.planOutQty
        })
        watch(() => pageData.formData.planOutQty, () => {//通过一个函数返回要监听的属性
            pageData.formData.amount = pageData.formData.price * pageData.formData.planOutQty
        })


        const getResult = () => {
            return {
                row: { ...pageData.formData },
                rowIndex: props._param.rowIndex
            }
        };


        return {
            pageData,
            formRules,
            getResult,
        };
    },
};
</script>

<style lang="scss" scoped>
@import "@/styles/modules/page_edit_new.scss";
</style>

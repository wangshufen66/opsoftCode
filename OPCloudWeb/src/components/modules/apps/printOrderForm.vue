<!-- 工单打印模板 -->
<template>
    <div id="print-order-list">
        <div class="print-order-wrap" v-for="formData in formDataList" :key="formData.fbillNO">
            <div class="form-item">
                <div class="item-label">生产订单</div>
                <div class="item-value">{{ formData?.fbillNO }}</div>
            </div>
            <div class="form-item qrcode-item">
                <qrcode-vue
                    :value="formData?.fbillNO"
                    class="out-qrCode"
                    :size="150"
                    level="H"
                    render-as="svg"
                ></qrcode-vue>
            </div>
            <div class="form-item">
                <div class="item-label">产品代码</div>
                <div class="item-value">{{ formData?.fproductCode || '--' }}</div>
            </div>
            <div class="form-item">
                <div class="item-label">产品名称</div>
                <div class="item-value">{{ formData?.fproductName || '--' }}</div>
            </div>
            <div class="form-item">
                <div class="item-label">规格型号</div>
                <div class="item-value">{{ formData?.fmodel || '--' }}</div>
            </div>
            <div class="form-item">
                <div class="item-label">单位</div>
                <div class="item-value">{{ formData?.funitID || '--' }}</div>
            </div>
            <div class="form-item">
                <div class="item-label">计划数量</div>
                <div class="item-value">{{ formData?.fquantity || '--' }}</div>
            </div>
            <div class="form-item full-row">
                <div class="item-label">计划开工时间</div>
                <div class="item-value">{{ formData?.fplanStartDate || '--' }}</div>
            </div>
            <div class="form-item full-row">
                <div class="item-label">计划完工时间</div>
                <div class="item-value">{{ formData?.fplanFinishDate || '--' }}</div>
            </div>
            <div class="form-item full-row">
                <div class="item-label">产品工艺路线</div>
                <div class="item-value">{{ formData?.fprocessName || '--' }}</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, PropType } from 'vue';
import QrcodeVue from "qrcode.vue";

type OrderData = {
    /**生产订单 */
    fbillNO: string;
    /**产品代码 */
    fproductCode: string;
    /**产品名称 */
    fproductName: string;
    /**规格型号 */
    fmodel: string;
    /**单位 */
    funitID: string;
    /**计划数量 */
    fquantity: string | number;
    /**计划开工时间 */
    fplanStartDate: string;
    /**计划完工时间 */
    fplanFinishDate: string;
    /**产品工艺路线 */
    fprocessName: string;
}

const props = defineProps({
    // 表单数据
    formDataList: Object as PropType<OrderData[]>
});




</script>

<style lang="scss" scoped>
@import "@/styles/modules/pagelist/printform.scss";
</style>
<style type="text/css" media="print">
.print-order-wrap {
    box-sizing: border-box;
    padding-top: 3cm;
    page-break-after: always;
}
</style>
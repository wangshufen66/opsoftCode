<!-- 工单打印模板 -->
<template>
  <div id="print-order-list">
    <div class="print-order-wrap" v-for="formData in formDataList" :key="formData.orderNbr">
      <div class="form-item">
        <div class="item-label">生产订单</div>
        <div class="item-value">{{ formData?.orderNbr }}</div>
      </div>
      <div class="form-item qrcode-item">
        <qrcode-vue :value="formData?.orderNbr" class="out-qrCode" :size="150" level="H" render-as="svg"></qrcode-vue>
      </div>
      <div class="form-item">
        <div class="item-label">产品代码</div>
        <div class="item-value">{{ formData?.productNbr || '--' }}</div>
      </div>
      <div class="form-item">
        <div class="item-label">产品名称</div>
        <div class="item-value">{{ formData?.productName || '--' }}</div>
      </div>
      <!-- <div class="form-item">
                <div class="item-label">规格型号</div>
                <div class="item-value">{{ formData?.unit || '--' }}</div>
            </div> -->
      <div class="form-item">
        <div class="item-label">单位</div>
        <div class="item-value">{{ formData?.unit || '--' }}</div>
      </div>
      <div class="form-item">
        <div class="item-label">计划数量</div>
        <div class="item-value">{{ formData?.planQty || '--' }}</div>
      </div>
      <div class="form-item full-row">
        <div class="item-label">计划开工时间</div>
        <div class="item-value">{{ formData?.planStartTime || '--' }}</div>
      </div>
      <div class="form-item full-row">
        <div class="item-label">计划完工时间</div>
        <div class="item-value">{{ formData?.planEndTime || '--' }}</div>
      </div>
      <div class="form-item full-row">
        <div class="item-label">产品工艺路线</div>
        <div class="item-value">{{ formData?.routeName || '--' }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import type { PropType } from "vue";
import QrcodeVue from "qrcode.vue";

type OrderData = {
  /**生产订单 */
  orderNbr: string;
  /**产品代码 */
  productNbr: string;
  /**产品名称 */
  productName: string;
  /**规格型号 */
  // unit: string;
  /**单位 */
  unit: string;
  /**计划数量 */
  planQty: string | number;
  /**计划开工时间 */
  planStartTime: string;
  /**计划完工时间 */
  planEndTime: string;
  /**产品工艺路线 */
  routeName: string;
};

const props = defineProps({
  // 表单数据
  formDataList: Object as PropType<OrderData[]>,
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
<template>
    <div
        class="text-button"
        :class="[
            `text-button-${type}`,
            disabled && 'is-disabled'
        ]"
    >
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'primary',
        validator: (val: string) => {
            return [
                'primary',
                'success',
                'warning',
                'info',
                'error',
            ].includes(val)
        },
    },
    disabled: Boolean
});

</script>

<style lang="scss" scoped>
@import "@/styles/components/textbutton.scss";
</style>
<template>
    <div class="desgin-header">
        <div class="left-wrap">{{ title }}</div>
        <div class="center-wrap">
            <el-button-group size="mini">
                <el-button
                    :type="paperType === PaperType.A3 ? 'primary' : 'info'"
                    @click="setPaper(PaperType.A3)"
                >A3</el-button>
                <el-button
                    :type="paperType === PaperType.A4 ? 'primary' : 'info'"
                    @click="setPaper(PaperType.A4)"
                >A4</el-button>
                <el-button
                    :type="paperType === PaperType.A5 ? 'primary' : 'info'"
                    @click="setPaper(PaperType.A5)"
                >A5</el-button>
                <el-button
                    :type="paperType === PaperType.B3 ? 'primary' : 'info'"
                    @click="setPaper(PaperType.B3)"
                >B3</el-button>
                <el-button
                    :type="paperType === PaperType.B4 ? 'primary' : 'info'"
                    @click="setPaper(PaperType.B4)"
                >B4</el-button>
                <el-button
                    :type="paperType === PaperType.B5 ? 'primary' : 'info'"
                    @click="setPaper(PaperType.B5)"
                >B5</el-button>
            </el-button-group>
            <el-popover placement="bottom" title="设置自定义纸张宽高" trigger="click" width="340px">
                <el-form
                    ref="otherPaperForm"
                    label-position="left"
                    :model="otherPaper"
                    label-width="30px"
                    size="mini"
                >
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="宽">
                                <el-input v-model="otherPaper.width">
                                    <template #append>mm</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="16">
                            <el-form-item label="高">
                                <el-input v-model="otherPaper.height">
                                    <template #append>mm</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item>
                        <el-button plain type="primary" @click="setPaper(PaperType.CUSTOM)">确定</el-button>
                    </el-form-item>
                </el-form>
                <template #reference>
                    <el-button
                        size="mini"
                        :type="paperType === PaperType.CUSTOM ? 'primary' : 'info'"
                    >自定义纸张</el-button>
                </template>
            </el-popover>
            <el-button-group size="mini">
                <el-button type="info" icon="el-icon-refresh-right" @click="rotatePaper">旋转</el-button>
            </el-button-group>
        </div>
        <div class="right-wrap">
            <el-button-group>
                <el-button icon="el-icon-brush" size="small" @click="onTestPrint">打印测试</el-button>
                <!-- 返回 -->
                <el-button icon="el-icon-back" size="small" @click="onBack">返回</el-button>
                <!-- 清空 -->
                <el-button icon="el-icon-brush" size="small" @click="onClearHandler">清空</el-button>
                <!-- 保存 -->
                <el-button
                    icon="el-icon-folder-checked"
                    size="small"
                    :loading="saveLoading"
                    @click="onSave(1)"
                >保存</el-button>
            </el-button-group>
        </div>
    </div>
</template>
  
<script lang="ts" setup>
import { unref, ref, onMounted, inject, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import useEitter from "@/hooks/use-core/useMitt";
import { confirmBox, messageAlert } from "@/shared/utils/utils";
import { PaperType } from './type';
import type { Rect } from './type'


const mitter = useEitter();
const router = useRouter();

const parent: any = inject('print-template', {});

const saveLoading = ref<boolean>(false);

const title = ref<string>('打印模板配置');

const otherPaper = reactive<Rect>({
    width: undefined,
    height: undefined
})

const paperType = computed(() => {
    return parent.currentPaperType.value;
})

function onTestPrint() {
    mitter.emitter.emit('on-test-print');
}

function onBack() {
    confirmBox("返回上一页", () => {
        router.go(-1);
    });
}

function onClearHandler() {
    confirmBox("清空模板", () => {
        mitter.emitter.emit('clear-print-template');
    });
}

const onSave = (type: number): void => {
    saveLoading.value = true;
    const params = {};
    mitter.emitter.emit('on-print-template-save', {
        saveType: type,
        config: params,
        callback: () => {
            saveLoading.value = false;
        },
    });
};

function setPaper(pagerType: PaperType) {
    if (pagerType !== PaperType.CUSTOM) {
        otherPaper.width = undefined;
        otherPaper.height = undefined;
    }
    mitter.emitter.emit('set-print-template-papersize', { type: pagerType, rect: otherPaper });
}

function rotatePaper() {
    mitter.emitter.emit('set-print-template-rotatepape');
}

onMounted(() => { });
</script>
  
<style lang="scss" scoped>
@import "@/styles/modules/printTemplate/header.scss";
</style>
  
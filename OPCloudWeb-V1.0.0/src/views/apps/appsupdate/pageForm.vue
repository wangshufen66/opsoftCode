<template>
    <div class="fixedDialog">
        <el-dialog
            :title="title"
            :modelValue="visible"
            destroy-on-close
            width="700px"
            @closed="onClose"
        >
            <template v-slot:title>
                <dialog-title :title="title"></dialog-title>
            </template>
            <el-form :model="formData" ref="addPageRef" :rules="formRules" label-width="100px">
                <el-form-item label="页面名称" prop="pageName">
                    <el-input v-model="formData.pageName" placeholder="页面名称，长度在2~10个字"></el-input>
                </el-form-item>
                <el-form-item label="表名" prop="tableNameSuffix">
                    <div class="tableName">
                        <el-input v-model="formData.tableNamePrefix" :readonly="true"></el-input>
                        <el-input
                            v-model="formData.tableNameSuffix"
                            placeholder="表名，只允许英文、数字，英文开头"
                            :readonly="!!formData.id"
                        ></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="页面类型" prop="pageType">
                    <el-select v-model="formData.pageType" placeholder="请选择">
                        <el-option
                            v-for="item in pageTypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="页面说明" prop="pageRemark">
                    <el-input v-model="formData.pageRemark" placeholder="请输入页面说明"></el-input>
                </el-form-item>
                <el-form-item label="菜单图标" prop="menuIcon">
                    <el-input v-model="formData.menuIcon" placeholder="请选择页面菜单图标" clearable>
                        <template #append>
                            <el-button @click="openIconsDialog()">选择</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <div class="client-select">
                    <el-row>
                        <el-col :span="5">
                            <p class="tag-title">使用范围</p>
                        </el-col>
                        <el-col :span="7">
                            <p class="tag-title">是否可用</p>
                        </el-col>
                        <el-col :span="7">
                            <p class="tag-title">是否显示</p>
                        </el-col>
                        <el-col :span="5">
                            <p class="tag-title">排序值</p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <p class="tag-body">PC端</p>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="pcIsUsing">
                                <div class="tag-body">
                                    <el-switch
                                        active-text="是"
                                        inactive-text="否"
                                        v-model="formData.pcIsUsing"
                                        :active-value="0"
                                        :inactive-value="1"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="pcIsShow">
                                <div class="tag-body">
                                    <el-switch
                                        v-model="formData.pcIsShow"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="0" prop="pcOrd">
                                <el-input
                                    type="number"
                                    v-model.number="formData.pcOrd"
                                    :min="1"
                                    placeholder="请输入排序"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <p class="tag-body">APP端</p>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="appIsUsing">
                                <div class="tag-body">
                                    <el-switch
                                        active-text="是"
                                        inactive-text="否"
                                        v-model="formData.appIsUsing"
                                        :active-value="0"
                                        :inactive-value="1"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="appIsShow">
                                <div class="tag-body">
                                    <el-switch
                                        v-model="formData.appIsShow"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="0" prop="appOrd">
                                <el-input
                                    type="number"
                                    v-model.number="formData.appOrd"
                                    :min="1"
                                    placeholder="请输入排序"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <p class="tag-body">企业微信</p>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="ewIsUsing">
                                <div class="tag-body">
                                    <el-switch
                                        active-text="是"
                                        inactive-text="否"
                                        v-model="formData.ewIsUsing"
                                        :active-value="0"
                                        :inactive-value="1"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="ewIsShow">
                                <div class="tag-body">
                                    <el-switch
                                        v-model="formData.ewIsShow"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="0" prop="ewOrd">
                                <el-input
                                    type="number"
                                    v-model.number="formData.ewOrd"
                                    :min="1"
                                    placeholder="请输入排序"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <p class="tag-body">钉钉</p>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="dingIsUsing">
                                <div class="tag-body">
                                    <el-switch
                                        active-text="是"
                                        inactive-text="否"
                                        v-model="formData.dingIsUsing"
                                        :active-value="0"
                                        :inactive-value="1"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="dingIsShow">
                                <div class="tag-body">
                                    <el-switch
                                        v-model="formData.dingIsShow"
                                        active-text="是"
                                        inactive-text="否"
                                        :active-value="1"
                                        :inactive-value="0"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label-width="0" prop="dingOrd">
                                <el-input
                                    type="number"
                                    v-model.number="formData.dingOrd"
                                    :min="1"
                                    placeholder="请输入排序"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="5">
                            <p class="tag-body">移动端首页</p>
                        </el-col>
                        <el-col :span="7">
                            <el-form-item label-width="0" prop="isAppHome">
                                <div class="tag-body">
                                    <el-switch
                                        active-text="是"
                                        inactive-text="否"
                                        v-model="formData.isAppHome"
                                        :active-value="1"
                                        :inactive-value="0"
                                    ></el-switch>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </div>

                <el-form-item label="背景图片" prop="backgroundImagePath">
                    <div class="upload-demo" v-loading="imgloading">
                        <el-upload
                            class="upload-demo-item"
                            :before-upload="beforeUpload"
                            action
                            :on-error="onUploadError"
                            :show-file-list="false"
                            :http-request="upload"
                            list-type="picture-card"
                        >
                            <img
                                class="uploadImg"
                                v-if="formData.backgroundImagePath"
                                :src="formData.backgroundImagePath"
                            />
                            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
                            <template #tip>
                                <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
                            </template>
                        </el-upload>
                    </div>
                </el-form-item>
                <template v-if="formData.pageType == 9">
                    <el-form-item label="URL" class="itemURL" prop="url">
                        <el-input v-model="formData.url" placeholder="请输入URL"></el-input>
                    </el-form-item>
                    <el-form-item label="token" prop="token">
                        <el-input v-model="formData.token" placeholder="请输入token"></el-input>
                    </el-form-item>
                    <el-form-item label="打开方式">
                        <el-radio-group v-model="formData.openType" size="small">
                            <el-radio-button label="0" border>本页加载</el-radio-button>
                            <el-radio-button label="1" border>打开新标签页</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="保留公共页面" prop="keepPublicPage">
                        <el-switch
                            active-text="是"
                            inactive-text="否"
                            v-model="formData.keepPublicPage"
                            :active-value="1"
                            :inactive-value="0"
                        />
                    </el-form-item>
                </template>
            </el-form>
            <template #footer>
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" :loading="addloading" @click="onSubmitForm">保 存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive, inject, nextTick } from 'vue';
import { useRoute } from "vue-router";
import { addPages, updatePageById, uploadBgImage } from '@/api/homeApi';
import { messageAlert } from '@/utils/utils';

const props = defineProps({
    title: String,
    visible: Boolean,
    formData: Object
})

const parent = inject('parent', {} as any)

const emit = defineEmits(['update:visible', 'onSubmit'])

const route = useRoute();

const { modelid } = route.query;

const addPageRef = ref<any>(null);

const addloading = ref<boolean>(false);

//图片加载
const imgloading = ref<boolean>(false);

const pageTypeList = reactive([
    {
        label: "基础信息",
        value: 0,
    },
    {
        label: "流程表单",
        value: 1,
    },
    {
        label: "报表页面",
        value: 2,
    },
    {
        label: "嵌入页面",
        value: 9,
    },
]);

// 表单验证规则
const formRules = reactive({
    pageName: [
        { required: true, message: "页面名称不能为空", trigger: "blur" },
        { min: 2, max: 10, message: "长度在2到10个字之间", trigger: "blur" },
        {
            pattern: /^[^0-9][\u4E00-\u9FA5A-Za-z0-9_]+$/,
            message: "名称不能数字开头且不能包含特殊字符",
            trigger: "blur",
        },
    ],
    tableNameSuffix: [
        { min: 1, max: 50, message: "长度在1到50个字之间", trigger: "blur" },
        {
            pattern: /^[a-zA-Z]{1}(([a-zA-Z0-9]){1,49})?$/,
            message: "表名，只允许英文、数字，英文开头",
            trigger: "blur",
        },
    ],
    pageType: [{ required: true, message: "请选择页面类型", trigger: "blur" }],
    pageRemark: [
        { required: true, message: "页面说明不能为空", trigger: "blur" },
    ],
    pcOrd: [
        { required: true, message: "排序值不能为空", trigger: "blur" },
        { pattern: /^\d\d*$/, message: "请输入正整数", trigger: "blur" },
    ],
    appOrd: [
        { required: true, message: "排序值不能为空", trigger: "blur" },
        { pattern: /^\d\d*$/, message: "请输入正整数", trigger: "blur" },
    ],
    ewOrd: [
        { required: true, message: "排序值不能为空", trigger: "blur" },
        { pattern: /^\d\d*$/, message: "请输入正整数", trigger: "blur" },
    ],
    dingOrd: [
        { required: true, message: "排序值不能为空", trigger: "blur" },
        { pattern: /^\d\d*$/, message: "请输入正整数", trigger: "blur" },
    ],
    url: [
        {
            validator: (rule, value, callback) => {
                if (props.formData && props.formData.pageType == 9 && (!value || !value.trim())) {
                    callback(new Error("页面类型为嵌入页面时，URL必须填写！"));
                }
                let urlReg = /(http|https):\/\/([\w.]+\/?)\S*/i;
                if (!urlReg.test(value)) {
                    callback(
                        new Error("必须以http或https开头,且需符合URL规范,检查格式是否正确")
                    );
                }
                callback();
            },
            trigger: "blur",
        },
    ],
});

function onClose() {
    onReset();
    nextTick(() => {
        emit("update:visible", false);
    });
}

function openIconsDialog() {
    parent.iconDialogState.visible = true;
}

// 上传之前
const beforeUpload = (file) => {
    const isJPG = file.type === "image/jpeg" || file.type === "image/png";
    const isLt2M = file.size / 1024 <= 500;
    if (!isJPG) {
        messageAlert("error", "上传头像图片只能是 JPG 或者 PNG 格式!");
    }
    if (!isLt2M) {
        messageAlert("error", "上传头像图片大小不能超过500KB!");
    }
    return isJPG && isLt2M;
};
//上传错误
function onUploadError() {
    imgloading.value = false;
}

// 上传图片
const upload = async (fileOptions: any): Promise<void> => {
    imgloading.value = true;
    const formData = new FormData();
    formData.append("file", fileOptions.file);
    const res = await uploadBgImage(formData);
    if (res.code == 200) {
        props.formData && (props.formData.backgroundImagePath = res.data.filePath);
        imgloading.value = false;
    } else {
        imgloading.value = false;
    }
};

function onReset() {
    addPageRef.value.resetFields();
    addPageRef.value?.clearValidate();
}

function onSubmitForm() {
    addloading.value = true;
    addPageRef.value.validate(async (valid: boolean) => {
        if (valid) {
            let params: any = { ...props.formData, modelId: modelid };
            if (params.id) {
                const res = await updatePageById(params);
                addloading.value = false;
                if (res.code == 200) {
                    messageAlert("success", "修改成功");
                }
            } else {
                const res = await addPages(params);
                addloading.value = false;
                if (res.code == 200) {
                    messageAlert("success", "添加成功");
                }
            }
            onReset();
            emit("onSubmit");
            emit("update:visible", false);
        } else {
            addloading.value = false;
            return false;
        }
    });
}

</script>

<style lang="scss" scoped>
@import "@/styles/modules/pagelistform.scss";
</style>

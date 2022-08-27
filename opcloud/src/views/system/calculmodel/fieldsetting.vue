<template>
  <div class="fixedDialog">
    <el-dialog
      :modelValue="visible"
      @closed="closeDialog"
      destroy-on-close
      width="800px"
    >
      <template v-slot:title>
        <dialog-title
          :title="`模型设计 - ${formModel.modelName}`"
        ></dialog-title>
      </template>
      <div class="top-params">
        <p>
          模型类型：
          <span class="text">{{ formModel.modelType }}</span>
        </p>
        <p>
          模型说明：
          <span class="text" :title="formModel.modelSpecification">{{
            formModel.modelSpecification
          }}</span>
        </p>
      </div>
      <div class="line">
        <div>参数</div>
        <div>字段</div>
      </div>
      <el-form :model="formModel" ref="formRef" label-width="220px">
        <el-form-item
          v-for="item in formModel.infoList"
          :label="`${item.remark}(${item.modelKey})：`"
          :key="item.id"
        >
          <template v-if="item.modelKey !== 'keepDecimalPlaces'">
            <div class="field-wrap">
              <el-cascader
                v-model="item.fieldSource"
                :props="getFieldProps(item)"
                separator="-"
                style="width: 400px;"
              ></el-cascader>
            </div>
          </template>
          <template v-else>
            <el-select
              v-model="item.fieldSource"
              placeholder="请选择保留小数位数"
              style="width: 100%;"
              filterable
              clearable
            >
              <el-option label="0" value="0" :key="0"></el-option>
              <el-option label="1" value="1" :key="1"></el-option>
              <el-option label="2" value="2" :key="2"></el-option>
              <el-option label="3" value="3" :key="3"></el-option>
              <el-option label="4" value="4" :key="4"></el-option>
              <el-option label="5" value="5" :key="5"></el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>

      <div class="line" v-if="collectlist.length > 0">
        <div>汇总条件</div>
        <div>字段</div>
      </div>
      <el-form :model="collectlist" label-width="220px">
        <el-form-item
          v-for="element in collectlist"
          :label="`${element.remark}(${element.modelKey})：`"
          :key="element.id"
        >
          <div class="field-wrap">
            <el-cascader
              v-model="element.fieldSource"
              :props="getFieldProps(element)"
              separator="-"
              style="width: 400px;"
            ></el-cascader>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" :loading="saveLoding" @click="onSubmitForm"
          >保 存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, inject, nextTick, ref, watch } from "vue";
import { getModelKeys, saveModelKeys } from "@/api/functionModel";
import { deepClone, messageAlert } from "@/shared/utils/utils";
import { getFieldWithType, getModelByApp, getPageByModel } from "@/api/userApi";

export default defineComponent({
  props: {
    visible: Boolean,
    params: Object,
  },
  setup(props, { emit }) {
    const parent = inject("functionModel", {});

    watch(
      () => props.visible,
      (visible) => {
        if (visible) {
          formModel.value.id = props.params?.id;
          formModel.value.id && getDetail();
        }
      }
    );

    const formRef = ref<any>(null);

    const formModel = ref<any>({
      id: undefined,
      modelName: "",
    });

    const formRules = reactive({});

    const saveLoding = ref<boolean>();

    const collectlist = ref<any>([]);
    /**
     * 关闭弹窗
     */
    function closeDialog() {
      resetFields();
      nextTick(() => {
        emit("update:visible", false);
      });
    }

    /**
     * 获取字段配置
     */
    async function getDetail() {
      collectlist.value = [];
      const res = await getModelKeys({ id: formModel.value.id });
      if (res.code == 200) {
        const result = res.data;
        const collectResult = deepClone(result);
        result.infoList.forEach((f, index) => {
          if (f.modelKey !== "keepDecimalPlaces") {
            if (f.masterList && f.masterList.length > 0) {
              f.fieldSource = f.masterList[0].fieldSource;
            }
            if (f.fieldSource && f.fieldSource.indexOf("__") > -1) {
              const ids = f.fieldSource.split("__")[0];
              f.fieldSource = ids.split(",");
              // .map((m) => (/^\d+$/g.test(m) && Number(m)) || m);
            } else {
              f.fieldSource = [];
            }
          }
        });

        formModel.value = result;
        collectResult.infoList.forEach((f, index) => {
          if (f.modelKey !== "keepDecimalPlaces") {
            if (f.masterList && f.masterList.length > 0) {
              f.fieldSource = f.masterList[1].fieldSource;
            }
            if (f.fieldSource && f.fieldSource.indexOf("__") > -1) {
              const ids = f.fieldSource.split("__")[0];
              f.fieldSource = ids.split(",");
              // .map((m) => (/^\d+$/g.test(m) && Number(m)) || m);
            } else {
              f.fieldSource = [];
            }
            if (f.isCollect == 1 && f.masterList.length > 0) {
              collectlist.value.push(f);
            }
          }
        });
      }
    }

    /**
     * 保存
     */
    async function onSubmitForm() {
      saveLoding.value = true;
      const params = deepClone(formModel.value);
      for (let i = 0; i < params.infoList.length; i++) {
        // if (
        //   Array.isArray(params.infoList[i].fieldSource) &&
        //   params.infoList[i].fieldSource.length === 0
        // ) {
        //   messageAlert("error", "请填写完整参数字段");
        //   saveLoding.value = false;
        //   return;
        // } else {
        //   if (!params.infoList[i].fieldSource) {
        //     messageAlert("error", "请填写完整参数字段");
        //     saveLoding.value = false;
        //     return;
        //   }
        // }
        Array.isArray(params.infoList[i].fieldSource) &&
          (params.infoList[i].fieldSource = params.infoList[i].fieldSource.join(
            ","
          ));
      }
      if (collectlist.value.length > 0) {
        collectlist.value.forEach((ele) => {
          ele.fieldSource = ele.fieldSource && ele.fieldSource.join(",");
        });
      }

      params.infoList.forEach((element) => {
        collectlist.value.forEach((item) => {
          if (item.id === element.id) {
            element.masterList[0].fieldSource = element.fieldSource;
            element.masterList[1].fieldSource = item.fieldSource;
          }
        });
      });

      const res = await saveModelKeys(params);
      saveLoding.value = false;
      if (res.code == 200) {
        messageAlert("success", "设置成功");
        closeDialog();
      }
    }

    /**
     * 重置表单
     */
    function resetFields() {
      formModel.value = {};
    }

    /**
     * 获取字段属性配置
     */
    function getFieldProps(item) {
      const props = {
        lazy: true,
        lazyLoad: async (node, resolve) => {
          const { level, value } = node;
          if (level === 0) {
            const nodes = parent.appList.value.map((m) => {
              return {
                label: m.name,
                value: m.id,
                leaf: level >= 3,
              };
            });
            resolve(nodes);
          } else if (level === 1) {
            // 加载模块
            // ;
            const res = await getModelByApp({ appId: value });
            if (res.code == 200) {
              const nodes = res.data.map((m) => {
                return {
                  label: m.modelName,
                  value: m.id,
                  leaf: level >= 3,
                };
              });
              resolve(nodes);
            }
          } else if (level === 2) {
            // 加载页面
            const res = await getPageByModel({ modelId: value });
            if (res.code == 200) {
              const nodes = res.data.map((m) => {
                return {
                  label: m.pageName,
                  value: m.id,
                  leaf: level >= 3,
                };
              });
              resolve(nodes);
            }
          } else {
            // 加载字段
            const res = await getFieldWithType({
              infoId: item?.id,
              pageId: value,
            });
            if (res.code == 200) {
              const nodes = res.data.map((m) => {
                return {
                  label: `${m.fieldRemark}(${m.fieldName})`,
                  value: m.fieldName,
                  leaf: level >= 3,
                };
              });
              resolve(nodes);
            }
          }
        },
      };
      return props;
    }

    return {
      formModel,
      formRules,
      collectlist,
      saveLoding,
      formRef,
      closeDialog,
      onSubmitForm,
      getFieldProps,
    };
  },
});
</script>

<style lang="scss" scoped>
.top-params {
  font-size: 16px;
  font-weight: bold;
  p {
    margin-bottom: 18px;
    font-size: 16px;
    font-weight: normal;
  }
}
.line {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid #bbb;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
  > div:first-child {
    width: 300px;
  }
  > div:last-child {
    flex: 1;
  }
}
.field-wrap {
  display: flex;
  justify-content: space-between;
  margin-left: 50px;
}
</style>

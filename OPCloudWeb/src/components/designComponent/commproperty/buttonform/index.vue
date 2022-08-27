<!-- 表单属性配置 — 按钮配置 -->
<template>
  <div class="divider-wrap">添加按钮</div>
  <template v-if="formConf?.buttonList.length > 0">
    <div class="setting-item" v-for="(ele, i) in formConf?.buttonList" :key="i">
      <span class="close-btn close-btn-form" @click="formConf?.buttonList.splice(i, 1)">
        <i class="el-icon-remove-outline" />
      </span>
      <el-tabs v-model="activeTab" type="border-card">
        <el-tab-pane label="外观" name="style">
          <el-form-item label="样式" label-width="80px">
            <text-button v-bind="ele">{{ ele.title }}</text-button>
          </el-form-item>
          <el-form-item label="类型" label-width="80px">
            <el-select v-model="ele.type" placeholder="请选择按钮类型">
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="标题" label-width="80px">
            <el-input v-model="ele.title" placeholder="设置标题" clearable style="width:100%"></el-input>
          </el-form-item>
          <div class="divider-wrap">移动端样式</div>
          <el-row class="mobilebtn">
            <el-col :span="12">
              <el-form-item label="表格显示" label-width="80px">
                <el-switch v-model="ele.isInTable" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="表单显示" label-width="80px">
                <el-switch v-model="ele.isInForm" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="行为" name="behavior">
          <el-row>
            <el-col :span="12">
              <el-form-item label="关闭页面" label-width="80px">
                <el-switch v-model="ele.closeable" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="更新字段" label-width="80px">
                <el-switch v-model="ele.fieldValueChange" @change="fieldVauleChange(ele)" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item v-if="ele.fieldValueChange" :label-width="0">
            <div class="item-grid" v-for="(fitem, index) in ele.fieldValueChangeList" :key="index">
              <el-select
                v-model="fitem.field"
                filterable
                clearable
                placeholder="源字段"
                style="width:100%;"
              >
                <el-option
                  v-for="item in masterComponent"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <div class="item-oper-wrap">
                <el-input v-model="fitem.value" placeholder="值" clearable></el-input>
                <el-button icon="el-icon-circle-plus-outline" type="text" @click="addFVCFiled(i)" />
                <el-button
                  icon="el-icon-remove-outline"
                  v-if="ele.fieldValueChangeList.length > 1"
                  type="text"
                  @click="removeFVCFiled(i, index)"
                  style="margin-left:3px;"
                />
              </div>
            </div>
          </el-form-item>
          <el-form-item label="模型" label-width="80px">
            <el-select v-model="ele.functionModel" filterable clearable>
              <el-option
                :value="item.id"
                :label="item.modelName"
                v-for="(item, index) in property.propertySetting.functionModelList"
                :key="index"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="事件设置" label-width="80px">
            <el-select v-model="ele.eventCode" placeholder="请选择按钮名称">
              <el-option
                v-for="(item, index) in eventNameList"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="显示方式" label-width="80px">
            <el-select v-model="ele.showCondition" placeholder="请选择显示方式">
              <el-option label="常显示" value="always"></el-option>
              <el-option label="按模型" value="byModule"></el-option>
              <el-option label="按条件" value="byCondition"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label-width="0" v-if="ele.showCondition == 'byCondition'">
            <div class="item-filter-grid">
              <el-select v-model="ele.conditionName" placeholder="主表字段">
                <el-option
                  v-for="item in masterComponent"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-select v-model="ele.conditionCompare" placeholder="比较">
                <el-option
                  v-for="(item,index) in regTypeList"
                  :key="index"
                  :value="item.value"
                  :label="item.lable"
                />
              </el-select>
              <el-input v-model="ele.conditionValue" placeholder="值" clearable></el-input>
            </div>
          </el-form-item>

          <el-form-item label="目标页面" prop="tableId" label-width="80px">
            <el-cascader
              v-model="ele.copyPageId"
              ref="cascaderRef"
              :props="cascaderProps"
              @change="onFtableChange(ele.copyPageId, i)"
              separator="-"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item v-if="ele.copyPageId" :label-width="0">
            <div class="item-grid" v-for="(item, index) in ele.dataCopyFieldList" :key="index">
              <el-select
                v-model="item.sourceFieldId"
                filterable
                clearable
                placeholder="源字段"
                style="width:100%;"
              >
                <el-option
                  v-for="item in masterComponent"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
              <div class="item-oper-wrap">
                <el-select v-model="item.targetFieldId" filterable clearable placeholder="源字段">
                  <el-option
                    v-for="item in tableFieldList[i]"
                    :key="item.fieldCode"
                    :value="item.fieldCode"
                    :label="item.fieldRemark"
                  ></el-option>
                </el-select>
                <el-button icon="el-icon-circle-plus-outline" type="text" @click="addFiled(i)" />
                <el-button
                  icon="el-icon-remove-outline"
                  v-if="ele.dataCopyFieldList.length > 1"
                  type="text"
                  @click="removeFiled(i, index)"
                />
              </div>
            </div>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </div>
  </template>
  <div style="margin-left: 20px">
    <el-button icon="el-icon-circle-plus-outline" type="text" @click="addButton">添加按钮</el-button>
  </div>
</template>

<script lang="ts">
import { ref, computed, PropType, inject } from "vue";
import { getBtnEventList, getfieldsByTableId } from "@/api/homeApi";
import { useDesign } from "@/use/useDesign";
import { TabTableComponent } from "@/components/designComponent/trade/tabTable/IConfig";
import { getModelByApp, getPageByModel } from '@/api/userApi';

export default {
  name: "PropertyButtonform",
  props: {
    formConf: Object,
    componentCfg: Object as PropType<TabTableComponent>,
  },
  setup(props) {

    /**property  inject*/
    const property = inject('property');

    const { currentComponentList } = useDesign();

    const activeTab = ref<string>('style');

    // 按钮类型列表
    const typeList = ref<any>([
      {
        label: "主要按钮",
        value: "primary",
      },
      {
        label: "成功按钮",
        value: "success",
      },
      {
        label: "警告按钮",
        value: "warning",
      },
      {
        label: "危险按钮",
        value: "error",
      },
      {
        label: "信息按钮",
        value: "info",
      },
    ]);

    // 按钮名称列表
    const titleList = ref<any>([
      {
        label: "名称",
        value: "title1",
      },
    ]);

    // 按钮事件列表
    const eventNameList = ref<any>([]);

    const tableFieldList = ref<any[]>([]);

    const cascaderProps = computed(() => {
      const props = {
        lazy: true,
        lazyLoad: cascaderLazyLoad
      };
      return props;
    });

    const masterComponent = computed(() => {
      const propList: any = [];
      const componentList = currentComponentList.value;
      componentList &&
        componentList.forEach((item) => {
          if (item.componentId != props.componentCfg?.componentId) {
            propList.push({
              label: item.__form__?.label,
              value: item.__vModel__,
            });
          }
        });
      return propList;
    });

    const regTypeList = [
      { value: "==", lable: "等于" },
      { value: ">", lable: "大于" },
      { value: "<", lable: "小于" },
      { value: ">=", lable: "大于等于" },
      { value: "<=", lable: "小于等于" },
      { value: "!=", lable: "不等于" },
    ];

    function fieldVauleChange(obj: any) {
      if (!obj.fieldValueChangeList) {
        obj.fieldValueChangeList = [{
          field: "",
          value: "",
        }];
      }
    }

    // 获取事件列表
    function getEventList() {
      getBtnEventList().then((res) => {
        if (res.code == 200) {
          eventNameList.value = res.data;
        }
      });
    }
    getEventList();

    /**
     * 添加按钮
     */

    const addButton = () => {
      if (props.formConf?.buttonList) {
        props.formConf.buttonList.push({
          type: "primary",
          size: "",
          title: "",
          eventCode: "",
          isInForm: true,
          isInTable: true,
          dataCopyFieldList: [{
            sourceFieldId: "",
            targetFieldId: "",
          }],
          fieldValueChangeList: [{
            field: "",
            value: "",
          }],
          showCondition: "always",
          closeable: true,
        });
      }
    };

    const addFiled = (i) => {
      if (props.formConf?.buttonList[i].dataCopyFieldList) {
        props.formConf?.buttonList[i].dataCopyFieldList.push(
          {
            sourceFieldId: "",
            targetFieldId: "",
          }
        );
      }
    };

    const removeFiled = (i, index) => {
      if (props.formConf?.buttonList[i].dataCopyFieldList) {
        props.formConf?.buttonList[i].dataCopyFieldList.splice(index, 1);
      }
    };

    const addFVCFiled = (i) => {
      if (props.formConf?.buttonList[i].fieldValueChangeList) {
        props.formConf?.buttonList[i].fieldValueChangeList.push(
          {
            field: "",
            value: "",
          }
        );
      }
    };

    const removeFVCFiled = (i, index) => {
      if (props.formConf?.buttonList[i].fieldValueChangeList) {
        props.formConf?.buttonList[i].fieldValueChangeList.splice(index, 1);
      }
    };

    const { appList } = useDesign()
    async function cascaderLazyLoad(node, resolve) {
      const { level, value } = node;
      if (level === 0) {
        const nodes = appList.value && appList.value.map((m) => {
          return {
            label: m.appName,
            value: m.id,
            leaf: level >= 2,
          };
        });
        resolve(nodes);
      } else if (level === 1) {
        // 加载模块
        const res = await getModelByApp({ appId: value });
        if (res.code == 200) {
          const nodes = res.data.map((m) => {
            return {
              label: m.modelName,
              value: m.id,
              leaf: level >= 2,
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
              name: m.pageTableName,
              leaf: level >= 2,
            };
          });
          resolve(nodes);
        }
      }
    }

    async function onFtableChange(val: string[], i) {
      if (val == null) return;
      const res = await getfieldsByTableId({ tableId: val[2] });
      if (res.code === 200) {
        tableFieldList.value[i] = res.data;
      }
    }

    async function initCopyPageId() {
      if (props.formConf?.buttonList && props.formConf?.buttonList.length > 0) {
        for (var i = 0; i < props.formConf?.buttonList.length; i++) {
          if (!props.formConf?.buttonList[i].copyPageId) {
            return;
          }
          let val: string[] = props.formConf?.buttonList[i].copyPageId[2];
          let para = {
            tableId: val,
          };
          const res = await getfieldsByTableId(para);
          if (res.code === 200) {
            tableFieldList.value.push(res.data);
          }
        }
      }
    }
    initCopyPageId();

    return {
      activeTab,
      property,
      titleList,
      typeList,
      eventNameList,
      getEventList,
      addButton,
      addFiled,
      removeFiled,
      addFVCFiled,
      removeFVCFiled,
      masterComponent,
      regTypeList,
      cascaderProps,
      onFtableChange,
      tableFieldList,
      fieldVauleChange,
    };
  },
};
</script>

<style lang="scss" scoped>
.setting-item {
  padding: 0 !important;
}
.item-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr 1fr;
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}
.item-oper-wrap {
  display: flex;
}
.item-filter-grid {
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 0.7fr 1fr;
}
</style>

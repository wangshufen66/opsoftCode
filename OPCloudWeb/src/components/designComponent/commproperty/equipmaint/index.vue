<!-- 表单属性配置 — 设备维保 -->
<template>
  <div class="divider-wrap">设备维保</div>
  <!-- <el-form-item label="周期方案">
    <el-select v-model="formConf.equipMaintForm.cyclePlan">
      <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item> -->
  <el-form-item label="周期方案">
    <el-select v-model="formConf.equipMaintForm.cycleType">
      <el-option v-for="item in cycleTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="周期单位">
    <el-select v-model="formConf.equipMaintForm.cycleUnit">
      <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="保养周期">
    <el-select v-model="formConf.equipMaintForm.cycleValue">
      <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="最近一次工单">
    <el-select v-model="formConf.equipMaintForm.lastWorkOrderTime">
      <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="最近一次保养">
    <el-select v-model="formConf.equipMaintForm.lastMaintenanceTime">
      <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="下一次保养">
    <el-select v-model="formConf.equipMaintForm.nextMaintenanceTime">
      <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
    </el-select>
  </el-form-item>

  

  <div class="el-form-item el-form-item--small">
    <div class="el-input el-input--small el-input--suffix">
      <el-form-item label="目标页面" prop="tableId" style="margin-bottom:5px;">
              <el-cascader
                v-model="formConf.equipMaintForm.copyPageId"
                ref="cascaderRef"
                :props="cascaderProps"
                @change="onFtableChange(formConf.equipMaintForm.copyPageId, 0)"
                separator="-"
                clearable
              ></el-cascader>
            </el-form-item>
      <div v-if="formConf.equipMaintForm.copyPageId">
        <el-row v-for="(item, index) in formConf.equipMaintForm.dataCopyFieldList" :key="index" style="margin-left:15px;">
          <el-select v-model="item.sourceFieldId" filterable clearable placeholder="源字段" style="width:120px;margin-left:25px;">
            <el-option v-for="item in masterComponent" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
          <el-select v-model="item.targetFieldId" filterable clearable placeholder="源字段" style="width:120px;margin-left:10px;">
            <el-option v-for="item in tableFieldList" :key="item.fieldCode" :value="item.fieldCode" :label="item.fieldRemark"></el-option>
          </el-select>
          <el-button icon="el-icon-circle-plus-outline" type="text" @click="addFiled()" style="margin-left:5px;"/>
          <el-button icon="el-icon-remove-outline" v-if="formConf.equipMaintForm.dataCopyFieldList.length > 1" type="text" @click="removeFiled(index)" style="margin-left:5px;"/>
        </el-row>

        <el-form-item label="监听状态">
        <el-select v-model="formConf.equipMaintForm.targetStatusField" filterable clearable placeholder="源字段">
          <el-option v-for="item in tableFieldList" :key="item.fieldCode" :value="item.fieldCode" :label="item.fieldRemark"></el-option>
        </el-select>
      </el-form-item>
      </div>

      
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, PropType } from "vue";
import { TabTableComponent } from "@/components/designComponent/trade/tabTable/IConfig";
import { useDesign } from "@/use/useDesign";
import { getModelByApp, getPageByModel } from '@/api/userApi';
import { getfieldsByTableId } from "@/api/homeApi";

export default {
  name: "PropertyEquipmaint",
  props: {
    formConf: Object,
    componentCfg: Object as PropType<TabTableComponent>,
  },
  setup(props) {
    const formConf = computed(() => {
      return props.formConf;
    });
    const cycleTypeList = ref<any>([
      {
        label: "最近一次工单时间",
        value: 1,
      },
      {
        label: "最近一次保养时间",
        value: 2,
      },
    ]);
    const { currentComponentList } = useDesign();
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

    const cascaderProps = computed(() => {
      const props = {
        lazy: true,
        lazyLoad: cascaderLazyLoad
      };
      return props;
    });

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

    const tableFieldList = ref<any>();
    async function onFtableChange(val:string[], i) {
      if(val == null){
        return;
      }
      let para = {
        tableId: val[2],
      };

      const res = await getfieldsByTableId(para);
      if (res.code === 200) {
        tableFieldList.value = res.data;
        if(props.formConf && !props.formConf?.equipMaintForm.dataCopyFieldList){
          props.formConf.equipMaintForm.dataCopyFieldList = [];
          props.formConf.equipMaintForm.dataCopyFieldList.push({
            sourceFieldId: "",
            targetFieldId: "",
          });
          console.log(props.formConf?.equipMaintForm.dataCopyFieldList);
        }
      }
    }

    const addFiled = () =>{
      if (props.formConf?.equipMaintForm.dataCopyFieldList){
        props.formConf.equipMaintForm.dataCopyFieldList.push(
          {
            sourceFieldId: "",
            targetFieldId: "",
          }
        );
      }
    };

    const removeFiled = (index) =>{
      if (props.formConf?.equipMaintForm.dataCopyFieldList){
        props.formConf.equipMaintForm.dataCopyFieldList.splice(index, 1);
      }
    };

    async function initPageId(){
      if(props.formConf?.equipMaintForm && props.formConf?.equipMaintForm.copyPageId.length > 0){
        let val:string[] = props.formConf?.equipMaintForm.copyPageId[2];
        let para = {
          tableId: val,
        };
        const res = await getfieldsByTableId(para);
        if (res.code === 200) {
          tableFieldList.value = res.data;
        }
      }
    }
    initPageId();
    
    
    return {
      masterComponent,
      cascaderProps,
      onFtableChange,
      tableFieldList,
      addFiled,
      removeFiled,
      cycleTypeList,
    };
  },
};
</script>

<style></style>

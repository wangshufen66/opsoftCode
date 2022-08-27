<template>
  <div class="property-panel">
    <div class="node-title" v-show="haveData">{{ nodeName }}</div>
    <el-form class="form" ref="formRef" :model="formData" v-show="haveData" :rules="rules" label-width="80px">
      <el-collapse class="bpmn-tool" v-model="activeName">
        <el-collapse-item name="1">
          <template #title>
            <span class="el_title">
              基本设置
              <i class="header-icon el-icon-info" />
            </span>
          </template>
          <el-form-item :label="isProcess ? '模型key' : '节点ID'" prop="id">
            <el-input v-model="formData.id" @blur="onInputBlur('id', false)" />
          </el-form-item>
          <el-form-item :label="isProcess ? '模型名称' : '节点名称'" prop="name">
            <el-input v-model="formData.name" @blur="onInputBlur('name', false)" />
          </el-form-item>
          <el-form-item :label="isProcess ? '模型描述' : '描述'" prop="documentation">
            <el-input v-model="formData.documentation" @blur="onInputBlur('documentation', false)" :rows="3" type="textarea" />
          </el-form-item>
          <el-form-item v-show="showConfig?.processCategory" label="模型分类" prop="processCategory">
            <el-select v-model="formData.processCategory" @change="onInputBlur('processCategory')" clearable>
              <el-option v-for="item in select.processCategory" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showConfig?.taskCategory" label="任务分类" prop="taskCategory">
            <el-select v-model="formData.category" @change="onInputBlur('category', true)" clearable>
              <el-option v-for="item in select.taskCategory" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showConfig?.conditionExpression" label="流转条件" prop="conditionExpression">
            <el-input v-model="formData.conditionExpression" @change="onInputBlur('conditionExpression', true)" />
          </el-form-item>
          <el-form-item v-show="showConfig?.async" label="异步" prop="async">
            <el-switch v-model="formData.async" @change="onInputBlur('async', true)"></el-switch>
          </el-form-item>
          <el-form-item v-show="showConfig?.multiInstance" label="多实例">
            <el-badge :is-dot="hasMultiInstance">
              <el-button @click="onOpenDraw('more')">编辑</el-button>
            </el-badge>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item v-if="showConfig?.scriptConfig" name="2">
          <template #title>
            <span class="el_title">
              脚本配置
              <i class="header-icon el-icon-info" />
            </span>
          </template>
          <el-form-item v-show="showConfig?.scriptType" label="脚本类型">
            <el-select v-model="formData.scriptFormat" filterable @change="onInputBlur('scriptFormat', false)">
              <el-option v-for="item in select.flowableScriptType" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showConfig?.scriptContent" label="脚本内容">
            <el-input v-model="formData.script" @blur="onInputBlur('script', false)" :rows="3" type="textarea" />
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item v-if="showConfig?.candidate" name="3">
          <template #title>
            <span class="el_title">
              候选配置
              <i class="header-icon el-icon-info" />
            </span>
          </template>
          <el-form-item v-show="showConfig?.candidateStarterUsers" label="可发起者">
            <el-input v-model="formData.candidateStarterUsers" @blur="onInputBlur('candidateStarterUsers', true)" />
          </el-form-item>
          <el-form-item v-show="showConfig?.candidateStarterGroups" label="可发起组">
            <el-input v-model="formData.candidateStarterGroups" @blur="onInputBlur('candidateStarterGroups', true)" />
          </el-form-item>
          <el-form-item v-show="showConfig?.initiator" label="创建者" prop="initiator">
            <el-input v-model="formData.initiator" @blur="onInputBlur('initiator', true)" />
          </el-form-item>
          <el-form-item v-show="showConfig?.assignee" label="执行人">
            <el-select v-model="formData.assignee" ref="assigneeRef" filterable @change="onInputBlur('assignee', true)">
              <el-option v-for="item in select.assignee" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showConfig?.candidateUsers" label="候选用户">
            <el-select v-model="formData.candidateUsers" ref="candidateUsersRef" multiple filterable @change="onInputBlur('candidateUsers', true)">
              <el-option v-for="item in select.candidateUsers" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-show="showConfig?.candidateGroups" label="候选组">
            <el-select v-model="formData.candidateGroups" ref="candidateGroupsRef" multiple filterable @change="onInputBlur('candidateGroups', true)">
              <el-option v-for="item in select.candidateGroups" :label="item.label" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item v-if="showConfig?.form" name="4">
          <template #title>
            <span class="el_title">
              表单配置
              <i class="header-icon el-icon-info" />
            </span>
          </template>
          <el-form-item v-show="showConfig?.formKey" label="表单Key">
            <el-cascader :options="select.formKey" filterable v-model="formData.formKey" @change="onInputBlur('formKey', true)" clearable ref="formKeyRef"></el-cascader>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item v-if="showConfig?.buttons" name="5">
          <template #title>
            <span class="el_title">
              按钮配置
              <i class="header-icon el-icon-info" />
            </span>
          </template>
          <div class="btn-table">
            <el-table :data="formData.buttonsData" stripe>
              <el-table-column prop="value" label="按钮类型" min-width="80">
                <template #default="scope">
                  <span>{{ itemType(scope.row.value) }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="nameSpace" label="显示名称" min-width="80"></el-table-column>
            </el-table>
            <el-button class="button-add" @click="editBtn">编辑</el-button>
          </div>
        </el-collapse-item>
        <el-collapse-item name="6">
          <template #title>
            <span class="el_title">
              监听器
              <i class="header-icon el-icon-info" />
            </span>
          </template>
          <el-form-item label="执行监听">
            <el-badge :value="executionListenerLength" v-show="formData.$type !== 'bpmn:ServiceTask'">
              <el-button @click="onOpenDraw('Execution')">编辑</el-button>
            </el-badge>
            <el-badge :is-dot="havaDot" v-show="formData.$type === 'bpmn:ServiceTask'">
              <el-button @click="onOpenDraw('Execution')">编辑</el-button>
            </el-badge>
          </el-form-item>
          <el-form-item v-show="showConfig?.taskListener" label="任务监听">
            <el-badge :value="taskListenerLength">
              <el-button @click="onOpenDraw('Task')">编辑</el-button>
            </el-badge>
          </el-form-item>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <component ref="listenComponent" :is="getComponent" :type="listenerType" :title="listenerTitle" :show="showListener" :nodeType="formData.$type" @closeDraw="onDrawClosed" @upListenerLen="upListenerLen" />
    <extendBtn :show="showButton" @closeDraw="onButtDrawClosed" @refreshButtonList="refreshButtonList"></extendBtn>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, reactive, toRefs, inject, ref } from "vue";
import useBpmnFunc from "@/use/useBpmnFunc";
import listener from "./listener.vue";
import { NodeName } from "@/components/bpmn/zh-cn";
import config from "@/components/bpmn/showConfig";
import { getProcessType, getFormKey, getExecUser } from "@/api/flowable";
import more from "./more.vue";
import extendBtn from "./extendBtn.vue";
import { form } from "@/interfaces/flowableConfig";
import { useStore } from "vuex";

export default defineComponent({
  name: "toolnode",
  props: {
    descriptor: {
      type: String,
      default: "flowable",
    },
  },
  components: {
    listener,
    more,
    extendBtn,
  },
  setup(props) {
    const bpmn: any = inject("flow-modeler");
    bpmn.eventCallBack = function (el) {
      loadData(el);
      form.activeName = "1";
    };
    const store = useStore();
    const btnRules = reactive({
      name: [{ required: true, message: "该项不能为空", trigger: "blur" }],
      nameSpace: [{ required: true, message: "该项不能为空", trigger: "blur" }],
      value: [{ required: true, message: "该项不能为空", trigger: "blur" }],
    });
    const showButton = ref<boolean>(false);

    //级联组件ref
    const formKeyRef = ref<any>(null);
    //select组件Ref
    const assigneeRef = ref<any>(null);

    const candidateUsersRef = ref<any>(null);

    const candidateGroupsRef = ref<any>(null);

    const {
      updateProperties,
      updateProperty,
      getDocumentation,
      descriptorPrefix,
    } = useBpmnFunc(bpmn, props.descriptor);
    //id验证规则
    const validateKey = (rule, value, callback) => {
      let idReg = /^[a-z_][\w-.]{1,50}$/i;
      if (!idReg.test(value)) {
        callback(
          new Error(
            "只能输入数字、字母、下划线且不能以数字开头且长度不能超过50"
          )
        );
      }
      callback();
    };
    //名字验证规则
    const validateName = (rule, value, callback) => {
      let nameReg = isProcess.value
        ? /^[\u4E00-\u9FA5\w]{1,50}$/i
        : /^[\u4E00-\u9FA5\w]{0,50}$/i;
      if (!nameReg.test(value)) {
        callback(
          new Error(
            `只能输入数字、字母、下划线和中文字符,长度不能超过50${
              isProcess.value ? "且不能为空" : ""
            }`
          )
        );
      }
      callback();
    };
    //下拉列表参数翻译
    function itemType(type: string) {
      switch (type) {
        case "approve":
          return "完成";
        case "reject":
          return "退回";
        case "save":
          return "保存";
      }
    }
    //点击按钮编辑
    function editBtn() {
      showButton.value = true;
    }

    //刷新按钮列表
    function refreshButtonList(row) {
      form.formData.buttonsData = row;
    }

    //按钮设置抽屉关闭
    function onButtDrawClosed() {
      showButton.value = false;
    }

    //描述验证规则
    const validateDocumentation = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5\w]{0,50}$/i;
      if (!nameReg.test(value)) {
        callback(
          new Error("只能输入数字、字母、下划线和中文字符且长度不能超过50")
        );
      }
      callback();
    };
    //菜单数据和规则
    const form = reactive<form>({
      activeName: "1",
      haveData: false,
      formData: {
        // buttonsData: [],
      },
      rules: {
        id: [
          { required: true, message: "该项不能为空", trigger: "change" },
          { validator: validateKey, trigger: "blur" },
        ],
        name: [
          { required: true, message: "该项不能为空", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
        ],
        documentation: [{ validator: validateDocumentation, trigger: "blur" }],
      },
    });
    //表单ref
    const formRef = ref<any>(null);

    //监听器相关参数
    const listener = reactive({
      listenerType: "",
      //显示隐藏
      showListener: false,
      //执行监听配置条数
      executionListenerLength: 0,
      //任务监听配置条数
      taskListenerLength: 0,
      //有无服务任务红点
      havaDot: false,
      //是否配置实例
      hasMultiInstance: false,
    });

    //表单下拉数据
    const select = reactive({
      //模型分类
      processCategory: [],
      //任务分类
      taskCategory: [],
      //脚本类型
      flowableScriptType: [],
      //表单Key
      formKey: [],
      //执行人
      assignee: [],
      //候选用户
      candidateUsers: [],
      //候选组
      candidateGroups: [],
    });
    //工具栏数据请求
    getProcessType({
      codeTypeIds: "processCategory,taskCategory,flowableScriptType",
    }).then((res) => {
      if (res.code === 200) {
        select.processCategory = res.data.processCategory.map((item) => ({
          value: item.value,
          label: item.content,
        }));
        select.taskCategory = res.data.taskCategory.map((item) => ({
          value: item.value,
          label: item.content,
        }));
        select.flowableScriptType = res.data.flowableScriptType.map((item) => ({
          value: item.value,
          label: item.content,
        }));
      }
    });
    getExecUser({ auditstatus: 1 }).then((res) => {
      if (res.code === 200) {
        select.assignee = res.data.userIds;
        select.candidateUsers = res.data.userIds;
        select.candidateGroups = res.data.roleIds;
      }
    });
    //表单配置下拉
    getFormKey({ isActive: 0 }).then((res) => {
      if (res.code === 200) {
        select.formKey = res.data;
      }
    });

    //监听器标题
    const listenerTitle = computed(() => {
      switch (listener.listenerType) {
        case "Execution":
          return "执行监听";
        case "Task":
          return "任务监听";
        case "more":
          return "多实例";
      }
    });

    //获取结点的名字
    const nodeName = computed(() => {
      return NodeName[form.formData?.$type] || form.formData?.$type;
    });

    //判断是否为模型结点
    const isProcess = computed(() => {
      let type = form.formData.$type ? form.formData.$type : "",
        flag = type === "bpmn:Process";
      //是否流程线
      let lineFlag = type === "bpmn:SequenceFlow";
      if (!lineFlag) {
        form.rules.name = [
          { required: true, message: "该项不能为空", trigger: "blur" },
          { validator: validateName, trigger: "blur" },
        ];
      } else {
        form.rules.name = [{ validator: validateName, trigger: "blur" }];
      }
      return flag;
    });
    //页面配置参数
    const showConfig = computed(() => {
      return config[form.formData?.$type] || {};
    });
    //计算渲染的组件
    const getComponent = computed(() => {
      switch (listener.listenerType) {
        case "Task":
        case "Execution":
          return "listener";
        case "more":
          return "more";
      }
    });
    bpmn.beforeCallBack = () => {
      //级联组件关闭下拉
      if (formKeyRef.value) {
        formKeyRef.value.popperVisible = false;
      }
      //select组件关闭下拉
      selectBlur(assigneeRef);
      selectBlur(candidateUsersRef);
      selectBlur(candidateGroupsRef);
      let v = true;
      formRef.value.validate((val) => {
        v = val;
      });
      return v;
    };

    function selectBlur(el) {
      if (el.value) {
        el.value.blur();
      }
    }

    //当输入框失去焦点时触发
    function onInputBlur(el, hasDescript) {
      store.commit("flowable/setEditStatus", true);
      let val: string = form.formData[el];
      //当输入的是id 并且为空时
      if (el === "id") {
        let reg = /^[a-z_][\w-.]+$/i;
        if (!reg.test(form.formData[el])) return;
      }
      if (el === "name") {
        let reg = isProcess.value
          ? /^[\u4E00-\u9FA5\w]{1,50}$/i
          : /^[\u4E00-\u9FA5\w]{0,50}$/i;
        if (!reg.test(form.formData[el])) return;
      }
      //输入描述时
      if (el === "documentation") {
        let reg = /^[\u4E00-\u9FA5\w]{0,50}$/i;
        if (!reg.test(val)) return;
        if (val) {
          const documentation = bpmn.modeler
            .get("moddle")
            .create("bpmn:Documentation", {
              text: val,
            });
          const newObjectList: any[] = [];
          documentation && newObjectList.push(documentation);
          updateProperties({
            documentation: newObjectList,
          });
        } else {
          updateProperties({
            documentation: undefined,
          });
        }
        return;
      }
      //选择候选人或者候选组时
      if (el === "candidateUsers" || el === "candidateGroups") {
        val = val.toString();
      }
      //填写流转条件时
      if (el === "conditionExpression") {
        if (val) {
          const newCondition = bpmn.modeler
            .get("moddle")
            .create("bpmn:FormalExpression", { body: val });
          updateProperties({ conditionExpression: newCondition });
        } else {
          updateProperties({ conditionExpression: null });
        }
        return;
      }
      //修改模型分类时
      if (el === "processCategory") {
        bpmn.operElement.businessObject.$parent.targetNamespace = val;
        return;
      }
      updateProperty(el, val, hasDescript);
    }
    //关闭抽屉
    function onDrawClosed() {
      listener.showListener = false;
      listener.listenerType = "";
    }
    //打开抽屉
    function onOpenDraw(type) {
      listener.showListener = true;
      listener.listenerType = type;
    }
    //监听器点击确定后更新页面数字
    function upListenerLen(value, isService) {
      switch (listener.listenerType) {
        case "more":
          break;
        case "Execution":
          if (isService) {
            listener.havaDot = value;
          } else {
            listener.executionListenerLength = value;
          }
          break;
        case "Task":
          listener.taskListenerLength = value;
          break;
      }
    }
    //获取特殊对象名的值
    function getValue(data: object, str: string): string {
      let key = `${descriptorPrefix.value}${str}`;
      if (!data[key]) return "";
      if (str === "assignee") {
        return data[key];
      }
      return data[key].split(",");
    }
    //获取监听器长度
    function getData(data: object, str: string, type?: string): number {
      let val = `${descriptorPrefix.value}${str}`;
      let tempArr = data.extensionElements?.values.filter(
        (item) => item.$type === val
      );
      if (type === "len") {
        return tempArr?.length ?? 0;
      } else {
        return tempArr ?? [];
      }
    }
    //加载数据
    function loadData(target: any) {
      if (!target) {
        form.haveData = false;
        return;
      }
      const data = {
        ...target.businessObject,
        ...target.businessObject.$attrs,
      };
      if (target.type === "bpmn:Process") {
        const targetNamespace = target.businessObject.$parent.targetNamespace;
        data.processCategory = targetNamespace;
      }
      data.assignee = getValue(data, "assignee");
      data.candidateUsers = getValue(data, "candidateUsers");
      if (data.candidateGroups) {
        data.candidateGroups = data.candidateGroups.split(",");
      }
      data.documentation = getDocumentation();
      // console.log('target', target.businessObject.conditionExpression);

      data.conditionExpression =
        target.businessObject.conditionExpression?.body;

      if (data.formKey) {
        data.formKey = data.formKey.toString().split(",");
      }
      if (data.class) {
        listener.havaDot = true;
      }
      form.formData = data;

      //页面监听器长度
      listener.executionListenerLength = getData(
        data,
        "ExecutionListener",
        "len"
      );
      listener.taskListenerLength = getData(data, "TaskListener", "len");
      form.haveData = true;
      // 设置处理按钮数据之前的flowElements数据
      let newlist = [] as any;

      if (data.flowElements && data.flowElements.length > 0) {
        for (let index = 0; index < data.flowElements.length; index++) {
          const ele = data.flowElements[index];
          if (ele["$type"] == "bpmn:UserTask") {
            newlist.push(ele);
          }
        }
      }
      form.formData.buttonsData = getData(data, "ButtonParam", "val");
    }
    return {
      ...toRefs(form),
      ...toRefs(listener),
      formKeyRef,
      assigneeRef,
      btnRules,
      showButton,
      itemType,
      select,
      formRef,
      isProcess,
      onInputBlur,
      showConfig,
      listenerTitle,
      onOpenDraw,
      nodeName,
      getComponent,
      onDrawClosed,
      upListenerLen,
      refreshButtonList,
      onButtDrawClosed,
      editBtn,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "@/styles/modules/workflow/tool.scss";
</style>

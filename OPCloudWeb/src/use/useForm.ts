import { reactive, computed, ComputedRef, getCurrentInstance } from "vue";
import { DesignComponent } from "@/components/designComponent";

/**
 * 表单Provide
 */
export type ModuleFormProvide = {
  /**表单组件 */
  formComponents: DesignComponent[];
};

/**表单呈现结构 */
export type FormDisplayStructure = {
  key: string | number;
  /**父节点 */
  parentNode: boolean;
  /**是否展开 */
  expand: boolean;
  componentList: DesignComponent[];
};

/**
 * 根据配置表单渲染
 * @export
 */
export function useForm(componentCfgList: DesignComponent[]) {
  // 表单数据结构
  const formModel = reactive({});
  // 表单验证配置
  const formRules = reactive({});

  const current = getCurrentInstance();

  /**
   * 表单验证初始化
   */
  function initFormRules() {
    const componentList: DesignComponent[] = componentCfgList;
    for (let i = 0; i < componentList.length; i++) {
      const component: DesignComponent = componentList[i];
      if (component.__form__) {
        const { required, label, regList = [] } = component.__form__;
        // 表单绑定属性存在，则添加验证规则
        if (component.__vModel__) {
          let propsRule: any[] = [];
          required &&
            propsRule.push({
              required: true,
              message: `${label}不能为空`,
            });
          const reglist = regList.map((r) => {
            return { pattern: new RegExp(r.pattern), message: r.message };
          });
          propsRule = [...reglist, ...propsRule];
          formRules[component.__vModel__] = propsRule;
        }
      }
      if (
        component.__config__.dataModel &&
        component.__config__.dataModel.length
      ) {
        if (formRules[component.__vModel__]) {
          formRules[component.__vModel__].push({
            pattern: /^(\d+|0)(.\d+)?$/g,
            message: "设置计算模型后,只能输入数值",
          });
        } else {
          formRules[component.__vModel__] = [
            {
              pattern: /^(\d+|0)(.\d+)?$/g,
              message: "设置计算模型后,只能输入数值",
            },
          ];
        }
      }
    }
  }

  /**
   * 添加组件校验规则
   * @param component
   * @return {*}
   */
  function addCompareRules() {
    const componentList: DesignComponent[] = componentCfgList;
    for (let i = 0; i < componentList.length; i++) {
      const component = componentList[i];
      const verifyComponent = component.__config__.verifyComponent;
      // 存在校验配置
      if (verifyComponent && verifyComponent.tag) {
        const compareComponent = componentList.find(
          (f) => f.componentId == verifyComponent.tag
        );
        if (!compareComponent) return;
        // 校验方法
        const validator = (rule, value, callback) => {
          const formData: any = current && current.props.formData;
          let message = "";
          let compareValue =
            formData[compareComponent.__vModel__] &&
            formData[compareComponent.__vModel__].valueOf();
          if (
            /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(
              compareValue
            )
          ) {
            compareValue = +new Date(compareValue);
          } else if (/^\d+(\.\d+)?$/g.test(compareValue)) {
            compareValue = Number(compareValue);
          }
          let componentValue = value && value.valueOf();
          if (
            /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/.test(
              componentValue
            )
          ) {
            componentValue = +new Date(componentValue);
          } else if (/^\d+(\.\d+)?$/g.test(compareValue)) {
            componentValue = Number(componentValue);
          }
          // 组件值
          const componentLabel = component.__form__?.label;
          const compareLabel = compareComponent.__form__?.label;
          let error = false;
          if (componentValue && compareValue) {
            switch (verifyComponent.type) {
              case "==":
                !(componentValue == compareValue) && (error = true);
                break;
              case ">":
                !(componentValue > compareValue) && (error = true);
                break;
              case ">=":
                !(componentValue >= compareValue) && (error = true);
                break;
              case "<":
                !(componentValue < compareValue) && (error = true);
                break;
              case "<=":
                !(componentValue <= compareValue) && (error = true);
                break;
              case "!=":
                !(componentValue != compareValue) && (error = true);
                break;
            }
            error &&
              (message = `${componentLabel}必须${verifyComponent.type}${compareLabel}的值`);
          }
          if (message) {
            callback(new Error(message));
          } else {
            callback();
          }
        };
        formRules[component.__vModel__].push({
          trigger: "blur",
          validator: validator,
          rulesType: "compare",
        });
      }
    }
  }
  /**
   * 删除组件校验规则
   * @param component
   * @return {*}
   */
  function removeCompareRules(component: any) {
    const vmodel = component.__vModel__;
    if (vmodel || !formRules[vmodel]) return;
    const index = formRules[vmodel].findIndex((f) => f.rulesType === "compare");
    index > -1 && formRules[vmodel].splice(index, 1);
  }

  return {
    formModel,
    formRules,
    initFormRules,
    addCompareRules,
    removeCompareRules,
  };
}

export function useFormDisplay(
  formConf: ComputedRef<any>,
  beforeClose: Function
) {
  type diaogAttr = {
    "before-close": Function;
    "destroy-on-close": boolean;
    width?: string;
    size?: string;
    direction?: string;
  };

  /** @type {*} 表单类型 */
  const formType = computed<string>(() => {
    const { dialogType } = formConf.value;
    return !dialogType
      ? "div"
      : dialogType === "dialog"
      ? "el-dialog"
      : dialogType === "div"
      ? "div"
      : "el-drawer";
  });

  /** @type {*} 弹窗属性 */
  const dialogAttr = computed<diaogAttr>(() => {
    const { width, direction } = formConf.value;

    const attr: diaogAttr = {
      "before-close": beforeClose,
      "destroy-on-close": true,
    };
    if (formType.value === "el-dialog") {
      attr.width = `${width}%`;
    } else if (formType.value === "el-drawer") {
      attr.size = `${width}%`;
      attr.direction = direction;
    }
    return attr;
  });

  function getDialogAttr(_props) {
    const attr: diaogAttr = {
      "before-close": beforeClose,
      "destroy-on-close": false,
    };
    if (formType.value === "el-dialog") {
      attr.width = `${_props.size}%`;
    } else if (formType.value === "el-drawer") {
      attr.size = `${_props.size}%`;
      attr.direction = _props.direction;
    }
    return attr;
  }

  return {
    formType,
    dialogAttr,
    getDialogAttr,
  };
}

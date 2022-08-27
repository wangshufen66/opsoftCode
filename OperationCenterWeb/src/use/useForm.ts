import { reactive, computed, ComputedRef } from 'vue';
import { DesignComponent } from '@/components/designComponent';

/**
 * 表单Provide
 */
 export type ModuleFormProvide = {
  /**表单组件 */
  formComponents: DesignComponent[];
};

/**
 * 根据配置表单渲染
 * @export
 */
export function useForm(componentCfgList: ComputedRef<DesignComponent[]>) {
  // 表单数据结构
  const formModel = reactive({});
  // 表单验证配置
  const formRules = reactive({});

  /**
   * 表单验证初始化
   */
  function initFormRules() {
    const componentList: DesignComponent[] = componentCfgList.value;
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
    }
  }

  /**
   * 添加组件校验规则
   * @param component
   * @return {*}
   */
  function addCompareRules(component: any,datafrom: any) {
    const vmodel = component.__vModel__;
    const verifyComponent=component.__config__.verifyComponent;
    const componentList: DesignComponent[] = componentCfgList.value;
    let otherComponent
    componentList.forEach((item)=>{
      if(item.componentId == verifyComponent.tag){
        otherComponent=item
      }
    })
    if(otherComponent!=null){
    formRules[otherComponent.__vModel__].push({
      validator: (rule, value, callback) => {
        switch(verifyComponent.type) {
          case '==':
            if(!(datafrom[vmodel]==value)){
              return callback(new Error('输入内容不满足:'+component.__form__.label+'等于'+otherComponent.__form__.label));
            }
             break;
          case '>':
            if(!(datafrom[vmodel]>value)){
              return callback(new Error('输入内容不满足:'+component.__form__.label+'大于'+otherComponent.__form__.label));
            }
             break;
          case '<':
              if(!(datafrom[vmodel]<value)){
                return callback(new Error('输入内容不满足:'+component.__form__.label+'小于'+otherComponent.__form__.label));
              }
             break;
          case '<=':
                if(!(datafrom[vmodel]<=value)){
                  return callback(new Error('输入内容不满足:'+component.__form__.label+'小于等于'+otherComponent.__form__.label));
                }
              break;
          case '>=':
                if(!(datafrom[vmodel]>=value)){
                  return callback(new Error('输入内容不满足:'+component.__form__.label+'大于等于'+otherComponent.__form__.label));
                }
              break;
          case '!=':
                if(!(datafrom[vmodel]!=value)){
                  return callback(new Error('输入内容不满足:'+component.__form__.label+'不等于'+otherComponent.__form__.label));
                }
              break;                  
     } 
      },
      trigger: 'blur',
      rulesType: 'compare',
    })
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
    const index = formRules[vmodel].findIndex((f) => f.rulesType === 'compare');
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
    'before-close': Function;
    'destroy-on-close': boolean;
    width?: string;
    size?: string;
    direction?: string;
  };

  /** @type {*} 表单类型 */
  const formType = computed<string>(() => {
    const { dialogType } = formConf.value;
    return !dialogType
      ? 'div'
      : dialogType === 'dialog'
      ? 'el-dialog'
      : dialogType === 'div'
      ? 'div'
      : 'el-drawer';
  });

  /** @type {*} 弹窗属性 */
  const dialogAttr = computed<diaogAttr>(() => {
    const { width, direction } = formConf.value;

    const attr: diaogAttr = {
      'before-close': beforeClose,
      'destroy-on-close': true,
    };
    if (formType.value === 'el-dialog') {
      attr.width = `${width}%`;
    } else if (formType.value === 'el-drawer') {
      attr.size = `${width}%`;
      attr.direction = direction;
    }
    return attr;
  });

  function getDialogAttr(_props) {
    const attr: diaogAttr = {
      'before-close': beforeClose,
      'destroy-on-close': false,
    };
    if (formType.value === 'el-dialog') {
      attr.width = `${_props.size}%`;
    } else if (formType.value === 'el-drawer') {
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

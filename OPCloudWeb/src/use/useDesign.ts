import {
  computed,
  reactive,
  ComputedRef,
  unref,
  getCurrentInstance,
} from "vue";
import { useStore } from "vuex";
import { DesignComponent } from "@/components/designComponent";
import { IFormConfig } from "./../interfaces/IFormConfig";
import defaultComponent from "./../config/component/default";
import { deepClone } from "@/utils/utils";
import {
  ComponentType,
  defaultComponentList,
  layoutComponentList,
  tradeComponentList,
} from "@/config/component/config";
import { dateTimeFormat } from "./useConst";

/**
 * 组件设计逻辑
 * @returns
 */
export function useDesign() {
  /**
   * 检测结果
   */
  type CheckResult = {
    // 状态
    status: boolean;
    // 错误信息
    message?: string;
  };

  const currentInstance = getCurrentInstance();

  const store = useStore();
  const state = reactive({});

  const pageId = computed<Array<string>>(() => {
    return store.state.design.page;
  });

  /**
   * 设计页面类型
   */
  const designType = computed(() => {
    return store.state.design.designType;
  });

  // 表单配置
  const formConf = computed<IFormConfig>(() => {
    return store.state.design.formConf;
  });

  // 当前设计组件
  const currentComponentList = computed<DesignComponent[]>(() => {
    return store.state.design.currentComponents;
  });
  /**
   * 默认正则校验规则
   */
  const defaultRegexList = computed<any[]>({
    get: () => {
      return store.state.design.defaultRegexList;
    },
    set: (value) => {
      store.commit("design/setDefaultRegexList", value);
    },
  });
  /**
   * 计算模型
   * @type {*}
   */
  const dataModelList = computed<any[]>({
    get: () => {
      return store.state.design.dataModelList;
    },
    set: (value) => {
      store.commit("design/setFunctionModel", value);
    },
  });
  /**
   * 应用列表
   */
  const appList = computed<any[]>({
    get: () => {
      return store.state.design.appList;
    },
    set: (value) => {
      store.commit("design/setAppList", value);
    },
  });

  /**
   * 组件校验
   * @type {*}
   */
  const componentValidation = computed<any[]>({
    get: () => {
      return store.state.design.componentValidation;
    },
    set: (value) => {
      store.commit("design/setComponentValidation", value);
    },
  });
  /**
   *
   * 初始化设计器组件
   */
  function initDesign() {
    const newdefaultComponent = deepClone(defaultComponent);
    const componentList = store.state.design.currentComponents;
    componentList.length == 0 && componentList.push(newdefaultComponent);
    //设置默认激活组件
    store.commit("design/setActiveComponent", componentList[0]);
  }

  /**
   * 统一配置检测
   * 后续放到各种组件中
   */
  function checkComponentCfg(): CheckResult {
    const components = unref(currentComponentList);
    const componentClass =
      currentInstance?.appContext.config.globalProperties.componentClass;
    for (let i = 0; i < components.length; i++) {
      const element = components[i];
      if (element.name) {
        const component = componentClass[element.name];
        if (component) {
          const verifyResult = new component(element).verifyConfig();
          if (verifyResult) {
            return {
              status: false,
              message: verifyResult,
            };
          }
        }
      }

      const itemReg: any = element.__form__?.regList;
      if (itemReg && itemReg.length > 0) {
        for (let j = 0; j < itemReg.length; j++) {
          const regObj = itemReg[j];
          if (regObj.internally === true) continue;
          if (regObj.pattern) {
            if (!regObj.message) {
              return {
                status: false,
                message: `请填写${element.__form__?.label}的正则验证错误提示消息`,
              };
            }
          }
        }
      }
      // 检测组件是否存在多个相同的计算模型
      const dataModel: any = element.__config__.dataModel;
      if (dataModel && dataModel.length > 0) {
        for (let i = 0; i < dataModel.length; i++) {
          const has = dataModel.find(
            (f) => f.type === dataModel[i].type && f.id !== dataModel[i].id
          );
          if (has) {
            return {
              status: false,
              message: `${element.__form__?.label}：不能存在多个相同的计算模型`,
            };
          }
        }
      }
      const verifyComponent: any = element.__config__.verifyComponent;
      if (verifyComponent && verifyComponent.tag) {
        if (!verifyComponent.type) {
          return {
            status: false,
            message: `${element.__form__?.label}：请选择校验类型`,
          };
        }
      }
      if (verifyComponent && verifyComponent.type) {
        if (!verifyComponent.tag) {
          return {
            status: false,
            message: `${element.__form__?.label}：请选择校验组件`,
          };
        }
      }
    }
    return { status: true };
  }

  return {
    pageId,
    designType,
    formConf,
    currentComponentList,
    defaultRegexList,
    dataModelList,
    currentProps: state,
    appList,
    initDesign,
    checkComponentCfg,
    componentValidation,
  };
}

/**
 * 当前激活组件逻辑
 * @param currentComponentList
 * @returns
 */
export function useActiveDesignComponent(
  currentComponentList?: ComputedRef<any>
) {
  const store = useStore();
  /**
   * 当前选中组件
   */
  const activeComponent = computed<DesignComponent>(() => {
    return store.state.design.activeComponent;
  });

  /**
   *  激活组件ID
   */
  const activeComponentId = computed(() => {
    return store.state.design.activeComponentId;
  });

  /**
   * 设置当前激活组件,并添加到组件集合
   * @param activeData 组件结构
   */
  function activeComponentAndPush(
    activeData: DesignComponent | undefined
  ): void {
    if (activeData) {
      store.commit("design/setActiveComponent", activeData);
      currentComponentList?.value.push(activeData);
    }
  }

  /**
   * 设置当前激活组件
   * @param activeData 组件结构
   */
  function setActiveComponent(activeData: DesignComponent | undefined): void {
    store.commit("design/setActiveComponent", activeData);
  }

  return {
    activeComponentId,
    activeComponent,
    setActiveComponent,
    activeComponentAndPush,
  };
}

export function useBaseInfoDesign() {
  /**
   * 获取基础信息表单表结构属性
   * @param pageId
   * @param components
   * @param currentfields
   * @return {*}
   */
  function getDesignComponentConfig(
    pageId: string | number,
    components: DesignComponent[],
    currentfields: any[]
  ) {
    const itemsFields: any[] = [];
    for (let i = 0; i < components.length; i++) {
      const element = components[i];

      if (currentfields.length > 0) {
        for (let j = 0; j < currentfields.length; j++) {
          if (element.__vModel__ == currentfields[j].fieldName) {
            createTableParams(
              pageId,
              element,
              currentfields[j],
              itemsFields,
              components
            );
            break;
          } else if (j === currentfields.length - 1) {
            createTableParams(
              pageId,
              element,
              undefined,
              itemsFields,
              components
            );
          }
        }
      } else {
        createTableParams(pageId, element, undefined, itemsFields, components);
      }
    }
    return itemsFields;
  }

  /**
   * 编辑时生成表单数据库表结构
   * @pageId 页面ID
   * @component 组件配置
   * @field 表单数据对象(后端返回结构)
   * @itemsFields 需生成的表单数据对象
   */
  function createTableParams(
    pageId: string | number,
    component: DesignComponent,
    field: any,
    itemsFields: any[],
    components: any[]
  ) {
    let itemType: ComponentType | undefined = [
      ...defaultComponentList,
      ...tradeComponentList,
      ...layoutComponentList,
    ].find((f) => f.tag === component.componentTag)?.type;
    // 类型为99的为纯展示组件，无需创建表字段
    if (itemType === ComponentType.UNDATA) return;
    component.componentTag === "designSelect" &&
      !component.__attr__.multiple &&
      (itemType = ComponentType.DEFAULT);
    component.componentTag === "designSlider" &&
      !component.__attr__.range &&
      (itemType = ComponentType.DEFAULT);
    const itemsField = {
      id: (field && field.id) || null, // 	integer 	非必须
      decimalLength: component.__attr__?.precision || null, //integer 非必须 小数点位数
      decimalSize: component.__config__?.decimalSize || null, //integer 非必须 小数点位数
      formula: component.__config__?.formula || null, //integer 非必须 小数点位数
      fieldCode: component.__vModel__ || null, //string  非必须 字段代码，只允许字母+数字
      fieldName: component.__vModel__ || null, //string 必须 字段名
      fieldLength: component.__attr__?.maxlength || 100, //integer  非必须 字段长度
      fieldRemark: component.__form__?.label || null, // 	string 非必须  字段备注说明
      fieldType: component.__config__?.sqlType || null, //必须  字段类型
      fieldValue: null, // 非必须  用户输入的字段的值
      isCascadeItem: component.__config__?.isCascadeItem || 0, //是否级联组件
      foreignKeyField: component.__relTable__?.key || null, // 非必须  关联的外键字段
      foreignKeyTableid: component.__relTable__?.tableName || null, // 非必须 关联的外键的表名
      displayedName: component.__relTable__?.relName, //string  非必须 关联外键字段的展示名
      isDeleted: null, //	integer 非必须 是否删除  0 false=不删除   1=已删除
      isKey: null, //integer 是否主键
      isUsing: 0, //integer 必须 是否可用
      isUnique: +(component.__config__?.unique || 0), //字段是否唯一 0代表不是，1代表是
      notNull: null, //integer 非必须 是否可为空
      tableId: pageId || null, // integer 必须 表id
      itemType: itemType || 0,
      tableType: component.__relTable__?.tableType,
      /**组件tag */
      componentTag: component.componentTag,
      formatCode: getDataFormatCode(component),
      /***********日期计算************/
      benchmarkTimeConfig: benchmarkTimeConfig(component),
      targetTimeConfig: targetTimeConfig(component),
      /***********开窗联动************/
      itemLinkageConfig: itemLinkageConfig(component, components),
      linkageItemConfigInfo: linkageItemConfig(component),
      /***********主从表************/
      masterSlaveConfigInfo: masterSlaveConfigInfo(component, components),
      /***********计算模型************/
      functionModelConfig: functionModelConfig(component),
      /***********树形组件**********/
      opPagesTree: treeModelConfig(component),
      /************* 自编码组件***************/
      codeRuleGenerateList: getCodeRuleGenerateList(component),
      /***开窗组件复制字段***/
      iotLinkTableId: dialogSelectConfig(component, "id"), //绑定表单复制模型的id
      iotLinkFieldCode: dialogSelectConfig(component, "code"), //关联条件的字段
    };
    itemsFields.push(itemsField);
  }

  /**
   * 获取时间格式类型
   * @param component 组件配置
   * @return {*}
   */
  function getDataFormatCode(component: DesignComponent): number | undefined {
    if (!component.__attr__?.format) {
      return undefined;
    } else {
      const format = component.__attr__.format;
      return format === dateTimeFormat.date
        ? 1
        : format === dateTimeFormat.week
        ? 2
        : format === dateTimeFormat.month
        ? 3
        : format === dateTimeFormat.year
        ? 4
        : format === dateTimeFormat.datetime
        ? 5
        : format === dateTimeFormat.time
        ? 6
        : undefined;
    }
  }
  /**
   * 日期计算组件-基准时间
   */
  function benchmarkTimeConfig(component: any) {
    if (component.componentTag !== "designDateCriticality") return undefined;
    const datum = component.datum;
    if (!datum || !datum.tableName) return;
    return {
      relatedTableName: datum.tableName,
      tableFieldName: datum.field,
      relatedFieldName: datum.relField,
      dateFieldName: datum.dateFileName,
    };
  }

  /**
   * 日期计算组件-目标时间
   */
  function targetTimeConfig(component: any) {
    if (component.componentTag !== "designDateCriticality") return undefined;
    const contrast = component.contrast;
    if (!contrast || !contrast.tableName) return;
    return {
      relatedTableName: contrast.tableName,
      tableFieldName: contrast.field,
      relatedFieldName: contrast.relField,
      dateFieldName: contrast.dateFileName,
    };
  }

  function itemLinkageConfig(component: any, components: any[]) {
    const relComponentModel = component.__config__?.relComponentModel;
    if (!component.__config__?.relComponentLabel) {
      // console.log("relComponentModel", relComponentModel);
    }
    if (relComponentModel && component.__config__?.relComponentLabel) {
      return {
        displayedItem: component.__config__?.relComponentLabel,
        relatedField: components.find(
          (f) => f.componentId == relComponentModel[0]
        ).__vModel__,
        relatedItem: relComponentModel[1] || undefined,
      };
    } else {
      return undefined;
    }
  }

  /**
   * 开窗组件配置
   * @param component
   * @return {*}
   */
  function linkageItemConfig(component: any) {
    if (component.selectModel && component.selectModel.length > 0) {
      const config: any = relTableSettingTransform(component.selectModel);
      config.pageRequest = { pageIndex: 1, pageSize: 100 };
      return {
        linkageItemConfig: config,
        valueBindField: component.__config__.valueBindField,
        textBindField: component.__config__.textBindField,
      };
    } else {
      return undefined;
    }
  }
  /**
   * 主从表配置
   * @param component
   * @return {*}
   */
  function masterSlaveConfigInfo(component: any, components: any[]) {
    let relFieldArr = [] as any;
    let inputselectModelList = [] as any;
    let masterSlaveConfigInfo = [] as any;

    for (let index = 0; index < components.length; index++) {
      const componentItem = components[index];
      if (
        componentItem.componentTag === "designTabTable" &&
        componentItem.relFields.length > 0
      ) {
        for (let j = 0; j < componentItem.relFields.length; j++) {
          const item = componentItem.relFields[j];
          if (item.masterField == component.__vModel__) {
            relFieldArr.push(item);
          }
        }

        for (let m = 0; m < componentItem.selectModelList.length; m++) {
          const element = componentItem.selectModelList[m];
          for (let n = 0; n < relFieldArr.length; n++) {
            const relField = relFieldArr[n];
            if (relField.pid == element.pid) {
              inputselectModelList.push(element);
            }
          }
        }
      }
    }

    if (inputselectModelList && inputselectModelList.length > 0) {
      inputselectModelList.forEach((el, index) => {
        const config: any = masterSlaveTableTransform(el.config);
        config.pageRequest = { pageIndex: 1, pageSize: 100 };
        masterSlaveConfigInfo.push({
          linkageItemConfig: config,
          valueBindField: relFieldArr[index].field,
          isDeleteSlave: relFieldArr[index].isDeleteSlave,
        });
      });
      return masterSlaveConfigInfo;
    } else {
      return undefined;
    }
  }

  function functionModelConfig(component: any) {
    if (
      component.__config__.dataModel &&
      component.__config__.dataModel.length > 0
    ) {
      return component.__config__.dataModel.map((m) => {
        return {
          functionModelId: m.type,
          functionModelKey: m.field,
        };
      });
    } else {
      return undefined;
    }
  }

  function treeModelConfig(component: any) {
    if (component.componentTag !== "designTree") return undefined;
    const options = component.options;
    if (!options) return;
    return options.map((item) => ({
      levelType: item.levelType,
      fieldForeignCode: item.fieldForeignCode ?? null,
      fieldCode: item.fieldCode,
      pageTableName: item.pageTableName,
    }));
  }

  function dialogSelectConfig(component: any, type: "id" | "code") {
    if (component.componentTag !== "designDialogSelect") return "";
    const copyData = component.copyData;
    return type === "id" ? copyData.bindCopy : copyData.relation;
  }
  /**
   * 自编码组件生成规则配置
   * @param component 组件config
   */
  function getCodeRuleGenerateList(component: any) {
    if (component.componentTag !== "designAutoCode") return;
    return {
      fieldName: component.__vModel__ || null,
      isUnique: 1,
      rule: component.autorule.type,
      numberLength: component.autorule.numLen || null,
      defaultAlphabetal: component.autorule.letter || null,
      dateFormat: component.autorule.dataformat || null,
    };
  }

  /**
   * 开窗组件配置转换
   * @configList 关联配置
   */
  function relTableSettingTransform(configList: any[]) {
    const params = {
      masterFieldValue: undefined,
      masterRelatedFieldName: undefined,
      masterRelatedTableName: undefined,
      tableEntityList: [] as any[],
    };
    for (let i = 0; i < configList.length; i++) {
      const config = configList[i];
      const tableEntity: any = {
        displayedFields: [],
        relatedFieldsConfig: [],
        tableName: undefined,
      };
      config.fields &&
        tableEntity.displayedFields.push(
          ...config.fields
            .filter((f) => f.check === true)
            .map((m) => {
              return {
                fieldName: m.fieldName,
              };
            })
        );
      const rellist = config.rellist;
      rellist &&
        tableEntity.relatedFieldsConfig.push(
          ...rellist.map((m) => {
            return {
              fieldName: m.field,
              foreignTableName: m.fField[0],
              foreignFieldName: m.fField[1],
              relatedType:
                m.reltype === "join" ? 0 : m.reltype === "left join" ? 1 : 2,
            };
          })
        );
      i === 0 && (params.masterRelatedTableName = config.tableName);
      tableEntity.tableName = config.tableName;
      params.tableEntityList.push(tableEntity);
    }
    return params;
  }

  /**
   * 主从表配置转换
   * @configList 关联配置  masterSlaveTableTransform
   */
  function masterSlaveTableTransform(configList: any[]) {
    const params = {
      masterFieldValue: undefined,
      masterRelatedFieldName: undefined,
      masterRelatedTableName: undefined,
      tableEntityList: [] as any[],
    };
    for (let i = 0; i < configList.length; i++) {
      const config = configList[i];
      const tableEntity: any = {
        displayedFields: [],
        relatedFieldsConfig: [],
        tableName: undefined,
      };
      config.fields &&
        tableEntity.displayedFields.push(
          ...config.fields
            .filter((f) => f.check === true)
            .map((m) => {
              return {
                fieldName: m.fieldName,
              };
            })
        );
      const rellist = config.rellist;
      rellist &&
        tableEntity.relatedFieldsConfig.push(
          ...rellist.map((m) => {
            return {
              fieldName: m.field,
              foreignTableName: m.fField[0],
              foreignFieldName: m.fField[1],
              relatedType:
                m.reltype === "join" ? 0 : m.reltype === "left join" ? 1 : 2,
            };
          })
        );
      i === 0 && (params.masterRelatedTableName = config.tableName);
      tableEntity.tableName = config.tableName;
      params.tableEntityList.push(tableEntity);
    }
    return params;
  }

  return {
    getDesignComponentConfig,
  };
}

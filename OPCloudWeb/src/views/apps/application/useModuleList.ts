import { computed, nextTick, reactive, ref, unref } from "vue";
import dayjs from "dayjs";
import { DesignComponent } from "@/components/designComponent";
import { DatePickerComponent } from "@/components/designComponent/basics/datepicker/IConfig";
import { MultiDatePickerComponent } from "@/components/designComponent/basics/multidatepicker/IConfig";
import { deepClone, getStorage, getToken, messageAlert } from "@/utils/utils";
import { ResultUnit } from "@/use/useConst";
import { ITableColunmSetting } from "@/interfaces/ITableConfig";
import { ResultType } from "@/components/designComponent/trade/calculate/IConfig";
import { doFlowable, getFlowableData, getFlowableDetail } from "@/api/flowable";
import {
  doBtnEvent,
  functionDataList,
  realTimeFunctionData,
} from "@/api/homeApi";

/**
 * 应用列表hooks
 * @export
 * @return {*}
 */
export function useModuleList(searchForm: any, pageSetting: any) {
  function initSearchConfig() {
    //搜索表单
    const { formConf, componentList } = pageSetting;
    searchForm.formConf = deepClone(formConf);
    searchForm.componentList = [];
    searchForm.formConf.labelWidth = 90;
    searchForm.formConf.size = "small";
    searchForm.formConf.inline = true;
    searchForm.formData = {};
    if (componentList && componentList.length > 0) {
      componentList.forEach((item: DesignComponent) => {
        const topItem = deepClone(item);
        if (topItem.__config__.inSearch) {
          // 搜索去除必填验证
          if (topItem.__form__) {
            topItem.__form__.required = false;
            topItem.__form__.regList = [];
            topItem.__form__.span = 6;
          }
          if (topItem.__attr__) {
            topItem.__attr__.readonly === true &&
              (topItem.__attr__.readonly = false);

            topItem.__attr__.disabled === true &&
              (topItem.__attr__.disabled = false);
          }

          searchForm.componentList.push(topItem);
        }
      });
      console.log("searchForm", searchForm);
    }
  }

  /**
   * 初始化页面结构
   * @param {*} tableConfig 表格配置
   * @param {*} response 数据源
   * @param {*} pageId 页面ID
   * @return {*}
   */
  function initPageConfig(response) {
    const { columnDatas, pageItems } = response.data.appPageData;
    const tableOption: Record<string, any> = {
      total: 0,
      tableColums: [],
      tableData: [],
    };
    tableOption.total = response.data.total;
    return new Promise((resolve, reject) => {
      //组合显示列配置数据
      if (pageItems) {
        const { formConf, components = [] } = pageItems;
        if (components.length > 0) {
          // 设置弹框模块
          pageSetting.type = formConf.dialogType;
          pageSetting.size = formConf.width;
          pageSetting.formConf = formConf;
          pageSetting.componentList = components;
          pageSetting.formType = pageItems.type;
          // 初始化顶部搜索框配置
          new Promise(() => {
            pageSetting.reload && initSearchConfig();
          });
          tableOption.tableColums = [];
          for (let index = 0; index < components.length; index++) {
            //遍历组件数组用于组合成新数据
            const element = components[index];
            const ColumnCfg: ITableColunmSetting = {
              label: element.__form__.label,
              prop: element.__vModel__,
              width: 180,
              sortable: element.__config__.tableSort,
            };
            // 上传文件处理
            if (element.componentTag === "designUpload") {
              ColumnCfg.isFile = true;
              if (element.__attr__["list-type"] === "text") {
                ColumnCfg.fileType = 3;
              } else {
                ColumnCfg.fileType = 1;
              }
            } else if (element.componentTag === "designDateCriticality") {
              ColumnCfg.isHtml = true;
            } else if (
              element.componentTag === "designCalculate" &&
              element.__config__.resultType === ResultType.PERCENT
            ) {
              ColumnCfg.isProgress = true;
            } else if (element.componentTag === "designProgress") {
              ColumnCfg.isProcess = true;
              ColumnCfg.componentOption = element;
              ColumnCfg.width = 900;
            }
            element.__config__.inTable &&
              tableOption.tableColums.push(ColumnCfg);
          }
        }
        //接口返回的配置具体值数据
        columnDataTransform(
          columnDatas,
          pageItems.components,
          tableOption.tableColums
        );
        //组合新数据
        if (columnDatas && columnDatas.length > 0) {
          tableOption.tableData = columnDatas;
        } else {
          tableOption.tableData = [];
        }
      } else {
        tableOption.tableColums = [];
      }
      resolve(tableOption);
    });
  }
  /**
   * 列表数据处理
   * @param {*} columnDataList 列数据
   * @param {*} componentCfg 组件配置
   */
  function columnDataTransform(
    columnDataList: any[],
    componentCfg: DesignComponent[],
    tableColums: ITableColunmSetting[]
  ) {
    for (let i = 0; i < columnDataList.length; i++) {
      const row = columnDataList[i];
      Object.keys(row).forEach((column) => {
        const component = componentCfg.find((f) => f.__vModel__ === column);
        // 组件
        if (component) {
          switch (component.componentTag) {
            case "designCheckBox":
              multipleTransform(row, column, component);
              break;
            case "designSelect":
              multipleTransform(row, column, component);
              break;
            case "designMoreSelect":
              multipleTransform(row, column, component);
              break;
            case "designRadio":
              multipleTransform(row, column, component);
              break;
            case "designCascader":
              multipleTransform(row, column, component);
              break;
            case "designDialogSelect":
              {
                const value = row[column];
                row[column] = value && value.disPlayedValue;
                row[`${column}_dialogSelect`] = value ? value[column] : null;
              }
              break;
            case "designDatePicker":
              {
                const format = (<DatePickerComponent>component).__attr__.format;
                row[column] = row[column] && dayjs(row[column]).format(format);
              }
              break;
            case "designMultiDatePicker":
              {
                const format = (<MultiDatePickerComponent>component).__attr__
                  .format;
                if (row[column]) {
                  let value: string[];
                  try {
                    value = JSON.parse(row[column]);
                  } catch {
                    value = row[column];
                  }
                  const temp =
                    value &&
                    value.map &&
                    value.map((el) => dayjs(el).format(format));
                  row[`${column}_ord`] = temp;
                  row[column] = temp && temp.join(",");
                }
              }
              break;
            case "designTimePicker":
              const format = component.__attr__.format;
              row[`${column}_ord`] = row[column];
              row[column] = row[column] && dayjs(row[column]).format(format);
              break;
            case "designDateRangePicker":
              {
                const format = component.__attr__.format;
                row[`${column}_ord`] = row[column];
                row[column] = row[column] && dayjs(row[column]).format(format);
              }
              break;
            case "designTimeRangePicker":
              {
                const format = component.__attr__.format;
                row[`${column}_ord`] = row[column];
                row[column] = row[column] && dayjs(row[column]).format(format);
              }
              break;
            case "designNumber":
              row[column] = Number(row[column]);
              break;
            case "designSwitch":
              const value = row[column];
              row[column] =
                value === 1
                  ? component.__config__.activeText
                  : component.__config__.inactiveText;
              row[`${column}_switch`] = value;
              break;
            case "designUpload":
              {
                const value = row[column];
                row[column] = value && JSON.parse(value); //.map((m) => m.filePath);
              }
              break;
            case "designDateCriticality":
              row[column] =
                (row[column] &&
                  columnDateCriticalityParser(component, row[column])) ||
                null;
              break;
            case "designCalculate":
              row[column] = columnCalculateParser(component, row[column]);
              break;
          }
          // 计算模型
          if (
            component.__config__.dataModel &&
            component.__config__.dataModel.length > 0
          ) {
            let JsonData: any = undefined;
            try {
              JsonData = /^\d+$/.test(row[column])
                ? row[column]
                : JSON.parse(row[column]);
            } catch {
              JsonData = row[column];
            }
            const { type, value } = JsonData;
            // 百分比
            if (type == 1) {
              const percent = Number((Number(value) * 100).toFixed(2));
              row[column] = percent;
              const columnSetting = tableColums.find(
                (f) => f.prop === component.__vModel__
              );
              columnSetting && (columnSetting.isProgress = true);
            } else {
              row[column] = value;
            }
          }
        }
      });
    }
  }

  /**
   * 表格日期计算组件列解析转换
   */
  function columnDateCriticalityParser(component, data: any) {
    // 基准时间
    const datum = component.datum;
    // 目标时间
    const contrast = component.contrast;
    // 基准日期字段
    const datumDateFileName = datum.dateFileName;
    // 基准日期表名
    const datumTableName = datum.tableName;
    // 目标日期字段
    const contrastFileName = contrast.dateFileName;
    // 目标日期表名
    const contrastTableName = contrast.tableName;

    let datumDate: any = undefined;
    let contrastDate: any = undefined;
    // 位置设置基准日期时，基准时间等于当前时间
    datumDate = !datumDateFileName
      ? new Date()
      : new Date(data[`${datumTableName}__${datumDateFileName}`]);
    contrastDate = !contrastFileName
      ? new Date()
      : new Date(data[`${contrastTableName}__${contrastFileName}`]);
    const resultUnit = component.__config__.resultUnit as ResultUnit;
    let diff: number = contrastDate - datumDate;
    const normal = component.result[0];
    const warning = component.result[1];
    const error = component.result[2];
    switch (resultUnit) {
      case ResultUnit.DAY:
        diff = diff / 1000 / 60 / 60 / 24;
        return getResult("天");
      case ResultUnit.HOUR:
        diff = diff / 1000 / 60 / 60;
        return getResult("小时");
      case ResultUnit.MINUTE:
        diff = diff / 1000 / 60;
        return getResult("分钟");
      case ResultUnit.SECOND:
        diff = diff / 1000;
        return getResult("秒");
    }

    /**
     * 获取结果
     */
    function getResult(unit) {
      if (diff > warning.criticalityValue) {
        // 正常
        return `<span  style="color:${normal.criticalityColor}">${
          normal.criticalityLabel || "正常"
        }</span>`;
      } else if (
        diff <= warning.criticalityValue &&
        diff > error.criticalityValue
      ) {
        // 预警
        return `<span style="color:${warning.criticalityColor}">即将${
          warning.criticalityLabel || "超期"
        }</span>`;
      } else if (diff <= error.criticalityValue) {
        return `<span style="color:${error.criticalityColor}">${
          error.criticalityLabel || "已超期"
        }</span>`;
      } else {
        console.log("diff", diff);
      }
    }
  }

  /**
   * 公式换算组件数据转换
   */
  function columnCalculateParser(component, data: any) {
    const resultType: ResultType = component.__config__.resultType;
    switch (resultType) {
      case ResultType.PERCENT:
        const percent = Number((Number(data) * 100).toFixed(2));
        return percent;
      case ResultType.VALUE:
        return data;
    }
  }
  /**
   * 提供给表单的行数据处理
   * @param {*} rowData 列数据
   * @param {*} componentListCfg 组件配置
   */
  function rowFormTransform(rowData: any[], componentListCfg: any[]) {
    const newRow = deepClone(rowData);
    const keys = Object.keys(newRow);
    keys.forEach((column) => {
      if (keys.indexOf(`${column}_key`) > -1) {
        const columnVal = newRow[`${column}_key`];
        newRow[column] = columnVal === null ? undefined : columnVal;
        delete newRow[`${column}_key`];
      } else if (keys.indexOf(`${column}_ord`) > -1) {
        const columnVal = newRow[`${column}_ord`];

        newRow[column] = columnVal === null ? undefined : columnVal;
        delete newRow[`${column}_ord`];
      } else if (keys.indexOf(`${column}_switch`) > -1) {
        const columnVal = newRow[`${column}_switch`];
        newRow[column] = columnVal === null ? undefined : columnVal;
        delete newRow[`${column}_switch`];
      }
    });
    multipleValueComponentTransform(componentListCfg);

    return newRow;
  }

  function multipleValueComponentTransform(componentListCfg: any[]) {
    if (pageSetting.formType === "baseInfo") {
      componentListCfg.forEach((component) => {
        if (component.__attr__) {
          if (component.__attr__["is-range"] === true) {
            component.__attr__["is-range"] = false;
          } else if (component.__attr__.range === true) {
            component.__attr__.range = false;
          }
        }
        if (
          ["daterange", "monthrange", "datetimerange"].includes(
            component.__config__.type
          )
        ) {
          component.__config__.type = component.__config__.type.replace(
            "range",
            ""
          );
        }
      });
    }
  }

  /**
   * 单选多选组件数据处理
   * @param rowData 行数据
   * @param key key
   */
  function multipleTransform(
    rowData: any,
    key: string,
    componentCfg: DesignComponent
  ) {
    const data = rowData[key];
    if (data === null && data === undefined) return;
    let JsonData: any = undefined;
    // 方式不严谨，待优化
    try {
      JsonData = /^\d+$/.test(data) ? data : JSON.parse(data);
    } catch {
      JsonData = data;
    }
    const _toString: Function = Object.prototype.toString;
    // 字符类型
    if (_toString.call(JsonData) === "[object Array]") {
      // 非关联表情况
      if (_toString.call(JsonData[0]) == "[object Object]") {
        const labels: string[] = [];
        const keys: any = [];
        JsonData.forEach((f) => {
          labels.push(f.disPlayedValue);
          keys.push(f[key]);
        });
        rowData[key] = labels.join(",");
        rowData[`${key}_key`] = keys;
      } else if (
        ["[object String]", "[object Number]"].includes(
          _toString.call(JsonData[0])
        )
      ) {
        const labels: string[] = [];
        const keys: any = [];
        for (let index = 0; index < componentCfg.options.length; index++) {
          JsonData.forEach((f) => {
            if (f == componentCfg.options[index].value) {
              labels.push(componentCfg.options[index].label);
              keys.push(f);
            }
          });
          rowData[key] = labels.join(",");
          rowData[`${key}_key`] = keys;
        }
      }
    } else if (
      ["[object String]", "[object Number]"].includes(_toString.call(JsonData))
    ) {
      // 静态数据处理
      const colunmData = componentCfg.options.find((f) => f.value == data);
      colunmData && (rowData[key] = colunmData.label);
      rowData[`${key}_key`] = colunmData && colunmData.value;
    } else if (_toString.call(JsonData) === "[object Object]") {
      // 单选外键数据处理
      rowData[`${key}_key`] = rowData[key][key];
      rowData[key] = rowData[key].disPlayedValue;
    }
  }

  return {
    initSearchConfig,
    initPageConfig,
    rowFormTransform,
    multipleValueComponentTransform,
  };
}

/**
 * 工作流
 * @export
 * @return {*}
 */
export function useFlowable() {
  // 页面类型为流程表单时，启动流程使用
  const processDefinitionId = ref<string>("");

  /**启动流程按钮名称 */
  const startFlowLabel = ref<string>("");
  // 选中的流程名称
  const activeName = ref<string>("0");
  // 执行loading
  const doLoading = ref<boolean>(false);
  // 执行流程时表单对象
  const flowableForm = ref<any>(null);

  //按钮执行时需要记录id
  const exectId = ref<any>(null);

  //详情的类型
  const detailType = ref("");

  const buttonList = ref<any>([]);

  // 执行流程时的弹框
  const processvisible = ref<boolean>(false);

  const variables = reactive({
    __FormList__: [],
    imageUrl: "",
  });

  const flowable = reactive({
    formConf: undefined,
    componentList: [],
    id: "",
    taskId: "",
    tabName: "",
    pageId: "",
  });

  async function flowableDetail(row: any, type: string) {
    exectId.value = row.id;
    detailType.value = type;

    const res = await getFlowableDetail({
      processInstanceId: row.processInstanceId,
    });
    const token = getToken("accessToken");
    variables.imageUrl = `/flowable/processInstanceImage?processInstanceId=${
      row.processInstanceId
    }&access_token=${token}&time=${+new Date()}`;
    if (res.code === 200) {
      let formList = res.data.variables.__FormList__;
      let newformList = deepClone(formList);
      if (formList && formList.length > 0) {
        // 详情不能修改数据 采用表单禁用限制
        formList = formList.map((item, index) => {
          item.formConf.disabled = true;
          item.formModel = {};
          return item;
        });
        variables.__FormList__ = formList;
        if (type === "detail") {
          processvisible.value = true;
        }
        nextTick(() => {
          variables.__FormList__.forEach((item, index) => {
            item.formModel = newformList[index].formModel;
          });
        });
      }
    }
  }

  async function doneFlowable(item) {
    doLoading.value = true;
    let para = {
      id: flowable.id,
      taskId: flowable.taskId,
      name: item.name,
      value: item.value,
      pageId: flowable.pageId,
      jsonDATA: flowableForm.value?.formData,
      values: {
        formConf: flowableForm.value.formConf || null,
        componentList: flowableForm.value.componentList || null,
        formModel: flowableForm.value?.formData || null,
      },
    };
    if (!flowableForm.value.formValid()) return;
    const res = await doFlowable(para);
    if (res.code === 200) {
      processvisible.value = false;
      messageAlert("success", "执行成功");
    }
    doLoading.value = false;
  }

  //获取执行流程的表单详情
  async function getflowableFormDetail(row: any, para) {
    flowable.formConf = undefined;
    flowable.componentList = [];
    flowable.id = "";
    flowable.taskId = "";
    flowable.tabName = "";
    const res = await getFlowableData({ taskId: row.taskId });
    if (res.code === 200) {
      if (res.data.renderedStartForm) {
        const { formConf, components = [] } = JSON.parse(
          res.data.renderedStartForm
        );
        flowable.formConf = formConf;
        flowable.componentList = components;
        flowable.id = para.updateId;
        flowable.taskId = para.taskId;
        flowable.tabName = row.tabName;
        flowable.pageId = res.data.pageId;
      }
      processvisible.value = true;
      buttonList.value = res.data.buttonList;
    }
  }

  // 按钮执行
  async function flowableExcute(obj: any, pageId: string | number) {
    if (!exectId.value) {
      messageAlert("warning", "请保存后再操作");
      return;
    }
    let para = {
      pageId: pageId,
      eventCode: obj.component.__config__.eventCode,
      bindingFieldName: "WorkorderStatus",
      orgId: getStorage("user").value.orgId,
      rowId: exectId.value,
    };
    const res = await doBtnEvent(para);
    if (res.code == 200) {
      messageAlert("success", "操作成功");
    }
  }

  async function flowableExcuteForm(item: any, pageId: string | number) {
    if (!exectId.value) {
      messageAlert("warning", "请保存后再操作");
      return;
    }
    let para = {
      pageId: pageId,
      eventCode: item.eventCode,
      closeable: item.closeable,
      bindingFieldName: "WorkorderStatus",
      orgId: getStorage("user").value.orgId,
      rowId: exectId.value,
      copyPageId: item.copyPageId,
      dataCopyFieldList: item.dataCopyFieldList,
      fieldValueChange: item.fieldValueChange,
      fieldValueChangeList: item.fieldValueChangeList,
    };
    const res = await doBtnEvent(para);
    if (res.code == 200) {
      messageAlert("success", "操作成功");
    }
  }

  return {
    exectId,
    detailType,
    processvisible,
    processDefinitionId,
    startFlowLabel,
    activeName,
    doLoading,
    flowableForm,
    variables,
    flowable,
    buttonList,
    flowableDetail,
    doneFlowable,
    getflowableFormDetail,
    flowableExcute,
    flowableExcuteForm,
  };
}

/**
 * 计算模型
 * @export
 */
export function useFunctionModel() {
  const functionModelList = ref<any>([]);

  const tabTableData = ref<any>([]);

  /**模型字段 */
  const modelFields = computed(() => {
    const modelList = unref(functionModelList.value);
    if (!modelList) return undefined;
    const keys = Object.keys(modelList) || [];
    const fieldMap = new Map();
    for (let i = 0; i < keys.length; i++) {
      const functionModelParams = modelList[keys[i]];
      for (let j = 0; j < functionModelParams.length; j++) {
        const fieldParams = functionModelParams[j];
        if (fieldParams.infoDesign.isCollect === 1) {
          continue;
        }
        const field = fieldParams.record.split("__")[1];
        fieldMap.set(field, fieldParams);
      }
    }
    return fieldMap;
  });

  /**
   * 获取页面结果字段在当前页面的计算模型列表
   * @param pageId
   */
  async function getPageFunctionModelList(pageId: string | number) {
    const res = await functionDataList({ pageId: pageId });
    if (res.code == 200) {
      functionModelList.value = res.data;
    }
  }

  /**
   * 模型实时计算
   */
  async function relFunctionModel(formData: any, pageId: string | number) {
    let modelField = undefined;
    Object.keys(formData).forEach((key) => {
      const field = modelFields.value && modelFields.value.get(key);
      field && (modelField = field);
    });
    // 判断当前组件是否存在当前模型
    if (modelField) {
      // 判断是否存在主从表组件且从表中存在模型运算字段
      const { modelId } = modelField;
      // 如果是结果字段，则不作处理
      const resultField = findResultField(modelId);
      // 从表数据
      let slaveTableData = [];
      tabTableData.value &&
        tabTableData.value.forEach((item) => {
          slaveTableData = slaveTableData.concat(...(item.dataSource || []));
        });
      const params = {
        masterTableData: formData,
        slaveTableData,
        tableId: pageId,
      };
      // 获取模型结果
      const res = await realTimeFunctionData(params);
      if (res.code == 200) {
        const resultData = res.data;
        formData[resultField] =
          resultData && resultData[resultField] && resultData[resultField];
      }
    }
  }

  /**
   * 查询结果字段
   * @param 模型ID
   */
  function findResultField(modeleId: string | number) {
    const keys = Object.keys(functionModelList.value) || [];
    for (let i = 0; i < keys.length; i++) {
      const model = functionModelList.value[keys[i]];
      const field = model.find(
        (item) => item.modelId === modeleId && item.infoDesign.isResult
      );
      const temp = field.record.split("__");
      return temp && temp[1];
    }
  }

  return {
    // functionModelList,
    tabTableData,
    getPageFunctionModelList,
    relFunctionModel,
  };
}

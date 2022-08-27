import { startFlowable } from "@/api/flowable";
import useEmitter from "@/hooks/use-core/useMitt";
import { confirmBox, deepClone, messageAlert } from "@/shared/utils/utils";
import useComponentEmit from "src/hooks/use-component-emit";
import useInitComponentData from "src/hooks/use-init-component";
import { nextTick } from "vue";
import { useRouter } from "vue-router";
import { useModuleList } from "./useModuleList";
/**
 * 页面事件定义
 */
export default function useEvent(
  state: any,
  flowAbleState: any,
  pageBtnEvent: any
) {
  const router = useRouter();

  const {
    loadDialogSelectData,
    createAutoCode,
    fillDialogSelectData,
    delTabTableData,
    editTabTableData,
    viewDetailTabTableData,
    addTabTableData,
    selectChange: onSelectChange,
  } = useComponentEmit();

  const {
    initComponentData,
    tabTableInit,
    processFlowInit,
    treeInit,
    transformDataSourceOfTableData,
  } = useInitComponentData();

  const { initPageConfig, rowFormTransform, multipleValueComponentTransform } =
    useModuleList(state.searchForm, state.pageSetting);

  // 表单组件事件定义
  useEmitter([
    // 自动生成自编码
    { key: "on-create-autocode", value: createAutoCode },
    // 加载开窗表格数据
    { key: "on-load-reltable-data", value: loadDialogSelectData },
    // 填充表格选择的数据
    { key: "on-set-reltable-data", value: fillDialogSelectData },
    // 删除主从表数据
    { key: "on-del-tabtable-data", value: delTabTableData },
    // 编辑主从表数据
    {
      key: "on-edit-tabtable-data",
      value: (e) => editTabTableData(e, state.tableForm),
    },
    // 主从表数据--查看详情
    {
      key: "on-viewDetail-tabtable-data",
      value: (e) => viewDetailTabTableData(e, state.tableForm),
    },
    // 新增主从表数据
    {
      key: "on-add-tabtable-data",
      value: (e) => addTabTableData(e, state.tableForm),
    },
    // 表单配置按钮  按钮执行事件
    { key: "on-do-event", value: pageBtnEvent.excuteBtn },
    // 更新后表单配置按钮  按钮执行事件
    { key: "on-do-event-btnform", value: pageBtnEvent.excuteBtnForm },
    // 树形组件加载
    {
      key: "on-load-tree",
      value: (e) => treeInit(e, state.currentPage.pageType),
    },
    // 从表点击编辑,主表按钮变成保存按钮
    { key: "on-change-tabtablebtn", value: changeTabTableBtn },
    // 表单下拉change事件
    { key: "on-select-change", value: onSelectChange },
  ]);

  function changeTabTableBtn() {
    state.pageSetting.formConf.disabled = false;
  }

  /**
   * 编辑数据
   * @param row
   */
  function onEditRow(row: any) {
    state.pageSetting.formConf.disabled = false;
    if (state.pageSetting.formConf.dialogType === "page") {
      const current = router.currentRoute.value;
      const path = `/appedit/${current.params.appid}/${current.params.modelid}/${current.params.pageid}`;
      router.push(path);
      const label = state.layoutState?.pageTabList.value.find(
        (f) => f.path === current.path
      )?.label;
      if (!state.layoutState?.pageTabList.value.some((f) => f.name === name)) {
        const name = `${state.menuLayout.value.activeMenu}_edit`;
        state.layoutState?.pageTabList.value.push({
          label: `${label || ""} ${row.status === 4 ? "重新提交" : "编辑"}`,
          name,
          path,
        });
      }
    } else {
      initComponentData(state.pageSetting.componentList, "edit", row);
      state.pageSetting.title = `${row.status === 4 ? "重新提交" : "编辑"} ${
        state.currentPage.appName
      } / ${state.pageParmas.modelName} / ${state.pageParmas.pageName}`;
      state.pageSetting.visible = true;

      flowAbleState.exectId.value = row.id;
      nextTick(() => {
        state.currentFormData.value = rowFormTransform(
          row,
          state.pageSetting.componentList
        );
        initFormComponentData(
          state.currentFormData.value,
          state.pageSetting.componentList
        );
      });
    }
  }

  // 启动流程
  function onStart(row: any, str?: string) {
    flowAbleState.exectId.value = row.id;
    let para = {
      jsonDATA: row,
      modelId: state.pageParmas.modelId as string,
      pageId: state.pageParmas.pageId,
      updateId: row.id,
      processDefinitionId: flowAbleState.processDefinitionId.value,
      taskId: row.taskId ? row.taskId : "",
    };
    // 启动流程
    if (row.startable) {
      confirmBox(str, async () => {
        const res = await startFlowable(para);
        if (res.code === 200) {
          messageAlert("success", "提交成功");
          getPageSet();
        }
      });
    }
    // 执行流程
    if (row.executable) {
      activeName.value = "exec";
      onFlowDetail("exec", row);
      getflowableForm(row, para);
    }
  }

  // 查看详情
  function viewDetails(row) {
    state.pageSetting.formConf.disabled = true;
    initComponentData(state.pageSetting.componentList, "edit", row);
    const { modelName, pageName } = state.currentPage;
    state.pageSetting.title = `详情信息 ${state.currentPage.appName} / ${modelName} / ${pageName}`;
    state.pageSetting.visible = true;

    flowAbleState.exectId.value = row.id;
    nextTick(() => {
      state.currentFormData.value = rowFormTransform(
        row,
        state.pageSetting.componentList
      );
      initFormComponentData(
        state.currentFormData.value,
        state.pageSetting.componentList
      );
    });
  }

  function initFormComponentData(row: any, components: any[]) {
    for (let i = 0; i < components.length; i++) {
      const element = components[i] as any;
      const tag = element.componentTag;
      if (tag === "designTabTable") {
        tabTableInit(row, element).then((res: any) => {
          tabTableData.value = deepClone(element.dataSourceList);
          // 组件数据处理
          for (let j = 0; j < element.dataSourceList.length; j++) {
            const table = element.dataSourceList[j];
            const componentList = res[table.pid];
            initComponentData(componentList).then(() => {
              // 根据组件类型，处理表格数据
              transformDataSourceOfTableData(
                componentList,
                table.dataSource || []
              );
            });
          }
        });
      } else if (tag === "designProcessFlow") {
        // 工序流程图
        if (state.currentFormData.value.FICMONO) {
          processFlowInit(element, state.currentFormData.value.FICMONO);
        }
      }
    }
  }

  return {
    onEditRow,
    viewDetails,
  };
}

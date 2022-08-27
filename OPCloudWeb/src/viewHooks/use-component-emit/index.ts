import useEmitter from "@/use/useEitter";
import { loadDialogSelectData, fillDialogSelectData } from "./dialogSelect";
import { selectChange } from "./select";
import { createAutoCode } from "./autoCode";
import useTabTable from "./tabTable";
import { getCurrentInstance } from "vue";

/**
 * 组件事件交互
 */
export default function useComponentEmit() {

  const currentInstance = getCurrentInstance();

  const { delTabTableData, editTabTableData,viewDetailTabTableData, addTabTableData } =
    useTabTable(currentInstance);

  return {
    loadDialogSelectData,
    createAutoCode,
    fillDialogSelectData,
    delTabTableData,
    editTabTableData,
    viewDetailTabTableData,
    addTabTableData,
    selectChange
  };
}

import { loadDialogSelectData, fillDialogSelectData } from "./dialogSelect";
import { selectChange } from "./select";
import { createAutoCode } from "./autoCode";
import useTabTable from "./tabTable";
/**
 * 组件事件交互
 */
export default function useComponentEmit() {
  const { delTabTableData, editTabTableData, addTabTableData } = useTabTable();

  return {
    loadDialogSelectData,
    createAutoCode,
    fillDialogSelectData,
    delTabTableData,
    editTabTableData,
    addTabTableData,
    selectChange,
  };
}

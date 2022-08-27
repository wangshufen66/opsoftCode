import { deleteTabTableData, getPageCfgByTableId } from "@/api/homeApi";
import { confirmBox, messageAlert } from "@/utils/utils";
import { nextTick } from "vue";
import useInitComponentData from "../use-init-component";
import { createAutoCode } from "./autoCode";

export default function useTabTable(currentInstance) {
  // 组件数据初始化
  const { initComponentData } = useInitComponentData();

  /**
   * 删除主从表数据
   */
  function delTabTableData(obj: any) {
    const { masterTableName, row, rowIndex, tableData, callback } = obj;
    confirmBox("删除数据", async () => {
      const masterField = `${masterTableName}__ID`;
      if (row[masterField]) {
        const params = {
          tableDataUpdateEntity: [
            {
              tableAndFieldNameAlias: masterField,
              columnValue: row[masterField.toLocaleUpperCase()],
            },
          ],
        };
        const res = await deleteTabTableData(params);
        if (res.code == 200) {
          messageAlert("success", "删除成功");
          callback();
        }
      } else {
        // 删除表格数据即可
        tableData.splice(rowIndex, 1);
      }
    });
  }

  /**
   * 编辑主从表数据
   */
  async function editTabTableData(obj: any, tableForm: any) {
    const { tableId, component, row } = obj;
    const tableComponent = component;
    const params = { appPageId: tableId };
    const res = await getPageCfgByTableId(params);
    if (res.code == 200) {
      const { formConf, components } = res.data;
      tableForm.formType = 2;
      tableForm.visible = true;
      tableForm.tableId = tableId;
      tableForm.title = "编辑信息";
      tableForm.type = formConf.dialogType;
      tableForm.size = formConf.width;
      tableForm.formConf = formConf;
      tableForm.componentList = components;
      tableForm.options = tableComponent;
      initComponentData(tableForm.componentList);
      nextTick(() => {
        Object.keys(row).forEach((key) => {
          if (key.indexOf("__") > -1) {
            let field = key.split("__")[1];
            if (field) {
              field = field.toLocaleLowerCase();
              if (row[key]) {
                const _field = Object.keys(tableForm.formData).find(
                  (f) => f.toLocaleLowerCase() === field
                );
                if (row[key] && row[`${key}_dialogSelect`]) {
                  _field &&
                    (tableForm.formData[`${_field}_dialogSelect`] =
                      row[`${key}_dialogSelect`]);
                  _field && (tableForm.formData[_field] = row[key]);
                } else {
                  _field &&
                    (tableForm.formData[_field] =
                      row[`${key}_key`] || row[key]);
                }
              }
            }
          }
        });
        console.log("tableForm.formData", tableForm.formData);
        if (row["key_id"]) {
          tableForm.formData["key_id"] = row["key_id"];
        } else {
          tableForm.formData["key_id"] = row["key_id"] = +new Date();
        }
      });
    }
  }

  /**
   * 查看详情主从表数据
   */
  async function viewDetailTabTableData(obj: any, tableForm: any) {
    const { tableId, component, row } = obj;
    const tableComponent = component;
    const params = { appPageId: tableId };
    const res = await getPageCfgByTableId(params);
    if (res.code == 200) {
      const { formConf, components } = res.data;
      tableForm.formType = 2;
      tableForm.visible = true;
      tableForm.tableId = tableId;
      tableForm.title = "编辑信息";
      tableForm.type = formConf.dialogType;
      tableForm.size = formConf.width;
      formConf.disabled=true;
      tableForm.formConf = formConf;
      tableForm.componentList = components;
      tableForm.options = tableComponent;
      initComponentData(tableForm.componentList);
      nextTick(() => {
        Object.keys(row).forEach((key) => {
          if (key.indexOf("__") > -1) {
            let field = key.split("__")[1];
            if (field) {
              field = field.toLocaleLowerCase();
              if (row[key]) {
                const _field = Object.keys(tableForm.formData).find(
                  (f) => f.toLocaleLowerCase() === field
                );
                if (row[key] && row[`${key}_dialogSelect`]) {
                  _field &&
                    (tableForm.formData[`${_field}_dialogSelect`] =
                      row[`${key}_dialogSelect`]);
                  _field && (tableForm.formData[_field] = row[key]);
                } else {
                  _field &&
                    (tableForm.formData[_field] =
                      row[`${key}_key`] || row[key]);
                }
              }
            }
          }
        });
        if (row["key_id"]) {
          tableForm.formData["key_id"] = row["key_id"];
        } else {
          tableForm.formData["key_id"] = row["key_id"] = +new Date();
        }
      });
    }
  }

  async function addTabTableData(obj: any, tableForm: any) {
    const { optionId, tableId, model, component } = obj;
    const tableComponent = component;
    const params = { appPageId: tableId };
    const res = await getPageCfgByTableId(params);
    if (res.code == 200) {
      const { formConf, components } = res.data;
      tableForm.formType = 1;
      tableForm.visible = true;
      tableForm.tableId = tableId;
      tableForm.title = "新增信息";
      tableForm.type = formConf.dialogType;
      tableForm.size = formConf.width;
      tableForm.formConf = formConf;
      tableForm.componentList = components;
      tableForm.options = tableComponent;
      initComponentData(tableForm.componentList);
      nextTick(() => {
        const optionTable = component.relFields.find((f) => f.pid == optionId);
        const field = optionTable.field.split("__")[1].toLocaleLowerCase();
        const masterFieldValue = model[optionTable["masterField"] || "id"];
        masterFieldValue && (tableForm.formData[field] = masterFieldValue);
        const autoCodeComponent: any = tableForm.componentList.find(
          (f) => f.componentTag === "designAutoCode" && !f.__config__.isSeries
        );
        autoCodeComponent &&
          createAutoCode({
            component: autoCodeComponent,
            formModel: tableForm.formData,
            tableId: autoCodeComponent.autorule.tableId || tableId,
          });
      });
    }
  }

  return {
    delTabTableData,
    editTabTableData,
    viewDetailTabTableData,
    addTabTableData,
  };
}

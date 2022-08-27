<template>
  <div class="fixedDialog">
    <el-dialog :model-value="visible" title="表格数据源设置" width="1200px" :before-close="beforeClose">
      <template v-slot:title>
        <dialog-title title="表格数据源设置"></dialog-title>
      </template>
      <div class="tables-set">
        <div class="tableset-list-wrap">
          <div class="card-type">
            <div class="divider-wrap">
              表设置
              <i class="el-icon-plus" @click="addItem" title="添加关联表"></i>
            </div>
            <div class="divider-wrap">关联设置</div>
          </div>
          <div class="tables-wrap">
            <template v-for="(item, index) in setTableList" :key="item.key">
              <div class="table-wrap">
                <div class="table-selector">
                  <div class="title">表名</div>
                  <el-cascader
                    v-model="item.cascaderId"
                    :ref="`tableCascaderRef${index}`"
                    :props="getFieldProps()"
                    @change="getFieldByPage(item, index, $refs)"
                    separator="-"
                    style="width: 300px"
                  ></el-cascader>
                </div>

                <div class="table-field">
                  <div class="title">表字段</div>
                  <template v-if="item.fields && item.fields.length > 0">
                    <div class="field-items">
                      <div
                        class="field-item"
                        :class="field.check ? ['active'] : ''"
                        v-for="field in item.fields"
                        :key="field.fieldName"
                        @click="checkedField(field)"
                        :title="field.fieldRemark"
                      >{{ field.fieldRemark }}</div>
                    </div>
                  </template>
                  <div class="tip" v-else>请选择表!</div>
                </div>
                <div class="oper-wrap">
                  <i class="el-icon-close" @click="deleteItem(index)" title="删除关联表"></i>
                </div>
              </div>
              <div class="table-wrap fkey-list-wrap">
                <template
                  v-if="
                    item.ftables &&
                    item.ftables.length > 0 &&
                    item.rellist.length > 0
                  "
                >
                  <div class="fkey-check-wrap" v-for="(rel, i) in item.rellist" :key="rel.key">
                    <div class="fkey-field-item">
                      <div class="title">表字段</div>
                      <el-select
                        class="select-fkey-field"
                        v-model="rel.field"
                        filterable
                        clearable
                        size="mini"
                      >
                        <el-option
                          v-for="field in item.fields"
                          :key="field.fieldName"
                          :value="field.fieldName"
                          :label="field.fieldRemark"
                        ></el-option>
                      </el-select>
                    </div>
                    <!-- <el-cascader v-model="item.rellist[i].field" :options="item.ftables"></el-cascader> -->
                    <div class="fkey-field-item">
                      <div class="title">关联字段</div>
                      <el-cascader
                        class="select-fkey-field"
                        v-model="rel.fField"
                        :options="item.ftables"
                        @change="relChange"
                        size="mini"
                      ></el-cascader>
                    </div>
                    <div class="fkey-field-item">
                      <div class="title">关联方式</div>
                      <el-select
                        class="select-fkey-field"
                        v-model="rel.reltype"
                        filterable
                        size="mini"
                      >
                        <el-option value="left join" label="左链接"></el-option>
                        <el-option value="join" label="内链接"></el-option>
                        <el-option value="right join" label="右链接"></el-option>
                      </el-select>
                    </div>
                    <div class="fkey-field-oper">
                      <i
                        class="el-icon-close"
                        v-if="item.rellist.length > 1"
                        @click="onRemoveRel(item, i)"
                        title="删除关联配置"
                      ></i>
                      <i class="el-icon-plus" @click="onAddRel(item)" title="添加关联配置"></i>
                    </div>
                  </div>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button @click="resetFields">重 置</el-button>
          <el-button v-loading="submitLoading" type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  ref,
  PropType,
} from "vue";
import { getfieldsByTableId } from "@/api/homeApi/index";
import { deepClone, messageAlert } from "@/utils/utils";
import { getModelByApp, getPageByModel } from "@/api/userApi";
import { useDesign } from "@/use/useDesign";

const props = {
  /**是否显示 */
  visible: Boolean,
  setting: Array as PropType<TableSet[]>,
};

type State = {
  setTableList: TableSet[];
};
// 关联表配置
type TableSet = {
  id?: string | number;
  cascaderId?: [];
  key?: string | number;
  tableName?: string | number;
  tableRemark?: string;
  fields?: Field[];
  ftables?: FTable[];
  rellist?: RelFieldSet[];
};
// 关联表属性
type Field = {
  fieldName?: string;
  fieldRemark?: string;
  check?: boolean;
};
// 外键表
type FTable = {
  id?: number;
  label?: string;
  value?: string;
  children?: FTable[];
};
// 关联属性配置
type RelFieldSet = {
  key?: string | number;
  tableName?: string | number;
  field?: string;
  fField: [number | string, string] | [];
  reltype: "join" | "left join" | "right";
};

export default defineComponent({
  props: props,
  emits: ["update:visible", "onSubmit"],
  setup(props, { emit }) {

    const { appList } = useDesign();

    const state = reactive<State>({
      setTableList: [] as any,
    });

    // 可选数据库表列表
    const submitLoading = ref<boolean>(false);

    watch(
      () => props.visible,
      (value) => {
        if (value) {
          state.setTableList = deepClone(props.setting);
          if (!state.setTableList || state.setTableList.length === 0) {
            state.setTableList = [
              {
                id: undefined,
                cascaderId: [],
                tableName: undefined,
                tableRemark: undefined,
                key: +new Date(),
              },
            ];
          }
          if (state.setTableList && state.setTableList.length > 0) {
            state.setTableList[0].id &&
              state.setTableList.forEach((item) => {
                getfieldsByTableId({ tableId: item.id }).then((res) => {
                  const fieldArr = item.fields;
                  item.fields = res.data.map((m) => {
                    return {
                      fieldName: m.fieldName,
                      fieldRemark: m.fieldRemark,
                      check: false,
                    };
                  });
                  item.fields?.forEach((element) => {
                    fieldArr?.forEach((el) => {
                      if (element.fieldName == el.fieldName) {
                        element.check = true;
                      }
                    });
                  });
                });
              });
          }
        }
      }
    );

    function beforeClose() {
      emit("update:visible", false);
    }

    function onCancel() {
      beforeClose();
    }

    function resetFields() {
      state.setTableList = [
        {
          id: undefined,
          cascaderId: [],
          tableName: undefined,
          tableRemark: undefined,
          key: +new Date(),
        },
      ];
    }

    /**
     * 获取字段属性配置
     */
    function getFieldProps() {
      const props = {
        lazy: true,
        lazyLoad: async (node, resolve) => {
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
                  tableName: m.pageTableName,
                  leaf: level >= 2,
                };
              });
              resolve(nodes);
            }
          }
        },
      };
      return props;
    }

    async function onSubmit() {
      let message: string = "";
      state.setTableList.forEach((m, index) => {
        if (!m.id) {
          message += `表设置项${index + 1}：信息不完整。<br/>`;
        }
        if (m.fields && m.fields.length > 0) {
          m.fields = m.fields.filter((ele) => ele.check == true);
        }
        if (m.rellist && m.rellist.length > 0) {
          const hasNull = m.rellist.find(
            (f) => !f.field || !f.fField.length === 0
          );
          hasNull &&
            (message += `表设置项${index + 1} - 关联设置：信息不完整。<br/>`);
        }
      });
      if (message) {
        messageAlert("error", message, true);
        return;
      }
      emit("onSubmit", state.setTableList);
      emit("update:visible", false);
    }

    function checkedField(field) {
      if (field.fieldName === "id") {
        return;
      }
      return (field.check = !field.check);
    }

    async function getFieldByPage(item: any, index: number, refs: any) {
      item.id = item.cascaderId[2];
      const tableCascaderRef = refs[`tableCascaderRef${index}`];
      const node = tableCascaderRef.getCheckedNodes(true);
      const tableName = node && node[0].data.tableName;
      const tableRemark = node && node[0].data.label;
      item.tableName = tableName;
      item.tableRemark = tableRemark;
      const res = await getfieldsByTableId({ tableId: item.id });
      if (res.code === 200) {
        item.fields = res.data.map((m) => {
          return {
            fieldName: m.fieldName,
            fieldRemark: m.fieldRemark,
            check: m.fieldName === "id" ? true : false,
          };
        });
        // 生成后续关联表的关联配置
        const { length } = state.setTableList;
        if (length > index + 1) {
          for (let i = index + 1; i < length; i++) {
            state.setTableList[i].ftables[index] = tableFieldToCasader(item);
          }
        }

      }
    }

    function deleteItem(index: number) {
      const item = state.setTableList[index];
      // 删除当前表后面的表中的关联结构
      const residueItems = state.setTableList.slice(
        index + 1,
        state.setTableList.length
      );
      for (let i = residueItems.length - 1; i >= 0; i--) {
        const table = residueItems[i];
        if (index === 0 && i === 0) {
          table.rellist = [];
          table.ftables = [];
        } else {
          const findex = table.ftables?.findIndex((f) => f.id === item.id);
          if (findex && findex > -1) {
            const tablename = table.ftables && table.ftables[findex].value;
            table.ftables && table.ftables.splice(findex, 1);
            for (let k = table.rellist.length - 1; k >= 0; k--) {
              const f = table.rellist[k];
              if (f.fField && f.fField[0] === tablename) {
                table.rellist.splice(k, 1);
              }
            }
          }
        }
      }
      state.setTableList.splice(index, 1);
    }
    // 关联表切换
    function relChange(val) {
      console.log(val);
    }

    function addItem() {
      const len = state.setTableList.length;
      let ftables = [];
      const rellist: any[] = [];
      // 设置新增项的可选外键表
      if (len > 0) {
        const tables = deepClone(state.setTableList.slice(0, len));
        ftables = tables.map((table) => {
          return tableFieldToCasader(table);
        });
        rellist.push({
          key: +new Date(),
          field: [],
          tableName: "",
          fField: [],
          reltype: "join",
        });
      }
      // rellist 结构：[{field:[],fField:[],reltype:'join'}]
      state.setTableList.push({
        id: undefined,
        cascaderId: [],
        key: +new Date(),
        tableRemark: undefined,
        tableName: undefined,
        fields: [],
        ftables,
        rellist,
      });
    }

    // 将表格列名属性转换成级联形式
    function tableFieldToCasader(table: any) {
      const _table: any = state.setTableList.find((f) => f.id === table.id);
      const tableField = {
        id: _table?.id,
        label: _table?.tableRemark,
        value: _table?.tableName,
        tableName: _table?.tableName,
        children: undefined,
      };
      if (table.fields && table.fields.length > 0) {
        tableField.children = table.fields.map((m) => {
          return {
            label: m.fieldRemark,
            value: m.fieldName,
            tableName: table.tableName,
          };
        });
      }
      return tableField;
    }
    function onRemoveRel(item, index) {
      item.rellist.length > 1 && item.rellist.splice(index, 1);
    }

    function onAddRel(item) {
      item.rellist.push({
        key: +new Date(),
        field: [],
        fField: [],
        reltype: "join",
      });
    }

    return {
      submitLoading,
      ...toRefs(state),
      beforeClose,
      onCancel,
      resetFields,
      onSubmit,
      getFieldProps,
      checkedField,
      deleteItem,
      addItem,
      onRemoveRel,
      onAddRel,
      relChange,
      getFieldByPage,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/components/datasourcesetting.scss";
</style>

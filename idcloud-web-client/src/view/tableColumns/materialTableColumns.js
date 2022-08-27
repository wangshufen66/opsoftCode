import auditTableColumns from './auditTableColumns';
import disableTableColumns from './disableTableColumns';

const materialInputPopupColumns = [{
        tag: "el-table-column",
        label: "物料代码",
        prop: "number",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "物料名称",
        prop: "name",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "规格型号",
        prop: "specification",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    // {
    //     tag: "el-table-column",
    //     label: "旧物料代码",
    //     prop: "oldNumber",
    //     minWidth: 180,
    //     showOverflowTooltip: true,
    //     comp: "String",
    // },
    {
        tag: "el-table-column",
        label: "单位代码",
        prop: "unitNumber",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "单位名称",
        prop: "unitName",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "物料类型",
        prop: "attribute",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "Select",
        options: [{
                label: "外购",
                value: "0",
                authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                },
            },
            {
                label: "自制",
                value: "1",
                authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                },
            },
            {
                label: "委外",
                value: "2",
                authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                },
            },
            {
                label: "虚拟件",
                value: "3",
                authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                },
            },
            {
                label: "配置",
                value: "4",
                authority: {
                    idLoad: false,
                    idIf: true,
                    idDisable: false,
                    idShow: true,
                },
            },
        ],
    },
    {
        tag: "el-table-column",
        label: "物料类别代码",
        prop: "typeNumber",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "物料类别名称",
        prop: "typeName",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    // {
    //   tag: "el-table-column",
    //   label: "入库超收比例(%)",
    //   prop: "storageOverCollectionRatio",
    //   minWidth: 120,
    //   showOverflowTooltip: true,
    //   comp: "Number",
    // },
    // {
    //   tag: "el-table-column",
    //   label: "出库超收比例(%)",
    //   prop: "storageUnderReceiptRatio",
    //   minWidth: 120,
    //   showOverflowTooltip: true,
    //   comp: "Number",
    // },
    // {
    //     tag: "el-table-column",
    //     label: "单价精度",
    //     prop: "pricePrecision",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Number",
    // },
    // {
    //     tag: "el-table-column",
    //     label: "采购单价",
    //     prop: "purchasePrice",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Number",
    // },
    // {
    //     tag: "el-table-column",
    //     label: "销售单价",
    //     prop: "salePrice",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Number",
    // },
    // {
    //     tag: "el-table-column",
    //     label: "关键件",
    //     prop: "isKeyModel",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Checkbox",
    // },
    {
        tag: "el-table-column",
        label: "批号管理",
        prop: "batchNumberManagementStatus",
        minWidth: 120,
        showOverflowTooltip: true,
        comp: "Checkbox",
    },
    {
        tag: "el-table-column",
        label: "序列号管理",
        prop: "serialNumberManagementStatus",
        minWidth: 120,
        showOverflowTooltip: true,
        comp: "Checkbox",
    },
    // {
    //     tag: "el-table-column",
    //     label: "最小库存",
    //     prop: "minStock",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Number",
    // },
    // {
    //     tag: "el-table-column",
    //     label: "安全库存",
    //     prop: "safetyStock",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Number",
    // },
    // {
    //     tag: "el-table-column",
    //     label: "最大库存",
    //     prop: "maxStock",
    //     minWidth: 120,
    //     showOverflowTooltip: true,
    //     comp: "Number",
    // },
    {
        tag: "el-table-column",
        label: "备注",
        prop: "note",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "制单人代码",
        prop: "docMakerNumber",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "制单人姓名",
        prop: "docMakerName",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "String",
    },
    {
        tag: "el-table-column",
        label: "创建时间",
        prop: "createTime",
        minWidth: 180,
        showOverflowTooltip: true,
        comp: "Datetime",
    },
    {
        tag: "el-table-column",
        label: "更新时间",
        prop: "updateTime",
        minWidth: 180,
        showOverflowTooltip: true,
        resizable: false,
        comp: "Datetime",
    },
];
const materialTableColumns = [materialInputPopupColumns, auditTableColumns, disableTableColumns].flat(1);
export { materialTableColumns as default, materialInputPopupColumns };
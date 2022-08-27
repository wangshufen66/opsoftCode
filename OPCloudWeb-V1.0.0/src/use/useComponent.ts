import useEmitter from '@/use/useEitter';
/**
 * 组件应用方法
 * @formModel 表单数据模型
 * @pageParmas 页面参数
 * @export
 */
export default function useComponent(formModel:any,pageParmas:any,){

    // useEmitter([
    //     // 自动生成自编码
    //     { key: 'on-create-autocode', value: autoCode },
    //     // 加载开窗表格数据
    //     { key: 'on-load-reltable-data', value: loadRelTableData },
    //     // 填充表格选择的数据
    //     { key: 'on-set-reltable-data', value: setRelTableData },
    //     // 删除主从表数据
    //     { key: 'on-del-tabtable-data', value: delTabTableData },
    //     // 编辑主从表数据
    //     { key: 'on-edit-tabtable-data', value: editTabTableData },
    //     // 新增主从表数据
    //     { key: 'on-add-tabtable-data', value: addTabTableData },
    //   ]);

    //   async function autoCode(component) {
    //     const params = {
    //       tableId: pageParmas.pageId,
    //       fieldName: component.__vModel__,
    //       isUnique: +component.__config__.unique,
    //       additionalConfiguration: {
    //         rule: component.autorule.type,
    //         numberLength: component.autorule.numLen,
    //         defaultAlphabetal: component.autorule.letter,
    //         dateFormat: component.autorule.dataformat,
    //       },
    //     };
    //     const res = await autoCodeRule(params);
      
    //     formModel[component.__vModel__] = res.data;
    //   }

}
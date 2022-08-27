import useDialog from "@/views/v3/out/useDialog";

export default function useSelectList(pageData, effect = false) {
  /**班组开窗 */
  const dialogGroup = useDialog({
    _param: {
      masterSearchForm: {
        //必须的搜索条件
      },
      //...其它自定义
    },
    _onConfirm: (_rows) => {
      //rows有值时，为emit出来的
      var rows = [];
      if (_rows) {
        rows = _rows;
      } else {
        rows = dialogGroup.innerRef.value.getResult().rows;
      }
      pageData.formData.shiftGroupName = rows[0].shiftGroupName;
      pageData.formData.shiftGroupId = rows[0].id;
      dialogGroup.reactiveData.visible = false;
    },
  });

  /**班次 */
  const dialogClass = useDialog({
    _param: {
      masterSearchForm: {
        //必须的搜索条件
      },
      //...其它自定义
    },
    _onConfirm: (_rows) => {
      //rows有值时，为emit出来的
      var rows = [];
      if (_rows) {
        rows = _rows;
      } else {
        rows = dialogClass.innerRef.value.getResult().rows;
      }
      pageData.formData.shiftSliceName = rows[0].shiftSliceName;
      pageData.formData.shiftSliceId = rows[0].id;
      dialogClass.reactiveData.visible = false;
    },
  });
  /**加工人员开窗 */
  const dialogEmployee = useDialog({
    _param: {
      masterSearchForm: {
        //必须的搜索条件
      },
      //...其它自定义
    },
    _onConfirm: (_rows) => {
      //rows有值时，为emit出来的
      var rows = [];
      if (_rows) {
        rows = _rows;
      } else {
        rows = dialogEmployee.innerRef.value.getResult().rows;
      }
      pageData.formData.employeeName = rows[0].employeeName;
      pageData.formData.processingEmpId = rows[0].id;
      if (effect) {
        pageData.formData.shiftSliceName = rows[0].shiftSliceName;
        pageData.formData.shiftSliceId = rows[0].shiftSliceId;
        pageData.formData.shiftGroupName = rows[0].shiftGroupName;
        pageData.formData.shiftGroupId = rows[0].shiftGroupId;
      }
      dialogEmployee.reactiveData.visible = false;
    },
  });
  /**加工单元 */
  const dialogFacotry = useDialog({
    _param: {
      masterSearchForm: {
        //必须的搜索条件
      },
      //...其它自定义
    },
    _onConfirm: (_rows) => {
      //rows有值时，为emit出来的
      var rows = [];
      if (_rows) {
        rows = _rows;
      } else {
        rows = dialogFacotry.innerRef.value.getResult().rows;
      }
      pageData.formData.machiningUnitName = rows[0]._text;
      pageData.formData.machiningUnitId = rows[0]._value;
      dialogFacotry.reactiveData.visible = false;
    },
  });

  return {
    dialogGroup,
    dialogClass,
    dialogEmployee,
    dialogFacotry,
  };
}

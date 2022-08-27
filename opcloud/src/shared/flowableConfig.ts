//监听器数组
export interface listenerArr {
  listenersArr: Array<{
    eventType?: string;
    params?: any;
    listenerType?: string;
    value?: string;
  }>;
  listenerTypes: Array<{
    value: string;
    label: string;
  }>;
}
//监听器表格
export interface param {
  listenerParams: any;
  showParamsDrawer: boolean;
  editIndex: number;
}

//按钮编辑
export interface btn{
  buttonsArr:Array<{
    name?: string;
    nameSpace: string;
    value?: string;
  }>;
  buttonTypes:Array<{
    value: string;
    label: string;
  }>;
}


//工具栏
export interface form {
  activeName: string,
  haveData: boolean,
  formData: any,
  rules: any
}

//value值
export interface valueInp {
  showSelect: boolean,
  valueList: any
}
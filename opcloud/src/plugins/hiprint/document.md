## 打印功能使用说明

### 设置字段名
``` js
hiprinttemplate.setFields([
   {field:'name',text:'名称'}
])
```

### 远程打印配置
``` js
window.WebSocket ? this.socket || (this.socket = io("http://localhost:17521",
```
修改地址为远程打印服务地址 

### 执行打印
``` js
const hiprinttemplate=new hiprint.PrintTemplate({template:'模板配置'});
// 打印数据
const data={
    field1:''
};
hiprinttemplate.print(data);
```


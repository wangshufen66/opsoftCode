# 代码规范

## JS 

1. 变量命名必须是驼峰模式，首字母小写，命名必须是能表达出名称含义的英文或者简写
，如：```userName```。错误方式：~~```UserName、yhm```~~

2. 文件夹小写命名。路由名称必须小写名称

2. 私有变量必须以```"_"```开头
3. 事件方法必须以```"on"```开头
4. 常量必须用```const```，变量```let```。定义变量```优先```
5. ```typescript```使用时，变量、方法、方法参数都必须注明类型
6. vue中编码顺序

```import node_modules```(导入node_modules) 

```import 本项目模块``` 

```import 组件``` 

```import css```（vite2 modules模块）

```props定义``` 

```emits定义``` 

```ref类型定义``` 

```reactive类型定义```

```常量、变量定义``` 

```computed定义``` 

```方法函数、事件定义``` 

```onmounted生命周期定义``` 

```return 结构``` 

## CSS
1. 命名规则：全小写，如描述过长，用```"-"```进行分隔，如```user-info、user-item、element-name-item```
2. 文件夹命名建议使用小写字母

3. scss、less代码的嵌套深度不能超过3级 
4. 按功能模块创建文件夹

## 框架结构

### api接口配置 

配置地址
``` js
src/api 
```
规则：每个模块创建一个目录。如：用户相关接口存放在user文件夹 

 ### 资源文件
 ```assets``` 

 ```src/assets``` 
 1. images：图片文件夹（需要编译处理的图片，非编译处理图片放到```public```文件夹中）
2. fonts:字体文件夹

### 组件
```components``` 

通用组件位置，按功能创建文件夹

### 配置文件 
```config``` 

pageSetting:页面配置文件夹，按页面创建文件夹

### 接口文件
```interfaces``` 


### 布局组件
```layout``` 

### mock配置文件
```mock``` 

### 插件文件
```plugins```

### 路由配置
```router```

### 状态管理
```store``` 

### 样式文件夹
```styles``` 

### typeScript类型定义文件
```types```

### 工具类定义
```utils```

### 页面定义
```views```



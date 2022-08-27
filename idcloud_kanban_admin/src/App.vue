<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default{
  name: 'App'
  // beforeCreate: function() {
  //   console.group('beforeCreate 创建前状态===============》')
  //   console.log('%c%s', 'color:red', 'el     : ') // undefined
  //   console.log('%c%s', 'color:red', 'data   : ') // undefined
  //   console.log('%c%s', 'color:red', 'message: ')// undefined
  //   this.getConfigJson()
  // }
  // created: function() {
  //   console.group('created 创建完毕状态===============》')
  //   console.log('%c%s', 'color:red', 'el     : ') // undefined
  //   console.log('%c%s', 'color:green', 'data   : ') // [object Object]  =>  已被初始化
  //   console.log('%c%s', 'color:green', 'message: ') // Welcome Vue  =>  已被初始化
  // },
  // beforeMount: function() {
  //   console.group('beforeMount 挂载前状态===============》')
  //   console.log('%c%s', 'color:green', 'el     : ') // 已被初始化
  //   console.log('%c%s', 'color:green', 'data   : ') // 已被初始化
  //   console.log('%c%s', 'color:green', 'message: ') // 已被初始化
  // },
  // mounted: function() {
  //   console.group('mounted 挂载结束状态===============》')
  //   console.log('%c%s', 'color:green', 'el     : ') // 已被初始化
  //   console.log('%c%s', 'color:green', 'data   : ') // 已被初始化
  //   console.log('%c%s', 'color:green', 'message: ') // 已被初始
  // },
  // beforeUpdate: function() {
  //   console.group('beforeUpdate 更新前状态===============》') // 这里指的是页面渲染新数据之前
  //   console.log('%c%s', 'color:green', 'el     : ')
  //   console.log('%c%s', 'color:green', 'data   : ')
  //   console.log('%c%s', 'color:green', 'message: ')
  // },
  // updated: function() {
  //   console.group('updated 更新完成状态===============》')
  //   console.log('%c%s', 'color:green', 'el     : ')
  //   console.log('%c%s', 'color:green', 'data   : ')
  //   console.log('%c%s', 'color:green', 'message: ')
  // },
  // beforeDestroy: function() {
  //   console.group('beforeDestroy 销毁前状态===============》')
  //   console.log('%c%s', 'color:red', 'el     : ')
  //   console.log('%c%s', 'color:red', 'data   : ')
  //   console.log('%c%s', 'color:red', 'message: ')
  // },
  // destroyed: function() {
  //   console.group('destroyed 销毁完成状态===============》')
  //   console.log('%c%s', 'color:red', 'el     : ')
  //   console.log('%c%s', 'color:red', 'data   : ')
  //   console.log('%c%s', 'color:red', 'message: ')
  // }
}
</script>

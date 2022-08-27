/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-07-27 16:54:38
 * @LastEditTime: 2019-08-10 14:39:05
 * @LastEditors: Please set LastEditors
 */
const path = require('path')
// ------ 19-12-26 ------- 尝试优化app.js大小， take1  gzip  实验者 cc ---------------
// ------- 19-12-26 ------ 暂时失败， 成功压缩，也成功可以让浏览器得到app.js.gz 0.js.gz ......但是显示空白  (blank page) 原因Unexpected token <
// ------ 19-12-27-------- 已通过nginx反向代理设置压缩。7080端口为未压缩版，7081为压缩版，可以感受一下速度差距。
// const CompressionPlugin = require('compression-webpack-plugin')

// ------ 19-12-26 尝试实现路由懒加载  ---------
// ------- 19-12-26 路由懒加载成功------

const resolve = dir => {
  return path.join(__dirname, dir)
}

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? '/'
//   : '/'

// 生产环境下清除console打印
const plugins = []
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // baseUrl: BASE_URL,
  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  // 如果你不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))
    config.plugins.delete('prefetch')
    // config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // const svgRule = config.module.rule('svg')
    // svgRule.uses.clear()
    // svgRule
    //   .test(/\.svg$/)
    //   .include.add(path.resolve(__dirname, './src/icons'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]'
    //   })
    // const fileRule = config.module.rule('file')
    // fileRule.uses.clear()
    // fileRule
    //   .test(/\.svg$/)
    //   .exclude.add(path.resolve(__dirname, './src/icons'))
    //   .end()
    //   .use('file-loader')
    //   .loader('file-loader')
  },
  // configureWebpack: config => {
  //   config.plugins = [...config.plugins,
  //     new CompressionPlugin({
  //       // test: /\.js$|\.html$|.\css/, // 匹配文件名
  //       test: /46.js/, // 匹配文件名
  //       threshold: 10240, // 对超过10k的数据压缩
  //       deleteOriginalAssets: true // 删除源文件
  //     })
  //   ]
  // },

  // 设为false打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    disableHostCheck: true,
    // proxy: 'http://127.0.0.1:8081/idcloud',
    proxy: 'http://47.111.112.200:7060/idcloud'
  }
  // configureWebpack: config => {
  //   config['externals'] = {
  //     'AMap': 'AMap',
  //     'AMapUI': 'AMapUI'
  //   }
  // }
  // 去除所有AMap防止内网报错
  // configureWebpack: {
  //   externals: {
  //     'AMap': 'AMap',
  //     'AMapUI': 'AMapUI'
  //   }
  // }
}

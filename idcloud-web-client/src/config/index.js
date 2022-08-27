export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: "IDCLOUD",
    /**
     * @description cookies中token的key
     */
    tokenKey: "token",
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     */
    // https enabled
    baseUrl: {
        // dev: 'http://47.111.112.200:7060/idcloud',
        // dev: "http://192.168.0.167:7060/idcloud",
        dev: "http://192.168.83.5:7060/idcloud", //中鼎
        // dev: "http://192.168.0.29:7060/idcloud", //文星本地
        // dev: "http://api.idcloud.group/idcloud", //
        // dev: "http://192.168.32.88:7060/idcloud",
        // pro: 'https://apitest.idcloud.group/idcloud', // window.g.BASE_API
        // pro: "https://api.idcloud.group/idcloud", // window.g.BASE_API
        pro: "http://192.168.83.5:7060/idcloud", // 中鼎
        // dev: 'http://192.168.1.254:7060/idcloud', // 千机
        // pro: 'http://192.168.1.254:7060/idcloud', // 千机
        // pro: 'http://192.168.99.52:7060/idcloud', // window.g.BASE_API
        fdfsAddress: "https://fs.idcloud.group"
            // fdfsAddress: 'http://192.168.99.52:8898'
    },
    kanbanUrl: {
        devUrl: "http://localhost:9001",
        // devUrl: "https://kbdemo.idcloud.group",
        prodUrl: "https://ikb.idcloud.group"
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: "home",
    /**
     * @description 需要加载的插件
     */
    // productionGzip: true,

    plugin: {
        "error-store": {
            showInHeader: true, // 设为false后不会在顶部显示错误日志徽标
            developmentOff: true // 设为true后在开发环境不会收集错误信息，方便开发中排查错误
        }
    }
};
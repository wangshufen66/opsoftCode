## idcloud-app-uniapp
#### 基本配置
* 配置后台请求url， 在@/common/js/baseUrl下
* http请求经过一层封装，请引用@/common/js/request 来建立请求。 目前可实现Bear token, 长期登录自动刷新token。 具体可能需要根据需求进行调整。
* 分模块的应用配置在@/common/js/appListConfig中进行配置， 开发新模块，请修改该文件并在pages.json中添加模块路由。
* 如果后台不是idcloud统一的后台，请自己实现请求模块。

#### 关于打包
* 使用@/key下的 idcloud-app.keystore 进行打包，该key 信息：

* SHA1: 90:1B:B3:96:A7:9F:B2:AB:13:09:BB:93:D2:21:D6:A0:0D:B8:1C:6A
* SHA256: 47:43:11:29:35:4C:BC:47:6E:78:93:CA:56:DF:36:4D:F3:E3:B7:35:8A:0C:AA:28:4B:A0:54:3E:29:E5:0B:41
* cert alias: appkey
* private key password: idc123456
* 项目打包包名：opsoft.idcloud.app

* 别名: testalias
* 创建日期: 2021-2-25
* 条目类型: PrivateKeyEntry
* 证书链长度: 1
* 证书[1]:
* 所有者: CN=Ma, OU=OPSoft, O=OPSoft, L=Suzhou, ST=Jiangsu, C=China
* 发布者: CN=Ma, OU=OPSoft, O=OPSoft, L=Suzhou, ST=Jiangsu, C=China
* 序列号: 1671ffbf
* 有效期为 Thu Feb 25 09:38:29 CST 2021 至 Sat Feb 01 09:38:29 CST 2121
* 证书指纹:
         MD5:  A9:6B:83:7C:0A:05:3E:ED:74:3B:8A:34:95:60:B9:F4
         SHA1: 90:41:34:65:C1:B0:9D:50:A5:E4:2F:F8:E3:13:76:08:F0:61:9C:37
         SHA256: B8:9B:D7:8D:5F:5C:0D:B0:73:AD:57:64:13:2B:35:D3:DA:1D:CE:D5:DB:5F:FB:3C:43:7F:21:FE:93:E5:6E:BE
* 签名算法名称: SHA256withRSA
* 密码：123456
#### 请在更新版本后更新@/config下文件 和 manifest！

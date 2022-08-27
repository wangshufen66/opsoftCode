import router from '../../router';
import { Message } from 'element-ui';

const instance = axios.create();

instance.interceptors.request.use(
  (config) => {
    // 获取储存中本地的维护状态，localStorageGet方法，超过10分钟返回false
    let maintenance = localStorageGet('maintenance');
    // 如果本地不存在 maintenance 或 获取超过10分钟，重新获取
    if (!maintenance) {
      return checkMaintenance()
        .then((res) => {
          if (res.IsRun) {
            // 获取session中的access_token
            let access_token = sessionStorage.getItem('access_token');
            // 如果不存在字段，则跳转到登录页面
            if (!access_token) {
              router.push({
                path: '/login',
                query: { redirect: router.currentRoute.fullPath },
              });
              // 终止这个请求
              return Promise.reject();
            } else {
              config.headers.Authorization = `bearer ${access_token}`;
            }
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            // 这一步就是允许发送请求
            return config;
          } else {
            // 如果服务器正在维护，跳转到维护页面，显示维护信息
            router.push({
              path: '/maintenance',
              query: { redirect: res.errMsg },
            });
            return Promise.reject();
          }
        })
        .catch(() => {
          // 获取服务器运行状态失败
          return Promise.reject();
        });
    } else {
      // 本地存在 maintenance
      if (maintenance.IsRun) {
        let access_token = sessionStorage.getItem('access_token');
        if (!access_token) {
          router.push({
            path: '/login',
            query: { redirect: router.currentRoute.fullPath },
          });
          return Promise.reject();
        } else {
          config.headers.Authorization = `bearer ${access_token}`;
        }
        config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        return config;
      } else {
        router.push({
          path: '/maintenance',
          query: { redirect: maintenance.errMsg },
        });
        return Promise.reject();
      }
    }
  },
  (err) => {
    // err为错误对象，但是在我的项目中，除非网络问题才会出现
    return Promise.reject(err);
  }
);


instance.interceptors.response.use(
    response => {
      // access_token不存在或过期
      if (response.data.ErrorTypeCode === 10003) {
        const config = response.config
        return getRefreshToken()
          .then(() => {
            // 重新设置
            let access_token = sessionStorage.getItem('access_token');
            config.headers.Authorization = `bearer ${access_token}`;
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            // 重新请求
            // 如果请求的时候refresh_token也过期
            return instance(config).then(res => {
              if (res.data.ErrorTypeCode === 10004) {
                router.push({
                  path: '/login',
                  query: { redirect: router.currentRoute.fullPath }
                });
                return Promise.reject();
              }
              // 使响应结果省略data字段
              return Promise.resolve(response.data);
            });
          })
          .catch(() => {
            // refreshtoken 获取失败就只能到登录页面
            router.push({
              path: '/login',
              query: { redirect: router.currentRoute.fullPath }
            });
            return Promise.reject();
          });
      }
      // refresh_token不存在或过期
      if (response.data.ErrorTypeCode == 10004) {
        router.push({
          path: '/login',
          query: { redirect: router.currentRoute.fullPath }
        });
        return Promise.reject();
      }
      // 使响应结果省略data字段
      return response.data;
    },
    err => {
      return Promise.reject(err);
    }
  );
  
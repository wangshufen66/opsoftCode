import axios from "axios";
import store from "@/store";
import Cookies from "js-cookie";
// cookie保存的天数
import _config from "@/config";

import ElementUI from 'element-ui'

const {
  tokenKey,
  homeName,
} = _config;

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {}; // 请求队列
  }

  getInsideConfig() {
    return {
      baseURL: this.baseUrl,
      headers: {}
    };
  }

  destroy(url) {
    delete this.queue[url];
    if (!Object.keys(this.queue).length) {
    }
  }

  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(
      config => {
        //  请求头添加token信息
        let _token = store.state.user.token;
        config.headers["Authorization"] = "Bearer " + _token; // Bearer后要加空格
        config.headers['platform'] = 'pc';
        // 判断是否到达token更新时间，如果到了就请求更新token接口更新token和过期时间
        this.queue[url] = true;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    // 响应拦截
    instance.interceptors.response.use(
      res => {
        this.destroy(url);

        // 如果token过期跳转登陆页
        if (res.data.code === 402) {
          ElementUI.Notification({
            title: '失败',
            message: '登录授权失效！请重新登录！3秒后自动跳转到登录界面!',
            type: 'warning'
          });
          setTimeout(() => {
            // store.commit('setTagNavList', store.state.app.tagNavList.filter(
            //   (item) => item.name === homeName));
            // // 清除cookies
            Cookies.remove(tokenKey);
            location.pathname = "login";
          }, 3000);
        } else if (res.data.code === 444) {
          ElementUI.Notification({
            title: '失败',
            message: res.data.msg + '3秒后自动跳转到登录界面!',
            type: 'warning'
          });
          setTimeout(() => {
            // store.commit('setTagNavList', store.state.app.tagNavList.filter(
            //   (item) => item.name === homeName));
            // // 清除cookies
            Cookies.remove(tokenKey);
            location.pathname = "login";
          }, 3000);
        } else {
          const {
            data,
            status
          } = res;
          return {
            data,
            status
          };
        }
      },
      error => {
        this.destroy(url);
        let errorInfo = error.response;
        if (!errorInfo) {
          const {
            request: {
              statusText,
              status
            },
            config
          } = JSON.parse(JSON.stringify(error));
          errorInfo = {
            statusText,
            status,
            request: {
              responseURL: config.url
            }
          };
        }
        return Promise.reject(error);
      }
    );
  }

  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}

export default HttpRequest;

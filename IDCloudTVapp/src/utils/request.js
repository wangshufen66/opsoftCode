import axios from 'axios';
import './config';
import {WToast} from 'react-native-smart-tip';
/**
 * 网络请求
 * @returns
 */
function request() {
  const service = axios.create({
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 1000 * 15,
    baseURL: !global.constants.intranet
      ? global.constants.apiUrl
      : global.constants._apiUrl,
  });

  // 拦截请求
  service.interceptors.request.use(
    (config) => {
      config.headers.platform = 'mobile';
      config.baseURL = !global.constants.intranet
        ? global.constants.apiUrl
        : global.constants._apiUrl;
      console.log('config', config);
      // WToast.show({
      //   data: JSON.stringify(config),
      //   position: WToast.position.CENTER,
      //   duration: 1000 * 60,
      // });
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // 响应前拦截器
  service.interceptors.response.use(
    (response) => {
      if (response.data.code === 200 || response.data.code === 0) {
        return response.data.data;
      } else {
        return Promise.reject(response.data.msg);
      }
    },
    (err) => {
      return Promise.reject(err.message);
    },
  );

  return service;
}
const _request = request();

export default _request;

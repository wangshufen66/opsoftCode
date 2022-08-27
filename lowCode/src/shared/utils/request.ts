import axios, { AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse, AxiosResponseHeaders } from 'axios';
import dayjs from 'dayjs';
import type { Nullable } from 'src/shared/types';
import { getToken, messageAlert, removeToken } from './utils';

/**
 * 返回结果
 */
export type ResponseResult = {
  /**状态码 */
  code: number | string;
  /**返回数据 */
  data?: Nullable<any>;
  /**提示信息 */
  msg?: string;
};

type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

export type RequestOptions = {
  baseUrl?: string;
  /**响应类型 */
  responseType?: ResponseType;
  contentType?: string;
  isBasic?: boolean;
};

type MethodType = 'post' | 'get' | 'delete' | 'put';

/**请求队列 */
const requestTuple: [boolean | null, Array<any>] = [null, []];

/**
 * 网络请求
 * @param method 请求方式
 * @param url 请求地址
 * @param options 请求配置
 */
export function fetch(method: MethodType = 'get', url: string, params: any = {}, options?: RequestOptions) {
  return request(options)[method](url, params);
}

/**
 * request
 * @param options 请求配置
 */
function request(options: RequestOptions = {}): AxiosInstance {
  const { baseUrl: baseURL = '/', responseType = 'json', contentType = '' } = options;

  const service = axios.create({
    // 响应类型
    responseType,
    // 请求头
    headers: {
      'Content-Type': contentType || 'application/json',
    },
    // 超时时间
    timeout: 1000 * 30,
    // 跟地址
    baseURL,
    // 请求数据处理
    transformRequest: [(data, config) => transformRequest(data, config)],
    // 响应数据处理
    transformResponse: [(data, config) => transformResponse(data, config)],
  });

  // 请求拦截器
  service.interceptors.request.use((config: AxiosRequestConfig) => {
    if (requestTuple[0] == null) {
      config.checkReq = true;
      requestTuple[0] = false;
      requestTuple[1] = [];
    } else {
      if (requestTuple[0] === false) {
        requestTuple[1].push(config);
        return Promise.reject();
      }
    }
    let token = getToken('accessToken');
    if (!!token) {
      config.headers && (config.headers.Authorization = `Bearer ${token}`);
    }
    return config;
  });

  // 响应拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const responseType = response.headers['content-disposition'];
      // 下载文件
      if (responseType && responseType.indexOf('attachment;') > -1) {
        return handleDownload(response);
      }
      if (response.config.url === 'opcloud/oauth/token') {
        return response.data;
      }
      noPermission(response);
      const message = responseStatus(response);
      message && messageAlert('error', message, false, 2500);
      return response.data;
    },
    (err: any) => {
      let errmsg = '';
      if (!err) {
        return Promise.reject('cancel');
      }
      const { response, message, config } = err;
      if (!response) {
        if (/[timeout of]\s+\d+ms\s+[exceeded]/.test(message)) {
          errmsg = '请求超时，请检查网络';
        }
      } else {
        if (response.status == 401 && config.checkReq === true) {
          requestTuple[0] = false;
        }
        errmsg = responseStatus(response);
      }
      errmsg && messageAlert('error', errmsg, false, 2500);
      // 异常的时候，resolve回去
      return [false, errmsg];
    }
  );

  /**
   * 无权限拦截处理
   * @param response 响应对象
   */
  function noPermission(response: AxiosResponse) {
    const { config, data } = response;
    // 当前响应是需检验请求
    if (config.checkReq == true && data.code == 401) {
      requestTuple[1] = [];
      requestTuple[0] = false;
    } else {
      requestTuple[0] = true;
      postQueueList();
    }
  }

  /**
   * 发送队列请求
   */
  function postQueueList() {
    const queueList = requestTuple[1];
    if (queueList && queueList.length > 0) {
      for (let i = queueList.length - 1; i >= 0; i--) {
        const config = queueList[i];
        service(config).then((response) => {
          const message = responseStatus(response);
          message && messageAlert('error', message, false, 2500);
          return Promise.resolve(response.data);
        });
        queueList.splice(i, 1);
      }
    }
  }

  return service;
}

/**
 * 请求数据转换器
 * @param data 数据
 * @param config 请求头
 */
function transformRequest(data: any, config?: AxiosRequestHeaders): void {}

/**
 * 响应数据转换器
 * @param data 数据
 * @param config 响应头
 */
function transformResponse(data: any, config?: AxiosResponseHeaders): void {}

/**
 * 处理文件下载请求
 * @param response
 * @returns
 */
function handleDownload(response: AxiosResponse<any>) {
  //如果返回的是json，则表示非文件
  if (response.config.responseType === 'json') {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = JSON.parse(e.target.result);
      if (data.code === 1) {
        return data.data;
      } else {
        messageAlert('error', data.msg, false, 2500);
        return null;
      }
    };
    reader.readAsText(response.data);
    return;
  }

  const blob = new Blob([response.data]);
  const url: string = window.URL.createObjectURL(blob);

  let fileName = '';
  // 如果响应头包content-disposition'属性，则从该属性中获取文件名称
  const disposition = response.headers['content-disposition'];
  if (disposition) {
    fileName = decodeURI(disposition.split("''")[1]);
  }
  //如果文件名不存在，则使用时间戳
  if (!fileName) {
    fileName = String(+new Date());
  }

  fileName = fileName.replace(/(.*_)(\d+)(\.\w+)/, (context, $1, $2, $3) => {
    let str = dayjs(+$2).format('YYYYMMDDHHmmss');
    return `${$1}${str}${$3}`;
  });

  //通过模拟a标签点击事件下载文件
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return { code: 200 };
}

/**
 * 用户失效
 */
function userInvalid(response: AxiosResponse): string {
  removeToken();
  emitter.emit('login-out');
  return response.data?.msg || '登录信息已过期，请重新登录';
}
/**http状态码异常 */
function responseStatus(response: AxiosResponse): string {
  const status = response.status;
  let message: string = '';
  switch (status) {
    case 404:
      message = '数据接口异常';
      break;
    case 401:
      message = userInvalid(response);
      break;
    case 400:
      message = response.data?.msg || '参数错误';
      break;
    case 500:
      message = response.data?.msg || '服务异常,请重试';
      break;
    case 200:
      message = responseSuccess(response);
      break;
  }
  return message;
}

/**
 * 响应成功code异常
 */
function responseSuccess(response: AxiosResponse): string {
  const { code, msg } = response.data;
  switch (code) {
    case 401:
      return userInvalid(response);
    case 500:
      return msg || '服务异常';
    case -1:
      return msg || '服务异常';
    case 200:
      return '';
    case 203:
      return msg || '服务异常';
    default:
      return '';
  }
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getStorage, getToken, removeToken, messageAlert } from "./utils";
import dayjs from "dayjs";
import router from "./../router";

export interface IRequest {
  service: AxiosInstance;
}

export type ResponseType = {
  code: number | string;
  data?: any | null;
  msg?: string;
};

export type RequestOptions = {
  responseType?:
    | "arraybuffer"
    | "blob"
    | "document"
    | "json"
    | "text"
    | "stream";
  contentType?: string;
  // 是否为Basic方式
  isBasic?: boolean;
};

// 返回结构[数据，返回状态]
export type ResponseTuple = [any, boolean];

/**
 * 网络请求
 * @param contentType 数据类型:默认application/json
 * @returns
 */
function request(option?: RequestOptions): AxiosInstance {
  const baseURL = import.meta.env.DEV ? "/" : getStorage("api-address");
  const service = axios.create({
    responseType: option?.responseType,
    headers: {
      "Content-Type": option?.contentType || "application/json",
    },
    timeout: 1000 * 30,
    baseURL: baseURL || "/",
    // 请求数据处理
    transformRequest: [(data, config) => transformRequest(data, config)],
    transformResponse: [(data, config) => transformResponse(data, config)],
  });

  // 拦截请求
  service.interceptors.request.use((config: AxiosRequestConfig) => {
    // 测试环境专用，方便后端测试开发
    // const apiAddress = getStorage("api-address");
    // if (!import.meta.env.DEV && apiAddress) {
    //   config.url?.indexOf("/flowable") > -1 &&
    //     (config.url = config.url?.replace("/flowable", "/opcloud/flowable"));
    //   config.url?.indexOf("/api") > -1 &&
    //     (config.url = config.url?.replace("/api", ""));
    // }

    // const ignoreUrl: Array<string> = ['/dd/qrLogin']

    // const isIgnore: boolean = ignoreUrl.some(f => config.url?.indexOf(f))
    // if (isIgnore) {
    //   return config;
    // }
    let token = getToken("accessToken");
    if (!!token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 响应前拦截器
  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const responseType = response.headers["content-disposition"];
      // 下载文件
      if (responseType && responseType.indexOf("attachment;") > -1) {
        return handleDownload(response);
      }
      if (response.config.url === "opcloud/oauth/token") {
        return response.data;
      }
      const message = responseStatus(response);
      message && messageAlert("error", message, false, 2500);
      return response.data;
      // 后续方案
      // return [response.data, true];
    },
    (err: any) => {
      let errmsg = "";
      if (!err.response) {
        if (/[timeout of]\s+\d+ms\s+[exceeded]/.test(err.message)) {
          errmsg = "请求超时，请检查网络";
        }
      } else {
        errmsg = responseStatus(err.response);
      }
      errmsg && messageAlert("error", errmsg, false, 2500);
      return Promise.reject(errmsg);
      // 后续方案
      // return [errmsg, false];
    }
  );
  return service;
}

function transformRequest(data: any, config: any) {
  // 是文件类型，则不做任何处理
  if (config["Content-Type"] === "multipart/form-data") {
    return data;
  }
  // 时间格式处理
  return formatDate(data);
}

function transformResponse(data: any, config: any) {
  // 是文件类型，则不做任何处理
  if (config["Content-Type"] === "multipart/form-data") {
    return data;
  }
  const contentDisposition = config["content-disposition"];
  if (contentDisposition && contentDisposition.indexOf("attachment;") > -1) {
    return data;
  }
  // 时间格式处理
  data = data.replace(
    /[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])T(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d\.\d{3}\+\d{4}/g,
    (math) => {
      return dayjs(math).format("YYYY-MM-DD HH:mm:ss");
    }
  );
  data = JSON.parse(data);
  return data;
}

/**
 * 默认时区处理
 */
function formatDate(data: any): any {
  Date.prototype.toJSON = function () {
    return dayjs(this).format("YYYY-MM-DD HH:mm:ss");
  };
  data = JSON.stringify(data);
  return data;
}

/**
 * 处理文件下载请求
 * @param response
 * @returns
 */
function handleDownload(response: AxiosResponse<any>) {
  //如果返回的是application/json，则表示返回的是json，没有要下载的问题，可能是逻辑处理失败
  if (response.headers === "application/json") {
    var reader = new FileReader();
    reader.onload = (e: any) => {
      var data = JSON.parse(e.target.result);
      if (data.code === 1) {
        return data.data;
      } else {
        messageAlert("error", data.msg, false, 2500);
        return null;
      }
    };
    reader.readAsText(response.data);
    return;
  }

  const blob = new Blob([response.data]);
  const url: string = window.URL.createObjectURL(blob);

  // 如果是预览直接返�
  if (response.config.headers["preview"]) return url;

  let fileName = "";
  // 如果响应头包�content-disposition'属性，则从该属性中获取文件名称
  let cd = response.headers["content-disposition"];
  if (cd) {
    fileName = decodeURI(cd.split("''")[1]);
  }

  //如果文件名不存在，则使用时间�
  if (!fileName) {
    fileName = new Date().getTime().toString();
  }

  fileName = fileName.replace(/(.*_)(\d+)(\.\w+)/, (context, $1, $2, $3) => {
    let str = dayjs(+$2).format("YYYYMMDDHHmmss");
    return `${$1}${str}${$3}`;
  });

  //通过模拟a标签点击事件下载文件
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return { code: 200 };
}

/**
 * 用户失效
 */
function userInvalid(response: AxiosResponse): string {
  setTimeout(() => {
    removeToken();
    const currentPath = router.currentRoute.value.fullPath;
    const redirect = currentPath === "/login" ? undefined : currentPath;
    router.replace({
      path: `/login`,
      query: { redirect: redirect && encodeURIComponent(redirect) },
    });
  }, 2500);
  return response.data?.msg || "登录信息已过期，请重新登录";
}
/**http状态码异常 */
function responseStatus(response: AxiosResponse): string {
  const status = response.status;
  let message: string = "";
  switch (status) {
    case 404:
      message = "数据接口异常";
      break;
    case 401:
      message = userInvalid(response);
      break;
    case 400:
      message = response.data?.msg || "参数错误";
      break;
    case 500:
      message = response.data?.msg || "服务异常,请重试";
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
      return msg || "服务异常";
    case -1:
      return msg || "服务异常";
    case 200:
      return "";
    case 203:
      return msg || "服务异常";
    default:
      return "";
  }
}

export default request;

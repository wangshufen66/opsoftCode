//公共方法 获取token,storage  设置token,storage 移除token,storage  深拷贝   防抖  confirm弹窗方法  messageAlert消息提示  图片路径getImageUrl

import { ElMessage, ElMessageBox } from 'element-plus';
import { Nullable, Undefinedable } from 'src/shared/types';

/**
 * 获取用户token
 * @param key
 * @returns
 */
export function getToken(key: string): any {
  const session = localStorage.getItem(key);
  if (!session) {
    return undefined;
  }
  const data = JSON.parse(session);
  if (data !== null) {
    if (data.expirse != null && data.expirse < new Date().getTime()) {
      localStorage.removeItem(key);
    } else {
      return data.value;
    }
  }
  return null;
}

/**
 * 设置用户token,有效期两小时
 * @param key
 * @param value
 * @param expires
 */
export function setToken(key: string, value: any, expires: number): void {
  var data = { value: value, expirse: new Date().getTime() + expires * 1000 };
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * 移除token
 */
export function removeToken(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

/**
 * 获取Storage
 * @param key
 * @returns
 */
export function getStorage(key: string): Nullable<string> {
  let session = localStorage.getItem(key);
  if (session) {
    return JSON.parse(session || '');
  }
  return session;
}

/**
 * 设置Storage
 * @param key
 * @param value
 */
export function setStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 移除Storage
 * @param key
 */
export function removeStorage(key: string): void {
  localStorage.removeItem(key);
}

/**
 * 深拷贝对象
 * @param obj
 * @returns
 */
export function deepClone(obj: any): any {
  const _toString: Function = Object.prototype.toString;
  // null, undefined, non-object, function
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  // DOM Node
  if (obj.nodeType && 'cloneNode' in obj) {
    return obj.cloneNode(true);
  }
  // Date
  if (_toString.call(obj) === '[object Date]') {
    return new Date(obj.getTime());
  }
  // RegExp
  if (_toString.call(obj) === '[object RegExp]') {
    const flags: Array<string> = [];
    if (obj.global) {
      flags.push('g');
    }
    if (obj.multiline) {
      flags.push('m');
    }
    if (obj.ignoreCase) {
      flags.push('i');
    }

    return new RegExp(obj.source, flags.join(''));
  }
  const result: any = Array.isArray(obj) ? [] : obj.constructor ? new obj.constructor() : {};

  for (const key in obj) {
    result[key] = deepClone(obj[key]);
  }
  return result;
}

/**
 * 防抖
 * @param func
 * @param wait
 * @returns
 */
export function debounce(func: any, wait: Undefinedable<number>): () => any {
  let timer: any = null,
    result: any = null;
  return (...args: any[]) => {
    let context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      result = func.call(context, ...args);
      timer = null;
    }, wait);
    return result;
  };
}

/**
 * confirm弹窗方法
 * @param str
 * @param callback
 */
export function confirmBox(str: any, callback: () => any): void {
  ElMessageBox.confirm(`此操作将${str}, 是否继续?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        setTimeout(() => {
          done();
        }, 0);
      } else {
        done();
      }
    },
  })
    .then(async () => {
      callback && callback();
    })
    .catch(() => {});
}

/**
 * 消息提示
 * @param type
 * @param message
 * @param html
 * @param duration
 */
export function messageAlert(type: 'success' | 'warning' | 'error', message: string = '', html: boolean = false, duration: number = 3000): void {
  ElMessage({
    showClose: true,
    message: message,
    type: type,
    duration,
    dangerouslyUseHTMLString: html,
  });
}

/**
 * 获取图片路径
 * @param fileName
 * @returns
 */
export function getImageUrl(fileName: string): Nullable<string> {
  return new URL(`./../assets/images/${fileName}`, import.meta.url).href;
}

import { ElMessage, ElMessageBox } from 'element-plus';

/**
 * 获取用户token
 */
export function getToken(key: string): any | null {
  const session = localStorage.getItem(key);
  if (!session) {
    return null;
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
 * @param {*} value
 */
export function setToken(key: string, value: any, expires: number): void {
  var data = { value: value, expirse: new Date().getTime() + expires * 1000 };
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

export function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string): any {
  let session = localStorage.getItem(key);
  if (session) {
    return JSON.parse(session || '');
  }
  return session;
}

export function removeStorage(key: string) {
  localStorage.removeItem(key);
}

// 深拷贝对象
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
  const result: any = Array.isArray(obj)
    ? []
    : obj.constructor
    ? new obj.constructor()
    : {};

  for (const key in obj) {
    result[key] = deepClone(obj[key]);
  }
  return result;
}

//confirm弹窗方法
export function confirmBox(str, callback) {
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

//防抖
export function debounce(func, wait) {
  let timer = null,
    result = null;
  return function anonymous(...args) {
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
 * 消息提示
 * @export
 * @param type 类型
 * @param message 消息
 * @param html 是否为html
 * @param duration 消失时间
 */
export function messageAlert(
  type: 'success' | 'warning' | 'error',
  message: string,
  html: boolean = false,
  duration: number = 3000
) {
  ElMessage({
    showClose: true,
    message: message,
    type: type,
    duration,
    dangerouslyUseHTMLString: html,
  });
}

export function getImageUrl(fileName: string) {
  return new URL(`./../assets/images/${fileName}`, import.meta.url).href;
}

import { ElMessage, ElMessageBox } from "element-plus";

/**
 * 获取用户token
 */
export function getToken(key: string): any | null {
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
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function setStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string): any {
  let session = localStorage.getItem(key);
  if (session) {
    return JSON.parse(session || "");
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
  if (!obj || typeof obj !== "object") {
    return obj;
  }
  // DOM Node
  if (obj.nodeType && "cloneNode" in obj) {
    return obj.cloneNode(true);
  }
  // Date
  if (_toString.call(obj) === "[object Date]") {
    return new Date(obj.getTime());
  }
  // RegExp
  if (_toString.call(obj) === "[object RegExp]") {
    const flags: Array<string> = [];
    if (obj.global) {
      flags.push("g");
    }
    if (obj.multiline) {
      flags.push("m");
    }
    if (obj.ignoreCase) {
      flags.push("i");
    }

    return new RegExp(obj.source, flags.join(""));
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

export function getImageUrl(fileName: string) {
  return new URL(`./../assets/images/${fileName}`, import.meta.url).href;
}

//防抖
export function debounce(func, wait) {
  let timer: any = null,
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

//confirm弹窗方法
export function confirmBox(str, callback) {
  ElMessageBox.confirm(`此操作将${str}, 是否继续?`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
    beforeClose: (action, instance, done) => {
      if (action === "confirm") {
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
    .catch(() => { });
}

//confirm弹窗方法
export function confirmBoxAsync(str, callback) {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(`此操作将${str}, 是否继续?`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      beforeClose: (action, instance, done) => {
        if (action === "confirm") {
          setTimeout(() => {
            done();
          }, 0);
        } else {
          done();
        }
      },
    }).then(() => {
      resolve(callback && callback());
    });
  });
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
  type: "success" | "warning" | "error",
  message: string = "",
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
/**
 * 关闭提醒
 */
export function closeRemind() {
  window.onbeforeunload = function (e) {
    e = e || window.event;
    // 兼容IE8和Firefox 4之前的版本
    if (e) {
      e.returnValue = "关闭提示1111";
    }
    // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    return "关闭提示222";
  };
}

export function renderDictionTag(value, groupKey, emptyText) {
  value = "" + value;
  groupKey = "" + groupKey;

  //异步

  var groupMap = {
    completionStatus: [
      {
        text: "完成",
        value: "1",
      },
      {
        text: "未完成",
        value: "0",
      },
    ],
    sex: [
      {
        text: "男",
        value: "1",
      },
      {
        text: "女",
        value: "0",
      },
    ],
    gender: [
      {
        text: "男",
        value: "1",
      },
      {
        text: "女",
        value: "0",
      },
    ],
    isDeleted: [
      {
        text: "未删除",
        value: "0",
      },
      {
        text: "已删除",
        value: "1",
      },
    ],
    isDisabled: [
      {
        text: "禁用",
        value: "1",
      },
      {
        text: "启用",
        value: "0",
      },
    ],
    salaryType: [
      {
        text: "计时",
        value: "1",
      },
      {
        text: "计件",
        value: "0",
      },
    ],
    modelType: [{
      text: "区域",
      value: "10"
    }, {
      text: "车间",
      value: "20"
    }, {
      text: "产线",
      value: "30"
    }, {
      text: "加工单元",
      value: "40"
    }]
  };

  var arr = groupMap[groupKey] || [];

  if (arr.length > 0) {
    var cur = arr.find((x) => "" + x.value == "" + value);
    return cur ? cur.text : emptyText || "--";
  }
  return "--";
}


export function getDialogTypeName(showType) {
  if (showType == 2) {
    return "新增"
  } else if (showType == 4) {
    return "编辑"
  } else {
    return "详情"
  }
}
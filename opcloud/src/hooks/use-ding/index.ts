import * as dd from "dingtalk-jsapi";

export default function useDing() {
  /**
   * 钉钉登录
   * @param corpId 企业ID
   */
  function dingLogin(corpId: string) {
    return new Promise((resolve, reject) => {
      dd.ready(() => {
        dd.runtime.permission
          .requestAuthCode({ corpId })
          .then((res) => {
            if (res.code) {
              resolve(res);
            } else {
              reject();
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    });
  }

  //钉钉环境检测，检测规则,判断当前地址的参数isding=1&corpid!=undefined
  function dingdingCheck(to: any) {
    const { query } = to;
    return (
      to.path === "/home" && query.corpid && query.isding && query.isding == "1"
    );
  }

  return {
    dingLogin,
    dingdingCheck,
  };
}

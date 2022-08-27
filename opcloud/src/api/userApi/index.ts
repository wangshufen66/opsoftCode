import request, { ResponseType } from "@/shared/utils/request";

// 通过用户名获取用户信息
export const getUserByName = (): Promise<ResponseType> =>
  request().get("/users/get");
// 新增用户
export const addUser = (): Promise<ResponseType> =>
  request().post("/api/users/add");
// 删除用户
export const delUser = (): Promise<ResponseType> => request().get("/users/del");
// 更新修改用户
export const updateUser = (): Promise<ResponseType> =>
  request().get("/users/update");

// 获取手机验证码
export const getMsgCode = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/sys/getPhoneCode`, {
    params: params,
  });
// 用户登录信息
export const userLogin = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/sys/signIn`, { params: params });

//用户注册
export const userSignUp = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/sys/signUp`, params);
/**
 * 刷新TOKEN
 */
export const refreshToken = (params?: any): Promise<ResponseType> =>
  request({ isBasic: true }).post(
    "/api/opcloud/oauth/accessToken/refresh",
    params
  );

/**
 * 获取所有应用
 */
export const getAppList = (): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getAppName");

/**
 * 根据应用获取所有模块
 */
export const getModelByApp = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getModelName", { params });

/**
 * 根据模块获取页面
 */
export const getPageByModel = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getPageName", { params });

/**
 * 根据页面ID获取所有字段
 */
export const getFieldByPage = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getFieldName", { params });
/**
 * 模型页根据页面ID获取所有字段(传2个字段infoId,pageId)
 */
export const getFieldWithType = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/functionModel/getFieldWithType", { params });

/**找回密码获取验证码*/
export const getVerifyCode = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/user/getForgetPasswordCode", { params });

/**找回密码提交验证码验证*/
export const verifyInfo = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/forgetPassword", params);

/**找回密码设置新密码*/
export const setNewPass = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/confirmPassword", params);

//获取二维码
export const getddqr = (params: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/dd/qrLogin`, { params });

// 钉钉登录
export const signdding = (params: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/sys/signdding`, { params });

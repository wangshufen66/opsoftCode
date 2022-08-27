import request, { ResponseType } from "@/utils/request";

//图表配置信息
export const getCustomerList = (): Promise<ResponseType> =>
  request().get("/api/echarts/customerList");
//模拟数据
export const getData = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/data", { params });

//启动页配置列表
export const getStarUpList = (params: any): Promise<ResponseType> =>
  request().get("/api/manage/startPage/list", { params });

// 添加启动页
export const addStarUpList = (params: any): Promise<ResponseType> =>
  request().post("/api/manage/startPage/add", params);

//更新启动页
export const updateStarUpList = (params: any): Promise<ResponseType> =>
  request().post("/api/manage/startPage/update", params);

//删除启动页
export const delStarUpList = (params: any): Promise<ResponseType> =>
  request().post("/api/manage/startPage/del", params);

//启动页详情查看
export const getStarUpListDetail = (params: any): Promise<ResponseType> =>
  request().get("manage/startPage/getDetail/1 ", { params });

//角色管理下来列表
export const getRoleSelect = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/role/getAll", { params });

//给用户分配角色,可选角色列表
export const findSelectableRoleList = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/role/findSelectableRoleList", { params });

// 用户已经选的角色
export const findSelectedRoleList = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/role/findSelectedRoleList", { params });

//保存用户的角色列表
export const saveRoleUsers = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/saveRoleUsers", params);

// 获取消息列表
export const getNewsList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/manage/newsCenter/list`, {
    params: params,
  });
//公司通知范围列表
export const getOrgList = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opuser/sysOrg/getAll`, {
    params: params,
  });

// 获取某个消息的详情localhost:8082/manage/newsCenter/getDetail/1
export const getNewsInfoById = (params?: any): Promise<ResponseType> =>
  request().get(`/api/opcloud/pageMessage/getDetail`, {
    params: params,
  });
// 删除某个消息
export const delNewsInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`/api/manage/newsCenter/del`, params);

// 修改更新某个消息
export const updateNewsInfoById = (params?: any): Promise<ResponseType> =>
  request().post(`/api/manage/newsCenter/update`, params);

// 新增某个消息
export const addNewsList = (params?: any): Promise<ResponseType> =>
  request().post(`/api/manage/newsCenter/add`, params);

//上传图片
export const uploadBgImage = (params?: any): Promise<ResponseType> =>
  request({ contentType: "multipart/form-data" }).post(
    `/api/manage/startPage/upload`,
    params
  );

// 通过用户名获取用户信息
export const getUserByName = (): Promise<ResponseType> =>
  request().get("/users/get");
// 新增用户
export const addUser = (): Promise<ResponseType> =>
  request().post("/api/users/add");

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
  request().post(`/api/auth/account/login`, params);

//用户注册
export const userSignUp = (params?: any): Promise<ResponseType> =>
  request().post(`/api/opcloud/sys/signUp`, params);
/**
 * 刷新TOKEN
 */
export const refreshToken = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/oauth/accessToken/refresh", params);

/**找回密码获取验证码*/
export const getVerifyCode = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/user/getForgetPasswordCode", { params });

/**找回密码提交验证码验证*/
export const verifyInfo = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/forgetPassword", params);

/**找回密码设置新密码*/
export const setNewPass = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/confirmPassword", params);

// 注册用户页面获取用户信息
export const getUserInfo = (params?: any): Promise<ResponseType> =>
  request().get("/api/opuser/manageUser/list", { params });

//个人信息管理
export const getPersonalInfo = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/userInfo", { params });

// 线索管理获取列表
export const geListByPerson = (params?: any): Promise<ResponseType> =>
  request().get("/api/manage/manageUser/listByPerson", { params });

// 新增注册用户信息
export const addRegisterUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/manageUser/add", params);

// 更新注册用户修改用户信息
export const updateUserInfo = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/manageUser/update", params);

// 更新线索管理信息
export const updateUserInfoClue = (params?: any): Promise<ResponseType> =>
  request().post("/api/manage/manageUser/update", params);

// 线索管理页面新增客户
export const addManageUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/manage/manageUser/add", params);

//线索管理页面导出表格
export const exportDataListExcel = (params?: any): Promise<ResponseType> =>
  request({ responseType: "blob" }).post(
    `/api/manage/manageUser/exportDataListExcel`,
    params
  );

//线索管理页面导入表格
export const importExcel = (params?: any): Promise<ResponseType> =>
  request({ contentType: "multipart/form-data" }).post(
    `/api/manage/manageUser/importUserExcel`,
    params
  );
//获取授权列表
export const getAuthList = (params?: any): Promise<ResponseType> =>
  request().get("/api/opuser/orgModule/getOrgModuleList", { params });

//获取授权列表
export const updateAuthList = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/orgModule/update", params);
//员工管理列表(分页)
export const getStaffList = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/sysUser/list", { params });
//员工管理列表
export const getStaffListAll = (): Promise<ResponseType> =>
  request().get("/api/opuser/sysUser/getAll");

//员工新增
export const addUsers = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/add", params);

//
export const editUsers = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/update", params);

//员工删除
export const delUsers = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/delete", params);

//审核员工
export const auditUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/audit", params);

//禁用角色
export const disableUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/disable", params);

//反禁用角色
export const antiDisableUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/antiDisable", params);

//根据id获取角色权限
export const getQueryByRoleId = (params?: any): Promise<ResponseType> =>
  request().get("/api/opuser/sysRolePermission/queryByRoleId", { params });

//保存角色权限
export const updateRolePersissions = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysRolePermission/updateRolePersissions", params);

//角色管理列表
export const getRoleList = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/sysRole/list", { params });

//角色新增
export const addRole = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysRole/add", params);

//角色删除
export const delRole = (params: any): Promise<ResponseType> =>
  request().delete("/api/opuser/sysRole/delete", { params });

//角色编辑
export const editRole = (params: any): Promise<ResponseType> =>
  request().put("/api/opuser/sysRole/update", params);

//禁用角色
export const disableUsers = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysRole/disable", params);

//启用角色
export const antiDisableUsers = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysRole/antiDisable", params);
// 注册用户审核
export const verifyUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opuser/manageUser/audit", params);

//修改密码
export const updatePassword = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysUser/updatePassword", params);

//字典表类别列表
export const getDictionaryType = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/sys/codeType/list", { params });

//字典表类别增加
export const addDictionaryType = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sys/codeType/save", params);

//字典表类别编辑
export const editDictionaryType = (params: any): Promise<ResponseType> =>
  request().put("/api/opuser/sys/codeType/update", params);

//字典表类别删除
export const delDictionaryType = (params: any): Promise<ResponseType> =>
  request().delete("/api/opuser/sys/codeType/delete", { params });

//字典表信息列表
export const getDictionaryInfo = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/sys/codeInfo/list", { params });

//字典表信息增加
export const addDictionaryInfo = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sys/codeInfo/save", params);

//字典表信息编辑
export const editDictionaryInfo = (params: any): Promise<ResponseType> =>
  request().put("/api/opuser/sys/codeInfo/update", params);

//字典表信息删除
export const delDictionaryInfo = (params: any): Promise<ResponseType> =>
  request().delete("/api/opuser/sys/codeInfo/delete", { params });

/**
 * 账套管理列表
 * @param params
 * @returns
 */
export const getAllSysOrg = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/sysOrg/listAll", { params });

/**
 * 查询管理员
 * @param params
 * @returns
 */
export const getAdministrator = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/manageUser/admin", { params });

/**
 * 查询标准账套应用
 * @returns
 */
export const getAppStandard = (): Promise<ResponseType> =>
  request().get("/opcloudapi/opcloud/application/apps/standard");

/**
 * 新建账套保存
 * @param params
 * @returns
 */
export const addSysOrg = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysOrg/add", params);

/**
 * 编辑账套保存
 * @param params
 * @returns
 */
export const updateSysOrg = (params: any): Promise<ResponseType> =>
  request().post("/api/opuser/sysOrg/update", params);

/**
 * 账套管理列表
 * @param params
 * @returns
 */
export const getSysOrgById = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/sysOrg/queryById", { params });

/**
 * 获取日志列表
 * @param params
 * @returns
 */
export const getLogList = (params: any): Promise<ResponseType> =>
  request().get("/api/opuser/log/_search", { params });

/**
 * 用户管理列表
 * @param params
 * @returns
 */
export const getUserList = (params: any): Promise<ResponseType> =>
  request().get("/opcloudapi/opcloud/sys/user/list", { params });

/**
 * 新增账套数统计
 * @returns
 */
export const getOrgCountList = (): Promise<ResponseType> =>
  request().get("/api/opuser/sysOrg/orgCountList");

/**
 * 新注册用户数统计
 * @returns
 */
export const getUserInfoCount = (): Promise<ResponseType> =>
  request().get("/api/opuser/manageUser/userinfoCount");

/**
 * 首页消息滚动
 * @returns
 */
export const scrollNewsList = (params: any): Promise<ResponseType> =>
  request().get("/api/manage/newsCenter/startList", { params });

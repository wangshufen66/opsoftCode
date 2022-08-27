import request, { ResponseType } from "@/shared/utils/request";

//所属企业下拉列表
export const getOrgSelect = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/org/getAll", { params });

//角色管理列表
export const getRoleList = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/role/list", { params });

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

//角色新增
export const addRole = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/add", params);

//角色编辑
export const editRole = (params: any): Promise<ResponseType> =>
  request().put("/api/opcloud/sys/role/update", params);

//角色删除
export const delRole = (params: any): Promise<ResponseType> =>
  request().delete("/api/opcloud/sys/role/delete", { params });

//禁用角色
export const disableRole = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/disable", params);

//反禁用角色
export const antiDisableRole = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/antiDisable", params);

//审核角色
export const auditRole = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/audit", params);

//反审核角色
export const antiAuditRole = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/antiAudit", params);

//角色管理授权信息列表
export const getRoleAuthList = (params?: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/role/getRolePermissions", { params });

//角色授权
export const givePermissions = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/role/saveRolePermissions", params);

//个人信息管理
export const getPersonalInfo = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/userInfo", { params });

//个人信息修改
export const putPersonalInfo = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/update", params);

//修改密码
export const updatePassword = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/updatePassword", params);

//重置密码
export const resetPassword = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/resetPassword", params);

//用户管理列表
export const getUserList = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/user/list", { params });

//用户新增
export const saveUser = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/add", params);

//用户编辑
export const editUser = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/update", params);

//用户编辑
export const delUser = (params: any): Promise<ResponseType> =>
  request().delete("/api/opcloud/sys/user/delete", { params });

//禁用用户
export const disableUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/disable", params);

//反禁用用户
export const antiDisableUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/antiDisable", params);

//审核用户
export const auditUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/audit", params);

//反审核用户
export const antiAuditUser = (params?: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/user/antiAudit", params);

//字典表类别列表
export const getDictionariesType = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/codeType/list", { params });

//字典表类别增加
export const addDictionariesType = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/codeType/save", params);

//字典表类别编辑
export const editDictionariesType = (params: any): Promise<ResponseType> =>
  request().put("/api/opcloud/sys/codeType/update", params);

//字典表类别删除
export const delDictionariesType = (params: any): Promise<ResponseType> =>
  request().delete("/api/opcloud/sys/codeType/delete", { params });

//字典表信息列表
export const getDictionariesInfo = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/codeInfo/list", { params });

//字典表信息增加
export const addDictionariesInfo = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/codeInfo/save", params);

//字典表信息编辑
export const editDictionariesInfo = (params: any): Promise<ResponseType> =>
  request().put("/api/opcloud/sys/codeInfo/update", params);

//字典表信息删除
export const delDictionariesInfo = (params: any): Promise<ResponseType> =>
  request().delete("/api/opcloud/sys/codeInfo/delete", { params });

//菜单管理树
export const getMneuTree = (): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/menu/getTreeData");
//组织管理树
export const getOrgTree = (): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/org/getTreeData");

//菜单新增
export const addMneuTree = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/menu/add", params);

//菜单编辑
export const editMneuTree = (params: any): Promise<ResponseType> =>
  request().put("/api/opcloud/sys/menu/update", params);

//菜单删除
export const delMneuTree = (params: any): Promise<ResponseType> =>
  request().delete("/api/opcloud/sys/menu/delete", { params });

//获取部门列表
export const getDepartmentList = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/department/list", { params });

//新增
export const addDepartment = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/department/add", params);
//删除
export const delDepartment = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/department/batchDelDepartment", params);
//修改
export const updateDepartment = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/department/update", params);

//获取部门树
export const getDepartmentTree = (): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/department/getDepartmentTree");

//搜索框,查询人员
export const getUsersByConditions = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/department/getUsersByConditions", { params });

// 查询当前部门和子部门人员列表
export const getUsersByDepartmentId = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/department/getUsersByDepartmentId", {
    params,
  });

//将人员调整到新部门
export const modifyDepartmentForUser = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/department/modifyDepartmentForUser", params);

// 部门移除人员
export const removeUserFromDepartment = (params: any): Promise<ResponseType> =>
  request().post(
    "/api/opcloud/sys/department/removeUserFromDepartment",
    params
  );

//部门下拉列表
export const getAll = (): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/department/all");

//保存修改后的水印
export const saveWaterMark = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/waterMark/save ", params);

//获取首页配置
export const getHomeConfig = (): Promise<ResponseType> =>
  request().get("/api/opcloud/homeConfig/getHomeConfig");

//更新首页配置
export const updateHomeConfig = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/homeConfig/update", params);

// 更新水印
export const updateWaterMark = (params: any): Promise<ResponseType> =>
  request().post("/api/opcloud/sys/waterMark/update", params);

//获取orgId
export const getByOrgId = (): Promise<ResponseType> =>
  request().get("/api/opcloud/sys/waterMark/getByOrgId");

// 获取日志列表
export const getLogList = (params: any): Promise<ResponseType> =>
  request().get("/api/opcloud/log/_search", { params });

import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * Upload组件结构
 */
export interface UploadComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  componentTag: 'designUpload';
  /**
   * 自定义配置
   */
  __config__: UploadCfg;
  /**
   * 组件属性配置
   */
  __attr__: UploadAttribute;
}
/**
 * 自定义配置
 * @export
 * @interface UploadCfg
 */
export interface UploadCfg extends BaseCustomCfg {
  icon?: string;
  // 上传文件大小限制,单位M
  maxSize?: number;
  sqlType?: string;
  inSearch?: boolean;
  inTable?: boolean;
  tableSort?: boolean;
  // 是否携带token
  takeToken?: boolean;
}

/**
 * 组件属性
 * @export
 * @interface UploadAttribute
 */
export interface UploadAttribute {
  /**
   * 上传地址
   */
  action?: string;
  /**
   * 请求头
   */
  headers?: any;
  /**
   * 是否支持多文件上传
   */
  multiple?: boolean;
  /**
   * 上传时附带的额外参数
   */
  data?: any;
  /**
   * 请求携带cookie信息
   */
  'with-credentials'?: boolean;
  /**
   * 显示已上传的文件列表
   */
  'show-file-list'?: boolean;
  /**
   * 是否支持拖拽上传
   */
  drag?: boolean;
  /**
   * 文件列表类型text/picture/picture-card,默认text
   */
  'list-type'?: 'text' | 'picture-card';
  /**
   * 选择文件后立即上传
   */
  'auto-upload'?: boolean;
  disabled?: boolean;
  /**
   * 允许最大上传个数
   */
  limit?: number;
  /**
   * 文件类型
   */
  accept?: string;
}
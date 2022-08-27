import { ComponentBaseCfg, BaseCustomCfg } from '../../commonCfg';

/**
 * CustomAdd组件结构
 */
export interface CustomAddComponent extends ComponentBaseCfg {
  /**
   * 组件标签名称(自定义的标签名称)
   */
  // componentTag: 'designCustomAdd';
  /**
   * 自定义配置
   */
  __config__: CustomAddCfg;
  /**
   * 组件属性配置
   */

}
/**
 * 自定义配置
 * @export
 */
interface CustomAddCfg extends BaseCustomCfg {
  icon?: string;
}


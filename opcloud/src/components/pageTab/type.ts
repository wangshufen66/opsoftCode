export type Tab = {
  /**标题 */
  label: string;
  /**标识名 */
  name: string;
  /**禁用 */
  disabled?: boolean;
  /**是否能关闭 */
  closable?: boolean;
  /**页面路径 */
  path?: string;
};

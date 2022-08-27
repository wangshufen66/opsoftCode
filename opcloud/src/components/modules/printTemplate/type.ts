/**打印纸张类型 */
export enum PaperType {
  A3 = 1,
  A4 = 2,
  A5 = 3,
  B3 = 4,
  B4 = 5,
  B5 = 6,
  /**自定义 */
  CUSTOM = 99,
}

export type Rect = {
  width?: string | number;
  height?: string | number;
};

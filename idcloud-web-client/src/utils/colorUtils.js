/**
 * 整个项目的状态字段颜色请务必从此工具类中获取
 * 便于颜色的统一管理
 * */


/* --------------------规则状态字段颜色分配------------------------------- */

// 未审核
export function getUncheckColor() {
  return '#996600';
}

// 审核
export function getCheckedColor() {
  return '#ffa502';
}

// 未启用
export function getUnenabledColor() {
  return '#273c75';
}

// 已启用
export function getEnabledColor() {
  return '#0652DD';
}

// 未开工
export function getUnstartColor() {
  return '#000';
}

// 进行中
export function getRunningColor() {
  return '#4cd137';
}

// 已完成
export function getEndColor() {
  return '#00a8ff';
}

/* --------------------不规则状态字段颜色分配（对于不规则的状态字段，用以下顺序分配各级颜色即可）------------------------------- */
// 黑: 0, 0, 0 #000
// 绿：0,255,0    #00FF00
// 蓝：0,0,255    #0000FF
// 红：255,0,0    #FF0000
// 橙: 255,125,0     #FF7D00
// 黄：255,255,0   #FFFF00
// 靛: 0,255,255    #00FFFF
// 紫: 255,0,255    #FF00FF

// 1
export function getFirstColor() {
  return '#000';
}

// 2
export function getSecondColor() {
  return '#44bd32';
}

// 3
export function getThirdColor() {
  return '#0000FF';
}

// 4
export function getFourthColor() {
  return '#FF7D00';
}

// 5
export function getFifthColor() {
  return '#FF00FF';
}

// 6
export function getSixthColor() {
  return '#FFFF00';
}

// 7
export function getSeventhColor() {
  return '#00FFFF';
}

// 8
export function getEighthColor() {
  return '#FF0000';
}


// 判断对象是否为空
export function objIsNullOrEmpty(obj) {
  return obj == null || JSON.stringify(obj) === '{}' || JSON.stringify(obj) === '' || obj === '' || JSON.stringify(obj) === 'undefined'
}

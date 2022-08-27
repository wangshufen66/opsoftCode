/*一些单一的无法归类的工具函数*/

/**
 * 对 对象数组 进行去重(仅支持对第一层的对象进行判定去重)
 * （附：对应简单的数组，只要通过 Set 即可实现去重，比如：noRepeatArray = [...new Set(array)]）
 * @param array 包含对象的数组，如 [{id:'1',name:'jk',age:12}]
 * @param judgeKey 数组中的第一次对象的用于判定的key，比如上方案例中取 id 作为key，那么这个参数就是 judgeKey='id'
 * @param allowEmpty 是否允许空值的存在，true=遇到为值为空的属性，直接通过，不进行重复判断,即空值允许重复存在；false=不对空值进行特殊判定，即也不可重复存在
 */
export function noRepeatForObjectArray(array, judgeKey, allowEmpty) {
  const res = new Map();
  // res.has(item[judgeKey]) Map判断是否存在这个唯一值，若不存在，则 res.set(item[judgeKey], 1) 将这个唯一值添加到Map中，用于下一轮判断
  const result = array.filter((item) => (allowEmpty && !item[judgeKey]) || (!res.has(item[judgeKey]) && res.set(item[judgeKey], 1)))
  // console.log(`noRepeatForObjectArray:${JSON.stringify(result)}`)
  return result
}

// 生成唯一代码
export function createRandomId() {
  return (Math.random() * 10000000).toString(16).substr(0, 2) + '_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2, 3);
}

// 生成唯一代码
export function createRandomIdLong() {
  return (Math.random() * 10000000).toString(16).substr(0, 4) + '_' + (new Date()).getTime() + '_' + Math.random().toString().substr(2, 5);
}

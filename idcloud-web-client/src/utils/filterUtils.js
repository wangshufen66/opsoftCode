/**
 * 获取过滤后的数据集合
 * @param searchArray 要过滤的数组数据源
 * @param searchArrayItemKey  要进行过滤匹配的数组成员中的属性key
 * @param search 要进行过滤匹配内容
 * @returns {*}
 */
export function getFilterArray(searchArray, searchArrayItemKey, search) {
  let searchVal = []// 搜索后的数据
  if (search) {
    searchVal = searchArray.filter(function(item) {
      return Object.keys(item).some(function(key) {
        // 搜索所有的内容
        // return String(item[key]).toLowerCase().indexOf(search) > -1;
        // 只搜索问题内容（某一个key）（这里按组件名搜索）
        return String(item[searchArrayItemKey]).toLowerCase().indexOf(search.toLowerCase()) > -1
      })
    })
    return searchVal
  } else { // 未输入内容，则搜索所有内容
    return searchArray
  }
}

/**
 * 获取过滤后的JSON数据
 * @param searchJson 要过滤的数组数据源
 * @param searchJsonItemKey  要进行过滤匹配的数组成员中的属性key
 * @param search 要进行过滤匹配内容
 * @returns {*}
 */
export function getFilterJson(searchJson, searchJsonItemKey, search) {
  const searchVal = []// 搜索后的数据
  if (search) {
    for (const key in searchJson) {
      if (String(searchJson[key][searchJsonItemKey]).toLowerCase().indexOf(search.toLowerCase()) > -1) {
        searchVal.push(searchJson[key])
      }
    }
    return searchVal
  } else { // 未输入内容，则搜索所有内容
    return searchJson
  }
}

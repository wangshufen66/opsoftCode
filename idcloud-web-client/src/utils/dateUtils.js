import moment from 'moment'

//获取当前时间，格式YYYY-MM-DD
export function getNowDate() {
  let currentdate = moment(new Date()).format('YYYY-MM-DD')
  return currentdate;
}

// 获取昨天的日期
export function getYesterdayDate() {
  const curDate = new Date()
  const preDate =  moment(new Date(curDate.getTime() - 24*60*60*1000)).format('YYYY-MM-DD') //减一天
  return preDate
}

// 获取明天的日期
export function getTormorrowDate() {
  const curDate = new Date()
  const nextDate =  moment(new Date(curDate.getTime() + 24*60*60*1000)).format('YYYY-MM-DD') //加一天
  return nextDate
}

export function isDate(str)
{
  if(!/^(\d{4})-(\d{1,2})-(\d{1,2})$/.test(str))
    return false;
  let year = RegExp.$1-0;
  let month = RegExp.$2-1;
  let date = RegExp.$3-0;
  let obj = new Date(year,month,date);

  const isDate = !!(obj.getFullYear()==year && obj.getMonth()==month && obj.getDate()==date);
  // console.log('是否是日期格式 = ' + isDate)
  return isDate
}

/**
 * 将标准的时间格式字符串（Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)）进行格式化成 yyyy-MM-dd 格式
 * @param dateStr
 * @returns {string}
 */
export function datetimeStdStrFormateToDate(dateStr) {
  const result = moment(dateStr).format('YYYY-MM-DD')
  return result
}

/**
 * 将标准的时间格式字符串（Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)）进行格式化成 yyyy-MM-dd hh:mm:ss 格式
 * @param dateStr 这种标准格式的字符串 Thu May 12 2016 08:00:00 GMT+0800 (中国标准时间)
 * @returns {string} 这种格式的日期字符串：yyyy-MM-dd hh:mm:ss
 */
export function datetimeStdStrFormateToDatetime(dateStr) {
  const result = moment(dateStr).format('YYYY-MM-DD HH:mm:ss')
  return result
}

/**
 * 日期对比函数
 * @param date1
 * @param date2
 * @returns {number} 1=date1大于date2; 0=date1等于date2; -1=date1小于date2
 */
export function dateCompare(date1,date2){
  // console.log('date1 : ' + date1)
  // console.log('date2 : ' + date2)
  const oDate1 = new Date(date1);
  const oDate2 = new Date(date2);
  if (oDate1.getTime() > oDate2.getTime()){
    return 1
  }
  else if (oDate1.getTime() === oDate2.getTime()){
    return 0
  }else {
    return -1
  }
}

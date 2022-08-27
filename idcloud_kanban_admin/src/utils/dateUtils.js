import { objIsNullOrEmpty } from './objUtils'

/**
 * 日期时间字符串 转 Data
 * @param dateString 2019-06-26 12:12:12
 * @returns {*}
 */
export const dateTimeFormatToDate = function(dateString) {
  const DATE_REGEXP = new RegExp('(\\d{4})-(\\d{2})-(\\d{2})([T\\s](\\d{2}):(\\d{2}):(\\d{2})(\\.(\\d{3}))?)?.*')
  if (DATE_REGEXP.test(dateString)) {
    const timestamp = dateString.replace(DATE_REGEXP, function($all, $year, $month, $day, $part1, $hour, $minute, $second, $part2, $milliscond) {
      const date = new Date($year, $month, $day, $hour || '00', $minute || '00', $second || '00', $milliscond || '00')
      return date.getTime()
    })
    const date = new Date()
    date.setTime(timestamp)
    return date
  }
  return null
}

// 日期 Date 类型 转 毫秒
export const dateToMs = function(dateTime) {
  return Date.parse(dateTime)
}

// 将单位为秒的值 转换成 时:分:秒(HH:mm:ss)格式的字符串
export const secToTime = function(sec) {
  let result = sec
  const h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
  const m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60))
  const s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60))
  result = h + ':' + m + ':' + s
  return result
}

// 将【时分秒(00:00:00)】格式字符串 转换成 单位为秒的值
export const timeToSec = function(time) {
  if (!objIsNullOrEmpty(time)) {
    let secResult = ''
    const timeArray = time.split(':')
    if (!objIsNullOrEmpty(timeArray) && timeArray.length > 0) {
      const hour = timeArray[0]
      const min = timeArray[1]
      const sec = timeArray[2]

      secResult = Number(hour * 3600) + Number(min * 60) + Number(sec)
      return parseInt(secResult)
    }
  }

  return 0
}

// 毫秒 转 天 小时 分钟 秒 的函数
export const formatDuring = function(mss) {
  // Math.floor(x) 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数。
  // Math.round(x) 把 x 四舍五入为最接近的整数
  const days = Math.floor(mss / (1000 * 60 * 60 * 24))
  const hours = Math.floor((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((mss % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.round((mss % (1000 * 60)) / 1000)
  return days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒'
}

// 毫秒 转 小时 的函数
export const msToHourFloor = function(mss) {
  // Math.floor(x) 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数。
  const hours = Math.floor(mss / (1000 * 60 * 60))
  return hours
}

/**
 * 毫秒 转 小时 的函数
 * @param mss 毫秒数
 * @param fractionDigits 保留的小数位数
 * @returns {string}
 */
export const msToHourFixed = function(mss, fractionDigits) {
  // NumberObject.toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
  const num = Number(mss / (1000 * 60 * 60))
  const hours = num.toFixed(fractionDigits)
  return hours
}

// 毫秒 转 分钟 的函数
export const msToMinutesFloor = function(mss) {
  // Math.floor(x) 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数。
  const minutes = Math.floor(mss / (1000 * 60))
  return minutes
}

/**
 * 毫秒 转 分钟 的函数
 * @param mss 毫秒数
 * @param fractionDigits 保留的小数位数
 * @returns {string}
 */
export const msToMinutesFixed = function(mss, fractionDigits) {
  // NumberObject.toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
  const num = Number(mss / (1000 * 60))
  const minutes = num.toFixed(fractionDigits)
  return minutes
}

// 毫秒 转 秒 的函数
export const msToSecondsFloor = function(mss) {
  // Math.floor(x) 方法执行的是向下取整计算，它返回的是小于或等于函数参数，并且与之最接近的整数。
  const seconds = Math.floor(mss / (1000))
  return seconds
}

/**
 * 毫秒 转 秒 的函数
 * @param mss 毫秒数
 * @param fractionDigits 保留的小数位数
 * @returns {string}
 */
export const msToSecondsFixed = function(mss, fractionDigits) {
  // NumberObject.toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。
  const num = Number(mss / (1000))
  const seconds = num.toFixed(fractionDigits)
  return seconds
}

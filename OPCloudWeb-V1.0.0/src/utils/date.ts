import dayjs from "dayjs";

/**
 * 获取一小时内的范围时间
 * @export
 * @return {*}
 */
export function getNowHourDateTime(): [string, string] {
  const before = dayjs(+new Date() - 1000 * 60 * 60).format(
    "YYYY-MM-DD HH:mm:ss"
  );
  return [before, dayjs().format("YYYY-MM-DD HH:mm:ss")];
}

/**
 * 获取当日范围时间
 * @export
 * @return {*}
 */
export function getNowDayDateTime(): [string, string] {
  return [
    dayjs().format("YYYY-MM-DD 00:00:00"),
    dayjs().format("YYYY-MM-DD 23:59:59"),
  ];
}
/**
 * 获取本周的时间范围
 * @export
 * @return {*}
 */
export function getWeekDateTime(): [string, string] {
  const nowDate = new Date();
  const before =
    +new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()) -
    nowDate.getDay() * 24 * 60 * 60 * 1000;
  return [
    dayjs(before).format("YYYY-MM-DD 00:00:00"),
    dayjs().format("YYYY-MM-DD 23:59:59"),
  ];
}

/**
 * 获取本月的时间范围
 * @export
 * @return {*}
 */
export function getMonthDateTime(): [string, string] {
  const nowDate = new Date();
  const before = +new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);
  return [
    dayjs(before).format("YYYY-MM-DD HH:mm:ss"),
    dayjs().format("YYYY-MM-DD HH:mm:ss"),
  ];
}

/**
 * 获取本季度的时间范围
 * @export
 * @return {*}
 */
export function getQuarterDateTime(): [string, string] {
  const nowDate = new Date();
  const quarter = Math.ceil((nowDate.getMonth() + 1) / 3);
  const before = new Date(nowDate.getFullYear(), (quarter - 1) * 3, 1);
  return [
    dayjs(before).format("YYYY-MM-DD HH:mm:ss"),
    dayjs().format("YYYY-MM-DD HH:mm:ss"),
  ];
}

/**
 * 获取本年的时间范围
 * @export
 * @return {*} 
 */
export function getYearDateTime(): [string, string] {
  const nowDate = new Date();
  const before = new Date(nowDate.getFullYear(), 0, 1);
  return [
    dayjs(before).format("YYYY-MM-DD HH:mm:ss"),
    dayjs().format("YYYY-MM-DD HH:mm:ss"),
  ];
}

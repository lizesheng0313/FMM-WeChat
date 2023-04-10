/*
 * @Author: lizesheng
 * @Date: 2023-03-11 11:22:38
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-09 10:07:17
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/utils/utils.js
 */
export const formatDate = (val = null, noYear = false) => {
  let date = new Date()
  if (val) {
    date = new Date(val)
  }
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  month = month < 10 ? ('0' + month) : month
  let day = date.getDate()
  day = day < 10 ? ('0' + day) : day
  let d = date.getDay(); //获取存储当前日期
  let weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  let weekday2 = ['星期天', "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
  if (noYear) {
    return `${month}月${day} ${weekday2[d]}`
  } else {
    return `${year}年${month}月${day} ${weekday[d]}`
  }

}

export const getCurrentDate = (d, flag) => {
  if (!d) return
  const date = new Date(d)
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = "0" + month
  }
  let day = date.getDate()
  if (day < 10) {
    day = "0" + day
  }
  let hours = date.getHours()
  if (hours < 10) {
    hours = "0" + hours
  }
  let min = date.getMinutes()
  if (min < 10) {
    min = "0" + min
  }
  let seconds = date.getSeconds()
  if (seconds < 10) {
    seconds = "0" + seconds
  }
  if (flag) {
    return `${year}-${month}-${day} ${hours}:${min}:00`
  }
  return `${year}-${month}-${day} ${hours}:${min}:${seconds}`
}

export const getCurrentDay = (d) => {
  const date = new Date(d || new Date())
  const year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month < 10) {
    month = "0" + month
  }
  let day = date.getDate()
  if (day < 10) {
    day = "0" + day
  }
  return `${year}-${month}-${day}`
}
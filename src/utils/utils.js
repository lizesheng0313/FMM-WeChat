/*
 * @Author: lizesheng
 * @Date: 2023-03-11 11:22:38
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-09 10:07:17
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/utils/utils.js
 */
import constConfig from '../config/confg'

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

/**
 * 处理图片URL，确保有完整的域名前缀
 * @param {string} url - 图片URL
 * @returns {string} - 处理后的完整URL
 */
export const formatImageUrl = (url) => {
  if (!url) return ''

  // 如果已经是完整URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // 如果是/files开头的路径，加上域名
  if (url.startsWith('/files')) {
    return constConfig.host + url
  }

  // 如果是/开头的其他路径，也加上域名
  if (url.startsWith('/')) {
    return constConfig.host + url
  }

  // 其他情况返回原URL
  return url
}

/**
 * 批量处理图片URL数组或JSON字符串
 * @param {string|array} images - 图片URL数组或JSON字符串
 * @returns {array} - 处理后的图片URL数组
 */
export const formatImageList = (images) => {
  if (!images) return []

  let imageList = images

  // 如果是字符串，尝试解析JSON
  if (typeof images === 'string') {
    try {
      imageList = JSON.parse(images)
    } catch (e) {
      // 如果不是JSON，可能是单个URL
      return [formatImageUrl(images)]
    }
  }

  // 如果是数组，处理每个URL
  if (Array.isArray(imageList)) {
    return imageList.map(img => formatImageUrl(img))
  }

  return []
}

/**
 * 处理富文本中的图片URL
 * @param {string} html - 富文本HTML字符串
 * @returns {string} - 处理后的富文本
 */
export const formatRichText = (html) => {
  if (!html) return ''

  // 匹配所有img标签的src属性，支持单引号和双引号
  return html.replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'])/gi, (match, prefix, src, suffix) => {
    // 处理src中的URL
    const formattedSrc = formatImageUrl(src)
    // 返回替换后的完整img标签片段
    return prefix + formattedSrc + suffix
  })
}
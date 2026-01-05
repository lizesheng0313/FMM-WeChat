// 测试富文本图片URL处理

const constConfig = {
  host: 'https://linxiange.cn'
}

const formatImageUrl = (url) => {
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

const formatRichText = (html) => {
  if (!html) return ''

  // 匹配所有img标签的src属性，支持单引号和双引号
  return html.replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'])/gi, (match, prefix, src, suffix) => {
    // 处理src中的URL
    const formattedSrc = formatImageUrl(src)
    // 返回替换后的完整img标签片段
    return prefix + formattedSrc + suffix
  })
}

// 测试用例
const testHtml = '<p><img src="/files/images/goods_images/WechatIMG502-d0b1c7fa-16cd-4a41-b51d-32c9d12a8411.jpg" style="max-width:100%;" contenteditable="false"/></p>'

console.log('原始HTML:')
console.log(testHtml)
console.log('\n处理后的HTML:')
console.log(formatRichText(testHtml))

import constConfig from '../config/confg'
const post = (url, data = {}) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: constConfig.host + url,
      method: 'post',
      data,
      header: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'authorization': wx.getStorageSync('authorization') || '',
      },
      success: function (res) {
        if (res.data.code === 0) {
          resolve(res.data)
        }
        else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          reject(res)
        }
      },
      fail(err) {
        console.log(err, '-----err')
        wx.showToast({
          title: err.data.message,
          icon: 'none'
        })
      }
    })
  })
}

const get = (url, data = {}) => {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: constConfig.host + url,
      data,
      header: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'authorization': wx.getStorageSync('authorization') || '',
      },
      success: function (res) {
        if (res.data.code === 0) {
          resolve(res.data)
        }
        else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
          reject(res)
        }
      },
      fail(err) {
        console.log(err, '-----err')
        wx.showToast({
          title: err.data.message,
          icon: 'none'
        })
      }
    })
  })
}

export {
  get,
  post
}
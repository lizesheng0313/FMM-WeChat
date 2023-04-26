/*
 * @Author: lizesheng
 * @Date: 2023-03-11 11:22:38
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-25 20:18:24
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/utils/request.js
 */

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
        wx.hideLoading()
        if (res.data.code === 0) {
          resolve(res.data)
        }
        else {
          wx.showToast({
            title: res?.data?.message || res?.data?.msg || '无网络，请重试',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail(err) {
        wx.showToast({
          title: err?.data?.message || '无网络，请重试',
          icon: 'none'
        })
      }
    })
  })
}

const get = (url, data = {}, returnAll = false) => {
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
        wx.hideLoading()
        if (res.data.code === 0) {
          if (!returnAll) {
            resolve(res.data)
          }
          else { resolve(res) }
        }
        else {
          wx.showToast({
            title: res?.data?.message || res?.data?.msg || '无网络，请重试',
            icon: 'none'
          })
          reject(res)
        }
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({
          title: err?.data?.message || '无网络，请重试',
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
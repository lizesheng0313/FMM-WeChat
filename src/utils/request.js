import Taro from "@tarojs/taro";
import constConfig from "../config/confg";
let eid = "";
const post = (url, data = {}) => {
  return new Promise(function (resolve, reject) {
    // 从本地存储获取 JSON 字符串并解析为对象
    const storedAppInfo = Taro.getStorageSync("appInfo");
    const parsedAppInfo = JSON.parse(storedAppInfo);
    if (parsedAppInfo && parsedAppInfo.miniProgram) {
      eid = parsedAppInfo.miniProgram.appId;
    } else {
      console.log("No app information found.");
    }
    wx.request({
      url: constConfig.host + url,
      method: "post",
      data: {
        ...data,
        eid,
      },
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: wx.getStorageSync("authorization") || "",
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code === 0) {
          resolve(res.data);
        } else {
          wx.showToast({
            title: res?.data?.message || res?.data?.msg || "无网络，请重试",
            icon: "none",
          });
          reject(res);
        }
      },
      fail(err) {
        wx.showToast({
          title: err?.data?.message || "无网络，请重试",
          icon: "none",
        });
      },
    });
  });
};

const get = (url, data = {}, returnAll = false) => {
  return new Promise(function (resolve, reject) {
    // 从本地存储获取 JSON 字符串并解析为对象
    const storedAppInfo = Taro.getStorageSync("appInfo");
    const parsedAppInfo = JSON.parse(storedAppInfo);
    if (parsedAppInfo && parsedAppInfo.miniProgram) {
      eid = parsedAppInfo.miniProgram.appId;
    } else {
      console.log("No app information found.");
    }
    wx.request({
      url: constConfig.host + url,
      data: {
        ...data,
        eid,
      },
      header: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: wx.getStorageSync("authorization") || "",
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code === 0) {
          if (!returnAll) {
            resolve(res.data);
          } else {
            resolve(res);
          }
        } else {
          wx.showToast({
            title: res?.data?.message || res?.data?.msg || "无网络，请重试",
            icon: "none",
          });
          reject(res);
        }
      },
      fail(err) {
        wx.hideLoading();
        wx.showToast({
          title: err?.data?.message || "无网络，请重试",
          icon: "none",
        });
      },
    });
  });
};

export { get, post };

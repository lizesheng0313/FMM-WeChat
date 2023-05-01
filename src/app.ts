/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-01 19:20:46
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/app.ts
 */
import Taro from "@tarojs/taro";
import { createApp } from "vue";
import { createPinia } from "pinia";
import "./app.scss";
import config from "./config/confg";
import "./assets/icon/iconfont.css";
import { get, post } from "./utils/request";

const App = createApp({
  created() {},
  onShow(e) {
    // 分享埋点等
    return new Promise(async (reolove, reject) => {
      await Taro.login({
        async success(res) {
          await get(
            "/api/program/user/login",
            {
              source: "aimi_shop",
              code: res.code,
              appid: config.appId,
              ch: e?.query?.ch,
            },
            true
          )
            .then((res) => {
              Taro.setStorageSync("user_id", res.data?.data?.user_id);
              Taro.setStorageSync("is_sure", res.data?.data?.is_sure);
              Taro.setStorageSync(
                "authorization",
                res.header.authorization || res.header.Authorization
              );
              reolove(true);
            })
            .catch((err) => {
              post("/api/events", {
                event_name: "loginError",
                event_data: `user/login登录接口${JSON.stringify(err)}`,
              });
              console.log(err);
              reject(err);
            });
        },
        fail(err) {
          post("/api/events", {
            event_name: "lgoin",
            event_data: `wx.login登录报错${JSON.stringify(err)}`,
          });
        },
      });
    });
  },
});
App.use(createPinia());

export default App;

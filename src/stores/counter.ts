/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-08 15:01:45
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/stores/counter.ts
 */
// https://pinia.esm.dev/introduction.html
import { defineStore } from "pinia";

export const useCounterStore = defineStore("userInfo", {
  state: () => {
    return { userInfo: {} };
  },
  actions: {
    increment(userInfo) {
      this.userInfo = userInfo;
    },
  },
});

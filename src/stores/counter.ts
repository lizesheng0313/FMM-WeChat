/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-25 12:10:43
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/stores/counter.ts
 */
// https://pinia.esm.dev/introduction.html
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => {
    return { count: 0 };
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++;
    },
  },
});

// You can even use a function (similar to a component setup()) to define a Store for more advanced use cases:
// export const useCounterStore = defineStore('counter', () => {
//   const count = ref(0)
//
//   function increment() {
//     count.value++
//   }
//
//   return {count, increment}
// })

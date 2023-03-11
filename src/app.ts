/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-09 11:17:15
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/app.ts
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Search } from 'vant'
import './app.scss'
import './static/icon/iconfont.css'

const App = createApp({
  onShow(options) {
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(Search);
App.use(createPinia())

export default App

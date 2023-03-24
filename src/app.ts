/*
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-11 17:03:17
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/app.ts
 */
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Search } from 'vant'
import './app.scss'
import './static/icon/iconfont.css'
import { get } from './utils/request'
import Taro from '@tarojs/taro'

const App = createApp({
  created() {
    // let that = this
    // return new Promise(async (reolove,reject)=>{
    //   await  Taro.login({
    //     async success(res) {
    //       console.log(res,'----res')
    //        await get('/api/getShortOpenId', {
    //          source:'aimi_shop',
    //          code: res.code
    //       }).then(res=>{
    //         console.log(res,'---res')
    //         Taro.setStorageSync('authorization', res.header.authorization || res.header.Authorization)
    //         that.globalData.openid = res.data.data.openid
    //         that.globalData.userInfo = res.data.data.userInfo
    //         reolove(true)
    //       }).catch(err=>{
    //         console.log(err)
    //       })
    //     }
    //   })
    // })
  },
  onShow(options) {
    // 分享埋点等
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(Search);
App.use(createPinia())

export default App

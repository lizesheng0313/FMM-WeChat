<!--
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-09 11:40:05
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/index/index.vue
-->
<template>
  <view class="home">
    <view class="header-top">
      <view class="title" :style="{ height: `${navHeight}px`, paddingTop: `${statusHeight}px` }">
        <text class="top">爱秘商城</text>
        <!-- <text class="tip">私密发货</text> -->
      </view>
      <view class="search">
        <Icon value="icon-sousuo" size="20"></Icon>
        <view class="search-icon">搜索商品</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import Icon from '../../components/Icon.vue'
import { ref } from 'vue'

const sysinfo = Taro.getSystemInfoSync()
const statusHeight = ref(sysinfo.statusBarHeight)
const isiOS = sysinfo.system.indexOf('iOS') > -1
const navHeight = ref(!isiOS ? 46 : 44)
const value = ref('')
</script>

<style lang="scss" >
.home {
  .header-top {
    height: 200px;
    background: linear-gradient(to bottom, #E50F86, #F06292);
    padding-left: 40px;

    .title {
      color: #fff;
      display: flex;
      align-items: center;

      .top {
        font-size: 28px;
        margin-right: 15px;
      }

      .tip {
        font-size: 24px;
      }
    }

    .search {
      display: flex;
      background: #fff;
      border-radius: 100px;
      height: 50px;
      align-content: center;
      margin: 0 20px 0 0px;
      color: #8a8a8a;

      .search-icon {
        margin-left: 40px;
      }
    }
  }
}
</style>

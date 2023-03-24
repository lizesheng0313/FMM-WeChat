<!--
 * @Author: lizesheng
 * @Date: 2023-03-07 12:01:55
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-19 20:53:14
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/index/index.vue
-->
<template>
  <view class="home">
    <view>
      <view class="header-top"></view>
      <view class="header">
        <view class="title" :style="{ height: `${navHeight}px`, paddingTop: `${statusHeight}px` }">
          <text class="top">爱秘商城</text>
          <text class="tip">私密发货</text>
        </view>
        <view class="search">
          <child-icon value="icon-sousuo" size="16" />
          <view class="search-icon">搜索商品</view>
        </view>
        <view class="swiper">
          <swiper class='test-h' indicator-active-color='#fff' :circular="true" :indicator-dots="true" :autoplay="false">
            <swiper-item v-for="item in swiperList" :key="item.id">
              <image :src="item.url" mode="widthFix"></image>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
    <view class="classifcation" v-show="iconList?.length > 0">
      <view v-for="item in iconList" :key="item.value" class="class-item">
        <view class="icon">
          <child-icon color="#e50f86" :value="item.icon" :size="item.size" class="icon" />
        </view>
        <view>{{ item.label }}</view>
      </view>
      <view class="class-item" @tap="handleJumpClass">
        <view class="icon">
          <child-icon color="#5c0682" value="icon-quanbu" size="26" />
        </view>
        <view>全部</view>
      </view>
    </view>
    <view class="line"></view>
    <view class="scroll-view">
      <view class="title">热卖推荐</view>
      <scroll-view :scroll-x="true" @scroll="scroll" style="width: 100%">
        <view class="scroll-item" v-for="item in recommendList">
          <image src="item.url"></image>
          <view>{{ item.title }}</view>
          <view>{{ item.price }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script setup>
import { get, post } from '../../utils/request'
import { useRouter } from '@tarojs/taro';
import Taro from '@tarojs/taro'
import childIcon from '../../components/Icon.vue'
import { ref } from 'vue'

const sysinfo = Taro.getSystemInfoSync()
const statusHeight = ref(sysinfo.statusBarHeight)
const isiOS = sysinfo.system.indexOf('iOS') > -1
const navHeight = ref(!isiOS ? 46 : 44)
const swiperList = ref('')
const iconList = ref('')
const recommendList = ref([])
get('/api/home/getBanner').then(res => {
  swiperList.value = res.data.list
})
get('/api/home/getClassifcation', {
  typeId: 1,
  number: 9,
}).then(res => {
  iconList.value = res.data.list
})

const handleJumpClass = () => {
  Taro.switchTab({
    url: '/pages/classification/index'
  })
}
</script>

<style lang="scss" >
.home {
  background: #fff;
  position: relative;
  padding: 0 20px;

  .scroll-view {
    padding-top: 20px;

    .scroll-item {}

    .title {
      font-weight: bold;
      font-size: 30px;
      padding-left: 13px;
    }
  }

  .line {
    background: #F5F5F5;
    height: 10px;
    margin: 30px -20px 0 -20px;
  }

  .header {
    position: relative;
    z-index: 1;

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
      padding-left: 20px;
      display: flex;
      background: #fff;
      border-radius: 100px;
      height: 50px;
      align-items: center;
      color: #8a8a8a;
      font-size: 26px;

      .search-icon {
        margin-left: 25px;
      }
    }
  }

  .header-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 350px;
    background: linear-gradient(to bottom, #E50F86, #F06292);
    border-radius: 0 0 100px 100px;
    padding: 0 30px;


  }

  .classifcation {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .icon {
      height: 80px;
      display: flex;
      align-items: center;
    }

    .class-item {
      flex-basis: 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .classifcation .class-item:nth-child(n+6) {
    margin-top: 30px;
  }

  .swiper {
    width: 100%;
    height: 350px;
    border-radius: 20px;
    overflow: hidden;
    margin-top: 20px;

    swiper {
      border-radius: 10px;
      height: 100%;
    }

    swiper-item {
      border-radius: 10px;
    }

    image {
      width: 100%;
    }
  }
}
</style>

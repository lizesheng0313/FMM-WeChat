<!--
 * @Author: lizesheng
 * @Date: 2023-04-14 09:56:56
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-15 08:28:55
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/searchList.vue
-->

<template>
  <view class="search-list">
    <view @tap="handleJumpGoodsDetails(item.id)" v-for="(item, index) in searchList" class="flex-container search-item">
      <image :src="item.pictureUrl" class="picture"></image>
      <view>
        <view class="name text-ellipsis">{{ item.name }}</view>
        <view class="price"><text class="symbol">¥</text>{{ item.price.toFixed(2) }}</view>
        <view class="volume"><text class='tips'>已售</text>{{ item.volume }}</view>
      </view>
    </view>
    <view v-if="searchList?.length === 0" class="nothing">
      <child-icon value="icon-wushuju" size="60" />
      <view class="nothing-text">暂无数据</view>
    </view>
  </view>
</template>
<script setup>
import Taro from '@tarojs/taro'
import childIcon from './Icon.vue'
import { defineProps } from 'vue';
const props = defineProps({
  searchList: {
    type: Array,
    default: [],
  },
})
// 商品详情
const handleJumpGoodsDetails = (id) => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + id
  })
}
</script>
<style lang="scss">
.search-list {
  position: relative;
  padding: 0 20px;

  .picture {
    flex-shrink: 0;
  }

  .search-item {
    margin-top: 20px;
    border-bottom: 1px solid #eee;
    padding-bottom: 20px;
  }

  .name {
    height: 80px;
  }

  .volume {
    margin-top: 15px;
    font-size: 24px;
    color: #777;
  }

  .price {
    color: #E8443A;
    font-size: 32px;
  }

  image {
    width: 180px;
    border-radius: 10px;
    height: 180px;
    margin-right: 20px;
  }

  .nothing {
    position: absolute;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
  }

  .nothing-text {
    font-size: 24px;
    color: #777;
    margin-top: 10px;
    position: relative;
    left: 25px;
  }
}
</style>
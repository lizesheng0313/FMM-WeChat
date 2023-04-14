
<template>
  <view class="search-list">
    <view @tap="handleJumpGoodsDetails(item.id)" v-for="(item, index) in searchList" class="flex-container search-item">
      <image :src="item.pictureUrl"></image>
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
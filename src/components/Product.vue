<!--
 * @Author: lizesheng
 * @Date: 2023-03-09 11:23:00
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-25 19:56:16
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/Product.vue
-->
<template>
  <view class="product_list">
    <view v-for="(item, index) in productList" class="product-item" @tap="handleJumpGoodsDetails(item.id)">
      <image :src="item.pictureUrl"></image>
      <view class="name text-ellipsis">{{ item.name }}</view>
      <view class="flex-container">
        <view class="price"><text class="symbol">¥</text>{{ item.price.toFixed(2) }}</view>
        <view class="volume"><text class='tips'>已售</text>{{ item.volume }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { defineProps } from 'vue';
const props = defineProps({
  productList: {
    type: Array,
    default: '',
  }
});
const handleJumpGoodsDetails = (id) => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + id
  })
}
</script>
<style lang="scss">
.product_list {
  display: flex;
  padding: 0 20px;
  justify-content: space-between;

  .product-item {
    padding-bottom: 15px;
    flex-shrink: 0;
    background: #fff;
    flex-basis: 49%;
    box-shadow: 0 0 5px rgba(255, 255, 255, 1);
    border-radius: 10px;
  }

  .symbol,
  .tips {
    font-size: 24px;
    display: inline-block;
    margin-right: 6px;
  }

  .name {
    font-size: 28px;
    font-weight: bold;
    padding-left: 15px;
    margin-top: 10px;
    height: 120px;
  }

  .price {
    color: #E50F86;
    font-size: 32px;
  }

  .flex-container {
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;

    .volume {
      font-size: 24px;
    }
  }

  image {
    height: 300px;
    width: 100%;
    border-radius: 10px 10px 0 0;
  }
}
</style>
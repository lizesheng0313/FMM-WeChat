<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:43:40
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-26 21:27:04
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/goodsDetails/index.vue
-->
<template>
  <view class="goods_details">
    <view class="swiper">
      <swiper class='swiper' :autoplay="true" indicator-active-color='#fff' :circular="true" :indicator-dots="true">
        <swiper-item v-for="item in goodsDetils?.pictureList" :key="item.id">
          <image :src="item" mode="widthFix"></image>
        </swiper-item>
      </swiper>
    </view>
    <view class="info">
      <view class="price"><text class="symbol">￥</text>{{ goodsDetils?.sku[0]?.skuPrice?.toFixed(2) }}<text
          class="q">起</text></view>
      <view class="name">{{ goodsDetils?.name }}</view>
      <view class="stock">
        <view>原价:￥{{ goodsDetils?.sku[0]?.skuOriginPrice }}</view>
        <view>库存:{{ goodsDetils?.sku[0]?.skuStock }}</view>
        <view>销量:{{ goodsDetils?.volume }}人购买</view>
      </view>
    </view>
    <view class="line"></view>
    <view class="select-box">
      <view>已选择: </view>
      <view>
        <view>{{ currentSelect?.name }}</view>
        <view>
          <view v-for="item in goodsDetils?.sku">
            <image :src="item.goods_picture" />
          </view>
        </view>
      </view>
    </view>
    <view class="line"></view>
    <view>
      <view class="title">产品介绍</view>
      <rich-text style="font-size:0" :nodes="goodsDetils?.introduction"></rich-text>
    </view>
  </view>
</template>
<script setup>
import { useRouter } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { ref, reactive } from 'vue'
import { get, post } from '../../utils/request'
import childIcon from '../../components/Icon.vue'

const router = useRouter()
const goodsDetils = ref()
const currentSelect = reactive({})
get('/api/manage/getDetails', {
  id: router.params.id
}).then(res => {
  res.data.specification = JSON.parse(res?.data?.specification) || []
  goodsDetils.value = res.data
  console.log(res.data.specification)
})

</script>
<style lang="scss">
.goods_details {
  .swiper {
    width: 100%;
    height: 700px;

    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .line {
    background: #F5F5F5;
    height: 20px;
  }

  .info {
    padding: 0 30px;
    margin-bottom: 20px;

    .price {
      margin-top: 20px;
      font-size: 36px;
      color: #E50F86;
    }

    .symbol {
      font-size: 24px;
      margin-right: 6px;
    }

    .q {
      font-size: 24px;
    }

    .name {
      margin-top: 20px;
      font-size: 32px;
    }

    .stock {
      font-size: 24px;
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      color: #b5b4b4;
    }
  }

  .title {
    height: 80px;
    font-size: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  img {
    font-size: 0;
    line-height: 0;
    display: block;
  }
}
</style>
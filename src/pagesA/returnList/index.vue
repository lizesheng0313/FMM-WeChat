<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-06 14:17:36
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/returnList/index.vue
-->
<template>
  <view class="order_list">
    <view class="order_details">
      <view v-for="item in orderStatusList" class="order_warp" @tap="() => { handleJumpOrderDetails(item.id) }">
        <view class="flexBetWeenCenter official_box">
          <view class="flexCenter official">
            <child-icon class="icon" value="icon-shangcheng" size="14" color="#000"></child-icon>
            <view class="name">官方直营</view>
            <child-icon class="icon" value="icon-youjiantou" size="11" color="#000"></child-icon>
          </view>
          <view class="status">{{ RETURNSTATUS[item?.status] }}</view>
        </view>
        <view class="flexSpaceStart">
          <view class="flex">
            <image :src=item.goods_picture class="goods_picture" />
            <view class="name">{{ item.goods_name }}</view>
          </view>
          <view class="goods_info">
            <view class="total_price"><text style="font-size:12px">￥</text>{{ item.total_price.toFixed(2) }}</view>
            <view class="total_number">共{{ item.quantity }}件</view>
          </view>
        </view>
      </view>
      <view v-if="orderStatusList?.length === 0" class="nothing">
        <child-icon value="icon-wushuju" size="60" />
        <view class="nothing-text">暂无数据</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useDidShow, useLoad, useReachBottom } from '@tarojs/taro'
import { get, post } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import { RETURNSTATUS } from './constant'
const searchValue = ref('')
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
})
const orderStatusList = ref([])
const total = ref(0)
useDidShow(() => {
  page.pageIndex = 1
  handleSelectOrder({
    ...page,
  })
})

// 订单详情
const handleJumpOrderDetails = (id) => {
  Taro.navigateTo({
    url: '/pagesA/returnDetails/index?id=' + id
  })
}

const handleSelectOrder = (item) => {
  Taro.showLoading({
    title: '加载中...',
    mask: true
  })
  get('/api/order/getReturnOrder', {
    ...page,
  }).then(res => {
    orderStatusList.value = res.data.list
    total.value = res.data.total
  })
}

useReachBottom(() => {
  if (orderStatusList.value?.length < total.value) {
    page.pageIndex += 1
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    get('/api/order/getReturnOrder', {
      ...page
    }).then(res => {
      Taro.hideLoading()
      orderStatusList.value = orderStatusList.value.concat(res.data.list)
      total.value = res.data.total
    })
  }
})

const onShareAppMessage = () => {
  return {
    title: '肥猫猫情趣商城',
    imageUrl: '',
    path: '/pages/index/index'
  }
}


</script>
<style lang="scss">
.order_list {
  background: #F0F1F3;
  min-height: 100vh;
  padding: 20px 20px 10px 20px;
  box-sizing: border-box;

  .official_box {
    margin-bottom: 20px;
    color: #000;
    font-size: 24px;
    font-weight: 500;

    .icon {
      font-weight: bold;
    }

    .name {
      margin-left: 5px;
      margin-right: 5px !important;
    }
  }

  .order_details {
    .order_warp {
      background: #fff;
      padding: 30px 20px;
      margin-bottom: 20px;
      border-radius: 20px;

      .goods_picture {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        flex-shrink: 0;
        margin-right: 10px;
      }

      .goods_info {
        position: relative;
        top: 30px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }

      .name {
        margin-right: 100px;
      }

      .total_price {
        font-weight: bold;
        font-size: 32px;
      }

      .total_number {
        margin-top: 5px;
        color: #A8A8A8;
        font-size: 24px;
      }
    }

    .btn_red {
      background: #E8443A;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 152px;
      box-sizing: border-box;
      height: 55px;
      margin-right: 10px;
      border-radius: 100px;
    }

    .btn_grey {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #A8A8A8;
      width: 150px;
      box-sizing: border-box;
      height: 55px;
      margin-right: 10px;
      border-radius: 100px;
    }

    .btn_red_border {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E8443A;
      width: 150px;
      height: 55px;
      margin-right: 10px;
      color: #E8443A;
      border-radius: 100px;
    }

    .btn_group {
      box-sizing: border-box;
      display: flex;
      font-size: 24px;
      justify-content: flex-end;
    }
  }

  .nothing {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -40%);
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

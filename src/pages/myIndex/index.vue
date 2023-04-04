<!--
 * @Author: lizesheng
 * @Date: 2023-03-07 12:29:47
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-03 15:04:40
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/myIndex/index.vue
-->
<template>
  <view class="my-index">
    <view class="header flexCenter">
      <!-- <image src="../../assets/images/header/header1.png" class="header_img"></image> -->
      <view class="user-info">
        <view>快乐小白兔</view>
        <view class="vip flexCenterAll">普通用户</view>
      </view>
    </view>
    <view class="order_box">
      <view class="flexBetWeenCenter">
        <view class="title">我的订单</view>
        <view class="flexCenter right_order">
          全部订单
          <child-icon @tap="handleJumpOrderList" class="right_arrow" value="icon-youjiantou" size="10"></child-icon>
        </view>
      </view>
    </view>
    <view class="order_list flexCenter">
      <view v-for="item in orderList" :key="item.order" class="order-box flexDSpaceCenterEnd relative">
        <child-icon :color="item?.color" @tap="handleJumpOrderList(item.order)" :value="item.icon" size="30"></child-icon>
        <view>
          <view>{{ item.title }}</view>
          <view v-if="item?.value" class="total flexCenterAll">{{ item?.value }}</view>
        </view>
      </view>
    </view>
    <view class="order_box">
      <view class="flexBetWeenCenter">
        <view class="title">其它功能</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useRouter } from '@tarojs/taro'
import { useDidShow, useLoad } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'

useDidShow(() => {
  get('/api/order/getOrderStatusCount').then(res => {
    orderList[0].value = res.pending_payment_count
    orderList[1].value = res.pending_delivery_count
    orderList[2].value = res.shipped_order_count
    orderList[3].value = res.return_order_count
  })
})

const handleJumpOrderList = () => {
  Taro.navigateTo({
    url: '/pages/orderList/index'
  })
}

const orderList = [
  {
    title: '待付款',
    icon: 'icon-daifukuan',
    order: 0,
    value: 0,
  },
  {
    title: '待发货',
    icon: 'icon-daifahuo',
    order: 1,
    value: 0,
  },
  {
    title: '待收货',
    icon: 'icon-daifahuo',
    order: 2,
    value: 0,
  },
  {
    title: '退换货',
    icon: 'icon-tuichu',
    order: 3,
    color: '#000',
    value: 0,
  },
  {
    title: '已完成',
    icon: 'icon-daipingjia',
    order: 4,
    value: 0,
  },
]

</script>
<style lang="scss">
.my-index {
  .header {
    margin-top: 20px;
    margin: 30px 20px 20px 20px;
    background: #E8443A;
    border-radius: 15px;
    height: 200px;
    padding-left: 40px
  }

  .total {
    position: absolute;
    right: 33px;
    top: -8px;
    width: 30px;
    height: 30px;
    border-radius: 100px;
    background: #E8443A;
    color: #fff;

  }

  .order_list {
    margin-top: 40px;
    padding: 0 20px;
  }

  .order-box {
    color: #9C9BA1;
    flex-basis: 25%;
  }

  .header_img {
    border-radius: 100px;
    width: 100px;
    height: 100px;
  }

  .user-info {
    margin-left: 20px;
    color: #fff;
    font-size: 28px;

    .vip {
      margin-top: 5px;
      background: #474656;
      border-radius: 100px;
      text-align: center;
      font-size: 24px;
      padding: 5px 10px;
    }
  }

  .order_box {
    margin-top: 30px;
    padding: 0 20px;

    .title {
      font-weight: bold;
    }

    .right_order {
      color: #959499;
    }

    .right_arrow {
      margin-left: 10px;
    }
  }
}
</style>

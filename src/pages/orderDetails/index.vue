<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-11 15:23:25
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/orderDetails/index.vue
-->
<template>
  <view class="order-details">
    <view class="header">
      <navTitle rightColor="#fff" title="订单详情" color="#fff"></navTitle>
      <view class="status">{{ ORDERSTATUS[goodsDetails.order_status] }}</view>
      <view class="address_info_box">
        <view class="name flexCenter">
          <child-icon value="icon-31dingwei"></child-icon>
          {{ goodsDetails?.address_name }}
          <view class="phone">{{ goodsDetails?.address_phone }}</view>
        </view>
        <view class="info">{{ goodsDetails?.province }}{{ goodsDetails?.city }}{{ goodsDetails?.streetName
        }}{{ goodsDetails?.address_detail }}</view>
      </view>
      <view class="goods_info" @tap="handleJumpGoodsDetails">
        <image :src="goodsDetails.goods_picture"></image>
        <view>
          <view class="name">{{ goodsDetails?.name }}</view>
          <view class="sku">数量：{{ goodsDetails?.quantity }}<text class="sku_string">{{
            goodsDetails?.sku_string.split(',').join(';') }}</text>
          </view>
          <view class="price"><text class="symbol">￥</text>{{ goodsDetails?.total_price?.toFixed(2) }}</view>
        </view>
      </view>
      <view class="order_info">
        <view class="flexBetWeenCenter">
          <view>
            <text class="title">订单编号：</text>
            {{ goodsDetails?.id }}
          </view>
          <view class="copy" @tap="handleCopyTextToClipboard">复制</view>
        </view>
        <view class="time"><text class="title">下单时间：</text>{{ getCurrentDate(goodsDetails?.create_time) }}</view>
        <view class="time" v-if="goodsDetails?.pay_status === 1"><text class="title">支付时间：</text>{{
          getCurrentDate(goodsDetails?.payment_time) }}
        </view>
      </view>
      <view class="order_price">
        <view class="flexBetWeenCenter">运费：<text>{{ goodsDetails?.freight || '免运费' }}</text>
        </view>
        <view class="flexBetWeenCenter total">金额总计：<text class="total_price"><text class="symbol">￥</text>{{
          (goodsDetails?.total_price +
            (goodsDetails?.freight ||
              0)).toFixed(2) }}</text>
        </view>
        <view v-if="goodsDetails?.pay_status === 1">实付款：{{ goodsDetails?.act_pay.toFixed(2) }}</view>
        <view class="flexCenterAll service" @tap="handleOpenService">
          <child-icon size="20" value="icon-kefu1"></child-icon>
          <view class="text">联系客服</view>
        </view>
      </view>
    </view>
    <view class="footer">
      <view v-if="goodsDetails?.pay_status === '0' && goodsDetails?.order_status === '10'" class="flexCenter">
        <view class="btn_grey" @tap="handleCancleOrder">取消订单</view>
        <view class="btn_red">立即支付</view>
      </view>
      <view class="btn_grey" v-if="goodsDetails?.order_status === '10' && goodsDetails?.pay_status === '1'"
        @tap="handleApplyRefund">申请退款</view>
      <view class="btn_red" v-if="goodsDetails?.order_status === '20'" @tap="handleSubmitReceipt">确认收货</view>
      <view class="btn_grey" v-if="goodsDetails?.order_status === '30' || goodsDetails?.order_status === '40'">申请退货</view>
      <view class="btn_grey" v-if="goodsDetails.order_status !== '10' && goodsDetails?.order_status !== '60'"
        @tap="handleChecklogistics">查看物流</view>
      <view class="btn_grey" v-if="goodsDetails.order_status === '40' || goodsDetails.order_status === '60'"
        @tap="handleDeleteOrder">删除订单</view>
      <view class="btn_red_border" v-if="goodsDetails.order_status === '60'" @tap="handleRepurchase">再次购买</view>
      <view class="btn_red_border"
        v-if="goodsDetails.order_status === '30' || goodsDetails.order_status === '40' || goodsDetails.order_status === '20'"
        @tap="handleJumpReturnGoods">售后</view>
    </view>
  </view>
</template>

<script setup>
import Taro, { useLoad } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import navTitle from '../../components/navTitle.vue'
import { ORDERSTATUS } from '../orderList/constant'
import { getCurrentDate } from '../../utils/utils'

const goodsDetails = ref('')
useLoad((e) => {
  fetchDetails(e.id)
})

const fetchDetails = (id) => {
  get('/api/order/getOrderDetails', {
    id
  }).then(res => {
    goodsDetails.value = res.data
  })
}

const handleJumpGoodsDetails = () => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + goodsDetails.value.goods_id
  })
}

const handleChecklogistics = () => {
  const log_info = {
    logistics_no: goodsDetails.value.logistics_no,
    picture_list: goodsDetails.value.picture_list,
    address_detail: `${goodsDetails?.value?.province}${goodsDetails?.value?.city}${goodsDetails?.value?.streetName}${goodsDetails?.value?.address_detail}`
  }
  Taro.navigateTo({
    url: '/pages/logistics/index?log_info=' + JSON.stringify(log_info)
  })
}

const handleJumpReturnGoods = () => {
  Taro.navigateTo({
    url: `/pages/returnGoods/index?id=${goodsDetails.value.id}`
  })
}

const handleCancleOrder = () => {
  Taro.showModal({
    title: '确认取消订单吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/cancleOrder', {
          id: goodsDetails.value.id
        }).then(res => {
          fetchDetails(goodsDetails.value.id)
        })
      }
    }
  })
}

const handleApplyRefund = () => {
  Taro.showModal({
    title: '确认退款吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/refund', {
          id: goodsDetails.value.id
        }).then(res => {
          fetchDetails(goodsDetails.value.id)
        })
      }
    }
  })
}
const handleDeleteOrder = () => {
  Taro.showModal({
    title: '确认删除订单吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/deleteOrder', {
          id: goodsDetails.value.id
        }).then(res => {
          Taro.navigateBack()
        })
      }
    }
  })
}

const handleSubmitReceipt = () => {
  Taro.showModal({
    title: '确认收货吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/confirmReceipt', {
          id: goodsDetails.value.id
        }).then(res => {
          fetchDetails(goodsDetails.value.id)
        })
      }
    }
  })
}

const handleCopyTextToClipboard = () => {
  Taro.setClipboardData({ data: goodsDetails.value?.id })
    .then(() => {
      Taro.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 1000
      })
    })
}
const handleOpenService = async () => {
  const token = await get('/api/program/getToken')
  wx.sendCustomMessage({
    access_token: token,
    touser: Taro.getStorageSync("user_id"),
    msgtype: 'link',
    link: {
      thumb_url: goodsDetails?.value?.goods_picture,
      title: goodsDetails?.value?.name,
    },
    success: res => {
      console.log('打开客服会话界面成功', res)
    },
    fail: err => {
      console.error('打开客服会话界面失败', err)
    }
  })
}
</script>
<style lang="scss">
.order-details {
  background: #F0F1F3;
  min-height: 100vh;
  width: 100vw;
  overflow-x: hidden;

  .header {
    height: 300px;
    background: linear-gradient(to bottom, #E8443A, #F06292);
    padding: 0 30px;

    .service {
      border-top: 1px solid #e6e6e6;
      font-weight: bold;
      height: 100px;
      position: relative;
      top: 20px;

      .text {
        margin-left: 10px;
      }
    }

    .order_price {
      margin-top: 20px;
      background: #fff;
      border-radius: 10px;
      padding: 20px;

      .total {
        margin-top: 30px;
      }

      .total_price {
        font-weight: bold;
      }

      text {
        color: #000;
      }
    }

    .order_info {
      margin-top: 20px;
      background: #fff;
      border-radius: 10px;
      padding: 20px;

      .title {
        color: #333;
      }

      .time {
        margin-top: 20px;
      }

      .copy {
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #A8A8A8;
        box-sizing: border-box;
        margin-right: 10px;
        padding: 5px 20px;
        font-size: 22px;
        border-radius: 100px;
      }
    }

    .status {
      color: #fff;
      font-size: 32px;
      position: relative;
      top: 20px;
      left: 40px;
    }

    .address_info_box {
      margin-top: 100px;
      padding: 20px 0px;
      border-radius: 20px;
      background: #fff;

      .name {
        font-weight: bold;
        margin-left: 20px;
        font-size: 32px;
      }

      .phone {
        margin-left: 10px;
      }

      .info {
        margin-top: 10px;
        margin-left: 50px;
        font-size: 28px;
        color: #A8A8A8;
      }
    }

    .goods_info {
      border-radius: 10px;
      display: flex;
      background: #fff;
      padding: 20px;
      margin-top: 20px;

      image {
        width: 150px;
        height: 150px;
        border-radius: 10px;
        margin-right: 20px;
      }

      .name {
        margin-bottom: 20px;
      }

      .sku {
        color: #A8A8A8;
        font-size: 24px;
      }

      .sku_string {
        margin-left: 20px;
      }

      .price {
        margin-top: 10px;
        color: #E8443A;
        font-weight: bold;
        font-size: 30px;
      }

      .symbol {
        margin-right: 2px;
        font-size: 24px;
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    height: 80px;
    font-size: 24px;
    padding-right: 20px;
    box-sizing: border-box;

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
  }
}
</style>

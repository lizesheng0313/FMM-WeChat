<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-09 21:29:59
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/returnDetails/index.vue
-->
<template>
  <view class="order-details">
    <view class="header">
      <navTitle rightColor="#fff" :title="goodsDetails.status === '2' ? RETURNSTATUS[goodsDetails.status] : '退货详情'"
        color="#fff"></navTitle>
      <view class="status">{{ goodsDetails.status === '2' ? '请将商品邮寄到以下地址' : RETURNSTATUS[goodsDetails.status] }}
        <view v-if="goodsDetails.status === '2'" class="return_address">
          <view class="flexCenter">
            <view>退货地址：</view>
            {{ goodsDetails?.return_address }}
            <view class="phone">{{ goodsDetails?.return_address_phone }}</view>
          </view>
        </view>
      </view>
      <view class="goods_info" @tap="handleJumpGoodsDetails">
        <image :src="goodsDetails.goods_picture"></image>
        <view>
          <view class="name">{{ goodsDetails?.goods_name }}</view>
          <view class="sku">数量：{{ goodsDetails?.quantity }}{{ goodsDetails?.sku_string }}</view>
          <view class="price"><text class="symbol">￥</text>{{ goodsDetails?.total_price?.toFixed(2) }}</view>
        </view>
      </view>
      <view class="order_info">
        <view class="time"><text class="title">退货原因：</text>{{ goodsDetails.reason }}</view>
        <view class="time" v-if="goodsDetails?.memo"><text class="title">退货描述：</text>{{ goodsDetails.memo }}</view>
        <view class="time" v-if="goodsDetails?.picture_list?.lenght > 0"><text class="title">退货凭证：</text>
          <view v-for="item in goodsDetails.picture_list">
            <image :src="item" class="certificate"></image>
          </view>
        </view>
      </view>
      <view class="order_info">
        <view class="flexBetWeenCenter">
          <view>
            <text class="title">订单编号：</text>
            {{ goodsDetails?.order_id }}
          </view>
          <view class="copy" @tap="() => { handleCopyTextToClipboard(goodsDetails?.order_id) }">复制</view>
        </view>
        <view class="time"><text class="title">下单时间：</text>{{ getCurrentDate(goodsDetails?.create_time) }}</view>
        <view class="time"><text class="title">支付时间：</text>{{ getCurrentDate(goodsDetails?.payment_time) }}</view>
        <view class="time"><text class="title">退货/退款申请：</text>{{ getCurrentDate(goodsDetails?.apply_time) }}</view>
        <view class="time" v-if="goodsDetails?.refund_time"><text class="title">退款时间：</text>{{
          getCurrentDate(goodsDetails?.refund_time) }}</view>
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
    <view class="footer" v-if="goodsDetails?.status !== '5'">
      <view class="btn_grey">上传凭证</view>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { useLoad } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import navTitle from '../../components/navTitle.vue'
import { RETURNSTATUS } from '../returnList/constant'
import { getCurrentDate } from '../../utils/utils'

const goodsDetails = ref('')
useLoad((e) => {
  get('/api/order/getReturnDetails', {
    id: e.id
  }).then(res => {
    goodsDetails.value = res.data
  })
})
const handleCopyTextToClipboard = () => {
  Taro.setClipboardData({ data: goodsDetails.value?.order_id })
    .then(() => {
      Taro.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 1000
      })
    })
}
const handleJumpGoodsDetails = () => {
  Taro.navigateTo({
    url: '/pages/goodsDetails/index?id=' + goodsDetails.value.goods_id
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
  padding-bottom: 80px;
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
        margin-top: 10px;
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

    .return_address {
      font-size: 28px;
      margin-top: 10px;
      margin-bottom: 30px;
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
        flex-shrink: 0;
        border-radius: 10px;
        margin-right: 20px;
      }

      .name {
        margin-bottom: 20px;
      }

      .sku {
        color: #A8A8A8;
        font-size: 26px;
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
    padding-right: 20px;
    height: 80px;
    font-size: 24px;

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

  .certificate {
    width: 100px;
    height: 100px;
  }
}
</style>

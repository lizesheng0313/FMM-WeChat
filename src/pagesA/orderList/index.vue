<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-06 14:18:45
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pagesA/orderList/index.vue
-->
<template>
  <view class="order_list">
    <scroll-view scrollX class="order_select_box">
      <view class="flex order_select_scroll">
        <view v-for="(item, index) in orderList" class="order_select flexDCenterCenter"
          :class="{ active: current === index }" @tap="() => { handleSelectOrder(item, index) }">
          {{ item.title }}
          <view class="border" :class="{ active_border: current === index }"></view>
        </view>
      </view>
    </scroll-view>
    <view class="order_details">
      <view v-for="item in orderStatusList" class="order_warp" @tap="() => { handleJumpOrderDetails(item.id) }">
        <view class="flexBetWeenCenter official_box">
          <view class="flexCenter official">
            <child-icon class="icon" value="icon-shangcheng" size="14" color="#000"></child-icon>
            <view class="name">官方直营</view>
            <child-icon class="icon" value="icon-youjiantou" size="11" color="#000"></child-icon>
          </view>
          <view class="status">{{ item.order_status === '10' && item.pay_status === '0' ? '待付款' :
            ORDERSTATUS[item.order_status] }}</view>
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
        <view class="btn_group">
          <view v-if="item.pay_status === '0' && item.order_status === '10'" class="flexCenter">
            <view class="btn_grey" @tap="(e) => { handleCancleOrder(e, item.id) }">取消订单</view>
            <view class="btn_red" @tap="(e) => { handlePay(e, item) }">立即支付</view>
          </view>
          <view class="btn_red" v-if="item.order_status === '20'" @tap="(e) => { handleSubmitReceipt(e, item) }">确认收货
          </view>
          <view v-if="item.order_status !== '10' && item.order_status !== '60'"
            @tap="(e) => { handleChecklogistics(e, item) }">
            <view class="btn_grey">查看物流</view>
          </view>
          <view v-if="item.order_status === '40' || item.order_status === '60'" class="btn_grey"
            @tap="(e) => { handleDeleteOrder(e, item) }">删除订单</view>
          <view v-if="item.order_status === '60'" class="btn_red_border" @tap="(e) => { handleRepurchase(e, item) }">再次购买
          </view>
          <view v-if="item.order_status === '10' && item.pay_status === '1'" class="flexCenter"
            @tap="(e) => { handleApplyRefund(e, item) }">
            <view class="btn_grey">申请退款</view>
          </view>
          <view class="btn_red_border"
            v-if="item.order_status === '30' || item.order_status === '40' || item.order_status === '20'"
            @tap="(e) => { handleJumpReturnGoods(e, item) }">售后</view>
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
var plugin = requirePlugin("logisticsPlugin")
import config from "../../config/confg";
import Taro, { useDidShow, useLoad, useReachBottom } from '@tarojs/taro'
import { get, post } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import { ORDERSTATUS } from './constant'
const searchValue = ref('')
const current = ref(0)
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
  pay_status: '',
  order_status: ''
})
const orderStatusList = ref([])
const total = ref(0)
const orderList = ref([
  {
    title: '全部',
  },
  {
    title: '待付款',
    pay_status: '0'
  },
  {
    title: '待发货',
    order_status: '10'
  },
  {
    title: '待收货',
    order_status: '20'
  },
  {
    title: '已完成',
    order_status: '40'
  },
])
useDidShow((e) => {
  page.pageIndex = 1
  handleSelectOrder({
    ...page,
  }, current.value)
})
useLoad((e) => {
  page.order_status = e.order_status || ''
  page.pay_status = e.pay_status ? e.pay_status : ''
  current.value = +e.order || 0
})
// 订单详情
const handleJumpOrderDetails = (id) => {
  Taro.navigateTo({
    url: '/pagesA/orderDetails/index?id=' + id
  })
}
const handleJumpReturnGoods = (e, item) => {
  e.stopPropagation()
  Taro.navigateTo({
    url: `/pages/returnGoods/index?id=${item.id}`
  })
}
const handleChecklogistics = (e, item) => {
  e.stopPropagation()
  plugin.openWaybillTracking({
    waybillToken: item.waybill_token
  });
}
const handlePay = (e, item) => {
  e.stopPropagation()
  post('/api/order/payment', {
    order_id: item.id,
    name: item.goods_name,
  }).then(payInfo => {
    Taro.requestPayment({
      timeStamp: payInfo.data.timeStamp,
      nonceStr: payInfo.data.nonceStr,
      package: payInfo.data.package,
      signType: payInfo.data.signType,
      paySign: payInfo.data.paySign,
      success: function () {
        handleSelectOrder({
          pageIndex: 1,
          pay_status: page.pay_status,
          order_status: page.order_status
        }, current.value)
      },
    });
  })
}
//取消
const handleCancleOrder = (e, id) => {
  e.stopPropagation()
  Taro.showModal({
    title: '确认取消订单吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/cancleOrder', {
          id
        }).then(res => {
          handleSelectOrder({
            pageIndex: 1,
            pay_status: page.pay_status,
            order_status: page.order_status
          }, current.value)
        })
      }
    }
  })
}

const handleDeleteOrder = (e, item) => {
  e.stopPropagation()
  Taro.showModal({
    title: '确认删除订单吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/deleteOrder', {
          id: item.id
        }).then(res => {
          handleSelectOrder({
            pageIndex: 1,
            pay_status: page.pay_status,
            order_status: page.order_status
          }, current.value)
        })
      }
    }
  })
}

const handleSelectOrder = (item, index) => {
  current.value = index
  page.pageIndex = item?.pageIndex || 1
  page.pay_status = typeof item?.pay_status !== 'undefined' ? item.pay_status : ''
  page.order_status = item?.order_status || ''
  Taro.showLoading({
    title: '加载中...',
    mask: true
  })
  get('/api/order/getListStatus', {
    ...page,
  }).then(res => {
    orderStatusList.value = res.data.list
    total.value = res.data.total
  })
}


// 回购
const handleRepurchase = (e, item) => {
  e.stopPropagation()
  Taro.showLoading({ title: '回购中' })
  get('/api/goods/getDetails', {
    id: item.goods_id
  }).then(res => {
    const items = res.data.specification.split('|');
    const result = [];
    for (let i = 0; i < items.length; i += 2) {
      const name = items[i];
      const tagStr = items[i + 1];
      const tags = tagStr ? tagStr.split('!') : [];
      result.push({
        name,
        tag: tags,
      });
    }
    const sku = res.data.sku.filter(it => it.skuId === item.sku_id)[0]
    const info = {
      goodsId: item.goods_id,
      goodsInfo: {
        ...sku
      },
      freight: res.data.freight,
      specification: result,
      name: item.goods_name,
      totalNumber: 1
    }
    Taro.setStorageSync('goodsInfo', JSON.stringify(info))
    Taro.navigateTo({
      url: '/pages/order/index'
    })
  })
}

// 申请退款
const handleApplyRefund = (e, item) => {
  e.stopPropagation()
  Taro.showModal({
    title: '确认退款吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/applyRefund', {
          id: item.id
        }).then(res => {
          handleSelectOrder({
            pageIndex: page.pageIndex,
            pay_status: page.pay_status,
            order_status: page.order_status
          }, current.value)
        })
      }
    }
  })
}

// 确认收货
const handleSubmitReceipt = (e, item) => {
  e.stopPropagation()
  Taro.showModal({
    title: '确认收货吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/confirmReceipt', {
          id: item.id
        }).then(res => {
          handleSelectOrder({
            pageIndex: page.pageIndex,
            pay_status: page.pay_status,
            order_status: page.order_status
          }, current.value)
        })
      }
    }
  })
}

useReachBottom(() => {
  if (orderStatusList.value?.length < total.value) {
    page.pageIndex += 1
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    get('/api/order/getListStatus', {
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
  min-height: 101vh;
  padding: 0 20px 10px 20px;

  .order_select_box {
    position: sticky;
    top: 0px;
    background-color: #F0F1F3;
    z-index: 3;
  }

  .order_select_scroll {
    align-items: center;
    justify-content: space-between;
  }

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

  .order_select_box {
    padding: 30px 0 15px 0;

    .border {
      background: #F0F1F3;
      width: 40px;
      margin-top: 10px;
      height: 4px;
      color: #A8A8A8;
    }

    .active_border {
      background: #E8443A;
      width: 40px;
      margin-top: 10px;
      height: 4px;
      color: #A8A8A8;
    }

    .active {
      color: #000;
      font-weight: bold;
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
      position: relative;
      z-index: 2;
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

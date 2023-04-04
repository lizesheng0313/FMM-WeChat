<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-03 20:13:43
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/orderList/index.vue
-->
<template>
  <view class="order_list">
    <scroll-view scrollX class="order_select_box">
      <view @click="handleSelectOrder" v-for="(item, index) in orderList" class="order_select flexDCenterCenter"
        :class="{ active: current === index }">
        {{ item.title }}
        <view v-if="current === index" class="border"></view>
      </view>
    </scroll-view>
    <view class="order_details">
      <view v-for="item in orderStatusList" class="order_warp flex" @tap="handleJumpOrderDetails(item.id)">
        <view>
          <image :src=item.goods_picture class="goods_picture" />
          <view>{{ item.name }}</view>
          <view>
            <view class="total_price">{{ item.total_price }}</view>
            <view>共{{ item.quantity }}件</view>
          </view>
        </view>
        <view v-if="item.pay_status === 0 && item.order_status !== 50" class="flexCenter">
          <view class="btn_grey" @tap="handleCancleOrder(item.id)">取消订单</view>
          <view class="btn_red">立即支付</view>
        </view>
        <view v-if="item.order_status === 10 && item.pay_status === 1" class="flexCenter">
          <view class="btn_grey">申请退款</view>
        </view>
        <view v-if="item.order_status === 20" class="flexCenter">
          <view class="btn_red">确认收货</view>
          <view class="btn_grey">申请退货</view>
          <view class="btn_grey_border">查看物流</view>
        </view>
        <view v-if="item.order_status === 50" class="flexCenter">
          <view class="btn_grey_border" @tap="handleRepurchase(item)">再次购买</view>
        </view>
        <view v-if="item.order_status === 40" class="flexCenter">
          <view class="btn_grey_border">删除订单</view>
          <view class="btn_red" @tap="handleRepurchase(item)">再次购买</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
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
const orderList = [
  {
    title: '待付款',
    pay_status: 0
  },
  {
    title: '待发货',
    order_status: 10
  },
  {
    title: '待收货',
    order_status: 20
  },
  {
    title: '退换货',
    order_status: 50
  },
  {
    title: '已完成',
    order_status: 40
  },
]

// 商品详情
const handleJumpOrderDetails = (id) => {
  Taro.navigateTo({
    url: '/pages/orderDetails/index?id=' + id
  })
}

//取消
const handleCancleOrder = (id) => {
  Taro.showModal({
    title: '确认取消订单吗?',
    success(res) {
      if (res.confirm) {
        post('/api/order/cancleOrder', {
          id
        }).then(res => {
          handleSelectOrder({
            pageIndex: page.pageIndex,
            pay_status: page.pay_status,
            order_status: page.order_status
          })
        })
      }
    }
  })
}

// 回购
const handleRepurchase = (item) => {
  const info = {
    goodsId: item.goods_id,
    goodsInfo: {
      ...currentSelect.value
    },
    specification: goodsDetils.value.specification,
    name: goodsDetils.value.name,
    totalNumber: state.totalNumber
  }
  Taro.setStorageSync('goodsInfo', JSON.stringify(info))
  Taro.navigateTo({
    url: '/pages/order/index'
  })
}

const handleSelectOrder = (item) => {
  page.pageIndex = item?.pageIndex || 1
  page.pay_status = item?.pay_status || ''
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

// 下拉加载事件
function onPullDownRefresh() {
  if (orderStatusList.value?.length < total) {
    Taro.showLoading({
      title: '加载中...',
      mask: true
    })
    get('/api/order/getListStatus', {
      ...page
    }).then(res => {
      page.pageIndex += 1
      Taro.hideLoading()
      orderStatusList.value = orderStatusList.value.concat(res.data.list)
      total.value = res.data.total
    })
  }
}


</script>
<style lang="scss">
.order_list {
  background: #F0F1F3;

  .order_select_box {
    padding: 0 20px;
    display: flex;

    .order_select {
      margin-right: 20px;
    }

    .border {
      background: #E8443A;
      width: 40px;
      margin-top: 10px;
      color: #A8A8A8;
    }

    .active {
      color: #000;
    }
  }

  .order_details {
    .order_warp {
      .goods_picture {
        width: 120px;
        height: 120px;
        border-radius: 100px;
      }
    }

    .btn_red {
      background: #E8443A;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 150px;
    }

    .btn_grey {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #A8A8A8;
      width: 150px;
    }

    .btn_grey_border {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #E8443A;
      width: 150px;
    }

    .total_price {
      font-weight: bold;
      font-size: 32px;
    }
  }
}
</style>

<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-31 16:44:45
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/order/index.vue
-->
<template>
  <view class="order">
    <view class="header">
      <navTitle title="确认订单" color="#fff"></navTitle>
      <view class="contact_box" @tap="handleJumpAddress">
        <view class="flexBetWeenCenter padding_box">
          <view>
            <view class="flexCenter name">
              <view>{{ contactInfo.name }}</view>
              <view class="phone">{{ contactInfo.phone }}</view>
            </view>
            <view class="address">{{ contactInfo.address }}</view>
          </view>
          <child-icon class="right_arrow grey" value="icon-youjiantou" size="12"></child-icon>
        </view>
        <image class="border_image" src="../../assets/images/border.png"></image>
      </view>
      <view class="flexSpaceStart order_goods">
        <image class="sku_image" :src="goodsDetails?.goodsInfo?.goods_picture"></image>
        <view class="sku_info">
          <view class="text-ellipsis">{{ goodsDetails?.name }}</view>
          <view class="sku">{{ goodsDetails?.goodsInfo?.skuId }}</view>
        </view>
        <view class="flexDSpaceEnd">
          <view class="price"><text class="txt">预估</text><text class="symbol">￥</text>{{ currentPrice }}</view>
          <view class="flexCenter oper">
            <view class="btn" @tap="handleMinus">-</view>
            <view class="total">{{ state.totalNumber }}</view>
            <view class="btn" @tap="handlePlus">+</view>
          </view>
        </view>
      </view>
      <view class="remark flexBetWeenCenter">
        <view class="title">买家留言</view>
        <input class="input" maxlength="100" placeholder="请输入留言信息给卖家" @input="handleChange">
      </view>
      <view class="remark pay flexBetWeenCenter">
        <view>支付总计</view>
        <view>￥{{ currentPrice }}</view>
      </view>
    </view>
    <view class="footer flexBetWeenCenter">
      <view class="flexCenter">
        <view>合计:</view>
        <view class="total_price"><text class="total_symbol">￥</text>{{ currentPrice }}</view>
      </view>
      <view class="submit_order" @tap="handleSubmitOrder">提交订单</view>
    </view>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { get, post } from '../../utils/request'
import { ref, reactive, watch } from 'vue'
import childIcon from '../../components/Icon.vue'
import navTitle from '../../components/navTitle.vue'
const goodsDetails = ref(JSON.parse(Taro.getStorageSync('goodsInfo')))
const contactInfo = ref({
  id: 2,
  name: '李泽胜',
  phone: '18210572133',
  address: '北京市朝阳区烟厂宿舍'
})
const state = reactive({
  totalNumber: goodsDetails.value?.totalNumber || 1
})
const currentPrice = ref(goodsDetails.value.goodsInfo.skuPrice * state.totalNumber)
function handleMinus() {
  if (state.totalNumber > 1) {
    state.totalNumber--
  }
}

function handlePlus() {
  state.totalNumber++
}

const handleJumpAddress = () => {
  Taro.navigateTo({
    url: '/paegs/address/index'
  })
}

const handleSubmitOrder = () => {
  post('/api/order/createOrder', {
    goodsId: goodsDetails.goodsId,
    skuId: goodsDetails.skuId,
    quantity: state.totalNumber,
    address_id: contactInfo.id,
    total_price: currentPrice,
    remark: searchValue.value
  }).then(res => {
    console.log(res)
  })
}

watch(state.totalNumber, (newValue, oldValue) => {
  currentPrice.value = goodsDetails.value.skuPrice * newValue
}
);

const searchValue = ref('')
const handleChange = (e) => {
  searchValue.value = e.target.value;
}

</script>
<style lang="scss">
.order {
  background: #F7F8FA;
  min-height: 100vh;

  .total_price {
    color: #E50F86;
    font-size: 40px;
    margin-left: 15px;

    .total_symbol {
      font-size: 24px;
    }
  }

  .oper {
    margin-top: 80px;
  }

  .header {
    height: 300px;
    background: linear-gradient(to bottom, #E50F86, #F06292);
    padding: 0 30px;
  }

  .contact_box {
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(255, 255, 255, 1);

    .padding_box {
      padding: 30px 20px;
    }

    .name {
      color: #333;
      font-weight: bold;
      font-size: 32px;
    }

    .phone {
      margin-left: 18px;
    }

    .address {
      margin-top: 20px;
      font-size: 28px;
      color: #9C9BA1;
    }

    .border_image {
      position: relative;
      height: 5px;
      top: 10px;
    }
  }

  .order_goods {
    background: #fff;
    margin: 20px 0px;
    border-radius: 10px;
    padding: 12px 20px;

    .sku_image {
      width: 180px;
      height: 180px;
      border-radius: 10px;
      flex-shrink: 0;
      margin-left: 20px;
    }

    .sku {
      margin-top: 30px;
      color: #919094;
    }

    .sku_info {}

    .stock {
      color: #b5b4b4;
      font-size: 24px;
    }

    .symbol {
      font-size: 24px;
      margin-right: 6px;
      color: #E50F86;
    }

    .price {
      padding-top: 0px;
      font-size: 26px;
      color: #E50F86;
    }

    .total {
      margin: 0 10px;
    }

    .btn {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      border: 1px solid #ccc;
      margin: 0 10px;
    }
  }

  .remark {
    background: #fff;
    margin-top: 20px;
    padding: 20px;

    .title,
    .pay {
      font-weight: bold;
    }
  }

  .footer {
    padding: 0 20px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 90px;
    background: #fff;

    .submit_order {
      padding: 15px 35px;
      color: #fff;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #E50F86;
    }
  }
}
</style>

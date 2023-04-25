<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-25 16:24:45
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/order/index.vue
-->
<template>
  <view class="order">
    <view class="header">
      <navTitle rightColor="#fff" title="确认订单" color="#fff"></navTitle>
      <view class="contact_box" @tap="handleJumpAddress">
        <view class="padding_box flexBetWeenCenter" v-if="contactInfo?.name">
          <view>
            <view class="flexCenter name">
              <view>{{ contactInfo?.name }}</view>
              <view class="phone">{{ contactInfo?.phone }}</view>
            </view>
            <view class="address">{{ contactInfo?.province }}{{ contactInfo?.city }}{{ contactInfo?.streetName }}{{
              contactInfo?.address }}</view>
          </view>
          <child-icon class="right_arrow grey" value="icon-youjiantou" size="12"></child-icon>
        </view>
        <view v-else class="address_info" @tap="handleJumpAddress">
          <view class="address_border">+添加地址</view>
        </view>
        <view class="border_image"></view>
      </view>
      <view class="flexSpaceStart order_goods">
        <image class="sku_image" :src="goodsDetails?.goodsInfo?.goods_picture"></image>
        <view class="sku_info">
          <view class="text-ellipsis">{{ goodsDetails?.name }}</view>
          <view class="flex" v-if="goodsDetails?.specification?.length > 0">
            <view class="sku" v-for="(item, index) in goodsDetails?.specification">
              {{ item.name }}:{{ skuList[index] }}
            </view>
          </view>
          <view v-else class="sku">{{ goodsDetails?.skuId }} </view>
        </view>
        <view class="flexDSpaceEnd">
          <view class="price"><text class="txt">预估</text><text class="symbol">￥</text>{{ currentPrice }}</view>
          <view class="flexBetWeenCenter total_setting">
            <view class="flexCenter border_number">
              <child-icon class="btn" value="icon-jianhao" size="18" @tap="handleMinus" />
              <view class="total">{{ state.totalNumber }}</view>
              <child-icon class="btn" size="19" value="icon-jiahao1" @tap="handlePlus" />
            </view>
          </view>
        </view>
      </view>
      <view class="remark flexBetWeenCenter">
        <view class="title">买家留言</view>
        <input class="input" maxlength="100" placeholder="请输入留言信息给卖家" @input="handleChange">
      </view>
      <view class="remark pay flexBetWeenCenter">
        <view>金额总计</view>
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
import { useDidShow } from '@tarojs/taro'
import { get, post } from '../../utils/request'
import { ref, reactive, watch } from 'vue'
import childIcon from '../../components/Icon.vue'
import navTitle from '../../components/navTitle.vue'
const goodsDetails = ref(JSON.parse(Taro.getStorageSync('goodsInfo')))
const contactInfo = ref()
const state = reactive({
  totalNumber: goodsDetails.value?.totalNumber || 1
})

useDidShow(() => {
  const info = Taro.getStorageSync('addressInfo')
  if (info) {
    contactInfo.value = JSON.parse(info)
    Taro.removeStorageSync('addressInfo')
  }
  else {
    get('/api/address/get').then(res => {
      const defaultAdress = res.data.list.filter(item => item.is_default === '1')[0]
      contactInfo.value = defaultAdress || res.data.list[0]
    })
  }
})


const currentPrice = ref(Number((goodsDetails.value.goodsInfo.skuPrice * state.totalNumber).toFixed(2)))
const skuList = goodsDetails.value?.goodsInfo?.skuId?.split(',')

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
    url: '/pages/address/index'
  })
}
const handleSubmitOrder = () => {
  if (!contactInfo?.value?.id) return Taro.showToast({ title: '请填写收货地址', icon: 'none' })
  Taro.showLoading({
    title: "下单中"
  })
  let skuString

  if (goodsDetails.value?.specification?.length > 0) {
    skuString = goodsDetails.value.specification.reduce((result, item, index) => {
      const skuValue = skuList[index] || '';
      const separator = index === 0 ? '' : ',';
      return `${result}${separator}${item.name}:${skuValue}`;
    }, '');
  }
  else {
    skuString = goodsDetails.value?.skuId
  }
  const act_price = (Number(goodsDetails.value.freight) + Number(currentPrice.value))
  console.log(act_price, '---act_price')
  post('/api/order/createOrder', {
    freight: goodsDetails.value.freight,
    goods_name: goodsDetails.value.name,
    goodsId: goodsDetails.value.goodsId,
    skuId: goodsDetails.value.goodsInfo.skuId,
    quantity: state.totalNumber,
    address_id: contactInfo.value.id,
    total_price: currentPrice.value,
    remark: searchValue.value,
    sku_string: skuString,
    act_price // 实际支付金额 
  }).then(payInfo => {
    console.log(payInfo, '---payInfo')
    if (payInfo?.data?.message) {
      Taro.showToast({
        title: payInfo?.data?.message,
        icon: 'none'
      })
      return
    }
    Taro.requestPayment({
      timeStamp: payInfo.data.timeStamp,
      nonceStr: payInfo.data.nonceStr,
      package: payInfo.data.package,
      signType: payInfo.data.signType,
      paySign: payInfo.data.paySign,
      success: function () {
        Taro.redirectTo({
          url: "/pages/orderDetails/index?id=" + payInfo.data.order_id
        })
      },
      fail: function () {
        Taro.redirectTo({
          url: "/pages/orderDetails/index?id=" + payInfo.data.order_id
        })
      }
    });
  })
}

watch(state, (newValue, oldValue) => {
  currentPrice.value = Number((goodsDetails.value.goodsInfo.skuPrice * state.totalNumber).toFixed(2));
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
    color: #E8443A;
    font-size: 40px;
    margin-left: 15px;

    .total_symbol {
      font-size: 24px;
    }
  }

  .address_info {
    padding: 30px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #323232;
    height: 100%;
  }

  .border_image {
    background-image: url('../../assets/images/border.png');
    background-size: cover;
    background-repeat: repeat-x;
    height: 10px;
    position: relative;
    top: 5px;
    z-index: 2;
    width: 100%;
  }

  .address_border {
    margin-top: 20px;
    height: 60px;
    width: 250px;
    border-radius: 6px;
    border: 2px dashed #bcbcbc;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .total_setting {
    margin-top: 60px;
  }

  .oper {
    margin-top: 80px;
  }

  .header {
    height: 250px;
    background: linear-gradient(to bottom, #E8443A, #F06292);
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
  }

  .order_goods {
    background: #fff;
    margin: 20px 0px;
    border-radius: 10px;
    padding: 20px 20px;

    .sku_image {
      width: 180px;
      height: 180px;
      border-radius: 10px;
      flex-shrink: 0;
      margin-right: 20px;
    }

    .sku {
      color: #aeadb2;
      font-size: 24px;
      margin-right: 10px;
    }

    .sku_info {
      .text-ellipsis {
        margin-bottom: 30px;
      }
    }

    .stock {
      color: #b5b4b4;
      font-size: 24px;
    }

    .symbol {
      font-size: 24px;
      margin-right: 6px;
      color: #E8443A;
    }

    .price {
      padding-top: 0px;
      font-size: 26px;
      color: #E8443A;
    }

    .total {
      width: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .border_number {
      height: 60px;
      display: flex;
      align-items: center;
      border-radius: 10px;
      border: 2px solid #eee;
    }

    .btn {
      border-right: 2px solid #eee;
      border-radius: 0 10px 10px 0;
      width: 60px;
      height: 60px;
      border-right: none;
      border-left: 2px solid #eee;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #F9F9F9;
    }
  }

  .remark {
    background: #fff;
    margin-top: 20px;
    padding: 20px;
    text-align: right;

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
      background: #E8443A;
    }
  }
}
</style>

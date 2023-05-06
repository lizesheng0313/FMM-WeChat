<!--
 * @Author: lizesheng
 * @Date: 2023-03-07 12:29:47
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-05-06 10:58:37
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/logistics/index.vue
-->
<template>
  <view class="logistics">
    <view class="order_info">
      <view class="flexBetWeenCenter">
        <view class="flexCenter">
          <image class="picutre" :src="goodsInfo?.goods_picture"></image>
          <view>{{ logisticsCompanies[goodsInfo?.logistics_company] }} {{ goodsInfo?.logistics_no }}</view>
        </view>
        <view class="copy" @tap="() => { handleCopyTextToClipboard(goodsInfo?.logistics_no) }">复制</view>
      </view>
    </view>
    <view v-if="logisticsInfo">
      <view class="address flex">
        <view>
          <view class="line_circle">
            <view class="circle"></view>
            <view class="line"></view>
          </view>
        </view>
        <view class="info">
          收货地址：{{ goodsInfo?.address_detail }}
        </view>
      </view>
      <time-line v-for="(item, index) in logisticsInfo" :index="index" :time="item.time" :desc="item.context"></time-line>
    </view>
  </view>
</template>

<script setup>
import Taro, { useRouter, useLoad } from '@tarojs/taro'
import { post } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import TimeLine from '../../components/TimeLine.vue'
import { logisticsCompanies } from './constant'
const goodsInfo = ref('')
const logisticsInfo = ref('')
useLoad((e) => {
  console.log(e, '----e')
  const waybill_token = e.waybill_token
  post('/api/order/getLogistics', {
    waybill_token
  }).then(res => {
    console.log(res)
    logisticsInfo.value = res.data
  })
})

const handleCopyTextToClipboard = (data) => {
  Taro.setClipboardData({ data })
    .then(() => {
      Taro.showToast({
        title: '复制成功',
        icon: 'none',
        duration: 1000
      })
    })
}

const onShareAppMessage = () => {
  return {
    title: '肥猫猫情趣商城',
    imageUrl: '',
    path: '/pages/index/index'
  }
}


</script>
<style lang="scss">
.logistics {
  padding: 0 20px;

  .address {
    .info {
      font-size: 24px;
      color: #818181;
      position: relative;
      top: -3px;
    }
  }

  .line_circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 15px;

  }

  .line {
    padding-bottom: 60px;
    background: #CCCCCC;
    width: 5px;
    height: 100%;
  }

  .circle {
    border-radius: 100px;
    width: 20px;
    flex-shrink: 0;
    height: 20px;
    background: #CCCCCC;
  }

  .order_info {
    margin-bottom: 20px;
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

  .picutre {
    width: 100px;
    height: 100px;
  }
}
</style>

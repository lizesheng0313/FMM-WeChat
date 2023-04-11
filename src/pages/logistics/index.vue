<!--
 * @Author: lizesheng
 * @Date: 2023-03-07 12:29:47
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-11 10:33:23
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/logistics/index.vue
-->
<template>
  <view class="logistics">
    <view>
      <view class="flexBetWeenCenter">
        <view class="flexCenter">
          <image class="picutre" :src="goodsInfo?.picture_list"></image>
          <view>{{ goodsInfo?.logistics_no }}</view>
        </view>
        <view @tap="() => { handleCopyTextToClipboard(goodsInfo?.logistics_no) }">复制</view>
      </view>
      <view>{{ goodsInfo?.address_detail }}</view>
    </view>
    <view>
      <time-line v-for="item in logisticsInfo" :time="item.upload_Time" :desc="item.processInfo"></time-line>
    </view>
  </view>
</template>

<script setup>
import Taro, { useRouter, useLoad, useDidShow } from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import TimeLine from '../../components/TimeLine.vue'
const goodsInfo = ref('')
const logisticsInfo = ref('')
useLoad((e) => {
  goodsInfo.value = JSON.parse(e.log_info)
  get('/api/order/getLogistics', {
    logistics_no: goodsInfo.value.logistics_no
  }).then(res => {
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


</script>
<style lang="scss">
.logistics {
  padding: 0 20px;

  .picutre {
    width: 100px;
    height: 100px;
  }
}
</style>

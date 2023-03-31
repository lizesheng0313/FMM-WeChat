<!--
 * @Author: lizesheng
 * @Date: 2023-03-25 14:51:26
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-03-25 20:36:08
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/pages/goodsSearch/index.vue
-->
<template>
  <view class="order">
    <navTitle title="确认订单"></navTitle>
  </view>
</template>

<script setup>
import Taro from '@tarojs/taro'
import { get } from '../../utils/request'
import { ref, reactive } from 'vue'
import childIcon from '../../components/Icon.vue'
import navTitle from 'src/components/navTitle.vue'
const goodsInfo = ref('')
goodsInfo.value = Taro.getStorageSync('goodsInfo')

</script>
<style lang="scss">
.order {
  background: #E50F86;
}
</style>

<!--
 * @Author: lizesheng
 * @Date: 2023-03-30 18:16:15
 * @LastEditors: lizesheng
 * @LastEditTime: 2023-04-28 18:21:37
 * @important: 重要提醒
 * @Description: 备注内容
 * @FilePath: /shop/src/components/navTitle.vue
-->
<template>
  <view class="title-container" :style="{ height: `${navHeight}px`, paddingTop: `${statusHeight}px`, color: color }">
    <child-icon @tap="handleBack" class="right_arrow" value="icon-youjiantou" :color="rightColor" size="19"></child-icon>
    <view v-if="title" class="title">{{ title }}</view>
  </view>
</template>
<script setup>
import childIcon from './Icon.vue'
import { defineProps } from 'vue';
import Taro from '@tarojs/taro'
import { ref } from 'vue'
const sysinfo = Taro.getSystemInfoSync()
const statusHeight = ref(sysinfo.statusBarHeight)
const isiOS = sysinfo.system.indexOf('iOS') > -1
const navHeight = ref(!isiOS ? 46 : 44)
const props = defineProps({
  color: {
    type: String,
    default: '#333',
  },
  rightColor: {
    type: String,
    default: '#333',
  },
  title: {
    type: String,
    default: '',
  },
});
const handleBack = () => {
  Taro.navigateBack()
}
</script>
<style lang="scss">
.title-container {
  display: flex;
  align-items: center;

  .title {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    position: relative;
    left: -20px;
  }

  .right_arrow {
    position: relative;
    z-index: 2;
    left: 20px;
    transform: rotate(180deg);
  }
}
</style>